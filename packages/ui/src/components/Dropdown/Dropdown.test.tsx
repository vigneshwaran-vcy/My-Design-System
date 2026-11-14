import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown, type DropdownOption } from './Dropdown';

const options: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
];

describe('Dropdown', () => {
  it('renders a labelled, collapsed combobox showing the placeholder', () => {
    render(<Dropdown label="Fruit" options={options} placeholder="Pick one" />);
    const combo = screen.getByRole('combobox', { name: /Fruit/ });
    expect(combo).toHaveAttribute('aria-expanded', 'false');
    expect(combo).toHaveTextContent('Pick one');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens on click and selects an option', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={options} onChange={onChange} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeVisible();
    await user.click(screen.getByRole('option', { name: 'Cherry' }));
    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('is fully keyboard operable and skips disabled options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={options} onChange={onChange} />);
    await user.tab();
    const combo = screen.getByRole('combobox');
    expect(combo).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Apple' }).id);
    await user.keyboard('{ArrowDown}');
    expect(combo).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Cherry' }).id);
    await user.keyboard('{End}{Enter}');
    expect(onChange).toHaveBeenCalledWith('date');
    expect(combo).toHaveFocus();
  });

  it('closes on Escape without changing the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={options} defaultValue="apple" onChange={onChange} />);
    screen.getByRole('combobox').focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Escape}');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports typeahead', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Dropdown label="Fruit" options={options} onChange={onChange} />);
    screen.getByRole('combobox').focus();
    await user.keyboard('d');
    expect(onChange).toHaveBeenCalledWith('date');
  });

  it('marks the selected option and ignores disabled ones', async () => {
    const user = userEvent.setup();
    render(<Dropdown label="Fruit" options={options} defaultValue="cherry" />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('option', { name: 'Banana' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('Cherry');
  });

  it('closes when clicking outside', async () => {
    const user = userEvent.setup();
    render(<><Dropdown label="Fruit" options={options} /><p>outside</p></>);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('outside'));
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('announces hint and error and marks itself invalid', () => {
    render(<Dropdown label="Fruit" options={options} hint="Seasonal" error="Required" />);
    const combo = screen.getByRole('combobox');
    expect(combo).toHaveAttribute('aria-invalid', 'true');
    expect(combo).toHaveAccessibleDescription('Seasonal Required');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('cannot be opened when disabled', async () => {
    const user = userEvent.setup();
    render(<Dropdown label="Fruit" options={options} disabled />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('submits through a hidden input, applies classes and forwards refs', () => {
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Dropdown ref={ref} label="Fruit" options={options} name="fruit" defaultValue="date" size="lg" variant="filled" />,
    );
    expect(ref.current).toBe(screen.getByRole('combobox'));
    expect(ref.current).toHaveClass('ds-dropdown__trigger--lg', 'ds-dropdown__trigger--filled');
    expect(container.querySelector('input[name="fruit"]')).toHaveValue('date');
  });
});
