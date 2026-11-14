import type { Meta, StoryObj } from '@storybook/react';
import { Icon, iconNames } from './Icon';

const meta = {
  title: 'Foundations/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'search', size: 'md' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllIcons: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(calc(var(--ds-space-16) * 2), 1fr))', gap: 'var(--ds-space-4)' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--ds-space-2)', fontSize: 'var(--ds-font-size-xs)' }}>
          <Icon {...args} name={name} />
          <code>{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => <Icon key={size} {...args} size={size} />)}
    </div>
  ),
};
