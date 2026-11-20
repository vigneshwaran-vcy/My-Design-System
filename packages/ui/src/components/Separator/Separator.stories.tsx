import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Separator } from './Separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', decorative: true, spacing: 'md' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    spacing: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 'calc(var(--ds-space-16) * 5)' }}>
      <p style={{ margin: 0 }}>Team members</p>
      <Separator {...args} />
      <p style={{ margin: 0 }}>Pending invitations</p>
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'or continue with' },
  render: (args) => (
    <div style={{ width: 'calc(var(--ds-space-16) * 5)', display: 'flex', flexDirection: 'column' }}>
      <Button fullWidth>Sign in with email</Button>
      <Separator {...args} />
      <Button fullWidth variant="secondary">Continue with Google</Button>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', spacing: 'sm' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Button variant="secondary" size="sm">Edit</Button>
      <Separator {...args} />
      <Button variant="secondary" size="sm">Duplicate</Button>
      <Separator {...args} />
      <Button variant="secondary" size="sm">Archive</Button>
    </div>
  ),
};

export const Semantic: Story = {
  args: { decorative: false, label: 'Archived' },
  render: (args) => (
    <div style={{ width: 'calc(var(--ds-space-16) * 5)' }}>
      <Separator {...args} />
    </div>
  ),
};
