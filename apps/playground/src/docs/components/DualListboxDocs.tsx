import { DualListbox, type DualListboxOption } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const languages: DualListboxOption[] = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean', disabled: true },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ta', label: 'Tamil' },
  { value: 'zh', label: 'Chinese' },
];

const fields: DualListboxOption[] = ['Name', 'Owner', 'Stage', 'Amount', 'Close date', 'Probability', 'Created'].map((f) => ({
  value: f.toLowerCase().replace(' ', '-'),
  label: f,
}));

export function DualListboxDocs() {
  const [value, setValue] = useState<string[]>(['en', 'fr']);

  return (
    <DocSection
      id="dual-listbox"
      eyebrow="Components"
      title="Dual listbox"
      description="Move options between an Available and a Selected list. Both lists are multi-select listboxes; the Selected list can be reordered."
    >
      <CodeBlock label="DualListbox import" code={`import { DualListbox, type DualListboxOption } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled (click, Shift/Ctrl-click, double-click to move)"
          code={`<DualListbox label="Languages" options={languages} value={value} onChange={setValue} />`}
        >
          <DualListbox label="Languages" options={languages} value={value} onChange={setValue} hint={`Selected: ${value.join(', ') || 'none'}`} />
        </Example>

        <Example
          title="Reorderable with custom headings"
          code={`<DualListbox
  label="Columns"
  sourceLabel="Available fields"
  selectedLabel="Visible columns"
  reorderable
  options={fields}
  defaultValue={['name', 'stage', 'amount']}
/>`}
        >
          <DualListbox
            label="Columns"
            sourceLabel="Available fields"
            selectedLabel="Visible columns"
            reorderable
            options={fields}
            defaultValue={['name', 'stage', 'amount']}
            visibleRows={5}
          />
        </Example>

        <Example title="Variants & sizes" code={`<DualListbox variant="filled" … />
<DualListbox size="sm" visibleRows={4} … />`}>
          <div style={{ display: 'grid', gap: 'var(--ds-space-6)', width: '100%' }}>
            <DualListbox label="Filled" variant="filled" options={fields} visibleRows={4} />
            <DualListbox label="Small" size="sm" options={fields} visibleRows={4} />
            <DualListbox label="Large" size="lg" options={fields} visibleRows={3} />
          </div>
        </Example>

        <Example title="States" code={`<DualListbox label="Regions" required error="Select at least one region." … />
<DualListbox label="Locked" disabled … />`}>
          <div style={{ display: 'grid', gap: 'var(--ds-space-6)', width: '100%' }}>
            <DualListbox label="Regions" required error="Select at least one region." options={fields} visibleRows={4} />
            <DualListbox label="Locked" disabled options={fields} defaultValue={['owner']} visibleRows={4} />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="DualListbox props (plus native <div> attributes on the group)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the group.' },
            { name: 'options', type: 'DualListboxOption[]', description: '{ value, label, textValue?, disabled? }' },
            { name: 'value', type: 'string[]', description: 'Controlled Selected list, in order.' },
            { name: 'defaultValue', type: 'string[]', default: '[]', description: 'Initial Selected list when uncontrolled.' },
            { name: 'onChange', type: '(value: string[]) => void', description: 'Called after moving or reordering.' },
            { name: 'sourceLabel / selectedLabel', type: 'string', default: "'Available' / 'Selected'", description: 'List headings (they name the listboxes).' },
            { name: 'reorderable', type: 'boolean', default: 'false', description: 'Move up / down buttons and Alt + ↑ / ↓.' },
            { name: 'visibleRows', type: 'number', default: '6', description: 'Rows shown before the lists scroll.' },
            { name: 'name', type: 'string', description: 'Hidden inputs so the values submit with a form.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Row height 26 / 32 / 40.' },
            { name: 'hint / error / required / disabled', type: '—', description: 'Same as Input; required marks the Selected list.' },
          ]}
        />
      </SubSection>

      <SubSection title="Keyboard">
        <div className="doc-table-wrap">
          <table className="doc-table">
            <caption>Keyboard interaction (in either list)</caption>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['↓ / ↑', 'Move and select only that option'],
                ['Shift + ↓ / ↑', 'Extend the selection'],
                ['Ctrl/⌘ + ↓ / ↑', 'Move without changing the selection'],
                ['Space', 'Toggle the current option (Shift + Space selects a range)'],
                ['Ctrl/⌘ + A', 'Select all'],
                ['Home / End', 'First / last option'],
                ['Enter', 'Move the selection to the other list'],
                ['Alt + ↑ / ↓', 'Selected list, reorderable: move the selection up / down'],
              ].map(([key, action]) => (
                <tr key={key}>
                  <th scope="row"><code>{key}</code></th>
                  <td>{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="group" labelled by the field label; each list is role="listbox" aria-multiselectable, named by its heading.',
            'Focus stays on the listbox; the keyboard cursor is aria-activedescendant and drawn as an inset focus ring.',
            'Move buttons have explicit names (“Move selection to Selected”) and are disabled until something is selected.',
            'Moves and reorders are announced through a polite live region.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
