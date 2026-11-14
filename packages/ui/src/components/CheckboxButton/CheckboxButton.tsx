import { forwardRef, useId, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import '../Input/Input.css';
import './CheckboxButton.css';

export type CheckboxButtonSize = 'sm' | 'md' | 'lg';
export type CheckboxButtonVariant = 'outline' | 'soft';

export interface CheckboxButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'checked' | 'defaultChecked' | 'onChange'> {
  /** Accessible name. The button is icon-only, so this is announced but not shown (also used as the hover title). */
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Icon shown while unchecked. */
  icon?: IconName;
  /** Icon shown while checked. */
  checkedIcon?: IconName;
  invalid?: boolean;
  size?: CheckboxButtonSize;
  /** `outline` = flat surface with a ring edge; `soft` = accent tint. Both fill solid accent when checked. */
  variant?: CheckboxButtonVariant;
}

/**
 * Square icon toggle with checkbox semantics (SLDS "checkbox button"): a visually hidden native checkbox
 * drives the state, so Space toggles it, it submits with forms and `:checked` styles work uncontrolled.
 * The ref and rest props go to the input.
 */
export const CheckboxButton = forwardRef<HTMLInputElement, CheckboxButtonProps>(function CheckboxButton(
  {
    label,
    checked,
    defaultChecked,
    onChange,
    icon = 'add',
    checkedIcon = 'check',
    invalid = false,
    size = 'md',
    variant = 'outline',
    id,
    className,
    disabled,
    title,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-checkbox-button-${autoId}`;

  return (
    <label
      htmlFor={inputId}
      title={title ?? label}
      className={cx(
        'ds-checkbox-button',
        `ds-checkbox-button--${size}`,
        `ds-checkbox-button--${variant}`,
        invalid && 'ds-checkbox-button--invalid',
        disabled && 'ds-checkbox-button--disabled',
        className,
      )}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="ds-checkbox-button__input ds-visually-hidden"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-label={label}
        {...rest}
        onChange={(event) => onChange?.(event.target.checked, event)}
      />
      <span className="ds-checkbox-button__box" aria-hidden="true">
        <Icon name={icon} className="ds-checkbox-button__icon ds-checkbox-button__icon--off" />
        <Icon name={checkedIcon} className="ds-checkbox-button__icon ds-checkbox-button__icon--on" />
      </span>
    </label>
  );
});
