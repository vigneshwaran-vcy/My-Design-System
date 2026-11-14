import {
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Icon, type IconName } from '../Icon';
import './Tree.css';

export type TreeVariant = 'default' | 'framed';
export type TreeSize = 'sm' | 'md';

export interface TreeNode {
  id: string;
  label: ReactNode;
  /** Plain text for type-ahead when `label` is not a string. */
  textValue?: string;
  /** Leading icon: a Solar icon name or any node (decorative). */
  icon?: IconName | ReactNode;
  /** Trailing meta, e.g. a count. */
  meta?: ReactNode;
  children?: TreeNode[];
  disabled?: boolean;
}

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect' | 'defaultValue' | 'onChange'> {
  items: TreeNode[];
  /** Controlled selected item id (`null` = nothing selected). */
  selectedId?: string | null;
  /** Initially selected item id (uncontrolled). */
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string) => void;
  /** Controlled expanded item ids. */
  expandedIds?: string[];
  /** Initially expanded item ids (uncontrolled). */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** `default` = bare; `framed` = sits in a tinted frame. */
  variant?: TreeVariant;
  size?: TreeSize;
}

interface FlatNode {
  item: TreeNode;
  level: number;
  parentId: string | null;
}

const EMPTY: string[] = [];

function textOf(item: TreeNode): string {
  if (item.textValue) return item.textValue;
  if (typeof item.label === 'string' || typeof item.label === 'number') return String(item.label);
  if (isValidElement<{ children?: ReactNode }>(item.label) && typeof item.label.props.children === 'string') return item.label.props.children;
  return '';
}

