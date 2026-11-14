import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonIcon } from './ButtonIcon';

describe('ButtonIcon', () => {
  it('renders a button named by its label with a hidden icon', () => {
    render(<ButtonIcon icon="settings" label="Settings" />);
    const button = screen.getByRole('button', { name: 'Settings' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('title', 'Settings');
    expect(button).toHaveClass('ds-button-icon', 'ds-button-icon--border', 'ds-button-icon--md');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each(['bare', 'container', 'border', 'brand'] as const)('applies the %s variant', (variant) => {
    render(<ButtonIcon icon="star" label="Star" variant={variant} />);
    expect(screen.getByRole('button')).toHaveClass(`ds-button-icon--${variant}`);
  });

  it.each(['xs', 'sm', 'md', 'lg'] as const)('applies the %s size', (size) => {
    render(<ButtonIcon icon="star" label="Star" size={size} />);
    expect(screen.getByRole('button')).toHaveClass(`ds-button-icon--${size}`);
  });

  it('accepts an icon node and can drop the native title', () => {
    render(<ButtonIcon icon={<span data-testid="glyph" />} label="Custom" showTitle={false} />);
    expect(screen.getByTestId('glyph')).toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveAttribute('title');
  });

  it('fires onClick from mouse, Enter and Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ButtonIcon icon="star" label="Star" onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    await user.tab({ shift: true });
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('acts as a toggle with aria-pressed when selected is set', () => {
    const { rerender } = render(<ButtonIcon icon="star" label="Favourite" selected={false} />);
    expect(screen.getByRole('button', { name: 'Favourite', pressed: false })).toBeInTheDocument();
    rerender(<ButtonIcon icon="star" label="Favourite" selected />);
    expect(screen.getByRole('button', { name: 'Favourite', pressed: true })).toBeInTheDocument();
  });

  it('is not a toggle unless selected is set', () => {
    render(<ButtonIcon icon="star" label="Star" />);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed');
  });

  it('does not fire when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ButtonIcon icon="star" label="Star" disabled onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards refs and rest props', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ButtonIcon ref={ref} icon="star" label="Star" data-testid="b" className="extra" />);
    expect(ref.current).toBe(screen.getByTestId('b'));
    expect(ref.current).toHaveClass('extra');
  });
});
