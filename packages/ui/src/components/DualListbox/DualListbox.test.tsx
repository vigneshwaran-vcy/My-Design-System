import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { DualListbox, type DualListboxOption } from './DualListbox';

const options: DualListboxOption[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Bravo' },
  { value: 'c', label: 'Charlie', disabled: true },
  { value: 'd', label: 'Delta' },
  { value: 'e', label: 'Echo' },
];

const source = () => screen.getByRole('listbox', { name: 'Available' });
const target = () => screen.getByRole('listbox', { name: 'Selected' });
const names = (list: HTMLElement) => within(list).queryAllByRole('option').map((o) => o.textContent);

describe('DualListbox', () => {
  it('renders a labelled group with two multi-select listboxes', () => {
    render(<DualListbox label="Letters" options={options} defaultValue={['d']} />);
    expect(screen.getByRole('group', { name: 'Letters' })).toBeInTheDocument();
    expect(source()).toHaveAttribute('aria-multiselectable', 'true');
    expect(names(source())).toEqual(['Alpha', 'Bravo', 'Charlie', 'Echo']);
    expect(names(target())).toEqual(['Delta']);
    expect(screen.getByRole('button', { name: 'Move selection to Selected' })).toBeDisabled();
  });

  it('moves with click, Ctrl-click and Shift-click selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DualListbox label="Letters" options={options} onChange={onChange} />);
    await user.click(screen.getByRole('option', { name: 'Alpha' }));
    await user.keyboard('{Shift>}');
    await user.click(screen.getByRole('option', { name: 'Delta' }));
    await user.keyboard('{/Shift}');
    // Range skips the disabled Charlie.
    expect(screen.getByRole('option', { name: 'Bravo' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Charlie' })).toHaveAttribute('aria-selected', 'false');
    await user.keyboard('{Control>}');
    await user.click(screen.getByRole('option', { name: 'Bravo' }));
    await user.keyboard('{/Control}');
    await user.click(screen.getByRole('button', { name: 'Move selection to Selected' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'd']);
    expect(names(target())).toEqual(['Alpha', 'Delta']);
    expect(screen.getByText('2 items moved to Selected')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Move selection to Available' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('is keyboard operable: arrows, Shift+arrows, Space, Ctrl+A and Enter to move', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DualListbox label="Letters" options={options} onChange={onChange} />);
    await user.tab();
    expect(source()).toHaveFocus();
    expect(source()).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Alpha' }).id);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Bravo' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'false');
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
    expect(screen.getByRole('option', { name: 'Delta' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Control>}{ArrowDown}{/Control} ');
    expect(screen.getByRole('option', { name: 'Echo' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['b', 'd', 'e']);
    await user.click(target());
    await user.keyboard('{Control>}a{/Control}');
    expect(within(target()).getAllByRole('option').every((o) => o.getAttribute('aria-selected') === 'true')).toBe(true);
  });

  it('reorders the selected list', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DualListbox label="Letters" options={options} defaultValue={['a', 'b', 'd']} reorderable onChange={onChange} />);
    await user.click(screen.getByRole('option', { name: 'Delta' }));
    await user.click(screen.getByRole('button', { name: 'Move selection up' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'd', 'b']);
    target().focus();
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect(onChange).toHaveBeenLastCalledWith(['d', 'a', 'b']);
    await user.click(screen.getByRole('button', { name: 'Move selection down' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'd', 'b']);
  });

  it('cannot select disabled options and respects a disabled group', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<DualListbox label="Letters" options={options} onChange={onChange} />);
    await user.dblClick(screen.getByRole('option', { name: 'Charlie' }));
    expect(onChange).not.toHaveBeenCalled();
    rerender(<DualListbox label="Letters" options={options} onChange={onChange} disabled />);
    expect(source()).toHaveAttribute('aria-disabled', 'true');
    expect(source()).toHaveAttribute('tabindex', '-1');
    await user.dblClick(screen.getByRole('option', { name: 'Alpha' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('moves on double-click, stays controlled, wires errors and forwards the ref', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <DualListbox ref={ref} label="Letters" options={options} value={['a']} onChange={onChange} required error="Pick more" name="letters" />,
    );
    await user.dblClick(screen.getByRole('option', { name: 'Echo' }));
    expect(onChange).toHaveBeenCalledWith(['a', 'e']);
    expect(names(target())).toEqual(['Alpha']);
    expect(target()).toHaveAttribute('aria-required', 'true');
    expect(target()).toHaveAttribute('aria-invalid', 'true');
    expect(target()).toHaveAccessibleDescription('Pick more');
    expect(container.querySelectorAll('input[name="letters"]')).toHaveLength(1);
    expect(ref.current).toBe(screen.getByRole('group'));
  });
});
