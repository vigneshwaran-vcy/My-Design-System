import { Progress } from '@my-ds/ui';
import { useEffect, useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const col = { display: 'grid', gap: 'var(--ds-space-4)', width: '100%' } as const;

export function ProgressDocs() {
  const [live, setLive] = useState(12);
  useEffect(() => {
    const t = setInterval(() => setLive((v) => (v >= 100 ? 0 : v + 4)), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <DocSection id="progress" eyebrow="Components" title="Progress" description="Shows how far a task has come, as a bar or a ring. Use indeterminate when the duration is unknown.">
      <CodeBlock label="Progress import" code={`import { Progress } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Bar with label and value"
          code={`<Progress value={62} label="Storage used" showValue />
<Progress value={38} label="Seats assigned" showValue formatValue={(v) => \`\${Math.round(v / 100 * 50)} of 50\`} />`}
        >
          <div style={col}>
            <Progress value={62} label="Storage used" showValue />
            <Progress value={38} label="Seats assigned" showValue formatValue={(v) => `${Math.round((v / 100) * 50)} of 50`} />
          </div>
        </Example>

        <Example
          title="Variants"
          code={`<Progress value={70} variant="accent" label="Sync" />
<Progress value={100} variant="success" label="Complete" />
<Progress value={85} variant="warn" label="Quota" />
<Progress value={96} variant="danger" label="Disk" />`}
        >
          <div style={col}>
            <Progress value={70} variant="accent" label="Sync" showValue />
            <Progress value={100} variant="success" label="Complete" showValue />
            <Progress value={85} variant="warn" label="Quota" showValue />
            <Progress value={96} variant="danger" label="Disk" showValue />
          </div>
        </Example>

        <Example title="Sizes — 4 / 8 / 12" code={`<Progress size="sm" value={50} />
<Progress size="md" value={50} />
<Progress size="lg" value={50} />`}>
          <div style={col}>
            <Progress size="sm" value={50} label="Small" />
            <Progress size="md" value={50} label="Medium" />
            <Progress size="lg" value={50} label="Large" />
          </div>
        </Example>

        <Example title="Indeterminate" code={`<Progress indeterminate label="Preparing export…" />`}>
          <div style={col}>
            <Progress indeterminate label="Preparing export…" />
          </div>
        </Example>

        <Example
          title="Circle — 32 / 40 / 48"
          code={`<Progress shape="circle" size="sm" value={25} showValue />
<Progress shape="circle" size="md" value={60} showValue label="Onboarding" />
<Progress shape="circle" size="lg" value={90} showValue variant="success" />
<Progress shape="circle" size="lg" indeterminate label="Syncing" />`}
        >
          <Progress shape="circle" size="sm" value={25} showValue label="Import" />
          <Progress shape="circle" size="md" value={60} showValue label="Onboarding" />
          <Progress shape="circle" size="lg" value={90} showValue variant="success" label="Rollout" />
          <Progress shape="circle" size="lg" indeterminate label="Syncing" />
        </Example>

        <Example title="Live value" code={`<Progress value={percent} label="Importing contacts" showValue />`}>
          <div style={col}>
            <Progress value={live} label="Importing contacts" showValue />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Progress props (plus all native <div> attributes)"
          rows={[
            { name: 'value', type: 'number', default: '0', description: 'Completion 0–100 (clamped). Ignored when indeterminate.' },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Unknown duration: slides/spins, omits aria-valuenow and sets aria-busy.' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Bar height space-1 / 2 / 3; ring diameter size-avatar-sm / md / lg.' },
            { name: 'variant', type: "'accent' | 'success' | 'warn' | 'danger'", default: "'accent'", description: 'Fill colour (bg-*).' },
            { name: 'label', type: 'ReactNode', description: 'Visible label; becomes the accessible name via aria-labelledby.' },
            { name: 'showValue', type: 'boolean', default: 'false', description: 'Renders "NN%" (or formatValue) beside the label or in the ring centre.' },
            { name: 'shape', type: "'bar' | 'circle'", default: "'bar'", description: 'Horizontal track or SVG ring.' },
            { name: 'formatValue', type: '(value: number) => string', default: 'v => `${round(v)}%`', description: 'Formats the visible value and aria-valuetext.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="progressbar" with aria-valuemin=0, aria-valuemax=100, aria-valuenow and a human-readable aria-valuetext.',
            'Indeterminate omits aria-valuenow (per ARIA) and sets aria-busy so screen readers report activity without a bogus percentage.',
            'Always provide label or aria-label so the bar has a name; the visible percentage is aria-hidden to avoid double announcement.',
            'Colour is never the only signal — pair warn/danger with a label like "Quota 85%".',
            'Motion uses motion tokens and slows under prefers-reduced-motion; width/stroke changes are not animated there.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
