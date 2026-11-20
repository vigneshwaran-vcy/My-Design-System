import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { useCollapse } from '../Accordion/useCollapse';
import { Avatar, getInitials, type AvatarStatus } from '../Avatar';
import { Icon, type IconName } from '../Icon';
import { Tooltip } from '../Tooltip';
import './Sidebar.css';

export type SidebarVariant = 'default' | 'floating';
export type SidebarSize = 'sm' | 'md';
/** Colour of a letter tile (spaces, projects, workspaces). */
export type SidebarTone = 'accent' | 'success' | 'warn' | 'danger' | 'neutral';

export interface SidebarItem {
  /** Unique across the whole sidebar; the item is current when it matches `value`. */
  id: string;
  label: string;
  /** Leading Solar icon. */
  icon?: IconName;
  /** Leading letter tile in this colour, used when there is no icon (spaces, projects). */
  tone?: SidebarTone;
  /** Trailing count or status; read as part of the item's name. */
  badge?: ReactNode;
  /** Renders a link when given, otherwise a button. */
  href?: string;
  disabled?: boolean;
  /** Child pages, shown in a collapsible tree under the item. */
  items?: SidebarItem[];
}

export interface SidebarSection {
  id: string;
  /** Small muted heading; leave it out for an untitled group (Home, Inbox…). */
  title?: string;
  items: SidebarItem[];
  /** Lets the heading fold the section. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  /** Small icon button on the heading, e.g. "New space". Shown on hover and focus. */
  action?: { icon: IconName; label: string; onClick?: () => void };
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** The navigation tree. */
  sections: SidebarSection[];
  /** Controlled current item id. */
  value?: string;
  /** Initially current item id (uncontrolled). */
  defaultValue?: string;
  /** Called when an item is activated. */
  onValueChange?: (id: string, item: SidebarItem) => void;
  /** Top slot, usually a `SidebarWorkspace`. */
  header?: ReactNode;
  /** Bottom slot, usually a `SidebarUser` and secondary links. */
  footer?: ReactNode;
  /** Adds a search field that filters the tree as you type. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Trailing hint in the search field, e.g. `<Kbd size="sm">⌘K</Kbd>`. */
  searchShortcut?: ReactNode;
  /** Icon rail: top-level items only, labels in tooltips. */
  collapsed?: boolean;
  /** Parent items that start expanded. Parents of the current item always start expanded. */
  defaultExpanded?: string[];
  /** `default` = sidebar fill with an edge; `floating` = a raised surface card. */
  variant?: SidebarVariant;
  /** `sm` is the compact density (rows 26; default 32). */
  size?: SidebarSize;
  /** Heading element for section titles. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Label for the `<nav>` landmark. */
  navLabel?: string;
}

interface SidebarContextValue {
  baseId: string;
  current: string | undefined;
  ancestors: Set<string>;
  expanded: Set<string>;
  query: string;
  collapsed: boolean;
  toggle: (id: string, open?: boolean) => void;
  select: (item: SidebarItem) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const LINK_SELECTOR = '.ds-sidebar__link, .ds-sidebar__heading-toggle';

function indexTree(sections: SidebarSection[]) {
  const parentOf = new Map<string, string>();
  const byId = new Map<string, SidebarItem>();
  const walk = (items: SidebarItem[], parent?: string) => {
    for (const item of items) {
      byId.set(item.id, item);
      if (parent) parentOf.set(item.id, parent);
      if (item.items) walk(item.items, item.id);
    }
  };
  sections.forEach((section) => walk(section.items));
  return { parentOf, byId };
}

function ancestorsOf(id: string | undefined, parentOf: Map<string, string>) {
  const out = new Set<string>();
  let next = id ? parentOf.get(id) : undefined;
  while (next) {
    out.add(next);
    next = parentOf.get(next);
  }
  return out;
}

/** Keeps items whose label matches, plus the parents that lead to them. */
function filterItems(items: SidebarItem[], query: string): SidebarItem[] {
  return items.flatMap((item) => {
    if (item.label.toLowerCase().includes(query)) return [item];
    const kids = item.items ? filterItems(item.items, query) : [];
    return kids.length ? [{ ...item, items: kids }] : [];
  });
}

function highlight(label: string, query: string): ReactNode {
  const at = query ? label.toLowerCase().indexOf(query) : -1;
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark className="ds-sidebar__match">{label.slice(at, at + query.length)}</mark>
      {label.slice(at + query.length)}
    </>
  );
}

