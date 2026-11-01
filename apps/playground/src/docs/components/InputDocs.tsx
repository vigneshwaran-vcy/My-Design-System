import { Input } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function InputDocs() {
  const [email, setEmail] = useState('nope');
  const error = email && !email.includes('@') ? 'Enter a valid email address.' : undefined;

  return (
    <DocSection id="input" eyebrow="Components" title="Input" description="Single-line text entry with a built-in label, hint and error message.">
      <CodeBlock label="Input import" code={`import { Input } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Basic with hint" code={`<Input label="Email" type="email" placeholder="you@example.com" hint="We never share your email." />`}>
          <div className="doc-stack">
            <Input label="Email" type="email" placeholder="you@example.com" hint="We never share your email." />
          </div>
        </Example>

        <Example title="Validation (type a valid email)" code={`<Input
  label="Email"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={isValid ? undefined : 'Enter a valid email address.'}
/>`}>
          <div className="doc-stack">
            <Input label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          </div>
        </Example>

        <Example title="Variants" code={`<Input label="Outline" />
<Input label="Filled" variant="filled" />`}>
          <div className="doc-stack">
            <Input label="Outline" placeholder="Outline (default)" />
            <Input label="Filled" variant="filled" placeholder="Filled" />
          </div>
        </Example>

        <Example title="Sizes" code={`<Input label="Small" size="sm" />
<Input label="Medium" size="md" />
<Input label="Large" size="lg" />`}>
          <div className="doc-stack">
            <Input label="Small" size="sm" placeholder="sm" />
            <Input label="Medium" size="md" placeholder="md" />
            <Input label="Large" size="lg" placeholder="lg" />
          </div>
        </Example>

        <Example title="Disabled & hidden label" code={`<Input label="Workspace" disabled defaultValue="acme" />
<Input label="Search" hideLabel type="search" placeholder="Search…" />`}>
          <div className="doc-stack">
            <Input label="Workspace" disabled defaultValue="acme" />
            <Input label="Search" hideLabel type="search" placeholder="Search…" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Input props (plus all native <input> attributes except size)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Rendered as a <label> tied to the input.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text, linked via aria-describedby.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid, red border, and announces the message.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Bordered or tinted background.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height 32 / 40 / 48.' },
            { name: 'id', type: 'string', default: 'auto (useId)', description: 'Override the generated id.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Label is always present (visible or visually hidden) and associated with htmlFor.',
            'Hint and error are both referenced by aria-describedby, in that order.',
            'Errors set aria-invalid and use role="alert" so they are announced when they appear.',
            'Required fields show * visually (aria-hidden) and use the native required attribute.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
