import { useEffect, useRef, useState } from 'react';
import { CART_KEY, addCartItem, getCount, getTotal, sanitizeCart, setCartFlavors, money } from './cart.js';
import Layout from './components/Layout.jsx';
import Cart from './components/Cart.jsx';
import FlavorPicker from './components/FlavorPicker.jsx';
import Icon from './components/Icon.jsx';
import { getFlavorUnits } from './catalog.js';

function restoreCart() {
  try { return sanitizeCart(JSON.parse(localStorage.getItem(CART_KEY))); } catch { return {}; }
}

export default function App() {
  const [cart, setCart] = useState(restoreCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [category, setCategory] = useState('all');
  const [toast, setToast] = useState('');
  const toastTimer = useRef();
  const count = getCount(cart);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* Disponível nesta aba mesmo sem armazenamento. */ }
    document.body.classList.toggle('has-cart', getCount(cart) > 0);
  }, [cart]);
  useEffect(() => {
    const sync = event => {
      if (event.key === CART_KEY || event.key === null) setCart(restoreCart());
    };
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('storage', sync); clearTimeout(toastTimer.current); };
  }, []);

  function notify(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  }
  function add(product) {
    if (getFlavorUnits(product)) { setToast(''); setSelection({ product }); return; }
    try { setCart(addCartItem(cart, product.id)); notify('Boa escolha! Adicionado ao carrinho.'); }
    catch (error) { notify(error.message); }
  }
  function confirm({ product, flavors, bottleId, editKey }) {
    setCart(editKey ? setCartFlavors(cart, editKey, flavors, bottleId) : addCartItem(cart, product.id, flavors, bottleId));
    setSelection(null);
    if (!cartOpen) notify('Boa escolha! Adicionado ao carrinho.');
  }
  function openCart() { setToast(''); setCartOpen(true); }

  return <>
    <Layout count={count} onOpenCart={openCart} onAdd={add} category={category} setCategory={setCategory} />
    {cartOpen && <Cart cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} onEdit={line => setSelection({ product: line.product, line })} />}
    {selection && <FlavorPicker selection={selection} onClose={() => setSelection(null)} onConfirm={confirm} />}
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite"><span className="toast-check"><Icon name="check" /></span><span>{toast}</span><button onClick={openCart}>Ver carrinho <span>↗</span></button></div>
    {count > 0 && <button className="mobile-cart" onClick={openCart}><span><Icon name="bag" />Ver carrinho <b>{count}</b></span><strong>{money(getTotal(cart))}</strong><Icon name="arrow" /></button>}
  </>;
}
