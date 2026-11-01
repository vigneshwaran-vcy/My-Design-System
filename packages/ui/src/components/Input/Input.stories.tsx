import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'you@example.com', size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 5)' }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHint: Story = { args: { hint: 'We never share your email.' } };

export const WithError: Story = { args: { error: 'Enter a valid email address.', defaultValue: 'nope' } };

export const Required: Story = { args: { required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'locked@example.com' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Input {...args} size="sm" label="Small" />
      <Input {...args} size="md" label="Medium" />
      <Input {...args} size="lg" label="Large" />
    </div>
  ),
};

export const HiddenLabel: Story = { args: { label: 'Search', hideLabel: true, placeholder: 'Search…', type: 'search' } };
