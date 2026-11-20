import { Button, ButtonGroup, ButtonIcon, type MenuItem } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const saveOptions: MenuItem[] = [
  { id: 'draft', label: 'Save as draft' },
  { id: 'template', label: 'Save as template' },
];
const moreActions: MenuItem[] = [
  { id: 'clone', label: 'Clone' },
  { id: 'share', label: 'Share' },
  { type: 'separator', id: 'sep' },
  { id: 'delete', label: 'Delete', danger: true },
];

export function ButtonGroupDocs() {
  const [last, setLast] = useState('none');
  const [view, setView] = useState('list');

  return (
    <DocSection
      id="button-group"
      eyebrow="Components"
      title="Button Group"
      description="Related secondary buttons joined into one segmented control: one outer edge, thin dividers, and only the fill changes on hover or press. Add a split menu for variations of the main action, or an overflow menu for low-priority actions."
    >
      <CodeBlock label="ButtonGroup import" code={`import { ButtonGroup } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Attached"
          code={`<ButtonGroup label="Record actions">
  <Button variant="secondary">Edit</Button>
  <Button variant="secondary">Follow</Button>
  <Button variant="secondary">New case</Button>
</ButtonGroup>`}
        >
          <ButtonGroup label="Record actions">
            <Button variant="secondary">Edit</Button>
            <Button variant="secondary">Follow</Button>
            <Button variant="secondary">New case</Button>
          </ButtonGroup>
        </Example>

        <Example
          title="Split button"
          code={`<ButtonGroup label="Save" menuItems={saveOptions} menuLabel="More save options" onMenuSelect={setLast}>
  <Button variant="secondary">Save</Button>
</ButtonGroup>
`}
        >
          <ButtonGroup label="Save" menuItems={saveOptions} menuLabel="More save options" onMenuSelect={setLast}>
            <Button variant="secondary" onClick={() => setLast('save')}>Save</Button>
          </ButtonGroup>
          <span className="doc-muted">Last action: {last}</span>
        </Example>

        <Example
          title="Overflow menu"
          code={`<ButtonGroup label="Record actions" menuItems={moreActions} menuIcon="menu-dots">
  <Button variant="secondary">Edit</Button>
  <Button variant="secondary">Follow</Button>
</ButtonGroup>`}
        >
          <ButtonGroup label="Record actions with overflow" menuItems={moreActions} menuIcon="menu-dots" onMenuSelect={setLast}>
            <Button variant="secondary">Edit</Button>
            <Button variant="secondary">Follow</Button>
          </ButtonGroup>
        </Example>

        <Example
          title="Sizes"
          code={`<ButtonGroup size="sm" …>…</ButtonGroup>  // sm · md · lg, passed to children`}
        >
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <ButtonGroup key={size} size={size} label={`Size ${size}`} menuItems={moreActions} menuIcon="menu-dots">
              <Button variant="secondary">Edit</Button>
              <Button variant="secondary">Follow</Button>
            </ButtonGroup>
          ))}
        </Example>

        <Example
          title="Icon toggle group"
          code={`<ButtonGroup label="View">
  <ButtonIcon icon="list" label="List view" selected={view === 'list'} onClick={() => setView('list')} />
  <ButtonIcon icon="widget" label="Grid view" selected={view === 'grid'} onClick={() => setView('grid')} />
</ButtonGroup>`}
        >
          <ButtonGroup label="View">
            <ButtonIcon icon="list" label="List view" selected={view === 'list'} onClick={() => setView('list')} />
            <ButtonIcon icon="widget" label="Grid view" selected={view === 'grid'} onClick={() => setView('grid')} />
            <ButtonIcon icon="chart-2" label="Chart view" selected={view === 'chart'} onClick={() => setView('chart')} />
          </ButtonGroup>
        </Example>

        <Example title="Disabled" code={`<Button variant="secondary" disabled>Follow</Button>  // + menuDisabled`}>
          <ButtonGroup label="Disabled actions" menuItems={moreActions} menuDisabled>
            <Button variant="secondary">Edit</Button>
            <Button variant="secondary" disabled>Follow</Button>
          </ButtonGroup>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="ButtonGroup props (plus native div attributes)"
          rows={[
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Passed to every child Button / ButtonIcon without its own size, and to the menu button.' },
            { name: 'label', type: 'string', description: 'Accessible name of the group (aria-label).' },
            { name: 'menuItems', type: 'MenuItem[]', description: 'Adds a trailing split / overflow Menu with these items.' },
            { name: 'menuLabel', type: 'string', default: "'More actions'", description: 'Accessible name of the menu button.' },
            { name: 'menuIcon', type: 'IconName', default: "'alt-arrow-down'", description: "Use 'menu-dots' for an overflow menu." },
            { name: 'onMenuSelect', type: '(id: string) => void', description: 'Fires with the chosen menu item id.' },
            { name: 'menuDisabled', type: 'boolean', default: 'false', description: 'Disables the menu button.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'The wrapper is role="group" named by `label`, so screen readers announce the set.',
            'Each button keeps its own Tab stop (SLDS button group pattern); use a toolbar if you need arrow-key navigation.',
            'The menu button follows the WAI-ARIA menu button pattern: aria-haspopup="menu", aria-expanded; Enter/Space/ArrowDown open it, ArrowUp opens on the last item, Escape closes and returns focus.',
            'The menu button is icon-only, so `menuLabel` names it; make it specific ("More save options").',
            'Hovered, focused and selected segments stack above their neighbours so their ring and focus halo are never clipped.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
