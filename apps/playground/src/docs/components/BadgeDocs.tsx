import { Badge } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const variants = ['neutral', 'accent', 'success', 'warn', 'danger', 'outline'] as const;

export function BadgeDocs() {
  const [tags, setTags] = useState(['Design', 'Engineering', 'Marketing']);

  return (
    <DocSection id="badge" eyebrow="Components" title="Badge" description="A small label for status, counts and categories. Subtle by default; solid for high-emphasis states; outline for neutral metadata.">
      <CodeBlock label="Badge import" code={`import { Badge } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Variants (subtle)"
          code={`<Badge>Neutral</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warn">Warn</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="outline">Outline</Badge>`}
        >
          {variants.map((v) => (
            <Badge key={v} variant={v}>{v[0].toUpperCase() + v.slice(1)}</Badge>
          ))}
        </Example>

        <Example
          title="Solid"
          code={`<Badge appearance="solid" variant="accent">Beta</Badge>
<Badge appearance="solid" variant="success">Live</Badge>
<Badge appearance="solid" variant="danger">3</Badge>`}
        >
          {variants.map((v) => (
            <Badge key={v} appearance="solid" variant={v}>{v[0].toUpperCase() + v.slice(1)}</Badge>
          ))}
        </Example>

        <Example title="Sizes — 16 / 20" code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`}>
          <Badge size="sm" variant="accent">Small</Badge>
          <Badge size="md" variant="accent">Medium</Badge>
        </Example>

        <Example
          title="Status dot"
          code={`<Badge dot variant="success">Active</Badge>
<Badge dot variant="warn">Trial ends soon</Badge>
<Badge dot variant="danger">Suspended</Badge>
<Badge dot>Invited</Badge>`}
        >
          <Badge dot variant="success">Active</Badge>
          <Badge dot variant="warn">Trial ends soon</Badge>
          <Badge dot variant="danger">Suspended</Badge>
          <Badge dot>Invited</Badge>
        </Example>

        <Example title="With icon" code={`<Badge icon="★" variant="accent">Featured</Badge>`}>
          <Badge icon="★" variant="accent">Featured</Badge>
          <Badge icon="⚑" variant="warn" appearance="solid">Flagged</Badge>
        </Example>

        <Example
          title="Removable (filter chips)"
          code={`<Badge removable onRemove={() => remove('Design')}>Design</Badge>`}
        >
          {tags.map((tag) => (
            <Badge key={tag} variant="accent" removable onRemove={() => setTags((t) => t.filter((x) => x !== tag))}>
              {tag}
            </Badge>
          ))}
          {tags.length === 0 && <Badge variant="outline">No filters</Badge>}
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Badge props (plus all native <span> attributes)"
          rows={[
            { name: 'variant', type: "'neutral' | 'accent' | 'success' | 'warn' | 'danger' | 'outline'", default: "'neutral'", description: 'Colour intent. outline is a neutral ring with no fill.' },
            { name: 'appearance', type: "'subtle' | 'solid'", default: "'subtle'", description: 'subtle = tinted bg-*-subtle with coloured text; solid = bg-* fill with text-on-*.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Height 16 / 20; font-size-2xs / xs.' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Leading status dot in the variant colour.' },
            { name: 'icon', type: 'ReactNode', description: 'Decorative leading icon (aria-hidden).' },
            { name: 'removable', type: 'boolean', default: 'false', description: 'Adds an "×" button labelled "Remove <label>".' },
            { name: 'onRemove', type: '(event) => void', description: 'Called when the remove button is pressed.' },
            { name: 'removeLabel', type: 'string', description: 'Plain-text label for the remove button when children is not a string.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Renders as an inline <span>; the text is the accessible content. Never rely on colour alone — the dot and label carry meaning together.',
            'Subtle and solid pairs are AA-contrast text/background tokens in both themes.',
            'Removable badges expose a real <button> named "Remove <label>", focusable with Tab and activated with Enter/Space.',
            'Icons and dots are aria-hidden; pass removeLabel when the badge content is not plain text.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
