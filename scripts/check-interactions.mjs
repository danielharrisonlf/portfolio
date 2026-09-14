/**
 * Teste de interação real, via CDP.
 *
 * Os outros scripts medem a página parada. Este mexe nela: abre o menu,
 * troca o tema, clica em copiar, navega pelas âncoras, dá Tab pela página.
 * Em cada passo ouve o console e coleta exceções.
 *
 * Motivo: os defeitos que mais irritam num site � clique que não faz nada,
 * estado que trava, erro no console � não aparecem em captura de tela nem em
 * medição de layout.
 *
 *   node scripts/serve-dist.mjs 4180
 *   node scripts/check-interactions.mjs
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
const PORT = 9336;

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method) {
        this.events.push(msg);
        return;
      }
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
const profile = await mkdtemp(join(tmpdir(), 'dh-interact-'));
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
const note = (step, detail) => {
  problems.push(`[${step}] ${detail}`);
  console.log(`  �S ${step}: ${detail}`);
};
const ok = (step, detail) => console.log(`  �S ${step}${detail ? ` � ${detail}` : ''}`);

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
  await send('Log.enable');

  const consoleErrors = [];
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(
        'exception: ' + (msg.params.exceptionDetails?.exception?.description ?? '?')
      );
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      consoleErrors.push('log: ' + msg.params.entry.text);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(
        'console.error: ' + msg.params.args.map((a) => a.value ?? a.description).join(' ')
      );
    }
  });

  const evalIn = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (exceptionDetails) {
      return { error: exceptionDetails.exception?.description ?? 'erro' };
    }
    return { value: result.value };
  };

  async function load(width, height, mobile) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile,
      screenWidth: width,
      screenHeight: height,
    });
    await send('Page.navigate', { url: ORIGIN + '/' });
    await sleep(1200);
  }

  /* ================= DESKTOP ================= */
  console.log('\n=== DESKTOP 1440x900 ===');
  await load(1440, 900, false);
  consoleErrors.length = 0;

  // 1. A página montou?
  const mounted = await evalIn(`document.querySelectorAll('[data-section]').length`);
  mounted.value === 5
    ? ok('montagem', `${mounted.value} seções`)
    : note('montagem', `esperava 5 seções, achei ${mounted.value}`);

  // 2. �ncoras do header navegam?
  const navTest = await evalIn(`(() => {
    const link = [...document.querySelectorAll('header nav a')].find(a => a.hash === '#projetos');
    if (!link) return { found: false };
    link.click();
    return { found: true };
  })()`);
  await sleep(1100);
  if (!navTest.value?.found) note('nav desktop', 'link #projetos não encontrado');
  else {
    const res = await evalIn(`(() => {
      const el = document.getElementById('projetos');
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64;
      return { top: Math.round(el.getBoundingClientRect().top), headerH, hash: location.hash };
    })()`);
    const top = res.value.top;
    // O topo da seção deve ficar logo abaixo do header, não atrás dele nem longe.
    Math.abs(top - res.value.headerH) <= 24
      ? ok('nav desktop', `#projetos a ${top}px (header ${res.value.headerH}px)`)
      : note('nav desktop', `#projetos parou a ${top}px do topo; header tem ${res.value.headerH}px`);
    res.value.hash === '#projetos' ? ok('hash atualizado') : note('hash', `hash = "${res.value.hash}"`);
  }

  // 3. Voltar do navegador funciona?
  await evalIn('history.back()');
  await sleep(900);
  const backPos = await evalIn('Math.round(window.scrollY)');
  backPos.value < 200
    ? ok('botão voltar', `voltou para ${backPos.value}px`)
    : note('botão voltar', `history.back() não voltou ao topo (scrollY=${backPos.value})`);

  // 4. Troca de tema
  const themeBefore = await evalIn(`document.documentElement.getAttribute('data-theme')`);
  await evalIn(`document.querySelector('header button[aria-label*="tema" i], header button[aria-label*="Ativar"]')?.click()`);
  await sleep(1000);
  const themeAfter = await evalIn(`document.documentElement.getAttribute('data-theme')`);
  const savedTheme = await evalIn(`localStorage.getItem('dh_theme')`);
  themeAfter.value !== themeBefore.value
    ? ok('troca de tema', `${themeBefore.value} -> ${themeAfter.value}`)
    : note('troca de tema', `não mudou (segue ${themeAfter.value})`);
  savedTheme.value === themeAfter.value
    ? ok('tema persistido', savedTheme.value)
    : note('tema persistido', `localStorage="${savedTheme.value}" vs tema="${themeAfter.value}"`);

  // 5. Recarregar mantém o tema?
  await send('Page.navigate', { url: ORIGIN + '/' });
  await sleep(1100);
  const themeReload = await evalIn(`document.documentElement.getAttribute('data-theme')`);
  themeReload.value === themeAfter.value
    ? ok('tema sobrevive ao reload')
    : note('tema sobrevive ao reload', `${themeAfter.value} -> ${themeReload.value}`);

  // 6. Voltar ao topo
  await evalIn('window.scrollTo(0, 4000)');
  await sleep(600);
  const toTopVisible = await evalIn(`(() => {
    const btn = document.querySelector('footer button[aria-label="Voltar ao topo"]');
    if (!btn) return 'missing';
    return getComputedStyle(btn).visibility;
  })()`);
  if (toTopVisible.value === 'missing') note('voltar ao topo', 'botão não existe');
  else {
    await evalIn(`document.querySelector('footer button[aria-label="Voltar ao topo"]').click()`);
    await sleep(1400);
    const afterTop = await evalIn('Math.round(window.scrollY)');
    afterTop.value < 60
      ? ok('voltar ao topo', `scrollY=${afterTop.value}`)
      : note('voltar ao topo', `parou em scrollY=${afterTop.value}`);
  }

  // 7. Link "pular para o conteúdo" move o foco?
  await send('Page.navigate', { url: ORIGIN + '/' });
  await sleep(1000);
  const skip = await evalIn(`(() => {
    const link = document.querySelector('a[href="#conteudo"]');
    if (!link) return { found: false };
    link.focus();
    link.click();
    return { found: true, active: document.activeElement?.id || document.activeElement?.tagName };
  })()`);
  await sleep(400);
  const afterSkip = await evalIn(`document.activeElement?.id || document.activeElement?.tagName`);
  afterSkip.value === 'conteudo'
    ? ok('skip link', 'foco foi para <main>')
    : note('skip link', `foco ficou em "${afterSkip.value}" em vez de "conteudo"`);

  // 8. Erros de console no desktop
  consoleErrors.length === 0
    ? ok('console desktop limpo')
    : note('console desktop', consoleErrors.join(' | '));

  /* ================= MOBILE ================= */
  console.log('\n=== MOBILE 390x844 ===');
  await load(390, 844, true);
  consoleErrors.length = 0;

  // 9. Menu abre?
  const burger = await evalIn(`(() => {
    const btn = document.querySelector('header button[aria-label*="menu" i], header button[aria-label*="Abrir"]');
    if (!btn) return { found: false };
    btn.click();
    return { found: true };
  })()`);
  await sleep(600);
  if (!burger.value?.found) note('menu mobile', 'botão hambúrguer não encontrado');
  else {
    const menu = await evalIn(`(() => {
      const dlg = document.querySelector('[role="dialog"]');
      return {
        exists: !!dlg,
        bodyOverflow: document.body.style.overflow,
        active: document.activeElement?.tagName + '/' + (document.activeElement?.getAttribute('aria-label') || ''),
      };
    })()`);
    menu.value.exists ? ok('menu mobile abre') : note('menu mobile', 'role="dialog" não apareceu');
    menu.value.bodyOverflow === 'hidden'
      ? ok('rolagem travada')
      : note('rolagem travada', `body.overflow="${menu.value.bodyOverflow}"`);

    // 10. Navegar pelo menu fecha e rola?
    const item = await evalIn(`(() => {
      const links = [...document.querySelectorAll('[role="dialog"] a[href^="#"]')];
      const target = links.find(a => a.hash === '#experiencia');
      if (!target) return { found: false, count: links.length };
      target.click();
      return { found: true };
    })()`);
    await sleep(1300);
    if (!item.value?.found) note('menu navega', `link #experiencia ausente (${item.value?.count} links)`);
    else {
      const state = await evalIn(`(() => {
        const el = document.getElementById('experiencia');
        return {
          menuFechado: !document.querySelector('[role="dialog"]'),
          bodyOverflow: document.body.style.overflow,
          top: Math.round(el.getBoundingClientRect().top),
          headerH: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'),10) || 64,
        };
      })()`);
      state.value.menuFechado ? ok('menu fecha ao navegar') : note('menu fecha ao navegar', 'painel continua aberto');
      state.value.bodyOverflow === ''
        ? ok('rolagem destravada')
        : note('rolagem destravada', `body.overflow="${state.value.bodyOverflow}" ainda travado`);
      Math.abs(state.value.top - state.value.headerH) <= 24
        ? ok('menu navega', `#experiencia a ${state.value.top}px`)
        : note('menu navega', `#experiencia parou a ${state.value.top}px (header ${state.value.headerH}px)`);
    }

    // 11. ESC fecha (ou não)
    await evalIn(`document.querySelector('header button[aria-label*="menu" i]')?.click()`);
    await sleep(500);
    const reabriu = await evalIn(`!!document.querySelector('[role="dialog"]')`);
    if (reabriu.value) {
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
      await sleep(500);
      const fechou = await evalIn(`!document.querySelector('[role="dialog"]')`);
      fechou.value ? ok('ESC fecha o menu') : note('ESC fecha o menu', 'painel continua aberto');
    } else {
      note('menu reabrir', 'segundo clique no hambúrguer não abriu o menu');
    }
  }

  // 12. Overflow horizontal no mobile
  const ov = await evalIn(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
  ov.value <= 1 ? ok('sem transbordo horizontal') : note('transbordo horizontal', `${ov.value}px`);

  // 13. Copiar e-mail
  /*
   * Neste ambiente o Chrome headless responde `hasApi: true` mas nega a
   * permissão (`NotAllowedError`), e o `execCommand` de fallback devolve
   * false. Ou seja: copiar aqui é impossível.
   *
   * Então não dá para exigir sucesso. O que dá — e é o que importa — é
   * exigir que a interface nunca fique muda: ou confirma, ou avisa. Testar
   * `data-copied` não servia, porque ele é "false" tanto em "falhou" quanto
   * em "ocioso"; quem diz qual dos dois é o rótulo.
   */
  const copyTest = await evalIn(`(async () => {
    const btn = [...document.querySelectorAll('button')].find(b => (b.getAttribute('aria-label')||'').includes('Copiar'));
    if (!btn) return { found: false };
    const before = btn.textContent.trim();
    btn.click();
    await new Promise(r => setTimeout(r, 800));
    return { found: true, before, after: btn.textContent.trim(), state: btn.dataset.copied };
  })()`);

  if (!copyTest.value?.found) {
    note('copiar e-mail', 'botão não encontrado');
  } else {
    const { before, after, state } = copyTest.value;

    if (state === 'copied') {
      ok('copiar e-mail', `cópia confirmada, rótulo "${after}"`);
    } else if (after !== before && /n[ãa]o deu/i.test(after)) {
      ok(
        'copiar e-mail',
        `permissão negada neste ambiente — a interface avisa em vez de ficar muda ("${after}")`
      );
    } else {
      note('copiar e-mail', `clicou e nada mudou: rótulo seguiu "${after}"`);
    }
  }

  // 14. Console no mobile
  consoleErrors.length === 0
    ? ok('console mobile limpo')
    : note('console mobile', consoleErrors.join(' | '));

  ws.close();
} finally {
  chrome.kill();
  await sleep(400);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}

console.log(
  `\n${problems.length === 0 ? 'Nenhum problema de interação.' : `${problems.length} PROBLEMA(S):`}`
);
for (const p of problems) console.log('  - ' + p);
process.exit(problems.length === 0 ? 0 : 1);
