import { STORE } from '../catalog.js';
import Header from './Header.jsx';
import Catalog from './Catalog.jsx';

export default function Layout({ count, onOpenCart, onAdd, category, setCategory }) {
return <>
  <a className="skip-link" href="#catalogo">Pular para o catálogo</a>

  <svg className="icon-definitions" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
    <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
    <symbol id="i-up-right" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></symbol>
    <symbol id="i-bag" viewBox="0 0 24 24"><path d="M5 7h14l1 14H4L5 7Zm3 0V6a4 4 0 0 1 8 0v1"/></symbol>
    <symbol id="i-plus" viewBox="0 0 24 24"><path d="M5 12h14M12 5v14"/></symbol>
    <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
    <symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M6 18 18 6"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></symbol>
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></symbol>
    <symbol id="i-box" viewBox="0 0 24 24"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10v10M3 7l9 5 9-5M7 5l10 5"/></symbol>
    <symbol id="i-beer" viewBox="0 0 24 24"><path d="M4 8h12v13H4zM16 10h4v7h-4M8 11v6m4-6v6M4 8a3 3 0 0 1 0-6 4 4 0 0 1 6 0 4 4 0 0 1 6 3v3"/></symbol>
    <symbol id="i-bottle" viewBox="0 0 24 24"><path d="M9 2h6v5l3 4v10H6V11l3-4V2Zm0 3h6M6 13h12"/></symbol>
    <symbol id="i-bolt" viewBox="0 0 24 24"><path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z"/></symbol>
    <symbol id="i-snow" viewBox="0 0 24 24"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M8 4l4 3 4-3M8 20l4-3 4 3M3 11l4-2V5m14 8-4 2v4M3 13l4 2v4m14-8-4-2V5"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></symbol>
    <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 11.5a9 9 0 0 1-13.5 7.8L3 21l1.6-4.7A9 9 0 1 1 21 11.5Z"/><path d="M8 7c0 5 4 8 8 8l1-3-3-1-1 1-2-2 1-1-1-3-3 1Z"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
  </defs></svg>

  <div className="announcement"><span>BOA COMPANHIA. BEBIDA BOA. <strong>O RESTO É HISTÓRIA.</strong></span><span className="announcement-right">PEDIU, COMBINOU, BRINDOU. <svg className="icon"><use href="#i-up-right"/></svg></span></div>
  <Header count={count} onOpenCart={onOpenCart} />

  <main>
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-grid container">
        <div className="hero-copy">
          <span className="eyebrow"><span className="live-dot"></span> A VIBE É SUA. O BRINDE É COM A GENTE.</span>
          <h1 id="hero-title">O ROLÊ<br />COMEÇA <span className="title-lime">AQUI<span className="title-period">.</span></span></h1>
          <p>Do primeiro brinde à última resenha.<br />Cervejas, destilados e combos no seu ritmo.</p>
          <div className="hero-actions"><a className="button button-lime" href="#catalogo">Escolha sua bebida <svg className="icon"><use href="#i-arrow"/></svg></a><a className="hero-secondary" href="#combos">Bora de combo <span>↗</span></a></div>
          <div className="hero-meta"><span><svg className="icon"><use href="#i-bag"/></svg> Monte seu carrinho</span><span><svg className="icon"><use href="#i-chat"/></svg> Peça pelo WhatsApp</span></div>
        </div>
        <div className="hero-scene" aria-label="Garrafas geladas com limão e gelo em uma composição tropical">
          <span className="scene-word" aria-hidden="true">GELADA.</span>
          <div className="orbit orbit-one" aria-hidden="true"></div><div className="orbit orbit-two" aria-hidden="true"></div>
          <div className="hero-glow" aria-hidden="true"></div>
          <img className="hero-bottles" src="./assets/images/hero-drinks.png" alt="Garrafas com gotas de água, cubos de gelo e limão" width="1024" height="1024" fetchPriority="high" />
          <div className="floating-tag tag-cold"><svg className="icon"><use href="#i-snow"/></svg><span>NO PONTO<br /><strong>DO SEU ROLÊ.</strong></span></div>
          <div className="floating-tag tag-vibe"><span className="sparkle">✳</span> TROPICAL STATE OF MIND</div>
          <span className="scene-caption">BEBIDA BOA, ENERGIA LÁ EM CIMA.</span>
        </div>
      </div>
      <div className="hero-bottom container"><span>ESCOLHA. CHAME. BRINDE.</span><a href="#catalogo" aria-label="Descer para o catálogo">EXPLORE O CARDÁPIO <span>↓</span></a><span>18+ · APRECIE COM MODERAÇÃO</span></div>
    </section>

    <div className="ticker" aria-hidden="true"><div className="ticker-track"><span>CERVEJA TRINCANDO <b>✳</b> COMBOS NA MEDIDA <b>✳</b> SEU ROLÊ, SUA VIBE <b>✳</b> VN DRINKS <b>✳</b> </span><span>CERVEJA TRINCANDO <b>✳</b> COMBOS NA MEDIDA <b>✳</b> SEU ROLÊ, SUA VIBE <b>✳</b> VN DRINKS <b>✳</b> </span></div></div>

    <section className="catalog-section section-pad" id="catalogo" aria-labelledby="catalog-title">
      <div className="container">
        <div className="section-heading"><div><span className="eyebrow muted">01 / ESCOLHA SEU PRÓXIMO BRINDE</span><h2 id="catalog-title">Qual é a sua <em>vibe?</em></h2></div><p>De boa em casa ou com a galera.<br />Tem uma escolha para cada momento.</p></div>
        <Catalog key={category} onAdd={onAdd} category={category} setCategory={setCategory} />
      </div>
    </section>

    <section className="combo-section container" id="combos" aria-labelledby="combo-title">
      <div className="combo-banner"><div className="combo-copy"><span className="eyebrow">O MATCH PERFEITO PRO SEU ROLÊ</span><h2 id="combo-title">JUNTA A GALERA.<br />O COMBO É <span>NOSSO.</span></h2><p>As combinações que deixam a resenha completa.<br />Escolha o seu e comece a boa.</p><a href="#catalogo" className="button button-dark" id="see-combos" onClick={() => setCategory('combos')}>Explorar os combos <svg className="icon"><use href="#i-up-right"/></svg></a></div><div className="combo-visual" aria-hidden="true"><span className="combo-ring"></span><span className="combo-spark">✳</span><img className="combo-gin" src="./assets/images/tanqueray.png" alt="" width="400" height="400" loading="lazy" /><img className="combo-can" src="./assets/images/red-bull.jpg" alt="" width="300" height="300" loading="lazy" /><div className="combo-stamp">BOA VIBE<br /><strong>EM COMBO</strong><svg className="icon"><use href="#i-check"/></svg></div></div></div>
    </section>

    <section className="how-section section-pad container" id="como-pedir" aria-labelledby="how-title">
      <div className="section-heading"><div><span className="eyebrow muted">02 / SEM COMPLICAÇÃO</span><h2 id="how-title">Seu brinde a <em>3 passos.</em></h2></div><a className="text-link" href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer">Precisa de uma mão? <svg className="icon"><use href="#i-up-right"/></svg></a></div>
      <div className="steps"><article><span className="step-number">01</span><svg className="icon"><use href="#i-bottle"/></svg><h3>Encontre sua vibe</h3><p>Explore as bebidas e os combos.<br />Escolha o que combina com seu momento.</p></article><article><span className="step-number">02</span><svg className="icon"><use href="#i-bag"/></svg><h3>Monte seu carrinho</h3><p>Adicione seus favoritos e ajuste<br />as quantidades do seu jeito.</p></article><article><span className="step-number">03</span><svg className="icon"><use href="#i-chat"/></svg><h3>Chama no Whats</h3><p>Envie seu pedido e combine disponibilidade,<br />pagamento e recebimento com a VN.</p></article></div>
    </section>
    <section className="contact-band"><div className="container"><div><span className="eyebrow">A RESENHA COMEÇA NA CONVERSA</span><h2>Bora brindar?</h2></div><a className="button button-lime" href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent('Olá, VN Drinks! Quero saber mais sobre as bebidas. 🍻')}`} target="_blank" rel="noopener noreferrer"><svg className="icon"><use href="#i-chat"/></svg> Fale com a VN <svg className="icon"><use href="#i-up-right"/></svg></a></div></section>
  </main>

  <footer className="site-footer container"><div className="footer-main"><a className="brand" href="#inicio"><img src="./assets/brand/logo-neon.png" width="64" height="64" alt="Logo VN Drinks Adega" loading="lazy" decoding="async" /><span>VN <strong>DRINKS</strong><small>ADEGA</small></span></a><p>Bebida boa. Gente boa. Momentos que ficam.</p><a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer">(11) 96012-3119 <svg className="icon"><use href="#i-up-right"/></svg></a></div><div className="footer-bottom"><span>© <span>{new Date().getFullYear()}</span> VN Drinks. Feito para bons momentos.</span><span>Venda de bebidas alcoólicas apenas para maiores de 18 anos. Beba com moderação.</span></div></footer>


</>;
}
