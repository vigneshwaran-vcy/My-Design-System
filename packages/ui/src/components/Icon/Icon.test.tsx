import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Icon, iconNames } from './Icon';

describe('Icon', () => {
  it('is decorative by default: hidden from assistive tech and not focusable', () => {
    const { container } = render(<Icon name="search" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).not.toHaveAttribute('role');
  });

  it('becomes an image with an accessible name when labelled', () => {
    render(<Icon name="info" label="Information" />);
    expect(screen.getByRole('img', { name: 'Information' })).toBeInTheDocument();
  });

  it('renders Solar Linear artwork on a 24px grid using currentColor', () => {
    const { container } = render(<Icon name="alt-arrow-down" />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg.innerHTML).toContain('currentColor');
    expect(svg).toHaveAttribute('data-icon', 'alt-arrow-down');
  });

  it.each(['xs', 'sm', 'md', 'lg'] as const)('applies the %s size class', (size) => {
    const { container } = render(<Icon name="sun" size={size} />);
    expect(container.querySelector('svg')).toHaveClass('ds-icon', `ds-icon--${size}`);
  });

  it('leaves sizing to the parent when no size is given, and forwards refs and props', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<Icon ref={ref} name="close" className="x" data-testid="i" />);
    const svg = container.querySelector('svg')!;
    expect(ref.current).toBe(svg);
    expect(svg).toHaveClass('ds-icon', 'x');
    expect(svg.getAttribute('class')).not.toMatch(/ds-icon--/);
  });

  it('renders nothing for a name that is not a bundled icon, even an inherited object key', () => {
    const { container } = render(<Icon name={'toString' as never} />);
    expect(container.querySelector('svg')?.innerHTML).toBe('');
  });

  it('every bundled icon has artwork', () => {
    expect(iconNames.length).toBeGreaterThan(20);
    for (const name of iconNames) {
      const { container, unmount } = render(<Icon name={name} />);
      expect(container.querySelector('svg')!.innerHTML.length).toBeGreaterThan(20);
      unmount();
    }
  });
});
