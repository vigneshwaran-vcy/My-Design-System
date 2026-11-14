import { Icon } from '../Icon';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';


const trail = [
  { label: 'Workspace', href: '#' },
  { label: 'Projects', href: '#' },
  { label: 'Billing API', href: '#' },
  { label: 'Settings', href: '#' },
  { label: 'Webhooks' },
];

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: { items: trail },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithIcons: Story = {
  args: { items: [{ label: 'Home', href: '#', icon: <Icon name="home" /> }, ...trail.slice(1, 3)] },
};

export const Collapsed: Story = {
  args: { maxItems: 3 },
};

export const CustomSeparator: Story = {
  args: { separator: '/' , items: trail.slice(0, 3) },
};

export const Short: Story = {
  args: { items: [{ label: 'Customers', href: '#' }, { label: 'Acme Corp' }] },
};
