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

// Alpha primitives (palette.<colour>Alpha.<percent>) are a ramp step's hex plus an alpha byte;
// check they still match that step. White and black are single colours.
const ALPHA_BASE = { primary: '600', violet: '500', danger: '600', gray: '900' };
for (const [group, steps] of Object.entries(primitives.palette)) {
  const name = group.match(/^(.+)Alpha$/)?.[1];
  if (!name) continue;
  const node = primitives.palette[name];
  const base = typeof node === 'string' ? node : node?.[ALPHA_BASE[name]];
  if (!base) throw new Error(`palette.${group} has no base colour: add "${name}" to ALPHA_BASE in build.mjs`);
  for (const [pct, value] of Object.entries(steps)) {
    const expected = base.toUpperCase() + Math.round((Number(pct) / 100) * 255).toString(16).padStart(2, '0').toUpperCase();
    if (value.toUpperCase() !== expected) {
      throw new Error(`palette.${group}.${pct} is ${value}, expected ${expected} (${base} at ${pct}%)`);
    }
  }
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

// Flat, documentation-friendly list: every token with its CSS variable and (for themed tokens)
// the resolved value and source reference per theme.
const lookup = (ref) => ref.split('.').reduce((node, key) => node?.[key], primitives);
const resolveValue = (value) => value.replace(/\{([^}]+)\}/g, (_, ref) => lookup(ref));
const refOf = (value) => value.match(/^\{([^}]+)\}$/)?.[1];
const refsOf = (value) => [...new Set([...value.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]))];
const themed = Object.fromEntries(themeNames.map((name) => [name, new Map(flatten(themes[name]).map(([p, v]) => [p.join('.'), v]))]));
const tokenList = [
  ...primitiveEntries.map(([path, value]) => ({
    name: path.join('.'),
    cssVar: varName(path),
    category: path[0],
    group: path.slice(0, -1).join('.'),
    value,
  })),
  ...light.map(([path, value]) => ({
    name: path.join('.'),
    cssVar: varName(path),
    category: path[0],
    group: path.slice(0, -1).join('.'),
    value: resolveValue(value),
    themes: Object.fromEntries(
      themeNames.map((name) => {
        const raw = themed[name].get(path.join('.'));
        return [name, { value: resolveValue(raw), ref: refOf(raw), refs: refsOf(raw) }];
      }),
    ),
  })),
];

const tokenListTypes = `export interface ThemeValue {
  value: string;
  /** Primitive this semantic token points at, e.g. "palette.gray.900" (only when it is a single reference). */
  ref?: string;
  /** Every primitive the value is built from, e.g. a shadow's colours. */
  refs: string[];
}

export interface TokenEntry {
  /** Dot path in tokens.json, e.g. "space.4" or "color.bg.canvas". */
  name: string;
  cssVar: string;
  category: string;
  group: string;
  /** Resolved value (light theme for themed tokens). */
  value: string;
  themes?: Record<${themeNames.map((n) => `'${n}'`).join(' | ')}, ThemeValue>;
}

export declare const themeNames: ${JSON.stringify(themeNames)};
export declare const tokenList: TokenEntry[];
`;

if (process.argv.includes('--check')) {
  console.log(`tokens.json OK — ${primitiveEntries.length} primitives, ${light.length} semantic tokens × ${themeNames.length} themes`);
  process.exit(0);
}

const dist = new URL('dist/', root);
mkdirSync(dist, { recursive: true });
writeFileSync(new URL('tokens.css', dist), css);
writeFileSync(
  new URL('index.js', dist),
  `// Generated from tokens.json — do not edit by hand.\nexport const tokens = ${JSON.stringify(source, null, 2)};\n\nexport const vars = ${JSON.stringify(vars, null, 2)};\n\nexport const themeNames = ${JSON.stringify(themeNames)};\n\nexport const tokenList = ${JSON.stringify(tokenList, null, 2)};\n`,
);
writeFileSync(
  new URL('index.d.ts', dist),
  `// Generated from tokens.json — do not edit by hand.\nexport declare const tokens: ${JSON.stringify(source, null, 2)};\n\nexport declare const vars: ${JSON.stringify(vars, null, 2)};\n\n${tokenListTypes}`,
);
console.log(`@my-ds/tokens built → dist/ (${primitiveEntries.length} primitives, ${light.length} semantic tokens)`);
