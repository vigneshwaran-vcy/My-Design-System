import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination, getPaginationRange } from './Pagination';

describe('getPaginationRange', () => {
  it('lists every page when they fit', () => {
    expect(getPaginationRange(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  it('collapses the end when near the start', () => {
    expect(getPaginationRange(2, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
  });
  it('collapses the start when near the end', () => {
    expect(getPaginationRange(19, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });
  it('collapses both sides in the middle, honouring siblingCount', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
    expect(getPaginationRange(10, 20, 2)).toEqual([1, 'ellipsis-start', 8, 9, 10, 11, 12, 'ellipsis-end', 20]);
  });
});

describe('Pagination', () => {
  it('renders a nav labelled "Pagination" with page and arrow buttons', () => {
    render(<Pagination page={1} pageCount={5} onPageChange={() => {}} />);
    const nav = screen.getByRole('navigation', { name: 'Pagination' });
    expect(nav).toHaveClass('ds-pagination', 'ds-pagination--md');
    expect(within(nav).getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(within(nav).getByRole('button', { name: 'Next page' })).toBeEnabled();
    expect(within(nav).getByRole('button', { name: 'Go to page 2' })).toBeInTheDocument();
  });

  it('marks the current page with aria-current and the raised secondary look', () => {
    render(<Pagination page={3} pageCount={5} onPageChange={() => {}} />);
    const current = screen.getByRole('button', { name: 'Page 3' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveClass('ds-button--secondary', 'ds-pagination__page');
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveClass('ds-button--ghost');
  });

  it('calls onPageChange from page, previous and next buttons', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Go to page 4' }));
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange.mock.calls.map((c) => c[0])).toEqual([4, 2, 4]);
  });

  it('does not call onPageChange when the current page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={3} pageCount={10} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('disables next on the last page and renders aria-hidden ellipses', () => {
    const { container } = render(<Pagination page={10} pageCount={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    const ellipses = container.querySelectorAll('.ds-pagination__ellipsis');
    expect(ellipses).toHaveLength(1);
    expect(ellipses[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows first/last controls when requested', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={5} pageCount={10} onPageChange={onPageChange} showFirstLast />);
    await user.click(screen.getByRole('button', { name: 'First page' }));
    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange.mock.calls.map((c) => c[0])).toEqual([1, 10]);
  });

  it('renders the compact form with a live status instead of page buttons', () => {
    render(<Pagination page={2} pageCount={9} onPageChange={() => {}} compact />);
    expect(screen.getByText('Page 2 of 9')).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByRole('button', { name: /Go to page/ })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it.each([
    ['sm', 'ds-button--xs'],
    ['md', 'ds-button--sm'],
  ] as const)('maps size %s to Button size class %s', (size, cls) => {
    render(<Pagination page={1} pageCount={3} onPageChange={() => {}} size={size} />);
    expect(screen.getByRole('navigation')).toHaveClass(`ds-pagination--${size}`);
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveClass(cls);
  });

  it('is operable from the keyboard', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />);
    await user.tab(); // previous is disabled, so focus lands on page 1
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Go to page 2' })).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next page' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onPageChange.mock.calls.map((c) => c[0])).toEqual([2, 2]);
  });

  it('forwards refs, merges className and spreads rest props', () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} page={1} pageCount={2} onPageChange={() => {}} className="custom" data-testid="p" />);
    expect(ref.current).toBe(screen.getByTestId('p'));
    expect(ref.current).toHaveClass('ds-pagination', 'custom');
  });
});
