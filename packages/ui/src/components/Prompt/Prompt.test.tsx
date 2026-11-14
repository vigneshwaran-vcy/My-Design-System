import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Prompt } from './Prompt';

describe('Prompt', () => {
  it('renders nothing when closed', () => {
    render(<Prompt open={false} title="Unsaved changes" />);
    expect(screen.queryByRole('alertdialog')).toBeNull();
  });

  it('is a modal alertdialog named and described by its title and description', () => {
    render(<Prompt open title="Session expired" description="Sign in again to continue." />);
    const dialog = screen.getByRole('alertdialog', { name: 'Session expired' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Sign in again to continue.');
    expect(dialog).toHaveClass('ds-prompt', 'ds-prompt--warn', 'ds-prompt--sm');
  });

  it.each([
    ['info', 'info-circle'],
    ['warn', 'danger-triangle'],
    ['danger', 'danger-circle'],
    ['success', 'check-circle'],
  ] as const)('applies the %s variant with its status icon', (variant, icon) => {
    render(<Prompt open variant={variant} title="Heads up" />);
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toHaveClass(`ds-prompt--${variant}`);
    expect(dialog.querySelector(`.ds-prompt__icon [data-icon="${icon}"]`)).not.toBeNull();
  });

  it('applies the md size', () => {
    render(<Prompt open size="md" title="Heads up" />);
    expect(screen.getByRole('alertdialog')).toHaveClass('ds-prompt--md');
  });

  it('focuses Cancel first and fires confirm / cancel', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <Prompt open variant="danger" title="Delete record?" confirmLabel="Delete" onConfirm={onConfirm} onCancel={onCancel} />,
    );
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(cancel).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('ds-button--danger');
    await user.keyboard('{Enter}');
    expect(onCancel).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('has no close button by default; Escape calls onCancel', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<Prompt open title="Leave page?" onCancel={onCancel} onConfirm={() => {}} />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('shows a close button when dismissible', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Prompt open dismissible title="Saved" variant="success" onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('traps Tab inside and restores focus on close', async () => {
    const user = userEvent.setup();
    function Demo() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Prompt open={open} title="Discard?" onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />
        </>
      );
    }
    render(<Demo />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const ok = screen.getByRole('button', { name: 'OK' });
    expect(cancel).toHaveFocus();
    await user.tab();
    expect(ok).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(opener).toHaveFocus();
  });

  it('renders a custom footer and body', () => {
    render(
      <Prompt open title="Custom" footer={<button>Got it</button>}>
        <p>Body copy</p>
      </Prompt>,
    );
    expect(screen.getByText('Body copy')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();
  });

  it('forwards refs and rest props to the panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Prompt ref={ref} open title="Ref" data-testid="p" />);
    expect(ref.current).toBe(screen.getByTestId('p'));
    expect(ref.current).toHaveAttribute('role', 'alertdialog');
  });
});
