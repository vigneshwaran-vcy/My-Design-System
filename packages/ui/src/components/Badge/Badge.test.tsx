import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders a span with the default classes', () => {
    render(<Badge data-testid="b">New</Badge>);
    const badge = screen.getByTestId('b');
    expect(badge.tagName).toBe('SPAN');
    expect(badge).toHaveTextContent('New');
    expect(badge).toHaveClass('ds-badge', 'ds-badge--neutral', 'ds-badge--subtle', 'ds-badge--md');
  });

  it.each(['neutral', 'accent', 'success', 'warn', 'danger', 'outline'] as const)('applies the %s variant class', (variant) => {
    render(<Badge data-testid="b" variant={variant}>x</Badge>);
    expect(screen.getByTestId('b')).toHaveClass(`ds-badge--${variant}`);
  });

  it('applies appearance and size classes', () => {
    render(<Badge data-testid="b" appearance="solid" size="sm">x</Badge>);
    expect(screen.getByTestId('b')).toHaveClass('ds-badge--solid', 'ds-badge--sm');
  });

  it('renders a decorative dot and icon hidden from assistive tech', () => {
    const { container } = render(<Badge dot icon="★">Featured</Badge>);
    expect(container.querySelector('.ds-badge__dot')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.ds-badge__icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a labelled remove button that calls onRemove', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Badge removable onRemove={onRemove}>Design</Badge>);
    const button = screen.getByRole('button', { name: 'Remove Design' });
    await user.click(button);
    expect(onRemove).toHaveBeenCalledOnce();
    button.focus();
    await user.keyboard('{Enter}');
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it('uses removeLabel when the label is not plain text', () => {
    render(<Badge removable removeLabel="Ada"><b>Ada</b></Badge>);
    expect(screen.getByRole('button', { name: 'Remove Ada' })).toBeInTheDocument();
  });

  it('forwards refs and extra props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} data-testid="b" title="hi">x</Badge>);
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveAttribute('title', 'hi');
  });
});
