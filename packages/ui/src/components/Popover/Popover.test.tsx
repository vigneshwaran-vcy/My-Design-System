import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from './Popover';

const renderPopover = (props: Partial<ComponentProps<typeof Popover>> = {}) =>
  render(
    <>
      <button>Before</button>
      <Popover trigger={<button>Open</button>} title="Details" {...props}>
        <button>Inside</button>
      </Popover>
      <button>After</button>
    </>,
  );

describe('Popover', () => {
  it('wires the trigger with aria-haspopup, aria-expanded and aria-controls', () => {
    renderPopover();
    const trigger = screen.getByRole('button', { name: 'Open' });
    const panel = screen.getByRole('dialog', { hidden: true });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', panel.id);
    expect(panel).not.toBeVisible();
  });

  it('opens on click, labels the dialog by its title and moves focus inside', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const panel = screen.getByRole('dialog', { name: 'Details' });
    expect(panel).toBeVisible();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
  });

  it('focuses the panel itself when it has no focusable content', async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>} title="Info">
        Plain text
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('closes on pointer down outside without stealing focus from the clicked element', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'After' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('stays open when clicking inside the panel', async () => {
    const user = userEvent.setup();
    renderPopover();
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('toggles closed when the trigger is clicked again', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderPopover({ onOpenChange });
    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('supports defaultOpen', () => {
    renderPopover({ defaultOpen: true });
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Popover trigger={<button>Open</button>} title="Details" open={open} onOpenChange={setOpen}>
            <button onClick={() => setOpen(false)}>Done</button>
          </Popover>
          <span>{open ? 'open' : 'closed'}</span>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('open')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByText('closed')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { hidden: true })).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('uses aria-label instead of the title when provided, and keeps the trigger’s own onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Popover trigger={<button onClick={onClick}>Open</button>} aria-label="Custom label">
        Text
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog', { name: 'Custom label' })).toBeVisible();
  });

  it('applies the placement modifier and forwards ref, className and rest props to the panel', () => {
    const ref = createRef<HTMLDivElement>();
    renderPopover({ ref, placement: 'top-end', className: 'extra', 'data-testid': 'panel' } as never);
    const panel = screen.getByTestId('panel');
    expect(ref.current).toBe(panel);
    expect(panel).toHaveClass('ds-popover__panel', 'extra');
    expect(panel.parentElement).toHaveClass('ds-popover', 'ds-popover--top-end');
  });
});
