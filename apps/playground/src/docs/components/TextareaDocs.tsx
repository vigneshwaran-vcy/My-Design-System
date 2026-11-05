import { Textarea } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function TextareaDocs() {
  const [bio, setBio] = useState('Designs systems, drinks tea.');
  const [feedback, setFeedback] = useState('');

  return (
    <DocSection id="textarea" eyebrow="Components" title="Textarea" description="Multi-line text entry with the same label, hint and error wiring as Input, plus auto-resize and a character count.">
      <CodeBlock label="Textarea import" code={`import { Textarea } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Basic with hint" code={`<Textarea label="Message" placeholder="Write something…" hint="Markdown is supported." />`}>
          <div className="doc-stack">
            <Textarea label="Message" placeholder="Write something…" hint="Markdown is supported." />
          </div>
        </Example>

        <Example title="Auto-resize (type a few lines)" code={`<Textarea label="Notes" rows={2} autoResize maxRows={6} />`}>
          <div className="doc-stack">
            <Textarea label="Notes" rows={2} autoResize maxRows={6} placeholder="Grows up to 6 rows, then scrolls." />
          </div>
        </Example>

        <Example title="Character count" code={`<Textarea
  label="Bio"
  maxLength={80}
  showCount
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>`}>
          <div className="doc-stack">
            <Textarea label="Bio" maxLength={80} showCount value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
        </Example>

        <Example title="Validation (required)" code={`<Textarea
  label="Feedback"
  required
  value={feedback}
  onChange={(e) => setFeedback(e.target.value)}
  error={feedback.trim() ? undefined : 'Tell us a little more.'}
/>`}>
          <div className="doc-stack">
            <Textarea label="Feedback" required value={feedback} onChange={(e) => setFeedback(e.target.value)} error={feedback.trim() ? undefined : 'Tell us a little more.'} />
          </div>
        </Example>

        <Example title="Variants" code={`<Textarea label="Outline" />
<Textarea label="Filled" variant="filled" />`}>
          <div className="doc-stack">
            <Textarea label="Outline" rows={2} placeholder="Outline (default)" />
            <Textarea label="Filled" variant="filled" rows={2} placeholder="Filled" />
          </div>
        </Example>

        <Example title="Sizes" code={`<Textarea label="Small" size="sm" />
<Textarea label="Medium" size="md" />
<Textarea label="Large" size="lg" />`}>
          <div className="doc-stack">
            <Textarea label="Small" size="sm" rows={2} placeholder="sm" />
            <Textarea label="Medium" size="md" rows={2} placeholder="md" />
            <Textarea label="Large" size="lg" rows={2} placeholder="lg" />
          </div>
        </Example>

        <Example title="Disabled, no resize & hidden label" code={`<Textarea label="Locked" disabled defaultValue="Read only for now." />
<Textarea label="Fixed" resize="none" />
<Textarea label="Notes" hideLabel placeholder="Add a note…" />`}>
          <div className="doc-stack">
            <Textarea label="Locked" disabled rows={2} defaultValue="Read only for now." />
            <Textarea label="Fixed" resize="none" rows={2} placeholder="Cannot be dragged" />
            <Textarea label="Notes" hideLabel rows={2} placeholder="Add a note…" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Textarea props (plus all native <textarea> attributes)"
          rows={[
            { name: 'label', type: 'ReactNode', description: 'Required. Rendered as a <label> tied to the textarea.' },
            { name: 'hideLabel', type: 'boolean', default: 'false', description: 'Keeps the label for screen readers only.' },
            { name: 'hint', type: 'ReactNode', description: 'Helper text, linked via aria-describedby.' },
            { name: 'error', type: 'ReactNode', description: 'Sets aria-invalid, red border, and announces the message.' },
            { name: 'variant', type: "'outline' | 'filled'", default: "'outline'", description: 'Ring edge or tinted background.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and type match Input sizes 32 / 40 / 48.' },
            { name: 'rows', type: 'number', default: '3', description: 'Initial height in rows (also the minimum when autoResize is on).' },
            { name: 'autoResize', type: 'boolean', default: 'false', description: 'Grows with content; disables manual resize.' },
            { name: 'maxRows', type: 'number', description: 'Upper bound for autoResize; scrolls beyond it.' },
            { name: 'maxLength', type: 'number', description: 'Native limit; shown as the denominator of the count.' },
            { name: 'showCount', type: 'boolean', default: 'false', description: 'Shows the character count under the field.' },
            { name: 'resize', type: "'none' | 'vertical'", default: "'vertical'", description: 'Whether the corner handle is available.' },
            { name: 'id', type: 'string', default: 'auto (useId)', description: 'Override the generated id.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Label is always present (visible or visually hidden) and associated with htmlFor.',
            'Hint, error and character count are referenced by aria-describedby, in that order.',
            'Errors set aria-invalid and use role="alert" so they are announced when they appear.',
            'Required fields show * visually (aria-hidden) and use the native required attribute.',
            'Auto-resize keeps the native textarea, so scrolling, selection and IME input behave normally.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
