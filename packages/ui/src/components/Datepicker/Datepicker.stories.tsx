import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Datepicker } from './Datepicker';

const meta = {
  title: 'Components/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  args: { label: 'Start date', size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
    placement: { control: 'select', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-md)', minHeight: 'calc(var(--ds-space-16) * 7)' }}><Story /></div>],
} satisfies Meta<typeof Datepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<Date | null>(new Date());
    return <Datepicker {...args} value={value} onChange={setValue} hint={`Value: ${value?.toDateString() ?? 'null'}`} />;
  },
};

export const CustomFormat: Story = { args: { format: 'YYYY-MM-DD', hint: 'Type YYYY-MM-DD or pick a day.' } };

export const LocaleFormat: Story = { args: { locale: 'de-DE', label: 'Startdatum', calendarLabel: 'Datum wählen' } };

export const MinMax: Story = {
  args: {
    min: new Date(),
    max: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0),
    isDateDisabled: (date: Date) => date.getDay() === 0,
    hint: 'From today until the end of next month, no Sundays.',
  },
};

export const WithError: Story = { args: { error: 'Choose a start date.', required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: new Date() } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Datepicker {...args} size="sm" label="Small" />
      <Datepicker {...args} size="md" label="Medium" />
      <Datepicker {...args} size="lg" label="Large" />
    </div>
  ),
};
