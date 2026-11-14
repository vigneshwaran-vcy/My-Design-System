import { tokens } from '@my-ds/tokens';
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { Popover } from '../Popover';
import '../Input/Input.css';
import '../Dropdown/Dropdown.css';
import './ColorPicker.css';

export type ColorPickerSize = 'sm' | 'md' | 'lg';
export type ColorPickerVariant = 'outline' | 'filled';

export interface ColorSwatch {
  /** Hex colour, `#RGB` or `#RRGGBB`. */
  value: string;
  /** Accessible name, e.g. "Blue 600". Defaults to the hex value. */
  label?: string;
}

export interface ColorPickerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  /** Hex colour (`#RRGGBB`). */
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  /** Preset swatches. Defaults to the token palette (300 / 500 / 700 of each hue). */
  swatches?: Array<string | ColorSwatch>;
  /** Swatch grid columns. */
  columns?: number;
  /** Show the custom hex text field. */
  showCustom?: boolean;
  /** Show the browser's native colour picker next to the hex field. */
  showNativePicker?: boolean;
  /** Submits the value with a form through a hidden input. */
  name?: string;
  required?: boolean;
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
}

const HUES = ['primary', 'violet', 'pink', 'sky', 'success', 'warn', 'danger', 'gray'] as const;
const HUE_NAMES: Record<(typeof HUES)[number], string> = {
  primary: 'Blue',
  violet: 'Violet',
  pink: 'Pink',
  sky: 'Sky',
  success: 'Green',
  warn: 'Amber',
  danger: 'Red',
  gray: 'Gray',
};
const STEPS = ['300', '500', '700'] as const;
const palette = tokens.palette as unknown as Record<string, Record<string, string>>;

/** The default preset swatches: rows of 300 / 500 / 700 across every palette hue. */
export const defaultColorSwatches: ColorSwatch[] = STEPS.flatMap((step) =>
  HUES.map((hue) => ({ value: palette[hue][step], label: `${HUE_NAMES[hue]} ${step}` })),
);

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/** Normalises `#abc` / `abc` / `#aabbcc` to `#AABBCC`, or returns null when invalid. */
export function normalizeHex(input: string): string | null {
  const match = HEX.exec(input.trim());
  if (!match) return null;
  const digits = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1];
  return `#${digits.toUpperCase()}`;
}

/**
 * Colour picker: a trigger showing the current colour opens a popover with a preset swatch grid
 * (a radio group with 2-D arrow keys), a custom hex field and an optional native picker.
 * The ref and rest props go to the trigger button.
 */
