import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <FolderIcon />,
    title: 'No projects yet',
    description: 'Projects group your environments, deployments and team members in one place.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <EmptyState
      {...args}
      action={<Button>New project</Button>}
      secondaryAction={<Button variant="ghost">Import from GitHub</Button>}
    />
  ),
};

export const NoResults: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results for "quarterly"',
    description: 'Try a different keyword or clear the filters.',
  },
  render: (args) => <EmptyState {...args} action={<Button variant="secondary">Clear filters</Button>} />,
};

export const Small: Story = {
  args: { size: 'sm', title: 'No comments', description: 'Be the first to leave a comment.' },
  render: (args) => (
    <div style={{ width: 'calc(var(--ds-space-16) * 5)', border: 'var(--ds-border-width-thin) dashed var(--ds-color-border)', borderRadius: 'var(--ds-radius-lg)' }}>
      <EmptyState {...args} action={<Button size="sm" variant="secondary">Add comment</Button>} />
    </div>
  ),
};

export const WithoutTile: Story = {
  args: { tile: false },
};

export const TitleOnly: Story = {
  args: { icon: undefined, description: undefined, title: 'Nothing to show' },
};
