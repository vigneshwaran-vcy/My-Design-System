import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { size: 'md', color: 'current', label: 'Loading' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    color: { control: 'inline-radio', options: ['current', 'accent', 'muted'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center' }}>
      <Spinner {...args} size="xs" />
      <Spinner {...args} size="sm" />
      <Spinner {...args} size="md" />
      <Spinner {...args} size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center' }}>
      <Spinner {...args} color="current" />
      <Spinner {...args} color="accent" />
      <Spinner {...args} color="muted" />
    </div>
  ),
};

export const InlineWithText: Story = {
  render: (args) => (
    <p style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)', margin: 0, color: 'var(--ds-color-text-muted)' }}>
      <Spinner {...args} size="sm" label="Syncing" />
      <span aria-hidden="true">Syncing 3 repositories…</span>
    </p>
  ),
};
