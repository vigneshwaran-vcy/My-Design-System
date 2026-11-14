import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { formatTime, parseTime, timeToMinutes, toTimeString, usesHour12 } from '../Calendar/dateUtils';
import { Icon } from '../Icon';
import '../Input/Input.css';
import './Timepicker.css';

export type TimepickerSize = 'sm' | 'md' | 'lg';
export type TimepickerVariant = 'outline' | 'filled';

export interface TimepickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  /** Marks the field invalid without a message (e.g. when a parent shows the error). */
  invalid?: boolean;
  /** Controlled value as 24-hour "HH:mm", or null for empty. */
  value?: string | null;
  defaultValue?: string | null;
  /** Fires with the new "HH:mm" value, or null when cleared. */
  onChange?: (value: string | null) => void;
  /** Minutes between listed options. Typed times may fall between steps. */
  step?: number;
  /** Earliest allowed time, "HH:mm". */
  min?: string | null;
  /** Latest allowed time, "HH:mm". */
  max?: string | null;
  /** BCP 47 locale for the time labels. Defaults to the runtime locale. */
  locale?: string;
  /** 12-hour clock with AM/PM. Defaults to the locale's convention. */
  hour12?: boolean;
  /** Shown when typed text is not a valid time in range (unless `error` is set). */
  invalidMessage?: ReactNode;
  /** Accessible name for the button that shows the list. */
  toggleLabel?: string;
  size?: TimepickerSize;
  variant?: TimepickerVariant;
}

const normalize = (text: string) => text.toLowerCase().replace(/[\s.  ]/g, '');

/**
 * Time field following the WAI-ARIA editable combobox pattern with list autocomplete:
 * type to filter or enter any time, or pick from a list at a fixed step. Rest props and the ref go to the input.
 */
