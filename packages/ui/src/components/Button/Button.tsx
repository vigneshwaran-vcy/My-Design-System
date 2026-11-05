import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'ghost' | 'danger';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner, sets aria-busy and ignores clicks while staying focusable. */
  loading?: boolean;
  fullWidth?: boolean;
  /**
   * Makes this a toggle button: `true`/`false` set `aria-pressed` and the selected look.
   * Leave undefined for a plain action button.
   */
  selected?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    selected,
    leadingIcon,
    trailingIcon,
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'ds-button',
        `ds-button--${variant}`,
        `ds-button--${size}`,
        fullWidth && 'ds-button--full-width',
        loading && 'ds-button--loading',
        className,
      )}
      aria-pressed={selected}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      {loading ? <span className="ds-button__spinner" aria-hidden="true" /> : leadingIcon && <span className="ds-button__icon" aria-hidden="true">{leadingIcon}</span>}
      <span className="ds-button__label">{children}</span>
      {trailingIcon && !loading && <span className="ds-button__icon" aria-hidden="true">{trailingIcon}</span>}
    </button>
  );
});
