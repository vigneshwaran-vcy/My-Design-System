import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';

describe('Progress', () => {
  it('renders a progressbar with value attributes and a label', () => {
    render(<Progress value={40} label="Uploading" />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '40');
    expect(bar).toHaveAttribute('aria-valuetext', '40%');
    expect(bar).toHaveClass('ds-progress', 'ds-progress--bar', 'ds-progress--md', 'ds-progress--accent');
    expect(bar.querySelector('.ds-progress__fill')).toHaveStyle({ width: '40%' });
  });

  it('clamps values to 0–100', () => {
    const { rerender } = render(<Progress value={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    rerender(<Progress value={-5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows the percentage when showValue is set', () => {
    render(<Progress value={73.4} showValue />);
    expect(screen.getByText('73%')).toBeInTheDocument();
  });

  it('supports a custom value formatter', () => {
    render(<Progress value={50} showValue formatValue={(v) => `${v} of 100`} />);
    expect(screen.getByText('50 of 100')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '50 of 100');
  });

  it('omits aria-valuenow and the value when indeterminate', () => {
    render(<Progress indeterminate showValue label="Loading" />);
    const bar = screen.getByRole('progressbar', { name: 'Loading' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('aria-busy', 'true');
    expect(bar).toHaveClass('ds-progress--indeterminate');
    expect(screen.queryByText(/%$/)).not.toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    render(<Progress size={size} />);
    expect(screen.getByRole('progressbar')).toHaveClass(`ds-progress--${size}`);
  });

  it.each(['accent', 'success', 'warn', 'danger'] as const)('applies the %s variant class', (variant) => {
    render(<Progress variant={variant} />);
    expect(screen.getByRole('progressbar')).toHaveClass(`ds-progress--${variant}`);
  });

  it('renders an SVG ring in circle shape with the value centred', () => {
    render(<Progress shape="circle" value={25} showValue label="Storage" />);
    const bar = screen.getByRole('progressbar', { name: 'Storage' });
    expect(bar).toHaveClass('ds-progress--circle');
    expect(bar.querySelector('svg.ds-progress__ring')).toBeInTheDocument();
    expect(bar).toHaveAttribute('aria-valuenow', '25');
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('prefers an explicit aria-label over the visible label', () => {
    render(<Progress value={10} label="Visible" aria-label="Explicit" />);
    expect(screen.getByRole('progressbar', { name: 'Explicit' })).toBeInTheDocument();
  });

  it('forwards refs and merges className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} className="custom" />);
    expect(ref.current).toBe(screen.getByRole('progressbar'));
    expect(ref.current).toHaveClass('ds-progress', 'custom');
  });
});
