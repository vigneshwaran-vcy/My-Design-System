import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Timepicker } from './Timepicker';

const meta = {
  title: 'Components/Timepicker',
  component: Timepicker,
  tags: ['autodocs'],
  args: { label: 'Start time', size: 'md', variant: 'outline', step: 30 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
    step: { control: 'inline-radio', options: [5, 15, 30, 60] },
    hour12: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-sm)', minHeight: 'calc(var(--ds-space-16) * 5)' }}><Story /></div>],
} satisfies Meta<typeof Timepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>('09:30');
    return <Timepicker {...args} value={value} onChange={setValue} hint={`Value: ${value ?? 'null'}`} />;
  },
};

export const FifteenMinutes: Story = { args: { step: 15 } };

export const TwentyFourHour: Story = { args: { hour12: false, locale: 'en-GB' } };

export const BusinessHours: Story = { args: { min: '09:00', max: '17:00', hint: 'Between 9 AM and 5 PM.' } };

export const WithError: Story = { args: { error: 'Choose a time.', required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: '14:00' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Timepicker {...args} size="sm" label="Small" />
      <Timepicker {...args} size="md" label="Medium" />
      <Timepicker {...args} size="lg" label="Large" />
    </div>
  ),
};
