import { Breadcrumb } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);

const trail = [
  { label: 'Workspace', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Billing API', href: '#' },
  { label: 'Settings', href: '#' },
  { label: 'Webhooks' },
];

export function BreadcrumbDocs() {
  return (
    <DocSection id="breadcrumb" eyebrow="Components" title="Breadcrumb" description="Shows where the current page sits in the hierarchy and links back up it. The last crumb is the current page; long trails collapse behind an ellipsis.">
      <CodeBlock label="Breadcrumb import" code={`import { Breadcrumb } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Basic"
          code={`<Breadcrumb
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Billing API', href: '/projects/billing' },
    { label: 'Settings', href: '/projects/billing/settings' },
    { label: 'Webhooks' },
  ]}
/>`}
        >
          <Breadcrumb items={trail} />
        </Example>

        <Example title="With icons" code={`<Breadcrumb items={[{ label: 'Home', href: '/', icon: <HomeIcon /> }, { label: 'Customers', href: '/customers' }, { label: 'Acme Corp' }]} />`}>
          <Breadcrumb items={[{ label: 'Home', href: '#', icon: <HomeIcon /> }, { label: 'Customers', href: '#' }, { label: 'Acme Corp' }]} />
        </Example>

        <Example title="Collapsed (maxItems=3)" code={`<Breadcrumb items={items} maxItems={3} />`}>
          <Breadcrumb items={trail} maxItems={3} />
        </Example>

        <Example title="Custom separator" code={`<Breadcrumb items={items} separator="/" />`}>
          <Breadcrumb items={trail.slice(0, 3)} separator="/" />
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Breadcrumb props (plus native <nav> attributes)"
          rows={[
            { name: 'items', type: 'BreadcrumbItem[]', description: 'Ordered trail. Each item: { label, href?, icon?, current?, onClick? }.' },
            { name: 'items[].href', type: 'string', description: 'Renders the crumb as a link. The current crumb is never a link.' },
            { name: 'items[].current', type: 'boolean', description: 'Marks the current page. Defaults to the last item.' },
            { name: 'items[].onClick', type: 'MouseEventHandler', description: 'For client-side routing; call preventDefault and push to your router.' },
            { name: 'separator', type: 'ReactNode', default: 'chevron', description: 'Decorative separator between crumbs (aria-hidden).' },
            { name: 'maxItems', type: 'number', description: 'When the trail is longer, the middle collapses behind an "…" button. The first and last crumbs always stay visible.' },
            { name: 'aria-label', type: 'string', default: "'Breadcrumb'", description: 'Landmark label for the <nav>.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            '<nav aria-label="Breadcrumb"> wrapping an <ol>, so the trail is a navigation landmark with list semantics.',
            'The current page has aria-current="page" and is rendered as text, not a link.',
            'Separators and icons are aria-hidden; they are purely visual.',
            'The collapse control is a native <button> ("Show N more items", aria-expanded) and focus moves to the first revealed crumb after expanding.',
            'Links show a soft focus ring at radius-sm on :focus-visible only.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
