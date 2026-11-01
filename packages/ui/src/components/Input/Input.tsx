import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Input.css';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  size?: InputSize;
  variant?: InputVariant;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hideLabel = false, hint, error, size = 'md', variant = 'outline', id, className, required, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-input-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx('ds-field', disabled && 'ds-field--disabled', className)}>
      <label htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cx('ds-input', `ds-input--${variant}`, `ds-input--${size}`, error && 'ds-input--invalid')}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        {...rest}
        aria-describedby={describedBy}
      />
      {hint && (
        <p id={hintId} className="ds-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="ds-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
