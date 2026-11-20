import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Popover } from './Popover';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  args: {
    placement: 'bottom-start',
    title: 'Share this page',
    trigger: <Button variant="secondary">Share</Button>,
    children: 'Anyone with the link can view. Only editors can change permissions.',
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'] },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'calc(var(--ds-space-16) * 3) var(--ds-space-16)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithForm: Story = {
  args: { title: 'Rename page' },
  render: (args) => (
    <Popover {...args}>
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <Input label="Title" defaultValue="Roadmap 2025" size="sm" />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--ds-space-2)' }}>
          <Button size="sm" variant="secondary">Cancel</Button>
          <Button size="sm">Save</Button>
        </div>
      </div>
    </Popover>
  ),
};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', flexWrap: 'wrap' }}>
      {(['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const).map((placement) => (
        <Popover key={placement} {...args} placement={placement} trigger={<Button variant="secondary">{placement}</Button>} />
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
        <Popover {...args} open={open} onOpenChange={setOpen}>
          <p style={{ margin: 0 }}>This popover is controlled from outside.</p>
          <Button size="sm" variant="soft" onClick={() => setOpen(false)} style={{ marginTop: 'var(--ds-space-3)' }}>
            Done
          </Button>
        </Popover>
        <span style={{ color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>{open ? 'Open' : 'Closed'}</span>
      </div>
    );
  },
};

export const WithoutTitle: Story = {
  args: { title: undefined, 'aria-label': 'Page details' },
};
