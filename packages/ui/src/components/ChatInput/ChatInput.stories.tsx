import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../Icon';
import { useRef, useState } from 'react';
import { Button } from '../Button';
import { ChatInput } from './ChatInput';

const meta = {
  title: 'Components/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  args: { size: 'md', variant: 'outline', placeholder: 'Ask anything…' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'filled'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'calc(var(--ds-space-16) * 10)' }}><Story /></div>],
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { hint: 'Enter to send · Shift + Enter for a new line' },
};

export const Generating: Story = { args: { generating: true, onStop: () => {}, defaultValue: 'Summarise this thread' } };

export const WithActions: Story = {
  args: {
    actions: (
      <>
        <Button variant="ghost" size="sm" leadingIcon={<Icon name="add" />}>Attach</Button>
        <Button variant="ghost" size="sm">Tools</Button>
      </>
    ),
  },
};

export const WithCounter: Story = { args: { maxLength: 280, showCount: true } };

export const WithError: Story = { args: { error: 'Message could not be sent. Try again.', defaultValue: 'Hello' } };

export const Disabled: Story = { args: { disabled: true, placeholder: 'Sign in to chat' } };

export const Filled: Story = { args: { variant: 'filled' } };

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
      <ChatInput {...args} size="sm" />
      <ChatInput {...args} size="md" />
      <ChatInput {...args} size="lg" />
    </div>
  ),
};

/** Simulated round-trip: send a message, watch it "generate", stop it early. */
export const Conversation: Story = {
  render: (args) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [generating, setGenerating] = useState(false);
    const timer = useRef<number>();
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
        <ul style={{ margin: 0, paddingInlineStart: 'var(--ds-space-4)', color: 'var(--ds-color-text)' }}>
          {messages.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        <ChatInput
          {...args}
          generating={generating}
          onSubmit={(m) => {
            setMessages((list) => [...list, m]);
            setGenerating(true);
            timer.current = window.setTimeout(() => setGenerating(false), 2000);
          }}
          onStop={() => {
            window.clearTimeout(timer.current);
            setGenerating(false);
          }}
        />
      </div>
    );
  },
};
