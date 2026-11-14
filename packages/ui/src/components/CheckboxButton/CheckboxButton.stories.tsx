import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CheckboxButton } from './CheckboxButton';

const meta = {
  title: 'Components/CheckboxButton',
  component: CheckboxButton,
  tags: ['autodocs'],
  args: { label: 'Add to favourites', size: 'md', variant: 'outline' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['outline', 'soft'] },
  },
} satisfies Meta<typeof CheckboxButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Soft: Story = { args: { variant: 'soft' } };

export const CustomIcons: Story = { args: { label: 'Star', icon: 'star', checkedIcon: 'star' } };

export const Controlled: Story = {
  render: (args) => {
    const [on, setOn] = useState(false);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
        <CheckboxButton {...args} checked={on} onChange={setOn} />
        <span>{on ? 'Added' : 'Not added'}</span>
      </div>
    );
  },
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-space-3)' }}>
      <CheckboxButton {...args} label="Default" />
      <CheckboxButton {...args} label="Checked" defaultChecked />
      <CheckboxButton {...args} label="Invalid" invalid />
      <CheckboxButton {...args} label="Disabled" disabled />
      <CheckboxButton {...args} label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
      <CheckboxButton {...args} size="sm" label="Small" />
      <CheckboxButton {...args} size="md" label="Medium" defaultChecked />
      <CheckboxButton {...args} size="lg" label="Large" />
    </div>
  ),
};
