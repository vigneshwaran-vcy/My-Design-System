import { Accordion, AccordionItem } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const Items = () => (
  <>
    <AccordionItem value="billing" title="Billing and invoices" icon="wallet">
      Invoices are issued on the first of each month and sent to the billing contact.
    </AccordionItem>
    <AccordionItem value="members" title="Team members" icon="users-group-rounded" meta="12">
      Invite people by email; they join with the Viewer role until you change it.
    </AccordionItem>
    <AccordionItem value="security" title="Security" icon="shield-check">
      Require two-step verification and set session length for everyone in the workspace.
    </AccordionItem>
    <AccordionItem value="archive" title="Archived projects" icon="folder" disabled>
      Archived projects are read-only.
    </AccordionItem>
  </>
);

export function AccordionDocs() {
  return (
    <DocSection
      id="accordion"
      eyebrow="Components"
      title="Accordion"
      description="Stacked headers that show and hide sections of content. Use it to shorten long pages such as settings or FAQs; keep the header text short so the list scans."
    >
      <CodeBlock label="Accordion import" code={`import { Accordion, AccordionItem } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Default (single)"
          code={`<Accordion defaultValue={['billing']}>
  <AccordionItem value="billing" title="Billing and invoices" icon="wallet">…</AccordionItem>
  <AccordionItem value="members" title="Team members" icon="users-group-rounded" meta="12">…</AccordionItem>
  <AccordionItem value="security" title="Security" icon="shield-check">…</AccordionItem>
  <AccordionItem value="archive" title="Archived projects" icon="folder" disabled>…</AccordionItem>
</Accordion>`}
        >
          <div style={{ width: '100%', maxWidth: 'var(--ds-size-panel-xl)' }}>
            <Accordion defaultValue={['billing']}>
              <Items />
            </Accordion>
          </div>
        </Example>

        <Example title="Framed" code={`<Accordion variant="framed" defaultValue={['members']}>…</Accordion>`}>
          <div style={{ width: '100%', maxWidth: 'var(--ds-size-panel-xl)' }}>
            <Accordion variant="framed" defaultValue={['members']}>
              <Items />
            </Accordion>
          </div>
        </Example>

        <Example title="Multiple, small" code={`<Accordion type="multiple" size="sm" defaultValue={['billing', 'security']}>…</Accordion>`}>
          <div style={{ width: '100%', maxWidth: 'var(--ds-size-panel-xl)' }}>
            <Accordion type="multiple" size="sm" defaultValue={['billing', 'security']}>
              <Items />
            </Accordion>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Accordion props (plus native <div> attributes)"
          rows={[
            { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'Single keeps at most one item open; multiple lets any number stay open.' },
            { name: 'value', type: 'string[]', description: 'Controlled open item values.' },
            { name: 'defaultValue', type: 'string[]', default: '[]', description: 'Initially open items (uncontrolled).' },
            { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called with the new open values.' },
            { name: 'collapsible', type: 'boolean', default: 'true', description: 'Single mode: whether the open item can be closed, leaving none open.' },
            { name: 'variant', type: "'default' | 'framed'", default: "'default'", description: 'Hairline dividers, or inset surfaces in a tinted frame.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Header height 32 / 40 and text size.' },
            { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '3', description: 'Heading element wrapping each trigger; match the page outline.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every item.' },
          ]}
        />
        <PropsTable
          caption="AccordionItem props (plus native <div> attributes)"
          rows={[
            { name: 'value', type: 'string', description: 'Unique id of the item.' },
            { name: 'title', type: 'ReactNode', description: 'Header text.' },
            { name: 'icon', type: 'IconName | ReactNode', description: 'Decorative leading icon.' },
            { name: 'meta', type: 'ReactNode', description: 'Trailing summary, e.g. a count.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Item cannot be toggled.' },
            { name: 'children', type: 'ReactNode', description: 'Panel content.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Each header is a native <button> inside a heading, with aria-expanded and aria-controls pointing at its panel.',
            'Panels are role="region" labelled by their header; closed panels are hidden, so their content is out of the tab order.',
            'Enter or Space toggles; Up/Down move between headers (wrapping), Home/End jump to the first/last. Disabled headers are skipped.',
            'Icons and the chevron are aria-hidden. The chevron rotates and the panel height animates, both disabled under prefers-reduced-motion.',
            'Soft focus ring (1px focus border + shadow-focus) on :focus-visible only.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
