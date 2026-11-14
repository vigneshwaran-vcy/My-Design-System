import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Avatar } from '../Avatar';
import { Pill, PillContainer } from './Pill';

const meta = {
  title: 'Components/Pill',
  component: Pill,
  tags: ['autodocs'],
  args: { label: 'Acme Corporation', variant: 'neutral', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['neutral', 'accent', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center', flexWrap: 'wrap' } as const;

export const Playground: Story = { args: { onRemove: () => {} } };

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Pill {...args} variant="neutral" label="Neutral" onRemove={() => {}} />
      <Pill {...args} variant="accent" label="Accent" onRemove={() => {}} />
      <Pill {...args} variant="danger" label="Invalid value" icon="danger-circle" onRemove={() => {}} />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Pill {...args} size="sm" label="Small" icon="tag" onRemove={() => {}} />
      <Pill {...args} size="md" label="Medium" icon="tag" onRemove={() => {}} />
    </div>
  ),
};

export const WithMedia: Story = {
  render: (args) => (
    <div style={row}>
      <Pill {...args} label="Acme" icon="case" onRemove={() => {}} />
      <Pill {...args} label="Ada Lovelace" avatar={<Avatar size="xs" name="Ada Lovelace" />} onRemove={() => {}} />
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={row}>
      <Pill {...args} label="Read only" />
      <Pill {...args} label="Removable" onRemove={() => {}} />
      <Pill {...args} label="Disabled" disabled onRemove={() => {}} />
    </div>
  ),
};

/** A listbox of pills: Tab in once, arrows move, Backspace/Delete remove. */
export const Container: Story = {
  render: (args) => {
    const [items, setItems] = useState(['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli']);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)', maxWidth: 'var(--ds-size-panel-md)' }}>
        <PillContainer label="Selected accounts">
          {items.map((name) => (
            <Pill key={name} {...args} label={name} icon="case" onRemove={() => setItems((all) => all.filter((n) => n !== name))} />
          ))}
        </PillContainer>
        <PillContainer label="Selected accounts (framed)" variant="framed" size="sm">
          {items.map((name) => (
            <Pill key={name} label={name} variant="accent" onRemove={() => setItems((all) => all.filter((n) => n !== name))} />
          ))}
        </PillContainer>
      </div>
    );
  },
};
