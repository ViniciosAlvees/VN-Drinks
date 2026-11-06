import test from 'node:test';
import assert from 'node:assert/strict';
import { BALY_FLAVORS, PRODUCTS } from '../src/catalog.js';
import { addCartItem, getCartLines, getTotal, getWhatsAppURL, hasPendingSelections, makeCartKey, sanitizeCart, setCartFlavors } from '../src/cart.js';

test('Baly exige uma garrafa de um dos quatro sabores e inclui cinco gelos por R$ 59,99', () => {
  const product = PRODUCTS.find(item => item.id === 'combo-eternity');
  assert.equal(product.price, 5999);
  assert.equal(product.iceUnits, 5);
  assert.equal(product.redBullUnits, undefined);
  assert.deepEqual(BALY_FLAVORS.map(flavor => flavor.name), ['Morango e Pêssego', 'Melancia', 'Tropical', 'Maçã Verde']);
  assert.throws(() => addCartItem({}, product.id), /sabor.*Baly/);
  for (const selection of [{ tradicional: 1 }, { tropical: 2 }, { tropical: 1, melancia: 1 }, { 'maca-verde': -1 }]) {
    assert.throws(() => addCartItem({}, product.id, selection), /sabor.*Baly/);
  }
  let cart = {};
  for (const flavor of BALY_FLAVORS) cart = addCartItem(cart, product.id, { [flavor.id]: 1 });
  assert.equal(getCartLines(cart).length, 4);
  assert.equal(getTotal(cart), 23996);
  assert.deepEqual(sanitizeCart(JSON.parse(JSON.stringify(cart))), cart);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  for (const flavor of BALY_FLAVORS) assert.ok(message.includes(`Baly por combo: 1x ${flavor.name}`));
  assert.doesNotMatch(message, /Red Bull/);
  assert.equal([...message.matchAll(/Gelos por combo: 5/g)].length, 4);
});

test('editar Baly preserva quantidades e exige escolha antes do envio', () => {
  const pending = { 'combo-eternity': 2 };
  assert.equal(hasPendingSelections(pending), true);
  assert.equal(getWhatsAppURL(pending), null);
  const selected = setCartFlavors(pending, 'combo-eternity', { 'maca-verde': 1 });
  const key = makeCartKey('combo-eternity', { 'maca-verde': 1 });
  const edited = setCartFlavors(selected, key, { melancia: 1 });
  assert.equal(getCartLines(edited)[0].quantity, 2);
  assert.equal(getTotal(edited), 11998);
  assert.match(new URL(getWhatsAppURL(edited)).searchParams.get('text'), /Baly por combo: 1x Melancia/);
});

test('novo Eternity com Red Bull custa R$ 69,99 e mantém seleção das cinco latas', () => {
  const id = 'combo-eternity-red-bull';
  assert.throws(() => addCartItem({}, id), /Escolha/);
  assert.throws(() => addCartItem({}, id, { 'maca-verde': 5 }), /Escolha/);
  const cart = addCartItem({}, id, { tradicional: 3, tropical: 2 });
  assert.equal(getTotal(cart), 6999);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.match(message, /Combo Eternity com Red Bull/);
  assert.match(message, /Red Bull por combo: 3x Tradicional · 2x Tropical/);
  assert.match(message, /Gelos por combo: 5/);
  assert.match(message, /R\$\s69,99/);
});

test('carrinhos salvos com Red Bull continuam na versão com Red Bull', () => {
  const cart = sanitizeCart({ 'combo-eternity::tradicional=3,melancia=2': 2 });
  assert.equal(getCartLines(cart)[0].product.id, 'combo-eternity-red-bull');
  assert.equal(getCartLines(cart)[0].quantity, 2);
  assert.equal(getTotal(cart), 13998);
  const legacy = sanitizeCart({ 'combo-eternity::tradicional=1,melancia=1,morango-pessego=1,tropical=1': 1 });
  assert.equal(getCartLines(legacy)[0].product.id, 'combo-eternity-red-bull');
  assert.equal(hasPendingSelections(legacy), true);
});
