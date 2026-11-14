import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar, type DateRange } from './Calendar';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: { size: 'md', variant: 'outline', mode: 'single' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'plain'] },
    mode: { control: 'inline-radio', options: ['single', 'range'] },
    firstDayOfWeek: { control: { type: 'number', min: 0, max: 6 } },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | null>(new Date());
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-2)' }}>
        <Calendar {...args} value={value} onChange={setValue} />
        <span>Selected: {value?.toDateString() ?? 'nothing'}</span>
      </div>
    );
  },
};

export const Range: Story = {
  render: (args) => {
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    return <Calendar {...args} mode="range" range={range} onRangeChange={setRange} />;
  },
};

export const MinMaxAndDisabled: Story = {
  args: {
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 5),
    max: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const MondayFirstGerman: Story = { args: { locale: 'de-DE', firstDayOfWeek: 1, labels: { today: 'Heute' }, showTodayButton: true } };

export const WithTodayButton: Story = { args: { showTodayButton: true } };

export const Plain: Story = { args: { variant: 'plain' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--ds-space-4)', alignItems: 'flex-start' }}>
      <Calendar {...args} size="sm" />
      <Calendar {...args} size="md" />
      <Calendar {...args} size="lg" />
    </div>
  ),
};
