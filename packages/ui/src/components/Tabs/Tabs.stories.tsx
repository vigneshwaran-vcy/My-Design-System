import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { defaultValue: 'overview', orientation: 'horizontal', variant: 'underline', size: 'md' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    variant: { control: 'inline-radio', options: ['underline', 'pill'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Content = () => (
  <>
    <TabList aria-label="Project sections">
      <Tab value="overview">Overview</Tab>
      <Tab value="members" badge={12}>Members</Tab>
      <Tab value="billing">Billing</Tab>
      <Tab value="archive" disabled>Archive</Tab>
    </TabList>
    <TabPanel value="overview">Project health, recent activity and quick links.</TabPanel>
    <TabPanel value="members">Twelve people have access to this project.</TabPanel>
    <TabPanel value="billing">Plan, invoices and payment method.</TabPanel>
    <TabPanel value="archive">Archived items.</TabPanel>
  </>
);

export const Playground: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Content />
    </Tabs>
  ),
};

export const Pill: Story = { ...Playground, args: { variant: 'pill' } };
export const Small: Story = { ...Playground, args: { size: 'sm' } };
export const Vertical: Story = { ...Playground, args: { orientation: 'vertical' } };

export const WithIcons: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Views">
        <Tab value="overview" icon="▦">Board</Tab>
        <Tab value="members" icon="☰">List</Tab>
        <Tab value="billing" icon="▤">Timeline</Tab>
      </TabList>
      <TabPanel value="overview">Board view</TabPanel>
      <TabPanel value="members">List view</TabPanel>
      <TabPanel value="billing">Timeline view</TabPanel>
    </Tabs>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('overview');
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <Tabs {...args} value={value} onValueChange={setValue}>
          <Content />
        </Tabs>
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>Selected: {value}</span>
      </div>
    );
  },
};
