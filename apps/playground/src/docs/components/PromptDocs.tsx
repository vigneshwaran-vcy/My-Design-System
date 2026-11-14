import { Button, Prompt, type PromptVariant } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const COPY: Record<PromptVariant, { title: string; description: string; confirm: string; cancel?: string }> = {
  info: { title: 'New version available', description: 'Reload to get the latest features.', confirm: 'Reload', cancel: 'Later' },
  warn: { title: 'Unsaved changes', description: 'You have unsaved changes on this record. Leave without saving?', confirm: 'Leave', cancel: 'Stay' },
  danger: { title: 'Delete 3 records?', description: "This can't be undone.", confirm: 'Delete', cancel: 'Cancel' },
  success: { title: 'Import complete', description: '1,204 contacts were added.', confirm: 'Done' },
};

export function PromptDocs() {
  const [open, setOpen] = useState<PromptVariant | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [answer, setAnswer] = useState('none');
  const copy = open ? COPY[open] : null;

  const close = (result: string) => {
    setAnswer(result);
    setOpen(null);
  };

  return (
    <DocSection
      id="prompt"
      eyebrow="Components"
      title="Prompt"
      description="A system message that interrupts the user and needs an answer: confirm a destructive action, warn about unsaved changes, report a blocking error. Built on Modal as an alert dialog with a coloured header band."
    >
      <CodeBlock label="Prompt import" code={`import { Prompt } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants"
          code={`<Prompt
  open={open}
  variant="danger"
  title="Delete 3 records?"
  description="This can't be undone."
  confirmLabel="Delete"
  onConfirm={remove}
  onCancel={() => setOpen(false)}
/>`}
        >
          {(['info', 'warn', 'danger', 'success'] as const).map((variant) => (
            <Button key={variant} variant={variant === 'danger' ? 'danger' : 'secondary'} onClick={() => setOpen(variant)}>
              Open {variant}
            </Button>
          ))}
          <span className="doc-muted">Last answer: {answer}</span>
          {copy && open && (
            <Prompt
              open
              variant={open}
              title={copy.title}
              description={copy.description}
              confirmLabel={copy.confirm}
              cancelLabel={copy.cancel}
              onConfirm={() => close(copy.confirm)}
              onCancel={copy.cancel ? () => close(copy.cancel ?? 'cancel') : undefined}
              onClose={() => close('dismissed')}
            />
          )}
        </Example>

        <Example
          title="Medium size, dismissible, with body"
          code={`<Prompt open={open} size="md" dismissible variant="info" title="Scheduled maintenance" onClose={close}>
  <p>…</p>
</Prompt>`}
        >
          <Button variant="secondary" onClick={() => setSizeOpen(true)}>Open medium prompt</Button>
          <Prompt
            open={sizeOpen}
            size="md"
            dismissible
            variant="info"
            title="Scheduled maintenance"
            description="Saturday 02:00–04:00 UTC."
            confirmLabel="Got it"
            onClose={() => setSizeOpen(false)}
          >
            <p className="doc-body">Records can be viewed but not edited during the window. Save your work before it starts.</p>
          </Prompt>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Prompt props (plus native div attributes, applied to the dialog panel)"
          rows={[
            { name: 'open', type: 'boolean', description: 'Shows the prompt.' },
            { name: 'title', type: 'ReactNode', description: 'Heading; the alert dialog accessible name.' },
            { name: 'description', type: 'ReactNode', description: 'Short message; the accessible description.' },
            { name: 'variant', type: "'info' | 'warn' | 'danger' | 'success'", default: "'warn'", description: 'Header band colour and status icon. danger also makes the confirm button a Delete button.' },
            { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: '384 / 512 max width.' },
            { name: 'confirmLabel / onConfirm', type: 'string / () => void', default: "'OK'", description: 'Built-in confirm button (falls back to onClose).' },
            { name: 'cancelLabel / onCancel', type: 'string / () => void', default: "'Cancel'", description: 'Built-in cancel button, shown when onCancel is set; Escape calls it.' },
            { name: 'onClose', type: '() => void', description: 'Escape / close button / scrim. Defaults to onCancel.' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Adds the close button and lets the scrim close it.' },
            { name: 'footer', type: 'ReactNode', description: 'Replaces the built-in buttons.' },
            { name: 'children', type: 'ReactNode', description: 'Extra body content.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="alertdialog" with aria-modal, aria-labelledby (title) and aria-describedby (description), so the message is read on open.',
            'Focus moves to the first footer button — Cancel when present — so Enter never confirms a destructive action by accident.',
            'Tab and Shift+Tab are trapped in the prompt; focus returns to the opener when it closes; body scroll is locked.',
            'Escape answers with onCancel/onClose even when not dismissible; the scrim and close button only dismiss when `dismissible`.',
            'The status icon is decorative; the variant is conveyed by the title and description, not colour alone.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
