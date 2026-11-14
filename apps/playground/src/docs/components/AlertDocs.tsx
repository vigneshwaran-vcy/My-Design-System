import { Alert, Button } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const stack = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-3)', width: '100%' } as const;

export function AlertDocs() {
  const [open, setOpen] = useState(true);

  return (
    <DocSection id="alert" eyebrow="Components" title="Alert" description="An inline message tied to a page or section: a tinted flat surface with an icon, optional title, message, action and dismiss button. For transient feedback use a toast instead.">
      <CodeBlock label="Alert import" code={`import { Alert } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants"
          code={`<Alert variant="info" title="New integration available">Connect Slack to get deploy notifications.</Alert>
<Alert variant="success" title="Invoice sent">Invoice #2041 was emailed to billing@acme.com.</Alert>
<Alert variant="warn" title="Approaching plan limit">You have used 92% of your monthly API quota.</Alert>
<Alert variant="danger" title="Payment failed">We could not charge the card ending in 4242.</Alert>
<Alert variant="neutral" title="Tip">Press ⌘K to search across projects.</Alert>`}
        >
          <div style={stack}>
            <Alert variant="info" title="New integration available">Connect Slack to get deploy notifications in a channel.</Alert>
            <Alert variant="success" title="Invoice sent">Invoice #2041 was emailed to billing@acme.com.</Alert>
            <Alert variant="warn" title="Approaching plan limit">You have used 92% of your monthly API quota.</Alert>
            <Alert variant="danger" title="Payment failed">We could not charge the card ending in 4242.</Alert>
            <Alert variant="neutral" title="Tip">Press ⌘K to search across projects.</Alert>
          </div>
        </Example>

        <Example title="Message only" code={`<Alert>Your workspace was moved to the EU region.</Alert>`}>
          <div style={stack}>
            <Alert>Your workspace was moved to the EU region.</Alert>
          </div>
        </Example>

        <Example
          title="With action"
          code={`<Alert variant="warn" title="Approaching plan limit" action={<Button variant="secondary" size="sm">Upgrade</Button>}>
  Upgrade to keep requests flowing after the quota is reached.
</Alert>`}
        >
          <div style={stack}>
            <Alert variant="warn" title="Approaching plan limit" action={<Button variant="secondary" size="sm">Upgrade</Button>}>
              Upgrade to keep requests flowing after the quota is reached.
            </Alert>
          </div>
        </Example>

        <Example
          title="Dismissible"
          code={`const [open, setOpen] = useState(true);
{open && (
  <Alert variant="success" title="Deploy complete" dismissible onDismiss={() => setOpen(false)}>
    v2.14.0 is live in production.
  </Alert>
)}`}
        >
          <div style={stack}>
            {open ? (
              <Alert variant="success" title="Deploy complete" dismissible onDismiss={() => setOpen(false)}>
                v2.14.0 is live in production.
              </Alert>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>Show alert again</Button>
            )}
          </div>
        </Example>

        <Example title="Without icon" code={`<Alert variant="neutral" icon={null}>A quiet note without an icon.</Alert>`}>
          <div style={stack}>
            <Alert variant="neutral" icon={null}>A quiet note without an icon.</Alert>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Alert props (plus native <div> attributes)"
          rows={[
            { name: 'variant', type: "'info' | 'success' | 'warn' | 'danger' | 'neutral'", default: "'info'", description: 'Intent. Sets the tint (bg-*-subtle; info uses bg-accent-subtle) and the icon colour.' },
            { name: 'title', type: 'ReactNode', description: 'Medium-weight heading above the message.' },
            { name: 'children', type: 'ReactNode', description: 'The message body.' },
            { name: 'icon', type: 'ReactNode', description: 'Leading icon. Each variant has a default inline SVG; pass null to hide it.' },
            { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a × button labelled "Dismiss".' },
            { name: 'onDismiss', type: '() => void', description: 'Called when the dismiss button is activated. The parent controls visibility.' },
            { name: 'action', type: 'ReactNode', description: 'Trailing slot, e.g. a secondary or ghost Button.' },
            { name: 'role', type: 'string', default: "'alert' | 'status'", description: 'Defaults to alert for danger/warn and status otherwise; override when needed.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'danger and warn render role="alert" (assertive); info, success and neutral render role="status" (polite).',
            'Icons are aria-hidden; meaning is carried by the title and message, never by colour alone.',
            'The dismiss button is a native <button> with aria-label="Dismiss" and a visible focus ring.',
            'Keep an action inside the alert small (size="sm") so it does not compete with the primary page action.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
