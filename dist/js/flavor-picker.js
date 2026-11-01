/** Escolhas do produto: garrafa do combo e sabores das latas de Red Bull. */
import { RED_BULL_FLAVORS } from './catalog.js?v=0b5b281fabff';
import { money } from './cart.js?v=0b5b281fabff';
import { icon, escapeHTML, imageURL, renderBottleChoices } from './ui.js?v=0b5b281fabff';

export function initFlavorPicker({ onConfirm, onOpenChange, onSaved }) {
  const dialog = document.querySelector('#flavor-dialog');
  const form = document.querySelector('#flavor-form');
  const options = document.querySelector('#flavor-options');
  const bottleOptions = document.querySelector('#bottle-options');
  let selection = null;
  const selectedCount = () => Object.values(selection.flavors).reduce((sum,count) => sum + count, 0);

  function update() {
    const { product, flavors } = selection;
    const count = selectedCount();
    const chosenBottle = product.bottleOptions?.find(bottle => bottle.id === selection.bottleId);
    const flavorsComplete = count === product.redBullUnits;
    const complete = flavorsComplete && (!product.bottleOptions?.length || !!chosenBottle);
    document.querySelector('#flavor-counter').textContent = `${count} de ${product.redBullUnits} ${product.redBullUnits === 1 ? 'lata selecionada' : 'latas selecionadas'}`;
    const progress = document.querySelector('#flavor-progress');
    progress.max = product.redBullUnits;
    progress.value = count;
    document.querySelector('#flavor-submit').disabled = !complete;
    document.querySelector('#flavor-error').hidden = true;
    for (const row of bottleOptions.querySelectorAll('[data-bottle-row]')) {
      const checked = row.dataset.bottleRow === selection.bottleId;
      row.classList.toggle('selected', checked);
      row.querySelector('input').checked = checked;
    }
    document.querySelector('#bottle-selection-status').hidden = !product.bottleOptions?.length || !!chosenBottle;
    const photo = document.querySelector('#flavor-product-photo');
    photo.src = imageURL(chosenBottle?.image || product.images[0]);
    photo.alt = chosenBottle?.name || product.name;
    document.querySelector('#flavor-product-description').textContent = chosenBottle
      ? `${chosenBottle.name} ${chosenBottle.volume} + ${product.redBullUnits} Red Bull 250 ml`
      : product.description;
    for (const flavor of RED_BULL_FLAVORS) {
      const row = options.querySelector(`[data-flavor-row="${flavor.id}"]`);
      const quantity = flavors[flavor.id] || 0;
      row.classList.toggle('selected', quantity > 0);
      const radio = row.querySelector('input');
      if (radio) radio.checked = quantity === 1;
      else {
        row.querySelector('[data-flavor-quantity]').textContent = quantity;
        row.querySelector('[data-flavor-minus]').disabled = quantity === 0;
        row.querySelector('[data-flavor-plus]').disabled = flavorsComplete;
      }
    }
  }

  function open(product, line = null) {
    selection = { product, flavors: { ...(line?.flavors || {}) }, bottleId: line?.bottle?.id || null, editKey: line?.key || null };
    const single = product.redBullUnits === 1;
    const hasBottles = !!product.bottleOptions?.length;
    document.querySelector('#flavor-title').textContent = hasBottles ? 'Monte seu combo.' : 'Escolha seus sabores.';
    document.querySelector('#flavor-product-name').textContent = product.name;
    document.querySelector('#flavor-product-description').textContent = product.description;
    document.querySelector('#flavor-product-price').textContent = money(product.price);
    const photo = document.querySelector('#flavor-product-photo');
    photo.src = imageURL(product.images[0]);
    photo.alt = product.name;
    document.querySelector('#flavor-instruction').textContent = single
      ? 'Escolha o sabor da sua lata de 250 ml.'
      : `Escolha as ${product.redBullUnits} latas do combo. Pode misturar os sabores!`;
    document.querySelector('#flavor-submit-label').textContent = line ? 'Salvar sabores' : 'Adicionar ao carrinho';
    document.querySelector('#flavor-submit-price').textContent = money(product.price);
    document.querySelector('#bottle-section').hidden = !hasBottles;
    document.querySelector('#flavor-step-title').hidden = !hasBottles;
    bottleOptions.innerHTML = renderBottleChoices(product.bottleOptions);
    options.innerHTML = RED_BULL_FLAVORS.map(flavor => {
      const name = escapeHTML(flavor.name);
      const swatch = `<span class="flavor-swatch flavor-${flavor.tone}" aria-hidden="true"></span>`;
      if (single) return `<label class="flavor-choice" data-flavor-row="${flavor.id}"><input type="radio" name="redbullFlavor" value="${flavor.id}" required>${swatch}<span>${name}</span><span class="flavor-radio-mark" aria-hidden="true">${icon('check')}</span></label>`;
      return `<div class="flavor-row" data-flavor-row="${flavor.id}">${swatch}<div class="flavor-row-name"><strong>${name}</strong><button type="button" data-flavor-all="${flavor.id}">Todas desse sabor</button></div><div class="quantity-control"><button type="button" data-flavor-minus="${flavor.id}" aria-label="Diminuir latas de ${name}">${icon('minus')}</button><span data-flavor-quantity aria-label="Latas de ${name}">0</span><button type="button" data-flavor-plus="${flavor.id}" aria-label="Adicionar lata de ${name}">${icon('plus')}</button></div></div>`;
    }).join('');
    update();
    if (!dialog.open) dialog.showModal();
    // A escolha da garrafa deve aparecer primeiro, mesmo após editar outro combo.
    document.querySelector('.flavor-body').scrollTop = 0;
    onOpenChange();
    const initialFocus = bottleOptions.querySelector('input:checked') || bottleOptions.querySelector('input') || options.querySelector('input:checked') || options.querySelector('input') || options.querySelector('[data-flavor-plus]');
    initialFocus?.focus({ preventScroll: true });
  }

  bottleOptions.addEventListener('change', event => {
    if (event.target.name !== 'comboBottle' || !selection) return;
    selection.bottleId = event.target.value;
    update();
  });

  options.addEventListener('change', event => {
    if (event.target.name !== 'redbullFlavor' || !selection) return;
    selection.flavors = { [event.target.value]: 1 };
    update();
  });
  options.addEventListener('click', event => {
    if (!selection) return;
    const all = event.target.closest('[data-flavor-all]');
    const plus = event.target.closest('[data-flavor-plus]');
    const minus = event.target.closest('[data-flavor-minus]');
    if (all) selection.flavors = { [all.dataset.flavorAll]: selection.product.redBullUnits };
    else if (plus && selectedCount() < selection.product.redBullUnits) {
      const id = plus.dataset.flavorPlus;
      selection.flavors[id] = (selection.flavors[id] || 0) + 1;
    } else if (minus) {
      const id = minus.dataset.flavorMinus;
      selection.flavors[id] = Math.max(0, (selection.flavors[id] || 0) - 1);
    } else return;
    update();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!selection || selectedCount() !== selection.product.redBullUnits) return;
    if (selection.product.bottleOptions?.length && !selection.product.bottleOptions.some(bottle => bottle.id === selection.bottleId)) return;
    try {
      const saved = { ...selection, flavors: { ...selection.flavors } };
      const key = onConfirm(saved);
      dialog.close();
      onSaved({ ...saved, key });
    } catch (error) {
      const message = document.querySelector('#flavor-error');
      message.textContent = error.message;
      message.hidden = false;
    }
  });
  document.querySelector('#close-flavors').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { selection = null; onOpenChange(); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  return { open };
}
