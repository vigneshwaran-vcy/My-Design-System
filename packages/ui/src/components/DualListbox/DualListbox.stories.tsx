import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DualListbox, type DualListboxOption } from './DualListbox';

const languages: DualListboxOption[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean', disabled: true },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ta', label: 'Tamil' },
  { value: 'zh', label: 'Chinese' },
];

const meta = {
  title: 'Components/DualListbox',
  component: DualListbox,
  tags: ['autodocs'],
  args: { label: 'Languages', options: languages, defaultValue: ['en', 'fr'], size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 10)' }}><Story /></div>],
} satisfies Meta<typeof DualListbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Reorderable: Story = { args: { reorderable: true, hint: 'Order sets the fallback priority.' } };

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['de']);
    return <DualListbox {...args} value={value} onChange={setValue} hint={`Selected: ${value.join(', ') || 'none'}`} />;
  },
};

export const CustomHeadings: Story = { args: { sourceLabel: 'Available fields', selectedLabel: 'Visible columns' } };

export const Required: Story = { args: { required: true, defaultValue: [], error: 'Select at least one language.' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-6)' }}>
      <DualListbox {...args} size="sm" label="Small" visibleRows={4} />
      <DualListbox {...args} size="md" label="Medium" visibleRows={4} />
      <DualListbox {...args} size="lg" label="Large" visibleRows={4} />
    </div>
  ),
};
