import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './Combobox';

const options: ComboboxOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot', disabled: true },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('Combobox', () => {
  it('renders an editable, collapsed combobox', () => {
    render(<Combobox label="Fruit" options={options} />);
    const input = screen.getByRole('combobox', { name: 'Fruit' });
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('filters as you type and selects with the keyboard', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={options} onChange={onChange} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'ap');
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Apple', 'Apricot']);
    await user.keyboard('{ArrowDown}');
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Apple' }).id);
    // Disabled Apricot is skipped; wraps back to Apple.
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('apple');
    expect(input).toHaveValue('Apple');
    expect(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows a no-results row', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Fruit" options={options} emptyMessage="Nothing here" />);
    await user.type(screen.getByRole('combobox'), 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens on ArrowDown with all options, closes on Escape and reverts the text', async () => {
    const user = userEvent.setup();
    render(<Combobox label="Fruit" options={options} defaultValue="banana" />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveValue('Banana');
    input.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getAllByRole('option')).toHaveLength(4);
    expect(input).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Banana' }).id);
    await user.clear(input);
    await user.type(input, 'che');
    await user.keyboard('{Escape}');
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveValue('Banana');
  });

  it('selects by click and ignores disabled options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={options} onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'Apricot' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onChange).toHaveBeenCalledWith('cherry');
  });

  it('supports multiple selection with removable chips', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox label="Fruit" options={options} multiple defaultValue={['apple']} onChange={onChange} name="fruit" />);
    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(onChange).toHaveBeenLastCalledWith(['apple', 'banana']);
    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));
    expect(onChange).toHaveBeenLastCalledWith(['banana']);
    input.focus();
    await user.keyboard('{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('clears with the clear button and is disabled when asked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Combobox label="Fruit" options={options} defaultValue="apple" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('combobox')).toHaveValue('');
    rerender(<Combobox label="Fruit" options={options} onChange={onChange} disabled error="Required" />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Required');
  });

  it('follows a controlled value and forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    const { rerender } = render(<Combobox ref={ref} label="Fruit" options={options} value="apple" />);
    expect(ref.current).toBe(screen.getByRole('combobox'));
    expect(ref.current).toHaveValue('Apple');
    rerender(<Combobox ref={ref} label="Fruit" options={options} value="cherry" />);
    expect(ref.current).toHaveValue('Cherry');
  });
});
