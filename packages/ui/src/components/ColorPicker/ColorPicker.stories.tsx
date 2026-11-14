import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ColorPicker } from './ColorPicker';

const meta = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  args: { label: 'Brand colour', size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 5)', minHeight: 'calc(var(--ds-space-16) * 6)' }}><Story /></div>],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Controlled: Story = {
  render: (args) => {
    const [color, setColor] = useState('#7C3AED');
    return <ColorPicker {...args} value={color} onChange={setColor} hint={`Value: ${color}`} />;
  },
};

export const SwatchesOnly: Story = { args: { showCustom: false, showNativePicker: false } };

export const CustomSwatches: Story = {
  args: {
    label: 'Label colour',
    columns: 4,
    swatches: [
      { value: '#0260FF', label: 'Blue' },
      { value: '#16A34A', label: 'Green' },
      { value: '#D97706', label: 'Amber' },
      { value: '#DC2626', label: 'Red' },
    ],
    defaultValue: '#16A34A',
  },
};

export const WithError: Story = { args: { required: true, error: 'This colour fails contrast on white.' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <ColorPicker {...args} size="sm" label="Small" />
      <ColorPicker {...args} size="md" label="Medium" />
      <ColorPicker {...args} size="lg" label="Large" />
    </div>
  ),
};
