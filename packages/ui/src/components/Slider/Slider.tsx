import {
  forwardRef,
  useId,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import '../Input/Input.css';
import './Slider.css';

export type SliderSize = 'sm' | 'md';
export type SliderVariant = 'accent' | 'neutral';

export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
  > {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the slider is marked invalid and the message is announced. */
  error?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number, event?: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => void;
  /** Shows the current value at the end of the label row. */
  showValue?: boolean;
  /** Shows the min and max under the track. */
  showRange?: boolean;
  /** Formats the visible value and `aria-valuetext`. */
  formatValue?: (value: number) => string;
  size?: SliderSize;
  /** `accent` fills the range in brand blue; `neutral` in the strong text colour. */
  variant?: SliderVariant;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Snaps to the nearest step from `min`, avoiding floating-point drift (0.1 + 0.2). */
const snap = (n: number, min: number, max: number, step: number) => {
  const decimals = (String(step).split('.')[1] ?? '').length;
  const snapped = Math.round((n - min) / step) * step + min;
  return clamp(Number(snapped.toFixed(decimals)), min, max);
};

/** Single-value slider on a fully themed native `input[type=range]`. The ref goes to the input. */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    label,
    hideLabel = false,
    hint,
    error,
    min = 0,
    max = 100,
    step = 1,
    value: valueProp,
    defaultValue,
    onChange,
    showValue = false,
    showRange = false,
    formatValue = String,
    size = 'md',
    variant = 'accent',
    id,
    className,
    disabled,
    required,
    style,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-slider-${autoId}`;
  const valueId = `${inputId}-value`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [value, setValue] = useControllableState<number>(
    valueProp,
    snap(defaultValue ?? min, min, max, step),
    undefined,
  );
  const current = clamp(value, min, max);
  const percent = max > min ? ((current - min) / (max - min)) * 100 : 0;

  const update = (next: number, event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>) => {
    const snapped = snap(next, min, max, step);
    if (snapped === current) return;
    setValue(snapped);
    onChange?.(snapped, event);
  };

  // Keyboard is handled here (not left to the browser) so PageUp/PageDown move a consistent 10%
  // and every key behaves the same in every engine.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;
    const big = Math.max(step, (max - min) / 10);
    const moves: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      PageUp: current + big,
      PageDown: current - big,
      Home: min,
      End: max,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    update(moves[event.key], event);
  };

  return (
    <div
      className={cx(
        'ds-field',
        'ds-slider',
        `ds-slider--${size}`,
        `ds-slider--${variant}`,
        error && 'ds-slider--invalid',
        disabled && 'ds-field--disabled',
        disabled && 'ds-slider--disabled',
        className,
      )}
      style={{ ...style, '--slider-progress': `${percent}%` } as CSSProperties}
    >
      <div className={cx('ds-slider__header', hideLabel && !showValue && 'ds-visually-hidden')}>
        <label htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
          {label}
          {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
        </label>
        {showValue && (
          <output id={valueId} htmlFor={inputId} className="ds-slider__value" aria-hidden="true">
            {formatValue(current)}
          </output>
        )}
      </div>
      <input
        ref={ref}
        id={inputId}
        type="range"
        className="ds-slider__input"
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        required={required}
        aria-valuetext={formatValue(current)}
        aria-invalid={error ? true : undefined}
        onChange={(event) => update(Number(event.target.value), event)}
        onKeyDown={handleKeyDown}
        {...rest}
        aria-describedby={describedBy}
      />
      {showRange && (
        <div className="ds-slider__range" aria-hidden="true">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
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
