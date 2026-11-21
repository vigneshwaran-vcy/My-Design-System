# My Design System

A React + TypeScript design system: design tokens and a component library, documented in Storybook.

| Package | What it is |
|---|---|
| [`@my-ds/tokens`](packages/tokens) | Colours, spacing, sizes, radii and shadows as CSS variables and JS (light + dark) |
| [`@my-ds/ui`](packages/ui) | 51 React components built only on those tokens |

Docs: <https://vigneshwaran-vcy.github.io/My-Design-System/>

## Develop

Needs Node 20+ and pnpm 9.

```bash
pnpm install
pnpm dev          # playground  → http://localhost:5173
pnpm storybook    # Storybook   → http://localhost:6006
pnpm test         # token guardrails + component tests
pnpm typecheck
```

Project rules (tokens only, sizes, density, icons, buttons) live in [CLAUDE.md](CLAUDE.md).

## Release workflow

Keep iterating on `main` as usual. Releasing is a separate, deliberate step:

1. After a change users should hear about, run `pnpm changeset`, pick the bump
   (patch = fix, minor = new feature, major = breaking change) and write one line about it.
   Commit the generated file in `.changeset/` with your change.
2. When you want to release, run `pnpm version-packages`. It bumps both packages to the same version,
   writes `CHANGELOG.md` and removes the used changeset files. Commit that.
3. Tag and push: `git tag v<version> && git push origin main --tags`. The **Publish packages** workflow tests,
   builds and publishes to the registry (needs the `NPM_TOKEN` repo secret).

Pushing to `main` without a tag never publishes. It only runs CI and redeploys the Storybook docs.

## Licence

Proprietary. All rights reserved. See [LICENSE](LICENSE).
