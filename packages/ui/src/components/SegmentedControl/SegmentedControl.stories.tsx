import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

const periods: SegmentedControlOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year', disabled: true },
];

const views: SegmentedControlOption[] = [
  { value: 'list', label: 'List view', icon: 'list', iconOnly: true },
  { value: 'grid', label: 'Grid view', icon: 'widget', iconOnly: true },
  { value: 'chart', label: 'Chart view', icon: 'chart-2', iconOnly: true },
];

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: { label: 'Period', options: periods, defaultValue: 'week', size: 'md', variant: 'neutral' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['neutral', 'accent'] },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Accent: Story = { args: { variant: 'accent' } };

export const IconOnly: Story = { args: { label: 'View', options: views, defaultValue: 'grid' } };

export const WithIcons: Story = {
  args: {
    label: 'Theme',
    defaultValue: 'light',
    options: [
      { value: 'light', label: 'Light', icon: 'sun' },
      { value: 'dark', label: 'Dark', icon: 'moon' },
    ],
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('day');
    return <SegmentedControl {...args} value={value} onChange={setValue} hint={`Showing: ${value}`} />;
  },
};

export const NoSelection: Story = { args: { defaultValue: null, required: true, error: 'Pick a period.' } };

export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 6)' }}><Story /></div>],
};

export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)', justifyItems: 'start' }}>
      <SegmentedControl {...args} size="sm" label="Small" />
      <SegmentedControl {...args} size="md" label="Medium" />
      <SegmentedControl {...args} size="lg" label="Large" />
    </div>
  ),
};