/**
 * App sidebar built from data, after Notion, ClickUp and Align UI: a header slot (workspace switcher),
 * optional search, sections of pages with nested trees, counts and letter tiles, a footer slot, and an
 * icon-rail collapsed state. The current page has aria-current="page".
 */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  {
    sections,
    value,
    defaultValue,
    onValueChange,
    header,
    footer,
    searchable = false,
    searchPlaceholder = 'Search',
    searchShortcut,
    collapsed = false,
    defaultExpanded,
    variant = 'default',
    size = 'md',
    headingLevel = 2,
    navLabel = 'Sidebar',
    className,
    ...rest
  },
  ref,
) {
  const baseId = `ds-sidebar-${useId()}`;
  const [current, setCurrent] = useControllableState<string | undefined>(value, defaultValue);
  const [query, setQuery] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const { parentOf, byId } = useMemo(() => indexTree(sections), [sections]);
  const ancestors = useMemo(() => ancestorsOf(current, parentOf), [current, parentOf]);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([...(defaultExpanded ?? []), ...ancestorsOf(current, parentOf)]),
  );

  // A current page chosen from outside (controlled value) opens its parents.
  useEffect(() => {
    if (ancestors.size === 0) return;
    setExpanded((prev) => ([...ancestors].every((id) => prev.has(id)) ? prev : new Set([...prev, ...ancestors])));
  }, [ancestors]);

  const needle = collapsed ? '' : query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      needle
        ? sections.map((section) => ({ ...section, items: filterItems(section.items, needle) })).filter((s) => s.items.length > 0)
        : sections,
    [sections, needle],
  );

  const ctx = useMemo<SidebarContextValue>(
    () => ({
      baseId,
      current,
      ancestors,
      expanded,
      query: needle,
      collapsed,
      toggle: (id, open) =>
        setExpanded((prev) => {
          const next = new Set(prev);
          if (open ?? !next.has(id)) next.add(id);
          else next.delete(id);
          return next;
        }),
      select: (item) => {
        setCurrent(item.id);
        onValueChange?.(item.id, item);
      },
    }),
    [baseId, current, ancestors, expanded, needle, collapsed, setCurrent, onValueChange],
  );

  const focusables = () =>
    Array.from(navRef.current?.querySelectorAll<HTMLElement>(LINK_SELECTOR) ?? []).filter(
      (el) => !el.closest('[hidden]') && !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true',
    );

  // Up/Down/Home/End move between rows; Right/Left open, enter, close and leave a page's children.
  const handleNavKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (!target.matches(LINK_SELECTOR)) return;
    const items = focusables();
    const index = items.indexOf(target);
    const id = target.dataset.id;
    const item = id ? byId.get(id) : undefined;
    const isOpen = !!id && (expanded.has(id) || !!needle);
    let next: HTMLElement | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = items[Math.min(index + 1, items.length - 1)];
        break;
      case 'ArrowUp':
        next = items[Math.max(index - 1, 0)];
        break;
      case 'Home':
        next = items[0];
        break;
      case 'End':
        next = items[items.length - 1];
        break;
      case 'ArrowRight':
        if (!item?.items?.length || collapsed) return;
        if (!isOpen) ctx.toggle(item.id, true);
        else next = items[index + 1];
        break;
      case 'ArrowLeft': {
        if (!id || collapsed) return;
        if (item?.items?.length && isOpen && !needle) ctx.toggle(id, false);
        else {
          const parent = parentOf.get(id);
          next = items.find((el) => el.dataset.id === parent);
          if (!next) return;
        }
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    next?.focus();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusables()[0]?.focus();
    } else if (event.key === 'Enter') {
      const first = navRef.current?.querySelector<HTMLElement>('.ds-sidebar__link[data-match]:not(:disabled):not([aria-disabled="true"])');
      if (first && needle) {
        event.preventDefault();
        first.click();
      }
    } else if (event.key === 'Escape' && query) {
      event.preventDefault();
      setQuery('');
    }
  };

  return (
    <SidebarContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cx(
          'ds-sidebar',
          `ds-sidebar--${variant}`,
          `ds-sidebar--${size}`,
          collapsed && 'ds-sidebar--collapsed',
          className,
        )}
        data-collapsed={collapsed || undefined}
        {...rest}
      >
        {header && <div className="ds-sidebar__header">{header}</div>}

        {searchable && !collapsed && (
          <div className="ds-sidebar__search">
            <Icon name="search" className="ds-sidebar__search-icon" />
            <input
              type="search"
              className="ds-sidebar__search-input"
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              aria-controls={`${baseId}-nav`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            {searchShortcut && !query && <span className="ds-sidebar__search-shortcut">{searchShortcut}</span>}
          </div>
        )}

        <nav ref={navRef} id={`${baseId}-nav`} className="ds-sidebar__nav" aria-label={navLabel} onKeyDown={handleNavKeyDown}>
          {visible.map((section, index) => (
            <Section key={section.id} section={section} first={index === 0} headingLevel={headingLevel} />
          ))}
          {needle && visible.length === 0 && (
            <p className="ds-sidebar__empty" role="status">
              No pages match “{query.trim()}”
            </p>
          )}
        </nav>

        {footer && <div className="ds-sidebar__footer">{footer}</div>}
      </div>
    </SidebarContext.Provider>
  );
});

