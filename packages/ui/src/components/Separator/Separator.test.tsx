import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';

describe('Separator', () => {
  it('is decorative by default (role="none"), horizontal, no spacing', () => {
    render(<Separator data-testid="sep" />);
    const sep = screen.getByTestId('sep');
    expect(sep).toHaveAttribute('role', 'none');
    expect(sep).not.toHaveAttribute('aria-orientation');
    expect(sep).toHaveClass('ds-separator', 'ds-separator--horizontal', 'ds-separator--spacing-none');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('exposes a semantic separator with aria-orientation when not decorative', () => {
    const { rerender } = render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    rerender(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies the vertical modifier', () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveClass('ds-separator--vertical');
  });

  it.each(['none', 'sm', 'md', 'lg'] as const)('applies the %s spacing class', (spacing) => {
    render(<Separator spacing={spacing} data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveClass(`ds-separator--spacing-${spacing}`);
  });

  it('renders a centred label and names a semantic separator with it', () => {
    const { rerender } = render(<Separator label="or continue with" data-testid="sep" />);
    expect(screen.getByText('or continue with')).toHaveClass('ds-separator__label');
    expect(screen.getByTestId('sep')).toHaveClass('ds-separator--labeled');
    expect(screen.getByTestId('sep')).not.toHaveAttribute('aria-label');
    rerender(<Separator label="or continue with" decorative={false} />);
    expect(screen.getByRole('separator', { name: 'or continue with' })).toBeInTheDocument();
  });

  it('ignores the label for vertical separators', () => {
    render(<Separator orientation="vertical" label="x" data-testid="sep" />);
    expect(screen.queryByText('x')).not.toBeInTheDocument();
    expect(screen.getByTestId('sep')).not.toHaveClass('ds-separator--labeled');
  });

  it('forwards refs, merges className and spreads rest props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} className="custom" data-testid="sep" />);
    expect(ref.current).toBe(screen.getByTestId('sep'));
    expect(ref.current).toHaveClass('ds-separator', 'custom');
  });
});
