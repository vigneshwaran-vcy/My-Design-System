import { Button, Tooltip } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

export function TooltipDocs() {
  return (
    <DocSection id="tooltip" eyebrow="Components" title="Tooltip" description="A short text hint shown on hover and keyboard focus. Supplementary only: never hide essential actions or information in a tooltip.">
      <CodeBlock label="Tooltip import" code={`import { Tooltip } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Basic — hover or focus the button"
          code={`<Tooltip content="Copy link to clipboard">
  <Button variant="secondary">Copy link</Button>
</Tooltip>`}
        >
          <Tooltip content="Copy link to clipboard">
            <Button variant="secondary">Copy link</Button>
          </Tooltip>
        </Example>

        <Example
          title="Placements"
          code={`<Tooltip content="Top" placement="top">…</Tooltip>
<Tooltip content="Bottom" placement="bottom">…</Tooltip>
<Tooltip content="Left" placement="left">…</Tooltip>
<Tooltip content="Right" placement="right">…</Tooltip>`}
        >
          {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
            <Tooltip key={placement} content={`Placement: ${placement}`} placement={placement}>
              <Button variant="secondary">{placement}</Button>
            </Tooltip>
          ))}
        </Example>

        <Example
          title="No delay"
          code={`<Tooltip content="Shows immediately" delay={0}>
  <Button variant="ghost">Instant</Button>
</Tooltip>`}
        >
          <Tooltip content="Shows immediately" delay={0}>
            <Button variant="ghost">Instant</Button>
          </Tooltip>
        </Example>

        <Example
          title="Disabled child — wrap it in a focusable span"
          code={`<Tooltip content="You need edit access to publish">
  <span tabIndex={0} style={{ display: 'inline-flex' }}>
    <Button disabled>Publish</Button>
  </span>
</Tooltip>`}
        >
          <Tooltip content="You need edit access to publish">
            <span tabIndex={0} style={{ display: 'inline-flex', borderRadius: 'var(--ds-radius-md)' }}>
              <Button disabled>Publish</Button>
            </span>
          </Tooltip>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Tooltip props (rest props, className and ref go to the role=&quot;tooltip&quot; bubble)"
          rows={[
            { name: 'content', type: 'ReactNode', description: 'The hint text. Keep it short and plain.' },
            { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Side of the child the bubble appears on (space-2 away, layer-tooltip).' },
            { name: 'delay', type: 'number', default: '300', description: 'Hover delay in ms. Keyboard focus always shows the tooltip immediately.' },
            { name: 'children', type: 'ReactElement', description: 'A single focusable element. It is cloned with aria-describedby and hover/focus/key handlers; its own handlers still run.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Bubble is role="tooltip" and always linked from the child via aria-describedby, so the hint is read even while hidden.',
            'Shows on focus as well as hover; Escape hides it without moving focus.',
            'The bubble is pointer-events: none and never receives focus, so it cannot trap anything.',
            'Disabled buttons fire no mouse or focus events: wrap them in <span tabIndex={0}> to keep the hint reachable.',
            'Inverse surface (bg-inverse / text-inverse) keeps high contrast in both themes; motion respects prefers-reduced-motion.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
