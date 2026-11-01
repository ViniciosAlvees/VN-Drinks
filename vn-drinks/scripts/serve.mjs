/** Servidor de desenvolvimento, sem dependências. Execute: npm run dev */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';
const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
    const filename = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (filename !== root && !filename.startsWith(root.endsWith(sep) ? root : root + sep)) { response.writeHead(403).end('Acesso negado'); return; }
    if (!(await stat(filename)).isFile()) { response.writeHead(404).end('Não encontrado'); return; }
    response.writeHead(200, { 'Content-Type': types[extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    response.end(await readFile(filename));
  } catch { response.writeHead(404).end('Não encontrado'); }
});
server.listen(port, '127.0.0.1', () => console.log(`VN Drinks: http://127.0.0.1:${port}`));
process.on('SIGINT', () => server.close(() => process.exit(0)));
