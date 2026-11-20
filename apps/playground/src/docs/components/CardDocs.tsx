import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const demo = (variant: 'elevated' | 'outlined' | 'filled') => (
  <Card variant={variant} className="doc-card-demo">
    <CardHeader title={variant} description="Surface variant" />
    <CardBody>Groups related content on one surface.</CardBody>
  </Card>
);

export function CardDocs() {
  return (
    <DocSection id="card" eyebrow="Components" title="Card" description="A surface that groups related content. Compose with CardHeader, CardBody and CardFooter.">
      <CodeBlock label="Card import" code={`import { Card, CardHeader, CardBody, CardFooter } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example title="Variants" code={`<Card variant="elevated">…</Card>
<Card variant="outlined">…</Card>
<Card variant="filled">…</Card>`}>
          {demo('elevated')}
          {demo('outlined')}
          {demo('filled')}
        </Example>

        <Example title="Padding" code={`<Card padding="sm">…</Card>
<Card padding="md">…</Card>
<Card padding="lg">…</Card>`}>
          {(['sm', 'md', 'lg'] as const).map((p) => (
            <Card key={p} variant="outlined" padding={p} className="doc-card-demo">
              <CardHeader title={`padding="${p}"`} />
            </Card>
          ))}
        </Example>

        <Example
          title="Composition (form landmark)"
          code={`<Card as="form" aria-labelledby="beta-title" onSubmit={…}>
  <CardHeader title="Join the beta" titleId="beta-title" description="…" />
  <CardBody><Input label="Email" type="email" required /></CardBody>
  <CardFooter>
    <Button variant="secondary" type="reset">Clear</Button>
    <Button type="submit">Request access</Button>
  </CardFooter>
</Card>`}
        >
          <Card as="form" aria-labelledby="beta-title" className="doc-card-form" onSubmit={(e) => e.preventDefault()}>
            <CardHeader
              title="Join the beta"
              titleId="beta-title"
              description="We'll email you when your seat is ready."
              action={<Button variant="secondary" size="sm">Learn more</Button>}
            />
            <CardBody className="doc-stack">
              <Input label="Name" placeholder="Ada Lovelace" />
              <Input label="Email" type="email" required hint="Work email preferred." />
            </CardBody>
            <CardFooter>
              <Button variant="secondary" type="reset">Clear</Button>
              <Button type="submit">Request access</Button>
            </CardFooter>
          </Card>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Card props (plus native HTML attributes)"
          rows={[
            { name: 'variant', type: "'elevated' | 'outlined' | 'filled'", default: "'elevated'", description: 'Shadow, border only, or tinted surface.' },
            { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Inner padding 0 / 12 / 16 / 24.' },
            { name: 'as', type: "'div' | 'section' | 'article' | 'form'", default: "'div'", description: 'Semantic element.' },
          ]}
        />
        <PropsTable
          caption="CardHeader props"
          rows={[
            { name: 'title', type: 'ReactNode', description: 'Required heading text.' },
            { name: 'titleAs', type: "'h2' | 'h3' | 'h4'", default: "'h3'", description: 'Heading level — match the page outline.' },
            { name: 'titleId', type: 'string', description: 'Id for aria-labelledby on the Card.' },
            { name: 'description', type: 'ReactNode', description: 'Muted supporting text.' },
            { name: 'action', type: 'ReactNode', description: 'Trailing slot, e.g. a ghost Button.' },
          ]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Cards are not interactive; put links and buttons inside rather than making the whole card clickable.',
            'Use as="section" or "article" with aria-labelledby={titleId} when the card is a landmark.',
            'Pick titleAs so headings stay in order with the rest of the page.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
