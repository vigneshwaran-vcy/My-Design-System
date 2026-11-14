import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tree, type TreeNode } from './Tree';

const items: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { id: 'button', label: 'Button.tsx', icon: 'file-text' },
          { id: 'card', label: 'Card.tsx', icon: 'file-text' },
          { id: 'tree', label: 'Tree.tsx', icon: 'file-text' },
        ],
      },
      { id: 'utils', label: 'utils', icon: 'folder', children: [{ id: 'cx', label: 'cx.ts', icon: 'file-text' }] },
      { id: 'index', label: 'index.ts', icon: 'file-text' },
    ],
  },
  { id: 'assets', label: 'assets', icon: 'folder', meta: '24', children: [{ id: 'logo', label: 'logo.svg', icon: 'gallery' }] },
  { id: 'secrets', label: '.env', icon: 'lock-keyhole', disabled: true },
  { id: 'readme', label: 'README.md', icon: 'document' },
];

const meta = {
  title: 'Components/Tree',
  component: Tree,
  tags: ['autodocs'],
  args: { 'aria-label': 'Project files', items, defaultExpandedIds: ['src', 'components'], defaultSelectedId: 'tree', variant: 'default', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'framed'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ width: 'var(--ds-size-panel-md)' }}><Story /></div>],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Framed: Story = { args: { variant: 'framed' } };
export const Small: Story = { args: { size: 'sm' } };
export const WithoutIcons: Story = {
  args: {
    items: [
      { id: 'a', label: 'Accounts', children: [{ id: 'a1', label: 'Acme Corp' }, { id: 'a2', label: 'Globex' }] },
      { id: 'b', label: 'Contacts', children: [{ id: 'b1', label: 'Ada Lovelace' }] },
    ],
    defaultExpandedIds: ['a'],
    defaultSelectedId: 'a2',
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>('readme');
    const [expanded, setExpanded] = useState<string[]>(['src']);
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <Tree {...args} selectedId={selected} onSelectedChange={setSelected} expandedIds={expanded} onExpandedChange={setExpanded} />
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>
          Selected: {selected ?? 'none'} · Expanded: {expanded.join(', ') || 'none'}
        </span>
      </div>
    );
  },
};
