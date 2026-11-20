import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import type { IconName } from '../Icon';
import { VerticalNavigation, VerticalNavigationItem, VerticalNavigationSection } from './VerticalNavigation';

const meta = {
  title: 'Components/VerticalNavigation',
  component: VerticalNavigation,
  tags: ['autodocs'],
  args: { 'aria-label': 'Northwind', defaultValue: 'website', variant: 'default', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'framed'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ width: 'var(--ds-size-panel-sm)' }}><Story /></div>],
} satisfies Meta<typeof VerticalNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Sample data: the navigation of a project-management app (same as the playground docs). */
interface Page {
  id: string;
  label: string;
  icon: IconName;
  badge?: number;
  disabled?: boolean;
}

const GROUPS: { title: string; collapsible?: boolean; defaultOpen?: boolean; pages: Page[] }[] = [
  {
    title: 'Workspace',
    pages: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
      { id: 'my-tasks', label: 'My tasks', icon: 'checklist', badge: 3 },
      { id: 'calendar', label: 'Calendar', icon: 'calendar' },
      { id: 'reports', label: 'Reports', icon: 'chart-2' },
    ],
  },
  {
    title: 'Projects',
    collapsible: true,
    pages: [
      { id: 'website', label: 'Website redesign', icon: 'widget', badge: 8 },
      { id: 'mobile', label: 'Mobile app v2', icon: 'phone' },
      { id: 'launch', label: 'Q1 launch', icon: 'rocket', badge: 5 },
      { id: 'brand', label: 'Brand refresh', icon: 'palette' },
    ],
  },
  {
    title: 'Team',
    collapsible: true,
    pages: [
      { id: 'members', label: 'Members', icon: 'users-group-rounded', badge: 24 },
      { id: 'roles', label: 'Roles & access', icon: 'shield-check' },
      { id: 'billing', label: 'Billing', icon: 'wallet', disabled: true },
    ],
  },
  {
    title: 'Archive',
    collapsible: true,
    defaultOpen: false,
    pages: [
      { id: 'archive-2025', label: '2025 projects', icon: 'folder' },
      { id: 'archive-2024', label: '2024 projects', icon: 'folder' },
    ],
  },
];

const Sections = () => (
  <>
    {GROUPS.map((group) => (
      <VerticalNavigationSection key={group.title} title={group.title} collapsible={group.collapsible} defaultOpen={group.defaultOpen}>
        {group.pages.map((page) => (
          <VerticalNavigationItem key={page.id} value={page.id} icon={page.icon} badge={page.badge} disabled={page.disabled}>
            {page.label}
          </VerticalNavigationItem>
        ))}
      </VerticalNavigationSection>
    ))}
  </>
);

export const Playground: Story = { render: (args) => <VerticalNavigation {...args}><Sections /></VerticalNavigation> };
export const Framed: Story = { ...Playground, args: { variant: 'framed' } };
export const Compact: Story = { ...Playground, args: { size: 'sm' } };
export const FramedCompact: Story = { ...Playground, args: { variant: 'framed', size: 'sm' } };

export const Links: Story = {
  render: (args) => (
    <VerticalNavigation {...args} aria-label="Docs" defaultValue="tokens">
      <VerticalNavigationSection title="Getting started">
        <VerticalNavigationItem value="overview" href="#overview" icon="document">Overview</VerticalNavigationItem>
        <VerticalNavigationItem value="install" href="#install" icon="download">Installation</VerticalNavigationItem>
        <VerticalNavigationItem value="changelog" href="#changelog" icon="sort-by-time" badge="New">Changelog</VerticalNavigationItem>
      </VerticalNavigationSection>
      <VerticalNavigationSection title="Foundations" collapsible>
        <VerticalNavigationItem value="tokens" href="#tokens" icon="palette">Tokens</VerticalNavigationItem>
        <VerticalNavigationItem value="icons" href="#icons" icon="stars">Icons</VerticalNavigationItem>
        <VerticalNavigationItem value="motion" href="#motion" icon="bolt">Motion</VerticalNavigationItem>
      </VerticalNavigationSection>
    </VerticalNavigation>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('inbox');
    const page = GROUPS.flatMap((g) => g.pages).find((p) => p.id === value);
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <VerticalNavigation {...args} value={value} onValueChange={setValue}>
          <Sections />
        </VerticalNavigation>
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>Current: {page?.label}</span>
      </div>
    );
  },
};
