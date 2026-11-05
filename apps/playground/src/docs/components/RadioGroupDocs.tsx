import { Radio, RadioGroup } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function RadioGroupDocs() {
  const [plan, setPlan] = useState<string | null>('team');
  const [shipping, setShipping] = useState<string | null>(null);

  return (
    <DocSection id="radio-group" eyebrow="Components" title="Radio group" description="Pick exactly one option from a short, always-visible list. Native radios under a custom circle, grouped under one label.">
      <CodeBlock label="RadioGroup import" code={`import { RadioGroup, Radio } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled (arrows move the selection)"
          code={`<RadioGroup label="Plan" value={plan} onChange={setPlan}>
  <Radio value="free" label="Free" description="For personal projects" />
  <Radio value="team" label="Team" description="Up to 10 seats" />
  <Radio value="enterprise" label="Enterprise" description="SSO, audit log, SLA" />
</RadioGroup>`}
        >
          <div className="doc-stack">
            <RadioGroup label="Plan" value={plan} onChange={setPlan} hint={`Selected: ${plan ?? 'nothing'}`}>
              <Radio value="free" label="Free" description="For personal projects" />
              <Radio value="team" label="Team" description="Up to 10 seats, shared libraries" />
              <Radio value="enterprise" label="Enterprise" description="SSO, audit log, SLA" />
            </RadioGroup>
          </div>
        </Example>

        <Example title="Horizontal" code={`<RadioGroup label="Billing" orientation="horizontal" defaultValue="monthly">
  <Radio value="monthly" label="Monthly" />
  <Radio value="yearly" label="Yearly" />
</RadioGroup>`}>
          <div className="doc-stack">
            <RadioGroup label="Billing" orientation="horizontal" defaultValue="monthly">
              <Radio value="monthly" label="Monthly" />
              <Radio value="yearly" label="Yearly" />
            </RadioGroup>
          </div>
        </Example>

        <Example title="Invalid (pick one to clear)" code={`<RadioGroup
  label="Shipping"
  required
  value={shipping}
  onChange={setShipping}
  error={shipping ? undefined : 'Choose a shipping speed.'}
>
  <Radio value="standard" label="Standard" description="3–5 business days" />
  <Radio value="express" label="Express" description="Next business day" />
</RadioGroup>`}>
          <div className="doc-stack">
            <RadioGroup label="Shipping" required value={shipping} onChange={setShipping} error={shipping ? undefined : 'Choose a shipping speed.'}>
              <Radio value="standard" label="Standard" description="3–5 business days" />
              <Radio value="express" label="Express" description="Next business day" />
            </RadioGroup>
          </div>
        </Example>

        <Example title="Sizes" code={`<RadioGroup label="Small" size="sm" defaultValue="a">…</RadioGroup>
<RadioGroup label="Medium" size="md" defaultValue="a">…</RadioGroup>`}>
          <div className="doc-stack">
            <RadioGroup label="Small" size="sm" orientation="horizontal" defaultValue="a">
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
            </RadioGroup>
            <RadioGroup label="Medium" size="md" orientation="horizontal" defaultValue="a">
              <Radio value="a" label="Option A" />
              <Radio value="b" label="Option B" />
            </RadioGroup>
          </div>
        </Example>

        <Example title="Disabled group & disabled option" code={`<RadioGroup label="Region" disabled defaultValue="eu">…</RadioGroup>
<RadioGroup label="Tier" defaultValue="free">
  <Radio value="free" label="Free" />
  <Radio value="enterprise" label="Enterprise" description="Contact sales" disabled />
</RadioGroup>`}>
          <div className="doc-stack">
            <RadioGroup label="Region" disabled defaultValue="eu" orientation="horizontal">
              <Radio value="us" label="US" />
              <Radio value="eu" label="EU" />
            </RadioGroup>
            <RadioGroup label="Tier" defaultValue="free">
              <Radio value="free" label="Free" />
              <Radio value="enterprise" label="Enterprise" description="Contact sales" disabled />
            </RadioGroup>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="RadioGroup props (plus native <div> attributes)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Names the group via aria-labelledby.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the group label for screen readers only.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text, linked via aria-describedby.' },
            { name: 'error', type: 'ReactNode', description: 'Marks the group and every radio invalid and announces the message.' },
            { name: 'name', type: 'string', default: 'auto (useId)', description: 'Shared name for the native radios.' },
            { name: 'value', type: 'string | null', description: 'Controlled selected value. Pair with onChange.' },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: 'Initial selection when uncontrolled.' },
            { name: 'onChange', type: '(value: string, event) => void', description: 'Called with the newly selected value.' },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Stack or row layout.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every radio in the group.' },
            { name: 'required', type: 'boolean', default: 'false', description: 'Shows * and sets aria-required on the group.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Circle 14 / 16 with xs / sm text.' },
          ]}
        />
        <PropsTable
          caption="Radio props (plus native <input type=radio> attributes except size, type, name, value, checked, onChange)"
          rows={[
            { name: 'value', type: 'string', description: 'Required. Reported through the group onChange.' },
            { name: 'label', type: 'ReactNode', description: 'Required. Visible label tied to the input.' },
            { name: 'description', type: 'ReactNode', description: 'Secondary text under the label, linked via aria-describedby.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables only this option.' },
            { name: 'size', type: "'sm' | 'md'", default: 'group size', description: 'Overrides the group size for this option.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Wrapper has role="radiogroup" with aria-labelledby (label) and aria-describedby (hint, error).',
            'Native <input type="radio"> elements share one name, so Tab enters the group and arrow keys move and select.',
            'Each option label wraps its circle; descriptions are linked to the individual radio via aria-describedby.',
            'Errors set aria-invalid on the group and every radio and use role="alert" so they are announced.',
            'Focus ring (shadow-focus + border-focus) shows on :focus-visible only; a transparent border keeps an edge in forced-colors mode.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
