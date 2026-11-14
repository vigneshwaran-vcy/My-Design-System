# @my-ds/tokens

Single source of truth for the design system, in three tiers. Each tier only points at the one below it.

| Tier | Where | Example | Rule |
|---|---|---|---|
| 1. Primitive | `tokens.json` (everything except `themes`) | `palette.primary.600` = `#0260FF` | The only place raw colour values live |
| 2. Semantic | `tokens.json` → `themes.light` / `themes.dark` | `color.bg.accent` → `{palette.primary.600}` | References primitives; differs per theme |
| 3. Component | `components/<component>.json` | `button` `"primary-bg": "{gradient.accent}"` | Exactly one semantic reference |

Edit the JSON, then `pnpm build`. The build fails on a raw colour in a theme, a component token that is not a
single semantic reference, mismatched themes, or a variable-name collision.

```ts
import '@my-ds/tokens/tokens.css';             // CSS variables for all three tiers (light + dark)
import { tokens, vars, componentVars, tokenList, componentTokenList } from '@my-ds/tokens';

vars.color.bg.accent               // "var(--ds-color-bg-accent)"
componentVars.button['primary-bg'] // "var(--ds-button-primary-bg)"
```

Restyle one component by pointing its token somewhere else, in `components/switch.json` or scoped in CSS:

```css
.billing-form {
  --ds-switch-control-bg-checked: var(--ds-color-bg-success);
}
```
