import { themeNames, tokenList, type ThemeValue, type TokenEntry } from '@my-ds/tokens';
import { Button, Input } from '@my-ds/ui';
import { useState, type ReactNode } from 'react';
import { CopyButton, DocSection, SubSection } from './DocBlocks';
import { PaletteRamps } from './PaletteRamps';
import { TokenLayers } from './TokenLayers';

const cssVar = (t: TokenEntry) => `var(${t.cssVar})`;
const leaf = (t: TokenEntry) => t.name.split('.').pop()!;

function matches(t: TokenEntry, query: string) {
  if (!query) return true;
  const haystack = [t.name, t.cssVar, t.value, ...Object.values(t.themes ?? {}).flatMap((v) => [v.value, v.ref ?? ''])];
  return haystack.some((s) => s.toLowerCase().includes(query));
}

function byGroup(list: TokenEntry[]) {
  const groups = new Map<string, TokenEntry[]>();
  for (const t of list) groups.set(t.group, [...(groups.get(t.group) ?? []), t]);
  return [...groups];
}

/** Semantic colours by role (color.bg.accent.hover → "bg"), keeping nested states together. */
function byRole(list: TokenEntry[]) {
  const roles = new Map<string, TokenEntry[]>();
  for (const t of list) {
    const role = t.name.split('.')[1];
    roles.set(role, [...(roles.get(role) ?? []), t]);
  }
  return [...roles];
}