function Section({ section, first, headingLevel }: { section: SidebarSection; first: boolean; headingLevel: number }) {
  const ctx = useContext(SidebarContext)!;
  const [open, setOpen] = useState(section.defaultOpen ?? true);
  const shown = !section.collapsible || open || !!ctx.query || ctx.collapsed;
  const collapse = useCollapse<HTMLDivElement>(shown);
  const headingId = `${ctx.baseId}-${section.id}-heading`;
  const listId = `${ctx.baseId}-${section.id}-list`;
  const Heading = `h${headingLevel}` as 'h2';
  const titled = !!section.title && !ctx.collapsed;

  return (
    <div className="ds-sidebar__section" data-state={shown ? 'open' : 'closed'}>
      {ctx.collapsed && !first && <div className="ds-sidebar__separator" role="presentation" />}
      {titled && (
        <div className="ds-sidebar__heading">
          <Heading id={headingId} className="ds-sidebar__heading-title">
            {section.collapsible ? (
              <button
                type="button"
                className="ds-sidebar__heading-toggle"
                aria-expanded={shown}
                aria-controls={listId}
                onClick={() => setOpen(!open)}
                disabled={!!ctx.query}
              >
                <span className="ds-sidebar__heading-text">{section.title}</span>
                <Icon name="alt-arrow-down" className="ds-sidebar__heading-chevron" />
              </button>
            ) : (
              <span className="ds-sidebar__heading-text">{section.title}</span>
            )}
          </Heading>
          {section.action && (
            <button
              type="button"
              className="ds-sidebar__heading-action"
              aria-label={section.action.label}
              title={section.action.label}
              onClick={section.action.onClick}
            >
              <Icon name={section.action.icon} />
            </button>
          )}
        </div>
      )}
      <div ref={collapse.ref} id={listId} className="ds-sidebar__collapse" data-state={collapse.state} hidden={collapse.hidden}>
        <div className="ds-sidebar__collapse-inner">
          <ul className="ds-sidebar__list" aria-labelledby={titled ? headingId : undefined}>
            {section.items.map((item) => (
              <Row key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Row({ item }: { item: SidebarItem }) {
  const ctx = useContext(SidebarContext)!;
  const children = item.items ?? [];
  const isParent = children.length > 0 && !ctx.collapsed;
  const open = isParent && (!!ctx.query || ctx.expanded.has(item.id));
  const collapse = useCollapse<HTMLDivElement>(open);
  const listId = `${ctx.baseId}-${item.id}-children`;
  const isCurrent = ctx.current === item.id;
  const hasBadge = item.badge !== undefined && item.badge !== null && item.badge !== false;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (item.disabled) {
      event.preventDefault();
      return;
    }
    ctx.select(item);
  };

  const content = (
    <>
      {item.icon ? (
        <Icon name={item.icon} className="ds-sidebar__icon" />
      ) : item.tone ? (
        <span className={cx('ds-sidebar__tile', `ds-sidebar__tile--${item.tone}`)} aria-hidden="true">
          {item.label.trim().charAt(0).toUpperCase()}
        </span>
      ) : null}
      <span className="ds-sidebar__label">{highlight(item.label, ctx.query)}</span>
      {hasBadge && <span className="ds-sidebar__badge">{item.badge}</span>}
    </>
  );

  const shared = {
    className: cx(
      'ds-sidebar__link',
      isParent && 'ds-sidebar__link--parent',
      hasBadge && 'ds-sidebar__link--badged',
      ctx.collapsed && ctx.ancestors.has(item.id) && 'ds-sidebar__link--holds-current',
    ),
    'aria-current': isCurrent ? ('page' as const) : undefined,
    'data-id': item.id,
    // While searching, matches read stronger than the parents shown only to lead to them.
    'data-match': ctx.query ? item.label.toLowerCase().includes(ctx.query) || undefined : undefined,
    onClick: handleClick,
  };

  const link =
    item.href !== undefined ? (
      <a
        href={item.disabled ? undefined : item.href}
        aria-disabled={item.disabled || undefined}
        role={item.disabled ? 'link' : undefined}
        {...shared}
      >
        {content}
      </a>
    ) : (
      <button type="button" disabled={item.disabled} {...shared}>
        {content}
      </button>
    );

  return (
    <li className="ds-sidebar__item">
      <div className="ds-sidebar__row">
        {ctx.collapsed ? (
          <Tooltip content={item.label} placement="right" delay={0}>
            {link}
          </Tooltip>
        ) : (
          link
        )}
        {isParent && !ctx.query && (
          <button
            type="button"
            className="ds-sidebar__toggle"
            aria-expanded={open}
            aria-controls={listId}
            aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
            onClick={() => ctx.toggle(item.id)}
          >
            <Icon name="alt-arrow-right" />
          </button>
        )}
      </div>
      {isParent && (
        <div ref={collapse.ref} id={listId} className="ds-sidebar__collapse" data-state={collapse.state} hidden={collapse.hidden}>
          <div className="ds-sidebar__collapse-inner">
            <ul className="ds-sidebar__list ds-sidebar__list--nested" aria-label={item.label}>
              {children.map((child) => (
                <Row key={child.id} item={child} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  );
}

export interface SidebarWorkspaceProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Workspace or product name. */
  name: string;
  /** Second line: plan, member count, URL… */
  meta?: ReactNode;
  /** Colour of the initials tile. */
  tone?: SidebarTone;
  /** Replaces the initials tile, e.g. an <img> logo. */
  logo?: ReactNode;
}

/** Workspace switcher for the sidebar header. Use it as a `Menu` trigger. */
export const SidebarWorkspace = forwardRef<HTMLButtonElement, SidebarWorkspaceProps>(function SidebarWorkspace(
  { name, meta, tone = 'accent', logo, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx('ds-sidebar__identity', className)} {...rest}>
      {logo ?? (
        <span className={cx('ds-sidebar__tile', 'ds-sidebar__tile--lg', `ds-sidebar__tile--${tone}`)} aria-hidden="true">
          {getInitials(name).charAt(0)}
        </span>
      )}
      <span className="ds-sidebar__identity-text">
        <span className="ds-sidebar__identity-name">{name}</span>
        {meta && <span className="ds-sidebar__identity-meta">{meta}</span>}
      </span>
      <Icon name="sort-vertical" className="ds-sidebar__identity-icon" />
    </button>
  );
});

export interface SidebarUserProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  /** Second line, usually the email address. */
  meta?: ReactNode;
  /** Avatar image. Falls back to initials. */
  src?: string;
  status?: AvatarStatus;
}

/** Signed-in person for the sidebar footer. Use it as a `Menu` trigger for account actions. */
export const SidebarUser = forwardRef<HTMLButtonElement, SidebarUserProps>(function SidebarUser(
  { name, meta, src, status, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx('ds-sidebar__identity', className)} {...rest}>
      <Avatar size="sm" name={name} src={src} status={status} aria-hidden="true" />
      <span className="ds-sidebar__identity-text">
        <span className="ds-sidebar__identity-name">{name}</span>
        {meta && <span className="ds-sidebar__identity-meta">{meta}</span>}
      </span>
      <Icon name="menu-dots" className="ds-sidebar__identity-icon" />
    </button>
  );
});
