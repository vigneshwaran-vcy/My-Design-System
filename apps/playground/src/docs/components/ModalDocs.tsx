import { Button, Input, Modal, type ModalSize } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function ModalDocs() {
  const [confirm, setConfirm] = useState(false);
  const [size, setSize] = useState<ModalSize | null>(null);
  const [invite, setInvite] = useState(false);
  const [terms, setTerms] = useState(false);

  return (
    <DocSection id="modal" eyebrow="Components" title="Modal" description="A blocking dialog rendered in a portal over a scrim. Use it for confirmations and short focused tasks; keep anything longer on its own page.">
      <CodeBlock label="Modal import" code={`import { Modal } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Confirmation"
          code={`const [open, setOpen] = useState(false);
<Button variant="danger" onClick={() => setOpen(true)}>Delete project</Button>
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This permanently removes the project and all of its pages."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
  </>}
/>`}
        >
          <Button variant="danger" onClick={() => setConfirm(true)}>Delete project</Button>
          <Modal
            open={confirm}
            onClose={() => setConfirm(false)}
            title="Delete project?"
            description='This permanently removes "Roadmap 2025" and all of its pages. This cannot be undone.'
            footer={
              <>
                <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
                <Button variant="danger" onClick={() => setConfirm(false)}>Delete</Button>
              </>
            }
          />
        </Example>

        <Example
          title="Sizes — sm 384 / md 512 / lg 768"
          code={`<Modal size="sm" … />
<Modal size="md" … />
<Modal size="lg" … />`}
        >
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Button key={s} variant="secondary" onClick={() => setSize(s)}>{s}</Button>
          ))}
          <Modal
            open={size !== null}
            onClose={() => setSize(null)}
            size={size ?? 'md'}
            title={`Size: ${size}`}
            description="Max width is a multiple of space-16; the panel shrinks to fit small viewports."
            footer={<Button onClick={() => setSize(null)}>Close</Button>}
          >
            <p style={{ margin: 0 }}>Body content goes here. Long content scrolls inside the body while the header and footer stay put.</p>
          </Modal>
        </Example>

        <Example
          title="With a form — focus lands on the first field"
          code={`<Modal open={open} onClose={close} title="Invite a teammate" footer={…}>
  <Input label="Email" type="email" />
</Modal>`}
        >
          <Button variant="secondary" onClick={() => setInvite(true)}>Invite</Button>
          <Modal
            open={invite}
            onClose={() => setInvite(false)}
            title="Invite a teammate"
            description="They will get an email with a link to join this workspace."
            footer={
              <>
                <Button variant="ghost" onClick={() => setInvite(false)}>Cancel</Button>
                <Button onClick={() => setInvite(false)}>Send invite</Button>
              </>
            }
          >
            <div style={{ display: 'grid', gap: 'var(--ds-space-4)' }}>
              <Input label="Email" type="email" placeholder="name@company.com" />
              <Input label="Message" placeholder="Optional note" />
            </div>
          </Modal>
        </Example>

        <Example
          title="Not dismissible — only the footer can close it"
          code={`<Modal open={open} onClose={close} dismissible={false} title="Accept the updated terms" footer={<Button onClick={close}>Accept</Button>} />`}
        >
          <Button variant="secondary" onClick={() => setTerms(true)}>Show terms</Button>
          <Modal
            open={terms}
            onClose={() => setTerms(false)}
            dismissible={false}
            title="Accept the updated terms"
            description="Escape and the scrim do nothing here, and there is no close button."
            footer={<Button onClick={() => setTerms(false)}>Accept and continue</Button>}
          />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Modal props (rest props, className and ref go to the role=&quot;dialog&quot; panel)"
          rows={[
            { name: 'open', type: 'boolean', description: 'Whether the modal is shown. Nothing renders while false.' },
            { name: 'onClose', type: '() => void', description: 'Called on Escape, scrim click and the close button. You own the state.' },
            { name: 'title', type: 'ReactNode', description: 'Required heading (h2); also the dialog’s accessible name.' },
            { name: 'description', type: 'ReactNode', description: 'Supporting copy under the title; wired as aria-describedby.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Max width 384 / 512 / 768 (space-16 × 6 / 8 / 12).' },
            { name: 'children', type: 'ReactNode', description: 'Body content; scrolls internally when taller than the viewport.' },
            { name: 'footer', type: 'ReactNode', description: 'Right-aligned actions slot.' },
            { name: 'dismissible', type: 'boolean', default: 'true', description: 'When false: no close button, and Escape / scrim do nothing.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="dialog" aria-modal="true" with aria-labelledby (title) and aria-describedby (description).',
            'Focus moves to the first control in the body or footer on open (falling back to the close button, then the panel) and returns to the opener on close.',
            'Tab and Shift+Tab cycle inside the panel; body scroll is locked while open.',
            'Escape and the scrim close when dismissible; the close button is a ghost Button with aria-label="Close".',
            'Scrim on layer-overlay, panel on layer-modal; both fade in and respect prefers-reduced-motion.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
