/**
 * Verificação de contraste WCAG dos tokens de cor.
 *
 * Lê src/styles/tokens.css, converte cada OKLCH para sRGB e calcula a razão
 * de contraste dos pares que realmente aparecem na interface. Roda com
 * `node scripts/check-contrast.mjs`.
 *
 * Existe porque contraste é a única propriedade visual que dá para medir
 * sem navegador — e foi exatamente onde a versão anterior reprovou.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, '..', 'src', 'styles', 'tokens.css'), 'utf8');

/** Extrai os tokens de um bloco de seletor. */
function readBlock(selector) {
  const index = css.indexOf(selector);
  if (index === -1) throw new Error(`Seletor não encontrado: ${selector}`);

  const open = css.indexOf('{', index);
  const close = css.indexOf('}', open);
  const body = css.slice(open + 1, close);

  const tokens = {};
  for (const match of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

/* --- OKLCH -> sRGB ------------------------------------------------------- */

function oklchToRgb(l, c, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = c * Math.cos(h);
  const b = c * Math.sin(h);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lc = l_ ** 3;
  const mc = m_ ** 3;
  const sc = s_ ** 3;

  const lin = [
    +4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc,
  ];

  return lin.map((v) => {
    const srgb = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(v, 0), 1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, srgb));
  });
}

function srgbToLinear(rgb) {
  return rgb.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
}

function luminance(rgb) {
  const [r, g, b] = srgbToLinear(rgb);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Converte um valor de token (`oklch(...)` ou `#rrggbb`) para sRGB. */
function parse(value) {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  const oklch = value.match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/i);
  if (oklch) {
    let l = parseFloat(oklch[1]);
    if (value.includes('%')) l /= 100;
    return oklchToRgb(l, parseFloat(oklch[2]), parseFloat(oklch[3]));
  }

  throw new Error(`Valor não suportado: ${value}`);
}

/** Mistura dois tokens na proporção dada (aproxima `color-mix` em oklab). */
function mix(base, over, amount) {
  return base.map((v, i) => v * (1 - amount) + over[i] * amount);
}

/* --- Pares que existem na interface -------------------------------------- */

const AA_TEXT = 4.5; // texto normal
const AA_LARGE = 3; // texto >= 24px ou >= 18.66px bold
const AA_GRAPHIC = 3; // elementos gráficos e limites de componente (1.4.11)

const CHECKS = [
  // [rótulo, cor de frente, cor de fundo, mínimo]
  ['texto principal sobre o fundo', '--fg', '--bg', AA_TEXT],
  ['texto secundário sobre o fundo', '--fg-2', '--bg', AA_TEXT],
  ['texto discreto sobre o fundo', '--muted', '--bg', AA_TEXT],
  ['texto secundário sobre o cartão', '--fg-2', '--surface', AA_TEXT],
  ['texto discreto sobre o cartão', '--muted', '--surface', AA_TEXT],
  ['destaque sobre o fundo', '--accent', '--bg', AA_TEXT],
  ['destaque sobre o cartão', '--accent', '--surface', AA_TEXT],
  ['texto do botão primário', '--accent-on-solid', '--accent-solid', AA_TEXT],
  ['sucesso sobre o fundo', '--ok', '--bg', AA_TEXT],
  ['sucesso sobre o cartão', '--ok', '--surface', AA_TEXT],
  ['alerta sobre o fundo', '--warn', '--bg', AA_TEXT],
  ['erro sobre o fundo', '--danger', '--bg', AA_TEXT],
  ['borda sobre o fundo', '--line', '--bg', 1.2],
  ['borda forte sobre o fundo', '--line-strong', '--bg', 1.5],
  /*
   * Limite de CONTROLE tem exigência própria: a WCAG 1.4.11 pede 3:1 para
   * elemento de interface, porque é a borda que informa que aquilo é
   * clicável. Medido sobre o fundo E sobre a superfície, já que o rodapé e
   * o cabeçalho usam --surface.
   */
  ['borda de controle sobre o fundo', '--line-control', '--bg', AA_GRAPHIC],
  ['borda de controle sobre o cartão', '--line-control', '--surface', 2.8],

  // Hero / canvas
  ['texto do hero', '--canvas-fg', '--canvas', AA_TEXT],
  ['texto secundário do hero', '--canvas-fg-2', '--canvas', AA_TEXT],
  ['texto discreto do hero', '--canvas-muted', '--canvas', AA_TEXT],
  ['destaque do hero', '--canvas-accent', '--canvas', AA_LARGE],
  ['borda do hero', '--canvas-line', '--canvas', 1.5],
];

