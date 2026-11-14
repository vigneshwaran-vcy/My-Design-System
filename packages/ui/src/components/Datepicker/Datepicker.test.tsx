import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Datepicker } from './Datepicker';

const day = (name: string) => screen.getByRole('button', { name: new RegExp(`^\\w+, ${name}$`) });

describe('Datepicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 14, 10, 0));
  });
  afterEach(() => vi.useRealTimers());

  it('renders a labelled text field with a locale-derived placeholder and calendar button', () => {
    render(<Datepicker label="Start date" locale="en-US" hint="Your first day" required />);
    const input = screen.getByRole('textbox', { name: /Start date/ });
    expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('Your first day');
    const button = screen.getByRole('button', { name: 'Choose date' });
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows the default value in the configured format', () => {
    render(<Datepicker label="Date" format="DD.MM.YYYY" defaultValue={new Date(2026, 1, 5)} />);
    expect(screen.getByRole('textbox')).toHaveValue('05.02.2026');
  });

  it('parses a typed date on blur and on Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Datepicker label="Date" locale="en-US" onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, '2/5/2026');
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 1, 5));
    expect(input).toHaveValue('02/05/2026');

    await user.clear(input);
    await user.type(input, '12/24/2026{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 11, 24));
  });

  it('flags invalid and out-of-range typed dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Datepicker label="Date" locale="en-US" max={new Date(2026, 11, 31)} onChange={onChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, '13/45/2026{Enter}');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid date as MM/DD/YYYY.');
    await user.clear(input);
    await user.type(input, '01/02/2027{Enter}');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('clears the value when the text is emptied', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Datepicker label="Date" locale="en-US" defaultValue={new Date(2026, 10, 1)} onChange={onChange} />);
    await user.clear(screen.getByRole('textbox'));
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('opens the calendar dialog, focuses the selected day and selects with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Datepicker label="Date" locale="en-US" defaultValue={new Date(2026, 10, 20)} onChange={onChange} />);
    const button = screen.getByRole('button', { name: /Choose date, selected date is Friday, November 20, 2026/ });
    await user.click(button);
    const dialog = screen.getByRole('dialog', { name: 'Choose date' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', dialog.id);
    expect(day('November 20, 2026')).toHaveFocus();

    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 21));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    expect(screen.getByRole('textbox')).toHaveValue('11/21/2026');
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<Datepicker label="Date" locale="en-US" />);
    const button = screen.getByRole('button', { name: 'Choose date' });
    await user.click(button);
    expect(day('November 14, 2026')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('opens with Alt+ArrowDown from the input and traps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    render(<Datepicker label="Date" locale="en-US" />);
    screen.getByRole('textbox').focus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
    const dialog = screen.getByRole('dialog');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Today' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Previous year' })).toHaveFocus();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Datepicker label="Date" locale="en-US" />
        <button type="button">Outside</button>
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('applies min/max and disabled dates inside the calendar', async () => {
    const user = userEvent.setup();
    render(
      <Datepicker
        label="Date"
        locale="en-US"
        min={new Date(2026, 10, 10)}
        isDateDisabled={(d) => d.getDay() === 0}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    expect(day('November 9, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(day('November 15, 2026')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled();
  });

  it('works controlled and submits an ISO value through a hidden input', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<Date | null>(new Date(2026, 10, 1));
      return (
        <form aria-label="form">
          <Datepicker label="Date" locale="en-US" name="due" value={value} onChange={setValue} />
          <button type="button" onClick={() => setValue(new Date(2026, 0, 9))}>
            Set
          </button>
        </form>
      );
    }
    const { container } = render(<Controlled />);
    expect(container.querySelector('input[name="due"]')).toHaveValue('2026-11-01');
    await user.click(screen.getByRole('button', { name: 'Set' }));
    expect(screen.getByRole('textbox')).toHaveValue('01/09/2026');
    expect(container.querySelector('input[name="due"]')).toHaveValue('2026-01-09');
  });

  it('supports error, disabled, sizes and forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Datepicker ref={ref} label="Date" error="Required" size="lg" variant="filled" />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(ref.current).toHaveClass('ds-input--lg', 'ds-input--filled', 'ds-input--invalid');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    rerender(<Datepicker ref={ref} label="Date" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeDisabled();
  });
});
