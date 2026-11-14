import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Tab, TabList, TabPanel } from '../Tabs';
import { ScopedTabs } from './ScopedTabs';

const meta = {
  title: 'Components/ScopedTabs',
  component: ScopedTabs,
  tags: ['autodocs'],
  args: { defaultValue: 'details', variant: 'framed', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['framed', 'plain'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-2xl)' }}><Story /></div>],
} satisfies Meta<typeof ScopedTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Content = () => (
  <>
    <TabList aria-label="Account record">
      <Tab value="details" icon={<Icon name="document" />}>Details</Tab>
      <Tab value="activity" icon={<Icon name="clock-circle" />} badge={4}>Activity</Tab>
      <Tab value="files" icon={<Icon name="paperclip" />}>Files</Tab>
      <Tab value="archive" disabled>Archive</Tab>
    </TabList>
    <TabPanel value="details">Account owner, industry, annual revenue and billing address.</TabPanel>
    <TabPanel value="activity">Four open tasks and the latest emails and calls.</TabPanel>
    <TabPanel value="files">Contracts and proposals attached to this account.</TabPanel>
    <TabPanel value="archive">Archived items.</TabPanel>
  </>
);

export const Playground: Story = { render: (args) => <ScopedTabs {...args}><Content /></ScopedTabs> };
export const Plain: Story = { ...Playground, args: { variant: 'plain' } };
export const Small: Story = { ...Playground, args: { size: 'sm' } };

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState('activity');
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <ScopedTabs {...args} value={value} onValueChange={setValue}>
          <Content />
        </ScopedTabs>
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>Selected: {value}</span>
      </div>
    );
  },
};