/** WAI-ARIA tree view with single selection and the full keyboard model. */
export const Tree = forwardRef<HTMLUListElement, TreeProps>(function Tree(
  {
    items,
    selectedId,
    defaultSelectedId,
    onSelectedChange,
    expandedIds,
    defaultExpandedIds,
    onExpandedChange,
    variant = 'default',
    size = 'md',
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const [selected, setSelected] = useControllableState<string | null>(selectedId, defaultSelectedId ?? null, (next) => {
    if (next !== null) onSelectedChange?.(next);
  });
  const [expanded, setExpanded] = useControllableState<string[]>(expandedIds, defaultExpandedIds ?? EMPTY, onExpandedChange);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const typeahead = useRef({ query: '', timer: 0 });

  useEffect(() => () => window.clearTimeout(typeahead.current.timer), []);

  // Visible items in display order (children only when their parent is expanded).
  const visible = useMemo(() => {
    const out: FlatNode[] = [];
    const walk = (nodes: TreeNode[], level: number, parentId: string | null) => {
      for (const item of nodes) {
        out.push({ item, level, parentId });
        if (item.children?.length && expanded.includes(item.id)) walk(item.children, level + 1, item.id);
      }
    };
    walk(items, 1, null);
    return out;
  }, [items, expanded]);

  const isVisible = (id: string | null) => id !== null && visible.some((n) => n.item.id === id);
  // Exactly one item is in the tab order: the last focused, else the selected, else the first.
  const tabbableId = isVisible(focusedId)
    ? focusedId
    : isVisible(selected)
      ? selected
      : (visible.find((n) => !n.item.disabled)?.item.id ?? visible[0]?.item.id ?? null);

  const focusItem = (id: string) => {
    setFocusedId(id);
    itemRefs.current.get(id)?.focus();
  };

  const setOpen = (id: string, open: boolean) => {
    const isOpen = expanded.includes(id);
    if (open === isOpen) return;
    setExpanded(open ? [...expanded, id] : expanded.filter((e) => e !== id));
  };

  const select = (item: TreeNode) => {
    if (!item.disabled) setSelected(item.id);
  };

  const runTypeahead = (char: string, fromIndex: number) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = window.setTimeout(() => (state.query = ''), 500);
    const repeated = state.query.split('').every((c) => c === state.query[0]);
    const query = repeated ? state.query[0] : state.query;
    const start = repeated || state.query.length === 1 ? fromIndex + 1 : fromIndex;
    for (let i = 0; i < visible.length; i++) {
      const node = visible[(start + i) % visible.length];
      if (textOf(node.item).toLowerCase().startsWith(query)) {
        focusItem(node.item.id);
        return;
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const target = event.target as HTMLElement;
    if (target.getAttribute('role') !== 'treeitem') return;
    const index = visible.findIndex((n) => n.item.id === target.dataset.id);
    if (index < 0) return;
    const node = visible[index];
    const { item } = node;
    const hasChildren = !!item.children?.length;
    const isOpen = hasChildren && expanded.includes(item.id);
    // Any navigation key ends the current type-ahead search.
    if (event.key.length > 1) typeahead.current.query = '';

    switch (event.key) {
      case 'ArrowDown':
        if (index < visible.length - 1) focusItem(visible[index + 1].item.id);
        break;
      case 'ArrowUp':
        if (index > 0) focusItem(visible[index - 1].item.id);
        break;
      case 'ArrowRight':
        if (hasChildren && !item.disabled) {
          if (!isOpen) setOpen(item.id, true);
          else focusItem(item.children![0].id);
        }
        break;
      case 'ArrowLeft':
        if (isOpen && !item.disabled) setOpen(item.id, false);
        else if (node.parentId) focusItem(node.parentId);
        break;
      case 'Home':
        focusItem(visible[0].item.id);
        break;
      case 'End':
        focusItem(visible[visible.length - 1].item.id);
        break;
      case 'Enter':
      case ' ':
        select(item);
        break;
      case '*': {
        const siblings = visible.filter((n) => n.parentId === node.parentId && n.item.children?.length && !n.item.disabled);
        const ids = siblings.map((n) => n.item.id).filter((id) => !expanded.includes(id));
        if (ids.length) setExpanded([...expanded, ...ids]);
        break;
      }
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          runTypeahead(event.key, index);
          break;
        }
        return;
    }
    event.preventDefault();
  };

  const handleFocus = (id: string) => (event: FocusEvent<HTMLLIElement>) => {
    if (event.target === event.currentTarget) setFocusedId(id);
  };

  const renderItems = (nodes: TreeNode[], level: number): ReactNode =>
    nodes.map((item, i) => {
      const hasChildren = !!item.children?.length;
      const isOpen = hasChildren && expanded.includes(item.id);
      const isSelected = selected === item.id;
      return (
        <li
          key={item.id}
          ref={(el) => {
            if (el) itemRefs.current.set(item.id, el);
            else itemRefs.current.delete(item.id);
          }}
          role="treeitem"
          aria-level={level}
          aria-setsize={nodes.length}
          aria-posinset={i + 1}
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-selected={isSelected}
          aria-disabled={item.disabled || undefined}
          tabIndex={tabbableId === item.id ? 0 : -1}
          data-id={item.id}
          className={cx('ds-tree__item', isSelected && 'ds-tree__item--selected', item.disabled && 'ds-tree__item--disabled')}
          onFocus={handleFocus(item.id)}
        >
          <div
            className="ds-tree__row"
            style={{ '--tree-level': level - 1 } as CSSProperties}
            onClick={() => {
              select(item);
              focusItem(item.id);
            }}
          >
            {hasChildren ? (
              <span
                className="ds-tree__toggle"
                aria-hidden="true"
                onClick={(event) => {
                  event.stopPropagation();
                  if (!item.disabled) setOpen(item.id, !isOpen);
                  focusItem(item.id);
                }}
              >
                <Icon name="alt-arrow-right" />
              </span>
            ) : (
              <span className="ds-tree__toggle ds-tree__toggle--leaf" aria-hidden="true" />
            )}
            {item.icon && (
              <span className="ds-tree__icon" aria-hidden="true">
                {typeof item.icon === 'string' ? <Icon name={item.icon as IconName} /> : item.icon}
              </span>
            )}
            <span className="ds-tree__label">{item.label}</span>
            {item.meta !== undefined && item.meta !== null && <span className="ds-tree__meta">{item.meta}</span>}
          </div>
          {hasChildren && (
            <ul role="group" className="ds-tree__group" hidden={!isOpen}>
              {renderItems(item.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <ul
      ref={ref}
      role="tree"
      className={cx('ds-tree', `ds-tree--${variant}`, `ds-tree--${size}`, className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {renderItems(items, 1)}
    </ul>
  );
});
