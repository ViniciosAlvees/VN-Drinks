/** Interface: catálogo, filtros, carrinho persistente e link do WhatsApp. */
import { STORE, CATEGORIES, PRODUCTS, RED_BULL_FLAVORS } from './catalog.js?v=0b5b281fabff';
import { CART_KEY, MAX_QUANTITY, sanitizeCart, getCartLines, getTotal, getCount, money, getWhatsAppURL, hasPendingSelections, getFlavorSummary, makeCartKey, addCartItem, setCartFlavors } from './cart.js?v=0b5b281fabff';
import { initFlavorPicker } from './flavor-picker.js?v=0b5b281fabff';
import { icon, escapeHTML, imageURL } from './ui.js?v=0b5b281fabff';

const $ = selector => document.querySelector(selector);
let cart = {};
try { cart = sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY))); } catch { /* Continua funcionando com armazenamento indisponível. */ }
let category = 'all';
let toastTimeout;
const feedbackTimers = new WeakMap();
const dialog = $('#cart-dialog');
const orderForm = $('#order-form');
const flavorPicker = initFlavorPicker({
  onConfirm({ product, flavors, bottleId, editKey }) {
    cart = editKey ? setCartFlavors(cart, editKey, flavors, bottleId) : addCartItem(cart, product.id, flavors, bottleId);
    saveCart();
    return makeCartKey(product.id, flavors, bottleId);
  },
  onOpenChange: syncScrollLock,
  onSaved({ product, key }) {
    if (dialog.open) document.querySelector(`[data-edit-flavors="${key}"]`)?.focus({ preventScroll: true });
    else { notify('Boa escolha! Adicionado ao carrinho.'); flashAdded(product); }
  },
});

function syncScrollLock() {
  document.body.classList.toggle('dialog-open', dialog.open || $('#flavor-dialog').open);
}

function flashAdded(product) {
  const button = document.querySelector(`[data-add="${product.id}"]`);
  if (!button) return;
  clearTimeout(feedbackTimers.get(button));
  button.classList.add('just-added');
  button.innerHTML = `${icon('check')}<span>Adicionado</span>`;
  feedbackTimers.set(button, setTimeout(() => {
    button.classList.remove('just-added');
    button.innerHTML = `${icon(product.redBullUnits ? 'chevron' : 'plus')}<span>${product.redBullUnits ? 'Selecionar' : 'Adicionar'}</span>`;
  }, 1400));
}

function renderCategories() {
  $('#categories').innerHTML = CATEGORIES.map(item => `<button class="category-tab" data-category="${item.id}" aria-pressed="${category === item.id}">${icon(item.icon)}${escapeHTML(item.name)}</button>`).join('');
}

