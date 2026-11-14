import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ButtonIcon } from './ButtonIcon';

const meta = {
  title: 'Components/ButtonIcon',
  component: ButtonIcon,
  tags: ['autodocs'],
  args: { icon: 'settings', label: 'Settings', variant: 'border', size: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bare', 'container', 'border', 'brand'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    selected: { control: 'boolean' },
  },
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 'var(--ds-space-3)', alignItems: 'center' } as const;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      {(['bare', 'container', 'border', 'brand'] as const).map((variant) => (
        <ButtonIcon key={variant} {...args} variant={variant} label={`${variant} settings`} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <ButtonIcon key={size} {...args} size={size} label={`Settings ${size}`} />
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div style={row}>
      {(['bare', 'container', 'border', 'brand'] as const).map((variant) => (
        <ButtonIcon key={variant} {...args} variant={variant} disabled label={`${variant} disabled`} />
      ))}
    </div>
  ),
};

/** Toggle: `selected` sets aria-pressed and a settled accent tint. */
export const Toggle: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <div style={row}>
        {(['bare', 'container', 'border', 'brand'] as const).map((variant) => (
          <ButtonIcon
            key={variant}
            {...args}
            variant={variant}
            icon="star"
            label="Favourite"
            selected={on}
            onClick={() => setOn((v) => !v)}
          />
        ))}
      </div>
    );
  },
};
