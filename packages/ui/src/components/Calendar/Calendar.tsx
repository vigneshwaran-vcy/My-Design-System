import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Button } from '../Button';
import { Icon } from '../Icon';
import {
  addDays,
  addMonths,
  addYears,
  clampDay,
  compareDays,
  getFirstDayOfWeek,
  getMonthWeeks,
  getWeekdays,
  isOutOfRange,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  toISODate,
  type Weekday,
} from './dateUtils';
import './Calendar.css';

export type CalendarSize = 'sm' | 'md' | 'lg';
/** `outline` is a framed surface; `plain` drops the frame for use inside popovers. */
export type CalendarVariant = 'outline' | 'plain';
export type CalendarMode = 'single' | 'range';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface CalendarLabels {
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  today: string;
}

const DEFAULT_LABELS: CalendarLabels = {
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  today: 'Today',
};

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** `single` picks one day; `range` picks a start and an end day. */
  mode?: CalendarMode;
  /** Controlled selected day (single mode). */
  value?: Date | null;
  defaultValue?: Date | null;
  /** Fires whenever a day is picked (single mode), even when it is already selected. */
  onChange?: (date: Date) => void;
  /** Controlled range (range mode). */
  range?: DateRange;
  defaultRange?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  /** Controlled visible month (any day inside it). */
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /** Earliest selectable day. */
  min?: Date | null;
  /** Latest selectable day. */
  max?: Date | null;
  /** Return true to disable a specific day (e.g. weekends). */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for month and weekday names. Defaults to the runtime locale. */
  locale?: string;
  /** 0 = Sunday … 6 = Saturday. Defaults to the locale's first day of the week. */
  firstDayOfWeek?: Weekday;
  /** Show days of the previous/next month in the leading and trailing weeks. */
  showOutsideDays?: boolean;
  /** Adds a footer button that jumps to and selects today. */
  showTodayButton?: boolean;
  /** Accessible names for the navigation buttons. */
  labels?: Partial<CalendarLabels>;
  /** Moves focus to the active day when the calendar mounts (used by the pickers). */
  autoFocus?: boolean;
  size?: CalendarSize;
  variant?: CalendarVariant;
}

