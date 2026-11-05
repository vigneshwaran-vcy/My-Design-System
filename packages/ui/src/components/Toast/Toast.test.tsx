import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast, type ToastOptions, type ToastProviderProps } from './Toast';

function Trigger({ options, label = 'Notify' }: { options: ToastOptions; label?: string }) {
  const { toast } = useToast();
  return <button onClick={() => toast(options)}>{label}</button>;
}

const renderWithProvider = (options: ToastOptions, provider: Partial<ToastProviderProps> = {}) =>
  render(
    <ToastProvider {...provider}>
      <Trigger options={options} />
    </ToastProvider>,
  );

describe('Toast', () => {
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

  it('renders a labelled notifications region', () => {
    renderWithProvider({ title: 'Saved' });
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveClass('ds-toast-viewport', 'ds-toast-viewport--bottom-right');
  });

  it('applies the position modifier', () => {
    renderWithProvider({ title: 'Saved' }, { position: 'top-right' });
    expect(screen.getByRole('region', { name: 'Notifications' })).toHaveClass('ds-toast-viewport--top-right');
  });

  it('shows a status toast with title, description and variant class', async () => {
    const user = setup();
    renderWithProvider({ title: 'Saved', description: 'All changes stored.', variant: 'success' });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('ds-toast', 'ds-toast--success');
    expect(toast).toHaveTextContent('Saved');
    expect(toast).toHaveTextContent('All changes stored.');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('uses role="alert" for the danger variant', async () => {
    const user = setup();
    renderWithProvider({ title: 'Failed', variant: 'danger' });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('alert')).toHaveClass('ds-toast--danger');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('auto-dismisses after the default 5000ms', async () => {
    const user = setup();
    renderWithProvider({ title: 'Saved' });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    act(() => vi.advanceTimersByTime(4999));
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('respects a custom duration and the provider default', async () => {
    const user = setup();
    render(
      <ToastProvider duration={1000}>
        <Trigger options={{ title: 'Quick toast' }} label="Fire quick" />
        <Trigger options={{ title: 'Slow toast', duration: 3000 }} label="Fire slow" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Fire quick' }));
    await user.click(screen.getByRole('button', { name: 'Fire slow' }));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByText('Quick toast')).not.toBeInTheDocument();
    expect(screen.getByText('Slow toast')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByText('Slow toast')).not.toBeInTheDocument();
  });

  it('keeps a duration: 0 toast until dismissed with the close button', async () => {
    const user = setup();
    renderWithProvider({ title: 'Sticky', duration: 0 });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('pauses the timer on hover and resumes with the remaining time on leave', async () => {
    const user = setup();
    renderWithProvider({ title: 'Saved', duration: 1000 });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    act(() => vi.advanceTimersByTime(600));
    await user.hover(screen.getByRole('status'));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole('status')).toBeInTheDocument();
    await user.unhover(screen.getByRole('status'));
    act(() => vi.advanceTimersByTime(399));
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('runs the action and dismisses the toast', async () => {
    const user = setup();
    const onClick = vi.fn();
    renderWithProvider({ title: 'Archived', action: { label: 'Undo', onClick } });
    await user.click(screen.getByRole('button', { name: 'Notify' }));
    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('stacks toasts, exposes dismiss(id) and dismissAll(), and updates a toast by id', async () => {
    const user = setup();
    function Controls() {
      const { toast, dismiss, dismissAll, toasts } = useToast();
      return (
        <>
          <button onClick={() => toast({ id: 'a', title: 'A' })}>A</button>
          <button onClick={() => toast({ id: 'a', title: 'A updated' })}>Update A</button>
          <button onClick={() => toast({ title: 'B' })}>B</button>
          <button onClick={() => dismiss('a')}>Dismiss A</button>
          <button onClick={dismissAll}>Clear</button>
          <span data-testid="count">{toasts.length}</span>
        </>
      );
    }
    render(
      <ToastProvider>
        <Controls />
      </ToastProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getAllByRole('status')[0].parentElement).toBe(screen.getByRole('region'));
    await user.click(screen.getByRole('button', { name: 'Update A' }));
    expect(screen.getAllByRole('status')).toHaveLength(2);
    expect(screen.getByText('A updated')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Dismiss A' }));
    expect(screen.queryByText('A updated')).not.toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryAllByRole('status')).toHaveLength(0);
  });

  it('throws a helpful error when useToast is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger options={{ title: 'x' }} />)).toThrow(/within a <ToastProvider>/);
    spy.mockRestore();
  });
});
