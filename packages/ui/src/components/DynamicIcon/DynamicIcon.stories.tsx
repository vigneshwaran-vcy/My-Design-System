import type { Meta, StoryObj } from '@storybook/react';
import { ButtonIcon } from '../ButtonIcon';
import { DynamicIcon } from './DynamicIcon';

const meta = {
  title: 'Components/DynamicIcon',
  component: DynamicIcon,
  tags: ['autodocs'],
  args: { variant: 'ellipsis', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['ellipsis', 'typing', 'eq', 'trend', 'strength', 'score', 'waffle'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    direction: { control: 'inline-radio', options: ['up', 'down', 'neutral'] },
    value: { control: 'inline-radio', options: [0, 1, 2, 3] },
    score: { control: 'inline-radio', options: ['positive', 'negative'] },
  },
} satisfies Meta<typeof DynamicIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 'var(--ds-space-6)', alignItems: 'center', flexWrap: 'wrap' } as const;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <DynamicIcon {...args} variant="ellipsis" />
      <DynamicIcon {...args} variant="typing" />
      <DynamicIcon {...args} variant="eq" />
      <DynamicIcon {...args} variant="trend" direction="up" />
      <DynamicIcon {...args} variant="strength" value={2} />
      <DynamicIcon {...args} variant="score" score="positive" />
      <DynamicIcon {...args} variant="waffle" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <DynamicIcon key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Trend: Story = {
  render: (args) => (
    <div style={row}>
      <DynamicIcon {...args} variant="trend" direction="up" />
      <DynamicIcon {...args} variant="trend" direction="down" />
      <DynamicIcon {...args} variant="trend" direction="neutral" />
    </div>
  ),
};

export const Strength: Story = {
  render: (args) => (
    <div style={row}>
      {([0, 1, 2, 3] as const).map((value) => (
        <DynamicIcon key={value} {...args} variant="strength" value={value} />
      ))}
    </div>
  ),
};

export const Score: Story = {
  render: (args) => (
    <div style={row}>
      <DynamicIcon {...args} variant="score" score="positive" />
      <DynamicIcon {...args} variant="score" score="negative" />
    </div>
  ),
};

/** The waffle ripples when its button is hovered or focused. */
export const WaffleButton: Story = {
  render: () => <ButtonIcon variant="bare" label="App launcher" icon={<DynamicIcon variant="waffle" size="sm" />} />,
};

export const Paused: Story = { args: { paused: true } };
