/**
 * Auditoria de responsividade, transbordo e estrutura, via Chrome DevTools
 * Protocol.
 *
 * Por que não `--dump-dom` + `--window-size`: o headless não abre janela com
 * menos de ~500px, e o `<meta name="viewport">` só é aplicado quando o
 * navegador está de fato em modo dispositivo. Sem emulação, um teste "a
 * 320px" mede 882px e passa sem ter testado nada — foi exatamente o que
 * aconteceu na primeira versão deste script.
 *
 * Aqui a viewport é imposta por `Emulation.setDeviceMetricsOverride`, que é
 * o mesmo caminho usado pelo modo responsivo do DevTools.
 *
 *   node scripts/serve-dist.mjs 4173      # em outro terminal
 *   node scripts/check-responsive.mjs
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error('Chrome/Edge não encontrado.');
  process.exit(2);
}

const ORIGIN = process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173';
const DEBUG_PORT = 9333;

const VIEWPORTS = [
  { name: '320  iPhone SE', width: 320, height: 568, dpr: 2 },
  { name: '360  Android pequeno', width: 360, height: 740, dpr: 3 },
  { name: '390  iPhone 14', width: 390, height: 844, dpr: 3 },
  { name: '414  iPhone Plus', width: 414, height: 896, dpr: 3 },
  { name: '480  mobile grande', width: 480, height: 900, dpr: 2 },
  { name: '640  tablet pequeno', width: 640, height: 900, dpr: 2 },
  { name: '768  tablet', width: 768, height: 1024, dpr: 2 },
  { name: '834  iPad Air', width: 834, height: 1112, dpr: 2 },
  { name: '1024 tablet paisagem', width: 1024, height: 768, dpr: 2 },
  { name: '1280 notebook', width: 1280, height: 800, dpr: 1 },
  { name: '1440 desktop', width: 1440, height: 900, dpr: 1 },
  { name: '1920 desktop grande', width: 1920, height: 1080, dpr: 1 },
  { name: '2560 ultrawide', width: 2560, height: 1080, dpr: 1 },
];

const SCROLL_STEPS = 14;

/** Código que roda na página. Precisa ser uma string para o Runtime.evaluate. */
const PROBE = `(() => {
  const docEl = document.documentElement;
  const vw = docEl.clientWidth;
  const offenders = [];

  for (const el of document.querySelectorAll('body *')) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) continue;
    const style = getComputedStyle(el);
    if (style.position === 'fixed') continue;
    if (style.visibility === 'hidden' || style.display === 'none') continue;

    if (rect.right > vw + 0.5 || rect.left < -0.5) {
      let path = el.tagName.toLowerCase();
      if (el.className && typeof el.className === 'string') {
        path += '.' + el.className.trim().split(/\\s+/).join('.');
      }
      if (el.id) path = '#' + el.id + ' ' + path;
      offenders.push({
        sel: path.slice(0, 110),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        over: Math.round(rect.right - vw),
        text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40),
      });
    }
  }

  const smallTargets = [];
  for (const el of document.querySelectorAll('a[href], button')) {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    if (getComputedStyle(el).position === 'fixed') continue;

    /*
     * A área clicável não é só a caixa do elemento: um pseudo-elemento
     * posicionado em absolute pode estendê-la bastante — é a técnica usada
     * nos links dentro de parágrafos, onde a caixa de texto tem 16px de
     * altura. Medir só o rect acusaria um alvo pequeno que não existe.
     */
    let top = 0;
    let bottom = 0;

    for (const pseudo of ['::before', '::after']) {
      const ps = getComputedStyle(el, pseudo);
      if (!ps.content || ps.content === 'none' || ps.position !== 'absolute') continue;

      const pt = parseFloat(ps.top);
      const pb = parseFloat(ps.bottom);
      const ph = parseFloat(ps.height);

      if (!Number.isNaN(pt)) top = Math.max(top, -pt);
      if (!Number.isNaN(pb)) bottom = Math.max(bottom, -pb);
      if (!Number.isNaN(ph)) bottom = Math.max(bottom, ph - rect.height);
    }

    const hitHeight = rect.height + Math.max(0, top) + Math.max(0, bottom);

    if (hitHeight < 30) {
      smallTargets.push({
        sel: el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/)[0],
        w: Math.round(rect.width),
        h: Math.round(hitHeight),
        text: (el.textContent || '').trim().slice(0, 28),
      });
    }
  }

  const headingJumps = [];
  let last = 0;
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const level = Number(h.tagName[1]);
    if (last && level > last + 1) {
      headingJumps.push('h' + last + '->h' + level + ': ' + (h.textContent || '').trim().slice(0, 36));
    }
    last = level;
  }

  const overflowers = [];
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.position === 'fixed') continue;
    if (el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
      if (style.overflowX === 'visible' || style.overflowX === 'clip') {
        overflowers.push({
          sel: el.tagName.toLowerCase() + '.' + String(el.className).trim().split(/\\s+/)[0],
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
        });
      }
    }
  }

  return {
    clientWidth: vw,
    innerWidth: window.innerWidth,
    docScrollWidth: docEl.scrollWidth,
    horizontalOverflow: docEl.scrollWidth - vw,
    docScrollHeight: docEl.scrollHeight,
    offenders: offenders.slice(0, 14),
    offenderCount: offenders.length,
    smallTargets: smallTargets.slice(0, 10),
    smallTargetCount: smallTargets.length,
    headingJumps,
    headingCount: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
    sections: [...document.querySelectorAll('[data-section]')].map((el) => ({
      id: el.id,
      height: Math.round(el.getBoundingClientRect().height),
    })),
    counts: {
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      h3: document.querySelectorAll('h3').length,
      sections: document.querySelectorAll('section').length,
      links: document.querySelectorAll('a[href]').length,
      buttons: document.querySelectorAll('button').length,
      imgNoAlt: document.querySelectorAll('img:not([alt])').length,
      iconOnlyNoLabel: document.querySelectorAll('button:not([aria-label]):not([title])').length,
      landmarks: document.querySelectorAll('header, main, footer, nav').length,
      navs: document.querySelectorAll('nav').length,
      progressbar: document.querySelectorAll('[role="progressbar"]').length,
    },
  };
})()`;

