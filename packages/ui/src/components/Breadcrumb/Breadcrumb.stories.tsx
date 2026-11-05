import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);

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
  args: { items: [{ label: 'Home', href: '#', icon: <HomeIcon /> }, ...trail.slice(1, 3)] },
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
