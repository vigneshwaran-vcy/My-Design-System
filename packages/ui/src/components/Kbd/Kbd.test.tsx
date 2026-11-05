import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Kbd, resolveKey } from './Kbd';

describe('resolveKey', () => {
  it('maps common names case-insensitively and passes others through', () => {
    expect(resolveKey('cmd')).toEqual({ symbol: '⌘', label: 'Command' });
    expect(resolveKey('SHIFT')).toEqual({ symbol: '⇧', label: 'Shift' });
    expect(resolveKey('Enter')).toEqual({ symbol: '↵', label: 'Enter' });
    expect(resolveKey('K')).toEqual({ symbol: 'K' });
  });
});

describe('Kbd', () => {
  it('renders a single <kbd> keycap from children', () => {
    render(<Kbd>Esc</Kbd>);
    const kbd = screen.getByText('Esc');
    expect(kbd.tagName).toBe('KBD');
    expect(kbd).toHaveClass('ds-kbd', 'ds-kbd--md');
    expect(kbd).not.toHaveAttribute('aria-label');
  });

  it('renders one keycap per key with symbols and full-word labels', () => {
    const { container } = render(<Kbd keys={['cmd', 'shift', 'K']} />);
    const caps = container.querySelectorAll('kbd');
    expect(caps).toHaveLength(3);
    expect(caps[0]).toHaveTextContent('⌘');
    expect(caps[0]).toHaveAttribute('aria-label', 'Command');
    expect(caps[1]).toHaveTextContent('⇧');
    expect(caps[1]).toHaveAttribute('aria-label', 'Shift');
    expect(caps[2]).toHaveTextContent('K');
    expect(caps[2]).not.toHaveAttribute('aria-label');
    expect(container.firstElementChild).toHaveClass('ds-kbd-group', 'ds-kbd-group--md');
  });

  it('omits the separator by default and renders it aria-hidden when given', () => {
    const { container, rerender } = render(<Kbd keys={['ctrl', 'C']} />);
    expect(container.querySelector('.ds-kbd-group__separator')).not.toBeInTheDocument();
    rerender(<Kbd keys={['ctrl', 'C']} separator="+" />);
    const sep = container.querySelector('.ds-kbd-group__separator');
    expect(sep).toHaveTextContent('+');
    expect(sep).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('.ds-kbd-group__separator')).toHaveLength(1);
  });

  it.each(['sm', 'md'] as const)('applies the %s size to caps and group', (size) => {
    const { container } = render(<Kbd keys={['alt', 'F4']} size={size} />);
    expect(container.firstElementChild).toHaveClass(`ds-kbd-group--${size}`);
    container.querySelectorAll('kbd').forEach((k) => expect(k).toHaveClass(`ds-kbd--${size}`));
  });

  it('forwards refs, merges className and spreads rest props in both modes', () => {
    const single = createRef<HTMLElement>();
    const group = createRef<HTMLElement>();
    render(
      <>
        <Kbd ref={single} className="a" data-testid="single">K</Kbd>
        <Kbd ref={group} keys={['cmd', 'K']} className="b" data-testid="group" />
      </>,
    );
    expect(single.current).toBe(screen.getByTestId('single'));
    expect(single.current).toHaveClass('ds-kbd', 'a');
    expect(group.current).toBe(screen.getByTestId('group'));
    expect(group.current).toHaveClass('ds-kbd-group', 'b');
  });
});
