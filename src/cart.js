/** Regras do carrinho, sem dependência da interface. Valores sempre em centavos. */
import { PRODUCTS, STORE, RED_BULL_FLAVORS } from './catalog.js';
export const CART_KEY = 'vn-drinks:cart:v1';
export const MAX_QUANTITY = 99;
const productsById = new Map(PRODUCTS.map(product => [product.id, product]));
const flavorIds = new Set(RED_BULL_FLAVORS.map(flavor => flavor.id));

/** Exige uma escolha por lata, permitindo misturar os sabores do combo. */
function normalizeFlavors(product, selection) {
  if (!product.redBullUnits || !selection || typeof selection !== 'object' || Array.isArray(selection)) return null;
  if (Object.keys(selection).some(id => !flavorIds.has(id))) return null;
  const result = {};
  let count = 0;
  for (const flavor of RED_BULL_FLAVORS) {
    const quantity = selection[flavor.id] ?? 0;
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > product.redBullUnits) return null;
    if (quantity) result[flavor.id] = quantity;
    count += quantity;
  }
  return count === product.redBullUnits ? result : null;
}

/** A mesma combinação gera a mesma chave, independentemente da ordem escolhida. */
export function makeCartKey(productId, flavors, bottleId) {
  const product = productsById.get(productId);
  if (!product) throw new Error('Produto não encontrado.');
  if (!Number.isInteger(product.price) || product.price <= 0) throw new Error('Consulte o preço deste produto pelo WhatsApp.');
  const bottle = product.bottleOptions?.find(option => option.id === bottleId);
  if (product.bottleOptions?.length && !bottle) throw new Error('Escolha a garrafa do combo.');
  if (!product.bottleOptions?.length && bottleId) throw new Error('Este produto não permite escolher a garrafa.');
  if (!product.redBullUnits) return product.id;
  const normalized = normalizeFlavors(product, flavors);
  if (!normalized) throw new Error(`Escolha ${product.redBullUnits === 1 ? 'o sabor da lata' : `os sabores das ${product.redBullUnits} latas`} de Red Bull.`);
  const choices = Object.entries(normalized).map(([id,quantity]) => `${id}=${quantity}`).join(',');
  return `${product.id}::${choices}${bottle ? `::${bottle.id}` : ''}`;
}

function readCartKey(key) {
  const parts = key.split('::');
  if (parts.length > 3) return null;
  const product = productsById.get(parts[0]);
  if (!product) return null;
  if (!Number.isInteger(product.price) || product.price <= 0) return null;
  // Carrinhos antigos ficam visíveis e exigem a escolha de sabores antes do pedido.
  if (parts.length === 1) return { key: product.id, product, flavors: null, bottle: null, needsFlavors: !!product.redBullUnits, needsBottle: !!product.bottleOptions?.length };
  if (!product.redBullUnits || !parts[1]) return null;
  const bottle = product.bottleOptions?.find(option => option.id === parts[2]);
  if ((product.bottleOptions?.length && !bottle) || (parts.length === 3 && !bottle)) return null;
  const flavors = {};
  for (const choice of parts[1].split(',')) {
    const pair = choice.split('=');
    if (pair.length !== 2 || !flavorIds.has(pair[0]) || !/^\d+$/.test(pair[1]) || Object.hasOwn(flavors, pair[0])) return null;
    flavors[pair[0]] = Number(pair[1]);
  }
  const normalized = normalizeFlavors(product, flavors);
  return normalized ? { key: makeCartKey(product.id, normalized, bottle?.id), product, flavors: normalized, bottle: bottle || null, needsFlavors: false, needsBottle: false } : null;
}

export function sanitizeCart(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result = {};
  for (const [key,rawQuantity] of Object.entries(value)) {
    const line = readCartKey(key);
    const quantity = Number(rawQuantity);
    if (!line || !Number.isInteger(quantity) || quantity <= 0) continue;
    result[line.key] = Math.min((result[line.key] || 0) + quantity, MAX_QUANTITY);
  }
  return result;
}

