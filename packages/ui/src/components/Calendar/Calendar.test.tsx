import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Calendar } from './Calendar';
import { formatDate, getDatePattern, parseDate, parseTime } from './dateUtils';

const day = (name: string) => screen.getByRole('button', { name: new RegExp(`^\\w+, ${name}$`) });

describe('Calendar', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 14, 10, 0)); // Sat 14 Nov 2026
  });
  afterEach(() => vi.useRealTimers());

  it('renders a labelled date grid with localised weekday headers', () => {
    render(<Calendar locale="en-US" firstDayOfWeek={0} />);
    const grid = screen.getByRole('grid', { name: 'November 2026' });
    expect(grid).toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(7);
    expect(headers[0]).toHaveTextContent('Su');
    expect(headers[0]).toHaveAttribute('abbr', 'Sunday');
    expect(screen.getAllByRole('row')).toHaveLength(7);
  });

  it('honours firstDayOfWeek', () => {
    render(<Calendar locale="en-US" firstDayOfWeek={1} />);
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('abbr', 'Monday');
  });

  it('marks today and the selected day, with a single tab stop', () => {
    render(<Calendar locale="en-US" defaultValue={new Date(2026, 10, 20)} />);
    expect(day('November 14, 2026')).toHaveAttribute('aria-current', 'date');
    const selected = day('November 20, 2026');
    expect(selected.closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(selected).toHaveAttribute('tabindex', '0');
    expect(screen.getAllByRole('gridcell').filter((c) => c.querySelector('[tabindex="0"]'))).toHaveLength(1);
  });

  it('selects a day on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar locale="en-US" onChange={onChange} />);
    await user.click(day('November 3, 2026'));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 3));
    expect(day('November 3, 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
  });

  it('supports the full grid keyboard model', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar locale="en-US" firstDayOfWeek={0} onChange={onChange} />);
    // Header: previous year, previous month, next month, next year; then the grid's single tab stop.
    for (let i = 0; i < 5; i += 1) await user.tab();
    expect(day('November 14, 2026')).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(day('November 15, 2026')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(day('November 8, 2026')).toHaveFocus();
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(day('November 22, 2026')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(day('November 21, 2026')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(day('November 15, 2026')).toHaveFocus(); // Sunday
    await user.keyboard('{End}');
    expect(day('November 21, 2026')).toHaveFocus(); // Saturday

    await user.keyboard('{PageDown}');
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(day('December 21, 2026')).toHaveFocus();
    await user.keyboard('{Shift>}{PageUp}{/Shift}');
    expect(screen.getByRole('grid', { name: 'December 2025' })).toBeInTheDocument();
    expect(day('December 21, 2025')).toHaveFocus();
    await user.keyboard('{PageUp}');
    expect(day('November 21, 2025')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2025, 10, 21));
    await user.keyboard('{ArrowRight}[Space]');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2025, 10, 22));
  });

  it('crosses month boundaries with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Calendar locale="en-US" defaultValue={new Date(2026, 10, 30)} />);
    day('November 30, 2026').focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(day('December 1, 2026')).toHaveFocus();
  });

  it('navigates months and years with the header buttons', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(<Calendar locale="en-US" onMonthChange={onMonthChange} />);
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'December 2026' })).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenLastCalledWith(new Date(2026, 11, 1));
    await user.click(screen.getByRole('button', { name: 'Previous year' }));
    expect(screen.getByRole('grid', { name: 'December 2025' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next year' }));
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  });

  it('respects min, max and disabled dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Calendar
        locale="en-US"
        min={new Date(2026, 10, 10)}
        max={new Date(2026, 10, 25)}
        isDateDisabled={(d) => d.getDate() === 18}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled();
    expect(day('November 9, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(day('November 18, 2026')).toHaveAttribute('aria-disabled', 'true');
    await user.click(day('November 9, 2026'));
    await user.click(day('November 18, 2026'));
    expect(onChange).not.toHaveBeenCalled();

    // Keyboard focus is clamped to the range.
    day('November 14, 2026').focus();
    await user.keyboard('{PageUp}');
    expect(day('November 10, 2026')).toHaveFocus();
    await user.keyboard('{PageDown}');
    expect(day('November 25, 2026')).toHaveFocus();
  });

  it('selects a range with start, end and in-range styling', async () => {
    const user = userEvent.setup();
    const onRangeChange = vi.fn();
    render(<Calendar locale="en-US" mode="range" onRangeChange={onRangeChange} />);
    expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(day('November 20, 2026'));
    expect(onRangeChange).toHaveBeenLastCalledWith({ start: new Date(2026, 10, 20), end: null });
    await user.click(day('November 16, 2026'));
    expect(onRangeChange).toHaveBeenLastCalledWith({ start: new Date(2026, 10, 16), end: new Date(2026, 10, 20) });
    expect(day('November 16, 2026').closest('td')).toHaveClass('ds-calendar__cell--range-start');
    expect(day('November 20, 2026').closest('td')).toHaveClass('ds-calendar__cell--range-end');
    expect(day('November 18, 2026').closest('td')).toHaveClass('ds-calendar__cell--in-range');
    expect(day('November 18, 2026').closest('td')).toHaveAttribute('aria-selected', 'true');
    expect(day('November 21, 2026').closest('td')).toHaveAttribute('aria-selected', 'false');
  });

  it('selects today from the footer button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Calendar locale="en-US" showTodayButton defaultMonth={new Date(2025, 0, 1)} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 14));
    expect(screen.getByRole('grid', { name: 'November 2026' })).toBeInTheDocument();
  });

  it('autoFocus focuses the active day, forwards refs and rest props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Calendar ref={ref} locale="en-US" autoFocus data-testid="cal" size="sm" variant="plain" />);
    expect(ref.current).toBe(screen.getByTestId('cal'));
    expect(ref.current).toHaveClass('ds-calendar', 'ds-calendar--sm', 'ds-calendar--plain');
    expect(day('November 14, 2026')).toHaveFocus();
  });
});

describe('date utils', () => {
  it('derives a pattern from the locale', () => {
    expect(getDatePattern('en-US')).toBe('MM/DD/YYYY');
    expect(getDatePattern('en-GB')).toBe('DD/MM/YYYY');
    expect(getDatePattern('de-DE')).toBe('DD.MM.YYYY');
  });

  it('formats and parses dates in a pattern', () => {
    const date = new Date(2026, 1, 5);
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('02/05/2026');
    expect(parseDate('2/5/2026', 'MM/DD/YYYY')).toEqual(date);
    expect(parseDate('05.02.26', 'DD.MM.YYYY')).toEqual(date);
    expect(parseDate('02052026', 'MM/DD/YYYY')).toEqual(date);
    expect(parseDate('2026-02-05', 'DD/MM/YYYY')).toEqual(date);
    expect(parseDate('02/30/2026', 'MM/DD/YYYY')).toBeNull();
    expect(parseDate('hello', 'MM/DD/YYYY')).toBeNull();
  });

  it('parses typed times', () => {
    expect(parseTime('9')).toBe(540);
    expect(parseTime('930')).toBe(570);
    expect(parseTime('9:30 pm')).toBe(21 * 60 + 30);
    expect(parseTime('12am')).toBe(0);
    expect(parseTime('21:15')).toBe(21 * 60 + 15);
    expect(parseTime('25:00')).toBeNull();
    expect(parseTime('13pm')).toBeNull();
  });
});
