import { tokens as raw, type TokenEntry } from '@my-ds/tokens';
import { useEffect, useState } from 'react';

const WHITE: string = raw.palette.white;
const INK: string = raw.palette.gray['900'];
// The surface an alpha shade sits on in each theme (bg.surface).
const SURFACE: Record<'light' | 'dark', string> = { light: WHITE, dark: raw.palette.gray['800'] };

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

/** Relative luminance of a #RRGGBB(AA) colour, with any alpha composited over `backdrop`. */
function luminance(hex: string, backdrop: string = WHITE) {
  const a = hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1;
  const under = channels(backdrop);
  const [r, g, b] = channels(hex).map((v, i) => {
    const c = v * a + under[i] * (1 - a);
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** "light" when white text reads better than ink on this colour, else "dark". */
function labelTone(hex: string, backdrop: string) {
  const l = luminance(hex, backdrop);
  return contrast(l, luminance(WHITE)) >= contrast(l, luminance(INK)) ? 'light' : 'dark';
}

const step = (t: TokenEntry) => Number(t.name.split('.').pop());

/** One ramp per hue in step order (50 → 950, or 5% → 80% for alphas); base white/black by lightness. */
function toRamps(tokens: TokenEntry[]) {
  const ramps = new Map<string, TokenEntry[]>();
  for (const t of tokens) {
    const hue = t.group === 'palette' ? 'base' : t.group.split('.')[1];
    ramps.set(hue, [...(ramps.get(hue) ?? []), t]);
  }
  return [...ramps].map(([hue, shades]) => {
    const sorted = shades.every((t) => !Number.isNaN(step(t)))
      ? [...shades].sort((a, b) => step(a) - step(b))
      : [...shades].sort((a, b) => luminance(b.value) - luminance(a.value));
    return [hue, sorted] as const;
  });
}

function RampStep({ token }: { token: TokenEntry }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(t);
  }, [copied]);

  const name = token.name.split('.').pop()!;
  const label = copied ? 'Copied' : name;
  return (
    <li className="tk-ramp__step tk-chip--alpha">
      <button
        type="button"
        className="tk-ramp__swatch"
        style={{ background: `var(${token.cssVar})` }}
        data-tone-light={labelTone(token.value, SURFACE.light)}
        data-tone-dark={labelTone(token.value, SURFACE.dark)}
        aria-label={copied ? `Copied ${token.cssVar}` : `Copy ${token.cssVar} (${token.value})`}
        title={`var(${token.cssVar})`}
        onClick={() => navigator.clipboard?.writeText(`var(${token.cssVar})`).then(() => setCopied(true))}
      >
        <span className="tk-ramp__name" aria-live="polite">{label}</span>
        <span className="tk-ramp__hex">{token.value}</span>
      </button>
    </li>
  );
}

export function PaletteRamps({ tokens }: { tokens: TokenEntry[] }) {
  return (
    <div className="tk-ramps">
      {toRamps(tokens).map(([hue, shades]) => (
        <div key={hue} className="tk-ramp">
          <h3 className="tk-ramp__title">{hue}</h3>
          <ul className="tk-ramp__strip" aria-label={`${hue} ramp`}>
            {shades.map((t) => <RampStep key={t.name} token={t} />)}
          </ul>
        </div>
      ))}
      <p className="doc-muted">Click a shade to copy its variable. Ramps run 50 (lightest) → 950 (darkest); alpha ramps run by opacity.</p>
    </div>
  );
}
