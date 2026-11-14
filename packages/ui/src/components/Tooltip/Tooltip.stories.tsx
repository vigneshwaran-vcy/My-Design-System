import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Copy link to clipboard',
    placement: 'top',
    delay: 300,
    children: <Button variant="secondary">Hover or focus me</Button>,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] },
    delay: { control: 'number' },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--ds-space-16)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Hover or focus me</Button>
    </Tooltip>
  ),
};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-4)', flexWrap: 'wrap' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <Tooltip key={placement} {...args} placement={placement} content={`Placement: ${placement}`}>
          <Button variant="secondary">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const NoDelay: Story = {
  args: { delay: 0 },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="secondary">Instant</Button>
    </Tooltip>
  ),
};

/** Disabled buttons fire no mouse or focus events, so wrap them in a focusable span. */
export const DisabledChild: Story = {
  args: { content: 'You need edit access to publish' },
  render: (args) => (
    <Tooltip {...args}>
      <span tabIndex={0} style={{ display: 'inline-flex', borderRadius: 'var(--ds-radius-md)' }}>
        <Button disabled>Publish</Button>
      </span>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  args: { content: 'Shortcuts are only active while the editor has focus. Press ? to see the full list of shortcuts.' },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="ghost" aria-label="Keyboard shortcuts">?</Button>
    </Tooltip>
  ),
};
