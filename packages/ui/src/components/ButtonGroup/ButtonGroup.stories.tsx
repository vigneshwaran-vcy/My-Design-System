import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { ButtonIcon } from '../ButtonIcon';
import { Icon } from '../Icon';
import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: { variant: 'attached', size: 'md', label: 'Record actions' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['attached', 'spaced'] },
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const stack = { display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)', alignItems: 'flex-start' } as const;
const moreItems = [
  { id: 'clone', label: 'Clone' },
  { id: 'share', label: 'Share' },
  { type: 'separator' as const, id: 'sep' },
  { id: 'delete', label: 'Delete', danger: true },
];

export const Playground: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Edit</Button>
      <Button variant="secondary">Follow</Button>
      <Button variant="secondary">New case</Button>
    </ButtonGroup>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={stack}>
      {(['attached', 'spaced'] as const).map((variant) => (
        <ButtonGroup key={variant} {...args} variant={variant} label={variant}>
          <Button variant="secondary">Refresh</Button>
          <Button variant="secondary">Edit</Button>
          <Button variant="secondary">Save</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={stack}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <ButtonGroup key={size} {...args} size={size} label={`Size ${size}`} menuItems={moreItems}>
          <Button variant="secondary">Edit</Button>
          <Button variant="secondary">Follow</Button>
        </ButtonGroup>
      ))}
    </div>
  ),
};

/** Split button: a primary action plus a menu of related actions. */
export const SplitButton: Story = {
  render: (args) => (
    <div style={stack}>
      <ButtonGroup {...args} label="Save" menuItems={moreItems.slice(0, 2)} menuLabel="More save options">
        <Button variant="secondary">Save</Button>
      </ButtonGroup>
      <ButtonGroup {...args} label="Publish" menuItems={moreItems.slice(0, 2)} menuLabel="More publish options" menuVariant="primary">
        <Button>Publish</Button>
      </ButtonGroup>
    </div>
  ),
};

/** Overflow: low-priority actions tucked behind a "more" menu. */
export const Overflow: Story = {
  render: (args) => (
    <ButtonGroup {...args} menuItems={moreItems} menuIcon="menu-dots">
      <Button variant="secondary">Edit</Button>
      <Button variant="secondary">Follow</Button>
    </ButtonGroup>
  ),
};

export const IconButtons: Story = {
  render: (args) => {
    const [view, setView] = useState('list');
    return (
      <ButtonGroup {...args} label="View">
        <ButtonIcon icon="list" label="List view" selected={view === 'list'} onClick={() => setView('list')} />
        <ButtonIcon icon="widget" label="Grid view" selected={view === 'grid'} onClick={() => setView('grid')} />
        <ButtonIcon icon="chart-2" label="Chart view" selected={view === 'chart'} onClick={() => setView('chart')} />
      </ButtonGroup>
    );
  },
};

export const WithDisabled: Story = {
  render: (args) => (
    <ButtonGroup {...args} menuItems={moreItems} menuDisabled>
      <Button variant="secondary" leadingIcon={<Icon name="pen" />}>Edit</Button>
      <Button variant="secondary" disabled>Follow</Button>
    </ButtonGroup>
  ),
};
