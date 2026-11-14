import { Button, Menu, type MenuItem, Icon } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const pageActions: MenuItem[] = [
  { id: 'rename', label: 'Rename', icon: <Icon name="pen" />, shortcut: '⌘R' },
  { id: 'duplicate', label: 'Duplicate', icon: <Icon name="copy" />, shortcut: '⌘D' },
  { id: 'move', label: 'Move to…', icon: <Icon name="arrow-right" /> },
  { id: 'sep-1', type: 'separator' },
  { id: 'share-label', type: 'label', label: 'Sharing' },
  { id: 'copy-link', label: 'Copy link', icon: <Icon name="link" /> },
  { id: 'publish', label: 'Publish to web', icon: <Icon name="arrow-right-up" />, disabled: true },
  { id: 'sep-2', type: 'separator' },
  { id: 'delete', label: 'Delete', icon: <Icon name="trash" />, shortcut: '⌫', danger: true },
];

const rowActions: MenuItem[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'archive', label: 'Archive' },
  { id: 'delete', label: 'Delete', danger: true },
];

export function MenuDocs() {
  const [last, setLast] = useState<string>();

  return (
    <DocSection id="menu" eyebrow="Components" title="Menu" description="An action menu opened from a button, following the WAI-ARIA menu button pattern. Use it for commands, not for picking a value: that is Dropdown.">
      <CodeBlock label="Menu import" code={`import { Menu, type MenuItem } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Actions — try arrows, Home/End, typing a letter, Enter, Escape"
          code={`const items: MenuItem[] = [
  { id: 'rename', label: 'Rename', icon: <Icon name="pen" />, shortcut: '⌘R' },
  { id: 'duplicate', label: 'Duplicate', icon: <Icon name="copy" />, shortcut: '⌘D' },
  { id: 'sep', type: 'separator' },
  { id: 'share', type: 'label', label: 'Sharing' },
  { id: 'publish', label: 'Publish to web', disabled: true },
  { id: 'delete', label: 'Delete', shortcut: '⌫', danger: true },
];
<Menu trigger={<Button variant="secondary">Actions</Button>} items={items} onSelect={(id) => …} />`}
        >
          <Menu trigger={<Button variant="secondary">Actions</Button>} items={pageActions} onSelect={setLast} />
          <span style={{ color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>
            {last ? `Selected: ${last}` : 'Nothing selected yet'}
          </span>
        </Example>

        <Example
          title="Aligned to the end — icon-only trigger"
          code={`<Menu placement="bottom-end" trigger={<Button variant="ghost" aria-label="More options"><Icon name="menu-dots" /></Button>} items={items} />`}
        >
          <div style={{ marginLeft: 'auto' }}>
            <Menu placement="bottom-end" trigger={<Button variant="ghost" aria-label="More options"><Icon name="menu-dots" /></Button>} items={rowActions} />
          </div>
        </Example>

        <Example
          title="Per-item handlers"
          code={`const items: MenuItem[] = [
  { id: 'edit', label: 'Edit', onSelect: () => startEditing() },
  { id: 'archive', label: 'Archive', onSelect: () => archive() },
];`}
        >
          <Menu
            trigger={<Button variant="secondary">Row</Button>}
            items={rowActions.map((item) => (item.type ? item : { ...item, onSelect: () => setLast(`${item.id} (item handler)`) }))}
          />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Menu props (rest props, className and ref go to the role=&quot;menu&quot; list)"
          rows={[
            { name: 'trigger', type: 'ReactElement', description: 'Cloned with aria-haspopup="menu", aria-expanded, aria-controls, a toggling onClick and ArrowDown/ArrowUp to open.' },
            { name: 'items', type: 'MenuItem[]', description: "Action items { id, label, icon?, shortcut?, danger?, disabled?, onSelect?, textValue? }, plus { type: 'separator' } and { type: 'label', label }." },
            { name: 'placement', type: "'bottom-start' | 'bottom-end'", default: "'bottom-start'", description: 'Which edge of the trigger the list aligns to.' },
            { name: 'open / defaultOpen', type: 'boolean', description: 'Controlled or initial open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires on every open and close.' },
            { name: 'onSelect', type: '(id: string) => void', description: 'Fires after the item’s own onSelect. The menu closes and focus returns to the trigger.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="menu" labelled by the trigger (or your aria-label); items are role="menuitem" with a roving tabindex, so only one is in the Tab order.',
            'Click, Enter or Space on the trigger opens on the first item; ArrowUp opens on the last.',
            'Arrow keys wrap and skip disabled items; Home/End jump; typing letters jumps by label (typeahead).',
            'Enter or Space selects; Escape closes and refocuses the trigger; Tab and outside clicks close without stealing focus.',
            'Danger items use text-danger with a danger-subtle active fill; shortcuts are aria-hidden display hints in mono.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
