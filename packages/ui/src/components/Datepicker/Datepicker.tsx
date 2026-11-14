import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { getFocusable } from '../../utils/focus';
import { Calendar, type CalendarLabels } from '../Calendar/Calendar';
import {
  formatDate,
  getDatePattern,
  isOutOfRange,
  isSameDay,
  parseDate,
  toISODate,
  type Weekday,
} from '../Calendar/dateUtils';
import { Icon } from '../Icon';
import '../Input/Input.css';
import './Datepicker.css';

export type DatepickerSize = 'sm' | 'md' | 'lg';
export type DatepickerVariant = 'outline' | 'filled';
export type DatepickerPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface DatepickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  /** Marks the field invalid without a message (e.g. when a parent shows the error). */
  invalid?: boolean;
  /** Controlled value (a local calendar day at midnight), or null for empty. */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Fires with the new day, or null when cleared. */
  onChange?: (value: Date | null) => void;
  min?: Date | null;
  max?: Date | null;
  /** Return true to disable a specific day. */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for the text format and calendar. Defaults to the runtime locale. */
  locale?: string;
  /** Text format built from YYYY, MM, M, DD, D (e.g. "DD/MM/YYYY"). Defaults to the locale's numeric format. */
  format?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's first day of the week. */
  firstDayOfWeek?: Weekday;
  /** Shown when typed text is not a valid, enabled date (unless `error` is set). */
  invalidMessage?: ReactNode;
  /** Accessible name for the calendar button and dialog. */
  calendarLabel?: string;
  /** Labels for the calendar's navigation buttons. */
  calendarLabels?: Partial<CalendarLabels>;
  /** Where the calendar opens relative to the field. */
  placement?: DatepickerPlacement;
  size?: DatepickerSize;
  variant?: DatepickerVariant;
}

/**
 * Date field: a text input that parses typed dates plus a button opening a Calendar in a dialog.
 * Rest props and the ref go to the text input.
 */
export const Datepicker = forwardRef<HTMLInputElement, DatepickerProps>(function Datepicker(
  {
    label,
    hideLabel = false,
    hint,
    error,
    invalid = false,
    value: valueProp,
    defaultValue = null,
    onChange,
    min,
    max,
    isDateDisabled,
    locale,
    format,
    firstDayOfWeek,
    invalidMessage,
    calendarLabel = 'Choose date',
    calendarLabels,
    placement = 'bottom-start',
    size = 'md',
    variant = 'outline',
    id,
    name,
    className,
    required,
    disabled,
    readOnly,
    placeholder,
    onBlur,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-datepicker-${autoId}`;
  const dialogId = `${inputId}-dialog`;
  const pattern = format ?? getDatePattern(locale);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const [text, setText] = useState(() => (value ? formatDate(value, pattern) : ''));
  const [typedInvalid, setTypedInvalid] = useState(false);
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keep the text in sync when the value (or format) changes from outside.
  const valueKey = value ? toISODate(value) : '';
  useEffect(() => {
    setText(value ? formatDate(value, pattern) : '');
    setTypedInvalid(false);
  }, [valueKey, pattern]);

  const errorMessage = error ?? (typedInvalid ? invalidMessage ?? `Enter a valid date as ${pattern}.` : undefined);
  const isInvalid = !!errorMessage || invalid;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = errorMessage ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const isDisabledDate = (date: Date) => isOutOfRange(date, min, max) || !!isDateDisabled?.(date);

  const setValue = (next: Date | null) => {
    if (next === value || isSameDay(next, value)) return;
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  };

  /** Parses the typed text; returns false when it is not a valid, enabled date. */
  const commitText = () => {
    if (!text.trim()) {
      setTypedInvalid(false);
      setValue(null);
      return true;
    }
    if (value && text === formatDate(value, pattern)) return true;
    const parsed = parseDate(text, pattern);
    if (!parsed || isDisabledDate(parsed)) {
      setTypedInvalid(true);
      return false;
    }
    setTypedInvalid(false);
    setText(formatDate(parsed, pattern));
    setValue(parsed);
    return true;
  };

  const closeDialog = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  const openDialog = () => {
    if (disabled || readOnly) return;
    commitText();
    setOpen(true);
  };

  // Close when pressing anywhere outside the field and its dialog.
  useEffect(() => {
    if (!open) return;
    const handle = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Enter') commitText();
    else if (event.key === 'ArrowDown' && (event.altKey || !open)) {
      event.preventDefault();
      openDialog();
    } else if (event.key === 'Escape' && typedInvalid) {
      setText(value ? formatDate(value, pattern) : '');
      setTypedInvalid(false);
    }
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeDialog(true);
    } else if (event.key === 'Tab') {
      // Keep focus inside the dialog: header buttons → active day → footer.
      const focusable = getFocusable(dialogRef.current).filter((el) => el.tabIndex >= 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const selectedLabel = value
    ? new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(value)
    : null;

  return (
    <div ref={rootRef} className={cx('ds-field', 'ds-datepicker', disabled && 'ds-field--disabled', className)}>
      <label htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </label>
      <div className="ds-datepicker__control">
        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className={cx(
            'ds-input',
            `ds-input--${variant}`,
            `ds-input--${size}`,
            'ds-datepicker__input',
            `ds-datepicker__input--${size}`,
            isInvalid && 'ds-input--invalid',
          )}
          placeholder={placeholder ?? pattern}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isInvalid || undefined}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (typedInvalid) setTypedInvalid(false);
          }}
          onBlur={(event) => {
            onBlur?.(event);
            commitText();
          }}
          onKeyDown={handleInputKeyDown}
          {...rest}
          aria-describedby={describedBy}
        />
        <button
          ref={buttonRef}
          type="button"
          className={cx('ds-datepicker__button', `ds-datepicker__button--${size}`)}
          aria-label={selectedLabel ? `${calendarLabel}, selected date is ${selectedLabel}` : calendarLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          disabled={disabled || readOnly}
          onClick={() => (open ? closeDialog(false) : openDialog())}
        >
          <Icon name="calendar" />
        </button>

        {open && (
          <div
            ref={dialogRef}
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-label={calendarLabel}
            className={cx('ds-datepicker__popover', `ds-datepicker__popover--${placement}`)}
            onKeyDown={handleDialogKeyDown}
          >
            <Calendar
              variant="plain"
              size={size === 'sm' ? 'sm' : 'md'}
              autoFocus
              showTodayButton
              value={value}
              min={min}
              max={max}
              isDateDisabled={isDateDisabled}
              locale={locale}
              firstDayOfWeek={firstDayOfWeek}
              labels={calendarLabels}
              onChange={(date) => {
                setTypedInvalid(false);
                setText(formatDate(date, pattern));
                setValue(date);
                closeDialog(true);
              }}
            />
          </div>
        )}
      </div>
      {name && <input type="hidden" name={name} value={value ? toISODate(value) : ''} />}
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
