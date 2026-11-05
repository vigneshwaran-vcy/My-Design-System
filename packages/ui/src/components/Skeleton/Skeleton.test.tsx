import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a single aria-hidden bar by default', () => {
    const { container } = render(<Skeleton />);
    const el = container.querySelector('.ds-skeleton')!;
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveClass('ds-skeleton--text');
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each(['text', 'circle', 'rect'] as const)('applies the %s variant class', (variant) => {
    const { container } = render(<Skeleton variant={variant} />);
    expect(container.querySelector('.ds-skeleton')).toHaveClass(`ds-skeleton--${variant}`);
  });

  it('accepts CSS strings and numbers for width and height', () => {
    const { container, rerender } = render(<Skeleton width="60%" height="var(--ds-space-4)" />);
    expect(container.querySelector('.ds-skeleton')).toHaveStyle({ width: '60%', height: 'var(--ds-space-4)' });
    rerender(<Skeleton width={120} height={16} />);
    expect(container.querySelector('.ds-skeleton')).toHaveStyle({ width: '120px', height: '16px' });
  });

  it('renders N text lines with the last one at 60%', () => {
    const { container } = render(<Skeleton lines={3} />);
    const wrap = container.querySelector('.ds-skeleton-lines')!;
    expect(wrap).toHaveAttribute('aria-hidden', 'true');
    const bars = wrap.querySelectorAll('.ds-skeleton');
    expect(bars).toHaveLength(3);
    expect(bars[2]).toHaveClass('ds-skeleton--last-line');
    expect(bars[0]).not.toHaveClass('ds-skeleton--last-line');
  });

  it('announces an optional visually-hidden label as status', () => {
    render(<Skeleton label="Loading users" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Loading users');
    expect(status).toHaveClass('ds-skeleton__status');
  });

  it('announces the label once for multi-line skeletons', () => {
    render(<Skeleton lines={4} label="Loading description" />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
  });

  it('forwards refs and merges className', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} className="custom" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(ref.current).toHaveClass('ds-skeleton', 'custom');
  });
});
