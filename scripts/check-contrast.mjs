/**
 * Verificação de contraste WCAG dos tokens de cor.
 *
 * Lê os tokens de src/index.css (blocos por tema), converte OKLCH/hex para
 * sRGB e calcula a razão de contraste dos pares que aparecem na interface.
 * Roda com `node scripts/check-contrast.mjs`.
 *
 * Limite conhecido: valores com color-mix() não são calculáveis aqui — os
 * pares abaixo usam o token puro sobre o fundo mais próximo, que é o caso
 * dominante na interface. A conferência visual continua necessária.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, '..', 'src', 'index.css'), 'utf8');

/**
 * Extrai os tokens de um bloco cujo seletor COMEÇA a linha.
 * Um indexOf simples casaria com o ":root:not([data-theme='dark'])" do
 * bloco claro ao procurar o bloco escuro.
 */
function readBlock(selector) {
  const re = new RegExp(`^${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm');
  const match = re.exec(css);
  if (!match) throw new Error(`Seletor não encontrado: ${selector}`);
  const index = match.index;

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

/** Converte o valor textual de um token (oklch(...) ou #hex) para [r,g,b] 0..1. */
function parseColor(value) {
  const oklch = value.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (oklch) {
    return oklchToRgb(Number(oklch[1]) / 100, Number(oklch[2]), Number(oklch[3]));
  }
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  return null;
}

function relativeLuminance([r, g, b]) {
  const lin = [r, g, b].map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/* --- Pares verificados ---------------------------------------------------- */

const themes = {
  light: readBlock("[data-theme='light']"),
  dark: readBlock("[data-theme='dark']"),
};

/**
 * [primeiro plano, fundo, mínimo, descrição]
 * 4.5 = texto corrido (WCAG 1.4.3); 3.0 = texto grande e elementos
 * gráficos/da interface (WCAG 1.4.11).
 */
const pairs = [
  ['--fg', '--bg', 4.5, 'texto principal sobre a página'],
  ['--fg', '--bg2', 4.5, 'texto principal sobre cards'],
  ['--muted', '--bg', 4.5, 'texto secundário sobre a página'],
  ['--muted', '--bg2', 4.5, 'texto secundário sobre cards'],
  ['--accent', '--bg', 4.5, 'links e chips de stack (texto pequeno)'],
  ['--accent', '--bg2', 4.5, 'links/chips sobre cards'],
  ['--accent-contrast', '--accent-solid', 4.5, 'texto nos botões sólidos'],
  ['--ok', '--bg2', 3.0, 'selo de status (texto 11px bold uppercase, uso gráfico)'],
  ['--border', '--bg', 1.2, 'borda sobre página (apenas sanidade, sem exigência WCAG)'],
];

const brandMin = 3.0; // WCAG 1.4.11 — elementos gráficos

let failures = 0;

for (const [themeName, tokens] of Object.entries(themes)) {
  console.log(`\n=== Tema ${themeName} ===`);

  for (const [fgToken, bgToken, min, label] of pairs) {
    const fg = parseColor(tokens[fgToken] ?? '');
    const bg = parseColor(tokens[bgToken] ?? '');
    if (!fg || !bg) {
      console.log(`  ?  ${fgToken} / ${bgToken}: valor não calculável (${label})`);
      continue;
    }
    const ratio = contrast(fg, bg);
    const pass = ratio >= min;
    if (!pass) failures++;
    console.log(
      `  ${pass ? 'OK ' : 'FAL'} ${ratio.toFixed(2)}:1 (mín ${min}) ${fgToken} sobre ${bgToken} — ${label}`
    );
  }

  // Cores de marca (ícones) sobre o fundo dos chips (--bg)
  for (const [token, value] of Object.entries(tokens)) {
    if (!token.startsWith('--brand-')) continue;
    const color = parseColor(value);
    const bg = parseColor(tokens['--bg']);
    if (!color || !bg) continue;
    const ratio = contrast(color, bg);
    const pass = ratio >= brandMin;
    if (!pass) failures++;
    if (!pass || process.env.VERBOSE === '1') {
      console.log(`  ${pass ? 'OK ' : 'FAL'} ${ratio.toFixed(2)}:1 (mín ${brandMin}) ${token} sobre --bg`);
    }
  }
}

if (failures > 0) {
  console.log(`\n${failures} par(es) reprovado(s).`);
  process.exit(1);
}
console.log('\nTodos os pares aprovados.');
