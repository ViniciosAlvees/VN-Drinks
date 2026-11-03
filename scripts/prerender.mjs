/** Gera o mesmo catálogo React no HTML público, antes de executar JavaScript. */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const server = await createServer({
  root: fileURLToPath(new URL('../', import.meta.url)),
  configFile: false,
  plugins: [react()],
  server: { middlewareMode: true, watch: null },
  appType: 'custom',
});

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const markup = renderToString(createElement(App));
  const path = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(path, 'utf8');
  const root = '<div id="root"></div>';
  if (!html.includes(root)) throw new Error('O build não contém a raiz React vazia esperada.');
  await writeFile(path, html.replace(root, () => `<div id="root">${markup}</div>`));
  console.log('HTML inicial gerado com o catálogo completo para visitantes e buscadores.');
} finally {
  await server.close();
}
