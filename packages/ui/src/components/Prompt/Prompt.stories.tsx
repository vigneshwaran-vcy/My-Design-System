import type { Meta, StoryObj } from '@storybook/react';
import { useState, type ComponentProps } from 'react';
import { Button } from '../Button';
import { Prompt, type PromptVariant } from './Prompt';

const meta = {
  title: 'Components/Prompt',
  component: Prompt,
  tags: ['autodocs'],
  args: {
    open: true,
    variant: 'warn',
    size: 'sm',
    title: 'Unsaved changes',
    description: 'You have unsaved changes on this record. Leave without saving?',
    confirmLabel: 'Leave',
    cancelLabel: 'Stay',
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'warn', 'danger', 'success'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Prompt>;

export default meta;
type Story = StoryObj<typeof meta>;

function Launcher({ variant, ...args }: Partial<ComponentProps<typeof Prompt>> & { variant: PromptVariant }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant === 'danger' ? 'danger' : 'secondary'} onClick={() => setOpen(true)}>
        Open {variant}
      </Button>
      <Prompt
        title="Prompt"
        {...args}
        variant={variant}
        open={open}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

export const Playground: Story = {
  render: ({ open: _open, ...args }) => <Launcher {...args} variant={args.variant ?? 'warn'} />,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)', flexWrap: 'wrap' }}>
      <Launcher variant="info" title="New version available" description="Reload to get the latest features." confirmLabel="Reload" cancelLabel="Later" />
      <Launcher variant="warn" title="Unsaved changes" description="Leave without saving?" confirmLabel="Leave" cancelLabel="Stay" />
      <Launcher variant="danger" title="Delete 3 records?" description="This can't be undone." confirmLabel="Delete" />
      <Launcher variant="success" title="Import complete" description="1,204 contacts were added." confirmLabel="Done" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      <Launcher variant="info" size="sm" title="Small prompt" description="384 wide." />
      <Launcher variant="info" size="md" title="Medium prompt" description="512 wide, for longer messages." />
    </div>
  ),
};

/** Dismissible prompts add a close button and let the scrim close them. */
export const Dismissible: Story = {
  render: () => <Launcher variant="success" dismissible title="Saved" description="Your changes are live." confirmLabel="OK" />,
};