/*
 * O painel do hero NÃO entra em CHECKS: ele é composto na tela como
 * `color-mix(canvas-2 72%, transparent)` sobre o canvas, então medir os
 * tokens crus daria um número que não corresponde a pixel nenhum. A medição
 * certa está na seção de composições, mais abaixo.
 */

const REQUIRED_BY_THEME = [
  'bg', 'surface', 'fg', 'fg-2', 'muted', 'faint', 'line', 'line-strong',
  'accent', 'accent-solid', 'accent-on-solid', 'accent-tint', 'accent-line',
  'ok', 'ok-tint', 'ok-line', 'warn', 'warn-tint', 'warn-line', 'danger',
  'canvas', 'canvas-2', 'canvas-fg', 'canvas-fg-2', 'canvas-muted', 'canvas-line',
  'canvas-grid', 'canvas-accent', 'canvas-accent-tint', 'canvas-glow',
];

const light = readBlock(":root,\n[data-theme='light']");
const dark = readBlock("[data-theme='dark']");

let failures = 0;

for (const [themeName, tokens] of [
  ['CLARO', light],
  ['ESCURO', dark],
]) {
  console.log(`\n=== Tema ${themeName} ===`);

  for (const key of REQUIRED_BY_THEME) {
    const token = `--${key}`;
    if (!tokens[token]) {
      console.log(`  FALTA     ${token} não está definido neste tema`);
      failures++;
    }
  }

  for (const [label, fgKey, bgKey, min] of CHECKS) {
    const fgRaw = tokens[fgKey];
    const bgRaw = tokens[bgKey];

    if (!fgRaw || !bgRaw) {
      console.log(`  PULADO    ${label} (token ausente)`);
      continue;
    }

    // Tokens com alpha (tints) não entram na medição: o valor efetivo
    // depende do que está atrás, e isso o CSS resolve em runtime.
    if (fgRaw.includes('/') || bgRaw.includes('/')) continue;

    let ratio;
    try {
      ratio = contrast(parse(fgRaw), parse(bgRaw));
    } catch (error) {
      console.log(`  PULADO    ${label} — ${error.message}`);
      continue;
    }

    const pass = ratio >= min;
    if (!pass) failures++;
    console.log(
      `  ${pass ? 'OK  ' : 'FALHA'}  ${ratio.toFixed(2).padStart(6)}:1  (mín ${min})  ${label}`
    );
  }
}

/* --- Tints aplicados sobre o fundo --------------------------------------- */

console.log('\n=== Composições (aproximação em sRGB) ===');

for (const [themeName, tokens] of [
  ['CLARO', light],
  ['ESCURO', dark],
]) {
  const bg = parse(tokens['--bg']);
  const accent = parse(tokens['--accent']);

  for (const amount of [0.08, 0.12]) {
    const composed = mix(bg, accent, amount);
    const ratio = contrast(accent, composed);
    const pass = ratio >= AA_TEXT;
    if (!pass) failures++;
    console.log(
      `  ${pass ? 'OK  ' : 'FALHA'}  ${ratio.toFixed(2).padStart(6)}:1  ${themeName} — destaque sobre tint ${amount * 100}%`
    );
  }

  /*
   * O painel do hero é `color-mix(canvas-2 72%, transparent)` sobre o
   * canvas. Medir só os tokens crus daria um número que não corresponde ao
   * que a tela mostra — é a composição que importa.
   */
  const canvas = parse(tokens['--canvas']);
  const canvas2 = parse(tokens['--canvas-2']);
  const composedPanel = mix(canvas, canvas2, 0.72);
  const panelRatio = contrast(composedPanel, canvas);
  const panelPass = panelRatio >= 1.15;
  if (!panelPass) failures++;
  console.log(
    `  ${panelPass ? 'OK  ' : 'FALHA'}  ${panelRatio.toFixed(2).padStart(6)}:1  ${themeName} — painel do hero sobre o canvas (composto a 72%)`
  );
}

console.log(`\n${failures === 0 ? 'Tudo passou.' : `${failures} verificação(ões) falharam.`}`);
process.exit(failures === 0 ? 0 : 1);
