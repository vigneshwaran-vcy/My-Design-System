import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Icon, type IconName } from '../Icon';
import { Carousel, CarouselSlide } from './Carousel';

const slides: { title: string; body: string; icon: IconName }[] = [
  { title: 'Faster reports', body: 'Dashboards now load in under a second, even for large workspaces.', icon: 'chart-2' },
  { title: 'Shared inboxes', body: 'Route customer email to a team and assign conversations in one click.', icon: 'inbox' },
  { title: 'Smarter search', body: 'Find records, files and notes across every module from one box.', icon: 'search' },
  { title: 'Audit trail', body: 'Every change is logged with who made it and when.', icon: 'shield-check' },
];

const slideStyle = {
  display: 'grid',
  gap: 'var(--ds-space-2)',
  padding: 'var(--ds-space-8)',
  minHeight: 'var(--ds-size-panel-xs)',
  alignContent: 'center',
};

// Called as a function (not as a component) so each CarouselSlide is a direct child of Carousel.
const renderSlides = () =>
  slides.map((s) => (
    <CarouselSlide key={s.title}>
      <div style={slideStyle}>
        <Icon name={s.icon} size="lg" style={{ color: 'var(--ds-color-text-accent)' }} />
        <strong style={{ fontSize: 'var(--ds-font-size-lg)' }}>{s.title}</strong>
        <span style={{ color: 'var(--ds-color-text-muted)', fontSize: 'var(--ds-font-size-sm)' }}>{s.body}</span>
      </div>
    </CarouselSlide>
  ));

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { 'aria-label': "What's new", variant: 'default', size: 'md', loop: true, autoPlay: false, interval: 5000 },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'framed'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  decorators: [(Story) => <div style={{ maxWidth: 'var(--ds-size-panel-xl)' }}><Story /></div>],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { render: (args) => <Carousel {...args}>{renderSlides()}</Carousel> };
export const Framed: Story = { ...Playground, args: { variant: 'framed' } };
export const Small: Story = { ...Playground, args: { size: 'sm' } };
export const AutoPlay: Story = { ...Playground, args: { autoPlay: true, interval: 4000 } };
export const NoLoop: Story = { ...Playground, args: { loop: false } };

export const Controlled: Story = {
  render: (args) => {
    const [index, setIndex] = useState(1);
    return (
      <div style={{ display: 'grid', gap: 'var(--ds-space-3)' }}>
        <Carousel {...args} index={index} onIndexChange={setIndex}>
          {renderSlides()}
        </Carousel>
        <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'var(--ds-color-text-muted)' }}>Slide {index + 1}</span>
      </div>
    );
  },
};
