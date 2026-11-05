# @my-ds/tokens

Single source of truth for the design system. Edit `tokens.json`, then `pnpm build`.

```ts
import '@my-ds/tokens/tokens.css';          // CSS variables (light + dark)
import { tokens, vars } from '@my-ds/tokens'; // raw values / var() references
vars.color.bg.accent // "var(--ds-color-bg-accent)"
```
