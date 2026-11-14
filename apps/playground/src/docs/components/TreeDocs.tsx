import { Tree, type TreeNode } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const files: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: 'folder',
    children: [
      {
        id: 'components',
        label: 'components',
        icon: 'folder',
        children: [
          { id: 'button', label: 'Button.tsx', icon: 'file-text' },
          { id: 'tree', label: 'Tree.tsx', icon: 'file-text' },
        ],
      },
      { id: 'index', label: 'index.ts', icon: 'file-text' },
    ],
  },
  { id: 'assets', label: 'assets', icon: 'folder', meta: '24', children: [{ id: 'logo', label: 'logo.svg', icon: 'gallery' }] },
  { id: 'secrets', label: '.env', icon: 'lock-keyhole', disabled: true },
  { id: 'readme', label: 'README.md', icon: 'document' },
];

const records: TreeNode[] = [
  { id: 'accounts', label: 'Accounts', children: [{ id: 'acme', label: 'Acme Corp' }, { id: 'globex', label: 'Globex' }] },
  { id: 'contacts', label: 'Contacts', children: [{ id: 'ada', label: 'Ada Lovelace' }] },
];

const column = { width: 'var(--ds-size-panel-md)' };

export function TreeDocs() {
  return (
    <DocSection
      id="tree"
      eyebrow="Components"
      title="Tree"
      description="A hierarchical list whose branches expand and collapse, such as folders or a record hierarchy. One item can be selected at a time."
    >
      <CodeBlock label="Tree import" code={`import { Tree, type TreeNode } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Files with icons"
          code={`const items: TreeNode[] = [
  { id: 'src', label: 'src', icon: 'folder', children: [
    { id: 'components', label: 'components', icon: 'folder', children: [
      { id: 'button', label: 'Button.tsx', icon: 'file-text' },
    ] },
  ] },
  { id: 'secrets', label: '.env', icon: 'lock-keyhole', disabled: true },
];

<Tree aria-label="Project files" items={items} defaultExpandedIds={['src', 'components']} defaultSelectedId="tree" />`}
        >
          <div style={column}>
            <Tree aria-label="Project files" items={files} defaultExpandedIds={['src', 'components']} defaultSelectedId="tree" />
          </div>
        </Example>

        <Example title="Framed, small, no icons" code={`<Tree aria-label="Records" variant="framed" size="sm" items={items} defaultExpandedIds={['accounts']} />`}>
          <div style={column}>
            <Tree aria-label="Records" variant="framed" size="sm" items={records} defaultExpandedIds={['accounts']} defaultSelectedId="globex" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Tree props (plus native <ul> attributes)"
          rows={[
            { name: 'items', type: 'TreeNode[]', description: '{ id, label, textValue?, icon?, meta?, children?, disabled? } nodes.' },
            { name: 'selectedId', type: 'string | null', description: 'Controlled selected node.' },
            { name: 'defaultSelectedId', type: 'string | null', description: 'Initially selected node (uncontrolled).' },
            { name: 'onSelectedChange', type: '(id: string) => void', description: 'Called when a node is selected.' },
            { name: 'expandedIds', type: 'string[]', description: 'Controlled expanded branches.' },
            { name: 'defaultExpandedIds', type: 'string[]', default: '[]', description: 'Initially expanded branches.' },
            { name: 'onExpandedChange', type: '(ids: string[]) => void', description: 'Called when a branch opens or closes.' },
            { name: 'variant', type: "'default' | 'framed'", default: "'default'", description: 'Bare, or in a tinted frame.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Row height 26 / 32.' },
            { name: 'items[].textValue', type: 'string', description: 'Type-ahead text when the label is not plain text.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'role="tree" (label it with aria-label) of role="treeitem" nodes with aria-level, aria-setsize, aria-posinset, aria-expanded on branches and aria-selected; child lists are role="group".',
            'One tab stop (roving tabindex). Down/Up move between visible nodes; Right opens a branch then moves to its first child; Left closes it or moves to the parent; Home/End jump.',
            'Enter or Space selects. Typing a character jumps to the next node starting with it; * expands all sibling branches.',
            'Disabled nodes stay focusable (aria-disabled) but cannot be selected or expanded.',
            'Chevrons and icons are aria-hidden; the focus ring is drawn on the row, the selected row uses the accent tint.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
