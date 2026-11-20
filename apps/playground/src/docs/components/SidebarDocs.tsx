import { useMemo, useState } from 'react';
import {
  Breadcrumb,
  Button,
  ButtonIcon,
  Icon,
  Kbd,
  Menu,
  Progress,
  SegmentedControl,
  Sidebar,
  SidebarUser,
  SidebarWorkspace,
  Switch,
  type SidebarItem,
  type SidebarSection,
  type SidebarSize,
  type SidebarVariant,
} from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

/* Sample workspace: a product team's space, after ClickUp / Notion. */
const WORKSPACE: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 8 },
      { id: 'my-tasks', label: 'My tasks', icon: 'checklist', badge: 3 },
      { id: 'calendar', label: 'Calendar', icon: 'calendar' },
      { id: 'dashboards', label: 'Dashboards', icon: 'chart-2' },
    ],
  },
  {
    id: 'favorites',
    title: 'Favorites',
    collapsible: true,
    items: [
      { id: 'fav-roadmap', label: 'Q1 roadmap', icon: 'target' },
      { id: 'fav-reviews', label: 'Design reviews', icon: 'pen' },
      { id: 'fav-sync', label: 'Weekly sync notes', icon: 'notebook' },
    ],
  },
  {
    id: 'spaces',
    title: 'Spaces',
    collapsible: true,
    action: { icon: 'add', label: 'New space' },
    items: [
      {
        id: 'product',
        label: 'Product',
        tone: 'accent',
        items: [
          { id: 'roadmap', label: 'Roadmap', icon: 'target' },
          { id: 'sprint-24', label: 'Sprint 24', icon: 'list', badge: 12 },
          { id: 'bugs', label: 'Bugs', icon: 'flag', badge: 5 },
          {
            id: 'specs',
            label: 'Specs',
            icon: 'folder',
            items: [
              { id: 'spec-auth', label: 'Auth v2', icon: 'file-text' },
              { id: 'spec-billing', label: 'Billing revamp', icon: 'file-text' },
              { id: 'spec-search', label: 'Global search', icon: 'file-text' },
            ],
          },
        ],
      },
      {
        id: 'design',
        label: 'Design',
        tone: 'success',
        items: [
          { id: 'design-system', label: 'Design system', icon: 'palette' },
          { id: 'brand', label: 'Brand refresh', icon: 'gallery' },
          { id: 'research', label: 'User research', icon: 'users-group-rounded' },
        ],
      },
      {
        id: 'marketing',
        label: 'Marketing',
        tone: 'warn',
        items: [
          { id: 'launch', label: 'Launch plan', icon: 'rocket' },
          { id: 'content', label: 'Content calendar', icon: 'calendar-mark' },
          { id: 'campaigns', label: 'Campaigns', icon: 'bolt' },
        ],
      },
      {
        id: 'engineering',
        label: 'Engineering',
        tone: 'neutral',
        items: [
          { id: 'backlog', label: 'Backlog', icon: 'layers' },
          { id: 'releases', label: 'Releases', icon: 'tag' },
          { id: 'incidents', label: 'Incidents', icon: 'shield-check', badge: 1 },
        ],
      },
    ],
  },
  {
    id: 'docs',
    title: 'Docs',
    collapsible: true,
    action: { icon: 'add', label: 'New doc' },
    items: [
      { id: 'handbook', label: 'Team handbook', icon: 'notebook' },
      { id: 'onboarding', label: 'Onboarding', icon: 'lightbulb' },
      { id: 'meeting-notes', label: 'Meeting notes', icon: 'pen-new-square' },
    ],
  },
  {
    id: 'more',
    title: 'More',
    collapsible: true,
    defaultOpen: false,
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings' },
      { id: 'archive', label: 'Archive', icon: 'archive' },
      { id: 'trash', label: 'Trash', icon: 'trash' },
    ],
  },
];

