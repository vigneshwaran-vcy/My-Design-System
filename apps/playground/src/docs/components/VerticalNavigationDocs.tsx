import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Icon,
  RadioButtonGroup,
  VerticalNavigation,
  VerticalNavigationItem,
  VerticalNavigationSection,
  type IconName,
  type VerticalNavigationProps,
  type VerticalNavigationSize,
  type VerticalNavigationVariant,
} from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

/* Sample data: the navigation of a project-management app. */
interface Page {
  id: string;
  label: string;
  icon: IconName;
  badge?: number;
  disabled?: boolean;
  summary: string;
  stats: [string, number][];
}

interface Group {
  title: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  pages: Page[];
}

const GROUPS: Group[] = [
  {
    title: 'Workspace',
    pages: [
      { id: 'home', label: 'Home', icon: 'home', summary: 'Your day at a glance: due tasks, mentions and recent pages.', stats: [['Due today', 4], ['Mentions', 2], ['Recent pages', 9]] },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12, summary: 'Updates from the projects and people you follow.', stats: [['Unread', 12], ['Assigned to you', 5], ['Archived this week', 31]] },
      { id: 'my-tasks', label: 'My tasks', icon: 'checklist', badge: 3, summary: 'Everything assigned to you, across all projects.', stats: [['Overdue', 3], ['This week', 8], ['Done', 21]] },
      { id: 'calendar', label: 'Calendar', icon: 'calendar', summary: 'Deadlines, milestones and meetings in one place.', stats: [['Today', 3], ['This week', 11], ['Milestones', 2]] },
      { id: 'reports', label: 'Reports', icon: 'chart-2', summary: 'Velocity, workload and progress across teams.', stats: [['Dashboards', 6], ['Shared', 3], ['Scheduled', 2]] },
    ],
  },
  {
    title: 'Projects',
    collapsible: true,
    pages: [
      { id: 'website', label: 'Website redesign', icon: 'widget', badge: 8, summary: 'New marketing site: IA, visual design and CMS migration.', stats: [['Open', 8], ['In review', 3], ['Done', 42]] },
      { id: 'mobile', label: 'Mobile app v2', icon: 'phone', summary: 'Offline mode, push notifications and the new onboarding.', stats: [['Open', 14], ['In review', 2], ['Done', 27]] },
      { id: 'launch', label: 'Q1 launch', icon: 'rocket', badge: 5, summary: 'Launch checklist, press kit and campaign timeline.', stats: [['Open', 5], ['Blocked', 1], ['Done', 18]] },
      { id: 'brand', label: 'Brand refresh', icon: 'palette', summary: 'Logo, colour, type and illustration guidelines.', stats: [['Open', 6], ['In review', 4], ['Done', 12]] },
    ],
  },
  {
    title: 'Team',
    collapsible: true,
    pages: [
      { id: 'members', label: 'Members', icon: 'users-group-rounded', badge: 24, summary: '24 people across design, engineering and marketing.', stats: [['Members', 24], ['Guests', 6], ['Pending invites', 2]] },
      { id: 'roles', label: 'Roles & access', icon: 'shield-check', summary: 'Who can view, edit and manage each space.', stats: [['Roles', 4], ['Admins', 3], ['Custom rules', 5]] },
      { id: 'billing', label: 'Billing', icon: 'wallet', disabled: true, summary: 'Only workspace owners can see billing.', stats: [] },
    ],
  },
  {
    title: 'Archive',
    collapsible: true,
    defaultOpen: false,
    pages: [
      { id: 'archive-2025', label: '2025 projects', icon: 'folder', summary: 'Projects closed in 2025.', stats: [['Projects', 9], ['Pages', 214], ['Files', 87]] },
      { id: 'archive-2024', label: '2024 projects', icon: 'folder', summary: 'Projects closed in 2024.', stats: [['Projects', 12], ['Pages', 301], ['Files', 140]] },
    ],
  },
];

const PAGES = GROUPS.flatMap((group) => group.pages.map((page) => ({ ...page, group: group.title })));

function SampleNav({ headingLevel = 4, ...props }: VerticalNavigationProps & { headingLevel?: 2 | 3 | 4 | 5 | 6 }) {
  return (
    <VerticalNavigation {...props}>
      {GROUPS.map((group) => (
        <VerticalNavigationSection
          key={group.title}
          title={group.title}
          collapsible={group.collapsible}
          defaultOpen={group.defaultOpen}
          headingLevel={headingLevel}
        >
          {group.pages.map((page) => (
            <VerticalNavigationItem key={page.id} value={page.id} icon={page.icon} badge={page.badge} disabled={page.disabled}>
              {page.label}
            </VerticalNavigationItem>
          ))}
        </VerticalNavigationSection>
      ))}
    </VerticalNavigation>
  );
}

