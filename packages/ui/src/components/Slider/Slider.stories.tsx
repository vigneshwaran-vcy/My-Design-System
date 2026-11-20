import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { label: 'Volume', defaultValue: 40, size: 'md', variant: 'accent', showValue: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    variant: { control: 'inline-radio', options: ['accent', 'neutral'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 5)' }}><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(25);
    return <Slider {...args} value={value} onChange={(v) => setValue(v)} hint={`Value: ${value}`} />;
  },
};

export const StepAndFormat: Story = {
  args: {
    label: 'Discount',
    min: 0,
    max: 50,
    step: 5,
    defaultValue: 15,
    showRange: true,
    formatValue: (v: number) => `${v}%`,
  },
};

export const Neutral: Story = { args: { variant: 'neutral' } };

export const WithError: Story = { args: { error: 'Budget exceeds the approved limit.', defaultValue: 90 } };

export const Disabled: Story = { args: { disabled: true } };

export const HiddenLabel: Story = { args: { hideLabel: true, showValue: false } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-6)' }}>
      <Slider {...args} size="sm" label="Small" />
      <Slider {...args} size="md" label="Medium" />
    </div>
  ),
};
