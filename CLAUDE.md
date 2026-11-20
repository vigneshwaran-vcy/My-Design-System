# My Design System — Rules for Claude

## Personality
Premium flat UI (shadcn, Notion, Align UI): vivid blue accent, solid flat fills, soft neutral shadows with a 1px ring edge,
soft focus rings, solid popovers. No gloss anywhere (no white top highlights, sheens, glassy blur or glossy gradients) except the premium solid buttons: Primary, Delete and the ChatInput send button keep a faint top sheen (`gradient.accent`/`danger`) and a raised shadow with a top highlight and bottom bevel (`shadow.raised`). Buttons never move on hover or press (no lift, no shrink); hover only changes fill and shadow. Rounded but not bubbly. Still high-contrast text.

## Tokens (single source of truth: packages/tokens)
- Colors (each a 50–950 ramp): primary 600 #0260FF (vivid blue; white text passes AA at 5.1:1), violet, sky + fuchsia (AI gradient only), pink, gray (cool; light theme), neutral (pure grey; dark theme), success/warn/danger
- Gradients (`--ds-gradient-*`): accent, accentHover, accentActive, accentSubtle(+Hover/Active), danger, dangerHover, dangerActive, surface, surfaceHover, neutralHover, neutralActive, and the AI family: ai, aiHover, aiActive, aiSubtle(+Hover), aiText, aiMesh, aiConic.
  Fills are flat (`linear-gradient(c, c)`, kept as gradients so components can layer them), except accent/danger (+Hover) which add a 10% white top sheen for the premium Primary/Delete look. The AI family is the only multi-colour gradient: blue-led, sky 400 → **blue 600 held 28–58%** → violet 500 → fuchsia 500 at 120°.
  Use it only for AI features: fills (ai/aiHover/aiActive), tinted results (aiSubtle), gradient text (aiText — darker stops in light theme for contrast),
  1px AI edges (ai on border-box), panel washes (aiMesh) and thinking rings (aiConic). No coloured glows.
- Spacing: 4px base scale (4, 8, 12, 16, 24, 32, 48, 64)
- Radius: sm 4px, md 8px, control 12px (default for controls), lg 16px, xl 24px (large surfaces), full
- Typography: Inter; sizes xs–4xl; weights 400/500/600 (buttons use 500)
- Sizes: button xs 22 / sm 26 / md 32 / lg 40 (`size.button`); inputs & dropdowns sm 26 / md 32 / lg 36 (`size.control`; sm and md match buttons, lg fields are 36 while lg buttons stay 40);
  icons xs 12 / sm 16 / md 20 / lg 24; avatar xs 24 … xl 64; checkbox 16 (sm 14); switch 36×20 (sm 28×16);
  badge sm 16 / md 20; kbd sm 20 / md 22; tile sm 40 / md 48 (empty-state icon tile);
  panel widths xs 192 / sm 256 / md 320 / lg 384 / xl 512 / 2xl 768 (menus, tooltips, popovers, toasts, modals)
- Density: compact by default. Control radius follows height (22 → sm 4, 26–32 → md 8, 36–40 → control 12).
  List rows (menu items, options) are 30; tabs 32 (sm 26); tree rows 26 (sm 22); sidebar nav rows 32 (sm 26) with a 2px gap (sm 1px); table cells pad 8 (sm 4).
  Surfaces pad 12–16: Card sm 12 / md 16 / lg 24 (radius control / lg / xl), Modal 16, Popover and Alert 12.
  Field label-to-control gap is 4. Don't add height with padding; pick the next size up instead.
- Layers (z-index, `--ds-layer-*`): dropdown 10, sticky 20, overlay 30, modal 40, toast 50, tooltip 60 — never write a raw z-index
- Shadows: surface, surfaceHover, overlay (floating panels: menu, popover, modal, toast), control, controlHover, controlPressed, flat, flatHover, raised, raisedHover, pressed, sm, md, lg, soft, softHover, inset, accent, accentHover, accentActive, danger, dangerHover, dangerActive, focus, focusDanger, glow
- Motion: 150ms / 250ms ease-out, spring easing for pop-in; scale `motion.scale` pop 0.97 (panels pop in from), mark 0.5 (checkbox/radio marks), pulse 1.12. Blur: md 12px (glass)
- Opacity (`--ds-opacity-*`): 20 / 30 / 40 / 70 / 80 for de-emphasised icons, spinner tracks and pulses — never a raw decimal opacity (0 and 1 are fine)
- Must support light and dark themes. Dark is a true neutral (no blue tint): page neutral 950, surfaces + sidebar 900,
  subtle/hover fills 800, pressed 700, borders 800/700, text 50 / muted 400. Never point a dark semantic token at the `gray` ramp.

