// Compiles the three token tiers into dist/:
//   1. primitives  tokens.json (everything except `themes`): raw values, e.g. palette.primary.600 = #0260FF
//   2. semantic    tokens.json `themes.light|dark`: what a value is for; may only reference primitives
//   3. component   components/<component>.json: one component's colour decisions; each is exactly one
//                  semantic token, e.g. button "primary-bg": "{gradient.accent}" → --ds-button-primary-bg
//
//   dist/tokens.css  – CSS custom properties for all three tiers (light + dark)
//   dist/index.js    – `tokens`, `vars`, `tokenList`, `componentVars`, `componentTokenList`
//   dist/index.d.ts  – types for the above
// `--check` validates the sources without writing anything.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

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
const ALPHA_BASE = { primary: '600', violet: '500', sky: '400', fuchsia: '500', danger: '600', gray: '900', neutral: '900' };
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

// Raw colour values belong to the primitive tier only.
for (const name of themeNames) {
  for (const [path, value] of flatten(themes[name])) {
    if (/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|color-mix)\(/i.test(value)) {
      throw new Error(`themes.${name}.${path.join('.')} contains a raw colour (${value}); reference a palette primitive instead`);
    }
  }
}

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

// Component tier: components/<component>.json is a flat map of token → "{semantic.token}".
const SEMANTIC_GROUPS = Object.keys(themes[themeNames[0]]);
const semanticNames = new Set(light.map(([path]) => path.join('.')));
const takenVars = new Set([...primitiveEntries, ...light].map(([path]) => varName(path)));
const componentsDir = new URL('components/', root);
const componentFiles = readdirSync(componentsDir).filter((f) => f.endsWith('.json')).sort();
const componentTokens = componentFiles.flatMap((file) => {
  const component = file.replace(/\.json$/, '');
  if (!/^[a-z][a-z0-9-]*$/.test(component)) throw new Error(`components/${file}: file name must be kebab-case`);
  return Object.entries(JSON.parse(readFileSync(new URL(file, componentsDir), 'utf8'))).map(([key, value]) => {
    const where = `components/${file} "${key}"`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) throw new Error(`${where}: token names must be kebab-case`);
    const ref = typeof value === 'string' ? value.match(/^\{([^}]+)\}$/)?.[1] : undefined;
    if (!ref) throw new Error(`${where}: value must be exactly one semantic reference like "{color.bg.accent}", got ${JSON.stringify(value)}`);
    if (!SEMANTIC_GROUPS.includes(ref.split('.')[0]) || !semanticNames.has(ref)) {
      throw new Error(`${where}: {${ref}} is not a semantic token (component tokens may not point at primitives)`);
    }
    const cssVar = `--${PREFIX}-${component}-${key}`;
    if (takenVars.has(cssVar)) throw new Error(`${where}: ${cssVar} collides with an existing token`);
    takenVars.add(cssVar);
    return { name: `${component}.${key}`, cssVar, component, ref, refVar: varName(ref.split('.')) };
  });
});

const css = [
  '/* Generated from tokens.json — do not edit by hand. */',
  block(':root', [...primitiveEntries, ...light], ['color-scheme: light;']),
  // Component tokens alias semantic tokens, so they follow the theme without being repeated per theme.
  `/* Component tokens */\n:root {\n${componentTokens.map((t) => `  ${t.cssVar}: var(${t.refVar});`).join('\n')}\n}\n`,
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
const componentVars = {};
for (const t of componentTokens) (componentVars[t.component] ??= {})[t.name.slice(t.component.length + 1)] = `var(${t.cssVar})`;
const componentTokenList = componentTokens.map(({ refVar: _refVar, ...t }) => t);

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

export interface ComponentTokenEntry {
  /** "<component>.<token>", e.g. "button.primary-bg". */
  name: string;
  cssVar: string;
  component: string;
  /** The semantic token it aliases, e.g. "gradient.accent". */
  ref: string;
}

export declare const themeNames: ${JSON.stringify(themeNames)};
export declare const tokenList: TokenEntry[];
export declare const componentTokenList: ComponentTokenEntry[];
`;

if (process.argv.includes('--check')) {
  console.log(`tokens OK — ${primitiveEntries.length} primitives, ${light.length} semantic tokens × ${themeNames.length} themes, ${componentTokens.length} component tokens in ${componentFiles.length} components`);
  process.exit(0);
}

const dist = new URL('dist/', root);
mkdirSync(dist, { recursive: true });
writeFileSync(new URL('tokens.css', dist), css);
writeFileSync(
  new URL('index.js', dist),
  `// Generated from tokens.json — do not edit by hand.\nexport const tokens = ${JSON.stringify(source, null, 2)};\n\nexport const vars = ${JSON.stringify(vars, null, 2)};\n\nexport const themeNames = ${JSON.stringify(themeNames)};\n\nexport const tokenList = ${JSON.stringify(tokenList, null, 2)};\n\nexport const componentVars = ${JSON.stringify(componentVars, null, 2)};\n\nexport const componentTokenList = ${JSON.stringify(componentTokenList, null, 2)};\n`,
);
writeFileSync(
  new URL('index.d.ts', dist),
  `// Generated from tokens.json — do not edit by hand.\nexport declare const tokens: ${JSON.stringify(source, null, 2)};\n\nexport declare const vars: ${JSON.stringify(vars, null, 2)};\n\nexport declare const componentVars: ${JSON.stringify(componentVars, null, 2)};\n\n${tokenListTypes}`,
);
console.log(`@my-ds/tokens built → dist/ (${primitiveEntries.length} primitives, ${light.length} semantic tokens, ${componentTokens.length} component tokens)`);
