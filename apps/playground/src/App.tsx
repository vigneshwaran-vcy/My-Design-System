import { ButtonIcon, Icon, Kbd, Menu, type IconName, type MenuItem } from '@my-ds/ui';
import { useEffect, useMemo, useRef, useState, type ComponentType, type KeyboardEvent } from 'react';
import { AlertDocs } from './docs/components/AlertDocs';
import { AvatarDocs } from './docs/components/AvatarDocs';
import { BadgeDocs } from './docs/components/BadgeDocs';
import { BreadcrumbDocs } from './docs/components/BreadcrumbDocs';
import { ButtonDocs } from './docs/components/ButtonDocs';
import { CardDocs } from './docs/components/CardDocs';
import { ChatInputDocs } from './docs/components/ChatInputDocs';
import { CheckboxDocs } from './docs/components/CheckboxDocs';
import { DropdownDocs } from './docs/components/DropdownDocs';
import { EmptyStateDocs } from './docs/components/EmptyStateDocs';
import { InputDocs } from './docs/components/InputDocs';
import { KbdDocs } from './docs/components/KbdDocs';
import { MenuDocs } from './docs/components/MenuDocs';
import { ModalDocs } from './docs/components/ModalDocs';
import { PaginationDocs } from './docs/components/PaginationDocs';
import { PopoverDocs } from './docs/components/PopoverDocs';
import { ProgressDocs } from './docs/components/ProgressDocs';
import { RadioGroupDocs } from './docs/components/RadioGroupDocs';
import { SeparatorDocs } from './docs/components/SeparatorDocs';
import { SkeletonDocs } from './docs/components/SkeletonDocs';
import { SpinnerDocs } from './docs/components/SpinnerDocs';
import { SwitchDocs } from './docs/components/SwitchDocs';
import { TableDocs } from './docs/components/TableDocs';
import { TabsDocs } from './docs/components/TabsDocs';
import { TextareaDocs } from './docs/components/TextareaDocs';
import { ToastDocs } from './docs/components/ToastDocs';
import { TooltipDocs } from './docs/components/TooltipDocs';
import { AccordionDocs } from './docs/components/AccordionDocs';
import { ButtonGroupDocs } from './docs/components/ButtonGroupDocs';
import { ButtonIconDocs } from './docs/components/ButtonIconDocs';
import { CalendarDocs } from './docs/components/CalendarDocs';
import { CarouselDocs } from './docs/components/CarouselDocs';
import { ColorPickerDocs } from './docs/components/ColorPickerDocs';
import { DatepickerDocs } from './docs/components/DatepickerDocs';
import { DatetimePickerDocs } from './docs/components/DatetimePickerDocs';
import { DualListboxDocs } from './docs/components/DualListboxDocs';
import { DynamicIconDocs } from './docs/components/DynamicIconDocs';
import { FileSelectorDocs } from './docs/components/FileSelectorDocs';
import { FormElementDocs } from './docs/components/FormElementDocs';
import { PillDocs } from './docs/components/PillDocs';
import { ProgressIndicatorDocs } from './docs/components/ProgressIndicatorDocs';
import { PromptDocs } from './docs/components/PromptDocs';
import { SegmentedControlDocs } from './docs/components/SegmentedControlDocs';
import { ScopedTabsDocs } from './docs/components/ScopedTabsDocs';
import { SliderDocs } from './docs/components/SliderDocs';
import { TileDocs } from './docs/components/TileDocs';
import { TimepickerDocs } from './docs/components/TimepickerDocs';
import { TreeDocs } from './docs/components/TreeDocs';
import { SidebarDocs } from './docs/components/SidebarDocs';
import { VerticalNavigationDocs } from './docs/components/VerticalNavigationDocs';
import { Foundations, foundationsNav } from './docs/Foundations';
import { Overview } from './docs/Overview';

type Theme = 'light' | 'dark';

