/* Generates src/icons/rune-icons.mjs from assets/rune-icons/*.svg.
 * The full Rune set is opt-in for consumers; component internals keep using
 * the curated control set (src/icons/controls.mjs).
 * Usage: node tools/build-rune-icons.mjs [--check] */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetDir = join(root, 'assets', 'rune-icons');
const outFile = join(root, 'src', 'icons', 'rune-icons.mjs');
const check = process.argv.includes('--check');

const files = readdirSync(assetDir).filter(f => f.endsWith('.svg')).sort();
const entries = files.map(f => '  "' + f.replace(/\.svg$/, '') + '": ' + JSON.stringify(readFileSync(join(assetDir, f), 'utf8')));

const body = [
  '/* GENERATED from assets/rune-icons — do not hand-edit. Rebuild: npm run build */',
  'const icons = {',
  entries.join(',\n'),
  '};',
  '',
  'export const RUNE_ICON_NAMES = Object.keys(icons);',
  '',
  'export function runeIcon(name, size = 16) {',
  "  if (typeof name === 'string' && name.trim().startsWith('<svg')) return name;",
  '  const art = icons[name];',
  "  if (!art) throw new TypeError('Unsupported rune icon: ' + name);",
  '  return art',
  '    .replace(/width="24"/, \'width="\' + size + \'"\')',
  '    .replace(/height="24"/, \'height="\' + size + \'"\')',
  '    .replace(\'<svg \', \'<svg aria-hidden="true" \')',
  '    .replace(/(stroke|fill)="black"/g, \'$1="currentColor"\');',
  '}',
  ''
].join('\n');

if (check) {
  let current = null;
  try { current = readFileSync(outFile, 'utf8'); } catch {}
  if (current !== body) {
    console.error('src/icons/rune-icons.mjs is stale — run: npm run build');
    process.exit(1);
  }
  console.log('rune-icons.mjs up to date (' + files.length + ' icons).');
} else {
  writeFileSync(outFile, body, 'utf8');
  console.log('Generated src/icons/rune-icons.mjs (' + files.length + ' icons).');
}
