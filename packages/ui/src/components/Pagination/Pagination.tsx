import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import { Button } from '../Button';
import './Pagination.css';

export type PaginationSize = 'sm' | 'md';
export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current page. */
  siblingCount?: number;
  /** Adds "first" and "last" jump buttons. */
  showFirstLast?: boolean;
  size?: PaginationSize;
  /** Previous/next plus a "Page X of Y" label, for tight spaces. */
  compact?: boolean;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

/** Page numbers to render with ellipses, keeping the first, last and `siblingCount` neighbours visible. */
export function getPaginationRange(page: number, pageCount: number, siblingCount = 1): PaginationItem[] {
  const total = siblingCount * 2 + 5; // first + last + current + siblings + two ellipses
  if (pageCount <= total) return range(1, pageCount);

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, pageCount);
  const showLeft = leftSibling > 2;
  const showRight = rightSibling < pageCount - 1;

  if (!showLeft && showRight) {
    return [...range(1, 3 + siblingCount * 2), 'ellipsis-end', pageCount];
  }
  if (showLeft && !showRight) {
    return [1, 'ellipsis-start', ...range(pageCount - (2 + siblingCount * 2), pageCount)];
  }
  return [1, 'ellipsis-start', ...range(leftSibling, rightSibling), 'ellipsis-end', pageCount];
}


export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    siblingCount = 1,
    showFirstLast = false,
    size = 'md',
    compact = false,
    className,
    'aria-label': ariaLabel = 'Pagination',
    ...rest
  },
  ref,
) {
  const buttonSize = size === 'sm' ? 'xs' : 'sm';
  const safeCount = Math.max(1, pageCount);
  const current = Math.min(Math.max(1, page), safeCount);
  const go = (next: number) => {
    const clamped = Math.min(Math.max(1, next), safeCount);
    if (clamped !== current) onPageChange(clamped);
  };

  const control = (label: string, target: number, disabled: boolean, glyph: JSX.Element) => (
    <li className="ds-pagination__item">
      <Button
        variant="ghost"
        size={buttonSize}
        className="ds-pagination__control"
        aria-label={label}
        disabled={disabled}
        onClick={() => go(target)}
      >
        {glyph}
      </Button>
    </li>
  );

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cx('ds-pagination', `ds-pagination--${size}`, compact && 'ds-pagination--compact', className)}
      {...rest}
    >
      <ul className="ds-pagination__list">
        {showFirstLast && control('First page', 1, current === 1, <Icon name="double-alt-arrow-left" />)}
        {control('Previous page', current - 1, current === 1, <Icon name="alt-arrow-left" />)}

        {compact ? (
          <li className="ds-pagination__item">
            <span className="ds-pagination__status" aria-live="polite">
              Page {current} of {safeCount}
            </span>
          </li>
        ) : (
          getPaginationRange(current, safeCount, siblingCount).map((item) =>
            typeof item === 'number' ? (
              <li key={item} className="ds-pagination__item">
                <Button
                  variant={item === current ? 'secondary' : 'ghost'}
                  size={buttonSize}
                  className="ds-pagination__page"
                  aria-label={item === current ? `Page ${item}` : `Go to page ${item}`}
                  aria-current={item === current ? 'page' : undefined}
                  onClick={() => go(item)}
                >
                  {item}
                </Button>
              </li>
            ) : (
              <li key={item} className="ds-pagination__item">
                <span className="ds-pagination__ellipsis" aria-hidden="true">
                  …
                </span>
              </li>
            ),
          )
        )}

        {control('Next page', current + 1, current === safeCount, <Icon name="alt-arrow-right" />)}
        {showFirstLast && control('Last page', safeCount, current === safeCount, <Icon name="double-alt-arrow-right" />)}
      </ul>
    </nav>
  );
});
