import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Timepicker } from './Timepicker';

describe('Timepicker', () => {
  it('renders a labelled, collapsed combobox', () => {
    render(<Timepicker label="Start time" locale="en-US" hint="Local time" />);
    const combo = screen.getByRole('combobox', { name: 'Start time' });
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(combo).toHaveAttribute('aria-autocomplete', 'list');
    expect(combo).toHaveAccessibleDescription('Local time');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('lists times at the configured step in 12-hour format', async () => {
    const user = userEvent.setup();
    render(<Timepicker label="Time" locale="en-US" step={15} />);
    await user.click(screen.getByRole('combobox'));
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options).toHaveLength(96);
    expect(options[0]).toHaveTextContent('12:00 AM');
    expect(options[1]).toHaveTextContent('12:15 AM');
  });

  it('uses a 24-hour clock when asked', async () => {
    const user = userEvent.setup();
    render(<Timepicker label="Time" locale="en-GB" hour12={false} defaultValue="21:30" />);
    expect(screen.getByRole('combobox')).toHaveValue('21:30');
    await user.click(screen.getByRole('combobox'));
    expect(screen.getAllByRole('option')).toHaveLength(48);
    expect(screen.getByRole('option', { name: '21:30' })).toHaveAttribute('aria-selected', 'true');
  });

  it('respects min and max', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Timepicker label="Time" locale="en-US" min="09:00" max="17:00" step={60} onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(9);
    expect(options[0]).toHaveTextContent('9:00 AM');
    expect(options[8]).toHaveTextContent('5:00 PM');
    await user.keyboard('{Escape}');
    await user.clear(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), '7:00 pm');
    await user.tab();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid time.');
  });

  it('is keyboard operable like Dropdown', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Timepicker label="Time" locale="en-US" defaultValue="10:00" onChange={onChange} />);
    await user.tab();
    const combo = screen.getByRole('combobox');
    expect(combo).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(combo).toHaveAttribute('aria-expanded', 'true');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: '10:00 AM' }).id);
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: '11:00 AM' }).id);
    await user.keyboard('{ArrowUp}{Enter}');
    expect(onChange).toHaveBeenCalledWith('10:30');
    expect(combo).toHaveValue('10:30 AM');
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(combo).toHaveFocus();

    await user.keyboard('{ArrowDown}{Escape}');
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(combo).toHaveValue('10:30 AM');
  });

  it('filters options as you type and selects the first match on Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Timepicker label="Time" locale="en-US" onChange={onChange} />);
    const combo = screen.getByRole('combobox');
    await user.type(combo, '9:3');
    const options = screen.getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(['9:30 AM', '9:30 PM']);
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('09:30');
  });

  it('parses free-typed times that are not on the step', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Timepicker label="Time" locale="en-US" onChange={onChange} />);
    const combo = screen.getByRole('combobox');
    await user.type(combo, '2:07 pm');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith('14:07');
    expect(combo).toHaveValue('2:07 PM');
  });

  it('selects with the mouse and toggles from the clock button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Timepicker label="Time" locale="en-US" step={60} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Show times' }));
    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getByRole('combobox')).toHaveFocus();
    await user.click(screen.getByRole('option', { name: '3:00 PM' }));
    expect(onChange).toHaveBeenCalledWith('15:00');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clears the value and closes when clicking outside', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <Timepicker label="Time" locale="en-US" defaultValue="08:00" onChange={onChange} />
        <button type="button">Outside</button>
      </>,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    await user.clear(screen.getByRole('combobox'));
    await user.tab();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('supports name, error, disabled, sizes and forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { container, rerender } = render(
      <Timepicker ref={ref} label="Time" name="at" defaultValue="07:15" error="Pick a time" size="sm" variant="filled" />,
    );
    expect(ref.current).toBe(screen.getByRole('combobox'));
    expect(ref.current).toHaveClass('ds-input--sm', 'ds-input--filled', 'ds-input--invalid');
    expect(container.querySelector('input[name="at"]')).toHaveValue('07:15');
    expect(screen.getByRole('alert')).toHaveTextContent('Pick a time');
    rerender(<Timepicker ref={ref} label="Time" disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
