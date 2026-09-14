/**
 * Servidor estático mínimo para verificação local do build.
 *
 * Usa `vite preview`? Não: o preview também observa arquivos em algumas
 * versões e morre com EBUSY no Windows quando o editor grava de forma
 * atômica. Este aqui só lê o disco a cada requisição, sem watcher.
 *
 *   node scripts/serve-dist.mjs [porta]
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, normalize, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', 'dist');
const port = Number(process.argv[2] ?? 4180);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  // Sem isso, `../` no caminho serviria arquivos fora de dist/.
  const safe = normalize(pathname).replace(/^(\.\.[\\/])+/, '');
  let filePath = join(root, safe);

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = join(filePath, 'index.html');
  } catch {
    // SPA: qualquer rota desconhecida devolve o index.
    filePath = join(root, 'index.html');
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream',
      'Content-Length': body.length,
      'Cache-Control': 'no-store',
    });
    response.end(body);
  } catch (error) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(`404 — ${error.message}`);
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`dist servido em http://127.0.0.1:${port}/`);
});
