import { ChatInput, ChatInputAction, Menu, type ChatInputAttachment } from '@my-ds/ui';
import { useEffect, useRef, useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const MODELS = [
  { id: 'fable', label: 'Fable 5' },
  { id: 'opus', label: 'Opus 5.5' },
  { id: 'haiku', label: 'Haiku 5.5' },
];

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** A small fake chat: attach or drop files, toggle tools, pick a model, send, stop. */
function ChatDemo() {
  const [messages, setMessages] = useState<Array<{ from: 'you' | 'bot'; text: string }>>([]);
  const [generating, setGenerating] = useState(false);
  const [files, setFiles] = useState<ChatInputAttachment[]>([]);
  const [search, setSearch] = useState(false);
  const [think, setThink] = useState(false);
  const [listening, setListening] = useState(false);
  const [model, setModel] = useState(MODELS[0]);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const attach = (picked: File[]) => {
    const added = picked.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      name: file.name,
      meta: `${file.type.split('/')[1]?.toUpperCase() || 'File'} · ${formatSize(file.size)}`,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      status: 'uploading' as const,
    }));
    setFiles((current) => [...current, ...added]);
    // Simulate the upload finishing.
    window.setTimeout(() => {
      setFiles((current) => current.map((f) => (added.some((a) => a.id === f.id) ? { ...f, status: 'ready' } : f)));
    }, 1200);
  };

  const send = (text: string) => {
    const names = files.map((f) => f.name).join(', ');
    setMessages((m) => [...m, { from: 'you', text: [text, names && `📎 ${names}`].filter(Boolean).join(' ') }]);
    setFiles([]);
    setGenerating(true);
    timer.current = window.setTimeout(() => {
      const mode = [search && 'searched the web', think && 'thought it through'].filter(Boolean).join(' and ');
      setMessages((m) => [...m, { from: 'bot', text: `${model.label}${mode ? ` ${mode} and` : ''} replied to “${text || 'your files'}”.` }]);
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
        {messages.length === 0 && (
          <li className="doc-muted">Type, attach or drop a file, then press Enter. Shift + Enter adds a line.</li>
        )}
        {messages.map((m, i) => (
          <li key={i} className={`doc-chat__msg doc-chat__msg--${m.from}`}>{m.text}</li>
        ))}
      </ol>
      <ChatInput
        onSubmit={send}
        generating={generating}
        onStop={stop}
        onAttachFiles={attach}
        attachments={files}
        onRemoveAttachment={(id) => setFiles((current) => current.filter((f) => f.id !== id))}
        onVoice={() => setListening((on) => !on)}
        listening={listening}
        hint="Replies are simulated. Drop a file on the box, or paste an image."
        actions={
          <>
            <ChatInputAction icon="global" label="Search" showLabel selected={search} onClick={() => setSearch(!search)} />
            <ChatInputAction icon="lightbulb" label="Think" showLabel selected={think} onClick={() => setThink(!think)} />
            <Menu
              trigger={<ChatInputAction icon="stars" label={model.label} showLabel menu />}
              items={MODELS.map((m) => ({ id: m.id, label: m.label }))}
              onSelect={(id) => setModel(MODELS.find((m) => m.id === id) ?? MODELS[0])}
            />
          </>
        }
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
          title="Composer with attachments, tools and a model picker"
          code={`<ChatInput
  onSubmit={send}
  generating={isGenerating}
  onStop={cancel}
  onAttachFiles={upload}                 // attach button + drag-and-drop + paste
  attachments={files}                    // [{ id, name, meta, previewUrl, status }]
  onRemoveAttachment={removeFile}
  onVoice={toggleDictation}
  listening={isDictating}
  actions={
    <>
      <ChatInputAction icon="global" label="Search" showLabel selected={search} onClick={toggleSearch} />
      <ChatInputAction icon="lightbulb" label="Think" showLabel selected={think} onClick={toggleThink} />
      <Menu trigger={<ChatInputAction icon="stars" label="Fable 5" showLabel menu />} items={models} />
    </>
  }
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

        <Example
          title="Attachment states"
          code={`<ChatInput
  attachments={[
    { id: '1', name: 'Q1 plan.pdf', meta: 'PDF · 2.4 MB' },
    { id: '2', name: 'Research.zip', status: 'uploading' },
    { id: '3', name: 'Huge video.mov', meta: 'Over the 50 MB limit', status: 'error' },
  ]}
  onRemoveAttachment={remove}
/>`}
        >
          <div className="doc-stack">
            <ChatInput
              label="Message with attachments"
              defaultValue="Summarise these for the team"
              attachments={[
                { id: '1', name: 'Q1 plan.pdf', meta: 'PDF · 2.4 MB' },
                { id: '2', name: 'Research.zip', status: 'uploading' },
                { id: '3', name: 'Huge video.mov', meta: 'Over the 50 MB limit', status: 'error' },
              ]}
              onRemoveAttachment={() => {}}
              onAttachFiles={() => {}}
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
            { name: 'actions', type: 'ReactNode', description: 'Tools after the attach button: ChatInputAction toggles, a model picker Menu…' },
            { name: 'onAttachFiles', type: '(files: File[]) => void', description: 'Adds a round attach button and accepts dropped or pasted files.' },
            { name: 'accept', type: 'string', description: 'File types for the picker, e.g. "image/*,.pdf".' },
            { name: 'attachments', type: 'ChatInputAttachment[]', description: 'Chips above the text: { id, name, meta?, previewUrl?, status?: ready | uploading | error }.' },
            { name: 'onRemoveAttachment', type: '(id: string) => void', description: 'Shows a remove button on each chip.' },
            { name: 'onVoice / listening', type: '() => void / boolean', description: 'Adds a microphone toggle before send; listening shows it pressed.' },
            { name: 'value / defaultValue', type: 'string', default: "''", description: 'Controlled or uncontrolled text.' },
            { name: 'label', type: 'ReactNode', default: "'Message'", description: 'Accessible name.' },
            { name: 'hideLabel', type: 'boolean', default: 'true', description: 'Label is screen-reader only unless set to false.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text below the box.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid and announces the message.' },
            { name: 'maxRows', type: 'number', default: '8', description: 'Grows up to this many rows, then scrolls.' },
            { name: 'maxLength + showCount', type: 'number + boolean', default: 'false', description: 'Shows a live “n/max” counter.' },
            { name: 'attachLabel / voiceLabel', type: 'string', default: "'Attach files' / 'Dictate'", description: 'Accessible names for the attach and voice buttons.' },
            { name: 'sendLabel / stopLabel', type: 'string', default: "'Send message' / 'Stop generating'", description: 'Accessible names for the icon buttons.' },
            { name: 'placeholder', type: 'string', default: "'Ask anything…'", description: 'Placeholder text.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Text size and padding.' },
          ]}
        />
        <PropsTable
          caption="ChatInputAction props (plus native <button> attributes)"
          rows={[
            { name: 'icon', type: 'IconName', description: 'Solar icon.' },
            { name: 'label', type: 'string', description: 'Accessible name; visible text when showLabel is set.' },
            { name: 'showLabel', type: 'boolean', default: 'false', description: 'Pill with icon + text instead of a round icon button.' },
            { name: 'selected', type: 'boolean', description: 'Makes it a toggle (aria-pressed) with the tinted on state.' },
            { name: 'menu', type: 'boolean', default: 'false', description: 'Trailing chevron, for a Menu trigger such as a model picker.' },
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
            'Attach, voice and tool buttons are real buttons with names; toggles use aria-pressed. Clicking them never moves focus into the text.',
            'Attachments are a labelled list; each remove button is named "Remove <file>" and stays reachable by keyboard.',
            'Send is disabled while a file is still uploading; a file alone (no text) can be sent.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
