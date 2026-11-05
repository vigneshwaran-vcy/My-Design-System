import { Kbd } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--ds-space-8)', width: '100%', maxWidth: 'calc(var(--ds-space-16) * 4)', fontSize: 'var(--ds-font-size-sm)' } as const;

export function KbdDocs() {
  return (
    <DocSection id="kbd" eyebrow="Components" title="Kbd" description="A keycap for keyboard shortcuts in menus, tooltips and command palettes. Pass keys for a combination; common names become their symbol with the full word for screen readers.">
      <CodeBlock label="Kbd import" code={`import { Kbd } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Shortcuts" code={`<Kbd keys={['cmd', 'K']} />
<Kbd keys={['cmd', 'shift', 'P']} />
<Kbd keys={['ctrl', 'alt', 'delete']} separator="+" />
<Kbd keys={['enter']} />`}>
          <Kbd keys={['cmd', 'K']} />
          <Kbd keys={['cmd', 'shift', 'P']} />
          <Kbd keys={['ctrl', 'alt', 'delete']} separator="+" />
          <Kbd keys={['enter']} />
        </Example>

        <Example title="Single key from children" code={`<Kbd>Esc</Kbd>
<Kbd>?</Kbd>`}>
          <Kbd>Esc</Kbd>
          <Kbd>?</Kbd>
        </Example>

        <Example title="Sizes" code={`<Kbd size="sm" keys={['cmd', 'K']} />
<Kbd size="md" keys={['cmd', 'K']} />`}>
          <Kbd size="sm" keys={['cmd', 'K']} />
          <Kbd size="md" keys={['cmd', 'K']} />
        </Example>

        <Example
          title="In a menu"
          code={`<li className="menu-item">
  <span>Search projects</span>
  <Kbd size="sm" keys={['cmd', 'K']} />
</li>`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-2)', width: '100%' }}>
            <div style={row}><span>Search projects</span><Kbd size="sm" keys={['cmd', 'K']} /></div>
            <div style={row}><span>New issue</span><Kbd size="sm" keys={['C']} /></div>
            <div style={row}><span>Toggle sidebar</span><Kbd size="sm" keys={['cmd', 'B']} /></div>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Kbd props (plus native attributes)"
          rows={[
            { name: 'keys', type: 'string[]', description: 'One keycap per entry. cmd/shift/alt/ctrl/enter/tab/esc/backspace/delete/space and arrow names map to symbols. Overrides children.' },
            { name: 'children', type: 'ReactNode', description: 'A single keycap when keys is not set.' },
            { name: 'separator', type: 'ReactNode', default: 'null', description: 'Placed between keycaps (aria-hidden), e.g. "+". By default keys are spaced only.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'font-size-2xs at 20px, or font-size-xs at 22px.' },
          ]}
        />
        <CodeBlock
          label="Key symbol map"
          code={`import { KBD_SYMBOLS, resolveKey } from '@my-ds/ui';
resolveKey('cmd'); // { symbol: '⌘', label: 'Command' }`}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Renders a real <kbd> element per key, so the semantics survive copy and assistive tech.',
            'Symbol keys carry aria-label with the full word (⌘ → "Command", ⇧ → "Shift"); letters are read as-is.',
            'Separators are aria-hidden; the keys alone describe the shortcut.',
            'Kbd is static — it never receives focus. Put the shortcut in the item\'s tooltip or label text as well if the shortcut matters.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
