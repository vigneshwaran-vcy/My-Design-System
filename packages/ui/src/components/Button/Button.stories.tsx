import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon';
import { useState } from 'react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Button', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'soft', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      <Button {...args} variant="primary">Primary</Button>
      <Button {...args} variant="secondary">Secondary</Button>
      <Button {...args} variant="soft">Soft</Button>
      <Button {...args} variant="ghost">Ghost</Button>
      <Button {...args} variant="danger">Delete</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
      <Button {...args} size="xs">Extra small</Button>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const Loading: Story = { args: { loading: true, children: 'Saving…' } };

export const WithIcons: Story = {
  args: { leadingIcon: <Icon name="add" />, trailingIcon: <Icon name="arrow-right" />, children: 'New project' },
};

export const FullWidth: Story = { args: { fullWidth: true } };

/** Toggle buttons: `selected` sets aria-pressed and a settled, pressed-in look. */
export const Selected: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap' }}>
      {(['primary', 'secondary', 'soft', 'ghost', 'danger'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 'var(--ds-space-1)' }}>
          <Button {...args} variant={variant} selected={false}>Off</Button>
          <Button {...args} variant={variant} selected>On</Button>
        </div>
      ))}
    </div>
  ),
};

export const ToggleGroup: Story = {
  args: { variant: 'secondary' },
  render: (args) => {
    const [view, setView] = useState('week');
    return (
      <div role="group" aria-label="Calendar view" style={{ display: 'flex', gap: 'var(--ds-space-1)' }}>
        {['day', 'week', 'month'].map((v) => (
          <Button key={v} {...args} selected={view === v} onClick={() => setView(v)}>
            {v[0].toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
};
