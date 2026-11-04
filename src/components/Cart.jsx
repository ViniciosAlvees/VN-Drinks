import { useRef, useState } from 'react';
import { getCartLines, getCount, getTotal, money, MAX_QUANTITY, getWhatsAppURL, hasPendingSelections, getFlavorSummary, sanitizeCart } from '../cart.js';
import { STORE } from '../catalog.js';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';

export default function Cart({ cart, setCart, onClose, onEdit }) {
  const [details, setDetails] = useState({ name: '', fulfillment: 'pickup', payment: 'A combinar', address: '', notes: '' });
  const form = useRef(null);
  const lines = getCartLines(cart);
  const pending = hasPendingSelections(cart);
  const delivery = details.fulfillment === 'delivery';
  const checkout = getWhatsAppURL(cart, details);
  function changeQuantity(key, quantity) {
    setCart(current => sanitizeCart({ ...current, [key]: Math.min(MAX_QUANTITY, quantity) }));
  }
  function update(event) { setDetails(current => ({ ...current, [event.target.name]: event.target.value })); }

  return <Modal className="cart-dialog" labelledBy="cart-title" onClose={onClose}>
    <div className="cart-panel">
      <div className="cart-header"><div><span className="eyebrow muted">FALTA POUCO PRO BRINDE</span><h2 id="cart-title">Seu carrinho <span>{getCount(cart)}</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Fechar carrinho"><Icon name="close" /></button></div>
      <div className="cart-body">
        {!lines.length ? <div className="cart-empty"><Icon name="bag" /><h3>O próximo brinde espera por você.</h3><p>Adicione suas bebidas favoritas para começar.</p><button className="button button-lime" onClick={onClose}>Explorar bebidas <Icon name="arrow" /></button></div> : <>
          <div>{lines.map(line => {
            const { key, product, quantity, subtotal, flavors, bottle, needsFlavors, needsBottle } = line;
            const needsSelection = needsFlavors || needsBottle;
            const choices = product.bottleOptions?.length ? 'opções' : 'sabores';
            const name = [product.name, bottle?.name, getFlavorSummary(flavors)].filter(Boolean).join(', ');
            return <article className="cart-item" key={key}>
              <img className="cart-item-photo" src={`./assets/images/${bottle?.image || product.images[0]}`} alt={bottle?.name || product.name} width="74" height="82" />
              <div><h3>{product.name}</h3><p className="cart-item-price">{money(product.price)} por {product.category === 'combos' ? 'combo' : 'item'}</p>
                {bottle && <p className="cart-bottle">{bottle.name} · {bottle.volume}</p>}
                {!!product.iceUnits && <p className="cart-bottle">{product.iceUnits} gelos por combo</p>}
                {!!product.redBullUnits && <><p className={`cart-flavors ${needsSelection ? 'pending' : ''}`}>{needsSelection ? 'Complete as opções para finalizar.' : `${product.redBullUnits > 1 ? 'Red Bull por combo: ' : ''}${getFlavorSummary(flavors)}`}</p><button className="edit-flavors" onClick={() => onEdit(line)} aria-label={`${needsSelection ? 'Escolher' : 'Alterar'} ${choices} de ${name}`}>{needsSelection ? 'Escolher' : 'Alterar'} {choices}</button></>}
                <div className="quantity-control"><button onClick={() => changeQuantity(key, quantity - 1)} aria-label={`Diminuir quantidade de ${name}`}><Icon name="minus" /></button><span aria-label="Quantidade">{quantity}</span><button disabled={quantity >= MAX_QUANTITY} onClick={() => changeQuantity(key, quantity + 1)} aria-label={`Aumentar quantidade de ${name}`}><Icon name="plus" /></button></div>
              </div><div className="cart-item-aside"><strong>{money(subtotal)}</strong><button className="remove-item" onClick={() => changeQuantity(key, 0)} aria-label={`Remover ${name}`}>Remover</button></div>
            </article>;
          })}</div>
          <form ref={form} className="order-form" onSubmit={event => event.preventDefault()}>
            <h3>Como vai ser o rolê?</h3>
            <label>Seu nome <span>(opcional)</span><input name="name" maxLength="80" autoComplete="name" placeholder="Como podemos te chamar?" value={details.name} onChange={update} /></label>
            <div className="form-row"><label>Recebimento<select name="fulfillment" value={details.fulfillment} onChange={update}><option value="pickup">Retirada</option><option value="delivery">Entrega</option></select></label><label>Pagamento<select name="payment" value={details.payment} onChange={update}>{['A combinar', 'Pix', 'Cartão', 'Dinheiro'].map(payment => <option key={payment}>{payment}</option>)}</select></label></div>
            {delivery && <label>Endereço para entrega<input name="address" required pattern=".*\S.*" maxLength="240" autoComplete="street-address" placeholder="Rua, número, bairro e complemento" value={details.address} onChange={update} /></label>}
            <label>Observações <span>(opcional)</span><textarea name="notes" maxLength="500" rows="2" placeholder="Algum detalhe para o seu pedido?" value={details.notes} onChange={update} /></label>
          </form>
        </>}
      </div>
      {!!lines.length && <div className="cart-summary">
        {pending && <p className="cart-flavor-warning" role="status">Complete as opções dos itens do carrinho para finalizar.</p>}
        <div className="subtotal"><span>Subtotal dos produtos</span><strong>{money(getTotal(cart))}</strong></div>
        <p className="shipping-note">{delivery ? 'Taxa e área de entrega a confirmar pelo WhatsApp. Frete não incluso.' : 'Retirada e disponibilidade a combinar pelo WhatsApp.'}</p>
        {STORE.demoMode && <p className="cart-demo">Demonstração: confirme os produtos e valores com a VN.</p>}
        <a className={`button button-lime checkout-button ${!checkout ? 'is-disabled' : ''}`} href={checkout || undefined} aria-disabled={!checkout} target="_blank" rel="noopener noreferrer" onClick={event => {
          if (!checkout || !form.current.reportValidity()) event.preventDefault();
        }}><Icon name="chat" />Finalizar pelo WhatsApp <Icon name="up-right" /></a>
        <p className="checkout-note">Você revisa a mensagem e envia no WhatsApp.<br />O pedido é confirmado no atendimento.</p>
      </div>}
    </div>
  </Modal>;
}
