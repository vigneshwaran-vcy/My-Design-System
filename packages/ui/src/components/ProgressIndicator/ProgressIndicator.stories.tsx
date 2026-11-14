import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { ProgressIndicator, type ProgressStep } from './ProgressIndicator';

const steps: ProgressStep[] = [
  { id: 'account', label: 'Account', description: 'Email and password' },
  { id: 'profile', label: 'Profile', description: 'Name and photo' },
  { id: 'billing', label: 'Billing', description: 'Plan and payment' },
  { id: 'review', label: 'Review', description: 'Confirm details' },
];

const meta = {
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['autodocs'],
  args: { steps, currentStep: 'billing', orientation: 'horizontal', variant: 'default', size: 'md' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['default', 'framed'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    currentStep: { control: 'select', options: steps.map((s) => s.id) },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-2xl)' }}><Story /></div>],
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const Framed: Story = { args: { variant: 'framed' } };
export const Small: Story = { args: { size: 'sm' } };
export const WithError: Story = {
  args: { steps: steps.map((s) => (s.id === 'profile' ? { ...s, status: 'error', description: 'Photo failed to upload' } : s)) },
};
export const Completed: Story = { args: { steps: steps.map((s) => ({ ...s, status: 'completed' })) } };

export const ClickableSteps: Story = {
  render: (args) => {
    const [current, setCurrent] = useState(2);
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
        <ProgressIndicator {...args} currentStep={steps[current].id} onStepClick={(_, index) => setCurrent(index)} />
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
          <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
          <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Next</Button>
        </div>
      </div>
    );
  },
};
