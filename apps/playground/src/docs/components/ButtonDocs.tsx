import { Button, Icon } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function ButtonDocs() {
  const [loading, setLoading] = useState(false);
  const save = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <DocSection id="button" eyebrow="Components" title="Button" description="Triggers an action. Use one primary button per view; secondary, soft and ghost for everything else; danger only for destructive actions.">
      <CodeBlock label="Button import" code={`import { Button } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants"
          code={`<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="soft">Soft</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>`}
        >
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Delete</Button>
        </Example>

        <Example title="Sizes — 22 / 26 / 32 / 40" code={`<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Example>

        <Example title="States" code={`<Button disabled>Disabled</Button>
<Button loading={loading} onClick={save}>Save</Button>`}>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button loading={loading} onClick={save}>{loading ? 'Saving…' : 'Click to load'}</Button>
        </Example>

        <Example title="With icons" code={`<Button leadingIcon={<Icon name="add" />}>New project</Button>
<Button variant="secondary" trailingIcon={<Icon name="arrow-right" />}>Continue</Button>`}>
          <Button leadingIcon={<Icon name="add" />}>New project</Button>
          <Button variant="secondary" trailingIcon={<Icon name="arrow-right" />}>Continue</Button>
        </Example>

        <Example title="Full width" code={`<Button fullWidth>Continue</Button>`}>
          <Button fullWidth>Continue</Button>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Button props (plus all native <button> attributes)"
          rows={[
            { name: 'variant', type: "'primary' | 'secondary' | 'soft' | 'ghost' | 'danger'", default: "'primary'", description: 'Visual emphasis. soft is a tinted, low-emphasis accent.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 22 / 26 / 32 / 40 (size-button-*).' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner, sets aria-busy, ignores clicks but stays focusable.' },
            { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches to the container width.' },
            { name: 'leadingIcon', type: 'ReactNode', description: 'Decorative icon before the label (hidden from screen readers).' },
            { name: 'trailingIcon', type: 'ReactNode', description: 'Decorative icon after the label.' },
            { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Defaults to button so it never submits a form by accident.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Native <button>: Tab to focus, Enter and Space to activate.',
            'Visible 2px focus ring (color-focus-ring) on :focus-visible only.',
            'Loading uses aria-busy + aria-disabled instead of disabled, so focus is not lost mid-action.',
            'Icons are aria-hidden; the label is always the accessible name. Icon-only buttons need aria-label.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
