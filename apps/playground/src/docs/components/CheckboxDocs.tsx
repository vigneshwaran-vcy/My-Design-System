import { Checkbox } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function CheckboxDocs() {
  const [items, setItems] = useState([true, false, true]);
  const all = items.every(Boolean);
  const none = items.every((v) => !v);
  const [agreed, setAgreed] = useState(false);

  return (
    <DocSection id="checkbox" eyebrow="Components" title="Checkbox" description="Toggle one option on or off, or pick several from a list. A custom-drawn box over a native checkbox, so forms, keyboards and screen readers all keep working.">
      <CodeBlock label="Checkbox import" code={`import { Checkbox } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Basic" code={`<Checkbox label="Email me product updates" />
<Checkbox label="Remember this device" defaultChecked />`}>
          <div className="doc-stack">
            <Checkbox label="Email me product updates" />
            <Checkbox label="Remember this device" defaultChecked />
          </div>
        </Example>

        <Example title="With description" code={`<Checkbox
  label="Weekly digest"
  description="A summary of activity every Monday morning."
  defaultChecked
/>`}>
          <div className="doc-stack">
            <Checkbox label="Weekly digest" description="A summary of activity every Monday morning." defaultChecked />
          </div>
        </Example>

        <Example
          title="Indeterminate (select all)"
          code={`<Checkbox
  label="Select all"
  checked={all}
  indeterminate={!all && !none}
  onChange={(next) => setItems(items.map(() => next))}
/>`}
        >
          <div className="doc-stack">
            <Checkbox label="Select all" checked={all} indeterminate={!all && !none} onChange={(next) => setItems(items.map(() => next))} />
            <div style={{ display: 'grid', gap: 'var(--ds-space-2)', paddingInlineStart: 'var(--ds-space-6)' }}>
              {items.map((checked, i) => (
                <Checkbox key={i} label={`Item ${i + 1}`} checked={checked} onChange={(next) => setItems(items.map((v, j) => (j === i ? next : v)))} />
              ))}
            </div>
          </div>
        </Example>

        <Example title="Invalid (controlled)" code={`<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={setAgreed}
  error={agreed ? undefined : 'You must accept the terms to continue.'}
/>`}>
          <div className="doc-stack">
            <Checkbox label="I agree to the terms" checked={agreed} onChange={setAgreed} error={agreed ? undefined : 'You must accept the terms to continue.'} />
          </div>
        </Example>

        <Example title="Sizes" code={`<Checkbox size="sm" label="Small" defaultChecked />
<Checkbox size="md" label="Medium" defaultChecked />`}>
          <div className="doc-stack">
            <Checkbox size="sm" label="Small" defaultChecked />
            <Checkbox size="md" label="Medium" defaultChecked />
          </div>
        </Example>

        <Example title="Disabled & hidden label" code={`<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" disabled defaultChecked />
<Checkbox label="Disabled mixed" disabled indeterminate />
<Checkbox label="Select row" hideLabel />`}>
          <div className="doc-stack">
            <Checkbox label="Disabled" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
            <Checkbox label="Disabled mixed" disabled indeterminate />
            <Checkbox label="Select row" hideLabel />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Checkbox props (plus all native <input type=checkbox> attributes except size and type)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Rendered as the <label> tied to the input.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
            { name: 'description', type: 'ReactNode', description: 'Secondary text under the label, linked via aria-describedby.' },
            { name: 'checked', type: 'boolean', description: 'Controlled checked state. Pair with onChange.' },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
            { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Called with the next checked value.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows a dash and sets el.indeterminate plus aria-checked="mixed".' },
            { name: 'invalid', type: 'boolean', default: 'false', description: 'Marks the box invalid without a message.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid, red edge, and announces the message.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Box 14 / 16 (size-checkbox) with xs / sm text.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable.' },
            { name: 'name / value', type: 'string', description: 'Forwarded to the native input for form submission.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'A real <input type="checkbox"> (visually hidden) does the work: Tab to focus, Space to toggle, submits with forms.',
            'The label wraps the box, so clicking either toggles; hideLabel keeps the name for screen readers.',
            'Description and error are referenced by aria-describedby; errors also set aria-invalid and use role="alert".',
            'Indeterminate sets the DOM property and aria-checked="mixed" so assistive tech announces the mixed state.',
            'Focus ring (shadow-focus + border-focus) shows on :focus-visible only; a transparent border keeps an edge in forced-colors mode.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
