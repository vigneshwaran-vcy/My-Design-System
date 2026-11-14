import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { ButtonIcon } from '../ButtonIcon';
import { Icon } from '../Icon';
import { Tile } from './Tile';

const meta = {
  title: 'Components/Tile',
  component: Tile,
  tags: ['autodocs'],
  args: {
    title: 'Acme Corporation',
    href: '#acme',
    variant: 'card',
    size: 'md',
    details: [
      { label: 'Owner', value: 'Ada Lovelace' },
      { label: 'Stage', value: 'Negotiation' },
    ],
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'card'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-lg)' }}><Story /></div>],
} satisfies Meta<typeof Tile>;

export default meta;
type Story = StoryObj<typeof meta>;

const actions = <ButtonIcon icon="menu-dots" label="Acme Corporation actions" variant="bare" size="xs" />;
const iconMedia = (
  <span style={{ display: 'inline-flex', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-accent-subtle)', color: 'var(--ds-color-text-accent)' }}>
    <Icon name="case" size="md" />
  </span>
);

export const Playground: Story = { args: { media: iconMedia, actions } };

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
      <Tile {...args} variant="plain" media={iconMedia} actions={actions} />
      <Tile {...args} variant="card" media={iconMedia} actions={actions} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
      <Tile {...args} size="sm" media={<Avatar size="sm" name="Ada Lovelace" />} actions={actions} />
      <Tile {...args} size="md" media={<Avatar size="md" name="Ada Lovelace" />} actions={actions} />
    </div>
  ),
};

export const WithBody: Story = {
  args: {
    media: <Avatar name="Grace Hopper" />,
    title: 'Grace Hopper',
    details: undefined,
    children: (
      <span style={{ display: 'inline-flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
        Rear Admiral · <Badge variant="success">Active</Badge>
      </span>
    ),
  },
};

export const TitleOnly: Story = { args: { href: undefined, details: undefined, title: 'A tile with no link' } };

/** A list of plain tiles inside a frame. */
export const List: Story = {
  render: (args) => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 'var(--ds-space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-2)', background: 'var(--ds-color-bg-frame)', borderRadius: 'var(--ds-radius-xl)' }}>
      {['Acme Corporation', 'Globex', 'Initech'].map((name) => (
        <li key={name}>
          <Tile {...args} title={name} media={iconMedia} actions={<ButtonIcon icon="menu-dots" label={`${name} actions`} variant="bare" size="xs" />} />
        </li>
      ))}
    </ul>
  ),
};
