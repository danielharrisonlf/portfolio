/**
 * Compara variantes de accent na página real, sem tocar no código-fonte.
 *
 * Funciona assim: copia `dist/` para uma pasta temporária, acrescenta um
 * bloco `:root` no FIM do CSS construído sobrescrevendo só os tokens de
 * accent, e serve essa cópia. A página é a de produção — mesmo HTML, mesmo
 * JS, mesma cascata — e a única diferença é a cor.
 *
 * Tentar montar o HTML à mão (inline de <style> + <script type="module">) não
 * funciona: o bundle é um módulo ES e o app não monta a partir de file://.
 * Servir a cópia evita esse problema inteiro.
 *
 *   node scripts/try-palette.mjs
 */

import { spawn } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const CHROME = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

if (!CHROME) {
  console.error('Chrome/Edge não encontrado.');
  process.exit(2);
}

const DEBUG_PORT = 9337;
const OUT = resolve(process.env.OUT_DIR ?? join(tmpdir(), 'dh-palette'));

/**
 * Cada variante gera um bloco de override.
 * `canvas` é o accent dentro do hero, que é escuro nos DOIS temas — por isso
 * ele não segue o valor do tema claro.
 */
const VARIANTS = [
  {
    id: '0-atual',
    label: '0 — Atual (ciano-petróleo)',
    css: '',
  },
  {
    id: 'a-ambar',
    label: 'A — Âmbar queimado',
    css: `
:root, [data-theme='light'] {
  --accent: oklch(50% 0.125 62);
  --accent-solid: oklch(47% 0.125 58);
  --accent-on-solid: oklch(99% 0.01 62);
  --accent-tint: oklch(50% 0.125 62 / 0.09);
  --accent-line: oklch(50% 0.125 62 / 0.34);
  --canvas-accent: oklch(80% 0.14 66);
  --canvas-accent-tint: oklch(80% 0.14 66 / 0.13);
  --canvas-halo: oklch(62% 0.13 60 / 0.13);
}
[data-theme='dark'] {
  --accent: oklch(79% 0.135 68);
  --accent-solid: oklch(79% 0.135 68);
  --accent-on-solid: oklch(18% 0.03 60);
  --accent-tint: oklch(79% 0.135 68 / 0.13);
  --accent-line: oklch(79% 0.135 68 / 0.36);
  --canvas-accent: oklch(80% 0.14 66);
  --canvas-accent-tint: oklch(80% 0.14 66 / 0.13);
  --canvas-halo: oklch(60% 0.14 62 / 0.15);
}`,
  },
  {
    id: 'b-coral',
    label: 'B — Coral terracota',
    css: `
:root, [data-theme='light'] {
  --accent: oklch(52% 0.15 38);
  --accent-solid: oklch(49% 0.15 36);
  --accent-on-solid: oklch(99% 0.012 38);
  --accent-tint: oklch(52% 0.15 38 / 0.09);
  --accent-line: oklch(52% 0.15 38 / 0.34);
  --canvas-accent: oklch(77% 0.15 40);
  --canvas-accent-tint: oklch(77% 0.15 40 / 0.13);
  --canvas-halo: oklch(60% 0.14 20 / 0.13);
}
[data-theme='dark'] {
  --accent: oklch(76% 0.145 42);
  --accent-solid: oklch(76% 0.145 42);
  --accent-on-solid: oklch(18% 0.035 35);
  --accent-tint: oklch(76% 0.145 42 / 0.13);
  --accent-line: oklch(76% 0.145 42 / 0.36);
  --canvas-accent: oklch(77% 0.15 40);
  --canvas-accent-tint: oklch(77% 0.15 40 / 0.13);
  --canvas-halo: oklch(58% 0.15 25 / 0.15);
}`,
  },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

/** Servidor estático simples, apontando para a cópia. */
function serve(dir, port) {
  const server = createServer(async (req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(dir, path);
    try {
      if (statSync(file).isDirectory()) file = join(file, 'index.html');
    } catch {
      file = join(dir, 'index.html');
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(404).end('404');
    }
  });
  return new Promise((r) => server.listen(port, '127.0.0.1', () => r(server)));
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (!msg.id) return;
      const entry = this.pending.get(msg.id);
      if (!entry) return;
      this.pending.delete(msg.id);
      msg.error ? entry.reject(new Error(JSON.stringify(msg.error))) : entry.resolve(msg.result);
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* --- Prepara uma cópia do dist por variante ------------------------------ */

await mkdir(OUT, { recursive: true });

const assetNames = await readdir(join(root, 'dist', 'assets'));
const cssName = assetNames.find((f) => f.endsWith('.css'));
const cssOriginal = await readFile(join(root, 'dist', 'assets', cssName), 'utf8');

const servers = [];
const bases = [];

for (const [index, variant] of VARIANTS.entries()) {
  const dir = await mkdtemp(join(tmpdir(), `dh-pal-${variant.id}-`));
  await cp(join(root, 'dist'), dir, { recursive: true });

  if (variant.css) {
    await writeFile(
      join(dir, 'assets', cssName),
      `${cssOriginal}\n/* variante ${variant.id} */\n${variant.css}\n`,
      'utf8'
    );
  }

  const port = 4400 + index;
  servers.push(await serve(dir, port));
  bases.push({ variant, port, dir });
}

/* --- Captura ------------------------------------------------------------- */

const profile = await mkdtemp(join(tmpdir(), 'dh-pal-prof-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true }
);

try {
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json())
        .webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  if (!wsUrl) throw new Error('Chrome não respondeu.');

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });
  const cdp = new Cdp(ws);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (m, p) => cdp.send(m, p, sessionId);
  await send('Page.enable');
  await send('Runtime.enable');

  for (const { variant, port } of bases) {
    for (const theme of ['light', 'dark']) {
      for (const [shotName, height] of [['hero', 900], ['experiencia', 1100], ['contato', 800]]) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: 1440,
          height,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
        await sleep(300);
        await send('Runtime.evaluate', {
          expression: `localStorage.setItem('dh_theme', ${JSON.stringify(theme)})`,
        });
        await send('Page.navigate', { url: `http://127.0.0.1:${port}/` });
        await sleep(1000);

        // Confirma que o app montou antes de capturar.
        const mounted = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `document.querySelectorAll('[data-section]').length`,
        });
        if (mounted.result.value !== 5) {
          console.log(`  !! ${variant.id}/${theme}: app não montou (${mounted.result.value} seções)`);
        }

        if (shotName !== 'hero') {
          await send('Runtime.evaluate', {
            expression: `(() => {
              const el = document.getElementById(${JSON.stringify(shotName)});
              const h = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64;
              window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - h);
            })()`,
          });
          await sleep(400);
        }

        const { data } = await send('Page.captureScreenshot', { format: 'png' });
        await writeFile(
          join(OUT, `${variant.id}-${shotName}-${theme}.png`),
          Buffer.from(data, 'base64')
        );
      }
      console.log(`  ${variant.label} / ${theme}`);
    }
  }

  ws.close();
} finally {
  chrome.kill();
  await sleep(400);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
  for (const s of servers) s.close();
  for (const b of bases) await rm(b.dir, { recursive: true, force: true }).catch(() => {});
}

console.log(`\nCapturas em ${OUT}`);
