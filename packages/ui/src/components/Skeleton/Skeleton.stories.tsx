import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { variant: 'text' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'circle', 'rect'] },
  },
  decorators: [(Story) => <div style={{ width: 'calc(var(--ds-space-16) * 5)' }}><Story /></div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Skeleton variant="text" />
      <Skeleton variant="circle" />
      <Skeleton variant="rect" height="var(--ds-size-avatar-xl)" />
    </div>
  ),
};

export const Paragraph: Story = {
  args: { lines: 3, label: 'Loading description' },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
      <Skeleton variant="circle" />
      <div style={{ flex: 1, display: 'grid', gap: 'var(--ds-space-2)' }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="70%" height="var(--ds-font-size-xs)" />
      </div>
    </div>
  ),
};

export const CustomSize: Story = {
  args: { variant: 'rect', width: 'var(--ds-space-16)', height: 'var(--ds-space-8)' },
};
