import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './DynamicIcon.css';

export type DynamicIconVariant = 'ellipsis' | 'typing' | 'eq' | 'trend' | 'strength' | 'score' | 'waffle';
export type DynamicIconSize = 'sm' | 'md' | 'lg';
export type DynamicIconTrend = 'up' | 'down' | 'neutral';
export type DynamicIconScore = 'positive' | 'negative';
export type DynamicIconStrength = 0 | 1 | 2 | 3;

export interface DynamicIconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * ellipsis: pulsing dots (working) · typing: bouncing dots in a bubble · eq: equalizer bars ·
   * trend: up/down/neutral arrow · strength: 0–3 bars · score: positive/negative dot · waffle: 3×3 app-launcher grid.
   */
  variant: DynamicIconVariant;
  /** 16 / 20 / 24 (icon sizes). */
  size?: DynamicIconSize;
  /** `trend` direction. */
  direction?: DynamicIconTrend;
  /** `strength` level, 0–3. */
  value?: DynamicIconStrength;
  /** `score` polarity. */
  score?: DynamicIconScore;
  /** Stops the animation (the glyph stays in its resting state). */
  paused?: boolean;
  /** Accessible name. Defaults to a description of the state; `waffle` is decorative by default. */
  label?: string;
  /** Hide from assistive tech, e.g. when a parent button already names it. */
  decorative?: boolean;
}

const STRENGTH = ['none', 'weak', 'moderate', 'strong'] as const;
const TREND: Record<DynamicIconTrend, string> = { up: 'Trending up', down: 'Trending down', neutral: 'No change' };

function defaultLabel(variant: DynamicIconVariant, direction: DynamicIconTrend, value: DynamicIconStrength, score: DynamicIconScore) {
  switch (variant) {
    case 'ellipsis':
      return 'Loading';
    case 'typing':
      return 'Typing';
    case 'eq':
      return 'Working';
    case 'trend':
      return TREND[direction];
    case 'strength':
      return `Strength: ${STRENGTH[value]}`;
    case 'score':
      return score === 'positive' ? 'Positive score' : 'Negative score';
    default:
      return undefined;
  }
}

const count = (n: number, className: string) =>
  Array.from({ length: n }, (_, i) => <span key={i} className={className} style={{ ['--i' as string]: i }} />);

/**
 * Small animated status glyphs (SLDS dynamic icons). Animations stop under prefers-reduced-motion
 * and with `paused`. Rendered as `role="img"` with a state label unless decorative.
 */
export const DynamicIcon = forwardRef<HTMLSpanElement, DynamicIconProps>(function DynamicIcon(
  {
    variant,
    size = 'md',
    direction = 'neutral',
    value = 0,
    score = 'positive',
    paused = false,
    label,
    decorative,
    className,
    ...rest
  },
  ref,
) {
  const name = label ?? defaultLabel(variant, direction, value, score);
  const hidden = decorative ?? !name;

  let body;
  switch (variant) {
    case 'ellipsis':
    case 'typing':
      body = count(3, 'ds-dynamic-icon__dot');
      break;
    case 'eq':
      body = count(3, 'ds-dynamic-icon__bar');
      break;
    case 'strength':
      body = count(3, 'ds-dynamic-icon__bar');
      break;
    case 'trend':
      body = <Icon name={direction === 'neutral' ? 'arrow-right' : 'arrow-right-up'} className="ds-dynamic-icon__arrow" />;
      break;
    case 'score':
      body = <span className="ds-dynamic-icon__score" />;
      break;
    case 'waffle':
      body = count(9, 'ds-dynamic-icon__dot');
      break;
    default:
      body = null;
  }

  return (
    <span
      ref={ref}
      role={hidden ? undefined : 'img'}
      aria-label={hidden ? undefined : name}
      aria-hidden={hidden || undefined}
      className={cx(
        'ds-dynamic-icon',
        `ds-dynamic-icon--${variant}`,
        `ds-dynamic-icon--${size}`,
        variant === 'trend' && `ds-dynamic-icon--${direction}`,
        variant === 'score' && `ds-dynamic-icon--${score}`,
        paused && 'ds-dynamic-icon--paused',
        className,
      )}
      data-value={variant === 'strength' ? value : undefined}
      {...rest}
    >
      {body}
    </span>
  );
});
