import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar, SidebarUser, SidebarWorkspace, type SidebarProps, type SidebarSection } from './Sidebar';

const sections: SidebarSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home' },
      { id: 'inbox', label: 'Inbox', icon: 'inbox', badge: 4 },
      { id: 'locked', label: 'Locked', disabled: true },
    ],
  },
  {
    id: 'spaces',
    title: 'Spaces',
    collapsible: true,
    action: { icon: 'add', label: 'New space' },
    items: [
      {
        id: 'product',
        label: 'Product',
        tone: 'accent',
        items: [
          { id: 'roadmap', label: 'Roadmap', href: '#roadmap' },
          { id: 'sprint', label: 'Sprint board', href: '#sprint' },
        ],
      },
      { id: 'design', label: 'Design', tone: 'success' },
    ],
  },
];

const renderSidebar = (props: Partial<SidebarProps> = {}) =>
  render(<Sidebar sections={sections} navLabel="Workspace" defaultValue="home" {...props} />);

describe('Sidebar', () => {
  it('renders a labelled nav with headed lists and marks the current page', () => {
    renderSidebar();
    const nav = screen.getByRole('navigation', { name: 'Workspace' });
    expect(within(nav).getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('list', { name: 'Spaces' })).toBeInTheDocument();
    expect(within(nav).getByRole('button', { name: 'Inbox 4' })).toBeInTheDocument();
  });

  it('selects items and reports the id and item', async () => {
    const onValueChange = vi.fn();
    renderSidebar({ onValueChange });
    await userEvent.click(screen.getByRole('button', { name: 'Inbox 4' }));
    expect(onValueChange).toHaveBeenCalledWith('inbox', expect.objectContaining({ label: 'Inbox' }));
    expect(screen.getByRole('button', { name: 'Inbox 4' })).toHaveAttribute('aria-current', 'page');
  });

  it('does not select disabled items', async () => {
    const onValueChange = vi.fn();
    renderSidebar({ onValueChange });
    await userEvent.click(screen.getByRole('button', { name: 'Locked' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('expands and collapses child pages with the toggle', async () => {
    renderSidebar();
    const toggle = screen.getByRole('button', { name: 'Expand Product' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Roadmap' })).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Collapse Product' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Roadmap' })).toBeVisible();
  });

  it('opens the parents of the current page', () => {
    renderSidebar({ defaultValue: 'sprint' });
    expect(screen.getByRole('link', { name: 'Sprint board' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Collapse Product' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('folds a collapsible section from its heading', async () => {
    renderSidebar();
    const heading = screen.getByRole('button', { name: 'Spaces' });
    await userEvent.click(heading);
    expect(heading).toHaveAttribute('aria-expanded', 'false');
  });

  it('runs the section action', async () => {
    const onClick = vi.fn();
    renderSidebar({ sections: [sections[0], { ...sections[1], action: { icon: 'add', label: 'New space', onClick } }] });
    await userEvent.click(screen.getByRole('button', { name: 'New space' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('filters the tree from the search field, keeping parents of matches', async () => {
    renderSidebar({ searchable: true });
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'road');
    // jsdom puts a space around the <mark>, so match the name loosely.
    expect(screen.getByRole('link', { name: /Road\s?map/ })).toHaveAttribute('data-match', 'true');
    expect(screen.getByRole('button', { name: 'Product' })).not.toHaveAttribute('data-match');
    expect(screen.queryByRole('button', { name: 'Home' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Sprint board' })).not.toBeInTheDocument();
  });

  it('says when nothing matches and clears with Escape', async () => {
    renderSidebar({ searchable: true });
    const search = screen.getByRole('searchbox');
    await userEvent.type(search, 'zzz');
    expect(screen.getByRole('status')).toHaveTextContent('No pages match');
    await userEvent.keyboard('{Escape}');
    expect(search).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
  });

  it('opens the first match with Enter', async () => {
    const onValueChange = vi.fn();
    renderSidebar({ searchable: true, onValueChange });
    await userEvent.type(screen.getByRole('searchbox'), 'sprint{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('sprint', expect.anything());
  });

  it('moves between rows with the arrow keys and opens children with ArrowRight', async () => {
    renderSidebar();
    screen.getByRole('button', { name: 'Home' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Inbox 4' })).toHaveFocus();
    screen.getByRole('button', { name: 'Product' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Collapse Product' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: 'Product' })).toHaveFocus();
  });

  it('collapses to an icon rail with top-level items only', () => {
    renderSidebar({ collapsed: true, defaultValue: 'sprint' });
    expect(screen.queryByRole('link', { name: 'Sprint board' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Product' })).toHaveClass('ds-sidebar__link--holds-current');
    expect(screen.queryByRole('heading', { name: 'Spaces' })).not.toBeInTheDocument();
  });

  it('renders the workspace and user slots', () => {
    renderSidebar({
      header: <SidebarWorkspace name="Acme Inc." meta="Business plan" />,
      footer: <SidebarUser name="Maya Chen" meta="maya@acme.com" />,
    });
    expect(screen.getByRole('button', { name: /Acme Inc\. Business plan/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Maya Chen maya@acme\.com/ })).toBeInTheDocument();
  });
});
