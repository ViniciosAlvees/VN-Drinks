import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/catalog.js';
import { addCartItem, setCartFlavors, makeCartKey, sanitizeCart, getCartLines, getTotal, getCount, getWhatsAppURL, hasPendingSelections } from '../src/cart.js';
const mixed = { tradicional: 1, melancia: 1, 'morango-pessego': 1, tropical: 1 };

test('Beefeater Tradicional e Pink avulsos têm 700 ml e custam R$ 104,99 cada', () => {
  let cart = {};
  for (const id of ['beefeater-tradicional', 'beefeater-pink']) {
    const product = PRODUCTS.find(item => item.id === id);
    assert.match(product.description, /700 ml/);
    assert.equal(product.price, 10499);
    cart = addCartItem(cart, id);
  }
  assert.equal(getTotal(cart), 20998);
  assert.equal(getCount(cart), 2);
  assert.ok(getWhatsAppURL(cart));
});

test('o combo permite as duas garrafas e quatro sabores pelo mesmo preço de R$ 159,99', () => {
  let cart = addCartItem({}, 'combo-beefeater', mixed, 'tradicional');
  cart = addCartItem(cart, 'combo-beefeater', mixed, 'pink');
  const lines = getCartLines(cart);
  assert.equal(lines.length, 2);
  assert.deepEqual(lines.map(line => line.bottle.id), ['tradicional','pink']);
  assert.equal(getTotal(cart), 31998);
  assert.equal(hasPendingSelections(cart), false);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.match(message, /Garrafa por combo: Beefeater Tradicional · 700 ml/);
  assert.match(message, /Garrafa por combo: Beefeater Pink · 700 ml/);
  assert.match(message, /Red Bull por combo: 1x Tradicional · 1x Melancia · 1x Morango e Pêssego · 1x Tropical/);
  assert.match(message, /R\$\s159,99 cada/);
});

test('não permite adicionar o combo sem garrafa válida ou sem as quatro latas', () => {
  assert.throws(() => addCartItem({}, 'combo-beefeater', mixed), /garrafa/);
  assert.throws(() => addCartItem({}, 'combo-beefeater', mixed, 'outra'), /garrafa/);
  assert.throws(() => addCartItem({}, 'combo-beefeater', { tropical: 3 }, 'pink'), /sabores/);
  assert.throws(() => addCartItem({}, 'combo-beefeater', { tropical: 5 }, 'tradicional'), /sabores/);
});

test('editar garrafa ou Red Bulls mantém quantidades e agrupa apenas escolhas iguais', () => {
  const traditionalKey = makeCartKey('combo-beefeater', mixed, 'tradicional');
  const pinkKey = makeCartKey('combo-beefeater', mixed, 'pink');
  let cart = { [traditionalKey]: 2, [pinkKey]: 1 };
  cart = setCartFlavors(cart, traditionalKey, mixed, 'pink');
  assert.deepEqual(cart, { [pinkKey]: 3 });
  assert.equal(getTotal(cart), 47997);
  cart = setCartFlavors(cart, pinkKey, { tropical: 4 }); // Mantém a garrafa quando só os sabores mudam.
  const [line] = getCartLines(cart);
  assert.equal(line.bottle.id, 'pink');
  assert.deepEqual(line.flavors, { tropical: 4 });
  assert.equal(line.quantity, 3);
  assert.throws(() => setCartFlavors({ [traditionalKey]: 99, [pinkKey]: 1 }, pinkKey, mixed, 'tradicional'), /limite/);
});

test('a restauração mantém a garrafa escolhida e rejeita opções adulteradas', () => {
  const key = makeCartKey('combo-beefeater', { melancia: 2, tropical: 2 }, 'pink');
  const cart = { [key]: 2 };
  assert.deepEqual(sanitizeCart(JSON.parse(JSON.stringify(cart))), cart);
  assert.equal(getCartLines(cart)[0].bottle.image, 'beefeater-pink.png');
  assert.deepEqual(sanitizeCart({ 'combo-beefeater::tropical=4': 1, 'combo-beefeater::tropical=4::outra': 1, 'combo-gin::tropical=4::pink': 1 }), {});
});

test('um combo ainda sem opções precisa escolher a garrafa e os sabores para enviar', () => {
  const cart = { 'combo-beefeater': 2 };
  assert.equal(getCount(cart), 2);
  assert.equal(hasPendingSelections(cart), true);
  assert.equal(getWhatsAppURL(cart), null);
  const ready = setCartFlavors(cart, 'combo-beefeater', { tradicional: 4 }, 'tradicional');
  assert.equal(getCount(ready), 2);
  assert.equal(getTotal(ready), 31998);
  assert.ok(getWhatsAppURL(ready));
});
