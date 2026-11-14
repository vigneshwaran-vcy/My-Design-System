import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal, type ModalProps } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    open: false,
    onClose: () => {},
    title: 'Delete project?',
    description: 'This permanently removes "Roadmap 2025" and all of its pages. This cannot be undone.',
    size: 'md',
    dismissible: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    open: { control: false },
    onClose: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Wraps the modal in a button that opens it, so stories stay interactive. */
function Demo(args: ModalProps & { label?: string }) {
  const { label = 'Open modal', ...rest } = args;
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{label}</Button>
      <Modal
        {...rest}
        open={open}
        onClose={() => setOpen(false)}
        footer={
          rest.footer ?? (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
            </>
          )
        }
      />
    </>
  );
}

export const Playground: Story = { render: (args) => <Demo {...args} /> };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      <Demo {...args} size="sm" label="Small" title="Small modal" />
      <Demo {...args} size="md" label="Medium" title="Medium modal" />
      <Demo {...args} size="lg" label="Large" title="Large modal" />
    </div>
  ),
};

export const WithForm: Story = {
  args: { title: 'Invite a teammate', description: 'They will get an email with a link to join this workspace.' },
  render: (args) => (
    <Demo
      {...args}
      label="Invite"
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button>Send invite</Button>
        </>
      }
    >
      <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
        <Input label="Email" type="email" placeholder="name@company.com" />
        <Input label="Message" placeholder="Optional note" />
      </div>
    </Demo>
  ),
};

export const NotDismissible: Story = {
  args: {
    dismissible: false,
    title: 'Accept the updated terms',
    description: 'You need to accept the new terms of service before continuing.',
  },
  render: (args) => (
    <Demo {...args} label="Show terms" footer={<Button>Accept and continue</Button>}>
      <p style={{ margin: 0 }}>Escape and clicking the scrim do nothing here; the footer action is the only way out.</p>
    </Demo>
  ),
};

export const LongContent: Story = {
  args: { title: 'Release notes', description: 'Everything that shipped this month.' },
  render: (args) => (
    <Demo {...args} label="Release notes" footer={<Button>Got it</Button>}>
      {Array.from({ length: 12 }, (_, i) => (
        <p key={i} style={{ margin: '0 0 var(--ds-space-3)' }}>
          Update {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      ))}
    </Demo>
  ),
};
