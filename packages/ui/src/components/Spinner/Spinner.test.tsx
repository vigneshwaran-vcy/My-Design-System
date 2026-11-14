import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders a status with the hidden "Loading" label by default', () => {
    render(<Spinner />);
    const status = screen.getByRole('status');
    expect(status).toHaveClass('ds-spinner', 'ds-spinner--md', 'ds-spinner--current');
    expect(status).toHaveTextContent('Loading');
    expect(screen.getByText('Loading')).toHaveClass('ds-spinner__label');
  });

  it('uses a custom label', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saving changes');
  });

  it('hides the ring SVG from assistive tech', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['xs', 'sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Spinner size={size} />);
    expect(screen.getByRole('status')).toHaveClass(`ds-spinner--${size}`);
  });

  it.each(['current', 'accent', 'muted'] as const)('applies the %s color class', (color) => {
    render(<Spinner color={color} />);
    expect(screen.getByRole('status')).toHaveClass(`ds-spinner--${color}`);
  });

  it('forwards refs, merges className and spreads rest props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} className="custom" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(ref.current).toHaveClass('ds-spinner', 'custom');
  });
});
