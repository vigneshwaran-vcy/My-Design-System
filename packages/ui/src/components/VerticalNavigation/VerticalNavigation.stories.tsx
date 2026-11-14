import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VerticalNavigation, VerticalNavigationItem, VerticalNavigationSection } from './VerticalNavigation';

const meta = {
  title: 'Components/VerticalNavigation',
  component: VerticalNavigation,
  tags: ['autodocs'],
  args: { 'aria-label': 'Workspace', defaultValue: 'home', variant: 'default', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'framed'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ width: 'var(--ds-size-panel-sm)' }}><Story /></div>],
} satisfies Meta<typeof VerticalNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const Sections = () => (
  <>
    <VerticalNavigationSection title="Workspace">
      <VerticalNavigationItem value="home" icon="home">Home</VerticalNavigationItem>
      <VerticalNavigationItem value="inbox" icon="inbox" badge={12}>Inbox</VerticalNavigationItem>
      <VerticalNavigationItem value="calendar" icon="calendar">Calendar</VerticalNavigationItem>
      <VerticalNavigationItem value="billing" icon="wallet" disabled>Billing</VerticalNavigationItem>
    </VerticalNavigationSection>
    <VerticalNavigationSection title="Reports" collapsible>
      <VerticalNavigationItem value="recent" icon="clock-circle">Recent</VerticalNavigationItem>
      <VerticalNavigationItem value="shared" icon="share" badge={3}>Shared with me</VerticalNavigationItem>
      <VerticalNavigationItem value="starred" icon="star">Starred</VerticalNavigationItem>
    </VerticalNavigationSection>
    <VerticalNavigationSection title="Archive" collapsible defaultOpen={false}>
      <VerticalNavigationItem value="2025" icon="folder">2025</VerticalNavigationItem>
      <VerticalNavigationItem value="2024" icon="folder">2024</VerticalNavigationItem>
    </VerticalNavigationSection>
  </>
);

export const Playground: Story = { render: (args) => <VerticalNavigation {...args}><Sections /></VerticalNavigation> };
export const Framed: Story = { ...Playground, args: { variant: 'framed' } };
export const Compact: Story = { ...Playground, args: { size: 'sm' } };
export const FramedCompact: Story = { ...Playground, args: { variant: 'framed', size: 'sm' } };

export const Links: Story = {
  render: (args) => (
    <VerticalNavigation {...args} defaultValue="overview">
      <VerticalNavigationSection title="Docs">
        <VerticalNavigationItem value="overview" href="#overview">Overview</VerticalNavigationItem>
        <VerticalNavigationItem value="install" href="#install">Installation</VerticalNavigationItem>
        <VerticalNavigationItem value="tokens" href="#tokens">Tokens</VerticalNavigationItem>
      </VerticalNavigationSection>
    </VerticalNavigation>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('inbox');
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <VerticalNavigation {...args} value={value} onValueChange={setValue}>
          <Sections />
        </VerticalNavigation>
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>Current: {value}</span>
      </div>
    );
  },
};