function AppDemo() {
  const [current, setCurrent] = useState('website');
  const [variant, setVariant] = useState<VerticalNavigationVariant>('default');
  const [size, setSize] = useState<VerticalNavigationSize>('md');
  const page = PAGES.find((p) => p.id === current) ?? PAGES[0];

  return (
    <div className="demo">
      <div className="demo__controls">
        <RadioButtonGroup
          label="Variant"
          size="sm"
          options={[
            { value: 'default', label: 'Default' },
            { value: 'framed', label: 'Framed' },
          ]}
          value={variant}
          onChange={(v) => setVariant(v as VerticalNavigationVariant)}
        />
        <RadioButtonGroup
          label="Density"
          size="sm"
          options={[
            { value: 'md', label: 'Default' },
            { value: 'sm', label: 'Compact' },
          ]}
          value={size}
          onChange={(v) => setSize(v as VerticalNavigationSize)}
        />
      </div>

      <div className="demo-app">
        <div className="demo-panel">
          <div className="demo-panel__brand">
            <span className="demo-panel__logo" aria-hidden="true">N</span>
            <span className="demo-panel__name">Northwind</span>
          </div>
          <SampleNav aria-label="Northwind" value={current} onValueChange={setCurrent} variant={variant} size={size} />
        </div>
        <div className="demo-app__main">
          <div className="demo-app__bar">
            <Breadcrumb className="demo-app__crumbs" items={[{ label: 'Northwind' }, { label: page.group }, { label: page.label }]} />
            <Button size="sm" variant="secondary">Share</Button>
          </div>
          <div className="demo-app__body">
            <div className="demo-app__title">
              <Icon name={page.icon} className="demo-app__title-icon" />
              <h4>{page.label}</h4>
            </div>
            <p className="demo-app__meta">{page.summary}</p>
            <div className="demo-app__stats">
              {page.stats.map(([label, value]) => (
                <div key={label} className="demo-app__stat">
                  <span className="demo-app__stat-value">{value}</span>
                  <span className="demo-app__stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DATA_CODE = `const groups = [
  {
    title: 'Workspace',
    pages: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 12 },
      { id: 'my-tasks', label: 'My tasks', icon: 'checklist', badge: 3 },
    ],
  },
  {
    title: 'Projects',
    collapsible: true,
    pages: [
      { id: 'website', label: 'Website redesign', icon: 'widget', badge: 8 },
      { id: 'launch', label: 'Q1 launch', icon: 'rocket', badge: 5 },
    ],
  },
  {
    title: 'Team',
    collapsible: true,
    pages: [{ id: 'billing', label: 'Billing', icon: 'wallet', disabled: true }],
  },
];

<VerticalNavigation aria-label="Northwind" value={page} onValueChange={setPage}>
  {groups.map((group) => (
    <VerticalNavigationSection key={group.title} title={group.title} collapsible={group.collapsible}>
      {group.pages.map((p) => (
        <VerticalNavigationItem key={p.id} value={p.id} icon={p.icon} badge={p.badge} disabled={p.disabled}>
          {p.label}
        </VerticalNavigationItem>
      ))}
    </VerticalNavigationSection>
  ))}
</VerticalNavigation>`;

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

      <SubSection title="Sample app">
        <Example title="Project-management app (click a page, fold Projects or Team, open Archive)" code={DATA_CODE}>
          <AppDemo />
        </Example>
      </SubSection>

      <SubSection title="Examples">
        <Example title="Default" code={`<VerticalNavigation aria-label="Northwind" defaultValue="inbox">…</VerticalNavigation>`}>
          <div className="demo-frame demo-frame--column">
            <SampleNav aria-label="Northwind (default)" defaultValue="inbox" />
          </div>
        </Example>

        <Example title="Framed" code={`<VerticalNavigation variant="framed" defaultValue="launch">…</VerticalNavigation>`}>
          <div className="demo-frame demo-frame--column">
            <SampleNav aria-label="Northwind (framed)" variant="framed" defaultValue="launch" />
          </div>
        </Example>

        <Example
          title="Compact (size sm) with links"
          code={`<VerticalNavigation size="sm" defaultValue="tokens">
  <VerticalNavigationSection title="Getting started">
    <VerticalNavigationItem value="overview" href="/docs" icon="document">Overview</VerticalNavigationItem>
    <VerticalNavigationItem value="install" href="/docs/install" icon="download">Installation</VerticalNavigationItem>
  </VerticalNavigationSection>
</VerticalNavigation>`}
        >
          <div className="demo-frame demo-frame--column">
            <VerticalNavigation aria-label="Docs" size="sm" defaultValue="tokens">
              <VerticalNavigationSection title="Getting started" headingLevel={4}>
                <VerticalNavigationItem value="overview" href="#vertical-navigation" icon="document">Overview</VerticalNavigationItem>
                <VerticalNavigationItem value="install" href="#vertical-navigation" icon="download">Installation</VerticalNavigationItem>
                <VerticalNavigationItem value="changelog" href="#vertical-navigation" icon="sort-by-time" badge="New">Changelog</VerticalNavigationItem>
              </VerticalNavigationSection>
              <VerticalNavigationSection title="Foundations" collapsible headingLevel={4}>
                <VerticalNavigationItem value="tokens" href="#vertical-navigation" icon="palette">Tokens</VerticalNavigationItem>
                <VerticalNavigationItem value="icons" href="#vertical-navigation" icon="stars">Icons</VerticalNavigationItem>
                <VerticalNavigationItem value="motion" href="#vertical-navigation" icon="bolt">Motion</VerticalNavigationItem>
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
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Row height 22 (compact) / 26.' },
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
