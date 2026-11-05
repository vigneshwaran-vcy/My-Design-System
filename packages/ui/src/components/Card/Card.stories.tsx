import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: { variant: 'elevated', padding: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['elevated', 'outlined', 'filled', 'glow'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
  render: (args) => (
    <Card {...args} style={{ maxWidth: 'calc(var(--ds-space-16) * 6)' }}>
      <CardHeader
        title="Team plan"
        description="Billed monthly. Cancel any time."
        action={<Button variant="ghost" size="sm">Edit</Button>}
      />
      <CardBody>Up to 10 seats, shared component libraries and Storybook hosting.</CardBody>
      <CardFooter>
        <Button variant="secondary">Cancel</Button>
        <Button>Upgrade</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {};
export const Outlined: Story = { args: { variant: 'outlined' } };
export const Filled: Story = { args: { variant: 'filled' } };
export const Glow: Story = { args: { variant: 'glow' } };
export const Interactive: Story = { args: { interactive: true } };
export const Compact: Story = { args: { padding: 'sm' } };
export const Spacious: Story = { args: { padding: 'lg' } };
