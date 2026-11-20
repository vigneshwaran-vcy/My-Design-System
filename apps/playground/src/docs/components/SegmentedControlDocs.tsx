import { SegmentedControl, type SegmentedControlOption } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const periods: SegmentedControlOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year', disabled: true },
];

const views: SegmentedControlOption[] = [
  { value: 'list', label: 'List view', icon: 'list', iconOnly: true },
  { value: 'grid', label: 'Grid view', icon: 'widget', iconOnly: true },
  { value: 'chart', label: 'Chart view', icon: 'chart-2', iconOnly: true },
];

export function SegmentedControlDocs() {
  const [period, setPeriod] = useState('week');

  return (
    <DocSection
      id="segmented-control"
      eyebrow="Components"
      title="Segmented control"
      description="A segmented control: mutually exclusive options in a recessed track, with a raised thumb that slides under the selection. Same look as the docs theme toggle; radio-group semantics underneath."
    >
      <CodeBlock label="SegmentedControl import" code={`import { SegmentedControl, type SegmentedControlOption } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled (try ← → Home End)"
          code={`const periods = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year', disabled: true },
];

<SegmentedControl label="Period" options={periods} value={period} onChange={setPeriod} />`}
        >
          <SegmentedControl label="Period" options={periods} value={period} onChange={setPeriod} hint={`Showing: ${period}`} />
        </Example>

        <Example title="Icons" code={`<SegmentedControl
  label="View"
  options={[
    { value: 'list', label: 'List view', icon: 'list', iconOnly: true },
    { value: 'grid', label: 'Grid view', icon: 'widget', iconOnly: true },
  ]}
/>`}>
          <div className="doc-stack">
            <SegmentedControl label="View" options={views} defaultValue="grid" />
            <SegmentedControl
              label="Theme"
              defaultValue="light"
              options={[
                { value: 'light', label: 'Light', icon: 'sun' },
                { value: 'dark', label: 'Dark', icon: 'moon' },
              ]}
            />
          </div>
        </Example>

        <Example title="Variants" code={`<SegmentedControl variant="neutral" … />
<SegmentedControl variant="accent" … />`}>
          <div className="doc-stack">
            <SegmentedControl label="Neutral" options={periods} defaultValue="month" />
            <SegmentedControl label="Accent" variant="accent" options={periods} defaultValue="month" />
          </div>
        </Example>

        <Example title="Sizes & full width" code={`<SegmentedControl size="sm" … />
<SegmentedControl size="lg" fullWidth … />`}>
          <div className="doc-stack">
            <SegmentedControl label="Small" size="sm" options={periods} defaultValue="day" />
            <SegmentedControl label="Medium" size="md" options={periods} defaultValue="day" />
            <SegmentedControl label="Large, full width" size="lg" fullWidth options={periods} defaultValue="day" />
          </div>
        </Example>

        <Example title="States" code={`<SegmentedControl label="Billing" required error="Choose a billing cycle." … />
<SegmentedControl label="Locked" disabled … />`}>
          <div className="doc-stack">
            <SegmentedControl
              label="Billing"
              required
              error="Choose a billing cycle."
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
            <SegmentedControl label="Locked" disabled options={periods} defaultValue="week" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="SegmentedControl props (plus native <div> attributes on the wrapper)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Labels the radiogroup.' },
            { name: 'options', type: 'SegmentedControlOption[]', description: '{ value, label, icon?, iconOnly?, disabled? }' },
            { name: 'value', type: 'string | null', description: 'Controlled selected value.' },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: 'Initial value when uncontrolled.' },
            { name: 'onChange', type: '(value: string) => void', description: 'Called when the selection changes.' },
            { name: 'variant', type: "'neutral' | 'accent'", default: "'neutral'", description: 'Raised white thumb, or solid blue thumb.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 26 / 32 / 36, matching inputs.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch; segments share the width equally.' },
            { name: 'name', type: 'string', description: 'Adds a hidden input so the value submits with a form.' },
            { name: 'required', type: 'boolean', description: 'Sets aria-required and shows *.' },
            { name: 'disabled', type: 'boolean', description: 'Disables every option.' },
            { name: 'hint / error', type: 'ReactNode', description: 'Linked via aria-describedby; error sets aria-invalid.' },
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
                ['Tab', 'Focus the selected option (or the first enabled one)'],
                ['→ / ↓', 'Select the next enabled option (wraps)'],
                ['← / ↑', 'Select the previous enabled option (wraps)'],
                ['Home / End', 'Select the first / last enabled option'],
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
            'role="radiogroup" with role="radio" buttons and aria-checked; a roving tabindex keeps one Tab stop.',
            'Selection follows focus, as in the WAI-ARIA radio group pattern; disabled options are skipped.',
            'Icon-only options keep their label as the accessible name.',
            'Use it for 2–5 short, mutually exclusive choices; use a Dropdown for longer lists.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
