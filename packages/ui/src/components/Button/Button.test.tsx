import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders an accessible button with type="button" by default', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('ds-button', 'ds-button--primary', 'ds-button--md');
  });

  it('applies variant and size classes', () => {
    render(<Button variant="danger" size="lg">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('ds-button--danger', 'ds-button--lg');
  });

  it.each(['xs', 'sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Button size={size}>Sized</Button>);
    expect(screen.getByRole('button')).toHaveClass(`ds-button--${size}`);
  });

  it('supports the soft variant', () => {
    render(<Button variant="soft">Soft</Button>);
    expect(screen.getByRole('button')).toHaveClass('ds-button--soft');
  });

  it('fires onClick from mouse and keyboard (Enter + Space)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    await user.tab();
    await user.tab({ shift: true });
    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('is reachable with Tab', async () => {
    const user = userEvent.setup();
    render(<Button>Focus me</Button>);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is busy, stays focusable and ignores clicks while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await user.tab();
    expect(button).toHaveFocus();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('hides decorative icons from assistive tech', () => {
    render(<Button leadingIcon="+">Add</Button>);
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('acts as a toggle button when selected is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<Button selected={false} onClick={onClick}>Bold</Button>);
    const button = screen.getByRole('button', { name: 'Bold', pressed: false });
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    rerender(<Button selected onClick={onClick}>Bold</Button>);
    expect(screen.getByRole('button', { name: 'Bold', pressed: true })).toBe(button);
  });

  it('is not a toggle unless selected is set', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
  });

  it('forwards refs and extra props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} data-testid="b" type="submit">Send</Button>);
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveAttribute('type', 'submit');
  });
});
