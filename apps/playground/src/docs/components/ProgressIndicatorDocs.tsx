import { Button, ProgressIndicator, type ProgressStep } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const steps: ProgressStep[] = [
  { id: 'account', label: 'Account', description: 'Email and password' },
  { id: 'profile', label: 'Profile', description: 'Name and photo' },
  { id: 'billing', label: 'Billing', description: 'Plan and payment' },
  { id: 'review', label: 'Review', description: 'Confirm details' },
];

const wide = { width: '100%', maxWidth: 'var(--ds-size-panel-2xl)' };

function ClickableExample() {
  const [current, setCurrent] = useState(2);
  return (
    <div style={{ ...wide, display: 'grid', gap: 'var(--ds-space-4)' }}>
      <ProgressIndicator aria-label="Sign-up progress" steps={steps} currentStep={steps[current].id} onStepClick={(_, index) => setCurrent(index)} />
      <div style={{ display: 'flex', gap: 'var(--ds-space-2)' }}>
        <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Back</Button>
        <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent(current + 1)}>Next</Button>
      </div>
    </div>
  );
}

export function ProgressIndicatorDocs() {
  return (
    <DocSection
      id="progress-indicator"
      eyebrow="Components"
      title="Progress Indicator"
      description="A stepper that shows where the user is in a multi-step flow: completed steps get a check, the current step a ring, and errors a danger marker."
    >
      <CodeBlock label="Progress indicator import" code={`import { ProgressIndicator } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Horizontal"
          code={`<ProgressIndicator
  steps={[
    { id: 'account', label: 'Account', description: 'Email and password' },
    { id: 'profile', label: 'Profile', description: 'Name and photo' },
    { id: 'billing', label: 'Billing', description: 'Plan and payment' },
    { id: 'review', label: 'Review', description: 'Confirm details' },
  ]}
  currentStep="billing"
/>`}
        >
          <div style={wide}>
            <ProgressIndicator aria-label="Checkout progress" steps={steps} currentStep="billing" />
          </div>
        </Example>

        <Example title="Clickable completed steps" code={`<ProgressIndicator steps={steps} currentStep={current} onStepClick={(id) => setCurrent(id)} />`}>
          <ClickableExample />
        </Example>

        <Example title="Vertical with an error" code={`<ProgressIndicator orientation="vertical" steps={[…, { id: 'profile', label: 'Profile', status: 'error' }, …]} currentStep="billing" />`}>
          <ProgressIndicator
            aria-label="Import progress"
            orientation="vertical"
            currentStep="billing"
            steps={steps.map((s) => (s.id === 'profile' ? { ...s, status: 'error', description: 'Photo failed to upload' } : s))}
          />
        </Example>

        <Example title="Framed, small" code={`<ProgressIndicator variant="framed" size="sm" steps={steps} currentStep="profile" />`}>
          <div style={wide}>
            <ProgressIndicator aria-label="Setup progress" variant="framed" size="sm" steps={steps} currentStep="profile" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="ProgressIndicator props (plus native <ol> attributes)"
          rows={[
            { name: 'steps', type: 'ProgressStep[]', description: '{ id, label, description?, status?, disabled? } for each step, in order.' },
            { name: 'currentStep', type: 'string', description: 'Id of the current step; earlier steps are completed, later ones upcoming.' },
            { name: 'steps[].status', type: "'completed' | 'current' | 'upcoming' | 'error'", description: 'Overrides the derived status.' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Row with labels under markers, or a column with labels beside them.' },
            { name: 'variant', type: "'default' | 'framed'", default: "'default'", description: 'Bare, or in a tinted frame.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Marker 20 / 24.' },
            { name: 'onStepClick', type: '(id: string, index: number) => void', description: 'Makes completed and errored steps buttons (e.g. to go back).' },
            { name: 'statusLabels', type: 'Partial<Record<status, string>>', description: 'Screen-reader status text, for localisation.' },
            { name: 'aria-label', type: 'string', default: "'Progress'", description: 'Label for the list.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'An ordered list; the current step has aria-current="step".',
            'Each step name includes its status as visually hidden text ("Completed", "Error"…), so status is not conveyed by colour alone.',
            'Markers and glyphs are aria-hidden.',
            'With onStepClick, completed steps are native buttons (Tab, Enter/Space) with a soft focus ring on the marker; other steps are not focusable.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
