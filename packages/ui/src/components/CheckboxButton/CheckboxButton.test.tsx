import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxButton } from './CheckboxButton';

describe('CheckboxButton', () => {
  it('renders a labelled checkbox', () => {
    render(<CheckboxButton label="Add to list" />);
    const box = screen.getByRole('checkbox', { name: 'Add to list' });
    expect(box).not.toBeChecked();
  });

  it('toggles on click and Space (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CheckboxButton label="Add" onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(box).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(true, expect.anything());
    await user.tab();
    await user.tab({ shift: true });
    expect(box).toHaveFocus();
    await user.keyboard(' ');
    expect(box).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it('respects the controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CheckboxButton label="Add" checked={false} onChange={onChange} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true, expect.anything());
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('does not toggle when disabled and exposes invalid', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CheckboxButton label="Add" disabled invalid onChange={onChange} />);
    const box = screen.getByRole('checkbox');
    await user.click(box);
    expect(onChange).not.toHaveBeenCalled();
    expect(box).toBeDisabled();
    expect(box).toHaveAttribute('aria-invalid', 'true');
  });

  it('forwards the ref and applies size/variant classes', () => {
    const ref = createRef<HTMLInputElement>();
    render(<CheckboxButton ref={ref} label="Add" size="lg" variant="soft" name="fav" value="1" />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(ref.current).toHaveAttribute('name', 'fav');
    expect(ref.current?.closest('label')).toHaveClass('ds-checkbox-button--lg', 'ds-checkbox-button--soft');
  });
});
