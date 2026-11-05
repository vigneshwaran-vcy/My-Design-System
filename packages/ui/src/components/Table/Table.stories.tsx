import type { Meta, StoryObj } from '@storybook/react';
import { useMemo, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableEmpty, TableHead, TableHeader, TableRow, type TableSortDirection } from './Table';

const invoices = [
  { id: 'INV-1041', customer: 'Acme Corp', status: 'Paid', amount: 1250 },
  { id: 'INV-1042', customer: 'Globex', status: 'Pending', amount: 480 },
  { id: 'INV-1043', customer: 'Initech', status: 'Overdue', amount: 2310 },
  { id: 'INV-1044', customer: 'Umbrella', status: 'Paid', amount: 990 },
];

const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: { size: 'md', striped: false, stickyHeader: false, columns: 4 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const Rows = () => (
  <>
    {invoices.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.customer}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell numeric>${row.amount.toLocaleString()}</TableCell>
      </TableRow>
    ))}
  </>
);

export const Playground: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Invoices for October</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Rows />
      </TableBody>
    </Table>
  ),
};

export const Striped: Story = { ...Playground, args: { striped: true } };
export const Small: Story = { ...Playground, args: { size: 'sm' } };

export const Sortable: Story = {
  render: (args) => {
    const [sort, setSort] = useState<{ key: 'customer' | 'amount'; dir: TableSortDirection }>({ key: 'customer', dir: 'asc' });
    const sorted = useMemo(() => {
      const list = [...invoices];
      list.sort((a, b) => {
        const cmp = sort.key === 'amount' ? a.amount - b.amount : a.customer.localeCompare(b.customer);
        return sort.dir === 'desc' ? -cmp : cmp;
      });
      return list;
    }, [sort]);
    const dirFor = (key: 'customer' | 'amount') => (sort.key === key ? sort.dir : 'none');
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead sortable sortDirection={dirFor('customer')} onSort={(dir) => setSort({ key: 'customer', dir })}>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric sortable sortDirection={dirFor('amount')} onSort={(dir) => setSort({ key: 'amount', dir })}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell numeric>${row.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const SelectableRows: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>('INV-1042');
    return (
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => (
            <TableRow key={row.id} interactive selected={selected === row.id} onClick={() => setSelected(row.id)}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell numeric>${row.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const StickyHeader: Story = {
  args: { stickyHeader: true },
  render: (args) => (
    <Table {...args} containerProps={{ style: { maxHeight: 'calc(var(--ds-space-16) * 3)' } }}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Rows />
        <Rows />
        <Rows />
      </TableBody>
    </Table>
  ),
};

export const Empty: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty>No invoices match your filters.</TableEmpty>
      </TableBody>
    </Table>
  ),
};
