# My Design System — Rules for Claude

## Personality
Premium flat UI (shadcn, Notion, Align UI): vivid blue accent, solid flat fills, soft neutral shadows with a 1px ring edge,
soft focus rings, solid popovers. No gloss anywhere (no white top highlights, sheens, glassy blur or glossy gradients) except the premium solid buttons: Primary, Delete and the ChatInput send button keep a faint top sheen (`gradient.accent`/`danger`) and a raised shadow with a top highlight and bottom bevel (`shadow.raised`). Buttons never move on hover or press (no lift, no shrink); hover only changes fill and shadow. Rounded but not bubbly. Still high-contrast text.

## Tokens (single source of truth: packages/tokens)
- Colors (each a 50–950 ramp): primary 600 #0260FF (vivid blue; white text passes AA at 5.1:1), violet + pink (AI gradient and glow only), gray, success/warn/danger
- Gradients (`--ds-gradient-*`): accent, accentHover, accentActive, accentSubtle(+Hover/Active), danger, dangerHover, dangerActive, surface, surfaceHover, ai.
  Fills are flat (`linear-gradient(c, c)`, kept as gradients so components can layer them), except accent/danger (+Hover) which add a 10% white top sheen for the premium Primary/Delete look. `ai` is the only multi-colour gradient.
- Spacing: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64)
- Radius: sm 4px, md 8px, control 12px (default for controls), lg 16px, xl 24px (large surfaces), full
- Typography: Inter; sizes xs–4xl; weights 400/500/600 (buttons use 500)
- Sizes: button xs 22 / sm 26 / md 32 / lg 40 (`size.button`); inputs & dropdowns sm 32 / md 40 / lg 48 (`size.control`);
  icons xs 12 / sm 16 / md 20 / lg 24; avatar xs 24 … xl 64; checkbox 16; switch 36×20
- Layers (z-index, `--ds-layer-*`): dropdown 10, sticky 20, overlay 30, modal 40, toast 50, tooltip 60 — never write a raw z-index
- Shadows: surface, surfaceHover, overlay (floating panels: menu, popover, modal, toast), control, controlHover, controlPressed, flat, flatHover, raised, raisedHover, pressed, sm, md, lg, soft, softHover, inset, accent, accentHover, accentActive, danger, dangerHover, dangerActive, focus, focusDanger, glow
- Motion: 150ms / 250ms ease-out, spring easing for pop-in. Blur: md 12px (glass)
- Must support light and dark themes

## Component rules
- Edges and elevation (Align UI style): draw a raised element's edge as a 1px ring inside its shadow, not a border.
  - `--ds-shadow-surface` / `-hover`: cards, popovers, the chat box, framed panels (ring + stacked faint shadows + inner bottom shade).
  - `--ds-shadow-control` / `-hover` / `-pressed`: inputs, dropdown triggers.
  - `--ds-shadow-flat` / `-hover`: ring + a small soft shadow, for flat controls (the Secondary button: solid fill, no gradient or sheen).
  - Keep `border: thin solid transparent` so forced-colors mode still draws an edge; focus/invalid states may still colour the border.
  - Grouped content sits in a frame: `--ds-color-bg-frame`, padding space-3, radius xl, with inset surfaces at
    radius `calc(xl - space-3)` so corners stay concentric.
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
apps/playground/   Living docs: every token (rendered from tokenList) + component docs; imports @my-ds/ui from source
.github/workflows/ ci.yml, publish.yml, deploy.yml
```

## How tokens work
- Primitives live under `palette`, `space`, `radius`, `font`, `size`, `border`, `blur`, `motion`, `breakpoint`.
  They become `--ds-<path>` variables (a trailing `default` key is dropped: `size.icon.default` → `--ds-size-icon`).
- Every hue in `palette` (primary, violet, pink, gray, success, warn, danger) is a 50–950 ramp: 50 lightest, 950 darkest.
  Key steps: primary 600 `#0260FF` is the brand blue (hover 700, pressed 800, dark-mode text 400, tint 50);
  status colours use 600 as the main shade, 100 for light tints and 900 for dark tints. Plus single `white` and `black`.
- Semantic, theme-aware tokens live under `themes.light` / `themes.dark` and become `--ds-color-*`, `--ds-gradient-*` and `--ds-shadow-*`.
  Both themes must define exactly the same keys (the build fails otherwise).
- Three layers: **raw value** (`#0260FF`, only in tokens.json) → **primitive** (`palette.primary.600`, says what it is)
  → **semantic** (`color.bg.accent`, says what it is for; can differ per theme). Components use semantic only.
  The docs site's "Token layers" page shows the full mapping.
- Alpha primitives: `palette.<colour>Alpha.<5|10|15|20|25|30|40|50|60|80>` built on primary 600, violet 500,
  danger 600, gray 900, black and white (`ALPHA_BASE` in build.mjs), written as 8-digit hex (`primaryAlpha.20` = `#0260FF33`). Use them for every see-through colour in
  semantic tokens (shadows, tints, glass); never write `color-mix()` or `rgb(… / a)` in tokens.json. The build fails
  if an alpha value no longer matches its base colour.
- Semantic colours are grouped by role, then by intent and state (`color.<role>.<intent>.<state>`):
  - `bg`: canvas, page, sidebar, surface, subtle, disabled, frame, overlay (modal scrim), inverse (tooltips), glass,
    neutral.{hover,active}, accent.{default,hover,active,subtle}, danger.{default,hover,subtle}, success.{default,subtle},
    warn.{default,subtle} → `--ds-color-bg-surface`, `--ds-color-bg-accent-hover`
  - `text`: default, muted, disabled, accent, danger, success, warn, inverse, onAccent, onDanger, onSuccess, onWarn → `--ds-color-text-muted`, `--ds-color-text-on-accent`
  - `border`: default, strong, accent, danger, success, warn, focus → `--ds-color-border`, `--ds-color-border-focus`
  Pick by what you are painting: a fill uses `bg`, text/icons use `text`, edges and rings use `border`.
- Components use **semantic** tokens (`--ds-color-text`, `--ds-color-bg-accent`), never `--ds-palette-*` directly.
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
