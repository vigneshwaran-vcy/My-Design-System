import {
  createContext,
  forwardRef,
  useContext,
  type HTMLAttributes,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import './Table.css';

export type TableSize = 'sm' | 'md';
export type TableSortDirection = 'asc' | 'desc' | 'none';
export type TableCellAlign = 'start' | 'center' | 'end';

interface TableContextValue {
  columnCount: number;
}
const TableContext = createContext<TableContextValue>({ columnCount: 1 });

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  size?: TableSize;
  /** Alternates row backgrounds. */
  striped?: boolean;
  /** Keeps the header visible while the container scrolls. */
  stickyHeader?: boolean;
  /**
   * Number of columns. Used by `TableEmpty` for its colSpan. Defaults to the number of `TableHead`s
   * if you pass it explicitly; otherwise `TableEmpty` falls back to a large colSpan.
   */
  columns?: number;
  /** Props for the scroll container that wraps the `<table>`. */
  containerProps?: HTMLAttributes<HTMLDivElement>;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { size = 'md', striped = false, stickyHeader = false, columns, containerProps, className, children, ...rest },
  ref,
) {
  return (
    <div
      {...containerProps}
      className={cx(
        'ds-table-container',
        stickyHeader && 'ds-table-container--sticky',
        containerProps?.className,
      )}
    >
      <TableContext.Provider value={{ columnCount: columns ?? 100 }}>
        <table
          ref={ref}
          className={cx(
            'ds-table',
            `ds-table--${size}`,
            striped && 'ds-table--striped',
            stickyHeader && 'ds-table--sticky-header',
            className,
          )}
          {...rest}
        >
          {children}
        </table>
      </TableContext.Provider>
    </div>
  );
});

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(function TableHeader(
  { className, ...rest },
  ref,
) {
  return <thead ref={ref} className={cx('ds-table__header', className)} {...rest} />;
});

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBody(
  { className, ...rest },
  ref,
) {
  return <tbody ref={ref} className={cx('ds-table__body', className)} {...rest} />;
});

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Marks the row as selected (sets `aria-selected` and a tinted background). */
  selected?: boolean;
  /** Hover highlight for clickable rows. The click target itself should still be inside. */
  interactive?: boolean;
}
export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { selected, interactive = false, className, ...rest },
  ref,
) {
  return (
    <tr
      ref={ref}
      className={cx('ds-table__row', selected && 'ds-table__row--selected', interactive && 'ds-table__row--interactive', className)}
      aria-selected={selected}
      {...rest}
    />
  );
});

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Text alignment; defaults to `end` when `numeric`. */
  align?: TableCellAlign;
  /** Renders the label as a sort button and exposes `aria-sort`. */
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  /** Called with the next direction when the sort button is pressed. */
  onSort?: (direction: Exclude<TableSortDirection, 'none'>) => void;
  /** Right-aligns numbers. */
  numeric?: boolean;
}

const ARIA_SORT: Record<TableSortDirection, 'ascending' | 'descending' | 'none'> = {
  asc: 'ascending',
  desc: 'descending',
  none: 'none',
};

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { align, sortable = false, sortDirection = 'none', onSort, numeric = false, scope = 'col', className, children, ...rest },
  ref,
) {
  const resolvedAlign = align ?? (numeric ? 'end' : 'start');
  const next = sortDirection === 'asc' ? 'desc' : 'asc';
  return (
    <th
      ref={ref}
      scope={scope}
      className={cx(
        'ds-table__head',
        `ds-table__cell--${resolvedAlign}`,
        numeric && 'ds-table__cell--numeric',
        sortable && 'ds-table__head--sortable',
        sortable && sortDirection !== 'none' && 'ds-table__head--sorted',
        className,
      )}
      aria-sort={sortable ? ARIA_SORT[sortDirection] : undefined}
      {...rest}
    >
      {sortable ? (
        <button type="button" className="ds-table__sort" onClick={() => onSort?.(next)}>
          <span className="ds-table__sort-label">{children}</span>
          <svg className={cx('ds-table__sort-icon', `ds-table__sort-icon--${sortDirection}`)} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path className="ds-table__sort-up" d="M8 3.5l3 3.5H5z" fill="currentColor" />
            <path className="ds-table__sort-down" d="M8 12.5L5 9h6z" fill="currentColor" />
          </svg>
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  /** Text alignment; defaults to `end` when `numeric`. */
  align?: TableCellAlign;
  /** Tabular figures, right-aligned by default. */
  numeric?: boolean;
}
export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { align, numeric = false, className, ...rest },
  ref,
) {
  const resolvedAlign = align ?? (numeric ? 'end' : 'start');
  return (
    <td
      ref={ref}
      className={cx('ds-table__cell', `ds-table__cell--${resolvedAlign}`, numeric && 'ds-table__cell--numeric', className)}
      {...rest}
    />
  );
});

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;
export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(function TableCaption(
  { className, ...rest },
  ref,
) {
  return <caption ref={ref} className={cx('ds-table__caption', className)} {...rest} />;
});

export interface TableEmptyProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Overrides the colSpan (defaults to the Table's `columns`). */
  colSpan?: number;
  children?: ReactNode;
}
export const TableEmpty = forwardRef<HTMLTableRowElement, TableEmptyProps>(function TableEmpty(
  { colSpan, className, children = 'No results', ...rest },
  ref,
) {
  const { columnCount } = useContext(TableContext);
  return (
    <tr ref={ref} className={cx('ds-table__row', 'ds-table__empty', className)} {...rest}>
      <td className="ds-table__empty-cell" colSpan={colSpan ?? columnCount}>
        {children}
      </td>
    </tr>
  );
});
