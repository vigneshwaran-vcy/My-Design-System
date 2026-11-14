import { ButtonIcon, DynamicIcon } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function DynamicIconDocs() {
  const [strength, setStrength] = useState<0 | 1 | 2 | 3>(2);

  return (
    <DocSection
      id="dynamic-icon"
      eyebrow="Components"
      title="Dynamic Icon"
      description="Small animated glyphs that show a live status at a glance: work in progress, someone typing, a trend, a strength or score. Animations stop under prefers-reduced-motion; each state still reads when static."
    >
      <CodeBlock label="DynamicIcon import" code={`import { DynamicIcon } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Activity: ellipsis, typing, equalizer"
          code={`<DynamicIcon variant="ellipsis" />
<DynamicIcon variant="typing" />
<DynamicIcon variant="eq" />`}
        >
          <DynamicIcon variant="ellipsis" />
          <DynamicIcon variant="typing" />
          <DynamicIcon variant="eq" />
        </Example>

        <Example
          title="Trend"
          code={`<DynamicIcon variant="trend" direction="up" />
<DynamicIcon variant="trend" direction="down" />
<DynamicIcon variant="trend" direction="neutral" />`}
        >
          <DynamicIcon variant="trend" direction="up" />
          <DynamicIcon variant="trend" direction="down" />
          <DynamicIcon variant="trend" direction="neutral" />
        </Example>

        <Example
          title="Strength 0–3"
          code={`<DynamicIcon variant="strength" value={strength} />`}
        >
          {([0, 1, 2, 3] as const).map((value) => (
            <DynamicIcon key={value} variant="strength" value={value} />
          ))}
          <ButtonIcon
            variant="border"
            size="sm"
            icon="refresh"
            label="Cycle strength"
            onClick={() => setStrength((s) => (((s + 1) % 4) as 0 | 1 | 2 | 3))}
          />
          <DynamicIcon variant="strength" value={strength} size="lg" />
        </Example>

        <Example
          title="Score"
          code={`<DynamicIcon variant="score" score="positive" />
<DynamicIcon variant="score" score="negative" />`}
        >
          <DynamicIcon variant="score" score="positive" />
          <DynamicIcon variant="score" score="negative" />
        </Example>

        <Example
          title="Waffle (ripples on hover / focus of its button)"
          code={`<ButtonIcon variant="bare" label="App launcher" icon={<DynamicIcon variant="waffle" size="sm" />} />`}
        >
          <ButtonIcon variant="bare" label="App launcher" icon={<DynamicIcon variant="waffle" size="sm" />} />
          <ButtonIcon variant="border" size="lg" label="All apps" icon={<DynamicIcon variant="waffle" />} />
        </Example>

        <Example
          title="Sizes — 16 / 20 / 24"
          code={`<DynamicIcon variant="eq" size="sm" />
<DynamicIcon variant="eq" size="md" />
<DynamicIcon variant="eq" size="lg" />`}
        >
          <DynamicIcon variant="eq" size="sm" />
          <DynamicIcon variant="eq" size="md" />
          <DynamicIcon variant="eq" size="lg" />
          <DynamicIcon variant="ellipsis" size="lg" paused label="Paused" />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="DynamicIcon props (plus native span attributes)"
          rows={[
            { name: 'variant', type: "'ellipsis' | 'typing' | 'eq' | 'trend' | 'strength' | 'score' | 'waffle'", description: 'Which glyph to draw (required).' },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '16 / 20 / 24 (icon sizes); typing is twice as wide.' },
            { name: 'direction', type: "'up' | 'down' | 'neutral'", default: "'neutral'", description: 'trend only. up = success, down = danger, neutral = muted.' },
            { name: 'value', type: '0 | 1 | 2 | 3', default: '0', description: 'strength only. 1 danger, 2 warn, 3 success.' },
            { name: 'score', type: "'positive' | 'negative'", default: "'positive'", description: 'score only. A solid success dot or a danger ring.' },
            { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the animation.' },
            { name: 'label', type: 'string', description: 'Accessible name; defaults to a description of the state ("Trending up", "Strength: weak").' },
            { name: 'decorative', type: 'boolean', description: 'Hide from assistive tech. waffle is decorative unless labelled.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Rendered as role="img" with an aria-label that states the value, so colour and motion are never the only signal.',
            'Override `label` with context ("Revenue trending up"); set `decorative` when nearby text already says it.',
            'For live updates (typing, working), announce the change in a separate aria-live region; the icon itself is not live.',
            'prefers-reduced-motion stops every animation and transition; static fallbacks keep each state legible.',
            'Status colours come from semantic tokens, so contrast holds in light and dark themes.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