function TokenMeta({ token, showValue = true }: { token: TokenEntry; showValue?: boolean }) {
  return (
    <div className="tk-meta">
      <code className="tk-var">{token.cssVar}</code>
      {showValue && <span className="tk-value">{token.value}</span>}
      <CopyButton value={cssVar(token)} label={token.cssVar} />
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="doc-muted">{children}</p>;
}

/** Token rows: preview on the left, name + variable + value on the right. */
function TokenRows({ tokens, preview }: { tokens: TokenEntry[]; preview: (t: TokenEntry) => ReactNode }) {
  return (
    <ul className="tk-rows">
      {tokens.map((t) => (
        <li key={t.name} className="tk-row">
          <div className="tk-row__preview">{preview(t)}</div>
          <div className="tk-row__info">
            <span className="tk-row__name">{t.name}</span>
            <TokenMeta token={t} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ThemeCell({ value }: { value: ThemeValue }) {
  return (
    <div className="tk-theme-cell">
      <span className="tk-chip" style={{ background: value.value }} aria-hidden="true" />
      <span>
        <code>{value.value}</code>
        {value.ref && <span className="tk-ref">{value.ref}</span>}
      </span>
    </div>
  );
}

function MotionDemo({ duration, easing }: { duration: string; easing: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="tk-motion">
      <div className="tk-motion__track">
        <span
          className="tk-motion__dot"
          data-on={on}
          style={{ transitionDuration: duration, transitionTimingFunction: easing }}
        />
      </div>
      <Button size="sm" variant="secondary" onClick={() => setOn(!on)}>
        Play
      </Button>
    </div>
  );
}

export const foundationsNav = [
  ['tokens', 'All tokens'],
  ['layers', 'Token layers'],
  ['palette', 'Palette'],
  ['semantic-colors', 'Semantic colors'],
  ['typography', 'Typography'],
  ['spacing', 'Spacing'],
  ['radius', 'Radius'],
  ['shadows', 'Shadows'],
  ['gradients', 'Gradients'],
  ['blur', 'Blur'],
  ['motion', 'Motion'],
  ['sizes', 'Sizes & borders'],
] as const;

type PaletteView = 'ramp' | 'swatches';
const PALETTE_VIEW_KEY = 'ds-docs-palette-view';

function readPaletteView(): PaletteView {
  try {
    return localStorage.getItem(PALETTE_VIEW_KEY) === 'swatches' ? 'swatches' : 'ramp';
  } catch {
    return 'ramp';
  }
}

export function Foundations() {
  const [query, setQuery] = useState('');
  const [paletteView, setPaletteViewState] = useState<PaletteView>(readPaletteView);
  const setPaletteView = (view: PaletteView) => {
    setPaletteViewState(view);
    try {
      localStorage.setItem(PALETTE_VIEW_KEY, view);
    } catch {
      // Storage can be unavailable (private mode); the choice just won't be remembered.
    }
  };
  const q = query.trim().toLowerCase();
  const list = tokenList.filter((t) => matches(t, q));
  const pick = (...groups: string[]) => list.filter((t) => groups.includes(t.group));
  const none = <Empty>No tokens match “{query}”.</Empty>;

  const palette = list.filter((t) => t.category === 'palette');
  const colors = list.filter((t) => t.category === 'color');
  const shadows = pick('shadow');
  const space = pick('space');
  const radius = pick('radius');
  const gradients = pick('gradient');
  const blurs = list.filter((t) => t.category === 'blur');
  const durations = pick('motion.duration');
  const easings = pick('motion.easing');
  const easeOut = tokenList.find((t) => t.group === 'motion.easing')!;
  const baseDuration = tokenList.find((t) => t.name === 'motion.duration.base')!;
  const typeGroups = ['font.family', 'font.size', 'font.weight', 'font.lineHeight'] as const;
  const sizeGroups = ['size.button', 'size.control', 'size.icon', 'border.width', 'breakpoint'] as const;

  return (
    <>
      <DocSection
        id="tokens"
        eyebrow="Foundations"
        title="All tokens"
        description={
          <>
            Every value below is read from <code>@my-ds/tokens</code> at build time — {tokenList.length} tokens,{' '}
            {tokenList.filter((t) => t.themes).length} of them themed. Previews use the live CSS variables, so they follow
            the theme switch.
          </>
        }
      >
        <div className="tk-filter">
          <Input
            label="Filter tokens"
            type="search"
            placeholder="Name, variable or value — e.g. accent, space-4, #0260FF"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            hint={q ? `${list.length} of ${tokenList.length} tokens match` : undefined}
          />
        </div>
      </DocSection>

      <TokenLayers />

      <DocSection
        id="palette"
        title="Palette"
        description={
          <>
            Colour primitives (layer 2). Each <code>…Alpha</code> group is the same hue at 5–80% opacity, for shadows, tints
            and glass. Components never use these directly — they go through semantic colours.
          </>
        }
      >
        <div role="group" aria-label="Palette view" className="ly-toggle tk-view-toggle">
          <Button size="sm" variant="secondary" selected={paletteView === 'ramp'} onClick={() => setPaletteView('ramp')}>
            Ramp
          </Button>
          <Button size="sm" variant="secondary" selected={paletteView === 'swatches'} onClick={() => setPaletteView('swatches')}>
            Swatches
          </Button>
        </div>
        {palette.length === 0 && none}
        {palette.length > 0 && paletteView === 'ramp' && <PaletteRamps tokens={palette} />}
        {paletteView === 'swatches' && byGroup(palette).map(([group, tokens]) => (
          <SubSection key={group} title={group === 'palette' ? 'base' : group.split('.')[1]}>
            <ul className="tk-swatches">
              {tokens.map((t) => (
                <li key={t.name} className="tk-swatch">
                  <span className="tk-swatch__chip tk-chip--alpha" aria-hidden="true"><span style={{ background: cssVar(t) }} /></span>
                  <span className="tk-swatch__name">{leaf(t)}</span>
                  <TokenMeta token={t} />
                </li>
              ))}
            </ul>
          </SubSection>
        ))}
      </DocSection>

      <DocSection
        id="semantic-colors"
        title="Semantic colours"
        description={
          <>
            Theme-aware colours that components use, grouped by role: <code>bg</code> for fills, <code>text</code> for
            text and icons, <code>border</code> for edges and focus rings. Each points at a palette primitive per theme.
          </>
        }
      >
        {colors.length === 0 && none}
        {byRole(colors).map(([role, tokens]) => (
          <SubSection key={role} title={role}>
            <div className="doc-table-wrap">
              <table className="doc-table tk-semantic">
                <caption>Semantic {role} colours</caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Current</th>
                    {themeNames.map((n) => <th key={n} scope="col">{n}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((t) => (
                    <tr key={t.name}>
                      <th scope="row">
                        <div className="tk-meta">
                          <code className="tk-var">{t.cssVar}</code>
                          <CopyButton value={cssVar(t)} label={t.cssVar} />
                        </div>
                      </th>
                      <td><span className="tk-chip tk-chip--lg" style={{ background: cssVar(t) }} aria-hidden="true" /></td>
                      {themeNames.map((n) => <td key={n}><ThemeCell value={t.themes![n]} /></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SubSection>
        ))}
      </DocSection>

      <DocSection id="typography" title="Typography" description="Inter for UI text. Sizes xs–4xl, weights 400 / 500 / 600.">
        {typeGroups.every((g) => pick(g).length === 0) && none}
        {pick('font.family').length > 0 && (
          <SubSection title="Families">
            <TokenRows tokens={pick('font.family')} preview={(t) => <span className="tk-type-sample" style={{ fontFamily: cssVar(t) }}>Calm, minimal, high-contrast. 0123456789</span>} />
          </SubSection>
        )}
        {pick('font.size').length > 0 && (
          <SubSection title="Sizes">
            <TokenRows tokens={pick('font.size')} preview={(t) => <span className="tk-type-sample" style={{ fontSize: cssVar(t) }}>Design system</span>} />
          </SubSection>
        )}
        {pick('font.weight').length > 0 && (
          <SubSection title="Weights">
            <TokenRows tokens={pick('font.weight')} preview={(t) => <span className="tk-type-sample tk-type-sample--lg" style={{ fontWeight: cssVar(t) }}>{leaf(t)}</span>} />
          </SubSection>
        )}
        {pick('font.lineHeight').length > 0 && (
          <SubSection title="Line heights">
            <TokenRows
              tokens={pick('font.lineHeight')}
              preview={(t) => (
                <p className="tk-type-para" style={{ lineHeight: cssVar(t) }}>
                  Good line height keeps long paragraphs readable and short labels compact.
                </p>
              )}
            />
          </SubSection>
        )}
      </DocSection>

      <DocSection id="spacing" title="Spacing" description="4px base scale. The token name is the multiplier: space-4 = 4 × 4px.">
        {space.length === 0 ? none : <TokenRows tokens={space} preview={(t) => <span className="tk-space-bar" style={{ width: cssVar(t) }} />} />}
      </DocSection>

      <DocSection id="radius" title="Radius" description="Rounded but not bubbly: md for controls, lg for surfaces, full for pills.">
        {radius.length === 0 ? none : (
          <ul className="tk-tiles">
            {radius.map((t) => (
              <li key={t.name} className="tk-tile">
                <span className="tk-radius-box" style={{ borderRadius: cssVar(t) }} />
                <span className="tk-row__name">{t.name}</span>
                <TokenMeta token={t} />
              </li>
            ))}
          </ul>
        )}
      </DocSection>

      <DocSection id="shadows" title="Shadows" description="Elevation. Dark theme uses deeper, more opaque shadows so surfaces still separate.">
        {shadows.length === 0 ? none : (
          <ul className="tk-tiles">
            {shadows.map((t) => (
              <li key={t.name} className="tk-tile">
                <span className="tk-shadow-box" style={{ boxShadow: cssVar(t) }} />
                <span className="tk-row__name">{t.name}</span>
                <TokenMeta token={t} showValue={false} />
                {themeNames.map((n) => (
                  <span key={n} className="tk-ref"><strong>{n}:</strong> {t.themes![n].value}</span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </DocSection>

      <DocSection id="gradients" title="Gradients" description="Theme-aware gradients for accent fills, surfaces and AI moments. Use the ai gradient only for AI features.">
        {gradients.length === 0 ? none : (
          <ul className="tk-tiles">
            {gradients.map((t) => (
              <li key={t.name} className="tk-tile">
                <span className="tk-gradient-box" style={{ background: cssVar(t) }} />
                <span className="tk-row__name">{t.name}</span>
                <TokenMeta token={t} showValue={false} />
                {themeNames.map((n) => (
                  <span key={n} className="tk-ref"><strong>{n}:</strong> {t.themes![n].value}</span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </DocSection>

      <DocSection id="blur" title="Blur" description="Backdrop blur for frosted-glass popovers. Pair with color-glass as the background.">
        {blurs.length === 0 ? none : (
          <TokenRows
            tokens={blurs}
            preview={(t) => (
              <div className="tk-blur-demo">
                <span className="tk-blur-demo__bg" aria-hidden="true">Aa Bb Cc</span>
                <span className="tk-blur-demo__glass" style={{ backdropFilter: `blur(${cssVar(t)})`, WebkitBackdropFilter: `blur(${cssVar(t)})` }}>
                  glass
                </span>
              </div>
            )}
          />
        )}
      </DocSection>

      <DocSection id="motion" title="Motion" description="Short and calm: 150ms for hover/colour changes, 250ms for larger movements, always ease-out. Press Play to compare.">
        {durations.length + easings.length === 0 && none}
        {durations.length > 0 && (
          <SubSection title="Durations">
            <TokenRows tokens={durations} preview={(t) => <MotionDemo duration={cssVar(t)} easing={cssVar(easeOut)} />} />
          </SubSection>
        )}
        {easings.length > 0 && (
          <SubSection title="Easing">
            <TokenRows tokens={easings} preview={(t) => <MotionDemo duration={cssVar(baseDuration)} easing={cssVar(t)} />} />
          </SubSection>
        )}
      </DocSection>

      <DocSection id="sizes" title="Sizes & borders" description="Button and control heights, icon sizes, border widths and breakpoints.">
        {sizeGroups.every((g) => pick(g).length === 0) && none}
        {pick('size.button').length > 0 && (
          <SubSection title="Button heights">
            <TokenRows tokens={pick('size.button')} preview={(t) => <span className="tk-control-box" style={{ height: cssVar(t) }}>{leaf(t)}</span>} />
          </SubSection>
        )}
        {pick('size.control').length > 0 && (
          <SubSection title="Control heights (inputs, dropdowns)">
            <TokenRows tokens={pick('size.control')} preview={(t) => <span className="tk-control-box" style={{ height: cssVar(t) }}>{leaf(t)}</span>} />
          </SubSection>
        )}
        {pick('size.icon').length > 0 && (
          <SubSection title="Icon sizes">
            <TokenRows tokens={pick('size.icon')} preview={(t) => <span className="tk-icon-box" style={{ width: cssVar(t), height: cssVar(t) }} />} />
          </SubSection>
        )}
        {pick('border.width').length > 0 && (
          <SubSection title="Border widths">
            <TokenRows tokens={pick('border.width')} preview={(t) => <span className="tk-border-line" style={{ borderTopWidth: cssVar(t) }} />} />
          </SubSection>
        )}
        {pick('breakpoint').length > 0 && (
          <SubSection title="Breakpoints">
            <p className="doc-muted">CSS variables can’t be used inside media queries, so copy the value when writing one.</p>
            <TokenRows tokens={pick('breakpoint')} preview={(t) => <span className="tk-breakpoint">≥ {t.value}</span>} />
          </SubSection>
        )}
      </DocSection>
    </>
  );
}
