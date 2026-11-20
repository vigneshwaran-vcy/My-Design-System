import {
  forwardRef,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Icon, type IconName } from '../Icon';
import '../Input/Input.css';
import './SegmentedControl.css';

export type SegmentedControlSize = 'sm' | 'md' | 'lg';
export type SegmentedControlVariant = 'neutral' | 'accent';

export interface SegmentedControlOption {
  value: string;
  label: ReactNode;
  /** Leading icon. With `iconOnly`, the label becomes the accessible name. */
  icon?: IconName;
  /** Hide the label visually and show only the icon. */
  iconOnly?: boolean;
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Group label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the group is marked invalid and the message is announced. */
  error?: ReactNode;
  options: SegmentedControlOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  /** Submits the value with a form through a hidden input. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  /** Stretch to the container width (segments share it equally). */
  fullWidth?: boolean;
  size?: SegmentedControlSize;
  /** `neutral` = raised white thumb (like the docs theme toggle); `accent` = solid blue thumb. */
  variant?: SegmentedControlVariant;
}

/**
 * Segmented control: a recessed track with a sliding thumb under the selected option.
 * Follows the WAI-ARIA radio group pattern (roving tabindex; arrows move and select, skipping disabled options).
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  {
    label,
    hideLabel = false,
    hint,
    error,
    options,
    value: valueProp,
    defaultValue = null,
    onChange,
    name,
    required = false,
    disabled = false,
    fullWidth = false,
    size = 'md',
    variant = 'neutral',
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const groupId = id ?? `ds-segmented-control-${autoId}`;
  const labelId = `${groupId}-label`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [value, setValue] = useControllableState<string | null>(valueProp, defaultValue, (next) => {
    if (next !== null) onChange?.(next);
  });
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const isEnabled = (i: number) => !disabled && !options[i]?.disabled;
  const firstEnabled = options.findIndex((_, i) => isEnabled(i));
  // Roving tabindex: the selected option, or the first enabled one when nothing is selected.
  const tabStop = selectedIndex >= 0 && isEnabled(selectedIndex) ? selectedIndex : firstEnabled;

  const select = (index: number) => {
    if (!isEnabled(index)) return;
    setValue(options[index].value);
  };

  const move = (from: number, delta: 1 | -1) => {
    const n = options.length;
    for (let step = 1; step <= n; step += 1) {
      const i = (from + delta * step + n) % n;
      if (isEnabled(i)) return i;
    }
    return from;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | undefined;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = move(index, 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        next = move(index, -1);
        break;
      case 'Home':
        next = firstEnabled;
        break;
      case 'End':
        next = move(0, -1);
        break;
      default:
        return;
    }
    event.preventDefault();
    if (next === undefined || next < 0) return;
    buttons.current[next]?.focus();
    select(next);
  };

  const trackStyle = {
    '--seg-count': options.length,
    '--seg-index': Math.max(selectedIndex, 0),
  } as CSSProperties;

  return (
    <div
      ref={ref}
      id={groupId}
      className={cx(
        'ds-field',
        'ds-segmented-control',
        `ds-segmented-control--${size}`,
        `ds-segmented-control--${variant}`,
        fullWidth && 'ds-segmented-control--full-width',
        error && 'ds-segmented-control--invalid',
        disabled && 'ds-field--disabled',
        className,
      )}
      {...rest}
      aria-describedby={undefined}
    >
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-disabled={disabled || undefined}
        className="ds-segmented-control__track"
        style={trackStyle}
      >
        {selectedIndex >= 0 && <span className="ds-segmented-control__thumb" aria-hidden="true" />}
        {options.map((option, index) => {
          const checked = index === selectedIndex;
          const optionDisabled = disabled || option.disabled;
          return (
            <button
              key={option.value}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={optionDisabled}
              tabIndex={index === tabStop ? 0 : -1}
              className={cx('ds-segmented-control__option', option.iconOnly && 'ds-segmented-control__option--icon-only')}
              onClick={() => select(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {option.icon && <Icon name={option.icon} className="ds-segmented-control__icon" />}
              <span className={cx('ds-segmented-control__label', option.iconOnly && 'ds-visually-hidden')}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
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
