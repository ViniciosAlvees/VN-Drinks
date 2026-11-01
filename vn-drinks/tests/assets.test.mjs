import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { PRODUCTS } from '../dist/js/catalog.js';
const root = new URL('../dist/', import.meta.url);

test('todas as fotos do catálogo existem e são arquivos de imagem', async () => {
  const images = new Set(PRODUCTS.flatMap(product => product.images));
  for (const product of PRODUCTS) for (const bottle of product.bottleOptions || []) images.add(bottle.image);
  images.add('hero-drinks.png');
  for (const image of images) {
    const bytes = await readFile(new URL(`assets/images/${image}`, root));
    assert.ok(bytes.length > 1000, `${image}: imagem vazia`);
    assert.ok(bytes.subarray(1,4).toString() === 'PNG' || bytes[0] === 0xff, `${image}: não é PNG ou JPEG`);
  }
});

test('HTML referencia arquivos e ícones existentes sem IDs duplicados', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'ID duplicado no HTML');
  for (const [,icon] of html.matchAll(/<use href="#([^"]+)"/g)) assert.ok(ids.includes(icon), `Ícone ausente: ${icon}`);
  const files = [...html.matchAll(/(?:src|href)="((?:assets|js|css)\/[^"?#]+)"/g)].map(match => match[1]);
  for (const file of files) assert.ok((await stat(new URL(file,root))).isFile(), `Arquivo ausente: ${file}`);
});
