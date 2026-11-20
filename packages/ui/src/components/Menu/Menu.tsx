import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Icon } from '../Icon';
import { Kbd } from '../Kbd';
import './Menu.css';

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MenuActionItem {
  type?: 'item';
  id: string;
  label: ReactNode;
  /** Plain-text label used for typeahead when `label` is not a string. */
  textValue?: string;
  icon?: ReactNode;
  /**
   * Keyboard shortcut shown as small keycaps, e.g. "⌘K", "⌘⇧D", "Ctrl+S" or ['⌘', 'K'].
   * Display only; wire the shortcut yourself.
   */
  shortcut?: string | string[];
  /** Child items: the item opens a submenu beside the menu instead of selecting (one level deep). */
  items?: MenuItem[];
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}
export interface MenuSeparatorItem {
  type: 'separator';
  id: string;
}
export interface MenuLabelItem {
  type: 'label';
  id: string;
  label: ReactNode;
}
export type MenuItem = MenuActionItem | MenuSeparatorItem | MenuLabelItem;

type TriggerProps = {
  id?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The menu button. Cloned to receive `aria-haspopup="menu"`, `aria-expanded`, `aria-controls` and the open handlers. */
  trigger: ReactElement<TriggerProps>;
  items: MenuItem[];
  placement?: MenuPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Fires with the item id on selection, after the item's own `onSelect`. */
  onSelect?: (id: string) => void;
}

const isAction = (item: MenuItem): item is MenuActionItem => !item.type || item.type === 'item';
const hasSubmenu = (item: MenuItem | undefined): item is MenuActionItem & { items: MenuItem[] } =>
  !!item && isAction(item) && !!item.items && item.items.length > 0;
const enabledIn = (list: MenuItem[]) => list.flatMap((item, i) => (isAction(item) && !item.disabled ? [i] : []));

/** "⌘⇧D" → ⌘ ⇧ D, "Ctrl+S" → Ctrl S; arrays pass through. */
const MODIFIERS = '⌘⇧⌥⌃';
function shortcutKeys(shortcut: string | string[]): string[] {
  if (Array.isArray(shortcut)) return shortcut;
  if (shortcut.includes('+')) return shortcut.split('+').map((k) => k.trim()).filter(Boolean);
  const keys: string[] = [];
  let rest = shortcut;
  while (rest.length > 1 && MODIFIERS.includes(rest[0])) {
    keys.push(rest[0]);
    rest = rest.slice(1);
  }
  return [...keys, rest];
}
const textOf = (item: MenuActionItem) => item.textValue ?? (typeof item.label === 'string' ? item.label : item.id);

/**
 * Action menu following the WAI-ARIA menu button pattern (roving tabindex, arrows/Home/End/typeahead).
 * Rest props, `className` and the ref go to the `role="menu"` element.
 */
