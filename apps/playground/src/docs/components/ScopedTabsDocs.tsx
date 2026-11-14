import { Icon, ScopedTabs, Tab, TabList, TabPanel } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const Content = () => (
  <>
    <TabList aria-label="Account record">
      <Tab value="details" icon={<Icon name="document" />}>Details</Tab>
      <Tab value="activity" icon={<Icon name="clock-circle" />} badge={4}>Activity</Tab>
      <Tab value="files" icon={<Icon name="paperclip" />}>Files</Tab>
      <Tab value="archive" disabled>Archive</Tab>
    </TabList>
    <TabPanel value="details">Account owner, industry, annual revenue and billing address.</TabPanel>
    <TabPanel value="activity">Four open tasks and the latest emails and calls.</TabPanel>
    <TabPanel value="files">Contracts and proposals attached to this account.</TabPanel>
    <TabPanel value="archive">Archived items.</TabPanel>
  </>
);

const wide = { width: '100%', maxWidth: 'var(--ds-size-panel-2xl)' };

export function ScopedTabsDocs() {
  return (
    <DocSection
      id="scoped-tabs"
      eyebrow="Components"
      title="Scoped Tabs"
      description="Tabs whose content sits in a container joined to the selected tab, so it reads as scoped to that tab. Use inside a page section or card; use plain Tabs for page-level switching."
    >
      <CodeBlock label="Scoped tabs import" code={`import { ScopedTabs, TabList, Tab, TabPanel } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Framed (default)"
          code={`<ScopedTabs defaultValue="details">
  <TabList aria-label="Account record">
    <Tab value="details" icon={<Icon name="document" />}>Details</Tab>
    <Tab value="activity" icon={<Icon name="clock-circle" />} badge={4}>Activity</Tab>
    <Tab value="files" icon={<Icon name="paperclip" />}>Files</Tab>
  </TabList>
  <TabPanel value="details">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
  <TabPanel value="files">…</TabPanel>
</ScopedTabs>`}
        >
          <div style={wide}>
            <ScopedTabs defaultValue="details">
              <Content />
            </ScopedTabs>
          </div>
        </Example>

        <Example title="Plain" code={`<ScopedTabs variant="plain" defaultValue="activity">…</ScopedTabs>`}>
          <div style={wide}>
            <ScopedTabs variant="plain" defaultValue="activity">
              <Content />
            </ScopedTabs>
          </div>
        </Example>

        <Example title="Small" code={`<ScopedTabs size="sm" defaultValue="files">…</ScopedTabs>`}>
          <div style={wide}>
            <ScopedTabs size="sm" defaultValue="files">
              <Content />
            </ScopedTabs>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="ScopedTabs props (plus native <div> attributes). Children use TabList, Tab and TabPanel from Tabs."
          rows={[
            { name: 'value', type: 'string', description: 'Controlled selected tab.' },
            { name: 'defaultValue', type: 'string', description: 'Initially selected tab (uncontrolled).' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selection changes.' },
            { name: 'variant', type: "'framed' | 'plain'", default: "'framed'", description: 'Tabs and panel in a tinted frame, or the panel surface alone.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Tab height 32 / 40 and panel padding.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Same WAI-ARIA tabs pattern as Tabs: tablist, tabs with aria-selected/aria-controls, and a tabpanel labelled by its tab.',
            'Roving tabindex: Left/Right move and select (automatic activation), Home/End jump, disabled tabs are skipped; Tab moves into the panel.',
            'The selected tab is also marked by a surface fill joined to the panel; the panel is focusable and shows a soft focus ring.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
