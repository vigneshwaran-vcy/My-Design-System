import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import './Menu.css';

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface MenuActionItem {
  type?: 'item';
  id: string;
  label: ReactNode;
  /** Plain-text label used for typeahead when `label` is not a string. */
  textValue?: string;
  icon?: ReactNode;
  /** Shown right-aligned in mono, e.g. "⌘K". Display only; wire the shortcut yourself. */
  shortcut?: string;
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
    setOpen(false);
  };

  const select = (index: number) => {
    const item = items[index];
    if (!item || !isAction(item) || item.disabled) return;
    item.onSelect?.();
    onSelect?.(item.id);
    closeMenu('select');
  };

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
      const el = menuRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      (el ?? menuRef.current)?.focus();
    } else {
      if (wasOpen.current && restoreFocus.current) document.getElementById(triggerId)?.focus();
      if (activeIndex !== -1) setActiveIndex(-1);
    }
    wasOpen.current = open;
  }, [open, activeIndex, triggerId, first]);

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
        setActiveIndex((i) => step(i, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((i) => step(i, -1));
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
        {items.map((item, index) => {
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
          const active = index === activeIndex;
          return (
            <div
              key={item.id}
              role="menuitem"
              data-index={index}
              tabIndex={active ? 0 : -1}
              aria-disabled={item.disabled || undefined}
              className={cx(
                'ds-menu__item',
                active && 'ds-menu__item--active',
                item.danger && 'ds-menu__item--danger',
              )}
              onPointerMove={() => !item.disabled && !active && setActiveIndex(index)}
              onClick={() => select(index)}
            >
              {item.icon && (
                <span className="ds-menu__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="ds-menu__item-label">{item.label}</span>
              {item.shortcut && (
                <kbd className="ds-menu__shortcut" aria-hidden="true">
                  {item.shortcut}
                </kbd>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
