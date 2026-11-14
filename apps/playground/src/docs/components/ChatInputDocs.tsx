import { Button, ChatInput, Icon } from '@my-ds/ui';
import { useEffect, useRef, useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

/** Small fake chat so the send → generating → stop cycle can be tried live. */
function ChatDemo() {
  const [messages, setMessages] = useState<Array<{ from: 'you' | 'bot'; text: string }>>([]);
  const [generating, setGenerating] = useState(false);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const send = (text: string) => {
    setMessages((m) => [...m, { from: 'you', text }]);
    setGenerating(true);
    timer.current = window.setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: `You said “${text}”.` }]);
      setGenerating(false);
    }, 2000);
  };

  const stop = () => {
    window.clearTimeout(timer.current);
    setMessages((m) => [...m, { from: 'bot', text: '(stopped)' }]);
    setGenerating(false);
  };

  return (
    <div className="doc-chat">
      <ol className="doc-chat__log" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 && <li className="doc-muted">Send a message — Enter sends, Shift + Enter adds a line.</li>}
        {messages.map((m, i) => (
          <li key={i} className={`doc-chat__msg doc-chat__msg--${m.from}`}>{m.text}</li>
        ))}
      </ol>
      <ChatInput
        onSubmit={send}
        generating={generating}
        onStop={stop}
        hint="Replies are simulated. Press Stop while it's generating."
        actions={<Button variant="ghost" size="sm" leadingIcon={<Icon name="add" />}>Attach</Button>}
      />
    </div>
  );
}

export function ChatInputDocs() {
  const [draft, setDraft] = useState('');

  return (
    <DocSection id="chat-input" eyebrow="Components" title="ChatInput" description="Multi-line message composer for chat and AI prompts. Grows with its content, sends on Enter, and turns its send button into a stop button while a reply is generating.">
      <CodeBlock label="ChatInput import" code={`import { ChatInput } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Send, generate, stop"
          code={`<ChatInput
  onSubmit={(message) => send(message)}
  generating={isGenerating}
  onStop={cancel}
  hint="Replies are simulated."
  actions={<Button variant="ghost" size="sm" leadingIcon={<Icon name="add" />}>Attach</Button>}
/>`}
        >
          <ChatDemo />
        </Example>

        <Example title="Controlled with character count" code={`<ChatInput
  label="Feedback"
  hideLabel={false}
  value={draft}
  onChange={(e) => setDraft(e.target.value)}
  onSubmit={() => setDraft('')}
  maxLength={200}
  showCount
  maxRows={4}
/>`}>
          <div className="doc-stack">
            <ChatInput
              label="Feedback"
              hideLabel={false}
              placeholder="What could be better?"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onSubmit={() => setDraft('')}
              maxLength={200}
              showCount
              maxRows={4}
            />
          </div>
        </Example>

        <Example title="Variants" code={`<ChatInput variant="outline" />
<ChatInput variant="filled" />`}>
          <div className="doc-stack">
            <ChatInput label="Outline" placeholder="Outline (default)" />
            <ChatInput label="Filled" variant="filled" placeholder="Filled" />
          </div>
        </Example>

        <Example title="Sizes" code={`<ChatInput size="sm" />
<ChatInput size="md" />
<ChatInput size="lg" />`}>
          <div className="doc-stack">
            <ChatInput label="Small" size="sm" placeholder="Small" />
            <ChatInput label="Medium" size="md" placeholder="Medium" />
            <ChatInput label="Large" size="lg" placeholder="Large" />
          </div>
        </Example>

        <Example title="Error & disabled" code={`<ChatInput error="You've reached today's message limit." />
<ChatInput disabled placeholder="Chat is read-only" />`}>
          <div className="doc-stack">
            <ChatInput label="Message" defaultValue="One more question…" error="You've reached today's message limit." />
            <ChatInput label="Message" disabled placeholder="Chat is read-only" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="ChatInput props (plus native <textarea> attributes)"
          rows={[
            { name: 'onSubmit', type: '(message: string) => void', description: 'Called with the trimmed text on Enter or send click. Uncontrolled inputs clear afterwards.' },
            { name: 'generating', type: 'boolean', default: 'false', description: 'Swaps send for a stop button and blocks submitting.' },
            { name: 'onStop', type: '() => void', description: 'Stop button handler. Without it the stop button is disabled.' },
            { name: 'actions', type: 'ReactNode', description: 'Extra controls on the left of the toolbar (attach, model picker…).' },
            { name: 'value / defaultValue', type: 'string', default: "''", description: 'Controlled or uncontrolled text.' },
            { name: 'label', type: 'ReactNode', default: "'Message'", description: 'Accessible name.' },
            { name: 'hideLabel', type: 'boolean', default: 'true', description: 'Label is screen-reader only unless set to false.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text below the box.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid and announces the message.' },
            { name: 'maxRows', type: 'number', default: '8', description: 'Grows up to this many rows, then scrolls.' },
            { name: 'maxLength + showCount', type: 'number + boolean', default: 'false', description: 'Shows a live “n/max” counter.' },
            { name: 'sendLabel / stopLabel', type: 'string', default: "'Send message' / 'Stop generating'", description: 'Accessible names for the icon buttons.' },
            { name: 'placeholder', type: 'string', default: "'Ask anything…'", description: 'Placeholder text.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Text size and padding.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Enter sends, Shift + Enter inserts a newline, and nothing is sent mid IME composition.',
            'Send and stop are icon buttons with aria-label (sendLabel / stopLabel); send is disabled while the text is empty.',
            'Rendered inside a <form>, so assistive tech treats it as a form; hint and error are linked via aria-describedby.',
            'The character counter is aria-live="polite". Keep the label meaningful even when it is visually hidden.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