function renderProducts() {
  const query = $('#product-search').value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const products = PRODUCTS.filter(product => {
    const flavors = product.redBullUnits ? RED_BULL_FLAVORS.map(flavor => flavor.name).join(' ') : '';
    const bottles = (product.bottleOptions || []).map(bottle => bottle.name).join(' ');
    const text = `${product.name} ${product.description} ${flavors} ${bottles}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const inCategory = category === 'all' || product.category === category || (category === 'sem-alcool' && product.alcoholFree);
    return inCategory && text.includes(query);
  });
  const sort = $('#product-sort').value;
  if (sort === 'price-asc') products.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') products.sort((a,b) => b.price - a.price);
  if (sort === 'name') products.sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));
  if (sort === 'default') products.sort((a,b) => Number(b.featured) - Number(a.featured));
  $('#results-count').textContent = `${products.length} ${products.length === 1 ? 'bebida ou combo' : 'bebidas e combos'} para o seu rolê`;
  $('#empty-results').hidden = products.length > 0;
  $('#product-grid').innerHTML = products.map(renderProductCard).join('');
}

function renderProductCard(product, index) {
  const configurable = !!product.redBullUnits;
  const hint = product.bottleOptions?.length ? 'Escolha o gin e os sabores dos Red Bulls' : `${RED_BULL_FLAVORS.length} sabores à sua escolha`;
  const price = `<small>R$</small>${money(product.price).replace(/^R\$\s*/, '')}`;
  const action = `<button class="add-button" data-add="${product.id}" aria-label="${configurable ? (product.bottleOptions?.length ? 'Selecionar opções de' : 'Selecionar sabores de') : 'Adicionar'} ${escapeHTML(product.name)}${configurable ? '' : ' ao carrinho'}" ${configurable ? 'aria-haspopup="dialog" aria-controls="flavor-dialog"' : ''}>${icon(configurable ? 'chevron' : 'plus')}<span>${configurable ? 'Selecionar' : 'Adicionar'}</span></button>`;
  return `<article class="product-card" style="animation-delay:${Math.min(index,7)*35}ms">
    <div class="product-photo tone-${product.tone} ${product.images.length > 1 ? 'multiple' : ''}">
      <span class="product-badge">${escapeHTML(product.badge)}</span>
      ${product.images.map((filename,i) => `<img src="${imageURL(filename)}" alt="${i === 0 ? escapeHTML(product.name) : ''}" width="400" height="400" loading="lazy">`).join('')}
      <span class="photo-caption">IMAGEM ILUSTRATIVA</span>
    </div>
    <div class="product-info"><h3>${escapeHTML(product.name)}</h3>
      <p class="product-description">${escapeHTML(product.description)}${configurable ? `<span class="product-flavor-hint">${hint}</span>` : ''}</p>
      <div class="product-bottom"><span class="product-price">${price}</span>${action}</div>
    </div>
  </article>`;
}

function saveCart() {
  cart = sanitizeCart(cart);
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Carrinho permanece disponível nesta aba. */ }
  renderCart();
}

function renderCart() {
  const count = getCount(cart);
  const lines = getCartLines(cart);
  const total = money(getTotal(cart));
  document.querySelectorAll('[data-cart-count]').forEach(element => { element.textContent = count; });
  $('.cart-trigger').setAttribute('aria-label', `Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`);
  $('#cart-empty').hidden = count > 0;
  $('#cart-content').hidden = count === 0;
  $('#cart-summary').hidden = count === 0;
  $('#mobile-cart').hidden = count === 0;
  document.body.classList.toggle('has-cart', count > 0);
  $('#cart-total').textContent = total;
  $('#mobile-total').textContent = total;
  $('#cart-items').innerHTML = lines.map(renderCartItem).join('');
  updateCheckout();
}

function renderCartItem({ key, product, quantity, subtotal, flavors, bottle, needsFlavors, needsBottle }) {
  const safeKey = escapeHTML(key);
  const summary = getFlavorSummary(flavors);
  const name = escapeHTML([product.name, bottle?.name, summary].filter(Boolean).join(', '));
  const pending = needsFlavors || needsBottle;
  const choiceLabel = product.bottleOptions?.length ? 'opções' : 'sabores';
  return `<article class="cart-item">
    <img class="cart-item-photo" src="${imageURL(bottle?.image || product.images[0])}" alt="${escapeHTML(bottle?.name || product.name)}" width="74" height="82">
    <div><h3>${escapeHTML(product.name)}</h3><p class="cart-item-price">${money(product.price)} por ${product.category === 'combos' ? 'combo' : 'item'}</p>
      ${bottle ? `<p class="cart-bottle">${escapeHTML(bottle.name)} · ${escapeHTML(bottle.volume)}</p>` : ''}
      ${product.redBullUnits ? `<p class="cart-flavors ${pending ? 'pending' : ''}">${pending ? 'Complete as opções para finalizar.' : `${product.redBullUnits > 1 ? 'Red Bull por combo: ' : ''}${escapeHTML(summary)}`}</p><button class="edit-flavors" data-edit-flavors="${safeKey}" aria-label="${pending ? 'Escolher' : 'Alterar'} ${choiceLabel} de ${name}">${pending ? 'Escolher' : 'Alterar'} ${choiceLabel}</button>` : ''}
      <div class="quantity-control"><button data-decrease="${safeKey}" aria-label="Diminuir quantidade de ${name}">${icon('minus')}</button><span aria-label="Quantidade">${quantity}</span><button data-increase="${safeKey}" ${quantity >= MAX_QUANTITY ? 'disabled' : ''} aria-label="Aumentar quantidade de ${name}">${icon('plus')}</button></div>
    </div><div class="cart-item-aside"><strong>${money(subtotal)}</strong><button class="remove-item" data-remove="${safeKey}" aria-label="Remover ${name}">Remover</button></div>
  </article>`;
}

function updateCheckout() {
  const details = Object.fromEntries(new FormData(orderForm));
  const delivery = details.fulfillment === 'delivery';
  $('#address-field').hidden = !delivery;
  orderForm.elements.address.required = delivery;
  $('#shipping-note').textContent = delivery ? 'Taxa e área de entrega a confirmar pelo WhatsApp. Frete não incluso.' : 'Retirada e disponibilidade a combinar pelo WhatsApp.';
  const link = getWhatsAppURL(cart, details);
  const pending = hasPendingSelections(cart);
  $('#cart-flavor-warning').hidden = !pending;
  $('#checkout').setAttribute('aria-disabled', String(!link));
  $('#checkout').classList.toggle('is-disabled', !link);
  if (link) $('#checkout').href = link;
  else $('#checkout').removeAttribute('href');
}

function notify(message) {
  clearTimeout(toastTimeout);
  $('#toast-text').textContent = message;
  $('#toast').classList.add('visible');
  toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
}

function openCart() {
  if (!dialog.open) dialog.showModal();
  syncScrollLock();
  $('#toast').classList.remove('visible');
}

function closeCart() { dialog.close(); }

document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]');
  if (add) {
    const product = PRODUCTS.find(item => item.id === add.dataset.add);
    if (product?.redBullUnits) { $('#toast').classList.remove('visible'); flavorPicker.open(product); }
    else if (product) {
      try { cart = addCartItem(cart, product.id); saveCart(); notify('Boa escolha! Adicionado ao carrinho.'); flashAdded(product); }
      catch (error) { notify(error.message); }
    }
  }
  const edit = event.target.closest('[data-edit-flavors]');
  if (edit) {
    const line = getCartLines(cart).find(item => item.key === edit.dataset.editFlavors);
    if (line) flavorPicker.open(line.product, line);
  }
  if (event.target.closest('[data-open-cart]')) openCart();
  const filter = event.target.closest('[data-category]');
  if (filter) { category = filter.dataset.category; renderCategories(); renderProducts(); }
  const quantityButton = event.target.closest('[data-increase], [data-decrease], [data-remove]');
  if (quantityButton) {
    const { increase, decrease, remove } = quantityButton.dataset;
    const id = increase || decrease || remove;
    if (remove) delete cart[id];
    else cart[id] = Math.max(0, Math.min(MAX_QUANTITY, (cart[id] || 0) + (increase ? 1 : -1)));
    saveCart();
    // A atualização do HTML não deve fazer o teclado perder o foco.
    const action = increase ? 'increase' : decrease ? 'decrease' : 'remove';
    const nextFocus = document.querySelector(`[data-${action}="${id}"]:not(:disabled)`) || $('#cart-items button') || $('#continue-shopping');
    nextFocus?.focus({ preventScroll: true });
  }
});

$('#product-search').addEventListener('input', renderProducts);
$('#product-sort').addEventListener('change', renderProducts);
$('#reset-search').addEventListener('click', () => { category = 'all'; $('#product-search').value = ''; renderCategories(); renderProducts(); });
$('#see-combos').addEventListener('click', () => { category = 'combos'; $('#product-search').value = ''; renderCategories(); renderProducts(); });
$('#close-cart').addEventListener('click', closeCart);
$('#continue-shopping').addEventListener('click', () => { closeCart(); $('#catalogo').scrollIntoView({ behavior: 'smooth' }); });
dialog.addEventListener('close', syncScrollLock);
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left) closeCart(); } });
orderForm.addEventListener('input', updateCheckout);
orderForm.addEventListener('change', updateCheckout);
orderForm.addEventListener('submit', event => event.preventDefault());
$('#checkout').addEventListener('click', event => {
  if (hasPendingSelections(cart)) {
    event.preventDefault();
    const pending = getCartLines(cart).find(line => line.needsFlavors || line.needsBottle);
    document.querySelector(`[data-edit-flavors="${pending.key}"]`)?.focus();
    return;
  }
  if (!getCount(cart) || !orderForm.reportValidity()) { event.preventDefault(); return; }
  updateCheckout(); // O link abre uma mensagem pronta. O visitante decide quando enviar.
});
$('#menu-toggle').addEventListener('click', () => {
  const open = $('#menu-toggle').getAttribute('aria-expanded') !== 'true';
  $('#menu-toggle').setAttribute('aria-expanded', String(open));
  $('#menu-toggle').setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  $('#main-nav').classList.toggle('open', open);
});
$('#main-nav').addEventListener('click', event => { if (event.target.closest('a')) { $('#main-nav').classList.remove('open'); $('#menu-toggle').setAttribute('aria-expanded', 'false'); $('#menu-toggle').setAttribute('aria-label', 'Abrir menu'); } });
// Sincroniza o carrinho se ele mudar em outra aba do site.
window.addEventListener('storage', event => { if (event.key === CART_KEY) { try { cart = sanitizeCart(JSON.parse(event.newValue)); } catch { cart = {}; } renderCart(); } });
$('#demo-notice').hidden = !STORE.demoMode;
$('#cart-demo').hidden = !STORE.demoMode;
// O número é definido em catalog.js; o HTML mantém links de fallback sem JavaScript.
document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
  const query = new URL(link.href).search;
  link.href = `https://wa.me/${STORE.whatsapp}${query}`;
});
$('#current-year').textContent = new Date().getFullYear();
renderCategories(); renderProducts(); renderCart();
