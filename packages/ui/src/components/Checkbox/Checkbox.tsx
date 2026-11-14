import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import '../Input/Input.css';
import './Checkbox.css';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  /** Secondary text under the label, linked via aria-describedby. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Shows a dash instead of a check and exposes aria-checked="mixed". The native `checked` state is left as is. */
  indeterminate?: boolean;
  /** Marks the box invalid without a message. */
  invalid?: boolean;
  /** Error message. When set, the box is marked invalid and the message is announced. */
  error?: ReactNode;
  size?: CheckboxSize;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    hideLabel = false,
    description,
    checked,
    defaultChecked,
    onChange,
    indeterminate = false,
    invalid = false,
    error,
    size = 'md',
    id,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-checkbox-${autoId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], descriptionId, errorId].filter(Boolean).join(' ') || undefined;
  const isInvalid = invalid || Boolean(error);

  const innerRef = useRef<HTMLInputElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // `indeterminate` is a DOM property only, so it has to be set imperatively.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked, event);
  };

  return (
    <div
      className={cx(
        'ds-checkbox',
        `ds-checkbox--${size}`,
        disabled && 'ds-checkbox--disabled',
        isInvalid && 'ds-checkbox--invalid',
        className,
      )}
    >
      <label htmlFor={inputId} className="ds-checkbox__label">
        <input
          ref={setRefs}
          id={inputId}
          type="checkbox"
          className="ds-checkbox__input ds-visually-hidden"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          aria-checked={indeterminate ? 'mixed' : undefined}
          aria-invalid={isInvalid || undefined}
          {...rest}
          aria-describedby={describedBy}
          onChange={handleChange}
        />
        <span className="ds-checkbox__box" aria-hidden="true">
          <svg className="ds-checkbox__check" viewBox="0 0 16 16">
            <path d="M3.5 8.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg className="ds-checkbox__dash" viewBox="0 0 16 16">
            <path d="M4 8h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <span className={cx('ds-checkbox__text', hideLabel && 'ds-visually-hidden')}>{label}</span>
      </label>
      {description && (
        <span id={descriptionId} className={cx('ds-checkbox__description', hideLabel && 'ds-visually-hidden')}>
          {description}
        </span>
      )}
      {error && (
        <p id={errorId} className="ds-checkbox__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
