/**
 * Conserta mojibake em arquivos de texto.
 *
 * O PowerShell, ao ler e regravar um arquivo UTF-8 sem BOM com
 * `Get-Content -Raw` + `Set-Content -Encoding UTF8`, interpreta os bytes
 * como Latin-1 e grava de novo — cada acento vira dois caracteres.
 *
 * Aqui os bytes são lidos como latin1 e reinterpretados como utf8, que é
 * exatamente a operação inversa. Também remove o BOM que o `Set-Content`
 * do PowerShell 5.1 insere.
 *
 * Só roda sobre os arquivos passados na linha de comando, e nunca sobre
 * este aqui.
 *
 *   node scripts/fix-encoding.mjs <arquivo...>
 */

import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

/*
 * O padrão é montado por pontos de código, e não escrito literalmente: um
 * regex literal com os caracteres de mojibake casaria com o próprio
 * comentário que o descreve, e o script "consertaria" a si mesmo.
 */
const MOJIBAKE = new RegExp(
  '\\u00c3[\\u0080-\\u00bf]' + // "Ã©", "Ã£", "Ã§"
    '|\\u00e2\\u20ac[\\u0080-\\u00bf\\u2122\\u0153]' + // "â€”", "â€œ"
    '|\\u00c3\\u0192\\u00c2' // ciclo duplo
);

function undoSinglePass(text) {
  return Buffer.from(text, 'latin1').toString('utf8');
}

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

const files = process.argv.slice(2).filter((f) => basename(f) !== 'fix-encoding.mjs');

if (files.length === 0) {
  console.error('Uso: node scripts/fix-encoding.mjs <arquivo...>');
  process.exit(2);
}

let changed = 0;

for (const file of files) {
  const raw = await readFile(file, 'utf8');
  let text = stripBom(raw);
  const hadBom = text !== raw;

  let rounds = 0;
  while (MOJIBAKE.test(text) && rounds < 3) {
    text = undoSinglePass(text);
    rounds++;
  }

  if (rounds > 0 || hadBom) {
    await writeFile(file, text, 'utf8');
    changed++;
    console.log(
      `corrigido: ${file}  (${rounds} passada(s)${hadBom ? ', BOM removido' : ''})`
    );
  } else {
    console.log(`ok:        ${file}`);
  }
}

console.log(`\n${changed} arquivo(s) alterado(s).`);