export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  {
    trigger,
    items,
    placement = 'bottom-start',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onSelect,
    id,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const menuId = id ?? `ds-menu-${autoId}`;
  const triggerId = trigger.props.id ?? `${menuId}-trigger`;

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);
  const restoreFocus = useRef(true);
  const typeahead = useRef({ query: '', timer: 0 });
  // Open submenu: the parent's index and the focused child (-1 = opened by hover, focus stays on the parent).
  const [sub, setSub] = useState<{ index: number; active: number } | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const [subPos, setSubPos] = useState<CSSProperties>({});
  const subItems: MenuItem[] = sub && hasSubmenu(items[sub.index]) ? (items[sub.index] as MenuActionItem).items! : [];
  const subEnabled = enabledIn(subItems);

  const enabled = items.flatMap((item, i) => (isAction(item) && !item.disabled ? [i] : []));
  const first = enabled[0] ?? -1;
  const last = enabled[enabled.length - 1] ?? -1;
  const step = (from: number, delta: 1 | -1) => {
    if (enabled.length === 0) return -1;
    const pos = enabled.indexOf(from);
    if (pos === -1) return delta === 1 ? first : last;
    return enabled[(pos + delta + enabled.length) % enabled.length];
  };

  const openMenu = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };
  const closeMenu = (reason: 'escape' | 'outside' | 'select' | 'toggle' | 'tab') => {
    restoreFocus.current = reason !== 'outside' && reason !== 'tab';
    setSub(null);
    setOpen(false);
  };

  const openSub = (index: number, focusFirst: boolean) => {
    const parent = items[index];
    if (!hasSubmenu(parent) || parent.disabled) return;
    setActiveIndex(index);
    setSub({ index, active: focusFirst ? (enabledIn(parent.items)[0] ?? -1) : -1 });
  };

  const fire = (item: MenuActionItem) => {
    item.onSelect?.();
    onSelect?.(item.id);
    closeMenu('select');
  };

  const select = (index: number) => {
    const item = items[index];
    if (!item || !isAction(item) || item.disabled) return;
    if (hasSubmenu(item)) {
      openSub(index, true);
      return;
    }
    fire(item);
  };

  const selectSub = (index: number) => {
    const item = subItems[index];
    if (!item || !isAction(item) || item.disabled) return;
    fire(item);
  };

  // Place the submenu beside its parent row, on the side the menu opens towards.
  useLayoutEffect(() => {
    if (!open || !sub) return;
    const root = rootRef.current;
    const list = menuRef.current;
    const parent = list?.querySelector<HTMLElement>(`[data-index="${sub.index}"]`);
    if (!root || !list || !parent) return;
    const rootBox = root.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const rowBox = parent.getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(list).paddingTop) + parseFloat(getComputedStyle(list).borderTopWidth);
    const gap = parseFloat(getComputedStyle(root).getPropertyValue('--menu-sub-gap')) || 0;
    const top = rowBox.top - rootBox.top - pad;
    setSubPos(
      placement.endsWith('end')
        ? { top, bottom: 'auto', left: 'auto', right: rootBox.right - listBox.left + gap }
        : { top, bottom: 'auto', right: 'auto', left: listBox.right - rootBox.left + gap },
    );
  }, [open, sub, placement]);

  // Outside pointer down closes.
  useEffect(() => {
    if (!open) return;
    const handle = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu('outside');
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  // Roving focus: the active item owns DOM focus while open; the trigger gets it back on close.
  useEffect(() => {
    if (open) {
      restoreFocus.current = true;
      if (activeIndex === -1 && first !== -1) {
        // Opened from outside (controlled `open`): start on the first item.
        setActiveIndex(first);
        return;
      }
      if (sub && sub.active >= 0) {
        subRef.current?.querySelector<HTMLElement>(`[data-sub-index="${sub.active}"]`)?.focus();
        return;
      }
      const el = menuRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      (el ?? menuRef.current)?.focus();
    } else {
      if (wasOpen.current && restoreFocus.current) document.getElementById(triggerId)?.focus();
      if (activeIndex !== -1) setActiveIndex(-1);
    }
    wasOpen.current = open;
  }, [open, activeIndex, triggerId, first, sub]);

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  const runTypeahead = (char: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = window.setTimeout(() => (state.query = ''), 500);
    // Repeating the same letter cycles through items starting with it ("d", "d" → Duplicate, Delete).
    const repeated = [...state.query].every((c) => c === state.query[0]);
    const query = repeated ? state.query[0] : state.query;
    const ordered = [...items.keys()].map((i) => (i + activeIndex + 1) % items.length);
    const match = ordered.find((i) => {
      const item = items[i];
      return isAction(item) && !item.disabled && textOf(item).toLowerCase().startsWith(query);
    });
    if (match !== undefined) setActiveIndex(match);
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSub(null);
        setActiveIndex((i) => step(i, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSub(null);
        setActiveIndex((i) => step(i, -1));
        break;
      case 'ArrowRight':
        if (hasSubmenu(items[activeIndex])) {
          event.preventDefault();
          openSub(activeIndex, true);
        }
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(first);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        closeMenu('escape');
        break;
      case 'Tab':
        closeMenu('tab');
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
    }
  };

  const stepSub = (from: number, delta: 1 | -1) => {
    if (subEnabled.length === 0) return -1;
    const pos = subEnabled.indexOf(from);
    if (pos === -1) return delta === 1 ? subEnabled[0] : subEnabled[subEnabled.length - 1];
    return subEnabled[(pos + delta + subEnabled.length) % subEnabled.length];
  };
  const backToParent = () => {
    setSub(null);
    menuRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.focus();
  };
  const handleSubKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!sub) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSub({ ...sub, active: stepSub(sub.active, 1) });
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSub({ ...sub, active: stepSub(sub.active, -1) });
        break;
      case 'Home':
        event.preventDefault();
        setSub({ ...sub, active: subEnabled[0] ?? -1 });
        break;
      case 'End':
        event.preventDefault();
        setSub({ ...sub, active: subEnabled[subEnabled.length - 1] ?? -1 });
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectSub(sub.active);
        break;
      case 'ArrowLeft':
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        backToParent();
        break;
      case 'Tab':
        closeMenu('tab');
        break;
      default:
    }
  };

  const renderItems = (list: MenuItem[], level: 'main' | 'sub') =>
    list.map((item, index) => {
      if (item.type === 'separator') {
        return <div key={item.id} role="separator" className="ds-menu__separator" />;
      }
      if (item.type === 'label') {
        return (
          <div key={item.id} role="presentation" className="ds-menu__label">
            {item.label}
          </div>
        );
      }
      const isParent = level === 'main' && hasSubmenu(item);
      const active = level === 'main' ? index === activeIndex : index === sub?.active;
      const expanded = isParent && sub?.index === index;
      return (
        <div
          key={item.id}
          role="menuitem"
          {...(level === 'main' ? { 'data-index': index } : { 'data-sub-index': index })}
          tabIndex={active ? 0 : -1}
          aria-disabled={item.disabled || undefined}
          aria-haspopup={isParent ? 'menu' : undefined}
          aria-expanded={isParent ? expanded : undefined}
          className={cx(
            'ds-menu__item',
            (active || expanded) && 'ds-menu__item--active',
            item.danger && 'ds-menu__item--danger',
          )}
          onPointerMove={() => {
            if (item.disabled) return;
            if (level === 'sub') {
              if (sub && sub.active !== index) setSub({ ...sub, active: index });
              return;
            }
            if (!active) setActiveIndex(index);
            if (isParent) {
              if (sub?.index !== index) openSub(index, false);
            } else if (sub) setSub(null);
          }}
          onClick={() => (level === 'main' ? select(index) : selectSub(index))}
        >
          {item.icon && (
            <span className="ds-menu__icon" aria-hidden="true">
              {item.icon}
            </span>
          )}
          <span className="ds-menu__item-label">{item.label}</span>
          {item.shortcut && !isParent && (
            <Kbd size="sm" keys={shortcutKeys(item.shortcut)} className="ds-menu__shortcut" aria-hidden="true" />
          )}
          {isParent && <Icon name="alt-arrow-right" className="ds-menu__chevron" />}
        </div>
      );
    });

  const parentItem = sub ? items[sub.index] : undefined;

  const triggerEl = cloneElement(trigger, {
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': menuId,
    onClick: (event: MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event);
      if (event.defaultPrevented) return;
      if (open) closeMenu('toggle');
      else openMenu(first);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      trigger.props.onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        openMenu(first);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        openMenu(last);
      } else if (event.key === 'Escape' && open) {
        event.preventDefault();
        closeMenu('escape');
      }
    },
  } as Partial<TriggerProps> & Record<string, unknown>);

  return (
    <div ref={rootRef} className={cx('ds-menu', `ds-menu--${placement}`)}>
      {triggerEl}
      <div
        ref={(node) => {
          menuRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={menuId}
        role="menu"
        aria-labelledby={rest['aria-label'] ? undefined : triggerId}
        tabIndex={-1}
        hidden={!open}
        className={cx('ds-menu__list', className)}
        onKeyDown={handleMenuKeyDown}
        {...rest}
      >
        {renderItems(items, 'main')}
      </div>
      {open && sub && parentItem && isAction(parentItem) && (
        <div
          ref={subRef}
          role="menu"
          aria-label={textOf(parentItem)}
          tabIndex={-1}
          className="ds-menu__list ds-menu__list--sub"
          style={subPos}
          onKeyDown={handleSubKeyDown}
        >
          {renderItems(subItems, 'sub')}
        </div>
      )}
    </div>
  );
});
