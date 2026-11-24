/**
 * Teste de interação real, via CDP, contra o site atual.
 *
 * Os outros scripts medem a página parada. Este mexe nela: navega pelas
 * âncoras, troca e persiste o tema, abre o visualizador de imagem, abre e
 * fecha o menu mobile, clica em copiar. Em cada passo ouve o console e
 * coleta exceções.
 *
 *   node scripts/serve-dist.mjs 4180      # em outro terminal
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
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method) return;
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

const profile = await mkdtemp(join(tmpdir(), 'dh-inter-'));
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
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
  console.log(`  FALHA ${step}: ${detail}`);
};
const ok = (step, detail) => console.log(`  ok ${step}${detail ? ` — ${detail}` : ''}`);

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

  // 1. A página montou com as quatro seções e os sete projetos?
  const mounted = await evalIn(`(() => {
    const sections = ['experiencia', 'projetos', 'sobre', 'contato']
      .filter((id) => document.getElementById(id)).length;
    const cases = document.querySelectorAll('.project-case').length;
    return { sections, cases };
  })()`);
  mounted.value?.sections === 4
    ? ok('montagem', '4 seções')
    : note('montagem', `esperava 4 seções, achei ${mounted.value?.sections}`);
  mounted.value?.cases === 7
    ? ok('projetos', '7 cards')
    : note('projetos', `esperava 7 cards de projeto, achei ${mounted.value?.cases}`);

  // 2. Âncora da navbar leva a #projetos logo abaixo da navbar?
  const navTest = await evalIn(`(() => {
    const link = [...document.querySelectorAll('#nav-links-desktop a')]
      .find((a) => a.getAttribute('href') === '#projetos');
    if (!link) return { found: false };
    link.click();
    return { found: true };
  })()`);
  await sleep(1100);
  if (!navTest.value?.found) note('nav desktop', 'link #projetos não encontrado');
  else {
    const res = await evalIn(`(() => {
      const el = document.getElementById('projetos');
      const navH = document.getElementById('site-nav')?.getBoundingClientRect().height ?? 64;
      return { top: Math.round(el.getBoundingClientRect().top), navH };
    })()`);
    // smoothScrollToElement deixa o topo da seção a navH+16 do viewport.
    const expected = res.value.navH + 16;
    Math.abs(res.value.top - expected) <= 30
      ? ok('nav desktop', `#projetos a ${res.value.top}px (esperado ~${expected}px)`)
      : note('nav desktop', `#projetos parou a ${res.value.top}px; esperado ~${expected}px`);
  }

  // 3. Troca de tema muda o atributo e persiste
  const themeBefore = await evalIn(`document.documentElement.getAttribute('data-theme')`);
  await evalIn(`document.querySelector('button[aria-label="Trocar tema claro/escuro"]')?.click()`);
  await sleep(900);
  const themeAfter = await evalIn(`document.documentElement.getAttribute('data-theme')`);
  const savedTheme = await evalIn(`localStorage.getItem('dh_theme')`);
  themeAfter.value && themeAfter.value !== themeBefore.value
    ? ok('troca de tema', `${themeBefore.value} -> ${themeAfter.value}`)
    : note('troca de tema', `não mudou (antes=${themeBefore.value}, depois=${themeAfter.value})`);
  savedTheme.value === themeAfter.value
    ? ok('tema persistido', savedTheme.value)
    : note('tema persistido', `localStorage="${savedTheme.value}" vs tema="${themeAfter.value}"`);

  await send('Page.navigate', { url: ORIGIN + '/' });
  await sleep(1100);
  const themeReload = await evalIn(`document.documentElement.getAttribute('data-theme')`);
  themeReload.value === themeAfter.value
    ? ok('tema sobrevive ao reload')
    : note('tema sobrevive ao reload', `${themeAfter.value} -> ${themeReload.value}`);

  // 4. Links de repositório público corretos (4 projetos com repo público)
  const repoLinks = await evalIn(`[...document.querySelectorAll('.project-case-links a')]
    .map((a) => a.href).filter((h) => h.includes('github.com/danielharrisonlf'))`);
  (repoLinks.value?.length ?? 0) >= 4
    ? ok('links de repositório', `${repoLinks.value.length} links do GitHub`)
    : note('links de repositório', `esperava >= 4, achei ${repoLinks.value?.length}`);

  // 5. Carrossel e visualizador de imagem: avança tela, abre, imagem decodifica, ArrowRight troca, Esc fecha, foco volta
  const carouselBefore = await evalIn(`document.querySelector('.project-carousel-counter')?.textContent?.trim()`);
  await evalIn(`document.querySelector('.project-arrow-btn[aria-label^="Próxima tela"]')?.click()`);
  await sleep(350);
  const carouselAfter = await evalIn(`document.querySelector('.project-carousel-counter')?.textContent?.trim()`);
  carouselBefore.value === '01/03' && carouselAfter.value === '02/03'
    ? ok('carrossel', `${carouselBefore.value} -> ${carouselAfter.value}`)
    : note('carrossel', `esperava 01/03 -> 02/03, obtive ${carouselBefore.value} -> ${carouselAfter.value}`);

  // (focus antes do click: um clique real foca o botão; .click() via JS não)
  await evalIn(`(() => {
    const b = document.querySelector('.project-preview');
    b?.focus();
    b?.click();
  })()`);
  await sleep(700);
  const viewerOpen = await evalIn(`(() => {
    const d = document.querySelector('dialog.project-image-viewer');
    if (!d || !d.open) return { open: false };
    const img = d.querySelector('img');
    const sub = d.querySelector('.project-image-toolbar-sub')?.textContent?.trim() ?? '';
    return { open: true, imgLoaded: !!img && img.naturalWidth > 0, sub };
  })()`);
  if (!viewerOpen.value?.open) note('visualizador', 'diálogo não abriu');
  else {
    viewerOpen.value.imgLoaded
      ? ok('visualizador', `aberto com imagem decodificada (${viewerOpen.value.sub})`)
      : note('visualizador', 'aberto mas a imagem não decodificou');
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'ArrowRight',
      code: 'ArrowRight',
      windowsVirtualKeyCode: 39,
    });
    await send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'ArrowRight',
      code: 'ArrowRight',
      windowsVirtualKeyCode: 39,
    });
    await sleep(350);
    const viewerNext = await evalIn(`document.querySelector('dialog.project-image-viewer .project-image-toolbar-sub')?.textContent?.trim() ?? ''`);
    viewerNext.value?.startsWith('03 / 03')
      ? ok('visualizador navega por teclado', viewerNext.value)
      : note('visualizador', `ArrowRight não avançou para 03 / 03 (${viewerNext.value})`);
    await send('Input.dispatchKeyEvent', {
      type: 'keyDown',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await send('Input.dispatchKeyEvent', {
      type: 'keyUp',
      key: 'Escape',
      code: 'Escape',
      windowsVirtualKeyCode: 27,
    });
    await sleep(500);
    const closed = await evalIn(`(() => {
      const d = document.querySelector('dialog.project-image-viewer');
      return {
        closed: !d || !d.open,
        focusOnTrigger: document.activeElement?.classList?.contains('project-preview') ?? false,
      };
    })()`);
    closed.value?.closed ? ok('visualizador fecha com Esc') : note('visualizador', 'Esc não fechou');
    closed.value?.focusOnTrigger
      ? ok('foco volta ao gatilho')
      : note('visualizador', 'foco não voltou ao botão que abriu');
  }

  // 6. Copiar e-mail dá feedback (sucesso ou falha — headless pode negar)
  await evalIn(`document.getElementById('contato')?.scrollIntoView()`);
  await sleep(400);
  await evalIn(`document.querySelector('button[aria-label="Copiar endereço de e-mail"]')?.click()`);
  await sleep(600);
  const copyFeedback = await evalIn(`(() => {
    const btn = document.querySelector('button[aria-label="Copiar endereço de e-mail"]');
    return btn?.textContent ?? '';
  })()`);
  /Copiado|Não foi possível copiar/.test(copyFeedback.value ?? '')
    ? ok('copiar e-mail', `feedback: "${copyFeedback.value}"`)
    : note('copiar e-mail', `sem feedback visível (texto: "${copyFeedback.value}")`);

  // 7. Console limpo no desktop
  consoleErrors.length === 0
    ? ok('console desktop limpo')
    : note('console desktop', consoleErrors.join(' | '));

  /* ================= MOBILE ================= */
  console.log('\n=== MOBILE 390x844 ===');
  await load(390, 844, true);
  consoleErrors.length = 0;

  // 8. Dock flutuante visível
  const dock = await evalIn(`(() => {
    const d = document.getElementById('floating-nav-dock');
    return d ? getComputedStyle(d).display : 'missing';
  })()`);
  dock.value !== 'missing' && dock.value !== 'none'
    ? ok('dock mobile visível')
    : note('dock mobile', `display=${dock.value}`);

  // 9. Menu abre, trava a rolagem, Esc fecha e devolve o foco
  await evalIn(`(() => {
    const b = document.getElementById('mobile-menu-btn');
    b?.focus();
    b?.click();
  })()`);
  await sleep(600);
  const menuOpen = await evalIn(`(() => {
    const dialog = document.querySelector('[role="dialog"][aria-label="Menu de Navegação"]');
    return {
      open: !!dialog,
      bodyLocked: document.body.style.overflow === 'hidden',
      focusInside: !!dialog && dialog.contains(document.activeElement),
    };
  })()`);
  menuOpen.value?.open ? ok('menu abre') : note('menu mobile', 'não abriu');
  menuOpen.value?.bodyLocked
    ? ok('rolagem travada com menu aberto')
    : note('menu mobile', 'rolagem do fundo não travou');
  menuOpen.value?.focusInside
    ? ok('foco dentro do menu')
    : note('menu mobile', 'foco não foi para dentro do diálogo');

  await send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  });
  await send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Escape',
    code: 'Escape',
    windowsVirtualKeyCode: 27,
  });
  await sleep(500);
  const menuClosed = await evalIn(`(() => ({
    closed: !document.querySelector('[role="dialog"][aria-label="Menu de Navegação"]'),
    bodyUnlocked: document.body.style.overflow !== 'hidden',
    focusOnTrigger: document.activeElement?.id === 'mobile-menu-btn',
  }))()`);
  menuClosed.value?.closed ? ok('menu fecha com Esc') : note('menu mobile', 'Esc não fechou');
  menuClosed.value?.bodyUnlocked
    ? ok('rolagem liberada ao fechar')
    : note('menu mobile', 'rolagem continuou travada');
  menuClosed.value?.focusOnTrigger
    ? ok('foco volta ao botão do menu')
    : note('menu mobile', 'foco não voltou ao botão');

  // 10. Navegar pelo menu leva à seção e fecha o menu
  await evalIn(`document.getElementById('mobile-menu-btn')?.click()`);
  await sleep(500);
  await evalIn(`[...document.querySelectorAll('[role="dialog"] a')]
    .find((a) => a.getAttribute('href') === '#projetos')?.click()`);
  await sleep(1200);
  const mobileNav = await evalIn(`(() => ({
    menuGone: !document.querySelector('[role="dialog"][aria-label="Menu de Navegação"]'),
    projTop: Math.round(document.getElementById('projetos')?.getBoundingClientRect().top ?? 9999),
  }))()`);
  mobileNav.value?.menuGone ? ok('menu fecha ao navegar') : note('menu mobile', 'menu ficou aberto');
  Math.abs(mobileNav.value?.projTop - 80) <= 60
    ? ok('navegação mobile', `#projetos a ${mobileNav.value.projTop}px`)
    : note('navegação mobile', `#projetos parou a ${mobileNav.value?.projTop}px`);

  // 11. Alargar a tela com o menu aberto fecha o menu e libera a rolagem
  await evalIn(`document.getElementById('mobile-menu-btn')?.click()`);
  await sleep(500);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1200,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: 1200,
    screenHeight: 900,
  });
  await sleep(700);
  const afterResize = await evalIn(`(() => ({
    menuGone: !document.querySelector('[role="dialog"][aria-label="Menu de Navegação"]'),
    bodyUnlocked: document.body.style.overflow !== 'hidden',
  }))()`);
  afterResize.value?.menuGone
    ? ok('menu fecha ao virar desktop')
    : note('breakpoint', 'menu continuou aberto ao alargar a tela');
  afterResize.value?.bodyUnlocked
    ? ok('rolagem liberada após o breakpoint')
    : note('breakpoint', 'rolagem continuou travada após alargar');

  // 12. Console limpo no mobile
  consoleErrors.length === 0
    ? ok('console mobile limpo')
    : note('console mobile', consoleErrors.join(' | '));

  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}

if (problems.length > 0) {
  console.log(`\n${problems.length} problema(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log('\nTodas as interações aprovadas.');
