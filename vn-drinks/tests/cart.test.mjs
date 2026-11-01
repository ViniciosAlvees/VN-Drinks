import test from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS, STORE } from '../dist/js/catalog.js';
import { sanitizeCart, getTotal, getCount, getWhatsAppURL, money } from '../dist/js/cart.js';

test('catálogo tem IDs únicos, categorias e preços válidos em centavos', () => {
  assert.equal(new Set(PRODUCTS.map(p => p.id)).size, PRODUCTS.length);
  for (const product of PRODUCTS) {
    assert.ok(Number.isInteger(product.price) && product.price > 0);
    assert.ok(product.name && product.description && product.images.length);
    assert.ok(['cervejas','combos','destilados','sem-alcool'].includes(product.category));
  }
  assert.equal(STORE.whatsapp, '5511960123119');
});

test('ignora produtos removidos e quantidades corrompidas do armazenamento', () => {
  assert.deepEqual(sanitizeCart(null), {});
  assert.deepEqual(sanitizeCart([]), {});
  assert.deepEqual(sanitizeCart({ heineken: -1, absolut: 1.5, removed: 5 }), {});
  assert.deepEqual(sanitizeCart({ heineken: 999, absolut: '2', 'red-bull': 0 }), { heineken: 99, absolut: 2 });
});

test('soma centavos sem arredondamento incorreto', () => {
  assert.equal(getTotal({ heineken: 3, 'red-bull': 2 }), 4995);
  assert.equal(getCount({ heineken: 3, 'red-bull': 2 }), 5);
  assert.match(money(4995), /49,95/);
  assert.equal(getTotal({}), 0);
});

test('não gera pedido vazio', () => {
  assert.equal(getWhatsAppURL({}), null);
  assert.equal(getWhatsAppURL({ removed: 2 }), null);
});

test('WhatsApp recebe produtos, quantidades e subtotal correto', () => {
  const url = new URL(getWhatsAppURL({ heineken: 2, 'jack-daniels': 1 }, {
    name: 'Cliente de teste', fulfillment: 'pickup', payment: 'Pix', notes: 'Retirada a combinar',
  }));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5511960123119');
  const message = url.searchParams.get('text');
  assert.match(message, /2x Heineken Long Neck/);
  assert.match(message, /1x Jack Daniel’s/);
  assert.match(message, /Subtotal dos produtos: R\$\s165,88/);
  assert.match(message, /Recebimento: Retirada/);
  assert.match(message, /Pagamento: Pix/);
  assert.match(message, /CATÁLOGO DE DEMONSTRAÇÃO/);
  assert.doesNotMatch(message, /Endereço:/);
});

test('entrega inclui endereço e preserva acentos, símbolos e observações', () => {
  const url = new URL(getWhatsAppURL({ absolut: 1 }, {
    fulfillment: 'delivery', address: 'Rua de teste, 123 — São Paulo', notes: 'Portão azul & campainha',
  }));
  const message = url.searchParams.get('text');
  assert.match(message, /Endereço: Rua de teste, 123 — São Paulo/);
  assert.match(message, /Portão azul & campainha/);
  assert.match(message, /taxa de entrega/);
});
