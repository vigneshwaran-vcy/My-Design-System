import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Dropdown, type DropdownOption } from './Dropdown';

const roles: DropdownOption[] = [
  { value: 'owner', label: 'Owner', description: 'Full access, including billing' },
  { value: 'admin', label: 'Admin', description: 'Manage members and settings' },
  { value: 'editor', label: 'Editor', description: 'Create and edit content' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'guest', label: 'Guest', description: 'Invite pending', disabled: true },
];

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { label: 'Role', options: roles, size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 5)', minHeight: 'calc(var(--ds-space-16) * 5)' }}><Story /></div>],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithValue: Story = { args: { defaultValue: 'editor' } };

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('viewer');
    return <Dropdown {...args} value={value} onChange={setValue} hint={`Selected: ${value}`} />;
  },
};

export const WithHint: Story = { args: { hint: 'You can change this later.' } };

export const WithError: Story = { args: { error: 'Choose a role to continue.', required: true } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 'admin' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <Dropdown {...args} size="sm" label="Small" />
      <Dropdown {...args} size="md" label="Medium" />
      <Dropdown {...args} size="lg" label="Large" />
    </div>
  ),
};
