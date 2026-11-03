import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { PRODUCTS } from '../src/catalog.js';

test('todas as fotos do catálogo e das opções são imagens locais válidas', async () => {
  const images = new Set(PRODUCTS.flatMap(product => product.images));
  for (const product of PRODUCTS) for (const bottle of product.bottleOptions || []) images.add(bottle.image);
  images.add('hero-drinks.png');
  for (const image of images) {
    const bytes = await readFile(new URL(`../public/assets/images/${image}`, import.meta.url));
    assert.ok(bytes.length > 1000, `${image}: imagem vazia`);
    assert.ok(bytes.subarray(1, 4).toString() === 'PNG' || bytes[0] === 0xff, `${image}: não é PNG ou JPEG`);
  }
});

test('manifesto usa ícones locais e caminhos relativos compatíveis com GitHub Pages e Vercel', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  for (const icon of manifest.icons) assert.ok((await stat(new URL(`../public/${icon.src}`, import.meta.url))).isFile());
});
