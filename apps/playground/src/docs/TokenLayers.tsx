import { themeNames, tokenList, type TokenEntry } from '@my-ds/tokens';
import { Button } from '@my-ds/ui';
import { useState } from 'react';
import { CopyButton, DocSection, SubSection } from './DocBlocks';

type Theme = (typeof themeNames)[number];

const byName = new Map(tokenList.map((t) => [t.name, t]));

// Which components use each --ds-* variable, read from the component CSS at build time.
const componentCss = import.meta.glob('../../../../packages/ui/src/components/*/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
const usedBy = new Map<string, string[]>();
for (const [path, css] of Object.entries(componentCss)) {
  const parts = path.split('/');
  const component = parts[parts.length - 2];
  for (const cssVar of new Set(css.match(/--ds-[a-z0-9-]+/g))) {
    usedBy.set(cssVar, [...(usedBy.get(cssVar) ?? []), component]);
  }
}

const ROLES = [
  ['bg', 'Fills: page, surfaces, buttons, tints'],
  ['text', 'Text and icons'],
  ['border', 'Edges, dividers and focus rings'],
  ['shadow', 'Elevation and glows, built from alpha colours'],
  ['gradient', 'Gradient fills, built from several colours'],
] as const;
type Role = (typeof ROLES)[number][0];

const semanticOf = (role: Role) =>
  tokenList.filter((t) => t.themes && (role === 'shadow' || role === 'gradient' ? t.category === role : t.name.startsWith(`color.${role}.`)));

// Start on the site's theme (App sets data-theme after this first render, so fall back to the OS preference).
const initialTheme = (): Theme => {
  const set = document.documentElement.dataset.theme;
  if (set === 'dark' || set === 'light') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function Swatch({ value }: { value: string }) {
  return <span className="tk-chip tk-chip--alpha" aria-hidden="true"><span style={{ background: value }} /></span>;
}

/** Preview of a semantic token as it is meant to be used, in the chosen theme. */
function Preview({ role, value, theme }: { role: Role; value: string; theme: Theme }) {
  const surface = byName.get('color.bg.surface')!.themes![theme].value;
  const border = byName.get('color.border.default')!.themes![theme].value;
  switch (role) {
    case 'text':
      return <span className="ly-preview ly-preview--text" style={{ color: value, background: surface, borderColor: border }} aria-hidden="true">Aa</span>;
    case 'border':
      return <span className="ly-preview" style={{ background: surface, borderColor: value }} aria-hidden="true" />;
    case 'shadow':
      return <span className="ly-preview" style={{ background: surface, borderColor: border, boxShadow: value }} aria-hidden="true" />;
    default:
      return <span className="ly-preview ly-preview--fill" style={{ background: value, borderColor: border }} aria-hidden="true" />;
  }
}

/**
 * One table row per primitive the token is built from, so raw value and primitive line up; the semantic
 * token and its users span them. Most colours have one primitive; shadows and gradients have several.
 */
function LayerRows({ token, role, theme }: { token: TokenEntry; role: Role; theme: Theme }) {
  const themed = token.themes![theme];
  const primitives = themed.refs.map((ref) => byName.get(ref)!);
  const users = usedBy.get(token.cssVar) ?? [];
  const span = Math.max(primitives.length, 1);

  const semantic = (
    <>
      <th scope="row" rowSpan={span}>
        <div className="ly-semantic">
          <Preview role={role} value={themed.value} theme={theme} />
          <span className="ly-stack">
            <code className="ly-name">{token.name}</code>
            <span className="tk-meta">
              <code className="tk-var">{token.cssVar}</code>
              <CopyButton value={`var(${token.cssVar})`} label={token.cssVar} />
            </span>
          </span>
        </div>
      </th>
      <td rowSpan={span}>
        {users.length ? (
          <ul className="ly-users">
            {users.map((u) => <li key={u}>{u}</li>)}
          </ul>
        ) : (
          <span className="doc-muted">Not used yet</span>
        )}
      </td>
    </>
  );

  if (primitives.length === 0) {
    return (
      <tr className="ly-first">
        <td><code>{themed.value}</code></td>
        <td><span className="doc-muted">None</span></td>
        {semantic}
      </tr>
    );
  }
  return (
    <>
      {primitives.map((p, i) => (
        <tr key={p.name} className={i === 0 ? 'ly-first' : 'ly-more'}>
          <td>
            <span className="ly-inline">
              <Swatch value={p.value} />
              <code>{p.value}</code>
            </span>
          </td>
          <td>
            <span className="ly-stack">
              <code className="ly-name">{p.name}</code>
              <code className="tk-ref">{p.cssVar}</code>
            </span>
          </td>
          {i === 0 && semantic}
        </tr>
      ))}
    </>
  );
}

export function TokenLayers() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [role, setRole] = useState<Role | 'all'>('all');
  const shown = ROLES.filter(([r]) => role === 'all' || role === r);
  const accent = byName.get('color.bg.accent.default')!;

  return (
    <DocSection
      id="layers"
      eyebrow="Foundations"
      title="Token layers"
      description={
        <>
          Every colour goes through three layers. Each layer points at the one before it, so changing a raw value or
          remapping a semantic token updates every component at once.
        </>
      }
    >
      <div className="doc-table-wrap">
        <table className="doc-table ly-summary">
          <caption>The three token layers</caption>
          <thead>
            <tr>
              <th scope="col">Layer</th>
              <th scope="col">What it is</th>
              <th scope="col">Example</th>
              <th scope="col">Who uses it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row"><span className="ly-step">1</span> Raw value</th>
              <td>The actual value the browser paints. It has no name and no meaning.</td>
              <td><span className="ly-inline"><Swatch value={accent.themes!.light.value} /><code>{accent.themes!.light.value}</code></span></td>
              <td>Only <code>tokens.json</code>. Never written anywhere else.</td>
            </tr>
            <tr>
              <th scope="row"><span className="ly-step">2</span> Primitive</th>
              <td>
                A name for a raw value that says <em>what it is</em>: a hue and a step on its 50–950 ramp (50 lightest,
                950 darkest), or a hue at an alpha (<code>primaryAlpha.20</code> = primary 600 at 20% opacity). Same in
                every theme.
              </td>
              <td><code>{accent.themes!.light.ref}</code><br /><code className="tk-ref">{byName.get(accent.themes!.light.ref!)!.cssVar}</code></td>
              <td>Semantic tokens only. Components never use primitives.</td>
            </tr>
            <tr>
              <th scope="row"><span className="ly-step">3</span> Semantic</th>
              <td>
                A name for a <em>job</em>: <code>color.&lt;role&gt;.&lt;intent&gt;.&lt;state&gt;</code>. It points at a
                primitive, and can point at a different one in each theme.
              </td>
              <td><code>{accent.name}</code><br /><code className="tk-ref">{accent.cssVar}</code></td>
              <td>Components. Pick the role by what you paint: <code>bg</code>, <code>text</code> or <code>border</code>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SubSection title="How each semantic token is built">
        <div className="ly-controls">
          <div role="group" aria-label="Theme" className="ly-toggle">
            {themeNames.map((n) => (
              <Button key={n} size="sm" variant="secondary" selected={theme === n} onClick={() => setTheme(n)}>
                {n === 'light' ? 'Light' : 'Dark'}
              </Button>
            ))}
          </div>
          <div role="group" aria-label="Role" className="ly-toggle">
            {(['all', ...ROLES.map(([r]) => r)] as const).map((r) => (
              <Button key={r} size="sm" variant="ghost" selected={role === r} onClick={() => setRole(r)}>
                {r === 'all' ? 'All' : r}
              </Button>
            ))}
          </div>
        </div>

        <div className="doc-table-wrap">
          <table className="doc-table ly-table">
            <caption>Raw value → primitive → semantic token, {theme} theme</caption>
            <thead>
              <tr>
                <th scope="col"><span className="ly-step">1</span> Raw value</th>
                <th scope="col"><span className="ly-step">2</span> Primitive</th>
                <th scope="col"><span className="ly-step">3</span> Semantic token</th>
                <th scope="col">Used in</th>
              </tr>
            </thead>
            {shown.map(([r, description]) => (
              <tbody key={r}>
                <tr className="ly-group">
                  <th scope="colgroup" colSpan={4}>
                    <code>{r === 'shadow' || r === 'gradient' ? r : `color.${r}`}</code> <span className="doc-muted">{description}</span>
                  </th>
                </tr>
                {semanticOf(r).map((t) => <LayerRows key={t.name} token={t} role={r} theme={theme} />)}
              </tbody>
            ))}
          </table>
        </div>
      </SubSection>
    </DocSection>
  );
}
