import { useState } from 'react';
import { STORE } from '../catalog.js';
import Icon from './Icon.jsx';

export default function Header({ count, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner container">
      <a className="brand" href="#inicio" aria-label="VN Drinks, início">
        <img src="./assets/brand/logo-neon.png" width="64" height="64" alt="Logo VN Drinks Adega" decoding="async" />
        <span>VN <strong>DRINKS</strong><small>ADEGA</small></span>
      </a>
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`} aria-label="Navegação principal" id="main-nav" onClick={() => setMenuOpen(false)}>
        <a href="#catalogo">Nossas bebidas</a><a href="#combos">Combos</a><a href="#como-pedir">Como pedir</a>
      </nav>
      <div className="header-actions">
        <a className="header-contact" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer"><Icon name="chat" /><span>Fale com a VN</span></a>
        <button className="cart-trigger" onClick={onOpenCart} aria-label={`Abrir carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}><Icon name="bag" /><span className="cart-word">Carrinho</span><span className="cart-count">{count}</span></button>
        <button className="icon-button menu-trigger" id="menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-controls="main-nav" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></button>
      </div>
    </div>
  </header>;
}
