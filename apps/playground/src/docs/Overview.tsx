import { tokenList } from '@my-ds/tokens';
import { Card, CardBody, CardHeader } from '@my-ds/ui';
import { CodeBlock, DocSection, SubSection } from './DocBlocks';

const principles = [
  ['Calm', 'Few colours, generous spacing, no decoration that does not carry meaning.'],
  ['Minimal', 'One way to do each thing. Components expose variants, not style overrides.'],
  ['High-contrast', 'Text and controls meet WCAG AA in both themes; focus is always visible.'],
  ['Rounded, not bubbly', 'radius-md on controls, radius-lg on surfaces, full only for pills.'],
];

export function Overview() {
  const themed = tokenList.filter((t) => t.themes).length;
  return (
    <DocSection
      id="overview"
      eyebrow="Getting started"
      title="My Design System"
      description="Calm, minimal, high-contrast. Rounded but not bubbly. This playground is the living reference: every token and component below is rendered from the real packages."
    >
      <ul className="doc-cards">
        {principles.map(([title, body]) => (
          <li key={title}>
            <Card variant="outlined" padding="md">
              <CardHeader title={title} titleAs="h3" />
              <CardBody>{body}</CardBody>
            </Card>
          </li>
        ))}
      </ul>

      <SubSection title="Install & use">
        <CodeBlock
          label="setup code"
          code={`import '@my-ds/tokens/tokens.css';   // CSS variables, light + dark
import '@my-ds/ui/style.css';         // component styles
import { Button, Card, Input } from '@my-ds/ui';

<Button variant="primary">Save</Button>`}
        />
      </SubSection>

      <SubSection title="Theming">
        <p className="doc-body">
          Set <code>data-theme="light"</code> or <code>data-theme="dark"</code> on <code>&lt;html&gt;</code>. With no attribute
          the OS preference is used. {themed} semantic tokens change per theme; everything else is shared.
        </p>
        <CodeBlock label="theme code" code={`document.documentElement.dataset.theme = 'dark';`} />
      </SubSection>

      <SubSection title="Token naming">
        <p className="doc-body">
          Tokens live in <code>packages/tokens/tokens.json</code> and compile to <code>--ds-*</code> CSS variables and TS
          exports. Components only use <strong>semantic</strong> tokens (<code>--ds-color-bg-accent</code>), never palette
          primitives (<code>--ds-palette-primary-600</code>).
        </p>
        <CodeBlock
          label="token usage code"
          code={`.my-panel {
  padding: var(--ds-space-6);
  border-radius: var(--ds-radius-lg);
  background: var(--ds-color-bg-surface);
  color: var(--ds-color-text);
  box-shadow: var(--ds-shadow-md);
}

// or from TypeScript
import { vars } from '@my-ds/tokens';
vars.color.bg.accent; // "var(--ds-color-bg-accent)"`}
        />
      </SubSection>

      <SubSection title="Rules">
        <ul className="doc-checklist">
          <li>Never hard-code colours, spacing or sizes — a test fails the build if a component does.</li>
          <li>Every component ships variants, sizes, hover / focus / disabled states, keyboard and ARIA support.</li>
          <li>Every component has a Storybook story and a test.</li>
        </ul>
      </SubSection>
    </DocSection>
  );
}
