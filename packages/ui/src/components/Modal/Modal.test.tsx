import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Modal, type ModalProps } from './Modal';

function Harness(props: Partial<ModalProps>) {
  const [open, setOpen] = useState(props.open ?? false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Launch</button>
      <Modal
        title="Delete project?"
        description="This cannot be undone."
        showClose
        {...props}
        open={open}
        onClose={() => {
          props.onClose?.();
          setOpen(false);
        }}
        footer={
          props.footer ?? (
            <>
              <button>Cancel</button>
              <button>Delete</button>
            </>
          )
        }
      >
        {props.children ?? <p>Body text</p>}
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders into document.body with the dialog ARIA wiring', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete project?', description: 'This cannot be undone.' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog.parentElement?.parentElement).toBe(document.body);
    expect(screen.getByRole('heading', { level: 2, name: 'Delete project?' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('focuses the first control (not the close button) on open and restores focus on close', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const launch = screen.getByRole('button', { name: 'Launch' });
    await user.click(launch);
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(launch).toHaveFocus();
  });

  it('falls back to the close button, then the panel, when there is nothing else to focus', async () => {
    const user = userEvent.setup();
    render(<Harness footer={<span>no buttons</span>} />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('traps Tab and Shift+Tab inside the panel', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    const close = screen.getByRole('button', { name: 'Close' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const del = screen.getByRole('button', { name: 'Delete' });
    expect(cancel).toHaveFocus();
    await user.tab();
    expect(del).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.tab({ shift: true });
    expect(close).toHaveFocus();
    await user.tab({ shift: true });
    expect(del).toHaveFocus();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when the scrim is clicked but not when the panel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    await user.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
    await user.click(document.querySelector('.ds-modal') as HTMLElement);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('ignores Escape and the scrim, and hides the close button, when not dismissible', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} dismissible={false} />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await user.keyboard('{Escape}');
    await user.click(document.querySelector('.ds-modal') as HTMLElement);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('locks body scroll while open and restores it on close', async () => {
    const user = userEvent.setup();
    document.body.style.overflow = 'auto';
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Launch' }));
    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('auto');
    document.body.style.overflow = '';
  });

  it('applies the size modifier and forwards ref, className and rest props to the panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Modal ref={ref} open onClose={() => {}} title="T" size="lg" className="extra" data-testid="panel" />);
    const panel = screen.getByTestId('panel');
    expect(ref.current).toBe(panel);
    expect(panel).toHaveClass('ds-modal__panel', 'extra');
    expect(panel.parentElement).toHaveClass('ds-modal', 'ds-modal--lg');
    expect(panel).not.toHaveAttribute('aria-describedby');
  });

  it('hides the close button by default when a footer is present, and shows it without one', () => {
    const { rerender } = render(
      <Modal open onClose={() => {}} title="With footer" footer={<button>Cancel</button>}>
        <p>Body</p>
      </Modal>,
    );
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    rerender(
      <Modal open onClose={() => {}} title="No footer">
        <p>Body</p>
      </Modal>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
