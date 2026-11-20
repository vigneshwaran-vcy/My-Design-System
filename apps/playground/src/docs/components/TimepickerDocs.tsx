import { Timepicker } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function TimepickerDocs() {
  const [value, setValue] = useState<string | null>('09:30');

  return (
    <DocSection
      id="timepicker"
      eyebrow="Components"
      title="Timepicker"
      description="A time field: type any time or pick from a list at a fixed step. Follows the WAI-ARIA editable combobox pattern; the value is a 24-hour &quot;HH:mm&quot; string."
    >
      <CodeBlock label="Timepicker import" code={`import { Timepicker } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled (type “2:07 pm”, “930” or “14:15”; or use ↓)"
          code={`const [value, setValue] = useState<string | null>('09:30');

<Timepicker label="Start time" value={value} onChange={setValue} />`}
        >
          <div className="doc-stack">
            <Timepicker label="Start time" value={value} onChange={setValue} hint={`Value: ${value ?? 'null'}`} />
          </div>
        </Example>

        <Example title="Step, clock and range" code={`<Timepicker label="Every 15 minutes" step={15} />
<Timepicker label="24-hour" hour12={false} />
<Timepicker label="Business hours" min="09:00" max="17:00" step={60} />`}>
          <div className="doc-stack">
            <Timepicker label="Every 15 minutes" step={15} />
            <Timepicker label="24-hour" hour12={false} />
            <Timepicker label="Business hours" min="09:00" max="17:00" step={60} hint="9 AM to 5 PM" />
          </div>
        </Example>

        <Example title="Variants, sizes, error and disabled" code={`<Timepicker label="Small" size="sm" />
<Timepicker label="Filled" variant="filled" />
<Timepicker label="Large" size="lg" />
<Timepicker label="With error" error="Choose a time." />
<Timepicker label="Disabled" disabled defaultValue="14:00" />`}>
          <div className="doc-stack">
            <Timepicker label="Small" size="sm" />
            <Timepicker label="Filled" variant="filled" />
            <Timepicker label="Large" size="lg" />
            <Timepicker label="With error" error="Choose a time." />
            <Timepicker label="Disabled" disabled defaultValue="14:00" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Timepicker props (plus native <input> attributes, applied to the combobox)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Names the field and the list.' },
            { name: 'value', type: 'string | null', description: 'Controlled 24-hour "HH:mm".' },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: 'Initial value when uncontrolled.' },
            { name: 'onChange', type: '(value: string | null) => void', description: 'Called with "HH:mm" or null when cleared.' },
            { name: 'step', type: 'number', default: '30', description: 'Minutes between listed options; typed times may fall between.' },
            { name: 'min / max', type: 'string', description: '"HH:mm" bounds for the list and typed times.' },
            { name: 'hour12', type: 'boolean', description: '12-hour clock. Defaults to the locale (Intl).' },
            { name: 'locale', type: 'string', description: 'Formats option labels.' },
            { name: 'invalidMessage', type: 'ReactNode', default: "'Enter a valid time.'", description: 'Shown when typed text cannot be used.' },
            { name: 'toggleLabel', type: 'string', default: "'Show times'", description: 'Names the clock button.' },
            { name: 'name', type: 'string', description: 'Submits "HH:mm" through a hidden input.' },
            { name: 'hint / error / required / disabled / hideLabel', type: '—', description: 'Same as Input.' },
            { name: 'invalid', type: 'boolean', description: 'Invalid styling without a message.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 26 / 32 / 36.' },
          ]}
        />
      </SubSection>

      <SubSection title="Keyboard">
        <div className="doc-table-wrap">
          <table className="doc-table">
            <caption>Keyboard interaction</caption>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Closed</th>
                <th scope="col">Open</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['↓', 'Open on the selected (or next) time', 'Next option'],
                ['↑', 'Open on the selected (or last) time', 'Previous option'],
                ['Alt + ↓ / Alt + ↑', 'Open without moving', 'Select the active option and close'],
                ['Enter', 'Parse the typed time', 'Select the active option, else parse or take the first match'],
                ['Esc', 'Undo an unsaved edit', 'Close without changing'],
                ['Tab', 'Parse and move focus', 'Select the active option and move focus'],
                ['Typing', 'Opens and filters the list', 'Filters the list'],
              ].map(([key, closed, open]) => (
                <tr key={key}>
                  <th scope="row"><code>{key}</code></th>
                  <td>{closed}</td>
                  <td>{open}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'The input is role="combobox" with aria-autocomplete="list", aria-expanded, aria-controls and aria-activedescendant; focus stays in it.',
            'Options are role="option" with aria-selected; the list is labelled by the field label.',
            'The clock button is outside the tab order (as in the WAI-ARIA combobox example) and keeps focus in the input.',
            'Invalid or out-of-range text sets aria-invalid and announces a message.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
