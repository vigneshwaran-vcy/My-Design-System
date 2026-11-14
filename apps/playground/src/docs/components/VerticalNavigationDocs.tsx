import { VerticalNavigation, VerticalNavigationItem, VerticalNavigationSection } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const Sections = () => (
  <>
    <VerticalNavigationSection title="Workspace">
      <VerticalNavigationItem value="home" icon="home">Home</VerticalNavigationItem>
      <VerticalNavigationItem value="inbox" icon="inbox" badge={12}>Inbox</VerticalNavigationItem>
      <VerticalNavigationItem value="calendar" icon="calendar">Calendar</VerticalNavigationItem>
      <VerticalNavigationItem value="billing" icon="wallet" disabled>Billing</VerticalNavigationItem>
    </VerticalNavigationSection>
    <VerticalNavigationSection title="Reports" collapsible>
      <VerticalNavigationItem value="recent" icon="clock-circle">Recent</VerticalNavigationItem>
      <VerticalNavigationItem value="shared" icon="share" badge={3}>Shared with me</VerticalNavigationItem>
    </VerticalNavigationSection>
    <VerticalNavigationSection title="Archive" collapsible defaultOpen={false}>
      <VerticalNavigationItem value="2025" icon="folder">2025</VerticalNavigationItem>
    </VerticalNavigationSection>
  </>
);

const column = { width: 'var(--ds-size-panel-sm)' };

export function VerticalNavigationDocs() {
  return (
    <DocSection
      id="vertical-navigation"
      eyebrow="Components"
      title="Vertical Navigation"
      description="A sidebar of titled sections with links to the pages of an app. The current page is a quiet raised row; sections can collapse to keep long sidebars short."
    >
      <CodeBlock
        label="Vertical navigation import"
        code={`import { VerticalNavigation, VerticalNavigationSection, VerticalNavigationItem } from '@my-ds/ui';`}
      />

      <SubSection title="Examples">
        <Example
          title="Default"
          code={`<VerticalNavigation aria-label="Workspace" defaultValue="home">
  <VerticalNavigationSection title="Workspace">
    <VerticalNavigationItem value="home" icon="home">Home</VerticalNavigationItem>
    <VerticalNavigationItem value="inbox" icon="inbox" badge={12}>Inbox</VerticalNavigationItem>
    <VerticalNavigationItem value="billing" icon="wallet" disabled>Billing</VerticalNavigationItem>
  </VerticalNavigationSection>
  <VerticalNavigationSection title="Reports" collapsible>
    <VerticalNavigationItem value="recent" icon="clock-circle">Recent</VerticalNavigationItem>
  </VerticalNavigationSection>
</VerticalNavigation>`}
        >
          <div style={column}>
            <VerticalNavigation aria-label="Workspace" defaultValue="home">
              <Sections />
            </VerticalNavigation>
          </div>
        </Example>

        <Example title="Framed" code={`<VerticalNavigation variant="framed" defaultValue="inbox">…</VerticalNavigation>`}>
          <div style={column}>
            <VerticalNavigation aria-label="Workspace (framed)" variant="framed" defaultValue="inbox">
              <Sections />
            </VerticalNavigation>
          </div>
        </Example>

        <Example title="Compact (size sm) with links" code={`<VerticalNavigation size="sm" defaultValue="overview">
  <VerticalNavigationSection title="Docs">
    <VerticalNavigationItem value="overview" href="/docs">Overview</VerticalNavigationItem>
    <VerticalNavigationItem value="install" href="/docs/install">Installation</VerticalNavigationItem>
  </VerticalNavigationSection>
</VerticalNavigation>`}>
          <div style={column}>
            <VerticalNavigation aria-label="Docs" size="sm" defaultValue="overview">
              <VerticalNavigationSection title="Docs">
                <VerticalNavigationItem value="overview" href="#vertical-navigation" icon="document">Overview</VerticalNavigationItem>
                <VerticalNavigationItem value="install" href="#vertical-navigation" icon="download">Installation</VerticalNavigationItem>
                <VerticalNavigationItem value="tokens" href="#vertical-navigation" icon="palette">Tokens</VerticalNavigationItem>
              </VerticalNavigationSection>
            </VerticalNavigation>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="VerticalNavigation props (plus native <nav> attributes)"
          rows={[
            { name: 'value', type: 'string', description: 'Controlled current item.' },
            { name: 'defaultValue', type: 'string', description: 'Initially current item (uncontrolled).' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'Called when an item is activated.' },
            { name: 'variant', type: "'default' | 'framed'", default: "'default'", description: 'Transparent, or in a tinted frame.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Row height 26 (compact) / 32.' },
            { name: 'aria-label', type: 'string', default: "'Navigation'", description: 'Landmark label for the <nav>.' },
          ]}
        />
        <PropsTable
          caption="VerticalNavigationSection props"
          rows={[
            { name: 'title', type: 'ReactNode', description: 'Section heading; also labels the list.' },
            { name: 'collapsible', type: 'boolean', default: 'false', description: 'Heading becomes a toggle button.' },
            { name: 'open / defaultOpen', type: 'boolean', default: 'true', description: 'Controlled / initial open state.' },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the section toggles.' },
            { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '2', description: 'Heading element for the title.' },
          ]}
        />
        <PropsTable
          caption="VerticalNavigationItem props"
          rows={[
            { name: 'value', type: 'string', description: 'Item id; current when it matches the navigation value.' },
            { name: 'href', type: 'string', description: 'Renders a link; without it the item is a button.' },
            { name: 'icon', type: 'IconName | ReactNode', description: 'Decorative leading Solar icon.' },
            { name: 'badge', type: 'ReactNode', description: 'Trailing count, part of the accessible name.' },
            { name: 'current', type: 'boolean', description: 'Forces the current state.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Not activatable; links lose their href.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'A <nav> landmark (label it when there is more than one) with each section a list labelled by its heading.',
            'The current item has aria-current="page".',
            'Items are native links or buttons in the normal Tab order; Up/Down/Home/End also move between items and section toggles.',
            'Collapsible headings are buttons with aria-expanded/aria-controls; closed lists are hidden and skipped by the keyboard.',
            'Icons are aria-hidden; collapse animation and transitions are off under prefers-reduced-motion.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
