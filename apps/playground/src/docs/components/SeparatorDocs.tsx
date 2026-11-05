import { Button, Separator } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const column = { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 'calc(var(--ds-space-16) * 5)' } as const;

export function SeparatorDocs() {
  return (
    <DocSection id="separator" eyebrow="Components" title="Separator" description="A thin rule that divides content, horizontally or vertically, optionally with a short centred label. Decorative by default; opt into separator semantics when it divides meaningful groups.">
      <CodeBlock label="Separator import" code={`import { Separator } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Horizontal with spacing"
          code={`<p>Team members</p>
<Separator spacing="md" />
<p>Pending invitations</p>`}
        >
          <div style={column}>
            <span>Team members</span>
            <Separator spacing="md" />
            <span>Pending invitations</span>
          </div>
        </Example>

        <Example
          title="With label"
          code={`<Button fullWidth>Sign in with email</Button>
<Separator label="or continue with" spacing="md" />
<Button fullWidth variant="secondary">Continue with Google</Button>`}
        >
          <div style={column}>
            <Button fullWidth>Sign in with email</Button>
            <Separator label="or continue with" spacing="md" />
            <Button fullWidth variant="secondary">Continue with Google</Button>
          </div>
        </Example>

        <Example
          title="Vertical (toolbar)"
          code={`<Button variant="ghost" size="sm">Edit</Button>
<Separator orientation="vertical" spacing="sm" />
<Button variant="ghost" size="sm">Duplicate</Button>`}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="ghost" size="sm">Edit</Button>
            <Separator orientation="vertical" spacing="sm" />
            <Button variant="ghost" size="sm">Duplicate</Button>
            <Separator orientation="vertical" spacing="sm" />
            <Button variant="ghost" size="sm">Archive</Button>
          </div>
        </Example>

        <Example title="Semantic separator" code={`<Separator decorative={false} label="Archived" spacing="md" />`}>
          <div style={column}>
            <Separator decorative={false} label="Archived" spacing="md" />
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Separator props (plus native <div> attributes)"
          rows={[
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Vertical stretches to the flex container height (align-self: stretch).' },
            { name: 'decorative', type: 'boolean', default: 'true', description: 'true renders role="none"; false renders role="separator" with aria-orientation.' },
            { name: 'label', type: 'ReactNode', description: 'Muted xs text centred in the line. Horizontal only.' },
            { name: 'spacing', type: "'none' | 'sm' | 'md' | 'lg'", default: "'none'", description: 'Margin along the cross axis: 0 / space-2 / space-4 / space-6.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Decorative by default (role="none") so screen readers skip purely visual rules.',
            'With decorative={false} it exposes role="separator" and aria-orientation; a string label becomes its accessible name.',
            'A separator never replaces a heading: if the groups need names, use headings and keep the rule decorative.',
            'Colour is border-color; it is not the only cue because spacing also separates the groups.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
