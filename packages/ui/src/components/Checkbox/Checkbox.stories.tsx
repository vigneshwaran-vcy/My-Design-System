import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Email me product updates', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const WithDescription: Story = {
  args: { description: 'Occasional news about releases. No marketing.', defaultChecked: true },
};

export const Indeterminate: Story = {
  render: (args) => {
    const [items, setItems] = useState([true, false, true]);
    const all = items.every(Boolean);
    const none = items.every((v) => !v);
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <Checkbox
          {...args}
          label="Select all"
          checked={all}
          indeterminate={!all && !none}
          onChange={(next) => setItems(items.map(() => next))}
        />
        <div style={{ display: 'grid', gap: 'var(--ds-space-2)', paddingInlineStart: 'var(--ds-space-6)' }}>
          {items.map((checked, i) => (
            <Checkbox
              key={i}
              size={args.size}
              label={`Item ${i + 1}`}
              checked={checked}
              onChange={(next) => setItems(items.map((v, j) => (j === i ? next : v)))}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Invalid: Story = {
  args: { label: 'I agree to the terms', error: 'You must accept the terms to continue.' },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox {...args} label="Disabled checked" disabled defaultChecked />
      <Checkbox {...args} label="Disabled mixed" disabled indeterminate />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <Checkbox {...args} size="sm" label="Small" defaultChecked />
      <Checkbox {...args} size="md" label="Medium" defaultChecked />
    </div>
  ),
};

export const HiddenLabel: Story = { args: { label: 'Select row', hideLabel: true } };
