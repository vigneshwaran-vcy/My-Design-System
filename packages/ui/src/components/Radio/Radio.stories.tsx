import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  tags: ['autodocs'],
  args: { label: 'Plan', orientation: 'vertical', size: 'md', defaultValue: 'team' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free" label="Free" description="For personal projects" />
      <Radio value="team" label="Team" description="Up to 10 seats, shared libraries" />
      <Radio value="enterprise" label="Enterprise" description="SSO, audit log, SLA" />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | null>('team');
    return (
      <RadioGroup {...args} value={value} onChange={setValue} hint={`Selected: ${value ?? 'nothing'}`}>
        <Radio value="free" label="Free" />
        <Radio value="team" label="Team" />
        <Radio value="enterprise" label="Enterprise" />
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  args: { label: 'Billing', orientation: 'horizontal', defaultValue: 'monthly' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="monthly" label="Monthly" />
      <Radio value="yearly" label="Yearly" />
    </RadioGroup>
  ),
};

export const WithError: Story = {
  args: { label: 'Shipping', defaultValue: null, required: true, error: 'Choose a shipping speed.' },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="standard" label="Standard" description="3–5 business days" />
      <Radio value="express" label="Express" description="Next business day" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledOption: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="free" label="Free" />
      <Radio value="team" label="Team" />
      <Radio value="enterprise" label="Enterprise" description="Contact sales" disabled />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-6)' }}>
      <RadioGroup {...args} label="Small" size="sm">
        <Radio value="free" label="Free" />
        <Radio value="team" label="Team" />
      </RadioGroup>
      <RadioGroup {...args} label="Medium" size="md">
        <Radio value="free" label="Free" />
        <Radio value="team" label="Team" />
      </RadioGroup>
    </div>
  ),
};

export const HiddenLabel: Story = { args: { hideLabel: true } };
