import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a native checkbox named by its label', () => {
    render(<Checkbox label="Accept terms" />);
    const box = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(box).not.toBeChecked();
    expect(box).toHaveClass('ds-checkbox__input', 'ds-visually-hidden');
  });

  it('keeps a hidden label available to screen readers', () => {
    render(<Checkbox label="Select row" hideLabel />);
    expect(screen.getByRole('checkbox', { name: 'Select row' })).toBeInTheDocument();
  });

  it('describes the box with its description and error', () => {
    render(<Checkbox label="Updates" description="Monthly digest" error="Required" />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAccessibleDescription('Monthly digest Required');
    expect(box).toBeInvalid();
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('marks the box invalid without a message', () => {
    render(<Checkbox label="Updates" invalid />);
    expect(screen.getByRole('checkbox')).toBeInvalid();
  });

  it('toggles uncontrolled and reports the next value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Updates" onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(screen.getByText('Updates'));
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(true, expect.anything());
    await user.click(box);
    expect(box).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it('respects a controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Updates" checked onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(onChange).toHaveBeenCalledWith(false, expect.anything());
    expect(box).toBeChecked();
  });

  it('works with a controlled parent', async () => {
    const user = userEvent.setup();
    function Form() {
      const [on, setOn] = useState(false);
      return <Checkbox label="Updates" checked={on} onChange={setOn} description={on ? 'on' : 'off'} />;
    }
    render(<Form />);
    await user.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByText('on')).toBeInTheDocument();
  });

  it('toggles with the keyboard', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Updates" />);
    await user.tab();
    const box = screen.getByRole('checkbox');
    expect(box).toHaveFocus();
    await user.keyboard(' ');
    expect(box).toBeChecked();
  });

  it('exposes the indeterminate state', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Select all" indeterminate />);
    expect(ref.current?.indeterminate).toBe(true);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('cannot be toggled when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Updates" disabled onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(box).toBeDisabled();
    expect(box).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies size classes, forwards refs and native props', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Updates" size="sm" name="updates" value="yes" className="extra" />);
    expect(ref.current).toHaveAttribute('name', 'updates');
    expect(ref.current).toHaveAttribute('value', 'yes');
    expect(ref.current?.closest('.ds-checkbox')).toHaveClass('ds-checkbox--sm', 'extra');
  });
});
