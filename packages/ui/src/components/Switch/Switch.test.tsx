import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a button with role="switch" named by its label', () => {
    render(<Switch label="Notifications" />);
    const toggle = screen.getByRole('switch', { name: 'Notifications' });
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle).not.toBeChecked();
  });

  it('keeps a hidden label available to screen readers', () => {
    render(<Switch label="Dark mode" hideLabel />);
    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeInTheDocument();
  });

  it('describes the switch with its description', () => {
    render(<Switch label="Notifications" description="Push alerts" />);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('Push alerts');
  });

  it('toggles uncontrolled from the button and the label', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(true, expect.anything());
    await user.click(screen.getByText('Notifications'));
    expect(toggle).not.toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith(false, expect.anything());
  });

  it('respects a controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" checked onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    await user.click(toggle);
    expect(onChange).toHaveBeenCalledWith(false, expect.anything());
    expect(toggle).toBeChecked();
  });

  it('works with a controlled parent', async () => {
    const user = userEvent.setup();
    function Settings() {
      const [on, setOn] = useState(false);
      return <Switch label="Notifications" checked={on} onChange={setOn} description={on ? 'on' : 'off'} />;
    }
    render(<Settings />);
    await user.click(screen.getByRole('switch'));
    expect(screen.getByRole('switch')).toBeChecked();
    expect(screen.getByText('on')).toBeInTheDocument();
  });

  it('toggles with Space and Enter', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" />);
    await user.tab();
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveFocus();
    await user.keyboard(' ');
    expect(toggle).toBeChecked();
    await user.keyboard('{Enter}');
    expect(toggle).not.toBeChecked();
  });

  it('cannot be toggled when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Notifications" disabled onChange={onChange} />);
    const toggle = screen.getByRole('switch');
    await user.click(screen.getByText('Notifications'));
    expect(toggle).toBeDisabled();
    expect(toggle).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('submits a hidden input only while checked', () => {
    const { container, rerender } = render(<Switch label="Beta" name="beta" checked={false} onChange={() => {}} />);
    expect(container.querySelector('input[name="beta"]')).toBeNull();
    rerender(<Switch label="Beta" name="beta" value="yes" checked onChange={() => {}} />);
    expect(container.querySelector('input[name="beta"]')).toHaveValue('yes');
  });

  it('applies size and label position classes and forwards refs', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} label="Notifications" size="sm" labelPosition="start" className="extra" />);
    expect(ref.current).toHaveClass('ds-switch__control');
    expect(ref.current?.closest('.ds-switch')).toHaveClass('ds-switch--sm', 'ds-switch--label-start', 'extra');
  });
});
