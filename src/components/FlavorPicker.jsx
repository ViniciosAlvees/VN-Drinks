import { useState } from 'react';
import { getFlavorOptions, getFlavorUnits } from '../catalog.js';
import { money } from '../cart.js';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';

export default function FlavorPicker({ selection: { product, line }, onClose, onConfirm }) {
  const [flavors, setFlavors] = useState(line?.flavors || {});
  const [bottleId, setBottleId] = useState(line?.bottle?.id || '');
  const [error, setError] = useState('');
  const units = getFlavorUnits(product);
  const options = getFlavorOptions(product);
  const isBaly = !!product.balyUnits;
  const count = Object.values(flavors).reduce((sum, quantity) => sum + quantity, 0);
  const bottle = product.bottleOptions?.find(option => option.id === bottleId);
  const hasBottles = !!product.bottleOptions?.length;
  const complete = count === units && (!hasBottles || !!bottle);
  const single = units === 1;
  function changeFlavor(id, amount) {
    setError('');
    setFlavors(current => ({ ...current, [id]: Math.max(0, Math.min(units, (current[id] || 0) + amount)) }));
  }

  return <Modal className="flavor-dialog" labelledBy="flavor-title" describedBy="flavor-instruction" onClose={onClose}>
    <form id="flavor-form" onSubmit={event => {
      event.preventDefault();
      if (!complete) return;
      try { onConfirm({ product, flavors, bottleId: bottleId || undefined, editKey: line?.key }); }
      catch (caught) { setError(caught.message); }
    }}>
      <header className="flavor-header"><div><span className="eyebrow muted">DO SEU JEITO</span><h2 id="flavor-title">{hasBottles ? 'Monte seu combo.' : 'Escolha seus sabores.'}</h2></div><button className="icon-button" type="button" onClick={onClose} aria-label="Fechar seleção de sabores"><Icon name="close" /></button></header>
      <div className="flavor-body">
        <div className="flavor-product"><img src={`./assets/images/${bottle?.image || product.images[0]}`} alt={bottle?.name || product.name} width="68" height="76" /><div><h3>{product.name}</h3><p>{bottle ? `${bottle.name} ${bottle.volume} + ${units} Red Bull 250 ml + ${product.iceUnits} gelos` : product.description}</p><strong>{money(product.price)}</strong></div></div>
        {hasBottles && <section aria-labelledby="bottle-title"><h3 className="selection-step-title" id="bottle-title">1. Escolha sua garrafa</h3><fieldset className="bottle-options" aria-labelledby="bottle-title">{product.bottleOptions.map(option => <label className={`bottle-choice ${bottleId === option.id ? 'selected' : ''}`} key={option.id}><input type="radio" name="comboBottle" value={option.id} checked={bottleId === option.id} onChange={() => { setBottleId(option.id); setError(''); }} required /><span className="bottle-photo"><img src={`./assets/images/${option.image}`} alt={option.name} width="100" height="110" /></span><strong>{option.name}</strong><small>{option.volume}</small><span className="flavor-radio-mark" aria-hidden="true"><Icon name="check" /></span></label>)}</fieldset>{!bottle && <p className="bottle-selection-status" role="status">Selecione uma garrafa para completar o combo.</p>}</section>}
        {hasBottles && <h3 className="selection-step-title" id="flavor-step-title">2. Escolha seus Red Bulls</h3>}
        <p id="flavor-instruction">{single ? (isBaly ? 'Escolha o sabor da garrafa de Baly do combo.' : 'Escolha o sabor da sua lata de 250 ml.') : `Escolha as ${units} latas do combo. Pode misturar os sabores!`}</p>
        <fieldset className="flavor-options" aria-label={isBaly ? "Sabores de Baly" : "Sabores de Red Bull"}>{options.map(flavor => single ? <label className={`flavor-choice ${flavors[flavor.id] ? 'selected' : ''}`} key={flavor.id}><input type="radio" name="energyFlavor" value={flavor.id} required checked={flavors[flavor.id] === 1} onChange={() => { setFlavors({ [flavor.id]: 1 }); setError(''); }} /><span className={`flavor-swatch flavor-${flavor.tone}`} aria-hidden="true" /><span>{flavor.name}</span><span className="flavor-radio-mark" aria-hidden="true"><Icon name="check" /></span></label> : <div className={`flavor-row ${flavors[flavor.id] ? 'selected' : ''}`} key={flavor.id}><span className={`flavor-swatch flavor-${flavor.tone}`} aria-hidden="true" /><div className="flavor-row-name"><strong>{flavor.name}</strong><button type="button" onClick={() => { setFlavors({ [flavor.id]: units }); setError(''); }}>Todas desse sabor</button></div><div className="quantity-control"><button type="button" disabled={!flavors[flavor.id]} onClick={() => changeFlavor(flavor.id, -1)} aria-label={`Diminuir latas de ${flavor.name}`}><Icon name="minus" /></button><span aria-label={`Latas de ${flavor.name}`}>{flavors[flavor.id] || 0}</span><button type="button" disabled={count >= units} onClick={() => changeFlavor(flavor.id, 1)} aria-label={`Adicionar lata de ${flavor.name}`}><Icon name="plus" /></button></div></div>)}</fieldset>
        <div className="flavor-selection-status"><span role="status" aria-live="polite">{count} de {units} {isBaly ? 'garrafa selecionada' : single ? 'lata selecionada' : 'latas selecionadas'}</span><span>{isBaly ? 'BALY' : '250 ML POR LATA'}</span></div>
        <progress id="flavor-progress" value={count} max={units} aria-label={isBaly ? "Garrafas selecionadas" : "Latas selecionadas"} />
        {error && <p className="flavor-error" role="alert">{error}</p>}
      </div>
      <footer className="flavor-footer"><button type="submit" className="button button-lime" disabled={!complete}><span>{line ? 'Salvar opções' : 'Adicionar ao carrinho'}</span><strong>{money(product.price)}</strong><Icon name="bag" /></button></footer>
    </form>
  </Modal>;
}
