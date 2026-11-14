import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Notifications', size: 'md', labelPosition: 'end' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    labelPosition: { control: 'inline-radio', options: ['start', 'end'] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const On: Story = { args: { defaultChecked: true } };

export const WithDescription: Story = {
  args: { description: 'Get a push notification when someone mentions you.', defaultChecked: true },
};

export const Controlled: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return <Switch {...args} checked={on} onChange={setOn} description={on ? 'Enabled' : 'Disabled'} />;
  },
};

export const LabelStart: Story = {
  args: { labelPosition: 'start', description: 'The label sits before the track.' },
};

export const Disabled: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <Switch {...args} label="Disabled off" disabled />
      <Switch {...args} label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
      <Switch {...args} size="sm" label="Small" defaultChecked />
      <Switch {...args} size="md" label="Medium" defaultChecked />
    </div>
  ),
};

export const HiddenLabel: Story = { args: { label: 'Toggle dark mode', hideLabel: true } };
