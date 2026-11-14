import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'info',
    title: 'Scheduled maintenance',
    children: 'The API will be read-only on Sunday from 02:00 to 03:00 UTC.',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warn', 'danger', 'neutral'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)' }}>
      <Alert {...args} variant="info" title="New integration available">Connect Slack to get deploy notifications in a channel.</Alert>
      <Alert {...args} variant="success" title="Invoice sent">Invoice #2041 was emailed to billing@acme.com.</Alert>
      <Alert {...args} variant="warn" title="Approaching plan limit">You have used 92% of your monthly API quota.</Alert>
      <Alert {...args} variant="danger" title="Payment failed">We could not charge the card ending in 4242.</Alert>
      <Alert {...args} variant="neutral" title="Tip">Press ⌘K to search across projects.</Alert>
    </div>
  ),
};

export const MessageOnly: Story = {
  args: { title: undefined, children: 'Your workspace was moved to the EU region.' },
};

export const WithAction: Story = {
  args: {
    variant: 'warn',
    title: 'Approaching plan limit',
    children: 'Upgrade to keep requests flowing after the quota is reached.',
  },
  render: (args) => <Alert {...args} action={<Button variant="secondary" size="sm">Upgrade</Button>} />,
};

export const Dismissible: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    if (!open) return <Button variant="secondary" onClick={() => setOpen(true)}>Show alert again</Button>;
    return <Alert {...args} dismissible onDismiss={() => setOpen(false)} />;
  },
};

export const NoIcon: Story = {
  args: { icon: null, variant: 'neutral', title: undefined, children: 'A quiet note without an icon.' },
};
