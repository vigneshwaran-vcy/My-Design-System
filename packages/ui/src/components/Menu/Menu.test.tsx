import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState, type ComponentProps } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Menu, type MenuItem } from './Menu';

const makeItems = (onDelete = vi.fn()): MenuItem[] => [
  { id: 'rename', label: 'Rename', shortcut: '⌘R' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'sep', type: 'separator' },
  { id: 'group', type: 'label', label: 'Danger zone' },
  { id: 'archive', label: 'Archive', disabled: true },
  { id: 'delete', label: 'Delete', danger: true, onSelect: onDelete },
];

const renderMenu = (props: Partial<ComponentProps<typeof Menu>> = {}) =>
  render(
    <>
      <Menu trigger={<button>Actions</button>} items={makeItems()} {...props} />
      <button>After</button>
    </>,
  );

describe('Menu', () => {
  it('wires the trigger with aria-haspopup="menu", aria-expanded and aria-controls', () => {
    renderMenu();
    const trigger = screen.getByRole('button', { name: 'Actions' });
    const menu = screen.getByRole('menu', { hidden: true });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(menu).toHaveAttribute('aria-labelledby', trigger.id);
    expect(menu).not.toBeVisible();
  });

  it('opens on click, focuses the first item and renders items, separators and labels', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menu', { name: 'Actions' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    expect(screen.getAllByRole('menuitem')).toHaveLength(4);
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByText('Danger zone')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('ds-menu__item--danger');
  });

  it('opens with ArrowDown on the first item and ArrowUp on the last enabled item', async () => {
    const user = userEvent.setup();
    renderMenu();
    screen.getByRole('button', { name: 'Actions' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('navigates with arrows (wrapping, skipping disabled), Home and End using a roving tabindex', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const rename = screen.getByRole('menuitem', { name: 'Rename' });
    const duplicate = screen.getByRole('menuitem', { name: 'Duplicate' });
    const del = screen.getByRole('menuitem', { name: 'Delete' });
    expect(rename).toHaveAttribute('tabindex', '0');
    expect(duplicate).toHaveAttribute('tabindex', '-1');
    await user.keyboard('{ArrowDown}');
    expect(duplicate).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(del).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(rename).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(del).toHaveFocus();
    await user.keyboard('{Home}');
    expect(rename).toHaveFocus();
    await user.keyboard('{End}');
    expect(del).toHaveFocus();
    expect(del).toHaveAttribute('tabindex', '0');
  });

  it('supports typeahead', async () => {
    const user = userEvent.setup();
    renderMenu();
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('selects with Enter, Space and click; calls the item onSelect then onSelect(id); closes and refocuses the trigger', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onSelect = vi.fn();
    renderMenu({ items: makeItems(onDelete), onSelect });
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await user.click(trigger);
    await user.keyboard('{End}{Enter}');
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenLastCalledWith('delete');
    expect(screen.getByRole('menu', { hidden: true })).not.toBeVisible();
    expect(trigger).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenLastCalledWith('rename');
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onSelect).toHaveBeenLastCalledWith('duplicate');
    expect(onSelect).toHaveBeenCalledTimes(3);
  });

  it('does not select disabled items', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderMenu({ onSelect });
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(screen.getByRole('menuitem', { name: 'Archive' }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeVisible();
  });

  it('closes on Escape (focus to trigger) and on outside click (focus stays where the user clicked)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderMenu({ onOpenChange });
    const trigger = screen.getByRole('button', { name: 'Actions' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('menu', { hidden: true })).not.toBeVisible();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'After' }));
    expect(screen.getByRole('menu', { hidden: true })).not.toBeVisible();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(onOpenChange.mock.calls).toEqual([[true], [false], [true], [false]]);
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Menu trigger={<button>Actions</button>} items={makeItems()} open={open} onOpenChange={setOpen} />
          <button onClick={() => setOpen(true)}>External</button>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'External' }));
    expect(screen.getByRole('menu')).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('menu', { hidden: true })).not.toBeVisible();
  });

  it('can open above the trigger', () => {
    renderMenu({ placement: 'top-end' });
    expect(screen.getByRole('menu', { hidden: true }).parentElement).toHaveClass('ds-menu--top-end');
  });

  it('applies the placement modifier and forwards ref, className and rest props to the menu', () => {
    const ref = createRef<HTMLDivElement>();
    renderMenu({ ref, placement: 'bottom-end', className: 'extra', 'aria-label': 'Row actions' } as never);
    const menu = screen.getByRole('menu', { hidden: true });
    expect(ref.current).toBe(menu);
    expect(menu).toHaveClass('ds-menu__list', 'extra');
    // Hidden elements compute an empty accessible name, so check the attributes directly.
    expect(menu).toHaveAttribute('aria-label', 'Row actions');
    expect(menu).not.toHaveAttribute('aria-labelledby');
    expect(menu.parentElement).toHaveClass('ds-menu', 'ds-menu--bottom-end');
  });

  it('renders shortcuts as keycaps', async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger={<button>Edit</button>}
        items={[
          { id: 'dup', label: 'Duplicate', shortcut: '⌘⇧D' },
          { id: 'save', label: 'Save', shortcut: 'Ctrl+S' },
        ]}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    const dup = screen.getByRole('menuitem', { name: 'Duplicate' });
    expect(dup.querySelectorAll('.ds-kbd__key, kbd kbd, .ds-kbd').length).toBeGreaterThan(0);
    expect(dup.textContent).toContain('⇧');
    expect(screen.getByRole('menuitem', { name: 'Save' }).textContent).toContain('⌃');
  });

  describe('submenus', () => {
    const subItems = [
      { id: 'copy', label: 'Copy' },
      {
        id: 'share',
        label: 'Share',
        items: [
          { id: 'email', label: 'Email' },
          { id: 'link', label: 'Copy link' },
        ],
      },
      { id: 'delete', label: 'Delete', danger: true },
    ];

    it('opens with ArrowRight, moves inside, and returns with ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<Menu trigger={<button>Actions</button>} items={subItems} />);
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.keyboard('{ArrowDown}');
      const share = screen.getByRole('menuitem', { name: 'Share' });
      expect(share).toHaveFocus();
      expect(share).toHaveAttribute('aria-haspopup', 'menu');
      expect(share).toHaveAttribute('aria-expanded', 'false');
      await user.keyboard('{ArrowRight}');
      expect(share).toHaveAttribute('aria-expanded', 'true');
      const sub = screen.getByRole('menu', { name: 'Share' });
      expect(within(sub).getByRole('menuitem', { name: 'Email' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(within(sub).getByRole('menuitem', { name: 'Copy link' })).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.queryByRole('menu', { name: 'Share' })).not.toBeInTheDocument();
      expect(share).toHaveFocus();
    });

    it('selects a submenu item and closes everything', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Menu trigger={<button>Actions</button>} items={subItems} onSelect={onSelect} />);
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.click(screen.getByRole('menuitem', { name: 'Share' }));
      await user.click(screen.getByRole('menuitem', { name: 'Copy link' }));
      expect(onSelect).toHaveBeenCalledWith('link');
      expect(onSelect).not.toHaveBeenCalledWith('share');
      expect(screen.getByRole('menu', { hidden: true })).not.toBeVisible();
    });

    it('opens on hover without stealing focus from the parent', async () => {
      const user = userEvent.setup();
      render(<Menu trigger={<button>Actions</button>} items={subItems} />);
      await user.click(screen.getByRole('button', { name: 'Actions' }));
      await user.hover(screen.getByRole('menuitem', { name: 'Share' }));
      expect(screen.getByRole('menu', { name: 'Share' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Share' })).toHaveFocus();
      await user.hover(screen.getByRole('menuitem', { name: 'Delete' }));
      expect(screen.queryByRole('menu', { name: 'Share' })).not.toBeInTheDocument();
    });
  });
});