## Component rules
- Edges and elevation (Align UI style): draw a raised element's edge as a 1px ring inside its shadow, not a border.
  - `--ds-shadow-surface` / `-hover`: cards, popovers, the chat box, framed panels (ring + stacked faint shadows + inner bottom shade).
  - `--ds-shadow-control` / `-hover` / `-pressed`: inputs, dropdown triggers.
  - `--ds-shadow-flat` / `-hover`: ring + a small soft shadow, for flat controls (the Secondary button: solid fill, no gradient or sheen).
  - Keep `border: thin solid transparent` so forced-colors mode still draws an edge; focus/invalid states may still colour the border.
  - Grouped content sits in a frame: `--ds-color-bg-frame`, padding space-3, radius xl, with inset surfaces at
    radius `calc(xl - space-3)` so corners stay concentric.
- Never hard-code colors, spacing or sizes. Always use tokens.
- **Colours come only from tokens, everywhere in this project** (components, playground, Storybook config, stories,
  demo data, inline styles). No raw hex/rgb/hsl, no named colours (`white`, `black`, `gray`…), no `color-mix()`,
  no opacity tricks to fake a shade. Components use their own `--ds-<component>-*` tokens; apps and docs use
  semantic `--ds-color-*` / `--ds-shadow-*` / `--ds-gradient-*`; JS that needs a colour value (e.g. ColorPicker
  swatches) reads it from `tokens.palette` in `@my-ds/tokens`. Need a colour that does not exist? Add the primitive,
  then a semantic token (then a component token) first. Only `transparent` and `currentColor` may be written directly.
