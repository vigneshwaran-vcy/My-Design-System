import { Button, Input, Popover } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function PopoverDocs() {
  const [open, setOpen] = useState(false);

  return (
    <DocSection id="popover" eyebrow="Components" title="Popover" description="A non-modal dialog anchored to its trigger, for small forms, details and confirmations that should not take over the page. For menus of actions use Menu; for blocking flows use Modal.">
      <CodeBlock label="Popover import" code={`import { Popover } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Basic"
          code={`<Popover trigger={<Button variant="secondary">Share</Button>} title="Share this page">
  Anyone with the link can view. Only editors can change permissions.
</Popover>`}
        >
          <Popover trigger={<Button variant="secondary">Share</Button>} title="Share this page">
            Anyone with the link can view. Only editors can change permissions.
          </Popover>
        </Example>

        <Example
          title="With a form — focus moves to the first field"
          code={`<Popover trigger={<Button variant="secondary">Rename</Button>} title="Rename page">
  <Input label="Title" size="sm" defaultValue="Roadmap 2025" />
  <Button size="sm">Save</Button>
</Popover>`}
        >
          <Popover trigger={<Button variant="secondary">Rename</Button>} title="Rename page">
            <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
              <Input label="Title" size="sm" defaultValue="Roadmap 2025" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--ds-space-2)' }}>
                <Button size="sm" variant="secondary">Cancel</Button>
                <Button size="sm">Save</Button>
              </div>
            </div>
          </Popover>
        </Example>

        <Example
          title="Placements"
          code={`<Popover placement="bottom-start" … />
<Popover placement="bottom-end" … />
<Popover placement="top-start" … />
<Popover placement="top-end" … />`}
        >
          {(['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const).map((placement) => (
            <Popover key={placement} placement={placement} title={placement} trigger={<Button variant="secondary">{placement}</Button>}>
              The panel grows from this corner of the trigger.
            </Popover>
          ))}
        </Example>

        <Example
          title="Controlled"
          code={`const [open, setOpen] = useState(false);
<Popover open={open} onOpenChange={setOpen} trigger={<Button>Details</Button>} title="Details">
  <Button size="sm" onClick={() => setOpen(false)}>Done</Button>
</Popover>`}
        >
          <Popover open={open} onOpenChange={setOpen} trigger={<Button variant="secondary">Details</Button>} title="Details">
            <p style={{ margin: '0 0 var(--ds-space-3)' }}>Closing from inside returns focus to the trigger.</p>
            <Button size="sm" variant="soft" onClick={() => setOpen(false)}>Done</Button>
          </Popover>
          <span style={{ color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>{open ? 'Open' : 'Closed'}</span>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Popover props (rest props, className and ref go to the role=&quot;dialog&quot; panel)"
          rows={[
            { name: 'trigger', type: 'ReactElement', description: 'Cloned with aria-haspopup="dialog", aria-expanded, aria-controls and a toggling onClick (its own onClick still runs).' },
            { name: 'open', type: 'boolean', description: 'Controlled open state.' },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires on every open/close, including Escape and outside clicks.' },
            { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Corner of the trigger the panel grows from (space-2 away, layer-dropdown).' },
            { name: 'title', type: 'ReactNode', description: 'Heading inside the panel; also labels the dialog. Without it, pass aria-label.' },
            { name: 'children', type: 'ReactNode', description: 'Panel content (space-4 padding, radius-lg, shadow-overlay).' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Panel is role="dialog" labelled by its title (or your aria-label); trigger exposes aria-haspopup, aria-expanded and aria-controls.',
            'On open, focus moves to the first focusable element in the panel, or the panel itself.',
            'Escape closes and returns focus to the trigger; clicking outside closes without stealing focus from what you clicked.',
            'Non-modal: the rest of the page stays interactive. Use Modal when the user must respond.',
            'Solid surface with a ring edge; a transparent border keeps an outline in forced-colors mode.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
