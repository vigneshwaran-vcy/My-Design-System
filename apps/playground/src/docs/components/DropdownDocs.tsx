import { Button, Dropdown, type DropdownOption } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const fruits: DropdownOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'durian', label: 'Durian', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
];

const plans: DropdownOption[] = [
  { value: 'free', label: 'Free', description: 'For personal projects' },
  { value: 'team', label: 'Team', description: 'Up to 10 seats, shared libraries' },
  { value: 'enterprise', label: 'Enterprise', description: 'SSO, audit log, SLA' },
];

export function DropdownDocs() {
  const [fruit, setFruit] = useState<string | null>('banana');
  const [role, setRole] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string>();

  return (
    <DocSection id="dropdown" eyebrow="Components" title="Dropdown" description="Pick one option from a short list. Follows the WAI-ARIA select-only combobox pattern, so it behaves like a native select with full styling control.">
      <CodeBlock label="Dropdown import" code={`import { Dropdown, type DropdownOption } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled (try the keyboard: arrows, Home/End, type a letter)"
          code={`const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'durian', label: 'Durian', disabled: true },
];

<Dropdown label="Fruit" options={options} value={fruit} onChange={setFruit} />`}
        >
          <div className="doc-stack">
            <Dropdown label="Fruit" options={fruits} value={fruit} onChange={setFruit} hint={`Selected: ${fruit ?? 'nothing'}`} />
          </div>
        </Example>

        <Example title="Options with descriptions" code={`<Dropdown
  label="Plan"
  defaultValue="team"
  options={[
    { value: 'free', label: 'Free', description: 'For personal projects' },
    { value: 'team', label: 'Team', description: 'Up to 10 seats, shared libraries' },
  ]}
/>`}>
          <div className="doc-stack">
            <Dropdown label="Plan" options={plans} defaultValue="team" />
          </div>
        </Example>

        <Example title="Validation in a form" code={`<form onSubmit={…}>
  <Dropdown
    label="Role"
    name="role"
    required
    options={roles}
    value={role}
    onChange={setRole}
    error={submitted && !role ? 'Choose a role.' : undefined}
  />
  <Button type="submit">Save</Button>
</form>`}>
          <form
            className="doc-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(role ?? '');
            }}
          >
            <Dropdown
              label="Role"
              name="role"
              required
              options={[
                { value: 'viewer', label: 'Viewer' },
                { value: 'editor', label: 'Editor' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={role}
              onChange={setRole}
              error={submitted !== undefined && !role ? 'Choose a role.' : undefined}
              hint={submitted ? `Saved role: ${submitted}` : undefined}
            />
            <div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Example>

        <Example title="Variants" code={`<Dropdown label="Outline" options={options} />
<Dropdown label="Filled" variant="filled" options={options} />`}>
          <div className="doc-stack">
            <Dropdown label="Outline" options={fruits} />
            <Dropdown label="Filled" variant="filled" options={fruits} />
          </div>
        </Example>

        <Example title="Sizes" code={`<Dropdown size="sm" … />
<Dropdown size="md" … />
<Dropdown size="lg" … />`}>
          <div className="doc-stack">
            <Dropdown label="Small" size="sm" options={fruits} />
            <Dropdown label="Medium" size="md" options={fruits} />
            <Dropdown label="Large" size="lg" options={fruits} />
          </div>
        </Example>

        <Example title="Disabled & hidden label" code={`<Dropdown label="Region" disabled defaultValue="eu" options={…} />
<Dropdown label="Sort by" hideLabel options={…} placeholder="Sort by…" />`}>
          <div className="doc-stack">
            <Dropdown label="Region" disabled defaultValue="eu" options={[{ value: 'eu', label: 'Europe' }, { value: 'us', label: 'United States' }]} />
            <Dropdown
              label="Sort by"
              hideLabel
              placeholder="Sort by…"
              options={[{ value: 'new', label: 'Newest' }, { value: 'old', label: 'Oldest' }, { value: 'az', label: 'A → Z' }]}
            />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Dropdown props (plus native <button> attributes, applied to the trigger)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Names both the trigger and the list.' },
            { name: 'options', type: 'DropdownOption[]', description: '{ value, label, textValue?, description?, disabled? }' },
            { name: 'value', type: 'string | null', description: 'Controlled selected value.' },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: 'Initial value when uncontrolled.' },
            { name: 'onChange', type: '(value: string) => void', description: 'Called only when the selection changes.' },
            { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Shown when nothing is selected.' },
            { name: 'name', type: 'string', description: 'Adds a hidden input so the value submits with a form.' },
            { name: 'required', type: 'boolean', description: 'Sets aria-required and shows *.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text, linked via aria-describedby.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid and announces the message.' },
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
                ['↓ / ↑', 'Open on the selected (or first / last) option', 'Move to next / previous enabled option'],
                ['Enter / Space', 'Open', 'Select the active option and close'],
                ['Home / End', 'Open on first / last option', 'Jump to first / last option'],
                ['Alt + ↑', '—', 'Select and close'],
                ['Esc', '—', 'Close without changing'],
                ['Tab', 'Move focus', 'Select the active option and move focus'],
                ['Letters', 'Select the next match', 'Jump to the next match'],
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
            'Trigger is role="combobox" with aria-expanded, aria-controls and aria-activedescendant; focus never leaves it.',
            'Options are role="option" with aria-selected; disabled options use aria-disabled and are skipped.',
            'Label, hint and error are wired through aria-labelledby / aria-describedby like Input.',
            'Clicking outside or tabbing away closes the list.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
