import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Table, TableBody, TableCaption, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from './Table';

const renderTable = (props: Partial<Parameters<typeof Table>[0]> = {}) =>
  render(
    <Table columns={3} {...props}>
      <TableCaption>People</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead numeric>Seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell numeric>12</TableCell>
        </TableRow>
        <TableRow selected interactive>
          <TableCell>Grace</TableCell>
          <TableCell>Member</TableCell>
          <TableCell numeric>3</TableCell>
        </TableRow>
      </TableBody>
    </Table>,
  );

describe('Table', () => {
  it('renders a semantic table with caption, headers and rows', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'People' });
    expect(table).toHaveClass('ds-table', 'ds-table--md');
    expect(table.parentElement).toHaveClass('ds-table-container');
    expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });

  it('applies size, striped and stickyHeader modifiers', () => {
    renderTable({ size: 'sm', striped: true, stickyHeader: true });
    const table = screen.getByRole('table');
    expect(table).toHaveClass('ds-table--sm', 'ds-table--striped', 'ds-table--sticky-header');
    expect(table.parentElement).toHaveClass('ds-table-container--sticky');
  });

  it('marks selected and interactive rows', () => {
    renderTable();
    const row = screen.getByRole('row', { selected: true });
    expect(row).toHaveClass('ds-table__row--selected', 'ds-table__row--interactive');
    expect(within(row).getByText('Grace')).toBeInTheDocument();
  });

  it('aligns numeric cells to the end with tabular figures', () => {
    renderTable();
    const cell = screen.getByRole('cell', { name: '12' });
    expect(cell).toHaveClass('ds-table__cell--numeric', 'ds-table__cell--end');
    const head = screen.getByRole('columnheader', { name: 'Seats' });
    expect(head).toHaveClass('ds-table__cell--numeric', 'ds-table__cell--end');
  });

  it('supports explicit cell alignment', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell align="center">c</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByRole('cell')).toHaveClass('ds-table__cell--center');
  });

  it('does not expose aria-sort on non-sortable headers', () => {
    renderTable();
    expect(screen.getByRole('columnheader', { name: 'Name' })).not.toHaveAttribute('aria-sort');
  });

  it('renders a sort button with aria-sort and toggles direction via mouse and keyboard', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    const { rerender } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="none" onSort={onSort}>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    const head = screen.getByRole('columnheader', { name: 'Name' });
    expect(head).toHaveAttribute('aria-sort', 'none');
    const button = within(head).getByRole('button', { name: 'Name' });
    await user.click(button);
    expect(onSort).toHaveBeenLastCalledWith('asc');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSort={onSort}>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(head).toHaveAttribute('aria-sort', 'ascending');
    button.focus();
    await user.keyboard('{Enter}');
    expect(onSort).toHaveBeenLastCalledWith('desc');

    rerender(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc" onSort={onSort}>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    expect(head).toHaveAttribute('aria-sort', 'descending');
    await user.keyboard(' ');
    expect(onSort).toHaveBeenLastCalledWith('asc');
    expect(onSort).toHaveBeenCalledTimes(3);
  });

  it('is keyboard reachable: Tab lands on the sort button', async () => {
    const user = userEvent.setup();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Name' })).toHaveFocus();
  });

  it('renders an empty state spanning all columns', () => {
    render(
      <Table columns={4}>
        <TableBody>
          <TableEmpty>Nothing here</TableEmpty>
        </TableBody>
      </Table>,
    );
    const cell = screen.getByRole('cell', { name: 'Nothing here' });
    expect(cell).toHaveAttribute('colspan', '4');
  });

  it('lets TableEmpty override colSpan and uses a default message', () => {
    render(
      <Table columns={4}>
        <TableBody>
          <TableEmpty colSpan={2} />
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('cell', { name: 'No results' })).toHaveAttribute('colspan', '2');
  });

  it('forwards refs and merges className', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref} className="custom" containerProps={{ 'data-testid': 'wrap', className: 'wrap' } as never}>
        <TableBody />
      </Table>,
    );
    expect(ref.current).toBe(screen.getByRole('table'));
    expect(ref.current).toHaveClass('ds-table', 'custom');
    expect(screen.getByTestId('wrap')).toHaveClass('ds-table-container', 'wrap');
  });
});
