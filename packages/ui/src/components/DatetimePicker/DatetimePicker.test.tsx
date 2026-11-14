import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatetimePicker } from './DatetimePicker';

describe('DatetimePicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 14, 10, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('renders a labelled group with a date field and a time field', () => {
    render(<DatetimePicker label="Meeting" locale="en-US" hint="Your local time zone" />);
    const group = screen.getByRole('group', { name: 'Meeting' });
    expect(group).toHaveAccessibleDescription('Your local time zone');
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveAccessibleDescription('Your local time zone');
    expect(screen.getByRole('combobox', { name: 'Time' })).toBeInTheDocument();
  });

  it('shows the default value split across both fields', () => {
    render(<DatetimePicker label="Meeting" locale="en-US" defaultValue={new Date(2026, 10, 20, 14, 30)} />);
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('11/20/2026');
    expect(screen.getByRole('combobox', { name: 'Time' })).toHaveValue('2:30 PM');
  });

  it('emits one Date once both halves are set', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatetimePicker label="Meeting" locale="en-US" onChange={onChange} />);
    await user.type(screen.getByRole('textbox', { name: 'Date' }), '11/20/2026');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    await user.tab(); // skip the calendar button
    await user.keyboard('9:15 am');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 10, 20, 9, 15));

    // Picking a new day keeps the time.
    await user.click(screen.getByRole('button', { name: /Choose date/ }));
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 10, 21, 9, 15));
  });

  it('emits null when a half is cleared', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DatetimePicker label="Meeting" locale="en-US" defaultValue={new Date(2026, 10, 20, 8, 0)} onChange={onChange} />);
    await user.clear(screen.getByRole('combobox', { name: 'Time' }));
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('11/20/2026');
  });

  it('limits times on the min day', async () => {
    const user = userEvent.setup();
    render(
      <DatetimePicker
        label="Meeting"
        locale="en-US"
        timeStep={60}
        min={new Date(2026, 10, 20, 18, 0)}
        defaultValue={new Date(2026, 10, 20, 19, 0)}
      />,
    );
    await user.click(screen.getByRole('combobox', { name: 'Time' }));
    const options = screen.getAllByRole('option');
    expect(options[0]).toHaveTextContent('6:00 PM');
    expect(options).toHaveLength(6);
  });

  it('works controlled and submits a local ISO value', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<Date | null>(new Date(2026, 10, 20, 9, 0));
      return (
        <>
          <DatetimePicker label="Meeting" locale="en-US" name="at" value={value} onChange={setValue} />
          <button type="button" onClick={() => setValue(new Date(2027, 0, 2, 16, 45))}>
            Set
          </button>
        </>
      );
    }
    const { container } = render(<Controlled />);
    expect(container.querySelector('input[name="at"]')).toHaveValue('2026-11-20T09:00');
    await user.click(screen.getByRole('button', { name: 'Set' }));
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveValue('01/02/2027');
    expect(screen.getByRole('combobox', { name: 'Time' })).toHaveValue('4:45 PM');
    expect(container.querySelector('input[name="at"]')).toHaveValue('2027-01-02T16:45');
  });

  it('shares error and disabled state and forwards the ref to the group', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(<DatetimePicker ref={ref} label="Meeting" error="Pick a slot" data-testid="dt" />);
    expect(ref.current).toBe(screen.getByTestId('dt'));
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a slot');
    expect(screen.getByRole('textbox', { name: 'Date' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('combobox', { name: 'Time' })).toHaveAttribute('aria-invalid', 'true');
    rerender(<DatetimePicker ref={ref} label="Meeting" disabled />);
    expect(screen.getByRole('textbox', { name: 'Date' })).toBeDisabled();
    expect(screen.getByRole('combobox', { name: 'Time' })).toBeDisabled();
  });
});
