import { componentTokenList, themeNames, tokenList, type ComponentTokenEntry } from '@my-ds/tokens';
import { Dropdown, Icon, Input } from '@my-ds/ui';
import { useMemo, useState } from 'react';
import { CodeBlock, CopyButton, DocSection, SubSection } from './DocBlocks';

const semantic = new Map(tokenList.filter((t) => t.themes).map((t) => [t.name, t]));
const components = [...new Set(componentTokenList.map((t) => t.component))];
const MAX_ROWS = 150;

/** What the semantic token points at in a theme: one primitive, or several for shadows and gradients. */
function primitiveOf(ref: string, theme: (typeof themeNames)[number]) {
  const value = semantic.get(ref)?.themes?.[theme];
  if (!value) return '';
  if (value.ref) return value.ref;
  return value.refs.length > 1 ? `${value.refs[0]} +${value.refs.length - 1}` : (value.refs[0] ?? value.value);
}

function Preview({ token }: { token: ComponentTokenEntry }) {
  const kind = token.ref.split('.')[0];
  const style = kind === 'shadow' ? { boxShadow: `var(${token.cssVar})` } : { background: `var(${token.cssVar})` };
  return <span className={`tk-chip tk-chip--lg${kind === 'shadow' ? ' tk-chip--shadow' : ''}`} style={style} aria-hidden="true" />;
}

export function ComponentTokens() {
  const [component, setComponent] = useState('button');
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  // A search looks across every component; otherwise one component at a time.
  const rows = useMemo(
    () =>
      q
        ? componentTokenList.filter((t) => t.name.includes(q) || t.cssVar.includes(q) || t.ref.toLowerCase().includes(q))
        : componentTokenList.filter((t) => t.component === component),
    [q, component],
  );

  // A real chain for the explainer: component → semantic → primitive → raw value.
  const example = componentTokenList.find((t) => t.name === 'switch.control-bg-checked') ?? componentTokenList[0];
  const exampleSemantic = semantic.get(example.ref);
  const examplePrimitive = exampleSemantic?.themes?.light.ref ?? '';
  const exampleRaw = exampleSemantic?.themes?.light.value ?? '';

  return (
    <DocSection
      id="component-tokens"
      title="Component tokens"
      description={
        <>
          The third tier. Every colour, gradient and shadow a component uses is its own token
          (<code>--ds-&lt;component&gt;-…</code>) that points at exactly one semantic token. {componentTokenList.length}{' '}
          tokens across {components.length} components, defined in <code>packages/tokens/components/</code>.
        </>
      }
    >
      <ol className="tk-tiers" aria-label="Token tiers">
        <li className="tk-tier">
          <span className="tk-tier__label">1 · Primitive</span>
          <code className="tk-var">{examplePrimitive}</code>
          <span className="tk-tier__note">A raw value: {exampleRaw}. The only place hex codes live.</span>
        </li>
        <li className="tk-tier__arrow" aria-hidden="true"><Icon name="arrow-right" /></li>
        <li className="tk-tier">
          <span className="tk-tier__label">2 · Semantic</span>
          <code className="tk-var">{example.ref}</code>
          <span className="tk-tier__note">What it is for. Changes per theme, so light and dark just work.</span>
        </li>
        <li className="tk-tier__arrow" aria-hidden="true"><Icon name="arrow-right" /></li>
        <li className="tk-tier">
          <span className="tk-tier__label">3 · Component</span>
          <code className="tk-var">{example.name}</code>
          <span className="tk-tier__note">One component’s decision. Component CSS uses only these.</span>
        </li>
      </ol>

      <SubSection title="Restyle one component">
        <p className="doc-body">
          Point a component token at a different semantic token in its JSON file, or override it in CSS for one
          part of a page. Nothing else changes.
        </p>
        <CodeBlock
          label="component token override"
          code={`/* packages/tokens/components/switch.json */
"control-bg-checked": "{color.bg.success.default}"

/* or scoped, in an app stylesheet */
.billing-form {
  --ds-switch-control-bg-checked: var(--ds-color-bg-success);
}`}
        />
      </SubSection>

      <SubSection title="Browse">
        <div className="tk-filter tk-filter--row">
          <Dropdown
            label="Component"
            options={components.map((c) => ({ value: c, label: `${c} (${componentTokenList.filter((t) => t.component === c).length})` }))}
            value={component}
            onChange={setComponent}
            disabled={q !== ''}
          />
          <Input
            label="Search all components"
            type="search"
            placeholder="e.g. focus, bg-hover, color.text.muted"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            hint={q ? `${rows.length} of ${componentTokenList.length} tokens match` : undefined}
          />
        </div>

        {rows.length === 0 ? (
          <p className="doc-muted">No component tokens match “{query}”.</p>
        ) : (
          <div className="doc-table-wrap">
            <table className="doc-table tk-semantic">
              <caption>{q ? 'Matching component tokens' : `${component} tokens`}</caption>
              <thead>
                <tr>
                  <th scope="col">Component token</th>
                  <th scope="col">Current</th>
                  <th scope="col">Semantic token</th>
                  {themeNames.map((n) => <th key={n} scope="col">{n} primitive</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, MAX_ROWS).map((t) => (
                  <tr key={t.name}>
                    <th scope="row">
                      <div className="tk-meta">
                        <code className="tk-var">{t.cssVar}</code>
                        <CopyButton value={`var(${t.cssVar})`} label={t.cssVar} />
                      </div>
                    </th>
                    <td><Preview token={t} /></td>
                    <td><code>{t.ref}</code></td>
                    {themeNames.map((n) => <td key={n}><span className="tk-ref">{primitiveOf(t.ref, n)}</span></td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rows.length > MAX_ROWS && <p className="doc-muted">Showing the first {MAX_ROWS}. Narrow the search to see the rest.</p>}
      </SubSection>
    </DocSection>
  );
}
