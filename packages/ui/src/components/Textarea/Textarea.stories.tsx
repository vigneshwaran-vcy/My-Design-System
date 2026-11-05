import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { label: 'Message', placeholder: 'Write something…', size: 'md', variant: 'outline', rows: 3 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
    resize: { control: 'inline-radio', options: ['none', 'vertical'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 6)' }}><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHint: Story = { args: { hint: 'Markdown is supported.' } };

export const WithError: Story = { args: { error: 'A message is required.', required: true } };

export const AutoResize: Story = {
  args: { autoResize: true, maxRows: 8, hint: 'Grows with the content up to 8 rows.', rows: 2 },
};

export const CharacterCount: Story = {
  render: (args) => {
    const [text, setText] = useState('Short and sweet.');
    return <Textarea {...args} maxLength={120} showCount value={text} onChange={(e) => setText(e.target.value)} />;
  },
};

export const Filled: Story = { args: { variant: 'filled' } };

export const NoResize: Story = { args: { resize: 'none' } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'This field is locked.' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Textarea {...args} size="sm" label="Small" rows={2} />
      <Textarea {...args} size="md" label="Medium" rows={2} />
      <Textarea {...args} size="lg" label="Large" rows={2} />
    </div>
  ),
};

export const HiddenLabel: Story = { args: { label: 'Notes', hideLabel: true, placeholder: 'Add a note…' } };
