import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders a polite status by default with the info variant', () => {
    render(<Alert>Changes saved.</Alert>);
    const alert = screen.getByRole('status');
    expect(alert).toHaveClass('ds-alert', 'ds-alert--info');
    expect(alert).toHaveTextContent('Changes saved.');
  });

  it.each(['danger', 'warn'] as const)('uses role="alert" for the %s variant', (variant) => {
    render(<Alert variant={variant}>Heads up</Alert>);
    expect(screen.getByRole('alert')).toHaveClass(`ds-alert--${variant}`);
  });

  it.each(['info', 'success', 'neutral'] as const)('uses role="status" for the %s variant', (variant) => {
    render(<Alert variant={variant}>Note</Alert>);
    expect(screen.getByRole('status')).toHaveClass(`ds-alert--${variant}`);
  });

  it('lets an explicit role override the default', () => {
    render(<Alert variant="danger" role="status">Quiet</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders the title with medium weight class and the message', () => {
    render(<Alert title="Payment failed">Update your card.</Alert>);
    expect(screen.getByText('Payment failed')).toHaveClass('ds-alert__title');
    expect(screen.getByText('Update your card.')).toHaveClass('ds-alert__message');
  });

  it('renders a default icon that is hidden from assistive tech', () => {
    const { container } = render(<Alert>Hi</Alert>);
    const icon = container.querySelector('.ds-alert__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('svg')).toBeInTheDocument();
  });

  it('accepts a custom icon and hides the icon when icon is null', () => {
    const { container, rerender } = render(<Alert icon={<span data-testid="custom" />}>Hi</Alert>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();
    rerender(<Alert icon={null}>Hi</Alert>);
    expect(container.querySelector('.ds-alert__icon')).not.toBeInTheDocument();
  });

  it('shows a Dismiss button only when dismissible and calls onDismiss', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    const { rerender } = render(<Alert>Hi</Alert>);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
    rerender(<Alert dismissible onDismiss={onDismiss}>Hi</Alert>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('dismisses from the keyboard', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Hi</Alert>);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('renders the action slot', () => {
    render(<Alert action={<button type="button">Retry</button>}>Failed</Alert>);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('forwards refs, merges className and spreads rest props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref} className="custom" data-testid="a">Hi</Alert>);
    expect(ref.current).toBe(screen.getByTestId('a'));
    expect(ref.current).toHaveClass('ds-alert', 'custom');
  });
});