const NAV = [
  { title: 'Getting started', items: [['overview', 'Overview']] },
  { title: 'Foundations', items: foundationsNav },
  { title: 'Forms', items: [['button', 'Button'], ['input', 'Input'], ['textarea', 'Textarea'], ['dropdown', 'Dropdown'], ['checkbox', 'Checkbox'], ['radio-group', 'Radio group'], ['switch', 'Switch'], ['chat-input', 'ChatInput'], ['button-group', 'Button group'], ['button-icon', 'Button icon'], ['segmented-control', 'Segmented control'], ['slider', 'Slider'], ['form-element', 'Form element'], ['file-selector', 'File selector'], ['color-picker', 'Color picker'], ['dual-listbox', 'Dual listbox']] },
  { title: 'Date & time', items: [['calendar', 'Calendar'], ['datepicker', 'Datepicker'], ['timepicker', 'Timepicker'], ['datetime-picker', 'Datetime picker']] },
  { title: 'Overlays', items: [['modal', 'Modal'], ['popover', 'Popover'], ['menu', 'Menu'], ['tooltip', 'Tooltip'], ['toast', 'Toast'], ['prompt', 'Prompt']] },
  { title: 'Data display', items: [['card', 'Card'], ['table', 'Table'], ['badge', 'Badge'], ['avatar', 'Avatar'], ['tabs', 'Tabs'], ['kbd', 'Kbd'], ['separator', 'Separator'], ['pill', 'Pills'], ['tile', 'Tiles'], ['dynamic-icon', 'Dynamic icons'], ['accordion', 'Accordion'], ['tree', 'Tree'], ['carousel', 'Carousel']] },
  { title: 'Feedback', items: [['alert', 'Alert'], ['progress', 'Progress'], ['spinner', 'Spinner'], ['skeleton', 'Skeleton'], ['empty-state', 'Empty state']] },
  { title: 'Navigation', items: [['breadcrumb', 'Breadcrumb'], ['pagination', 'Pagination'], ['sidebar', 'Sidebar'], ['vertical-navigation', 'Vertical navigation'], ['scoped-tabs', 'Scoped tabs'], ['progress-indicator', 'Progress indicator']] },
] as const;

/** Component pages by id; Overview and the Foundations pages are rendered separately. */
const COMPONENT_PAGES: Record<string, ComponentType> = {
  'button': ButtonDocs,
  'input': InputDocs,
  'textarea': TextareaDocs,
  'dropdown': DropdownDocs,
  'checkbox': CheckboxDocs,
  'radio-group': RadioGroupDocs,
  'switch': SwitchDocs,
  'chat-input': ChatInputDocs,
  'button-group': ButtonGroupDocs,
  'button-icon': ButtonIconDocs,
  'segmented-control': SegmentedControlDocs,
  'slider': SliderDocs,
  'form-element': FormElementDocs,
  'file-selector': FileSelectorDocs,
  'color-picker': ColorPickerDocs,
  'dual-listbox': DualListboxDocs,
  'calendar': CalendarDocs,
  'datepicker': DatepickerDocs,
  'timepicker': TimepickerDocs,
  'datetime-picker': DatetimePickerDocs,
  'modal': ModalDocs,
  'popover': PopoverDocs,
  'menu': MenuDocs,
  'tooltip': TooltipDocs,
  'toast': ToastDocs,
  'prompt': PromptDocs,
  'card': CardDocs,
  'table': TableDocs,
  'badge': BadgeDocs,
  'avatar': AvatarDocs,
  'tabs': TabsDocs,
  'kbd': KbdDocs,
  'separator': SeparatorDocs,
  'pill': PillDocs,
  'tile': TileDocs,
  'dynamic-icon': DynamicIconDocs,
  'accordion': AccordionDocs,
  'tree': TreeDocs,
  'carousel': CarouselDocs,
  'alert': AlertDocs,
  'progress': ProgressDocs,
  'spinner': SpinnerDocs,
  'skeleton': SkeletonDocs,
  'empty-state': EmptyStateDocs,
  'breadcrumb': BreadcrumbDocs,
  'pagination': PaginationDocs,
  sidebar: SidebarDocs,
  'vertical-navigation': VerticalNavigationDocs,
  'scoped-tabs': ScopedTabsDocs,
  'progress-indicator': ProgressIndicatorDocs,
};

const PAGES = NAV.flatMap((g) => g.items.map(([id, label]) => ({ id: id as string, label: label as string, group: g.title as string })));
const FOUNDATION_IDS = new Set<string>(foundationsNav.map(([id]) => id));
const pageFromHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return PAGES.some((p) => p.id === id) ? id : null;
};