export function getCartLines(cart) {
  return Object.entries(sanitizeCart(cart)).map(([key,quantity]) => {
    const line = readCartKey(key);
    return { ...line, quantity, subtotal: line.product.price * quantity };
  });
}

export const getTotal = cart => getCartLines(cart).reduce((sum, line) => sum + line.subtotal, 0);
export const getCount = cart => getCartLines(cart).reduce((sum, line) => sum + line.quantity, 0);
export const hasPendingFlavors = cart => getCartLines(cart).some(line => line.needsFlavors);
export const hasPendingSelections = cart => getCartLines(cart).some(line => line.needsFlavors || line.needsBottle);
export const money = cents => new Intl.NumberFormat(STORE.locale, {
  style: 'currency', currency: STORE.currency,
}).format(cents / 100);

export function getFlavorSummary(flavors) {
  return RED_BULL_FLAVORS.filter(flavor => flavors?.[flavor.id] > 0)
    .map(flavor => `${flavors[flavor.id]}x ${flavor.name}`).join(' · ');
}

export function addCartItem(cart, productId, flavors, bottleId) {
  const next = sanitizeCart(cart);
  const key = makeCartKey(productId, flavors, bottleId);
  if ((next[key] || 0) >= MAX_QUANTITY) throw new Error('Limite de 99 unidades por seleção.');
  next[key] = (next[key] || 0) + 1;
  return next;
}

/** Edita sabores e garrafa, mantendo a quantidade e reunindo combinações iguais. */
export function setCartFlavors(cart, oldKey, flavors, bottleId) {
  const next = sanitizeCart(cart);
  const line = readCartKey(oldKey);
  if (!line || !next[line.key]) throw new Error('Este item não está mais no carrinho.');
  const newKey = makeCartKey(line.product.id, flavors, bottleId ?? line.bottle?.id);
  if (newKey === line.key) return next;
  const quantity = next[line.key];
  if ((next[newKey] || 0) + quantity > MAX_QUANTITY) throw new Error('Essa escolha ultrapassa o limite de 99 unidades por seleção.');
  delete next[line.key];
  next[newKey] = (next[newKey] || 0) + quantity;
  return next;
}

export function getWhatsAppURL(cart, details = {}) {
  const lines = getCartLines(cart);
  if (!lines.length || lines.some(line => line.needsFlavors || line.needsBottle)) return null;
  const delivery = details.fulfillment === 'delivery';
  const message = [
    `Olá, ${STORE.name}! 🍻 Quero fazer este pedido:`,
    ...(STORE.demoMode ? ['⚠️ CATÁLOGO DE DEMONSTRAÇÃO — confirmar produtos e valores.'] : []),
    '',
    ...lines.flatMap(({ product, quantity, subtotal, flavors, bottle }) => [
      `${quantity}x ${product.name} (${money(product.price)} cada) — ${money(subtotal)}`,
      ...(bottle ? [`  Garrafa por combo: ${bottle.name} · ${bottle.volume}`] : []),
      ...(flavors ? [`  Red Bull ${product.redBullUnits > 1 ? 'por combo' : 'selecionado'}: ${getFlavorSummary(flavors)}`] : []),
    ]),
    '',
    `Subtotal dos produtos: ${money(getTotal(cart))}`,
    `Recebimento: ${delivery ? 'Entrega' : 'Retirada'}`,
    ...(details.name?.trim() ? [`Nome: ${details.name.trim()}`] : []),
    ...(delivery && details.address?.trim() ? [`Endereço: ${details.address.trim()}`] : []),
    ...(details.payment ? [`Pagamento: ${details.payment}`] : []),
    ...(details.notes?.trim() ? [`Observações: ${details.notes.trim()}`] : []),
    '',
    'Pode confirmar a disponibilidade e o valor final' + (delivery ? ' com a taxa de entrega?' : '?'),
  ].join('\n');
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}
