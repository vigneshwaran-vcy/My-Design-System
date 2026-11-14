import { Avatar, Badge, ButtonIcon, Icon, Tile } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const caseMedia = (
  <span
    style={{
      display: 'inline-flex',
      padding: 'var(--ds-space-2)',
      borderRadius: 'var(--ds-radius-md)',
      background: 'var(--ds-color-bg-accent-subtle)',
      color: 'var(--ds-color-text-accent)',
    }}
  >
    <Icon name="case" size="md" />
  </span>
);

const details = [
  { label: 'Owner', value: 'Ada Lovelace' },
  { label: 'Stage', value: 'Negotiation' },
];

export function TileDocs() {
  return (
    <DocSection
      id="tile"
      eyebrow="Components"
      title="Tile"
      description="A media + title + body + actions block for list content: records in a related list, search results, people. Use a Card when the content is a standalone panel rather than an item in a list."
    >
      <CodeBlock label="Tile import" code={`import { Tile } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Card tile with details and actions"
          code={`<Tile
  variant="card"
  title="Acme Corporation"
  href="/accounts/acme"
  media={<IconTile name="case" />}
  details={[{ label: 'Owner', value: 'Ada Lovelace' }, { label: 'Stage', value: 'Negotiation' }]}
  actions={<ButtonIcon variant="bare" size="xs" icon="menu-dots" label="Acme Corporation actions" />}
/>`}
        >
          <div className="doc-stack">
            <Tile
              variant="card"
              title="Acme Corporation"
              href="#tile"
              media={caseMedia}
              details={details}
              actions={<ButtonIcon variant="bare" size="xs" icon="menu-dots" label="Acme Corporation actions" />}
            />
          </div>
        </Example>

        <Example
          title="Plain tiles in a list"
          code={`<ul>
  <li><Tile title="Grace Hopper" media={<Avatar name="Grace Hopper" size="sm" />}>Rear Admiral</Tile></li>
  …
</ul>`}
        >
          <ul className="doc-stack" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {['Grace Hopper', 'Alan Turing', 'Katherine Johnson'].map((name) => (
              <li key={name}>
                <Tile
                  title={name}
                  href="#tile"
                  media={<Avatar name={name} size="sm" />}
                  actions={<ButtonIcon variant="bare" size="xs" icon="menu-dots" label={`${name} actions`} />}
                >
                  Customer since 2021
                </Tile>
              </li>
            ))}
          </ul>
        </Example>

        <Example
          title="Sizes"
          code={`<Tile size="sm" … />
<Tile size="md" … />`}
        >
          <div className="doc-stack">
            <Tile variant="card" size="sm" title="Small tile" media={<Avatar size="xs" name="Small Tile" />} details={details} />
            <Tile variant="card" size="md" title="Medium tile" media={<Avatar size="sm" name="Medium Tile" />} details={details} />
          </div>
        </Example>

        <Example title="Custom body" code={`<Tile title="Q3 renewal">Closing next week · <Badge variant="success">On track</Badge></Tile>`}>
          <div className="doc-stack">
            <Tile variant="card" title="Q3 renewal" media={caseMedia}>
              Closing next week · <Badge variant="success">On track</Badge>
            </Tile>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Tile props (plus native article attributes)"
          rows={[
            { name: 'title', type: 'ReactNode', description: "Heading and the tile's accessible name." },
            { name: 'href', type: 'string', description: 'Turns the title into a link.' },
            { name: 'linkProps', type: 'AnchorHTMLAttributes', description: 'Extra props for the title link (target, rel, onClick…).' },
            { name: 'media', type: 'ReactNode', description: 'Leading avatar, icon tile or image.' },
            { name: 'actions', type: 'ReactNode', description: 'Trailing actions, e.g. a bare xs ButtonIcon or a Menu.' },
            { name: 'details', type: '{ label, value }[]', description: 'Key/value lines rendered as a <dl>.' },
            { name: 'variant', type: "'plain' | 'card'", default: "'plain'", description: 'plain: no surface · card: surface with a ring-edge shadow.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Compact text and gaps at sm.' },
            { name: 'titleAs', type: "'h2' … 'h6'", default: "'h3'", description: 'Heading level; match the page outline.' },
            { name: 'children', type: 'ReactNode', description: 'Body content below the details.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Renders an <article> named by its heading (aria-labelledby), so each tile is a navigable item.',
            'Pick `titleAs` to fit the page heading outline; render lists of tiles inside <ul>/<li>.',
            'The title link and actions are ordinary focusable controls in reading order — the tile itself is not a click target, avoiding nested interactive elements.',
            'Name each action button after its record ("Acme Corporation actions"), not just "More".',
            'Details are a <dl> of <dt>/<dd> pairs; card tiles show a focus ring around the whole tile while something inside has :focus-visible.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
