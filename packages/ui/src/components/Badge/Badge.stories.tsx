import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Badge } from './Badge';

const variants = ['neutral', 'accent', 'success', 'warn', 'danger', 'outline'] as const;

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Badge', variant: 'neutral', appearance: 'subtle', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    appearance: { control: 'inline-radio', options: ['subtle', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const Solid: Story = {
  args: { appearance: 'solid' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
      {variants.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
      <Badge {...args} size="sm">Small</Badge>
      <Badge {...args} size="md">Medium</Badge>
    </div>
  ),
};

export const WithDot: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
      <Badge {...args} dot variant="success">Active</Badge>
      <Badge {...args} dot variant="warn">Pending</Badge>
      <Badge {...args} dot variant="danger">Failed</Badge>
      <Badge {...args} dot variant="neutral">Archived</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { icon: '★', variant: 'accent', children: 'Featured' },
};

export const Removable: Story = {
  render: (args) => {
    const [tags, setTags] = useState(['Design', 'Engineering', 'Marketing']);
    return (
      <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
        {tags.map((tag) => (
          <Badge key={tag} {...args} variant="accent" removable onRemove={() => setTags((t) => t.filter((x) => x !== tag))}>
            {tag}
          </Badge>
        ))}
      </div>
    );
  },
};
