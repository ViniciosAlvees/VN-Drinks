import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../dist/js/catalog.js';
import { addCartItem, getTotal, getCount, getCartLines, getWhatsAppURL } from '../dist/js/cart.js';

test('as três novas long necks usam os valores informados e entram no pedido', () => {
  let cart = {};
  for (const [id,price] of [['heineken-zero',750],['corona',799],['corona-zero',750]]) {
    const product = PRODUCTS.find(item => item.id === id);
    assert.equal(product.price,price);
    assert.match(product.description,/330 ml/);
    cart = addCartItem(cart,id);
  }
  assert.equal(getTotal(cart),2299);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.match(message,/Heineken Zero Long Neck/);
  assert.match(message,/Corona Extra Long Neck/);
  assert.match(message,/Corona Zero Long Neck/);
});

test('os quatro novos combos escolhem quatro Red Bulls e usam os preços informados', () => {
  const expected = [
    ['red-label',10199,'combo-red-label',13099],
    ['white-horse',7999,'combo-white-horse',12399],
    ['rocks',3599,'combo-rocks',8799],
    ['eternity',2499,'combo-eternity',5999],
  ];
  let cart = {};
  for (const [bottleId,bottlePrice,comboId,comboPrice] of expected) {
    assert.equal(PRODUCTS.find(item => item.id === bottleId).price,bottlePrice);
    const combo = PRODUCTS.find(item => item.id === comboId);
    if (bottleId === 'white-horse') {
      assert.match(PRODUCTS.find(item => item.id === bottleId).description,/700 ml/);
      assert.match(combo.description,/White Horse 700 ml/);
    }
    assert.equal(combo.price,comboPrice);
    assert.equal(combo.redBullUnits,4);
    assert.throws(() => addCartItem(cart,comboId),/Escolha/);
    cart = addCartItem(cart,bottleId);
    cart = addCartItem(cart,comboId,{ tradicional:2, melancia:2 });
  }
  assert.equal(getTotal(cart),64592);
  assert.equal(getCount(cart),8);
  assert.equal(getCartLines(cart).filter(line => line.flavors).length,4);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.equal([...message.matchAll(/Red Bull por combo: 2x Tradicional · 2x Melancia/g)].length,4);
  assert.match(message,/Subtotal dos produtos: R\$\s645,92/);
});