/* --- Cliente CDP mínimo --------------------------------------------------- */

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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      const info = await response.json();
      return info.webSocketDebuggerUrl;
    } catch {
      await sleep(250);
    }
  }
  throw new Error('Não consegui falar com o Chrome na porta de depuração.');
}

/* --- Execução ------------------------------------------------------------- */

const profileDir = await mkdtemp(join(tmpdir(), 'dh-cdp-'));
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--hide-scrollbars',
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profileDir}`,
    'about:blank',
  ],
  { stdio: 'ignore', windowsHide: true }
);

let failures = 0;

try {
  const wsUrl = await connect();
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  const cdp = new Cdp(ws);

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', {
    targetId,
    flatten: true,
  });

  const send = (method, params) => cdp.send(method, params, sessionId);

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
  });

  for (const theme of ['light', 'dark']) {
    console.log(`\n${'='.repeat(80)}\nTEMA ${theme.toUpperCase()}\n${'='.repeat(80)}`);

    for (const viewport of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: viewport.dpr,
        mobile: viewport.width <= 834,
        screenWidth: viewport.width,
        screenHeight: viewport.height,
      });

      /*
       * O tema é fixado antes da navegação via localStorage — é a mesma
       * chave que o script inline do index.html lê. Fazer isso pela URL
       * exigiria suporte no app só para o teste.
       */
      await send('Page.navigate', { url: `${ORIGIN}/` });
      await sleep(300);
      await send('Runtime.evaluate', {
        expression: `localStorage.setItem('dh_theme', ${JSON.stringify(theme)})`,
      });
      await send('Page.navigate', { url: `${ORIGIN}/` });
      await sleep(900);

      /*
       * Rola até o fim antes de medir: conteúdo revelado por
       * IntersectionObserver só existe no layout depois de aparecer, e um
       * elemento com `opacity: 0` ainda ocupa espaço — mas seções que nunca
       * foram reveladas podem ter transform pendente.
       */
      for (let step = 1; step <= SCROLL_STEPS; step++) {
        await send('Runtime.evaluate', {
          expression: `window.scrollTo(0, document.documentElement.scrollHeight * ${step / SCROLL_STEPS});`,
        });
        await sleep(60);
      }
      await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
      await sleep(400);

      const { result } = await send('Runtime.evaluate', {
        expression: PROBE,
        returnByValue: true,
      });
      const report = result.value;

      const widthOk = report.clientWidth === viewport.width;
      const overflowOk = report.horizontalOverflow <= 0;
      const targetOk = report.smallTargetCount === 0;
      const headingOk = report.headingJumps.length === 0;
      const structureOk =
        report.counts.h1 === 1 &&
        report.counts.imgNoAlt === 0 &&
        report.counts.iconOnlyNoLabel === 0 &&
        report.counts.landmarks >= 4;

      const ok = widthOk && overflowOk && targetOk && headingOk && structureOk;
      if (!ok) failures++;

      console.log(
        `\n${ok ? 'OK      ' : 'PROBLEMA'} ${viewport.name.padEnd(21)} ` +
          `medido=${String(report.clientWidth).padStart(4)}${widthOk ? '' : ` (ESPERADO ${viewport.width})`}  ` +
          `excesso=${String(report.horizontalOverflow).padStart(4)}px  ` +
          `altura=${String(report.docScrollHeight).padStart(6)}px  ` +
          `alvos<30=${report.smallTargetCount}  ` +
          `h1..h3=${report.counts.h1}/${report.counts.h2}/${report.counts.h3}`
      );

      if (process.env.SECTIONS === '1') {
        console.log(
          '     ' +
            report.sections.map((s) => `${s.id}=${s.height}`).join('  ') +
            `  footer=${report.docScrollHeight - report.sections.reduce((t, s) => t + s.height, 0)}`
        );
      }

      if (!overflowOk) {
        for (const item of report.offenders) {
          console.log(
            `     +${String(item.over).padStart(5)}px  [${item.left}..${item.right}] w=${item.width}  ${item.sel}`
          );
          if (item.text) console.log(`              "${item.text}"`);
        }
        if (report.offenderCount > report.offenders.length) {
          console.log(`     ... e mais ${report.offenderCount - report.offenders.length}`);
        }
      }

      if (!targetOk) {
        for (const item of report.smallTargets) {
          console.log(`     alvo pequeno ${item.w}x${item.h}  ${item.sel}  "${item.text}"`);
        }
      }

      if (!headingOk) {
        for (const jump of report.headingJumps) console.log(`     salto de titulo: ${jump}`);
      }

      if (!structureOk) {
        console.log(`     estrutura: ${JSON.stringify(report.counts)}`);
      }
    }
  }

  ws.close();
} finally {
  chrome.kill();
  await sleep(400);
  await rm(profileDir, { recursive: true, force: true }).catch(() => {});
}

console.log(
  `\n${failures === 0 ? 'Tudo passou em todos os viewports e temas.' : `${failures} verificacao(oes) com problema.`}`
);
process.exit(failures === 0 ? 0 : 1);
