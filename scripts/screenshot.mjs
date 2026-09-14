/**
 * Captura de tela em viewport exata, via CDP.
 *
 * Por que nÃ£o `chrome --headless --window-size=390,844 --screenshot`: nesse
 * caminho o headless nÃ£o respeita a largura pedida abaixo de ~500px e a
 * captura sai cortada, dando a impressÃ£o de transbordo que nÃ£o existe. Aqui
 * a viewport vem de `Emulation.setDeviceMetricsOverride`, o mesmo mecanismo
 * do modo responsivo do DevTools.
 *
 *   node scripts/screenshot.mjs [url] [pasta-de-saida]
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error('Chrome/Edge nÃ£o encontrado.');
  process.exit(2);
}

const url = process.argv[2] ?? 'http://127.0.0.1:4173/';
const outDir = resolve(process.argv[3] ?? join(tmpdir(), 'dh-shots'));
const DEBUG_PORT = 9334;

const SHOTS = [
  { name: 'desktop-1440', width: 1440, height: 900, dpr: 1 },
  { name: 'desktop-1440-exp', width: 1440, height: 900, dpr: 1, scrollTo: 'experiencia' },
  { name: 'desktop-1440-proj', width: 1440, height: 900, dpr: 1, scrollTo: 'projetos' },
  { name: 'desktop-1440-form', width: 1440, height: 900, dpr: 1, scrollTo: 'formacao' },
  { name: 'desktop-1440-contato', width: 1440, height: 900, dpr: 1, scrollTo: 'contato' },
  { name: 'desktop-1920', width: 1920, height: 1000, dpr: 1 },
  { name: 'ultrawide-2560', width: 2560, height: 1100, dpr: 1 },
  { name: 'laptop-1280', width: 1280, height: 800, dpr: 1 },
  { name: 'tablet-834', width: 834, height: 1024, dpr: 2 },
  { name: 'mobile-414', width: 414, height: 896, dpr: 2 },
  { name: 'mobile-390', width: 390, height: 844, dpr: 2 },
  { name: 'mobile-390-exp', width: 390, height: 844, dpr: 2, scrollTo: 'experiencia' },
  { name: 'mobile-390-proj', width: 390, height: 844, dpr: 2, scrollTo: 'projetos' },
  { name: 'mobile-360', width: 360, height: 740, dpr: 2 },
  { name: 'mobile-320', width: 320, height: 568, dpr: 2 },
];

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const entry = this.pending.get(message.id);
      if (!entry) return;
      this.pending.delete(message.id);
      if (message.error) entry.reject(new Error(JSON.stringify(message.error)));
      else entry.resolve(message.result);
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

const profileDir = await mkdtemp(join(tmpdir(), 'dh-shot-'));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true }
);

await mkdir(outDir, { recursive: true });

try {
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      wsUrl = (await res.json()).webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  if (!wsUrl) throw new Error('Chrome nÃ£o respondeu na porta de depuraÃ§Ã£o.');

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.addEventListener('open', res, { once: true });
    ws.addEventListener('error', rej, { once: true });
  });

  const cdp = new Cdp(ws);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const send = (method, params) => cdp.send(method, params, sessionId);

  await send('Page.enable');
  await send('Runtime.enable');

  for (const theme of ['light', 'dark']) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url });
    await sleep(400);
    await send('Runtime.evaluate', {
      expression: `localStorage.setItem('dh_theme', ${JSON.stringify(theme)})`,
    });

    for (const shot of SHOTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: shot.width,
        height: shot.height,
        deviceScaleFactor: shot.dpr,
        mobile: shot.width <= 834,
        screenWidth: shot.width,
        screenHeight: shot.height,
      });

      await send('Page.navigate', { url });
      await sleep(1100);

      // Rola a pÃ¡gina inteira para disparar qualquer revelaÃ§Ã£o por scroll.
      for (let step = 1; step <= 10; step++) {
        await send('Runtime.evaluate', {
          expression: `window.scrollTo(0, document.documentElement.scrollHeight * ${step / 10});`,
        });
        await sleep(50);
      }

      if (shot.scrollTo) {
        await send('Runtime.evaluate', {
          expression: `(() => {
            const el = document.getElementById(${JSON.stringify(shot.scrollTo)});
            if (!el) return;
            const h = parseInt(getComputedStyle(document.documentElement)
              .getPropertyValue('--header-h'), 10) || 64;
            window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - h);
          })()`,
        });
      } else {
        await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
      }

      await sleep(500);

      const file = join(outDir, `${shot.name}-${theme}.png`);
      const { data } = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
      });
      await writeFile(file, Buffer.from(data, 'base64'));
      console.log(`  ${shot.name}-${theme}.png`);

      if (process.env.DUMP === '1') {
        const { result } = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const pick = (el) => {
              if (!el) return null;
              const s = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              return {
                cls: String(el.className).slice(0, 40),
                bg: s.backgroundColor,
                color: s.color,
                borderTop: s.borderTopColor,
                top: Math.round(r.top),
                h: Math.round(r.height),
                w: Math.round(r.width),
              };
            };
            return {
              html: getComputedStyle(document.documentElement).backgroundColor,
              body: getComputedStyle(document.body).backgroundColor,
              theme: document.documentElement.getAttribute('data-theme'),
              headerVar: getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
              headerStyleHeight: document.querySelector('header')
                ? getComputedStyle(document.querySelector('header')).height
                : null,
              headerRectTop: document.querySelector('header')
                ? Math.round(document.querySelector('header').getBoundingClientRect().top)
                : null,
              heroTop: document.querySelector('section')
                ? Math.round(document.querySelector('section').getBoundingClientRect().top)
                : null,
              header: pick(document.querySelector('header')),
              hero: pick(document.querySelector('section')),
              main: pick(document.querySelector('main')),
              firstSection: pick(document.querySelector('#experiencia')),
            };
          })()`,
        });
        console.log(`      ${shot.name}-${theme}: ${JSON.stringify(result.value)}`);
      }

      if (process.env.MEASURE === '1' && shot.scrollTo) {
        const { result } = await send('Runtime.evaluate', {
          returnByValue: true,
          expression: `(() => {
            const section = document.getElementById(${JSON.stringify(shot.scrollTo)});
            if (!section) return null;
            const rows = [];
            const walk = (el, depth) => {
              const r = el.getBoundingClientRect();
              if (r.height < 4) return;
              const cls = String(el.className)
                .split(' ')
                .map((c) => c.replace(/_[a-z0-9]+_\\d+$/, ''))
                .join('.')
                .slice(0, 40);
              const s = getComputedStyle(el);
              rows.push({
                d: depth,
                tag: el.tagName.toLowerCase(),
                cls,
                x: Math.round(r.left),
                w: Math.round(r.width),
                h: Math.round(r.height),
                cols: s.display.includes('grid') ? s.gridTemplateColumns : '',
                maxW: s.maxWidth,
              });
              if (depth >= 2) return;
              for (const child of el.children) walk(child, depth + 1);
            };
            walk(section, 0);
            return rows.slice(0, 40);
          })()`,
        });

        const rows = result.value ?? [];
        console.log(`      --- medidas de #${shot.scrollTo} (${shot.name}-${theme}) ---`);
        for (const row of rows) {
          console.log(
            `      ${'  '.repeat(row.d)}${row.tag}.${row.cls}  x=${row.x} ${row.w}x${row.h}` +
              (row.cols ? `  cols=[${row.cols}]` : '') +
              (row.maxW && row.maxW !== 'none' ? `  maxW=${row.maxW}` : '')
          );
        }
      }
    }
  }

  ws.close();
} finally {
  chrome.kill();
  await sleep(400);
  await rm(profileDir, { recursive: true, force: true }).catch(() => {});
}

console.log(`\nCapturas em ${outDir}`);
