// @vitest-environment node
// Guardrail for the "never hard-code colors, spacing or sizes" rule.
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const srcDir = fileURLToPath(new URL('..', import.meta.url));
const cssFiles = (readdirSync(srcDir, { recursive: true }) as string[])
  .filter((f) => f.endsWith('.css'))
  .map((f) => join(srcDir, f));

const tokensCss = readFileSync(createRequire(import.meta.url).resolve('@my-ds/tokens/tokens.css'), 'utf8');
const definedVars = new Set(tokensCss.match(/--ds-[a-z0-9-]+(?=:)/g));

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
});
