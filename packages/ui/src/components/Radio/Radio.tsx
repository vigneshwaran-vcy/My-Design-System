import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import '../Input/Input.css';
import './Radio.css';

export type RadioSize = 'sm' | 'md';
export type RadioGroupOrientation = 'vertical' | 'horizontal';

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  invalid: boolean;
  size: RadioSize;
  describedBy?: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ------------------------------------------------------------------ RadioGroup */

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Visible group label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, every radio is marked invalid and the message is announced. */
  error?: ReactNode;
  /** Shared `name` for the radios. Generated when omitted. */
  name?: string;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  orientation?: RadioGroupOrientation;
  disabled?: boolean;
  required?: boolean;
  size?: RadioSize;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    hideLabel = false,
    hint,
    error,
    name,
    value,
    defaultValue = null,
    onChange,
    orientation = 'vertical',
    disabled = false,
    required = false,
    size = 'md',
    id,
    className,
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const groupId = id ?? `ds-radio-group-${autoId}`;
  const labelId = `${groupId}-label`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (next: string, event: ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) setInternalValue(next);
    onChange?.(next, event);
  };

  return (
    <div
      ref={ref}
      id={groupId}
      role="radiogroup"
      className={cx('ds-field', 'ds-radio-group', `ds-radio-group--${orientation}`, disabled && 'ds-field--disabled', className)}
      aria-labelledby={labelId}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      {...rest}
      aria-describedby={describedBy}
    >
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <div className="ds-radio-group__items">
        <RadioGroupContext.Provider
          value={{
            name: name ?? `${groupId}-name`,
            value: selectedValue,
            onChange: handleChange,
            disabled,
            invalid: Boolean(error),
            size,
            describedBy: errorId,
          }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
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

/* ----------------------------------------------------------------------- Radio */

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'checked' | 'defaultChecked' | 'onChange'> {
  /** The value this option submits and reports through the group's `onChange`. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Secondary text under the label, linked via aria-describedby. */
  description?: ReactNode;
  disabled?: boolean;
  /** Overrides the group's size for this option. */
  size?: RadioSize;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, disabled, size, id, className, name, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const autoId = useId();
  const inputId = id ?? `ds-radio-${autoId}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const describedBy = [rest['aria-describedby'], descriptionId, group?.describedBy].filter(Boolean).join(' ') || undefined;

  const isDisabled = disabled || group?.disabled || false;
  const resolvedSize = size ?? group?.size ?? 'md';
  const checked = group ? group.value === value : undefined;

  return (
    <div
      className={cx(
        'ds-radio',
        `ds-radio--${resolvedSize}`,
        isDisabled && 'ds-radio--disabled',
        group?.invalid && 'ds-radio--invalid',
        className,
      )}
    >
      <label htmlFor={inputId} className="ds-radio__label">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className="ds-radio__input ds-visually-hidden"
          name={name ?? group?.name}
          value={value}
          checked={checked}
          disabled={isDisabled}
          aria-invalid={group?.invalid || undefined}
          {...rest}
          aria-describedby={describedBy}
          onChange={(event) => group?.onChange(value, event)}
        />
        <span className="ds-radio__circle" aria-hidden="true">
          <span className="ds-radio__dot" />
        </span>
        <span className="ds-radio__text">{label}</span>
      </label>
      {description && (
        <span id={descriptionId} className="ds-radio__description">
          {description}
        </span>
      )}
    </div>
  );
});
