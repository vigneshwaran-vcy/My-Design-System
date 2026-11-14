import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ColorPicker, defaultColorSwatches, normalizeHex } from './ColorPicker';

const swatches = [
  { value: '#0260FF', label: 'Blue' },
  { value: '#16A34A', label: 'Green' },
  { value: '#D97706', label: 'Amber' },
  { value: '#DC2626', label: 'Red' },
];

describe('ColorPicker', () => {
  it('renders a labelled trigger showing the current colour', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ColorPicker ref={ref} label="Brand" defaultValue="#0260ff" />);
    const trigger = screen.getByRole('button', { name: /Brand/ });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveTextContent('#0260FF');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a dialog, focuses the selected swatch and picks with arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker label="Brand" swatches={swatches} columns={2} defaultValue="#16A34A" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Brand/ }));
    expect(screen.getByRole('dialog', { name: 'Choose a colour' })).toBeVisible();
    const green = screen.getByRole('radio', { name: 'Green' });
    expect(green).toHaveAttribute('aria-checked', 'true');
    expect(green).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('#DC2626');
    await user.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenLastCalledWith('#D97706');
    await user.keyboard('{Home}');
    expect(onChange).toHaveBeenLastCalledWith('#0260FF');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Brand/ })).toHaveFocus();
  });

  it('accepts a custom hex and flags invalid input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker label="Brand" swatches={swatches} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Brand/ }));
    const hex = screen.getByRole('textbox', { name: 'Hex' });
    await user.clear(hex);
    await user.type(hex, '#abcdef');
    expect(onChange).toHaveBeenLastCalledWith('#ABCDEF');
    await user.clear(hex);
    await user.type(hex, 'zz{Enter}');
    expect(hex).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports the native colour input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker label="Brand" onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Brand/ }));
    fireEvent.change(screen.getByLabelText('Pick a custom colour'), { target: { value: '#123456' } });
    expect(onChange).toHaveBeenLastCalledWith('#123456');
  });

  it('is disabled and announces errors', () => {
    render(<ColorPicker label="Brand" disabled error="Low contrast" name="brand" />);
    const trigger = screen.getByRole('button', { name: /Brand/ });
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription('Low contrast');
  });

  it('normalises hex values and builds default swatches from tokens', () => {
    expect(normalizeHex('abc')).toBe('#AABBCC');
    expect(normalizeHex('#0260ff')).toBe('#0260FF');
    expect(normalizeHex('nope')).toBeNull();
    expect(defaultColorSwatches).toHaveLength(24);
    defaultColorSwatches.forEach((s) => expect(normalizeHex(s.value)).not.toBeNull());
  });
});
