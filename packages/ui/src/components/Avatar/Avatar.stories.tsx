import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';

const photo = 'https://i.pravatar.cc/128?img=5';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Ada Lovelace', size: 'md', shape: 'circle' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    status: { control: 'inline-radio', options: [undefined, 'online', 'offline', 'busy', 'away'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithImage: Story = { args: { src: photo } };

export const Initials: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      <Avatar {...args} name="Ada Lovelace" />
      <Avatar {...args} name="Grace Hopper" />
      <Avatar {...args} name="Alan Turing" />
      <Avatar {...args} name="Katherine Johnson" />
      <Avatar {...args} name="Linus" />
      <Avatar {...args} name={undefined} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Square: Story = {
  args: { shape: 'square' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" src={photo} />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

export const Status: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      <Avatar {...args} status="online" />
      <Avatar {...args} status="away" src={photo} />
      <Avatar {...args} status="busy" name="Grace Hopper" />
      <Avatar {...args} status="offline" name="Alan Turing" />
    </div>
  ),
};

export const BrokenImageFallback: Story = {
  args: { src: 'https://example.invalid/missing.png' },
};

export const Group: Story = {
  render: (args) => (
    <AvatarGroup max={3} size={args.size}>
      <Avatar name="Ada Lovelace" src={photo} />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" />
      <Avatar name="Katherine Johnson" />
      <Avatar name="Linus Torvalds" />
    </AvatarGroup>
  ),
};
