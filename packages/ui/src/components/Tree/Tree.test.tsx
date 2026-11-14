import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type Ref } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tree, type TreeNode, type TreeProps } from './Tree';

const items: TreeNode[] = [
  {
    id: 'docs',
    label: 'Documents',
    icon: 'folder',
    children: [
      { id: 'report', label: 'Report.pdf', icon: 'file' },
      { id: 'budget', label: 'Budget.xlsx', icon: 'file' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'folder',
    children: [{ id: 'photo', label: 'Photo.png', icon: 'gallery' }],
  },
  { id: 'locked', label: 'Locked', disabled: true },
  { id: 'notes', label: 'Notes.txt', meta: '2 KB' },
];

const renderTree = (props: Partial<TreeProps> & { ref?: Ref<HTMLUListElement> } = {}) => render(<Tree aria-label="Files" items={items} {...props} />);
const item = (name: string) => screen.getByRole('treeitem', { name: new RegExp(`^${name}`) });

describe('Tree', () => {
  it('renders the WAI-ARIA tree structure', () => {
    renderTree({ defaultExpandedIds: ['docs'] });
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument();
    const docs = item('Documents');
    expect(docs).toHaveAttribute('aria-level', '1');
    expect(docs).toHaveAttribute('aria-expanded', 'true');
    expect(docs).toHaveAttribute('aria-setsize', '4');
    expect(docs).toHaveAttribute('aria-posinset', '1');
    expect(docs).toHaveAttribute('aria-selected', 'false');
    expect(item('Report.pdf')).toHaveAttribute('aria-level', '2');
    expect(item('Report.pdf')).not.toHaveAttribute('aria-expanded');
    expect(item('Media')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getAllByRole('group')[0]).toBeVisible();
    expect(screen.getByText('Photo.png')).not.toBeVisible();
    expect(item('Locked')).toHaveAttribute('aria-disabled', 'true');
  });

  it('has a single tab stop (the first item by default, else the selected one)', () => {
    const { unmount } = renderTree();
    expect(screen.getAllByRole('treeitem').filter((el) => el.tabIndex === 0)).toEqual([item('Documents')]);
    unmount();
    renderTree({ defaultSelectedId: 'notes' });
    expect(item('Notes.txt')).toHaveAttribute('tabindex', '0');
    expect(item('Notes.txt')).toHaveAttribute('aria-selected', 'true');
  });

  it('supports Up/Down/Right/Left/Home/End', async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    renderTree({ onExpandedChange });
    await user.tab();
    expect(item('Documents')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(onExpandedChange).toHaveBeenLastCalledWith(['docs']);
    expect(item('Documents')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Documents')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(item('Report.pdf')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(item('Budget.xlsx')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(item('Documents')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(item('Documents')).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard('{ArrowDown}');
    expect(item('Media')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(item('Documents')).toHaveFocus();
    await user.keyboard('{End}');
    expect(item('Notes.txt')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(item('Documents')).toHaveFocus();
  });

  it('selects with Enter/Space and click, but never disabled items', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    renderTree({ onSelectedChange });
    await user.tab();
    await user.keyboard('{End}{Enter}');
    expect(onSelectedChange).toHaveBeenLastCalledWith('notes');
    expect(item('Notes.txt')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowUp} ');
    expect(item('Locked')).toHaveFocus();
    expect(onSelectedChange).toHaveBeenCalledTimes(1);
    await user.click(screen.getByText('Media'));
    expect(onSelectedChange).toHaveBeenLastCalledWith('media');
    expect(item('Media')).toHaveFocus();
    await user.click(screen.getByText('Locked'));
    expect(onSelectedChange).toHaveBeenCalledTimes(2);
  });

  it('jumps by type-ahead and expands siblings with *', async () => {
    const user = userEvent.setup();
    renderTree();
    await user.tab();
    await user.keyboard('n');
    expect(item('Notes.txt')).toHaveFocus();
    await user.keyboard('{Home}');
    await user.keyboard('m');
    expect(item('Media')).toHaveFocus();
    await user.keyboard('*');
    expect(item('Documents')).toHaveAttribute('aria-expanded', 'true');
    expect(item('Media')).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles a branch from its chevron', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const { container } = renderTree({ onSelectedChange });
    await user.click(container.querySelector('[data-id="media"] .ds-tree__toggle')!);
    expect(item('Media')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Photo.png')).toBeVisible();
    expect(onSelectedChange).not.toHaveBeenCalled();
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    const onExpandedChange = vi.fn();
    renderTree({ selectedId: 'notes', onSelectedChange, expandedIds: [], onExpandedChange });
    await user.click(screen.getByText('Documents'));
    expect(onSelectedChange).toHaveBeenCalledWith('docs');
    expect(item('Notes.txt')).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(onExpandedChange).toHaveBeenCalledWith(['docs']);
    expect(item('Documents')).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies variant and size classes, hides icons, and forwards refs', () => {
    const ref = createRef<HTMLUListElement>();
    const { container } = renderTree({ ref, variant: 'framed', size: 'sm', className: 'x' });
    expect(ref.current).toBe(screen.getByRole('tree'));
    expect(ref.current).toHaveClass('ds-tree', 'ds-tree--framed', 'ds-tree--sm', 'x');
    container.querySelectorAll('.ds-tree__icon, .ds-tree__toggle').forEach((el) => expect(el).toHaveAttribute('aria-hidden', 'true'));
  });
});
