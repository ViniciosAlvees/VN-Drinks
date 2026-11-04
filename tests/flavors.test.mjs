import test from 'node:test';
import assert from 'node:assert/strict';
import { RED_BULL_FLAVORS } from '../src/catalog.js';
import { addCartItem, setCartFlavors, makeCartKey, sanitizeCart, getCartLines, getTotal, getCount, getWhatsAppURL, hasPendingFlavors } from '../src/cart.js';

test('avulsos dos quatro sabores ficam separados, custando R$ 12,99 cada', () => {
  let cart = {};
  assert.deepEqual(RED_BULL_FLAVORS.map(flavor => flavor.name), ['Tradicional', 'Melancia', 'Morango e Pêssego', 'Tropical']);
  for (const flavor of RED_BULL_FLAVORS) cart = addCartItem(cart, 'red-bull', { [flavor.id]: 1 });
  assert.equal(getCartLines(cart).length, 4);
  assert.equal(getTotal(cart), 5196);
  assert.equal(getCount(cart), 4);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  for (const flavor of RED_BULL_FLAVORS) assert.ok(message.includes(`1x ${flavor.name}`));
});

test('combo misto exige cinco latas e mantém o preço confirmado de R$ 198,99', () => {
  const mixed = { tradicional: 2, melancia: 1, 'morango-pessego': 1, tropical: 1 };
  const cart = addCartItem(addCartItem({}, 'combo-whisky', mixed), 'combo-whisky', { tropical: 1, 'morango-pessego': 1, melancia: 1, tradicional: 2 });
  const [line] = getCartLines(cart);
  assert.equal(getCartLines(cart).length, 1);
  assert.equal(line.quantity, 2);
  assert.equal(line.subtotal, 39798);
  assert.equal(getCount(cart), 2); // Duas unidades do combo, cada uma contendo cinco latas.
  assert.deepEqual(line.flavors, mixed);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.match(message, /2x Combo Esquenta/);
  assert.match(message, /Red Bull por combo: 2x Tradicional · 1x Melancia · 1x Morango e Pêssego · 1x Tropical/);
  assert.match(message, /Gelos por combo: 5/);
  assert.match(message, /Subtotal dos produtos: R\$\s397,98/);
});

test('combos com escolhas diferentes ficam em linhas distintas sem alterar o preço', () => {
  let cart = addCartItem({}, 'combo-gin', { melancia: 5 });
  cart = addCartItem(cart, 'combo-gin', { tropical: 3, 'morango-pessego': 2 });
  assert.equal(getCartLines(cart).length, 2);
  assert.equal(getTotal(cart), 31998);
  assert.equal(hasPendingFlavors(cart), false);
});

test('não aceita escolhas incompletas, excedentes, negativas ou sabores desconhecidos', () => {
  for (const choices of [{}, { melancia: 3 }, { tropical: 6 }, { tropical: 5, melancia: -1 }, { desconhecido: 5 }, { melancia: 2.5, tropical: 1.5 }]) {
    assert.throws(() => addCartItem({}, 'combo-gin', choices), /Escolha/);
  }
  assert.throws(() => addCartItem({}, 'red-bull'), /Escolha/);
  assert.throws(() => addCartItem({}, 'red-bull', { tradicional: 1, tropical: 1 }), /Escolha/);
});

test('restaura as escolhas do navegador, normaliza a ordem e rejeita dados inválidos', () => {
  const key = makeCartKey('combo-gin', { melancia: 3, tropical: 2 });
  const cart = { [key]: 2, 'red-bull::tradicional=1': 3 };
  assert.deepEqual(sanitizeCart(JSON.parse(JSON.stringify(cart))), cart);
  assert.deepEqual(sanitizeCart({ 'combo-gin::tropical=2,melancia=3': 1, [key]: 2 }), { [key]: 3 });
  assert.deepEqual(sanitizeCart({ 'combo-gin::tropical=3': 1, 'red-bull::tropical=1,tropical=0': 1, 'red-bull::tradicional=1,__proto__=0': 1, 'heineken::melancia=1': 1 }), {});
});

test('editar sabores mantém as quantidades e reúne as escolhas iguais', () => {
  const original = { 'red-bull::melancia=1': 2, 'red-bull::tradicional=1': 1 };
  const cart = setCartFlavors(original, 'red-bull::melancia=1', { tradicional: 1 });
  assert.deepEqual(cart, { 'red-bull::tradicional=1': 3 });
  assert.equal(getTotal(cart), 3897);
  assert.deepEqual(original, { 'red-bull::melancia=1': 2, 'red-bull::tradicional=1': 1 });
  assert.throws(() => setCartFlavors({ 'red-bull::tradicional=1': 99, 'red-bull::melancia=1': 1 }, 'red-bull::melancia=1', { tradicional: 1 }), /limite/);
});

test('carrinhos antigos preservam os itens e precisam selecionar sabores antes de enviar', () => {
  let cart = sanitizeCart({ 'red-bull': 2, 'combo-gin': 1, heineken: 1 });
  assert.equal(getCount(cart), 4);
  assert.equal(getTotal(cart), 19447);
  assert.equal(hasPendingFlavors(cart), true);
  assert.equal(getWhatsAppURL(cart), null);
  cart = setCartFlavors(cart, 'red-bull', { tradicional: 1 });
  assert.equal(getWhatsAppURL(cart), null); // O combo ainda não teve seus sabores escolhidos.
  cart = setCartFlavors(cart, 'combo-gin', { melancia: 3, tropical: 2 });
  assert.equal(hasPendingFlavors(cart), false);
  assert.equal(getCount(cart), 4);
  assert.equal(getTotal(cart), 19447);
  assert.ok(getWhatsAppURL(cart));
});

test('combos salvos com quatro latas continuam no carrinho até escolher cinco', () => {
  const oldKey = 'combo-gin::tradicional=2,melancia=2';
  const cart = sanitizeCart({ [oldKey]: 2 });
  assert.deepEqual(cart, { [oldKey]: 2 });
  assert.equal(hasPendingFlavors(cart), true);
  assert.equal(getWhatsAppURL(cart), null);
  const updated = setCartFlavors(cart, oldKey, { tradicional: 3, melancia: 2 });
  assert.equal(getCount(updated), 2);
  assert.ok(getWhatsAppURL(updated));
});