- Icons: Solar, Linear style only (https://icones.js.org/collection/solar), via `<Icon name="…" />` from `components/Icon`.
  Never hand-draw an icon SVG. To add one, put its Solar name in `LINEAR` in `packages/ui/scripts/build-icons.mjs` and run
  `pnpm --filter @my-ds/ui icons` (regenerates `icons.generated.ts`; only listed icons are bundled). Bare `check`/`close`/`info`/`alert`
  are Solar's circled glyphs with the circle removed. Icons are decorative (aria-hidden) unless given `label`.
  Every icon stroke renders at a fixed 1.5px at any size (`--ds-border-width-icon`, set in `Icon.css` with
  `vector-effect: non-scaling-stroke`); the few Solar icons drawn as filled outlines get a thin matching outline.
  Never set a stroke width on an icon in component CSS.
  Only non-icon graphics stay as inline SVG: Progress ring, Spinner arc, Checkbox tick/dash.
- Buttons: Primary for the one main action, **Secondary for every other text action** (Cancel, Back, Learn more, menu
  triggers with text). Ghost is neutral (grey hover, never blue) and only for small icon-only or toolbar controls;
  don't use it for text actions. Modal footers: Secondary (Cancel) then Primary; a modal with a Cancel needs no ×.
- Every component: variants, sizes, disabled/focus/hover states, a11y (keyboard + ARIA)
- Every component gets a story and a test

## Tech
React + TypeScript, CSS variables, Vite, Storybook, pnpm workspaces

## Repo layout
```
packages/tokens/   tokens.json (primitive + semantic) + components/<name>.json (component tokens)
                   → scripts/build.mjs → dist/tokens.css + dist/index.js (+ .d.ts)
packages/ui/       React components, one folder each: Component.tsx, .css, .stories.tsx, .test.tsx
apps/docs/         Storybook (stories are loaded from packages/ui/src)
apps/playground/   Living docs: every token (rendered from tokenList) + component docs; imports @my-ds/ui from source
.github/workflows/ ci.yml, publish.yml, deploy.yml
```

## How tokens work
- Primitives live under `palette`, `space`, `radius`, `font`, `size`, `border`, `blur`, `motion`, `breakpoint`.
  They become `--ds-<path>` variables (a trailing `default` key is dropped: `size.icon.default` → `--ds-size-icon`).
- Every hue in `palette` (primary, violet, pink, sky, fuchsia, gray, success, warn, danger) is a 50–950 ramp: 50 lightest, 950 darkest.
  Key steps: primary 600 `#0260FF` is the brand blue (hover 700, pressed 800, dark-mode text 400, tint 50);
  status colours use 600 as the main shade, 100 for light tints and 900 for dark tints. Plus single `white` and `black`.
- Semantic, theme-aware tokens live under `themes.light` / `themes.dark` and become `--ds-color-*`, `--ds-gradient-*` and `--ds-shadow-*`.
  Both themes must define exactly the same keys (the build fails otherwise).
- Three tiers, each only pointing at the one below (the build fails otherwise):
  1. **Primitive** (`palette.primary.600` = `#0260FF`): says what a value is. The only place raw colour values live.
  2. **Semantic** (`color.bg.accent`, in `themes.light|dark`): says what it is for; differs per theme. References primitives only.
  3. **Component** (`button.primary-bg` → `--ds-button-primary-bg`, in `packages/tokens/components/button.json`): one
     component's colour decision. Each is exactly one semantic reference, e.g. `"primary-bg": "{gradient.accent}"`.
  Component CSS takes every colour, gradient and shadow from its **own** component tokens; apps and docs pages use semantic tokens.
  Naming: `<part>-<variant>-<property>-<state>` in kebab-case (`control-bg-checked-hover`, `placeholder-text`, `ring-focus`);
  properties are bg, text, border, shadow, ring (a colour inside a box-shadow), halo (focus glow), fill, stroke.
  The docs site's "Token layers" and "Component tokens" pages show the full mapping.
- Alpha primitives: `palette.<colour>Alpha.<5|10|15|20|25|30|40|50|60|80>` built on primary 600, violet 500, sky 400, fuchsia 500,
  danger 600, gray 900, black and white (`ALPHA_BASE` in build.mjs), written as 8-digit hex (`primaryAlpha.20` = `#0260FF33`). Use them for every see-through colour in
  semantic tokens (shadows, tints, glass); never write `color-mix()` or `rgb(… / a)` in tokens.json. The build fails
  if an alpha value no longer matches its base colour.
- Semantic colours are grouped by role, then by intent and state (`color.<role>.<intent>.<state>`):
  - `bg`: canvas, page, sidebar, surface, subtle, disabled, frame, overlay (modal scrim), inverse (tooltips), glass,
    neutral.{hover,active}, accent.{default,hover,active,subtle}, danger.{default,hover,subtle}, success.{default,subtle},
    warn.{default,subtle} → `--ds-color-bg-surface`, `--ds-color-bg-accent-hover`
  - `text`: default, muted, disabled, accent, danger, success, warn, inverse, onAccent, onDanger, onSuccess, onWarn → `--ds-color-text-muted`, `--ds-color-text-on-accent`
  - `border`: default, strong, control, accent, danger, success, warn, focus → `--ds-color-border`, `--ds-color-border-focus`
    (`control` / `controlHover` = gray 300 / 400 in light, neutral 700 / 600 in dark: the idle and hover edge shared by
    every form field and the checkbox and radio. `shadow.control*` rings use the same palette steps; keep them in sync).
    Switch: flat solid track (`color.bg.track(-hover)` off, `color.bg.accent(-hover)` on; no stroke or inner shade),
    a raised white knob (`shadow.knob`) that stretches while pressed, `shadow.focus` ring, and disabled = whole control at `opacity-40`.
    The docs theme toggle is a segmented control: recessed `shadow.track` with a sliding `color.bg.thumb` + `shadow.thumb`.
  Pick by what you are painting: a fill uses `bg`, text/icons use `text`, edges and rings use `border`.
- Components never use `--ds-color-*`, `--ds-gradient-*`, `--ds-shadow-*` or `--ds-palette-*` directly: add a component token.
  Sizes, spacing, radius, type and motion are still used straight from the primitive tier.
- `color.text.onLight` / `onDark` are fixed-contrast text for content on a known light or dark colour (swatches, images).
- Theme switch: `data-theme="light|dark"` on `<html>`; with no attribute the OS preference is followed.
- Need a value that does not exist? Add it to `tokens.json` first, then use it.

## Guardrails (enforced by tests)
`packages/ui/src/test/tokens.test.ts` fails if any component CSS contains a hex/rgb/hsl colour or a
px/rem/em/ms/s literal, a viewport unit, a z-index of 2 or more, a decimal opacity or scale, or references a `--ds-*` variable that the tokens build does not define;
or uses a semantic/palette colour token directly, another component's tokens, or leaves a component token unused.
The tokens build itself fails on a raw colour in a theme, a component token that is not exactly one semantic reference, or a name collision.

## Adding a component
1. `packages/ui/src/components/<Name>/` with `<Name>.tsx`, `<Name>.css`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`
2. Class names: `ds-<name>`, modifiers `ds-<name>--<variant>`, elements `ds-<name>__<part>`
3. `forwardRef`, spread rest props, `variant` + `size` props, visible `:focus-visible` ring
4. Colours: create `packages/tokens/components/<name>.json` (kebab-case file name = component name) and use `var(--ds-<name>-…)`
5. Export from `packages/ui/src/index.ts`

## Commands
```
pnpm install
pnpm dev          # playground
pnpm storybook    # docs
pnpm test         # vitest in all packages
pnpm typecheck
pnpm build
```
