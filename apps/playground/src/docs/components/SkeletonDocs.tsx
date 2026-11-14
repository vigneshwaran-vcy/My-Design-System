import { Skeleton } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function SkeletonDocs() {
  return (
    <DocSection id="skeleton" eyebrow="Components" title="Skeleton" description="A placeholder that mirrors the shape of content while it loads. Keep layouts stable: match the real component's size.">
      <CodeBlock label="Skeleton import" code={`import { Skeleton } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants"
          code={`<Skeleton variant="text" />
<Skeleton variant="circle" />
<Skeleton variant="rect" height="var(--ds-size-avatar-xl)" />`}
        >
          <div style={{ display: 'grid', gap: 'var(--ds-space-4)', width: '100%' }}>
            <Skeleton variant="text" />
            <Skeleton variant="circle" />
            <Skeleton variant="rect" height="var(--ds-size-avatar-xl)" />
          </div>
        </Example>

        <Example title="Paragraph (lines)" code={`<Skeleton lines={3} label="Loading description" />`}>
          <div style={{ width: '100%' }}>
            <Skeleton lines={3} label="Loading description" />
          </div>
        </Example>

        <Example
          title="User row placeholder"
          code={`<Skeleton variant="circle" width="var(--ds-size-avatar-sm)" height="var(--ds-size-avatar-sm)" />
<Skeleton variant="text" width="40%" />
<Skeleton variant="text" width="25%" height="var(--ds-font-size-xs)" />`}
        >
          <div style={{ display: 'grid', gap: 'var(--ds-space-4)', width: '100%' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' }}>
                <Skeleton variant="circle" width="var(--ds-size-avatar-sm)" height="var(--ds-size-avatar-sm)" />
                <div style={{ flex: 1, display: 'grid', gap: 'var(--ds-space-2)' }}>
                  <Skeleton variant="text" width={`${40 - i * 6}%`} />
                  <Skeleton variant="text" width="25%" height="var(--ds-font-size-xs)" />
                </div>
                <Skeleton variant="rect" width="var(--ds-space-12)" height="var(--ds-space-4)" />
              </div>
            ))}
          </div>
        </Example>

        <Example title="Custom size" code={`<Skeleton variant="rect" width={240} height="var(--ds-space-8)" />`}>
          <Skeleton variant="rect" width={240} height="var(--ds-space-8)" />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Skeleton props (plus all native <span> attributes)"
          rows={[
            { name: 'variant', type: "'text' | 'circle' | 'rect'", default: "'text'", description: 'text = one line (font-size-sm tall, radius-sm); circle = avatar-md disc; rect = avatar-md tall block with radius-md.' },
            { name: 'width', type: 'number | string', description: 'Any CSS width (%, var(--ds-*), …). Numbers are pixels.' },
            { name: 'height', type: 'number | string', description: 'Any CSS height. Numbers are pixels.' },
            { name: 'lines', type: 'number', default: '1', description: 'For text: renders N bars; the last is 60% wide.' },
            { name: 'label', type: 'string', description: 'Visually-hidden role="status" message, e.g. "Loading users". Use once per loading region.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Skeleton bars are aria-hidden: they carry no information and should not be announced.',
            'Pass label on one skeleton per loading region to announce a polite role="status" message; do not label every bar.',
            'The shimmer runs between bg-subtle and bg-neutral-hover on motion tokens; under prefers-reduced-motion it is a static fill.',
            'Match the dimensions of the content it replaces to avoid layout shift when data arrives.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
