/** Pequenos helpers compartilhados pelas interfaces do catálogo e dos sabores. */
export const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
export const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const imageURL = filename => `assets/images/${encodeURIComponent(filename)}`;

/** Opções reais da garrafa, compartilhadas com a verificação do seletor do combo. */
export function renderBottleChoices(bottles = []) {
  return bottles.map(bottle => `<label class="bottle-choice" data-bottle-row="${bottle.id}"><input type="radio" name="comboBottle" value="${bottle.id}" required><span class="bottle-photo"><img src="${imageURL(bottle.image)}" alt="${escapeHTML(bottle.name)}" width="100" height="110"></span><strong>${escapeHTML(bottle.name)}</strong><small>${escapeHTML(bottle.volume)}</small><span class="flavor-radio-mark" aria-hidden="true">${icon('check')}</span></label>`).join('');
}
