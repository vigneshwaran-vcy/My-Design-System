import { Carousel, CarouselSlide, Icon, type IconName } from '@my-ds/ui';
import { Checklist, CodeBlock, DocSection, Example, PropsTable, SubSection } from '../DocBlocks';

const slides: { title: string; body: string; icon: IconName }[] = [
  { title: 'Faster reports', body: 'Dashboards now load in under a second, even for large workspaces.', icon: 'chart-2' },
  { title: 'Shared inboxes', body: 'Route customer email to a team and assign conversations in one click.', icon: 'inbox' },
  { title: 'Smarter search', body: 'Find records, files and notes across every module from one box.', icon: 'search' },
  { title: 'Audit trail', body: 'Every change is logged with who made it and when.', icon: 'shield-check' },
];

// Called as a function so each CarouselSlide is a direct child of Carousel.
const renderSlides = () =>
  slides.map((s) => (
    <CarouselSlide key={s.title}>
      <div style={{ display: 'grid', gap: 'var(--ds-space-2)', padding: 'var(--ds-space-8)', alignContent: 'center' }}>
        <Icon name={s.icon} size="lg" style={{ color: 'var(--ds-color-text-accent)' }} />
        <strong style={{ fontSize: 'var(--ds-font-size-lg)' }}>{s.title}</strong>
        <span style={{ color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>{s.body}</span>
      </div>
    </CarouselSlide>
  ));

const wide = { width: '100%', maxWidth: 'var(--ds-size-panel-xl)' };

export function CarouselDocs() {
  return (
    <DocSection
      id="carousel"
      eyebrow="Components"
      title="Carousel"
      description="Shows one slide at a time from a short set, with previous/next buttons and dots to pick a slide. Autoplay is optional and pauses whenever the user hovers or focuses it."
    >
      <CodeBlock label="Carousel import" code={`import { Carousel, CarouselSlide } from '@my-ds/ui';`} />

      <SubSection title="Examples">
        <Example
          title="Default"
          code={`<Carousel aria-label="What's new">
  <CarouselSlide>…</CarouselSlide>
  <CarouselSlide>…</CarouselSlide>
  <CarouselSlide>…</CarouselSlide>
</Carousel>`}
        >
          <div style={wide}>
            <Carousel aria-label="What's new">{renderSlides()}</Carousel>
          </div>
        </Example>

        <Example title="Framed with autoplay" code={`<Carousel aria-label="Highlights" variant="framed" autoPlay interval={5000}>…</Carousel>`}>
          <div style={wide}>
            <Carousel aria-label="Highlights" variant="framed" autoPlay interval={5000}>
              {renderSlides()}
            </Carousel>
          </div>
        </Example>

        <Example title="Small, no loop" code={`<Carousel aria-label="Tips" size="sm" loop={false}>…</Carousel>`}>
          <div style={wide}>
            <Carousel aria-label="Tips" size="sm" loop={false}>
              {renderSlides()}
            </Carousel>
          </div>
        </Example>
      </SubSection>

      <SubSection title="Props">
        <PropsTable
          caption="Carousel props (plus native <section> attributes)"
          rows={[
            { name: 'aria-label', type: 'string', description: 'Required: names the carousel region.' },
            { name: 'index', type: 'number', description: 'Controlled visible slide (0-based).' },
            { name: 'defaultIndex', type: 'number', default: '0', description: 'Initially visible slide (uncontrolled).' },
            { name: 'onIndexChange', type: '(index: number) => void', description: 'Called when the slide changes.' },
            { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Rotates slides and adds a stop/start control.' },
            { name: 'interval', type: 'number', default: '5000', description: 'Milliseconds between rotations.' },
            { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap around at the ends; otherwise the end buttons disable.' },
            { name: 'variant', type: "'default' | 'framed'", default: "'default'", description: 'Slide surface alone, or everything in a tinted frame.' },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Control and dot size.' },
            { name: 'slideLabel', type: '(index, count) => string', default: '"N of M"', description: 'Accessible label for each slide.' },
          ]}
        />
        <PropsTable
          caption="CarouselSlide props (plus native <div> attributes)"
          rows={[{ name: 'aria-label', type: 'string', description: 'Overrides the generated "N of M" label.' }]}
        />
      </SubSection>

      <SubSection title="Accessibility">
        <Checklist
          items={[
            'Follows the WAI-ARIA tabbed carousel: a region with aria-roledescription="carousel"; slides are role="tabpanel" with aria-roledescription="slide" and an "N of M" label.',
            'Dots are a tablist: Left/Right move and show the slide, Home/End jump; only the current dot is in the tab order.',
            'Previous/next are labelled buttons. The rotation control comes first and reads "Stop/Start automatic slide show".',
            'Rotation pauses on hover and on keyboard focus inside, and never starts on its own under prefers-reduced-motion (slide transition is off too).',
            'aria-live is "off" while rotating and "polite" otherwise; inactive slides are aria-hidden and inert.',
          ]}
        />
      </SubSection>
    </DocSection>
  );
}
