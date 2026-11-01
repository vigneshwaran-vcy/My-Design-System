# My Design System — Rules for Claude

## Personality
Calm, minimal, high-contrast. Rounded but not bubbly.

## Tokens (single source of truth: packages/tokens)
- Colors: primary #4F46E5, neutral gray scale 50–900, success/warn/danger
- Spacing: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64)
- Radius: sm 4px, md 8px, lg 16px, full
- Typography: Inter; sizes xs–4xl; weights 400/500/600
- Shadows: sm, md, lg. Motion: 150ms / 250ms ease-out
- Must support light and dark themes

## Component rules
- Never hard-code colors, spacing or sizes. Always use tokens.
- Every component: variants, sizes, disabled/focus/hover states, a11y (keyboard + ARIA)
- Every component gets a story and a test

## Tech
React + TypeScript, CSS variables, Vite, Storybook, pnpm workspaces

## Repo layout
```
packages/tokens/   tokens.json → scripts/build.mjs → dist/tokens.css + dist/index.js (+ .d.ts)
packages/ui/       React components, one folder each: Component.tsx, .css, .stories.tsx, .test.tsx
apps/docs/         Storybook (stories are loaded from packages/ui/src)
apps/playground/   Vite app that imports @my-ds/ui from source
.github/workflows/ ci.yml, publish.yml, deploy.yml
```

## How tokens work
- Primitives live under `palette`, `space`, `radius`, `font`, `size`, `border`, `motion`.
  They become `--ds-<path>` variables (a trailing `default` key is dropped: `palette.primary.default` → `--ds-palette-primary`).
- Semantic, theme-aware tokens live under `themes.light` / `themes.dark` and become `--ds-color-*` and `--ds-shadow-*`.
  Both themes must define exactly the same keys (the build fails otherwise).
- Components use **semantic** tokens (`--ds-color-text`, `--ds-color-accent`), never `--ds-palette-*` directly.
- Theme switch: `data-theme="light|dark"` on `<html>`; with no attribute the OS preference is followed.
- Need a value that does not exist? Add it to `tokens.json` first, then use it.

## Guardrails (enforced by tests)
`packages/ui/src/test/tokens.test.ts` fails if any component CSS contains a hex/rgb/hsl colour or a
px/rem/em/ms/s literal, or references a `--ds-*` variable that the tokens build does not define.

## Adding a component
1. `packages/ui/src/components/<Name>/` with `<Name>.tsx`, `<Name>.css`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`
2. Class names: `ds-<name>`, modifiers `ds-<name>--<variant>`, elements `ds-<name>__<part>`
3. `forwardRef`, spread rest props, `variant` + `size` props, visible `:focus-visible` ring
4. Export from `packages/ui/src/index.ts`

## Commands
```
pnpm install
pnpm dev          # playground
pnpm storybook    # docs
pnpm test         # vitest in all packages
pnpm typecheck
pnpm build
```