/** Section title + item labels from the root to the item, for the breadcrumb. */
function pathTo(id: string): { section?: string; items: SidebarItem[] } {
  const walk = (items: SidebarItem[], trail: SidebarItem[]): SidebarItem[] | null => {
    for (const item of items) {
      const next = [...trail, item];
      if (item.id === id) return next;
      const found = item.items && walk(item.items, next);
      if (found) return found;
    }
    return null;
  };
  for (const section of WORKSPACE) {
    const found = walk(section.items, []);
    if (found) return { section: section.title, items: found };
  }
  return { items: [] };
}

const STATS = [
  { label: 'Open', value: 12, icon: 'list' },
  { label: 'In review', value: 4, icon: 'eye' },
  { label: 'Done this week', value: 18, icon: 'check-circle' },
] as const;

const workspaceMenu = (
  <Menu
    trigger={<SidebarWorkspace name="Acme Inc." meta="Business · 24 members" />}
    items={[
      { id: 'label', type: 'label', label: 'Workspaces' },
      { id: 'acme', label: 'Acme Inc.', icon: <Icon name="check" /> },
      { id: 'side', label: 'Side project', icon: <Icon name="case" /> },
      { id: 'sep', type: 'separator' },
      { id: 'invite', label: 'Invite members', icon: <Icon name="users-group-rounded" /> },
      { id: 'ws-settings', label: 'Workspace settings', icon: <Icon name="settings" /> },
    ]}
  />
);

const userMenu = (
  <Menu
    placement="top-start"
    trigger={<SidebarUser name="Maya Chen" meta="maya@acme.com" status="online" />}
    items={[
      { id: 'profile', label: 'Profile', icon: <Icon name="user" /> },
      { id: 'prefs', label: 'Preferences', icon: <Icon name="settings" /> },
      { id: 'help', label: 'Help & support', icon: <Icon name="question-circle" /> },
      { id: 'sep', type: 'separator' },
      { id: 'logout', label: 'Log out', icon: <Icon name="logout" />, danger: true },
    ]}
  />
);

const usageCard = (
  <div className="sb-usage">
    <Progress size="sm" value={68} label="Storage" showValue />
    <span className="sb-usage__meta">6.8 GB of 10 GB used</span>
  </div>
);

function AppDemo() {
  const [current, setCurrent] = useState('sprint-24');
  const [collapsed, setCollapsed] = useState(false);
  const [variant, setVariant] = useState<SidebarVariant>('default');
  const [size, setSize] = useState<SidebarSize>('md');
  const path = useMemo(() => pathTo(current), [current]);
  const page = path.items[path.items.length - 1];

  return (
    <div className="demo">
      <div className="demo__controls">
        <SegmentedControl
          label="Variant"
          size="sm"
          options={[
            { value: 'default', label: 'Default' },
            { value: 'floating', label: 'Floating' },
          ]}
          value={variant}
          onChange={(v) => setVariant(v as SidebarVariant)}
        />
        <SegmentedControl
          label="Density"
          size="sm"
          options={[
            { value: 'md', label: 'Default' },
            { value: 'sm', label: 'Compact' },
          ]}
          value={size}
          onChange={(v) => setSize(v as SidebarSize)}
        />
        <Switch label="Collapsed" size="sm" checked={collapsed} onChange={setCollapsed} />
      </div>

      <div className="demo-app" data-variant={variant}>
        <Sidebar
          sections={WORKSPACE}
          value={current}
          onValueChange={setCurrent}
          variant={variant}
          size={size}
          collapsed={collapsed}
          navLabel="Acme Inc."
          headingLevel={4}
          searchable
          searchPlaceholder="Search pages"
          searchShortcut={<Kbd size="sm">⌘K</Kbd>}
          header={workspaceMenu}
          footer={
            <>
              {!collapsed && usageCard}
              {userMenu}
            </>
          }
        />
        <div className="demo-app__main">
          <div className="demo-app__bar">
            <ButtonIcon
              icon="sidebar-minimalistic"
              label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              variant="bare"
              size="sm"
              selected={collapsed}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Breadcrumb
              className="demo-app__crumbs"
              maxItems={4}
              items={[
                { label: 'Acme Inc.' },
                ...(path.section ? [{ label: path.section }] : []),
                ...path.items.map((item) => ({ label: item.label })),
              ]}
            />
            <Button size="sm" variant="secondary">Share</Button>
          </div>
          <div className="demo-app__body">
            <div className="demo-app__title">
              {page?.icon && <Icon name={page.icon} className="demo-app__title-icon" />}
              <h4>{page?.label}</h4>
            </div>
            <p className="demo-app__meta">Updated 2 hours ago by Maya Chen</p>
            <div className="demo-app__stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="demo-app__stat">
                  <Icon name={stat.icon} className="demo-app__stat-icon" />
                  <span className="demo-app__stat-value">{stat.value}</span>
                  <span className="demo-app__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SMALL: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 8 },
      { id: 'my-tasks', label: 'My tasks', icon: 'checklist' },
    ],
  },
  {
    id: 'spaces',
    title: 'Spaces',
    items: [
      { id: 'product', label: 'Product', tone: 'accent', items: [{ id: 'roadmap', label: 'Roadmap', icon: 'target' }] },
      { id: 'design', label: 'Design', tone: 'success' },
      { id: 'marketing', label: 'Marketing', tone: 'warn' },
    ],
  },
];

