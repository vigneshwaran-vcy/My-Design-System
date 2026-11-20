import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Menu } from '../Menu';
import { ChatInput, ChatInputAction } from './ChatInput';

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

export const WithTools: Story = {
  render: (args) => {
    const [search, setSearch] = useState(true);
    const [listening, setListening] = useState(false);
    return (
      <ChatInput
        {...args}
        onAttachFiles={() => {}}
        onVoice={() => setListening(!listening)}
        listening={listening}
        actions={
          <>
            <ChatInputAction icon="global" label="Search" showLabel selected={search} onClick={() => setSearch(!search)} />
            <ChatInputAction icon="lightbulb" label="Think" showLabel />
            <Menu
              trigger={<ChatInputAction icon="stars" label="Fable 5" showLabel menu />}
              items={[
                { id: 'fable', label: 'Fable 5' },
                { id: 'opus', label: 'Opus 5.5' },
              ]}
            />
          </>
        }
      />
    );
  },
};

export const WithAttachments: Story = {
  args: {
    defaultValue: 'Summarise these for the team',
    onAttachFiles: () => {},
    onRemoveAttachment: () => {},
    attachments: [
      { id: '1', name: 'Q1 plan.pdf', meta: 'PDF · 2.4 MB' },
      { id: '2', name: 'Research.zip', status: 'uploading' },
      { id: '3', name: 'Huge video.mov', meta: 'Over the 50 MB limit', status: 'error' },
    ],
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
