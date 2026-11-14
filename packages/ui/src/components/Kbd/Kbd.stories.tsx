import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { keys: ['cmd', 'K'], size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SingleKey: Story = {
  args: { keys: undefined, children: 'Esc' },
};

export const Shortcuts: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
      <Kbd {...args} keys={['cmd', 'K']} />
      <Kbd {...args} keys={['cmd', 'shift', 'P']} />
      <Kbd {...args} keys={['ctrl', 'alt', 'delete']} separator="+" />
      <Kbd {...args} keys={['enter']} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center' }}>
      <Kbd {...args} size="sm" />
      <Kbd {...args} size="md" />
    </div>
  ),
};

export const InMenuItem: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--ds-space-8)', fontSize: 'var(--ds-font-size-sm)' }}>
      <span>Search projects</span>
      <Kbd {...args} size="sm" />
    </div>
  ),
};
