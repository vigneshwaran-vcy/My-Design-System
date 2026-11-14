import { forwardRef, useEffect, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { formatDate, isSameDay, minutesOfDate, startOfDay, timeToMinutes, toTimeString, type Weekday } from '../Calendar/dateUtils';
import { Datepicker } from '../Datepicker/Datepicker';
import { Timepicker } from '../Timepicker/Timepicker';
import '../Input/Input.css';
import './DatetimePicker.css';

export type DatetimePickerSize = 'sm' | 'md' | 'lg';
export type DatetimePickerVariant = 'outline' | 'filled';

export interface DatetimePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Group label shared by the date and time fields. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message for the whole value; both fields are marked invalid. */
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  /** Controlled value, or null for empty. */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Fires with the combined date and time once both are set, or null when either is cleared. */
  onChange?: (value: Date | null) => void;
  /** Earliest allowed moment; limits days and, on that day, times. */
  min?: Date | null;
  /** Latest allowed moment; limits days and, on that day, times. */
  max?: Date | null;
  isDateDisabled?: (date: Date) => boolean;
  locale?: string;
  /** Date text format (see Datepicker `format`). */
  dateFormat?: string;
  firstDayOfWeek?: Weekday;
  /** Minutes between listed times. */
  timeStep?: number;
  hour12?: boolean;
  /** Names of the two inner fields (screen-reader only). */
  dateLabel?: string;
  timeLabel?: string;
  /** Submits a local "YYYY-MM-DDTHH:mm" value with a form through a hidden input. */
  name?: string;
  size?: DatetimePickerSize;
  variant?: DatetimePickerVariant;
}

const combine = (date: Date, time: string) => {
  const minutes = timeToMinutes(time) ?? 0;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(minutes / 60), minutes % 60);
};

/**
 * A Datepicker and a Timepicker side by side (stacked when narrow) producing one Date.
 * Rest props and the ref go to the wrapping `role="group"` element.
 */
export const DatetimePicker = forwardRef<HTMLDivElement, DatetimePickerProps>(function DatetimePicker(
  {
    label,
    hideLabel = false,
    hint,
    error,
    required,
    disabled,
    value: valueProp,
    defaultValue = null,
    onChange,
    min,
    max,
    isDateDisabled,
    locale,
    dateFormat,
    firstDayOfWeek,
    timeStep = 30,
    hour12,
    dateLabel = 'Date',
    timeLabel = 'Time',
    name,
    size = 'md',
    variant = 'outline',
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const groupId = id ?? `ds-datetimepicker-${autoId}`;
  const labelId = `${groupId}-label`;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  // The two halves can be partly filled while `value` is still null.
  const [datePart, setDatePart] = useState<Date | null>(value ? startOfDay(value) : null);
  const [timePart, setTimePart] = useState<string | null>(value ? toTimeString(minutesOfDate(value)) : null);

  // Follow outside changes to the value; an outside null only clears a complete pair.
  const valueKey = value ? value.getTime() : null;
  useEffect(() => {
    if (value) {
      setDatePart(startOfDay(value));
      setTimePart(toTimeString(minutesOfDate(value)));
    } else {
      setDatePart((d) => (d && timePart ? null : d));
      setTimePart((t) => (t && datePart ? null : t));
    }
  }, [valueKey]);

  const emit = (date: Date | null, time: string | null) => {
    const next = date && time ? combine(date, time) : null;
    if ((next?.getTime() ?? null) === (value?.getTime() ?? null)) return;
    if (valueProp === undefined) setInternalValue(next);
    onChange?.(next);
  };

  // On the min/max day, the time list is limited too.
  const timeMin = min && datePart && isSameDay(datePart, min) ? toTimeString(minutesOfDate(min)) : undefined;
  const timeMax = max && datePart && isSameDay(datePart, max) ? toTimeString(minutesOfDate(max)) : undefined;

  return (
    <div
      ref={ref}
      id={groupId}
      role="group"
      aria-labelledby={labelId}
      aria-describedby={describedBy}
      className={cx('ds-field', 'ds-datetimepicker', disabled && 'ds-field--disabled', className)}
      {...rest}
    >
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <div className="ds-datetimepicker__fields">
        <Datepicker
          className="ds-datetimepicker__date"
          label={dateLabel}
          hideLabel
          value={datePart}
          onChange={(date) => {
            setDatePart(date);
            emit(date, timePart);
          }}
          min={min}
          max={max}
          isDateDisabled={isDateDisabled}
          locale={locale}
          format={dateFormat}
          firstDayOfWeek={firstDayOfWeek}
          required={required}
          disabled={disabled}
          invalid={!!error}
          size={size}
          variant={variant}
          aria-describedby={describedBy}
        />
        <Timepicker
          className="ds-datetimepicker__time"
          label={timeLabel}
          hideLabel
          value={timePart}
          onChange={(time) => {
            setTimePart(time);
            emit(datePart, time);
          }}
          min={timeMin}
          max={timeMax}
          step={timeStep}
          locale={locale}
          hour12={hour12}
          required={required}
          disabled={disabled}
          invalid={!!error}
          size={size}
          variant={variant}
          aria-describedby={describedBy}
        />
      </div>
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ? `${formatDate(value, 'YYYY-MM-DD')}T${toTimeString(minutesOfDate(value))}` : ''}
        />
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
