import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { ToastProvider, useToast, type ToastVariant } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { position: 'bottom-right', duration: 5000 },
  argTypes: {
    position: { control: 'inline-radio', options: ['bottom-right', 'top-right', 'bottom-center'] },
    duration: { control: 'number' },
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Triggers() {
  const { toast, dismissAll } = useToast();
  const variants: ToastVariant[] = ['neutral', 'info', 'success', 'warn', 'danger'];
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
      {variants.map((variant) => (
        <Button
          key={variant}
          variant="secondary"
          onClick={() =>
            toast({
              variant,
              title: `${variant[0].toUpperCase()}${variant.slice(1)} toast`,
              description: 'Something happened that you might want to know about.',
            })
          }
        >
          {variant}
        </Button>
      ))}
      <Button
        variant="soft"
        onClick={() =>
          toast({
            variant: 'success',
            title: 'Page archived',
            description: 'You can restore it from the archive at any time.',
            action: { label: 'Undo', onClick: () => toast({ title: 'Restored', variant: 'info', duration: 2000 }) },
          })
        }
      >
        With action
      </Button>
      <Button variant="soft" onClick={() => toast({ title: 'Sticky until dismissed', description: 'duration: 0', duration: 0 })}>
        Sticky
      </Button>
      <Button variant="ghost" onClick={dismissAll}>Dismiss all</Button>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <Triggers />
    </ToastProvider>
  ),
};

export const TopRight: Story = {
  args: { position: 'top-right' },
  render: (args) => (
    <ToastProvider {...args}>
      <Triggers />
    </ToastProvider>
  ),
};

export const BottomCenter: Story = {
  args: { position: 'bottom-center' },
  render: (args) => (
    <ToastProvider {...args}>
      <Triggers />
    </ToastProvider>
  ),
};
