import { Badge, Tab, TabList, TabPanel, Tabs, Icon } from '@my-ds/ui';
import { useState } from 'react';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const panelStyle = { color: 'var(--ds-color-text-muted)' } as const;

export function TabsDocs() {
  const [value, setValue] = useState('overview');

  return (
    <DocSection id="tabs" eyebrow="Components" title="Tabs" description="Switches between related views in the same context. Underline tabs for page sections; pill (segmented) tabs for compact view switchers.">
      <CodeBlock label="Tabs import" code={`import { Tabs, TabList, Tab, TabPanel } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Underline (default)"
          code={`<Tabs defaultValue="overview">
  <TabList aria-label="Project">
    <Tab value="overview">Overview</Tab>
    <Tab value="members" badge={12}>Members</Tab>
    <Tab value="billing">Billing</Tab>
    <Tab value="archive" disabled>Archive</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="members">…</TabPanel>
  <TabPanel value="billing">…</TabPanel>
</Tabs>`}
        >
          <Tabs defaultValue="overview" style={{ width: '100%' }}>
            <TabList aria-label="Project">
              <Tab value="overview">Overview</Tab>
              <Tab value="members" badge={12}>Members</Tab>
              <Tab value="billing">Billing</Tab>
              <Tab value="archive" disabled>Archive</Tab>
            </TabList>
            <TabPanel value="overview" style={panelStyle}>Project health, recent activity and quick links.</TabPanel>
            <TabPanel value="members" style={panelStyle}>Twelve people have access to this project.</TabPanel>
            <TabPanel value="billing" style={panelStyle}>Plan, invoices and payment method.</TabPanel>
            <TabPanel value="archive" style={panelStyle}>Archived items.</TabPanel>
          </Tabs>
        </Example>

        <Example
          title="Pill (segmented)"
          code={`<Tabs variant="pill" defaultValue="board">
  <TabList aria-label="View">
    <Tab value="board" icon={<Icon name="widget" />}>Board</Tab>
    <Tab value="list" icon={<Icon name="list" />}>List</Tab>
    <Tab value="timeline" icon={<Icon name="sort-by-time" />}>Timeline</Tab>
  </TabList>
  …
</Tabs>`}
        >
          <Tabs variant="pill" defaultValue="board" style={{ width: '100%' }}>
            <TabList aria-label="View">
              <Tab value="board" icon={<Icon name="widget" />}>Board</Tab>
              <Tab value="list" icon={<Icon name="list" />}>List</Tab>
              <Tab value="timeline" icon={<Icon name="sort-by-time" />}>Timeline</Tab>
            </TabList>
            <TabPanel value="board" style={panelStyle}>Cards grouped by status.</TabPanel>
            <TabPanel value="list" style={panelStyle}>A flat list of every task.</TabPanel>
            <TabPanel value="timeline" style={panelStyle}>Tasks on a calendar.</TabPanel>
          </Tabs>
        </Example>

        <Example title="Small" code={`<Tabs size="sm" variant="pill" defaultValue="7d">…</Tabs>`}>
          <Tabs size="sm" variant="pill" defaultValue="7d">
            <TabList aria-label="Range">
              <Tab value="24h">24h</Tab>
              <Tab value="7d">7d</Tab>
              <Tab value="30d">30d</Tab>
              <Tab value="90d">90d</Tab>
            </TabList>
          </Tabs>
          <Tabs size="sm" defaultValue="all">
            <TabList aria-label="Filter">
              <Tab value="all">All</Tab>
              <Tab value="open" badge={<Badge size="sm" variant="accent">4</Badge>}>Open</Tab>
              <Tab value="closed">Closed</Tab>
            </TabList>
          </Tabs>
        </Example>

        <Example
          title="Vertical"
          code={`<Tabs orientation="vertical" defaultValue="general">
  <TabList aria-label="Settings">
    <Tab value="general">General</Tab>
    <Tab value="security">Security</Tab>
    <Tab value="notifications">Notifications</Tab>
  </TabList>
  <TabPanel value="general">…</TabPanel>
  …
</Tabs>`}
        >
          <Tabs orientation="vertical" defaultValue="general" style={{ width: '100%' }}>
            <TabList aria-label="Settings">
              <Tab value="general">General</Tab>
              <Tab value="security">Security</Tab>
              <Tab value="notifications">Notifications</Tab>
            </TabList>
            <TabPanel value="general" style={panelStyle}>Workspace name, logo and default language.</TabPanel>
            <TabPanel value="security" style={panelStyle}>Two-factor authentication and session length.</TabPanel>
            <TabPanel value="notifications" style={panelStyle}>Email and push preferences.</TabPanel>
          </Tabs>
        </Example>

        <Example
          title="Controlled"
          code={`const [value, setValue] = useState('overview');
<Tabs value={value} onValueChange={setValue}>…</Tabs>`}
        >
          <Tabs value={value} onValueChange={setValue} style={{ width: '100%' }}>
            <TabList aria-label="Controlled">
              <Tab value="overview">Overview</Tab>
              <Tab value="activity">Activity</Tab>
            </TabList>
            <TabPanel value="overview" style={panelStyle}>Selected: {value}</TabPanel>
            <TabPanel value="activity" style={panelStyle}>Selected: {value}</TabPanel>
          </Tabs>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Tabs props (plus all native <div> attributes)"
          rows={[
            { name: 'value', type: 'string', description: 'Controlled selected tab.' },
            { name: 'defaultValue', type: 'string', description: 'Initial selected tab (uncontrolled).' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selection changes (click or arrow keys).' },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout and which arrow keys move focus.' },
            { name: 'variant', type: "'underline' | 'pill'", default: "'underline'", description: 'Underline = thick accent bottom border; pill = neutral track with a raised selected pill (shadow-flat).' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Tab height 32 / 40 and font-size xs / sm.' },
          ]}
        />
        <PropsTable
          caption="Tab / TabPanel"
          rows={[
            { name: 'Tab.value', type: 'string', description: 'Identifies the tab; matches a TabPanel value.' },
            { name: 'Tab.disabled', type: 'boolean', description: 'Not focusable or selectable; skipped by arrow keys.' },
            { name: 'Tab.icon', type: 'ReactNode', description: 'Decorative leading icon (aria-hidden).' },
            { name: 'Tab.badge', type: 'ReactNode', description: 'Trailing count or Badge; part of the accessible name.' },
            { name: 'TabPanel.value', type: 'string', description: 'Shown when it matches the selected tab.' },
            { name: 'TabPanel.forceMount', type: 'boolean', default: 'false', description: 'Keep the panel mounted (hidden) when not selected.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'WAI-ARIA Tabs pattern: role="tablist" with aria-orientation, role="tab" with aria-selected and aria-controls, role="tabpanel" with aria-labelledby (ids from useId).',
            'Roving tabindex: only the selected tab is in the Tab order; Arrow keys move between tabs (Left/Right or Up/Down by orientation) and wrap; Home/End jump to the first/last.',
            'Automatic activation: moving focus selects the tab and shows its panel. Disabled tabs are skipped.',
            'The panel is focusable (tabIndex=0) so keyboard users can reach its content right after the tab list.',
            'Give every TabList an aria-label describing what the tabs switch between.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