export const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(function ColorPicker(
  {
    label,
    hideLabel = false,
    hint,
    error,
    value: valueProp,
    defaultValue = palette.primary['500'],
    onChange,
    swatches = defaultColorSwatches,
    columns = HUES.length,
    showCustom = true,
    showNativePicker = true,
    name,
    required,
    disabled,
    size = 'md',
    variant = 'outline',
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const triggerId = id ?? `ds-color-picker-${autoId}`;
  const labelId = `${triggerId}-label`;
  const hintId = hint ? `${triggerId}-hint` : undefined;
  const errorId = error ? `${triggerId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [rawValue, setValue] = useControllableState<string>(
    valueProp === undefined ? undefined : (normalizeHex(valueProp) ?? valueProp),
    normalizeHex(defaultValue) ?? defaultValue,
    onChange,
  );
  const value = normalizeHex(rawValue) ?? rawValue;

  const items: ColorSwatch[] = swatches.map((s) => {
    const swatch = typeof s === 'string' ? { value: s } : s;
    const hex = normalizeHex(swatch.value) ?? swatch.value;
    return { value: hex, label: swatch.label ?? hex };
  });
  const selectedIndex = items.findIndex((s) => s.value === value);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [draftError, setDraftError] = useState(false);
  const swatchRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep the hex field in step with the value while it is not being edited.
  useEffect(() => {
    setDraft(value);
    setDraftError(false);
  }, [value]);

  // Popover focuses its first focusable on open; move that to the selected swatch (roving tab stop).
  useEffect(() => {
    if (open) swatchRefs.current[Math.max(selectedIndex, 0)]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const pick = (hex: string) => setValue(hex);

  const handleGridKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: Math.min(index + 1, last),
      ArrowLeft: Math.max(index - 1, 0),
      ArrowDown: index + columns <= last ? index + columns : index,
      ArrowUp: index - columns >= 0 ? index - columns : index,
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = moves[event.key];
    swatchRefs.current[next]?.focus();
    pick(items[next].value);
  };

  const commitDraft = (text: string) => {
    const hex = normalizeHex(text);
    setDraftError(!hex);
    if (hex) pick(hex);
  };

  const tabStop = selectedIndex >= 0 ? selectedIndex : 0;

  return (
    <div className={cx('ds-field', 'ds-color-picker', `ds-color-picker--${size}`, disabled && 'ds-field--disabled', className)}>
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <Popover
        open={open}
        onOpenChange={setOpen}
        aria-label="Choose a colour"
        className="ds-color-picker__panel"
        trigger={
          <button
            ref={ref}
            id={triggerId}
            type="button"
            className={cx(
              'ds-dropdown__trigger',
              `ds-dropdown__trigger--${variant}`,
              `ds-dropdown__trigger--${size}`,
              'ds-color-picker__trigger',
              error && 'ds-dropdown__trigger--invalid',
            )}
            aria-labelledby={`${labelId} ${triggerId}`}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            disabled={disabled}
            {...rest}
            aria-describedby={describedBy}
          >
            <span className="ds-color-picker__value">
              <span className="ds-color-picker__swatch" style={{ '--color-picker-color': value } as CSSProperties} aria-hidden="true" />
              <span className="ds-color-picker__hex">{value}</span>
            </span>
            <Icon name="alt-arrow-down" className="ds-dropdown__chevron" />
          </button>
        }
      >
        <div
          role="radiogroup"
          aria-label="Preset colours"
          className="ds-color-picker__grid"
          style={{ '--color-picker-columns': columns } as CSSProperties}
        >
          {items.map((swatch, index) => (
            <button
              key={`${swatch.value}-${index}`}
              ref={(node) => {
                swatchRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={index === selectedIndex}
              aria-label={swatch.label}
              title={swatch.label}
              tabIndex={index === tabStop ? 0 : -1}
              className="ds-color-picker__option"
              style={{ '--color-picker-color': swatch.value } as CSSProperties}
              onClick={() => pick(swatch.value)}
              onKeyDown={(event) => handleGridKey(event, index)}
            >
              <Icon name="check" className="ds-color-picker__check" />
            </button>
          ))}
        </div>

        {(showCustom || showNativePicker) && (
          <div className="ds-color-picker__custom">
            <span
              className="ds-color-picker__preview"
              style={{ '--color-picker-color': value } as CSSProperties}
              aria-hidden="true"
            />
            {showCustom && (
              <Input
                className="ds-color-picker__hex-field"
                label="Hex"
                hideLabel
                size="sm"
                value={draft}
                spellCheck={false}
                autoComplete="off"
                maxLength={7}
                error={draftError ? 'Use a hex colour like #0260FF.' : undefined}
                onChange={(event) => {
                  setDraft(event.target.value);
                  const hex = normalizeHex(event.target.value);
                  if (hex && event.target.value.replace('#', '').length === 6) {
                    setDraftError(false);
                    pick(hex);
                  }
                }}
                onBlur={(event) => commitDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    commitDraft(event.currentTarget.value);
                  }
                }}
              />
            )}
            {showNativePicker && (
              <label className="ds-color-picker__native" title="Pick a custom colour">
                <input
                  type="color"
                  className="ds-visually-hidden"
                  aria-label="Pick a custom colour"
                  value={value.toLowerCase()}
                  onChange={(event) => pick(normalizeHex(event.target.value) ?? event.target.value)}
                />
                <Icon name="pipette" />
              </label>
            )}
          </div>
        )}
      </Popover>
      {name && <input type="hidden" name={name} value={value} />}
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
