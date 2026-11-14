import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination, type PaginationProps } from './Pagination';

const Controlled = (props: Omit<PaginationProps, 'page' | 'onPageChange'> & { page?: number }) => {
  const [page, setPage] = useState(props.page ?? 1);
  return <Pagination {...props} page={page} onPageChange={setPage} />;
};

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, pageCount: 12, siblingCount: 1, size: 'md', onPageChange: () => {} },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Controlled {...args} />,
};

export const MiddleOfRange: Story = {
  args: { page: 6, pageCount: 20 },
  render: (args) => <Controlled {...args} />,
};

export const WithFirstLast: Story = {
  args: { page: 6, pageCount: 20, showFirstLast: true },
  render: (args) => <Controlled {...args} />,
};

export const MoreSiblings: Story = {
  args: { page: 10, pageCount: 30, siblingCount: 2 },
  render: (args) => <Controlled {...args} />,
};

export const Compact: Story = {
  args: { page: 3, pageCount: 9, compact: true },
  render: (args) => <Controlled {...args} />,
};

export const Small: Story = {
  args: { page: 2, pageCount: 8, size: 'sm' },
  render: (args) => <Controlled {...args} />,
};
