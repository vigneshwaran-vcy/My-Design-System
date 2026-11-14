import { CheckboxButton } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function CheckboxButtonDocs() {
  const [added, setAdded] = useState(false);

  return (
    <DocSection
      id="checkbox-button"
      eyebrow="Components"
      title="Checkbox button"
      description="A square icon toggle with checkbox semantics: an add icon that turns into a solid check when selected. Use it to add items to a list or selection in place."
    >
      <CodeBlock label="CheckboxButton import" code={`import { CheckboxButton } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Controlled"
          code={`<CheckboxButton label="Add to favourites" checked={added} onChange={setAdded} />`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
            <CheckboxButton label="Add to favourites" checked={added} onChange={setAdded} />
            <span className="doc-muted">{added ? 'Added to favourites' : 'Not added'}</span>
          </div>
        </Example>

        <Example title="Variants" code={`<CheckboxButton label="Add" variant="outline" />
<CheckboxButton label="Add" variant="soft" />`}>
          <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
            <CheckboxButton label="Outline" />
            <CheckboxButton label="Outline checked" defaultChecked />
            <CheckboxButton label="Soft" variant="soft" />
            <CheckboxButton label="Soft checked" variant="soft" defaultChecked />
          </div>
        </Example>

        <Example title="Sizes" code={`<CheckboxButton size="sm" … />
<CheckboxButton size="md" … />
<CheckboxButton size="lg" … />`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
            <CheckboxButton label="Small" size="sm" />
            <CheckboxButton label="Medium" size="md" />
            <CheckboxButton label="Large" size="lg" />
          </div>
        </Example>

        <Example title="Custom icons & states" code={`<CheckboxButton label="Star" icon="star" checkedIcon="star" />
<CheckboxButton label="Invalid" invalid />
<CheckboxButton label="Disabled" disabled />`}>
          <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
            <CheckboxButton label="Star" icon="star" checkedIcon="star" />
            <CheckboxButton label="Bookmark" icon="bookmark" checkedIcon="bookmark" defaultChecked />
            <CheckboxButton label="Invalid" invalid />
            <CheckboxButton label="Disabled" disabled />
            <CheckboxButton label="Disabled checked" disabled defaultChecked />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="CheckboxButton props (plus native <input> attributes, applied to the checkbox)"
          rows={[
            { name: 'label', type: 'string', description: 'Required accessible name (icon-only; also the hover title).' },
            { name: 'checked', type: 'boolean', description: 'Controlled state.' },
            { name: 'defaultChecked', type: 'boolean', description: 'Initial state when uncontrolled.' },
            { name: 'onChange', type: '(checked: boolean, event) => void', description: 'Called on every toggle.' },
            { name: 'icon', type: 'IconName', default: "'add'", description: 'Icon while unchecked.' },
            { name: 'checkedIcon', type: 'IconName', default: "'check'", description: 'Icon while checked.' },
            { name: 'variant', type: "'outline' | 'soft'", default: "'outline'", description: 'Flat surface with a ring, or an accent tint. Checked is solid accent in both.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '26 / 32 / 40, matching button sizes.' },
            { name: 'invalid', type: 'boolean', default: 'false', description: 'Danger edge and aria-invalid.' },
            { name: 'disabled', type: 'boolean', description: 'Not focusable or toggleable.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'A visually hidden native checkbox drives the state: role="checkbox", Space toggles, and it submits with forms (name/value).',
            'The label prop is the accessible name; icons are decorative.',
            'Focus shows a 1px focus edge and soft ring on the square; nothing moves on hover or press.',
            'For a group of checkbox buttons, wrap them in a fieldset/legend or role="group" with a label.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
