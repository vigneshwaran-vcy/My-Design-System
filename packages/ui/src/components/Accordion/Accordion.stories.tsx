import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Accordion, AccordionItem } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { type: 'single', variant: 'default', size: 'md', collapsible: true, defaultValue: ['billing'] },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    variant: { control: 'inline-radio', options: ['default', 'framed'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-xl)' }}><Story /></div>],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const Items = () => (
  <>
    <AccordionItem value="billing" title="Billing and invoices" icon="wallet">
      Invoices are issued on the first of each month and sent to the billing contact.
    </AccordionItem>
    <AccordionItem value="members" title="Team members" icon="users-group-rounded" meta="12">
      Invite people by email; they join with the Viewer role until you change it.
    </AccordionItem>
    <AccordionItem value="security" title="Security" icon="shield-check">
      Require two-step verification and set session length for everyone in the workspace.
    </AccordionItem>
    <AccordionItem value="archive" title="Archived projects" icon="folder" disabled>
      Archived projects are read-only.
    </AccordionItem>
  </>
);

export const Playground: Story = { render: (args) => <Accordion {...args}><Items /></Accordion> };
export const Framed: Story = { ...Playground, args: { variant: 'framed' } };
export const Multiple: Story = { ...Playground, args: { type: 'multiple', defaultValue: ['billing', 'security'] } };
export const Small: Story = { ...Playground, args: { size: 'sm' } };
export const FramedSmall: Story = { ...Playground, args: { variant: 'framed', size: 'sm' } };
export const Disabled: Story = { ...Playground, args: { disabled: true } };

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['members']);
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <Accordion {...args} value={value} onValueChange={setValue}>
          <Items />
        </Accordion>
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>Open: {value.join(', ') || 'none'}</span>
      </div>
    );
  },
};
