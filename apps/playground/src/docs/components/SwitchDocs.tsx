import { Switch } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function SwitchDocs() {
  const [notifications, setNotifications] = useState(true);

  return (
    <DocSection id="switch" eyebrow="Components" title="Switch" description="Turn a setting on or off with immediate effect. Use a checkbox instead when the change only applies after a save.">
      <CodeBlock label="Switch import" code={`import { Switch } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Basic" code={`<Switch label="Airplane mode" />
<Switch label="Wi-Fi" defaultChecked />`}>
          <div className="doc-stack">
            <Switch label="Airplane mode" />
            <Switch label="Wi-Fi" defaultChecked />
          </div>
        </Example>

        <Example title="Controlled with description" code={`<Switch
  label="Notifications"
  description={on ? 'You will be notified of mentions.' : 'Mentions are muted.'}
  checked={on}
  onChange={setOn}
/>`}>
          <div className="doc-stack">
            <Switch
              label="Notifications"
              description={notifications ? 'You will be notified of mentions.' : 'Mentions are muted.'}
              checked={notifications}
              onChange={setNotifications}
            />
          </div>
        </Example>

        <Example title="Label position" code={`<Switch label="Label after (default)" labelPosition="end" />
<Switch label="Label before" labelPosition="start" />`}>
          <div className="doc-stack">
            <Switch label="Label after (default)" labelPosition="end" defaultChecked />
            <Switch label="Label before" labelPosition="start" defaultChecked />
          </div>
        </Example>

        <Example title="Sizes" code={`<Switch size="sm" label="Small" defaultChecked />
<Switch size="md" label="Medium" defaultChecked />`}>
          <div className="doc-stack">
            <Switch size="sm" label="Small" defaultChecked />
            <Switch size="md" label="Medium" defaultChecked />
          </div>
        </Example>

        <Example title="Disabled & hidden label" code={`<Switch label="Disabled off" disabled />
<Switch label="Disabled on" disabled defaultChecked />
<Switch label="Toggle dark mode" hideLabel />`}>
          <div className="doc-stack">
            <Switch label="Disabled off" disabled />
            <Switch label="Disabled on" disabled defaultChecked />
            <Switch label="Toggle dark mode" hideLabel />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Switch props (plus native <button> attributes except type, value and onChange)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Rendered as a <label> tied to the switch.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
            { name: 'description', type: 'ReactNode', description: 'Secondary text under the label, linked via aria-describedby.' },
            { name: 'checked', type: 'boolean', description: 'Controlled state. Pair with onChange.' },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
            { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Called with the next state.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Track 28×16 / 36×20 (size-switch-*).' },
            { name: 'labelPosition', type: "'start' | 'end'", default: "'end'", description: 'Label before or after the track.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Native disabled; not focusable.' },
            { name: 'name / value', type: 'string', default: "value: 'on'", description: 'Renders a hidden input with this name while checked, for forms.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'A native <button role="switch" aria-checked>: Tab to focus, Space or Enter to toggle.',
            'The label is a real <label for>, so clicking it toggles; aria-labelledby points back at it.',
            'Description is linked via aria-describedby.',
            'Thumb movement uses a transform transition that prefers-reduced-motion turns off.',
            'Focus ring (shadow-focus + border-focus) shows on :focus-visible only; a transparent border keeps an edge in forced-colors mode.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
