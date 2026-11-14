import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from '../Kbd';
import { Sidebar, SidebarUser, SidebarWorkspace, type SidebarSection } from './Sidebar';

const sections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 8 },
      { id: 'my-tasks', label: 'My tasks', icon: 'checklist', badge: 3 },
      { id: 'calendar', label: 'Calendar', icon: 'calendar' },
    ],
  },
  {
    id: 'spaces',
    title: 'Spaces',
    collapsible: true,
    action: { icon: 'add', label: 'New space' },
    items: [
      {
        id: 'product',
        label: 'Product',
        tone: 'accent',
        items: [
          { id: 'roadmap', label: 'Roadmap Q1', icon: 'target' },
          { id: 'sprint', label: 'Sprint 24', icon: 'list', badge: 12 },
          { id: 'specs', label: 'Specs', icon: 'document' },
        ],
      },
      {
        id: 'marketing',
        label: 'Marketing',
        tone: 'warn',
        items: [
          { id: 'launch', label: 'Launch plan', icon: 'rocket' },
          { id: 'content', label: 'Content calendar', icon: 'calendar-mark' },
        ],
      },
      { id: 'design', label: 'Design', tone: 'success' },
    ],
  },
  {
    id: 'more',
    title: 'More',
    collapsible: true,
    defaultOpen: false,
    items: [
      { id: 'archive', label: 'Archive', icon: 'archive' },
      { id: 'trash', label: 'Trash', icon: 'trash' },
    ],
  },
];

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: {
    sections,
    defaultValue: 'sprint',
    searchable: true,
    collapsed: false,
    variant: 'default',
    size: 'md',
    header: <SidebarWorkspace name="Acme Inc." meta="Business · 24 members" />,
    searchShortcut: <Kbd size="sm">⌘K</Kbd>,
    footer: <SidebarUser name="Maya Chen" meta="maya@acme.com" status="online" />,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'floating'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    sections: { control: false },
    header: { control: false },
    footer: { control: false },
    searchShortcut: { control: false },
  },
  decorators: [(Story) => <div style={{ height: 'var(--ds-size-panel-xl)', display: 'flex' }}><Story /></div>],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Floating: Story = { args: { variant: 'floating' } };
export const Compact: Story = { args: { size: 'sm' } };
export const Collapsed: Story = { args: { collapsed: true } };