export const Timepicker = forwardRef<HTMLInputElement, TimepickerProps>(function Timepicker(
  {
    label,
    hideLabel = false,
    hint,
    error,
    invalid = false,
    value: valueProp,
    defaultValue = null,
    onChange,
    step = 30,
    min,
    max,
    locale,
    hour12: hour12Prop,
    invalidMessage,
    toggleLabel = 'Show times',
    placeholder,
    size = 'md',
    variant = 'outline',
    id,
    name,
    className,
    required,
    disabled,
    readOnly,
    onBlur,
    onKeyDown,
    onClick,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-timepicker-${autoId}`;
  const labelId = `${inputId}-label`;
  const listId = `${inputId}-list`;
  const optionId = (minutes: number) => `${inputId}-option-${minutes}`;
  const hour12 = hour12Prop ?? usesHour12(locale);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const valueMinutes = timeToMinutes(value);
  const display = (minutes: number | null) => (minutes === null ? '' : formatTime(minutes, locale, hour12));

  const [text, setText] = useState(() => display(valueMinutes));
  const [typedInvalid, setTypedInvalid] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const minMinutes = timeToMinutes(min) ?? 0;
  const maxMinutes = timeToMinutes(max) ?? 24 * 60 - 1;

  const options = useMemo(() => {
    const list: { minutes: number; label: string; keys: string[] }[] = [];
    const stride = Math.max(1, Math.round(step));
    for (let m = 0; m < 24 * 60; m += stride) {
      if (m < minMinutes || m > maxMinutes) continue;
      const label12 = formatTime(m, locale, hour12);
      const plain = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
      list.push({ minutes: m, label: label12, keys: [normalize(label12), normalize(plain), normalize(toTimeString(m))] });
    }
    return list;
  }, [step, minMinutes, maxMinutes, locale, hour12]);

  const visible = useMemo(() => {
    if (!query) return options;
    const q = normalize(query);
    return options.filter((o) => o.keys.some((k) => k.startsWith(q)));
  }, [options, query]);

  // Keep the text in sync when the value changes from outside.
  useEffect(() => {
    setText(display(valueMinutes));
    setTypedInvalid(false);
  }, [value, locale, hour12]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const option = visible[activeIndex];
    if (!option) return;
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(option.minutes))}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex, visible]);

  // Close when pressing anywhere outside the field.
  useEffect(() => {
    if (!open) return;
    const handle = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  const errorMessage = error ?? (typedInvalid ? invalidMessage ?? 'Enter a valid time.' : undefined);
  const isInvalid = !!errorMessage || invalid;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const setValue = (minutes: number | null) => {
    const next = minutes === null ? null : toTimeString(minutes);
    setText(display(minutes));
    setTypedInvalid(false);
    if (next === value) return;
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  };

  const commitText = () => {
    if (!text.trim()) return setValue(null);
    if (valueMinutes !== null && text === display(valueMinutes)) return;
    const minutes = parseTime(text);
    if (minutes === null || minutes < minMinutes || minutes > maxMinutes) {
      setTypedInvalid(true);
      return;
    }
    setValue(minutes);
  };

  const openList = (activate: 'selected' | 'first' | 'last' | 'none' = 'selected') => {
    if (disabled || readOnly) return;
    setQuery(null);
    setOpen(true);
    if (activate === 'none') return setActiveIndex(-1);
    if (activate === 'first') return setActiveIndex(0);
    if (activate === 'last') return setActiveIndex(options.length - 1);
    if (valueMinutes === null) return setActiveIndex(0);
    const next = options.findIndex((o) => o.minutes >= valueMinutes);
    setActiveIndex(next >= 0 ? next : options.length - 1);
  };

  const commitOption = (index: number) => {
    const option = visible[index];
    if (!option) return;
    setValue(option.minutes);
    setOpen(false);
    setQuery(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!open) openList(event.altKey ? 'none' : 'selected');
        else if (visible.length) setActiveIndex((i) => Math.min(i + 1, visible.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList(valueMinutes === null ? 'last' : 'selected');
        else if (event.altKey) {
          if (activeIndex >= 0) commitOption(activeIndex);
          else setOpen(false);
        } else if (visible.length) setActiveIndex((i) => (i < 0 ? visible.length - 1 : Math.max(i - 1, 0)));
        break;
      case 'Enter':
        if (open) event.preventDefault();
        if (open && activeIndex >= 0) commitOption(activeIndex);
        else {
          // Prefer an exact parse ("9:07"); fall back to the first filtered option ("9:3" → 9:30).
          const parsed = parseTime(text);
          if (text.trim() && (parsed === null || parsed < minMinutes || parsed > maxMinutes) && open && visible.length) {
            commitOption(0);
          } else {
            commitText();
            setOpen(false);
          }
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          setOpen(false);
        } else if (text !== display(valueMinutes)) {
          event.preventDefault();
          setText(display(valueMinutes));
          setTypedInvalid(false);
        }
        break;
      case 'Tab':
        if (open && activeIndex >= 0) commitOption(activeIndex);
        break;
      default:
    }
  };

  const activeOption = open && activeIndex >= 0 ? visible[activeIndex] : undefined;

  return (
    <div ref={rootRef} className={cx('ds-field', 'ds-timepicker', disabled && 'ds-field--disabled', className)}>
      <label id={labelId} htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </label>
      <div className="ds-timepicker__control">
        <input
          ref={(node) => {
            inputRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeOption ? optionId(activeOption.minutes) : undefined}
          className={cx(
            'ds-input',
            `ds-input--${variant}`,
            `ds-input--${size}`,
            'ds-timepicker__input',
            `ds-timepicker__input--${size}`,
            isInvalid && 'ds-input--invalid',
          )}
          placeholder={placeholder ?? (hour12 ? formatTime(9 * 60, locale, true).replace(/\d/g, '–') : '––:––')}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isInvalid || undefined}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setQuery(event.target.value);
            setActiveIndex(-1);
            if (typedInvalid) setTypedInvalid(false);
            if (!disabled && !readOnly) setOpen(true);
          }}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented && !open) openList();
          }}
          onBlur={(event) => {
            onBlur?.(event);
            if (rootRef.current?.contains(event.relatedTarget as Node)) return;
            commitText();
            setOpen(false);
          }}
          onKeyDown={handleKeyDown}
          {...rest}
          aria-describedby={describedBy}
        />
        <button
          type="button"
          tabIndex={-1}
          className={cx('ds-timepicker__button', `ds-timepicker__button--${size}`)}
          aria-label={toggleLabel}
          aria-controls={listId}
          aria-expanded={open}
          disabled={disabled || readOnly}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (open) setOpen(false);
            else openList();
            inputRef.current?.focus();
          }}
        >
          <Icon name="clock-circle" />
        </button>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          hidden={!open || visible.length === 0}
          className="ds-timepicker__list"
          // Keep focus in the input while clicking options.
          onMouseDown={(event) => event.preventDefault()}
        >
          {visible.map((option, index) => {
            const selected = option.minutes === valueMinutes;
            return (
              <li
                key={option.minutes}
                id={optionId(option.minutes)}
                role="option"
                aria-selected={selected}
                className={cx(
                  'ds-timepicker__option',
                  index === activeIndex && 'ds-timepicker__option--active',
                  selected && 'ds-timepicker__option--selected',
                )}
                onPointerMove={() => setActiveIndex(index)}
                onClick={() => commitOption(index)}
              >
                <span>{option.label}</span>
                <Icon name="check" className="ds-timepicker__check" />
              </li>
            );
          })}
        </ul>
      </div>
      {name && <input type="hidden" name={name} value={value ?? ''} />}
      {hint && (
        <p id={hintId} className="ds-field__hint">
          {hint}
        </p>
      )}
      {errorMessage && (
        <p id={errorId} className="ds-field__error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});
