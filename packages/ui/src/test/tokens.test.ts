// @vitest-environment node
// Guardrail for the "never hard-code colors, spacing or sizes" rule and the three token tiers
// (primitive → semantic → component): component CSS takes its colours from its own component tokens.
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { componentTokenList, tokenList } from '@my-ds/tokens';
import { describe, expect, it } from 'vitest';

const srcDir = fileURLToPath(new URL('..', import.meta.url));
const cssFiles = (readdirSync(srcDir, { recursive: true }) as string[])
  .filter((f) => f.endsWith('.css'))
  .map((f) => join(srcDir, f));

const tokensCss = readFileSync(createRequire(import.meta.url).resolve('@my-ds/tokens/tokens.css'), 'utf8');
const definedVars = new Set(tokensCss.match(/--ds-[a-z0-9-]+(?=:)/g));

// Colour-carrying tokens of the lower tiers: palette primitives and the themed semantic tokens.
const lowerTierColours = new Set(tokenList.filter((t) => t.category === 'palette' || t.themes).map((t) => t.cssVar));
const componentOf = new Map(componentTokenList.map((t) => [t.cssVar, t.component]));
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const HARD_CODED = [
  { label: 'hex colour', re: /#[0-9a-f]{3,8}\b/gi },
  { label: 'rgb()/hsl() colour', re: /\b(?:rgba?|hsla?)\(/gi },
  { label: 'length/time literal', re: /(?<![\w-])\d*\.?\d+(?:px|rem|em|ms|s)\b/gi },
  // Page-level stacking goes through --ds-layer-*; 0/1 only order siblings inside a component.
  { label: 'z-index layer', re: /z-index:\s*(?:[2-9]|\d{2,})/gi },
  // Partial opacity and scale go through --ds-opacity-* and --ds-motion-scale-*; 0 and 1 are fine.
  { label: 'opacity level', re: /opacity:\s*0?\.\d/gi },
  { label: 'scale factor', re: /scale(?::\s*|\(\s*)\d*\.\d/gi },
  { label: 'viewport unit', re: /(?<![\w-])\d*\.?\d+(?:d|s|l)?v(?:w|h|min|max)\b/gi },
];

describe.each(cssFiles.map((f) => [f.slice(srcDir.length), f]))('%s', (_, file) => {
  const css = stripComments(readFileSync(file, 'utf8'));

  it.each(HARD_CODED)('has no hard-coded $label', ({ re }) => {
    expect(css.match(re) ?? []).toEqual([]);
  });

  it('only references --ds-* variables that exist in @my-ds/tokens', () => {
    const used = [...css.matchAll(/var\((--ds-[a-z0-9-]+)/g)].map((m) => m[1]);
    expect(used.filter((v) => !definedVars.has(v))).toEqual([]);
  });

  it('takes colours, gradients and shadows from its own component tokens, not semantic or palette tokens', () => {
    const used = [...new Set([...css.matchAll(/var\((--ds-[a-z0-9-]+)/g)].map((m) => m[1]))];
    expect(used.filter((v) => lowerTierColours.has(v))).toEqual([]);
    // components/<Name>/<Name>.css may only use tokens from packages/tokens/components/<name>.json
    const component = kebab(file.split(/[\\/]/).at(-2) ?? '');
    expect(used.filter((v) => componentOf.has(v) && componentOf.get(v) !== component)).toEqual([]);
  });
});

describe('component tokens', () => {
  it('are all used by their component (no dead tokens)', () => {
    const used = new Set(cssFiles.flatMap((f) => stripComments(readFileSync(f, 'utf8')).match(/--ds-[a-z0-9-]+/g) ?? []));
    expect(componentTokenList.filter((t) => !used.has(t.cssVar)).map((t) => t.name)).toEqual([]);
  });
});
