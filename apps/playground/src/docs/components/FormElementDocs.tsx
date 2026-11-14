import { Button, FormElement } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function FormElementDocs() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <DocSection
      id="form-element"
      eyebrow="Components"
      title="Form element"
      description="A generic field wrapper: label, required marker, inline help, help text and error around any control. It wires the id and aria-describedby / aria-invalid / aria-required onto the control for you."
    >
      <CodeBlock label="FormElement import" code={`import { FormElement } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Wrapping a native control (cloned)"
          code={`<FormElement label="Account name" hint="Shown on invoices." required>
  <input className="ds-input ds-input--outline ds-input--md" />
</FormElement>`}
        >
          <div className="doc-stack">
            <FormElement label="Account name" hint="Shown on invoices." required>
              <input className="ds-input ds-input--outline ds-input--md" placeholder="Acme Inc." />
            </FormElement>
          </div>
        </Example>

        <Example
          title="Inline help tooltip"
          code={`<FormElement label="Tax ID" inlineHelp="Your VAT or GST registration number.">
  <input className="ds-input ds-input--outline ds-input--md" />
</FormElement>`}
        >
          <div className="doc-stack">
            <FormElement label="Tax ID" inlineHelp="Your VAT or GST registration number.">
              <input className="ds-input ds-input--outline ds-input--md" />
            </FormElement>
          </div>
        </Example>

        <Example
          title="Render prop (spread the wiring where it belongs)"
          code={`<FormElement label="Notes" hint="Optional">
  {(props, { labelId }) => <textarea {...props} className="ds-input ds-input--outline ds-input--md" />}
</FormElement>`}
        >
          <div className="doc-stack">
            <FormElement label="Notes" hint="Optional">
              {(props) => <textarea {...props} rows={3} className="ds-input ds-input--outline ds-input--md" style={{ height: 'auto', paddingBlock: 'var(--ds-space-2)' }} />}
            </FormElement>
          </div>
        </Example>

        <Example
          title="Horizontal layout"
          code={`<FormElement layout="horizontal" label="First name">…</FormElement>
<FormElement layout="horizontal" label="Email" hint="We never share it." required>…</FormElement>`}
        >
          <div className="doc-stack">
            <FormElement layout="horizontal" label="First name">
              <input className="ds-input ds-input--outline ds-input--md" />
            </FormElement>
            <FormElement layout="horizontal" label="Email" hint="We never share it." required>
              <input type="email" className="ds-input ds-input--outline ds-input--md" />
            </FormElement>
          </div>
        </Example>

        <Example
          title="Validation"
          code={`<FormElement label="Company" required error={submitted && !name ? 'Enter a company name.' : undefined}>
  <input value={name} onChange={(e) => setName(e.target.value)} className="ds-input ds-input--outline ds-input--md" />
</FormElement>`}
        >
          <form
            className="doc-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <FormElement label="Company" required error={submitted && !name ? 'Enter a company name.' : undefined}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`ds-input ds-input--outline ds-input--md${submitted && !name ? ' ds-input--invalid' : ''}`}
              />
            </FormElement>
            <div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Example>

        <Example title="Sizes & disabled" code={`<FormElement size="sm" layout="horizontal" … />
<FormElement disabled …><input disabled … /></FormElement>`}>
          <div className="doc-stack">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <FormElement key={size} size={size} layout="horizontal" label={`Size ${size}`}>
                <input className={`ds-input ds-input--outline ds-input--${size}`} />
              </FormElement>
            ))}
            <FormElement label="Locked" disabled>
              <input className="ds-input ds-input--outline ds-input--md" disabled defaultValue="Read only" />
            </FormElement>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="FormElement props (plus native <div> attributes on the wrapper)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Rendered as a <label> pointing at the control.' },
            { name: 'children', type: 'ReactElement | (props, meta) => ReactNode', description: 'The control. An element is cloned with id + aria-*; a function receives them (and labelId) to spread.' },
            { name: 'required', type: 'boolean', default: 'false', description: 'Shows * and sets aria-required on the control.' },
            { name: 'hint', type: 'ReactNode', description: 'Help text, linked via aria-describedby.' },
            { name: 'inlineHelp', type: 'ReactNode', description: 'Tooltip text behind an info button next to the label.' },
            { name: 'inlineHelpLabel', type: 'string', default: "'More information'", description: 'Accessible name of the info button.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid on the control and announces the message.' },
            { name: 'layout', type: "'stacked' | 'horizontal'", default: "'stacked'", description: 'Label above, or in a left column aligned to the first control row.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Label size and the row height the horizontal label aligns to.' },
            { name: 'controlId', type: 'string', description: 'Id for the control. Otherwise the child id or a generated one.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the label (disable the control itself too).' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'The label is a real <label for>, so clicking it focuses the control and it names the control.',
            'Hint and error ids are merged into the control’s existing aria-describedby, never replacing it.',
            'The error paragraph is role="alert"; the control gets aria-invalid="true".',
            'Inline help is a focusable button with a tooltip shown on hover and keyboard focus (Esc hides it).',
            'For non-labelable controls (a div listbox), use the render prop and pass meta.labelId to aria-labelledby.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
