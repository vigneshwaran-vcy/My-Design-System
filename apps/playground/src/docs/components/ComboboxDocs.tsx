import { Combobox, type ComboboxOption } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const accounts: ComboboxOption[] = [
  { value: 'acme', label: 'Acme Corporation', description: 'San Francisco' },
  { value: 'globex', label: 'Globex', description: 'Springfield' },
  { value: 'initech', label: 'Initech', description: 'Austin' },
  { value: 'umbrella', label: 'Umbrella Corp', description: 'Raccoon City', disabled: true },
  { value: 'hooli', label: 'Hooli', description: 'Palo Alto' },
  { value: 'stark', label: 'Stark Industries', description: 'New York' },
  { value: 'wayne', label: 'Wayne Enterprises', description: 'Gotham' },
];

const fruits: ComboboxOption[] = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach'].map(
  (f) => ({ value: f.toLowerCase(), label: f }),
);

export function ComboboxDocs() {
  const [account, setAccount] = useState<string | null>('globex');
  const [tags, setTags] = useState<string[]>(['apple', 'mango']);

  return (
    <DocSection
      id="combobox"
      eyebrow="Components"
      title="Combobox"
      description="Type to filter a list and pick one or several options. Follows the WAI-ARIA editable combobox pattern with list autocomplete; multiple selections show as removable chips."
    >
      <CodeBlock label="Combobox import" code={`import { Combobox, type ComboboxOption } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Single select (type to filter, ↓ to open, Enter to pick)"
          code={`<Combobox
  label="Account"
  placeholder="Search accounts…"
  options={accounts}
  value={account}
  onChange={setAccount}
/>`}
        >
          <div className="doc-stack">
            <Combobox
              label="Account"
              placeholder="Search accounts…"
              options={accounts}
              value={account}
              onChange={setAccount}
              hint={`Selected: ${account ?? 'nothing'}`}
            />
          </div>
        </Example>

        <Example
          title="Multiple select with chips"
          code={`<Combobox
  label="Fruits"
  multiple
  options={fruits}
  value={tags}
  onChange={setTags}
/>`}
        >
          <div className="doc-stack">
            <Combobox label="Fruits" multiple options={fruits} value={tags} onChange={setTags} placeholder="Add fruit…" hint={`${tags.length} selected · Backspace removes the last chip`} />
          </div>
        </Example>

        <Example title="No results" code={`<Combobox label="City" options={…} emptyMessage="No cities match." />`}>
          <div className="doc-stack">
            <Combobox label="City" options={[{ value: 'ldn', label: 'London' }, { value: 'par', label: 'Paris' }]} emptyMessage="No cities match." placeholder="Try typing “zz”" />
          </div>
        </Example>

        <Example title="Variants & sizes" code={`<Combobox variant="filled" … />
<Combobox size="sm" … />
<Combobox size="lg" … />`}>
          <div className="doc-stack">
            <Combobox label="Filled" variant="filled" options={fruits} placeholder="Search…" />
            <Combobox label="Small" size="sm" options={fruits} placeholder="Search…" />
            <Combobox label="Large" size="lg" options={fruits} placeholder="Search…" />
            <Combobox label="Small multiple" size="sm" multiple options={fruits} defaultValue={['peach', 'grape']} />
          </div>
        </Example>

        <Example title="States" code={`<Combobox label="Owner" required error="Choose an owner." … />
<Combobox label="Region" disabled defaultValue="…" … />`}>
          <div className="doc-stack">
            <Combobox label="Owner" required error="Choose an owner." options={accounts} />
            <Combobox label="Region" disabled defaultValue="hooli" options={accounts} />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Combobox props (plus native <input> attributes, applied to the text input)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the input and the listbox.' },
            { name: 'options', type: 'ComboboxOption[]', description: '{ value, label: string, description?, disabled? }' },
            { name: 'multiple', type: 'boolean', default: 'false', description: 'Pick several; selected options show as chips.' },
            { name: 'value', type: 'string | null  ·  string[] (multiple)', description: 'Controlled selection.' },
            { name: 'defaultValue', type: 'string | null  ·  string[]', description: 'Initial selection when uncontrolled.' },
            { name: 'onChange', type: '(value: string | null) => void  ·  (value: string[]) => void', description: 'Called when the selection changes.' },
            { name: 'inputValue / defaultInputValue', type: 'string', description: 'Control or seed the typed text.' },
            { name: 'onInputChange', type: '(text: string) => void', description: 'Called as the user types (e.g. to fetch options).' },
            { name: 'filter', type: '(option, query) => boolean', default: 'label contains', description: 'Custom matching.' },
            { name: 'emptyMessage', type: 'ReactNode', default: "'No results'", description: 'Shown when nothing matches.' },
            { name: 'clearable', type: 'boolean', default: 'true', description: 'Shows a clear button when there is a value.' },
            { name: 'name', type: 'string', description: 'Hidden input(s) so the value submits with a form.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Matches Input.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 26 / 32 / 40.' },
            { name: 'hint / error / required / disabled', type: '—', description: 'Same as Input.' },
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
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Typing', 'Filters the list and opens it'],
                ['↓ / ↑', 'Open (on the selection / last option); move the active option, wrapping'],
                ['Alt + ↓', 'Open without moving the active option'],
                ['Alt + ↑', 'Pick the active option and close'],
                ['Enter', 'Pick the active option (multiple: toggles it and keeps the list open)'],
                ['Esc', 'Close and restore the text; when closed, clear the input'],
                ['Backspace', 'Multiple, with empty input: remove the last chip'],
                ['Tab', 'Close and move on'],
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
            'The input is role="combobox" with aria-autocomplete="list", aria-expanded, aria-controls and aria-activedescendant; focus stays in it.',
            'Options are role="option" with aria-selected; the listbox is aria-multiselectable in multiple mode.',
            'The no-results row is a role="status" live region, so it is announced.',
            'Chips are Badges with a “Remove <label>” button; the clear button is mouse-only (Esc clears from the keyboard).',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
