import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Progress.css';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'accent' | 'success' | 'warn' | 'danger';
export type ProgressShape = 'bar' | 'circle';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Completion from 0 to 100. Ignored when `indeterminate`. */
  value?: number;
  /** Unknown duration: no value is exposed and the fill slides. */
  indeterminate?: boolean;
  size?: ProgressSize;
  variant?: ProgressVariant;
  /** Visible label; also becomes the accessible name. */
  label?: ReactNode;
  /** Renders the percentage next to the label (bar) or in the centre (circle). */
  showValue?: boolean;
  shape?: ProgressShape;
  /** Formats the displayed value. Defaults to `NN%`. */
  formatValue?: (value: number) => string;
}

const clamp = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = 0,
    indeterminate = false,
    size = 'md',
    variant = 'accent',
    label,
    showValue = false,
    shape = 'bar',
    formatValue = (v) => `${Math.round(v)}%`,
    className,
    style,
    ...rest
  },
  ref,
) {
  const id = useId();
  const labelId = label ? `ds-progress-${id}-label` : undefined;
  const pct = clamp(value);
  const text = indeterminate ? undefined : formatValue(pct);

  const ariaProps = {
    role: 'progressbar' as const,
    'aria-valuemin': 0,
    'aria-valuemax': 100,
    'aria-valuenow': indeterminate ? undefined : pct,
    'aria-valuetext': indeterminate ? undefined : text,
    'aria-labelledby': rest['aria-label'] ? undefined : labelId,
    'aria-busy': indeterminate || undefined,
  };

  if (shape === 'circle') {
    // Geometry is unitless; the SVG scales to the token-driven box set in CSS.
    const r = 42;
    const c = 2 * Math.PI * r;
    return (
      <div
        ref={ref}
        className={cx(
          'ds-progress',
          'ds-progress--circle',
          `ds-progress--${size}`,
          `ds-progress--${variant}`,
          indeterminate && 'ds-progress--indeterminate',
          className,
        )}
        style={style}
        {...ariaProps}
        {...rest}
      >
        <svg className="ds-progress__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle className="ds-progress__ring-track" cx="50" cy="50" r={r} fill="none" />
          <circle
            className="ds-progress__ring-fill"
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={indeterminate ? c * 0.75 : c * (1 - pct / 100)}
          />
        </svg>
        {showValue && !indeterminate && (
          <span className="ds-progress__value" aria-hidden="true">
            {text}
          </span>
        )}
        {label && (
          <span id={labelId} className="ds-progress__label">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cx(
        'ds-progress',
        'ds-progress--bar',
        `ds-progress--${size}`,
        `ds-progress--${variant}`,
        indeterminate && 'ds-progress--indeterminate',
        className,
      )}
      style={style}
      {...ariaProps}
      {...rest}
    >
      {(label || (showValue && !indeterminate)) && (
        <div className="ds-progress__header">
          {label && (
            <span id={labelId} className="ds-progress__label">
              {label}
            </span>
          )}
          {showValue && !indeterminate && (
            <span className="ds-progress__value" aria-hidden="true">
              {text}
            </span>
          )}
        </div>
      )}
      <div className="ds-progress__track">
        <div className="ds-progress__fill" style={indeterminate ? undefined : { width: `${pct}%` }} />
      </div>
    </div>
  );
});
