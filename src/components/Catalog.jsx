import { useState } from 'react';
import { CATEGORIES, PRODUCTS, getFlavorOptions, getFlavorUnits, STORE } from '../catalog.js';
import { money } from '../cart.js';
import Icon from './Icon.jsx';

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export default function Catalog({ onAdd, category, setCategory }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('default');
  const products = PRODUCTS.filter(product => {
    const flavors = getFlavorUnits(product) ? getFlavorOptions(product).map(flavor => flavor.name).join(' ') : '';
    const bottles = (product.bottleOptions || []).map(bottle => bottle.name).join(' ');
    return (category === 'all' || product.category === category || (category === 'sem-alcool' && product.alcoholFree))
      && normalize(`${product.name} ${product.description} ${flavors} ${bottles}`).includes(normalize(query));
  }).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, 'pt-BR') : Number(b.featured) - Number(a.featured));

  return <>
    <div className="catalog-tools">
      <div className="category-tabs" role="group" aria-label="Filtrar por categoria">{CATEGORIES.map(item => <button className="category-tab" key={item.id} aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setQuery(''); }}><Icon name={item.icon} />{item.name}</button>)}</div>
      <label className="search-field"><Icon name="search" /><span className="sr-only">Buscar bebida</span><input type="search" placeholder="Busque sua bebida" autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>
    <div className="catalog-info"><p aria-live="polite">{products.length} {products.length === 1 ? 'bebida ou combo' : 'bebidas e combos'} para o seu rolê</p><label className="sort-label">Ordenar por <select aria-label="Ordenar produtos" value={sort} onChange={event => setSort(event.target.value)}><option value="default">Destaques</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A–Z</option></select></label></div>
    {STORE.demoMode && <p className="demo-notice"><span>CATÁLOGO DE EXEMPLO</span> Produtos e preços de demonstração. Confirme os valores e a disponibilidade pelo WhatsApp.</p>}
    <div className="product-grid">{products.map((product, index) => <article className="product-card" key={product.id} style={{ animationDelay: `${Math.min(index, 7) * 35}ms` }}>
      <div className={`product-photo tone-${product.tone} ${product.images.length > 1 ? 'multiple' : ''} ${product.imageLayout || ''}`}>
        <span className="product-badge">{product.badge}</span>
        {product.images.map((filename, i) => <img key={`${filename}-${i}`} src={`./assets/images/${filename}`} alt={i === 0 ? product.name : ''} width="400" height="400" loading="lazy" />)}
        <span className="photo-caption">IMAGEM ILUSTRATIVA</span>
      </div>
      <div className="product-info"><h3>{product.name}</h3><p className="product-description">{product.description}{!!getFlavorUnits(product) && <span className="product-flavor-hint">{product.bottleOptions?.length ? 'Escolha o gin e os sabores dos Red Bulls' : `${getFlavorOptions(product).length} sabores${product.balyUnits ? " de Baly" : ""} à sua escolha`}</span>}</p>
        <div className="product-bottom"><span className="product-price"><small>R$</small>{money(product.price).replace(/^R\$\s*/, '')}</span><button className="add-button" onClick={event => onAdd(product, event.currentTarget)} aria-label={`${getFlavorUnits(product) ? 'Selecionar opções de' : 'Adicionar ao carrinho:'} ${product.name}`} aria-haspopup={getFlavorUnits(product) ? 'dialog' : undefined}><Icon name={getFlavorUnits(product) ? 'chevron' : 'plus'} /><span>{getFlavorUnits(product) ? 'Selecionar' : 'Adicionar'}</span></button></div>
      </div>
    </article>)}</div>
    {!products.length && <div className="empty-results text-center"><Icon name="search" /><h3>Essa bebida ainda não apareceu.</h3><p>Tente outro nome ou explore todas as categorias.</p><button className="button button-outline" onClick={() => { setCategory('all'); setQuery(''); }}>Ver todas as bebidas</button></div>}
  </>;
}
