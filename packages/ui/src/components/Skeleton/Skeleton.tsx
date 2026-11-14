import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Skeleton.css';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  variant?: SkeletonVariant;
  /** Any CSS width, e.g. `'60%'`, `'var(--ds-space-16)'`, `240`. Numbers are treated as pixels. */
  width?: number | string;
  /** Any CSS height. Numbers are treated as pixels. */
  height?: number | string;
  /** For `text`: renders this many bars; the last one is 60% wide. */
  lines?: number;
  /** Screen-reader-only status message, e.g. "Loading users". Omit when a parent already announces loading. */
  label?: string;
}

const toCss = (v: number | string | undefined) => (typeof v === 'number' ? `${v}px` : v);

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, lines = 1, label, className, style, ...rest },
  ref,
) {
  const sizing: CSSProperties = {
    ...(width !== undefined && { width: toCss(width) }),
    ...(height !== undefined && { height: toCss(height) }),
  };
  const classes = cx('ds-skeleton', `ds-skeleton--${variant}`, className);

  const status = label ? (
    <span className="ds-skeleton__status" role="status">
      {label}
    </span>
  ) : null;

  if (variant === 'text' && lines > 1) {
    return (
      <span ref={ref} className={cx('ds-skeleton-lines', className)} style={{ ...sizing, ...style }} aria-hidden={label ? undefined : true} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={cx('ds-skeleton', 'ds-skeleton--text', i === lines - 1 && 'ds-skeleton--last-line')}
            style={height !== undefined ? { height: toCss(height) } : undefined}
            aria-hidden="true"
          />
        ))}
        {status}
      </span>
    );
  }

  if (status) {
    return (
      <span ref={ref} className="ds-skeleton-wrap" {...rest}>
        <span className={classes} style={{ ...sizing, ...style }} aria-hidden="true" />
        {status}
      </span>
    );
  }

  return <span ref={ref} className={classes} style={{ ...sizing, ...style }} aria-hidden="true" {...rest} />;
});
