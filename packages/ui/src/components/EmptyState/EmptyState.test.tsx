import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders the title as an h3 heading by default', () => {
    render(<EmptyState title="No projects yet" />);
    const heading = screen.getByRole('heading', { level: 3, name: 'No projects yet' });
    expect(heading).toHaveClass('ds-empty-state__title');
    expect(heading.closest('.ds-empty-state')).toHaveClass('ds-empty-state--md');
  });

  it('supports other heading levels and a plain paragraph', () => {
    const { rerender } = render(<EmptyState title="Empty" titleAs="h2" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    rerender(<EmptyState title="Empty" titleAs="p" />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('Empty').tagName).toBe('P');
  });

  it('renders the muted description', () => {
    render(<EmptyState title="Empty" description="Create one to get started." />);
    expect(screen.getByText('Create one to get started.')).toHaveClass('ds-empty-state__description');
  });

  it.each(['sm', 'md'] as const)('applies the %s size class', (size) => {
    render(<EmptyState title="Empty" size={size} data-testid="es" />);
    expect(screen.getByTestId('es')).toHaveClass(`ds-empty-state--${size}`);
  });

  it('wraps the icon in a hidden tile by default and can drop the tile', () => {
    const { container, rerender } = render(<EmptyState title="Empty" icon={<svg data-testid="icon" />} />);
    const icon = container.querySelector('.ds-empty-state__icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('ds-empty-state__icon--tile');
    rerender(<EmptyState title="Empty" icon={<svg data-testid="icon" />} tile={false} />);
    expect(container.querySelector('.ds-empty-state__icon')).not.toHaveClass('ds-empty-state__icon--tile');
  });

  it('omits the icon and actions wrappers when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />);
    expect(container.querySelector('.ds-empty-state__icon')).not.toBeInTheDocument();
    expect(container.querySelector('.ds-empty-state__actions')).not.toBeInTheDocument();
  });

  it('renders primary and secondary actions that stay clickable', async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    const onImport = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={<button type="button" onClick={onCreate}>Create</button>}
        secondaryAction={<button type="button" onClick={onImport}>Import</button>}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Create' }));
    await user.click(screen.getByRole('button', { name: 'Import' }));
    expect(onCreate).toHaveBeenCalledOnce();
    expect(onImport).toHaveBeenCalledOnce();
  });

  it('forwards refs, merges className and spreads rest props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="Empty" className="custom" data-testid="es" />);
    expect(ref.current).toBe(screen.getByTestId('es'));
    expect(ref.current).toHaveClass('ds-empty-state', 'custom');
  });
});
