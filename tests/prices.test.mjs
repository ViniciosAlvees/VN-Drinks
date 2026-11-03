import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/catalog.js';
import { addCartItem, getTotal, getWhatsAppURL } from '../src/cart.js';

test('preços atualizados aparecem no catálogo, no subtotal e na mensagem do pedido', () => {
  let cart = {};
  for (const [id, price] of [['heineken', 850], ['corona', 900], ['heineken-six', 5000]]) {
    assert.equal(PRODUCTS.find(product => product.id === id).price, price);
    cart = addCartItem(cart, id);
  }
  assert.equal(getTotal(cart), 6750);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.match(message, /Heineken Long Neck \(R\$\s8,50 cada\)/);
  assert.match(message, /Corona Extra Long Neck \(R\$\s9,00 cada\)/);
  assert.match(message, /Heineken · Leva 6 \(R\$\s50,00 cada\)/);
  assert.match(message, /Subtotal dos produtos: R\$\s67,50/);
});

test('duas promoções representam dois packs de seis e custam R$ 100,00', () => {
  const cart = addCartItem(addCartItem({}, 'heineken-six'), 'heineken-six');
  assert.equal(getTotal(cart), 10000);
  assert.match(new URL(getWhatsAppURL(cart)).searchParams.get('text'), /2x Heineken · Leva 6/);
});
