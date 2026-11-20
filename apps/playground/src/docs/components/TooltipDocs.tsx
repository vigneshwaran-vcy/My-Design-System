import { Button, ButtonIcon, Icon, Kbd, Tooltip } from '@my-ds/ui';
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
          title="Rich tip — picture, title and instruction"
          code={`<Tooltip
  title="Quick search"
  media={<img src="/tips/search.png" alt="" />}
  content="Press ⌘K anywhere to jump to any page, person or file."
  placement="bottom"
>
  <ButtonIcon icon="search" label="Search" variant="border" />
</Tooltip>`}
        >
          <Tooltip
            title="Quick search"
            placement="bottom"
            delay={0}
            media={
              <div className="doc-tip-media" aria-hidden="true">
                <span className="doc-tip-media__bar">
                  <Icon name="search" />
                  <span>Search Acme…</span>
                  <Kbd size="sm" keys={['cmd', 'K']} />
                </span>
              </div>
            }
            content="Press ⌘K anywhere to jump to any page, person or file."
          >
            <ButtonIcon icon="search" label="Search" variant="border" />
          </Tooltip>
          <Tooltip
            title="Pin to sidebar"
            placement="right"
            delay={0}
            media={
              <div className="doc-tip-media doc-tip-media--pin" aria-hidden="true">
                <Icon name="star" />
              </div>
            }
            content="Pinned pages stay at the top of the sidebar, for everyone in the workspace."
          >
            <ButtonIcon icon="star" label="Pin page" variant="border" />
          </Tooltip>
        </Example>

        <Example title="Without the arrow" code={`<Tooltip content="No pointer" arrow={false}>…</Tooltip>`}>
          <Tooltip content="No pointer" arrow={false}>
            <Button variant="secondary">No arrow</Button>
          </Tooltip>
        </Example>

        <Example
          title="No delay"
          code={`<Tooltip content="Shows immediately" delay={0}>
  <Button variant="secondary">Instant</Button>
</Tooltip>`}
        >
          <Tooltip content="Shows immediately" delay={0}>
            <Button variant="secondary">Instant</Button>
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
            { name: 'arrow', type: 'boolean', default: 'true', description: 'Small pointer towards the trigger, in the bubble colour.' },
            { name: 'title', type: 'ReactNode', description: 'Bold first line; turns the tooltip into a wider rich tip.' },
            { name: 'media', type: 'ReactNode', description: 'Picture above the text (<img alt=""> or a preview); also makes it a rich tip. Use for feature tips and how-tos, still nothing essential.' },
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