const DATA_CODE = `const sections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 8 },
    ],
  },
  {
    id: 'spaces',
    title: 'Spaces',
    collapsible: true,
    action: { icon: 'add', label: 'New space', onClick: createSpace },
    items: [
      {
        id: 'product',
        label: 'Product',
        tone: 'accent',              // letter tile instead of an icon
        items: [
          { id: 'roadmap', label: 'Roadmap', icon: 'target' },
          { id: 'sprint-24', label: 'Sprint 24', icon: 'list', badge: 12 },
        ],
      },
    ],
  },
];

<Sidebar
  sections={sections}
  value={page}
  onValueChange={(id) => navigate(id)}
  searchable
  searchShortcut={<Kbd size="sm">⌘K</Kbd>}
  header={<Menu trigger={<SidebarWorkspace name="Acme Inc." meta="Business · 24 members" />} items={…} />}
  footer={<Menu placement="top-start" trigger={<SidebarUser name="Maya Chen" meta="maya@acme.com" status="online" />} items={…} />}
/>`;

export function SidebarDocs() {
  return (
    <DocSection
      id="sidebar"
      eyebrow="Components"
      title="Sidebar"
      description="The app's left panel, built from data, after Notion, ClickUp and Align UI: a workspace switcher, search, sections of pages with nested trees, counts and coloured space tiles, an account footer, and an icon rail when collapsed."
    >
      <CodeBlock
        label="Sidebar import"
        code={`import { Sidebar, SidebarWorkspace, SidebarUser, type SidebarSection } from '@my-ds/ui';`}
      />

      <SubSection title="Sample workspace">
        <Example title="Product team workspace (try search, the space toggles and the collapse button)" code={DATA_CODE}>
          <AppDemo />
        </Example>
      </SubSection>

      <SubSection title="Examples">
        <Example title="Floating" code={`<Sidebar variant="floating" sections={sections} header={…} />`}>
          <div className="demo-frame">
            <Sidebar
              variant="floating"
              sections={SMALL}
              defaultValue="inbox"
              navLabel="Floating sidebar"
              headingLevel={4}
              header={<SidebarWorkspace name="Acme Inc." meta="Business" />}
            />
          </div>
        </Example>

        <Example title="Compact (size sm)" code={`<Sidebar size="sm" sections={sections} />`}>
          <div className="demo-frame">
            <Sidebar
              size="sm"
              sections={SMALL}
              defaultValue="roadmap"
              navLabel="Compact sidebar"
              headingLevel={4}
              header={<SidebarWorkspace name="Northwind" meta="Free plan" tone="success" />}
            />
          </div>
        </Example>

        <Example title="Collapsed icon rail" code={`<Sidebar collapsed sections={sections} header={…} footer={…} />`}>
          <div className="demo-frame">
            <Sidebar
              collapsed
              sections={SMALL}
              defaultValue="roadmap"
              navLabel="Rail sidebar"
              header={<SidebarWorkspace name="Acme Inc." />}
              footer={<SidebarUser name="Maya Chen" status="online" />}
            />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Sidebar props (plus native <div> attributes)"
          rows={[
            { name: 'sections', type: 'SidebarSection[]', description: 'The navigation tree (see the data shape below).' },
            { name: 'value / defaultValue', type: 'string', description: 'Controlled / initial current item id. Its parents start expanded.' },
            { name: 'onValueChange', type: '(id, item) => void', description: 'Called when an item is activated.' },
            { name: 'header / footer', type: 'ReactNode', description: 'Top and bottom slots, usually SidebarWorkspace and SidebarUser.' },
            { name: 'searchable', type: 'boolean', default: 'false', description: 'Adds a field that filters the tree; Enter opens the first match.' },
            { name: 'searchPlaceholder', type: 'string', default: "'Search'", description: 'Placeholder and accessible name of the field.' },
            { name: 'searchShortcut', type: 'ReactNode', description: 'Trailing hint in the field, e.g. a Kbd.' },
            { name: 'collapsed', type: 'boolean', default: 'false', description: 'Icon rail: top-level items only, labels in tooltips, counts as dots.' },
            { name: 'defaultExpanded', type: 'string[]', description: 'Parent items that start open.' },
            { name: 'variant', type: "'default' | 'floating'", default: "'default'", description: 'Sidebar fill with an edge, or a raised card.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Rows 26 (compact) / 32.' },
            { name: 'headingLevel', type: '2–6', default: '2', description: 'Heading element for section titles.' },
            { name: 'navLabel', type: 'string', default: "'Sidebar'", description: 'Label for the <nav> landmark.' },
          ]}
        />
        <PropsTable
          caption="SidebarSection"
          rows={[
            { name: 'id', type: 'string', description: 'Unique section id.' },
            { name: 'title', type: 'string', description: 'Muted heading; omit for an untitled top group.' },
            { name: 'items', type: 'SidebarItem[]', description: 'Rows in the section.' },
            { name: 'collapsible / defaultOpen', type: 'boolean', description: 'Heading folds the section / starts open.' },
            { name: 'action', type: '{ icon, label, onClick }', description: 'Small icon button on the heading (shown on hover and focus).' },
          ]}
        />
        <PropsTable
          caption="SidebarItem"
          rows={[
            { name: 'id / label', type: 'string', description: 'Unique id and visible text.' },
            { name: 'icon', type: 'IconName', description: 'Leading Solar icon.' },
            { name: 'tone', type: "'accent' | 'success' | 'warn' | 'danger' | 'neutral'", description: 'Letter tile in this colour when there is no icon.' },
            { name: 'badge', type: 'ReactNode', description: 'Trailing count; part of the accessible name.' },
            { name: 'href', type: 'string', description: 'Renders a link; otherwise a button.' },
            { name: 'items', type: 'SidebarItem[]', description: 'Child pages in a collapsible tree.' },
            { name: 'disabled', type: 'boolean', description: 'Not activatable.' },
          ]}
        />
        <PropsTable
          caption="SidebarWorkspace / SidebarUser (plus native <button> attributes; use as Menu triggers)"
          rows={[
            { name: 'name', type: 'string', description: 'Workspace or person name.' },
            { name: 'meta', type: 'ReactNode', description: 'Second line: plan, member count, email.' },
            { name: 'tone / logo', type: 'SidebarTone / ReactNode', description: 'SidebarWorkspace: initials tile colour, or a logo.' },
            { name: 'src / status', type: 'string / AvatarStatus', description: 'SidebarUser: avatar image and presence.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'A labelled <nav> landmark; each titled section is a list labelled by its heading, each child tree a list labelled by its parent.',
            'The current page has aria-current="page"; counts are part of the row name.',
            'Up/Down/Home/End move between rows; Right opens a page’s children and steps into them, Left closes them or returns to the parent.',
            'Tree and section toggles are buttons with aria-expanded/aria-controls; closed regions are hidden and skipped by the keyboard.',
            'Search: Down moves into the results, Enter opens the first match, Escape clears; an empty result is announced.',
            'In the rail, labels stay in the accessible name and show as tooltips on hover and focus.',
            'Animations are off under prefers-reduced-motion.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
