import { Button, EmptyState, Icon } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';


const panel = { width: '100%', border: 'var(--ds-border-width-thin) dashed var(--ds-color-border)', borderRadius: 'var(--ds-radius-lg)' } as const;

export function EmptyStateDocs() {
  return (
    <DocSection id="empty-state" eyebrow="Components" title="EmptyState" description="What a table, list or panel shows when there is nothing to display: an icon tile, a short title, a muted explanation and the action that fills it.">
      <CodeBlock label="EmptyState import" code={`import { EmptyState } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="First-run (primary + secondary action)"
          code={`<EmptyState
  icon={<Icon name="folder" />}
  title="No projects yet"
  description="Projects group your environments, deployments and team members in one place."
  action={<Button>New project</Button>}
  secondaryAction={<Button variant="secondary">Import from GitHub</Button>}
/>`}
        >
          <div style={panel}>
            <EmptyState
              icon={<Icon name="folder" />}
              title="No projects yet"
              description="Projects group your environments, deployments and team members in one place."
              action={<Button>New project</Button>}
              secondaryAction={<Button variant="secondary">Import from GitHub</Button>}
            />
          </div>
        </Example>

        <Example
          title="No results (filtered table)"
          code={`<EmptyState
  icon={<Icon name="search" />}
  title='No results for "quarterly"'
  description="Try a different keyword or clear the filters."
  action={<Button variant="secondary">Clear filters</Button>}
/>`}
        >
          <div style={panel}>
            <EmptyState
              icon={<Icon name="search" />}
              title='No results for "quarterly"'
              description="Try a different keyword or clear the filters."
              action={<Button variant="secondary">Clear filters</Button>}
            />
          </div>
        </Example>

        <Example
          title="Small, inside a card"
          code={`<EmptyState size="sm" icon={<Icon name="inbox" />} title="No comments" description="Be the first to leave a comment." action={<Button size="sm" variant="secondary">Add comment</Button>} />`}
        >
          <div style={{ ...panel, maxWidth: 'calc(var(--ds-space-16) * 5)' }}>
            <EmptyState size="sm" icon={<Icon name="inbox" />} title="No comments" description="Be the first to leave a comment." action={<Button size="sm" variant="secondary">Add comment</Button>} />
          </div>
        </Example>

        <Example title="Without the tile" code={`<EmptyState tile={false} icon={<Icon name="inbox" />} title="Inbox zero" description="Nothing needs your attention." />`}>
          <div style={panel}>
            <EmptyState tile={false} icon={<Icon name="inbox" />} title="Inbox zero" description="Nothing needs your attention." />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="EmptyState props (plus native <div> attributes)"
          rows={[
            { name: 'title', type: 'ReactNode', description: 'Required. Short and specific ("No projects yet", not "Empty").' },
            { name: 'description', type: 'ReactNode', description: 'Muted explanation of why it is empty or what to do next.' },
            { name: 'icon', type: 'ReactNode', description: 'Decorative icon (aria-hidden), 24px in md and 20px in sm.' },
            { name: 'tile', type: 'boolean', default: 'true', description: 'Wraps the icon in a bg-subtle tile (radius-xl) with a dashed ring.' },
            { name: 'action', type: 'ReactNode', description: 'Primary call to action, usually a primary Button.' },
            { name: 'secondaryAction', type: 'ReactNode', description: 'Low-emphasis alternative, e.g. a ghost Button.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Padding, type scale and tile size.' },
            { name: 'titleAs', type: "'h2' | 'h3' | 'h4' | 'p'", default: "'h3'", description: 'Heading level; use p when a heading would break the outline.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'The title is a real heading (h3 by default) so the state is discoverable from the headings list; set titleAs to match the outline.',
            'The icon and tile are aria-hidden; the title and description carry the meaning.',
            'Actions are ordinary Buttons: Tab to focus, Enter/Space to activate.',
            'Describe the next step in the description rather than relying on the illustration.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
