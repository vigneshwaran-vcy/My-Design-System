import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { DynamicIcon } from './DynamicIcon';

describe('DynamicIcon', () => {
  it.each([
    ['ellipsis', 'Loading'],
    ['typing', 'Typing'],
    ['eq', 'Working'],
  ] as const)('renders %s as an image with a default label', (variant, name) => {
    render(<DynamicIcon variant={variant} />);
    const img = screen.getByRole('img', { name });
    expect(img).toHaveClass('ds-dynamic-icon', `ds-dynamic-icon--${variant}`, 'ds-dynamic-icon--md');
  });

  it.each([
    ['up', 'Trending up', 'arrow-right-up'],
    ['down', 'Trending down', 'arrow-right-up'],
    ['neutral', 'No change', 'arrow-right'],
  ] as const)('renders a %s trend', (direction, name, icon) => {
    render(<DynamicIcon variant="trend" direction={direction} />);
    const img = screen.getByRole('img', { name });
    expect(img).toHaveClass(`ds-dynamic-icon--${direction}`);
    expect(img.querySelector(`[data-icon="${icon}"]`)).not.toBeNull();
  });

  it.each([
    [0, 'Strength: none'],
    [1, 'Strength: weak'],
    [2, 'Strength: moderate'],
    [3, 'Strength: strong'],
  ] as const)('renders strength %i with three bars', (value, name) => {
    render(<DynamicIcon variant="strength" value={value} />);
    const img = screen.getByRole('img', { name });
    expect(img).toHaveAttribute('data-value', String(value));
    expect(img.querySelectorAll('.ds-dynamic-icon__bar')).toHaveLength(3);
  });

  it('renders positive and negative scores', () => {
    const { rerender } = render(<DynamicIcon variant="score" score="positive" />);
    expect(screen.getByRole('img', { name: 'Positive score' })).toHaveClass('ds-dynamic-icon--positive');
    rerender(<DynamicIcon variant="score" score="negative" />);
    expect(screen.getByRole('img', { name: 'Negative score' })).toHaveClass('ds-dynamic-icon--negative');
  });

  it('renders the waffle as a decorative 3x3 grid unless labelled', () => {
    const { container, rerender } = render(<DynamicIcon variant="waffle" />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.querySelectorAll('.ds-dynamic-icon__dot')).toHaveLength(9);
    rerender(<DynamicIcon variant="waffle" label="App launcher" />);
    expect(screen.getByRole('img', { name: 'App launcher' })).toBeInTheDocument();
  });

  it('accepts a custom label, decorative mode, size and paused', () => {
    const { container, rerender } = render(<DynamicIcon variant="ellipsis" label="Generating summary" size="lg" paused />);
    const img = screen.getByRole('img', { name: 'Generating summary' });
    expect(img).toHaveClass('ds-dynamic-icon--lg', 'ds-dynamic-icon--paused');
    rerender(<DynamicIcon variant="ellipsis" decorative />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards refs and rest props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<DynamicIcon ref={ref} variant="eq" data-testid="d" />);
    expect(ref.current).toBe(screen.getByTestId('d'));
  });
});
