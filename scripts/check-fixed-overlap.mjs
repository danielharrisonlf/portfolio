/**
 * Caça sobreposição entre elementos FIXOS e qualquer controle que role por
 * baixo deles.
 *
 * Existe por causa de um defeito real: o botão "voltar ao topo" (fixo, no
 * canto) cobria o link "Currículo" do rodapé e engolia o clique em 9
 * larguras. Nenhum dos outros scripts pegaria isso — o transbordo era zero,
 * o layout estava correto, e o elemento culpado estava *por cima*, não fora
 * do lugar. A verificação certa é `elementFromPoint` no centro do alvo
 * visível, que é literalmente o que o dedo do usuário acerta.
 *
 *   node scripts/serve-dist.mjs 4180
 *   node scripts/check-fixed-overlap.mjs
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

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

const ORIGIN = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4180';
const PORT = 9338;

const VIEWPORTS = [
  { w: 320, h: 568, mobile: true },
  { w: 360, h: 740, mobile: true },
  { w: 390, h: 844, mobile: true },
  { w: 414, h: 896, mobile: true },
  { w: 480, h: 900, mobile: true },
  { w: 560, h: 900, mobile: true },
  { w: 600, h: 900, mobile: false },
  { w: 768, h: 1024, mobile: true },
  { w: 820, h: 1000, mobile: false },
  { w: 900, h: 900, mobile: false },
  { w: 960, h: 900, mobile: false },
  { w: 1024, h: 768, mobile: false },
  { w: 1100, h: 800, mobile: false },
  { w: 1200, h: 800, mobile: false },
  { w: 1280, h: 800, mobile: false },
  { w: 1366, h: 768, mobile: false },
  { w: 1440, h: 900, mobile: false },
  { w: 1920, h: 1080, mobile: false },
  { w: 2560, h: 1080, mobile: false },
];

const SCROLL_STEPS = 24;

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

/**
 * Roda na página. Para cada elemento interativo visível, olha o ponto
 * central da sua área clicável e pergunta ao navegador quem está lá em cima.
 * Se não for o próprio elemento nem um descendente dele, é colisão.
 *
 * O cabeçalho sticky é ignorado de propósito: conteúdo que rola por baixo de
 * uma barra fixa é o comportamento normal e esperado de qualquer site com
 * header pegajoso, não um defeito. O que interessa aqui é um controle fixo
 * (tipo um botão flutuante) que fica PERMANENTEMENTE sobre outro controle.
 */
const PROBE = `(() => {
  const hits = [];
  const interactive = document.querySelectorAll('a[href], button, [role="button"]');
  const header = document.querySelector('header');

  for (const el of interactive) {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.bottom < 0 || r.top > innerHeight) continue;
    if (r.right < 0 || r.left > innerWidth) continue;

    const style = getComputedStyle(el);
    if (style.visibility === 'hidden' || style.pointerEvents === 'none') continue;

    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    if (!top) continue;
    if (top === el || el.contains(top) || top.contains(el)) continue;
    if (header && (top === header || header.contains(top))) continue;

    const label = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 34);
    const blocker = top.tagName.toLowerCase() + '.' + String(top.className).split(' ')[0];
    const blockerStyle = getComputedStyle(top);

    hits.push({
      el: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0],
      label,
      blocker,
      blockerLabel: (top.getAttribute('aria-label') || top.textContent || '').trim().slice(0, 26),
      blockerPosition: blockerStyle.position,
      rect: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)],
      scrollY: Math.round(window.scrollY),
    });
  }
  return hits;
})()`;

const profile = await mkdtemp(join(tmpdir(), 'dh-fixed-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true }
);

const problems = [];

try {
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try {
      wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json())
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

  for (const theme of ['light', 'dark']) {
    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
        screenWidth: vp.w,
        screenHeight: vp.h,
      });
      await send('Page.navigate', { url: `${ORIGIN}/` });
      await sleep(250);
      await send('Runtime.evaluate', {
        expression: `localStorage.setItem('dh_theme', ${JSON.stringify(theme)})`,
      });
      await send('Page.navigate', { url: `${ORIGIN}/` });
      await sleep(900);

      /*
       * `scroll-behavior: smooth` corre com a medição: rolar e medir no
       * mesmo tick captura um quadro no meio da animação. Desligar o smooth
       * e esperar assentar é o que torna a medida confiável.
       */
      await send('Runtime.evaluate', {
        expression: `document.documentElement.style.scrollBehavior = 'auto'`,
      });

      const total = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `document.documentElement.scrollHeight - innerHeight`,
      });

      const found = new Map();

      for (let step = 0; step <= SCROLL_STEPS; step++) {
        const y = Math.round((total.result.value * step) / SCROLL_STEPS);
        await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y})` });
        await sleep(90);

        const { result } = await send('Runtime.evaluate', {
          expression: PROBE,
          returnByValue: true,
        });

        for (const hit of result.value ?? []) {
          // Agrupa por alvo+bloqueador: 24 passos de rolagem geram dezenas
          // de leituras do MESMO defeito, e isso não é informação nova.
          const key = `${hit.el}|${hit.blocker}|${hit.label}`;
          if (!found.has(key)) found.set(key, { ...hit, positions: [] });
          const entry = found.get(key);
          if (entry.positions.length < 3) entry.positions.push(hit.scrollY);
        }
      }

      if (found.size > 0) {
        console.log(`\nPROBLEMA  ${vp.w}x${vp.h}  ${theme}`);
        for (const hit of found.values()) {
          console.log(
            `   ${hit.el} "${hit.label}"  coberto por  ${hit.blocker}` +
              (hit.blockerLabel ? ` ("${hit.blockerLabel}")` : '') +
              `  [${hit.blockerPosition}]`
          );
          console.log(`      scrollY: ${hit.positions.join(', ')}   rect: ${hit.rect.join(', ')}`);
          problems.push(`${vp.w}x${vp.h}/${theme}: ${hit.el} "${hit.label}" sob ${hit.blocker}`);
        }
      }
    }
  }

  ws.close();
} finally {
  chrome.kill();
  await sleep(400);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}

console.log(
  `\n${problems.length === 0
    ? 'Nenhum controle coberto em 19 viewports x 2 temas x 25 posicoes de rolagem.'
    : `${problems.length} colisao(oes).`}`
);
process.exit(problems.length === 0 ? 0 : 1);