/** One page at a time, chosen by the URL hash (#button), so links, Back and reload all work. */
function usePage() {
  const [page, setPage] = useState(() => pageFromHash() ?? PAGES[0].id);
  useEffect(() => {
    const onHashChange = () => {
      const id = pageFromHash();
      // Other hashes (the skip link's #main) are not pages; stay where we are.
      if (!id) return;
      setPage(id);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return page;
}

const COLLAPSED_KEY = 'ds-docs-nav-collapsed';
const FAVORITES_KEY = 'ds-docs-nav-favorites';
const RAIL_KEY = 'ds-docs-nav-rail';
const FAVORITES = 'Favorites';

const GROUP_ICONS: Record<string, IconName> = {
  [FAVORITES]: 'star',
  'Getting started': 'home',
  Foundations: 'palette',
  Forms: 'pen',
  'Date & time': 'calendar',
  Overlays: 'copy',
  'Data display': 'chart-2',
  Feedback: 'bell',
  Navigation: 'map-point',
};

/** A saved list of strings; private windows may block storage, so every read and write is guarded. */
function readList(key: string): string[] {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(saved) ? saved.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The panel still works for this visit.
  }
}
function readRail() {
  try {
    return localStorage.getItem(RAIL_KEY) === 'true';
  } catch {
    return false;
  }
}

/** ⌘ on Apple devices, Ctrl elsewhere. */
const MOD = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl ';

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

export function App() {
  // Always open in the light theme; dark is opt-in via the theme switch.
  const [theme, setTheme] = useState<Theme>('light');
  const [navOpen, setNavOpen] = useState(false);
  // Desktop only: the panel collapsed to a rail of group icons.
  const [rail, setRail] = useState(readRail);
  const active = usePage();
  const index = PAGES.findIndex((p) => p.id === active);
  const current = PAGES[index];
  const previous = PAGES[index - 1];
  const next = PAGES[index + 1];
  const Page = COMPONENT_PAGES[active];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => save(RAIL_KEY, rail), [rail]);

  // The phone drawer closes once a page is chosen.
  useEffect(() => setNavOpen(false), [active]);

  return (
    <div className="pg" data-nav-open={navOpen || undefined} data-rail={rail || undefined}>
      <a className="pg__skip" href="#main">Skip to content</a>

      <Sidebar active={active} open={navOpen} rail={rail} onClose={() => setNavOpen(false)} onRailChange={setRail} />
      <div className="pg__scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />

      <div className="pg__content">
        <header className="pg__topbar">
          <ButtonIcon
            className="pg__menu"
            variant="bare"
            icon="hamburger-menu"
            label="Open navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
          />
          <p className="pg__crumbs">
            <span>{current.group}</span>
            <span aria-hidden="true" className="pg__crumb-sep">/</span>
            <span className="pg__crumb-current">{current.label}</span>
          </p>
          <ThemeSwitch theme={theme} onChange={setTheme} />
        </header>

        <main id="main" className="pg__main">
          {active === 'overview' ? <Overview /> : FOUNDATION_IDS.has(active) ? <Foundations active={active} /> : <Page />}

          <nav className="pg__pager" aria-label="Previous and next page">
            {previous ? (
              <a className="pg__pager-link" href={`#${previous.id}`}>
                <Icon name="arrow-left" />
                <span>
                  <span className="pg__pager-hint">Previous</span>
                  <span className="pg__pager-label">{previous.label}</span>
                </span>
              </a>
            ) : <span />}
            {next && (
              <a className="pg__pager-link pg__pager-link--next" href={`#${next.id}`}>
                <span>
                  <span className="pg__pager-hint">Next</span>
                  <span className="pg__pager-label">{next.label}</span>
                </span>
                <Icon name="arrow-right" />
              </a>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}

/**
 * Left panel, modelled on the Notion / ClickUp / Align UI sidebars:
 * a workspace header, search (⌘K or "/"), pinned Favorites, icon-led groups whose pages hang off a
 * tree line, and a footer of shortcuts. It collapses to a rail of group icons with fly-out menus
 * (⌘\), and on phones it is a drawer.
 */
function Sidebar({ active, open, rail, onClose, onRailChange }: {
  active: string;
  open: boolean;
  rail: boolean;
  onClose: () => void;
  onRailChange: (rail: boolean) => void;
}) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(() => readList(COLLAPSED_KEY));
  const [favorites, setFavorites] = useState(() => readList(FAVORITES_KEY).filter((id) => PAGES.some((p) => p.id === id)));
  const searchRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLElement>(null);
  // Set when search is requested from the rail; honoured once the full panel has rendered.
  const wantSearch = useRef(false);
  const q = query.trim().toLowerCase();
  // The phone drawer always shows the full panel.
  const showRail = rail && !open;

  const allGroups = useMemo(
    () => NAV.map((g) => ({ title: g.title as string, items: g.items.map(([id, label]) => [id, label] as [string, string]) })),
    [],
  );
  const groups = useMemo(() => {
    if (q) {
      // A match on the group name keeps the whole group.
      return allGroups
        .map((g) => ({ ...g, items: g.items.filter(([id, label]) => g.title.toLowerCase().includes(q) || label.toLowerCase().includes(q) || id.includes(q)) }))
        .filter((g) => g.items.length > 0);
    }
    const pinned = favorites.flatMap((id) => PAGES.filter((p) => p.id === id).map((p) => [p.id, p.label] as [string, string]));
    return pinned.length ? [{ title: FAVORITES, items: pinned }, ...allGroups] : allGroups;
  }, [q, favorites, allGroups]);
  const firstMatch = groups[0]?.items[0]?.[0];
  const activeGroup = NAV.find((g) => g.items.some(([id]) => id === active))?.title;

  useEffect(() => save(COLLAPSED_KEY, collapsed), [collapsed]);
  useEffect(() => save(FAVORITES_KEY, favorites), [favorites]);

  // The current page's group is always open, and its link is scrolled into view inside the list.
  useEffect(() => {
    if (activeGroup) setCollapsed((c) => (c.includes(activeGroup) ? c.filter((t) => t !== activeGroup) : c));
  }, [activeGroup]);
  useEffect(() => {
    const list = navRef.current;
    const link =
      list?.querySelector<HTMLElement>('.pg__nav-group:not([data-favorites]) .pg__nav-link[aria-current]') ??
      list?.querySelector<HTMLElement>('.pg__nav-link[aria-current]');
    if (!list || !link) return;
    const l = link.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    if (l.top < b.top) list.scrollTop -= b.top - l.top + l.height;
    else if (l.bottom > b.bottom) list.scrollTop += l.bottom - b.bottom + l.height;
  }, [active, collapsed, showRail]);

  // "/" or ⌘K searches from anywhere, ⌘\ collapses or expands the panel, Escape closes the phone drawer.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;
      if ((event.key === '/' && !isTyping(event.target)) || (mod && event.key.toLowerCase() === 'k')) {
        event.preventDefault();
        if (showRail) {
          wantSearch.current = true;
          onRailChange(false);
        } else {
          searchRef.current?.focus();
          searchRef.current?.select();
        }
      } else if (mod && event.key === '\\') {
        event.preventDefault();
        onRailChange(!rail);
      } else if (event.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, rail, showRail, onClose, onRailChange]);

  useEffect(() => {
    if (showRail || !(open || wantSearch.current)) return;
    wantSearch.current = false;
    searchRef.current?.focus();
  }, [open, showRail]);

  if (showRail) {
    return (
      <aside className="pg__sidebar pg__sidebar--rail">
        <ButtonIcon variant="bare" icon="sidebar-minimalistic" label={`Expand sidebar (${MOD}\\)`} onClick={() => onRailChange(false)} />
        <ButtonIcon
          variant="bare"
          icon="search"
          label={`Search pages (${MOD}K)`}
          onClick={() => {
            wantSearch.current = true;
            onRailChange(false);
          }}
        />
        <span className="pg__rail-sep" aria-hidden="true" />
        <nav aria-label="Documentation" className="pg__rail-nav">
          {groups.map((g) => {
            const items: MenuItem[] = [
              { id: `label-${g.title}`, type: 'label', label: g.title },
              ...g.items.map(([id, label]) => ({ id, label })),
            ];
            return (
              <Menu
                key={g.title}
                items={items}
                onSelect={(id) => {
                  window.location.hash = id;
                }}
                trigger={
                  <ButtonIcon
                    variant="bare"
                    icon={GROUP_ICONS[g.title]}
                    label={g.title}
                    className={g.title === activeGroup ? 'pg__rail-item pg__rail-item--active' : 'pg__rail-item'}
                  />
                }
              />
            );
          })}
        </nav>
      </aside>
    );
  }

  const links = () => [...(navRef.current?.querySelectorAll<HTMLElement>('.pg__nav-link') ?? [])];

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && firstMatch) {
      window.location.hash = firstMatch;
      setQuery('');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      links()[0]?.focus();
    } else if (event.key === 'Escape' && query) {
      event.stopPropagation();
      setQuery('');
    }
  };

  // ↑ / ↓ walk the visible links; ↑ on the first returns to search.
  const onNavKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const all = links();
    const at = all.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    event.preventDefault();
    const target = all[at + (event.key === 'ArrowDown' ? 1 : -1)];
    if (target) target.focus();
    else if (event.key === 'ArrowUp') searchRef.current?.focus();
  };

  const toggle = (title: string) => setCollapsed((c) => (c.includes(title) ? c.filter((t) => t !== title) : [...c, title]));
  const toggleFavorite = (id: string) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  return (
    <aside className="pg__sidebar" data-open={open || undefined}>
      <div className="pg__sidebar-head">
        <div className="pg__brand">
          <span className="pg__logo" aria-hidden="true" />
          <span className="pg__brand-text">
            <span className="pg__brand-name">My Design System</span>
            <span className="pg__brand-meta">v0.1 · {Object.keys(COMPONENT_PAGES).length} components</span>
          </span>
          <ButtonIcon
            className="pg__collapse"
            variant="bare"
            size="sm"
            icon="sidebar-minimalistic"
            label={`Collapse sidebar (${MOD}\\)`}
            onClick={() => onRailChange(true)}
          />
          <ButtonIcon className="pg__close" variant="bare" size="sm" icon="close" label="Close navigation" onClick={onClose} />
        </div>
        <div className="pg__search">
          <Icon name="search" className="pg__search-icon" />
          <input
            ref={searchRef}
            className="pg__search-input"
            type="search"
            aria-label="Search pages"
            aria-controls="pg-nav"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
          {!query && <Kbd className="pg__search-key" size="sm">{MOD}K</Kbd>}
        </div>
      </div>

      <nav id="pg-nav" ref={navRef} aria-label="Documentation" className="pg__nav" onKeyDown={onNavKeyDown}>
        {groups.length === 0 && <p className="pg__nav-empty">No pages match “{query}”.</p>}
        {groups.map((g) => {
          // While searching, every group with a match is open.
          const isOpen = q !== '' || !collapsed.includes(g.title);
          const listId = `pg-nav-${g.title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
          return (
            <div key={g.title} className="pg__nav-group" data-favorites={g.title === FAVORITES || undefined}>
              <button
                type="button"
                className="pg__nav-toggle"
                aria-expanded={isOpen}
                aria-controls={listId}
                disabled={q !== ''}
                onClick={() => toggle(g.title)}
              >
                <Icon name={GROUP_ICONS[g.title]} className="pg__nav-icon" />
                <span className="pg__nav-title">{g.title}</span>
                <span className="pg__nav-count">{g.items.length}</span>
                <Icon name="alt-arrow-down" className="pg__nav-chevron" />
              </button>
              <ul id={listId} className="pg__nav-list" hidden={!isOpen}>
                {g.items.map(([id, label]) => {
                  const pinned = favorites.includes(id);
                  return (
                    <li key={id} className="pg__nav-item">
                      <a href={`#${id}`} className="pg__nav-link" aria-current={active === id ? 'page' : undefined}>
                        {label}
                      </a>
                      <button
                        type="button"
                        className="pg__nav-star"
                        aria-pressed={pinned}
                        aria-label={pinned ? `Remove ${label} from favorites` : `Add ${label} to favorites`}
                        title={pinned ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={() => toggleFavorite(id)}
                      >
                        <Icon name="star" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="pg__sidebar-foot">
        <span className="pg__hint"><Kbd size="sm">/</Kbd> Search</span>
        <span className="pg__hint"><Kbd size="sm">{MOD}\</Kbd> Collapse</span>
      </div>
    </aside>
  );
}

/** Two-option segmented switch, like the macOS appearance picker. */
function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div role="group" aria-label="Theme" className="pg__theme" data-value={theme}>
      <span className="pg__theme-thumb" aria-hidden="true" />
      {(['light', 'dark'] as const).map((t) => (
        <button
          key={t}
          type="button"
          className="pg__theme-option"
          aria-pressed={theme === t}
          aria-label={t === 'light' ? 'Light theme' : 'Dark theme'}
          onClick={() => onChange(t)}
        >
          {t === 'light' ? <Icon name="sun" /> : <Icon name="moon" />}
        </button>
      ))}
    </div>
  );
}
