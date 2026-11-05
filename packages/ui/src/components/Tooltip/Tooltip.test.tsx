import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // RTL's asyncWrapper drains a setTimeout(0) and only advances fake timers through a `jest` global.
    vi.stubGlobal('jest', { advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms) });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  const setup = () => userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  it('wires aria-describedby to a hidden role="tooltip" element', () => {
    render(
      <Tooltip content="Copy link">
        <button>Copy</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    expect(tooltip).not.toBeVisible();
    expect(tooltip).toHaveTextContent('Copy link');
    expect(screen.getByRole('button', { name: 'Copy', description: 'Copy link' })).toHaveAttribute('aria-describedby', tooltip.id);
  });

  it('shows on hover after the delay and hides on mouse leave', async () => {
    const user = setup();
    render(
      <Tooltip content="Copy link" delay={300}>
        <button>Copy</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    act(() => vi.advanceTimersByTime(299));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole('tooltip')).toBeVisible();
    await user.unhover(screen.getByRole('button'));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
  });

  it('does not show if the pointer leaves before the delay elapses', async () => {
    const user = setup();
    render(
      <Tooltip content="Copy link">
        <button>Copy</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    await user.unhover(screen.getByRole('button'));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
  });

  it('shows immediately on keyboard focus and hides on blur', async () => {
    const user = setup();
    render(
      <Tooltip content="Copy link">
        <button>Copy</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeVisible();
    await user.tab();
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
  });

  it('hides on Escape while keeping focus on the child', async () => {
    const user = setup();
    render(
      <Tooltip content="Copy link">
        <button>Copy</button>
      </Tooltip>,
    );
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('tooltip', { hidden: true })).not.toBeVisible();
    expect(screen.getByRole('button')).toHaveFocus();
  });

  it('keeps the child’s own handlers and aria-describedby', async () => {
    const user = setup();
    const onFocus = vi.fn();
    const onMouseEnter = vi.fn();
    render(
      <>
        <p id="hint">Existing hint</p>
        <Tooltip content="Copy link">
          <button aria-describedby="hint" onFocus={onFocus} onMouseEnter={onMouseEnter}>Copy</button>
        </Tooltip>
      </>,
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-describedby')).toMatch(/^hint ds-tooltip-/);
    await user.hover(button);
    await user.tab();
    expect(onMouseEnter).toHaveBeenCalledOnce();
    expect(onFocus).toHaveBeenCalledOnce();
  });

  it('applies the placement modifier and forwards ref, className and rest props to the bubble', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tooltip ref={ref} content="Hi" placement="right" className="extra" data-testid="bubble">
        <button>Go</button>
      </Tooltip>,
    );
    const bubble = screen.getByTestId('bubble');
    expect(ref.current).toBe(bubble);
    expect(bubble).toHaveClass('ds-tooltip__bubble', 'extra');
    expect(bubble.parentElement).toHaveClass('ds-tooltip', 'ds-tooltip--right');
  });

  it('clears a pending timer on unmount', async () => {
    const user = setup();
    const { unmount } = render(
      <Tooltip content="Hi">
        <button>Go</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole('button'));
    unmount();
    expect(() => act(() => vi.advanceTimersByTime(1000))).not.toThrow();
  });
});
