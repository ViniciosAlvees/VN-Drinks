import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { PRODUCTS } from '../../src/catalog.js';

const root = new URL('../../dist/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const canonical = 'https://vn-drinks.vercel.app/';

test('HTML publicado identifica a VN Drinks e permite indexação na URL canônica', () => {
  assert.match(html, /<title>VN Drinks \| Adega, Cervejas e Combos<\/title>/);
  assert.match(html, /<meta name="description" content="VN Drinks:/);
  assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large">/);
  assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1);
  assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(schema['@type'], 'WebSite');
  assert.equal(schema.name, 'VN Drinks');
  assert.equal(schema.url, canonical);
});

test('catálogo e preços estão presentes antes de carregar JavaScript', () => {
  assert.match(html, /<main>/);
  assert.match(html, /id="catalogo"/);
  assert.equal([...html.matchAll(/class="product-card"/g)].length, PRODUCTS.length);
  for (const product of PRODUCTS) {
    const escaped = product.name.replaceAll('&', '&amp;').replaceAll("'", '&#x27;');
    assert.ok(html.includes(`<h3>${escaped}</h3>`), `Produto ausente: ${product.name}`);
  }
  for (const price of ['8,50', '9,00', '50,00']) assert.ok(html.includes(price));
  assert.doesNotMatch(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /src="\/src\/main.jsx"/);
});

test('HTML gerado mantém IDs únicos, ícones válidos e recursos locais existentes', async () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'ID duplicado');
  for (const [, id] of html.matchAll(/<use href="#([^"]+)"/g)) assert.ok(ids.includes(id), `Ícone ausente: ${id}`);
  const files = [...html.matchAll(/(?:src|href)="((?:\.\/)?assets\/[^"?#]+)"/g)].map(match => match[1]);
  for (const file of new Set(files)) assert.ok((await stat(new URL(file, root))).isFile(), `Recurso ausente: ${file}`);
});

test('robots e sitemap publicados apontam para o mesmo endereço canônico', async () => {
  const robots = await readFile(new URL('robots.txt', root), 'utf8');
  const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
  assert.match(robots, /User-agent: \*\s+Allow: \//);
  assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
  assert.equal([...sitemap.matchAll(/<loc>/g)].length, 1, 'Âncoras não são páginas separadas');
});
