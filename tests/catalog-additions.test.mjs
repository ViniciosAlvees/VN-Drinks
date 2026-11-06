import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../src/catalog.js';
import { addCartItem, getTotal, getCount, getCartLines, getWhatsAppURL } from '../src/cart.js';

test('as três novas long necks usam os valores informados e entram no pedido', () => {
  let cart = {};
  for (const [id,price] of [['heineken-zero',750],['corona',900],['corona-zero',750]]) {
    const product = PRODUCTS.find(item => item.id === id);
    assert.equal(product.price,price);
    assert.match(product.description,/330 ml/);
    cart = addCartItem(cart,id);
  }
  assert.equal(getTotal(cart),2400);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.match(message,/Heineken Zero Long Neck/);
  assert.match(message,/Corona Extra Long Neck/);
  assert.match(message,/Corona Zero Long Neck/);
});

test('os quatro novos combos escolhem cinco Red Bulls, incluem cinco gelos e usam os preços informados', () => {
  const expected = [
    ['red-label',10199,'combo-red-label',13099],
    ['white-horse',7999,'combo-white-horse',12399],
    ['rocks',3599,'combo-rocks',8799],
    ['eternity',2499,'combo-eternity-red-bull',6999],
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
    assert.equal(combo.redBullUnits,5);
    assert.equal(combo.iceUnits,5);
    assert.match(combo.description,/5 Red Bull 250 ml \+ 5 gelos/);
    assert.throws(() => addCartItem(cart,comboId),/Escolha/);
    cart = addCartItem(cart,bottleId);
    cart = addCartItem(cart,comboId,{ tradicional:3, melancia:2 });
  }
  assert.equal(getTotal(cart),65592);
  assert.equal(getCount(cart),8);
  assert.equal(getCartLines(cart).filter(line => line.flavors).length,4);
  const message = new URL(getWhatsAppURL(cart)).searchParams.get('text');
  assert.equal([...message.matchAll(/Red Bull por combo: 3x Tradicional · 2x Melancia/g)].length,4);
  assert.equal([...message.matchAll(/Gelos por combo: 5/g)].length,4);
  assert.match(message,/Subtotal dos produtos: R\$\s655,92/);
});
