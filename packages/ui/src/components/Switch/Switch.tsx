import { forwardRef, useId, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import '../Input/Input.css';
import './Switch.css';

export type SwitchSize = 'sm' | 'md';
export type SwitchLabelPosition = 'start' | 'end';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'type'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  /** Secondary text under the label, linked via aria-describedby. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  size?: SwitchSize;
  /** Where the label sits relative to the track. */
  labelPosition?: SwitchLabelPosition;
  /** Submits the state with a form through a hidden input (`on` when checked). */
  name?: string;
  /** Value submitted with `name` when checked. */
  value?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    hideLabel = false,
    description,
    checked,
    defaultChecked = false,
    onChange,
    size = 'md',
    labelPosition = 'end',
    name,
    value = 'on',
    id,
    className,
    disabled,
    onClick,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const switchId = id ?? `ds-switch-${autoId}`;
  const labelId = `${switchId}-label`;
  const descriptionId = description ? `${switchId}-description` : undefined;
  const describedBy = [rest['aria-describedby'], descriptionId].filter(Boolean).join(' ') || undefined;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const next = !isChecked;
    if (checked === undefined) setInternalChecked(next);
    onChange?.(next, event);
  };

  return (
    <div
      className={cx(
        'ds-switch',
        `ds-switch--${size}`,
        `ds-switch--label-${labelPosition}`,
        disabled && 'ds-switch--disabled',
        className,
      )}
    >
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        className="ds-switch__control"
        aria-checked={isChecked}
        aria-labelledby={labelId}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
        aria-describedby={describedBy}
      >
        <span className="ds-switch__thumb" aria-hidden="true" />
      </button>
      <span className={cx('ds-switch__text', hideLabel && !description && 'ds-visually-hidden')}>
        <label id={labelId} htmlFor={switchId} className={cx('ds-switch__label', hideLabel && 'ds-visually-hidden')}>
          {label}
        </label>
        {description && (
          <span id={descriptionId} className="ds-switch__description">
            {description}
          </span>
        )}
      </span>
      {name && isChecked && <input type="hidden" name={name} value={value} />}
    </div>
  );
});
