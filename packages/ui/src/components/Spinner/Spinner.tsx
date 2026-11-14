import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import './Spinner.css';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerColor = 'current' | 'accent' | 'muted';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** 12 / 16 / 20 / 24 (size-icon-*). */
  size?: SpinnerSize;
  /** `current` inherits the surrounding text colour. */
  color?: SpinnerColor;
  /** Visually hidden text announced by screen readers. */
  label?: string;
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', color = 'current', label = 'Loading', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      role="status"
      className={cx('ds-spinner', `ds-spinner--${size}`, `ds-spinner--${color}`, className)}
      {...rest}
    >
      <svg className="ds-spinner__ring" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <circle className="ds-spinner__track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" />
        <circle
          className="ds-spinner__arc"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="28 72"
        />
      </svg>
      {label && <span className="ds-spinner__label">{label}</span>}
    </span>
  );
});