/** Month grid following the WAI-ARIA date grid pattern: one tab stop, arrow keys move between days. */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    mode = 'single',
    value: valueProp,
    defaultValue = null,
    onChange,
    range: rangeProp,
    defaultRange = { start: null, end: null },
    onRangeChange,
    month: monthProp,
    defaultMonth,
    onMonthChange,
    min,
    max,
    isDateDisabled,
    locale,
    firstDayOfWeek,
    showOutsideDays = true,
    showTodayButton = false,
    labels: labelsProp,
    autoFocus = false,
    size = 'md',
    variant = 'outline',
    className,
    ...rest
  },
  ref,
) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const titleId = `ds-calendar-${useId()}-title`;
  const today = startOfDay(new Date());
  const weekStart = firstDayOfWeek ?? getFirstDayOfWeek(locale);

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const [internalRange, setInternalRange] = useState(defaultRange);
  const range = rangeProp ?? internalRange;
  const anchor = mode === 'range' ? range.start : value;

  const isDisabled = (date: Date) => isOutOfRange(date, min, max) || !!isDateDisabled?.(date);

  const [month, setMonthState] = useControllableState<Date>(
    monthProp ? startOfMonth(monthProp) : undefined,
    startOfMonth(defaultMonth ?? clampDay(anchor ?? today, min, max)),
    onMonthChange,
  );
  const setMonth = (next: Date) => {
    if (!isSameMonth(next, month)) setMonthState(startOfMonth(next));
  };

  const initialFocus = (forMonth: Date) => {
    if (anchor && isSameMonth(anchor, forMonth)) return startOfDay(anchor);
    if (isSameMonth(today, forMonth)) return clampDay(today, min, max);
    return clampDay(startOfMonth(forMonth), min, max);
  };
  const [focusedState, setFocused] = useState(() => initialFocus(month));
  const focused = isSameMonth(focusedState, month) ? focusedState : initialFocus(month);

  const [hovered, setHovered] = useState<Date | null>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const shouldFocus = useRef(autoFocus);

  // After keyboard navigation (or on mount with autoFocus), move DOM focus to the active day.
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${toISODate(focused)}"]`)?.focus();
  });

  const moveFocus = (next: Date) => {
    const target = clampDay(next, min, max);
    setFocused(target);
    setMonth(target);
    shouldFocus.current = true;
  };

  const select = (date: Date) => {
    if (isDisabled(date)) return;
    const day = startOfDay(date);
    if (mode === 'range') {
      const next =
        range.start && !range.end
          ? compareDays(day, range.start) < 0
            ? { start: day, end: range.start }
            : { start: range.start, end: day }
          : { start: day, end: null };
      if (!rangeProp) setInternalRange(next);
      onRangeChange?.(next);
    } else {
      if (valueProp === undefined) setInternalValue(day);
      onChange?.(day);
    }
  };

  const shiftMonth = (delta: number) => {
    // Year jumps stop at the min/max month instead of skipping past it.
    const nextFocus = clampDay(addMonths(focused, delta), min, max);
    setMonth(nextFocus);
    setFocused(nextFocus);
  };

  const handleGridKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const offsetInWeek = (focused.getDay() - weekStart + 7) % 7;
    let next: Date | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        next = addDays(focused, -1);
        break;
      case 'ArrowRight':
        next = addDays(focused, 1);
        break;
      case 'ArrowUp':
        next = addDays(focused, -7);
        break;
      case 'ArrowDown':
        next = addDays(focused, 7);
        break;
      case 'Home':
        next = addDays(focused, -offsetInWeek);
        break;
      case 'End':
        next = addDays(focused, 6 - offsetInWeek);
        break;
      case 'PageUp':
        next = event.shiftKey ? addYears(focused, -1) : addMonths(focused, -1);
        break;
      case 'PageDown':
        next = event.shiftKey ? addYears(focused, 1) : addMonths(focused, 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(focused);
        return;
      default:
        return;
    }
    event.preventDefault();
    moveFocus(next);
  };

  const minMonth = min ? startOfMonth(min) : null;
  const maxMonth = max ? startOfMonth(max) : null;
  const canGoBack = (months: number) => !minMonth || compareDays(addMonths(month, -months), minMonth) >= 0;
  const canGoForward = (months: number) => !maxMonth || compareDays(addMonths(month, months), maxMonth) <= 0;

  const titleFormat = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  const dayLabelFormat = new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const dayNumberFormat = new Intl.DateTimeFormat(locale, { day: 'numeric' });
  const weekdays = getWeekdays(locale, weekStart);
  const weeks = getMonthWeeks(month, weekStart);

  // Range preview: while only a start is picked, hovering/focusing shows the would-be range.
  const pendingEnd = mode === 'range' && range.start && !range.end ? hovered ?? focused : null;
  const [rangeStart, rangeEnd] = (() => {
    if (mode !== 'range' || !range.start) return [null, null];
    const end = range.end ?? pendingEnd;
    if (!end) return [range.start, range.start];
    return compareDays(end, range.start) < 0 ? [end, range.start] : [range.start, end];
  })();

  const navButton = (label: string, icon: 'alt-arrow-left' | 'alt-arrow-right' | 'double-alt-arrow-left' | 'double-alt-arrow-right', onClick: () => void, disabled: boolean) => (
    <button type="button" className="ds-calendar__nav" aria-label={label} disabled={disabled} onClick={onClick}>
      <Icon name={icon} />
    </button>
  );

  return (
    <div
      ref={ref}
      className={cx('ds-calendar', `ds-calendar--${size}`, `ds-calendar--${variant}`, className)}
      {...rest}
    >
      <div className="ds-calendar__header">
        <div className="ds-calendar__nav-group">
          {navButton(labels.previousYear, 'double-alt-arrow-left', () => shiftMonth(-12), !canGoBack(1))}
          {navButton(labels.previousMonth, 'alt-arrow-left', () => shiftMonth(-1), !canGoBack(1))}
        </div>
        <h2 id={titleId} className="ds-calendar__title" aria-live="polite">
          {titleFormat.format(month)}
        </h2>
        <div className="ds-calendar__nav-group">
          {navButton(labels.nextMonth, 'alt-arrow-right', () => shiftMonth(1), !canGoForward(1))}
          {navButton(labels.nextYear, 'double-alt-arrow-right', () => shiftMonth(12), !canGoForward(1))}
        </div>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={titleId}
        aria-multiselectable={mode === 'range' || undefined}
        className="ds-calendar__grid"
        onKeyDown={handleGridKeyDown}
        onPointerLeave={() => setHovered(null)}
      >
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day.long} scope="col" abbr={day.long} className="ds-calendar__weekday">
                {day.short.slice(0, 2)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toISODate(week[0])}>
              {week.map((date) => {
                const outside = !isSameMonth(date, month);
                const key = toISODate(date);
                if (outside && !showOutsideDays) return <td key={key} role="gridcell" className="ds-calendar__cell" />;

                const disabled = isDisabled(date);
                const isStart = isSameDay(date, rangeStart);
                const isEnd = isSameDay(date, rangeEnd);
                const inRange = !!rangeStart && !!rangeEnd && compareDays(date, rangeStart) >= 0 && compareDays(date, rangeEnd) <= 0;
                const selected = mode === 'range' ? (isStart || isEnd || inRange) && !disabled : isSameDay(date, value);
                const filled = mode === 'range' ? isStart || isEnd : selected;
                const isFocusTarget = isSameDay(date, focused);
                const hasBand = inRange && !isSameDay(rangeStart, rangeEnd);

                return (
                  <td
                    key={key}
                    role="gridcell"
                    aria-selected={selected}
                    className={cx(
                      'ds-calendar__cell',
                      hasBand && 'ds-calendar__cell--in-range',
                      hasBand && isStart && 'ds-calendar__cell--range-start',
                      hasBand && isEnd && 'ds-calendar__cell--range-end',
                    )}
                  >
                    <button
                      type="button"
                      tabIndex={isFocusTarget ? 0 : -1}
                      data-date={key}
                      aria-label={dayLabelFormat.format(date)}
                      aria-current={isSameDay(date, today) ? 'date' : undefined}
                      aria-disabled={disabled || undefined}
                      className={cx(
                        'ds-calendar__day',
                        outside && 'ds-calendar__day--outside',
                        isSameDay(date, today) && 'ds-calendar__day--today',
                        filled && 'ds-calendar__day--selected',
                        disabled && 'ds-calendar__day--disabled',
                      )}
                      onClick={() => {
                        setFocused(date);
                        setMonth(date);
                        select(date);
                      }}
                      onPointerEnter={() => setHovered(disabled ? null : date)}
                    >
                      {dayNumberFormat.format(date)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {showTodayButton && (
        <div className="ds-calendar__footer">
          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled(today)}
            onClick={() => {
              moveFocus(today);
              select(today);
            }}
          >
            {labels.today}
          </Button>
        </div>
      )}
    </div>
  );
});
