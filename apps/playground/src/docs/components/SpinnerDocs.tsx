import { Button, Spinner } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function SpinnerDocs() {
  return (
    <DocSection id="spinner" eyebrow="Components" title="Spinner" description="An indeterminate loading indicator: a rotating ring that inherits the text colour. Use it inline next to text or in place of content that is still arriving; for a button use its loading prop.">
      <CodeBlock label="Spinner import" code={`import { Spinner } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Sizes — 12 / 16 / 20 / 24" code={`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />`}>
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Example>

        <Example title="Colors" code={`<Spinner color="current" />
<Spinner color="accent" />
<Spinner color="muted" />`}>
          <Spinner color="current" />
          <Spinner color="accent" />
          <Spinner color="muted" />
        </Example>

        <Example
          title="Inline with text"
          code={`<p className="status">
  <Spinner size="sm" label="Syncing" />
  <span aria-hidden="true">Syncing 3 repositories…</span>
</p>`}
        >
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)', margin: 0, color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>
            <Spinner size="sm" label="Syncing" />
            <span aria-hidden="true">Syncing 3 repositories…</span>
          </p>
        </Example>

        <Example title="Loading a panel" code={`<div className="panel"><Spinner size="lg" color="muted" label="Loading invoices" /></div>`}>
          <div style={{ display: 'grid', placeItems: 'center', width: '100%', minHeight: 'var(--ds-space-16)', border: 'var(--ds-border-width-thin) dashed var(--ds-color-border)', borderRadius: 'var(--ds-radius-lg)' }}>
            <Spinner size="lg" color="muted" label="Loading invoices" />
          </div>
        </Example>

        <Example title="Buttons use their own loading prop" code={`<Button loading>Saving…</Button>`}>
          <Button loading>Saving…</Button>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Spinner props (plus native <span> attributes)"
          rows={[
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: '12 / 16 / 20 / 24 (size-icon-*).' },
            { name: 'color', type: "'current' | 'accent' | 'muted'", default: "'current'", description: 'current inherits the surrounding text colour.' },
            { name: 'label', type: 'string', default: "'Loading'", description: 'Visually hidden text announced by screen readers. Make it specific ("Loading invoices").' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="status" with visually hidden label text, so assistive tech announces what is loading.',
            'The SVG ring is aria-hidden; the label is the only text.',
            'Rotation uses motion-duration-base × 3; under prefers-reduced-motion it slows down (× 12) rather than stopping, since motion is the only progress cue.',
            'When the spinner replaces content, keep it in the same container so focus and scroll position are preserved.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
