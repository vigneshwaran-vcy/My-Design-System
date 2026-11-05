import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { value: 62, size: 'md', variant: 'accent', shape: 'bar', label: 'Uploading', showValue: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['accent', 'success', 'warn', 'danger'] },
    shape: { control: 'inline-radio', options: ['bar', 'circle'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  decorators: [(Story) => <div style={{ width: 'calc(var(--ds-space-16) * 5)' }}><Story /></div>],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Progress {...args} variant="accent" label="Accent" />
      <Progress {...args} variant="success" label="Success" />
      <Progress {...args} variant="warn" label="Warn" />
      <Progress {...args} variant="danger" label="Danger" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Progress {...args} size="sm" label="Small" />
      <Progress {...args} size="md" label="Medium" />
      <Progress {...args} size="lg" label="Large" />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: { indeterminate: true, label: 'Preparing export…', showValue: false },
};

export const Circle: Story = {
  args: { shape: 'circle' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-6)', alignItems: 'flex-end' }}>
      <Progress {...args} size="sm" label="Small" />
      <Progress {...args} size="md" label="Medium" />
      <Progress {...args} size="lg" label="Large" />
      <Progress {...args} size="lg" indeterminate label="Syncing" />
    </div>
  ),
};

export const Live: Story = {
  render: (args) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setValue((v) => (v >= 100 ? 0 : v + 7)), 600);
      return () => clearInterval(t);
    }, []);
    return <Progress {...args} value={value} label="Importing contacts" />;
  },
};
