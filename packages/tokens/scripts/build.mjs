// Compiles tokens.json into:
//   dist/tokens.css  – CSS custom properties (primitives + light/dark semantic themes)
//   dist/index.js    – `tokens` (raw values) and `vars` (var(--ds-…) references) for TS/JS
//   dist/index.d.ts  – literal types for both
// `--check` validates tokens.json without writing anything.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const PREFIX = 'ds';
const root = new URL('../', import.meta.url);
const source = JSON.parse(readFileSync(new URL('tokens.json', root), 'utf8'));
const { themes, ...primitives } = source;

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const varName = (path) =>
  `--${PREFIX}-${path.filter((p) => p !== 'default').map(kebab).join('-')}`;

function flatten(obj, path = [], out = []) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') flatten(value, [...path, key], out);
    else out.push([[...path, key], String(value)]);
  }
  return out;
}

// "{palette.gray.900}" → "var(--ds-palette-gray-900)"
function resolve(value) {
  return value.replace(/\{([^}]+)\}/g, (_, ref) => {
    const path = ref.split('.');
    const target = path.reduce((node, key) => node?.[key], primitives);
    if (typeof target !== 'string') throw new Error(`Unknown token reference {${ref}}`);
    return `var(${varName(path)})`;
  });
}

const themeNames = Object.keys(themes);
const keysOf = (theme) => flatten(theme).map(([p]) => p.join('.')).sort().join('|');
for (const name of themeNames.slice(1)) {
  if (keysOf(themes[name]) !== keysOf(themes[themeNames[0]])) {
    throw new Error(`Theme "${name}" does not define the same tokens as "${themeNames[0]}"`);
  }
}

const block = (selector, entries, extra = []) =>
  `${selector} {\n${[...extra, ...entries.map(([p, v]) => `${varName(p)}: ${resolve(v)};`)]
    .map((l) => `  ${l}`)
    .join('\n')}\n}\n`;

const primitiveEntries = flatten(primitives);
const light = flatten(themes.light);
const dark = flatten(themes.dark);

const css = [
  '/* Generated from tokens.json — do not edit by hand. */',
  block(':root', [...primitiveEntries, ...light], ['color-scheme: light;']),
  block(':root[data-theme="dark"]', dark, ['color-scheme: dark;']),
  `@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', dark, ['color-scheme: dark;'])
    .split('\n')
    .map((l) => (l ? `  ${l}` : l))
    .join('\n')}}\n`,
].join('\n');

// Nested object mirroring the token tree, with var(--ds-…) leaves.
function toVars(entries) {
  const out = {};
  for (const [path] of entries) {
    let node = out;
    path.slice(0, -1).forEach((key) => (node = node[key] ??= {}));
    node[path.at(-1)] = `var(${varName(path)})`;
  }
  return out;
}
const vars = toVars([...primitiveEntries, ...light]);

if (process.argv.includes('--check')) {
  console.log(`tokens.json OK — ${primitiveEntries.length} primitives, ${light.length} semantic tokens × ${themeNames.length} themes`);
  process.exit(0);
}

const dist = new URL('dist/', root);
mkdirSync(dist, { recursive: true });
writeFileSync(new URL('tokens.css', dist), css);
writeFileSync(
  new URL('index.js', dist),
  `// Generated from tokens.json — do not edit by hand.\nexport const tokens = ${JSON.stringify(source, null, 2)};\n\nexport const vars = ${JSON.stringify(vars, null, 2)};\n`,
);
writeFileSync(
  new URL('index.d.ts', dist),
  `// Generated from tokens.json — do not edit by hand.\nexport declare const tokens: ${JSON.stringify(source, null, 2)};\n\nexport declare const vars: ${JSON.stringify(vars, null, 2)};\n`,
);
console.log(`@my-ds/tokens built → dist/ (${primitiveEntries.length} primitives, ${light.length} semantic tokens)`);
