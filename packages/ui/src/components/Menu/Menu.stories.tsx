import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Menu, type MenuItem } from './Menu';

const items: MenuItem[] = [
  { id: 'rename', label: 'Rename', icon: '✎', shortcut: '⌘R' },
  { id: 'duplicate', label: 'Duplicate', icon: '⧉', shortcut: '⌘D' },
  { id: 'move', label: 'Move to…', icon: '→' },
  { id: 'sep-1', type: 'separator' },
  { id: 'share-label', type: 'label', label: 'Sharing' },
  { id: 'copy-link', label: 'Copy link', icon: '⛓' },
  { id: 'publish', label: 'Publish to web', icon: '↗', disabled: true },
  { id: 'sep-2', type: 'separator' },
  { id: 'delete', label: 'Delete', icon: '🗑', shortcut: '⌫', danger: true },
];

const meta = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: {
    items,
    placement: 'bottom-start',
    trigger: <Button variant="secondary">Actions</Button>,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end'] },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--ds-space-8)', minHeight: 'calc(var(--ds-space-16) * 7)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithSelection: Story = {
  render: (args) => {
    const [last, setLast] = useState<string>();
    return (
      <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
        <Menu {...args} onSelect={setLast} />
        <span style={{ color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>
          {last ? `Selected: ${last}` : 'Nothing selected yet'}
        </span>
      </div>
    );
  },
};

export const AlignedEnd: Story = {
  args: { placement: 'bottom-end', trigger: <Button variant="ghost" aria-label="More options">⋯</Button> },
};

export const Minimal: Story = {
  args: {
    items: [
      { id: 'edit', label: 'Edit' },
      { id: 'archive', label: 'Archive' },
      { id: 'delete', label: 'Delete', danger: true },
    ],
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
        <Menu {...args} open={open} onOpenChange={setOpen} />
        <Button size="sm" variant="soft" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Open'} from outside</Button>
      </div>
    );
  },
};
