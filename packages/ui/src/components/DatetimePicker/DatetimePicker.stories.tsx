import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatetimePicker } from './DatetimePicker';

const meta = {
  title: 'Components/DatetimePicker',
  component: DatetimePicker,
  tags: ['autodocs'],
  args: { label: 'Meeting starts', size: 'md', variant: 'outline', timeStep: 30 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
    timeStep: { control: 'inline-radio', options: [15, 30, 60] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-lg)', minHeight: 'calc(var(--ds-space-16) * 7)' }}><Story /></div>],
} satisfies Meta<typeof DatetimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | null>(new Date(new Date().setHours(9, 0, 0, 0)));
    return <DatetimePicker {...args} value={value} onChange={setValue} hint={`Value: ${value?.toString() ?? 'null'}`} />;
  },
};

export const MinFromNow: Story = { args: { min: new Date(), hint: 'Only future slots.' } };

export const WithError: Story = { args: { error: 'Pick a date and a time.', required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: new Date() } };

export const Narrow: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-sm)' }}><Story /></div>],
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <DatetimePicker {...args} size="sm" label="Small" />
      <DatetimePicker {...args} size="md" label="Medium" />
      <DatetimePicker {...args} size="lg" label="Large" />
    </div>
  ),
};
