import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import './Tabs.css';

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsVariant = 'underline' | 'pill';
export type TabsSize = 'sm' | 'md';

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  setValue: (value: string) => void;
  orientation: TabsOrientation;
  variant: TabsVariant;
  size: TabsSize;
  tabId: (value: string) => string;
  panelId: (value: string) => string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Tabs>.`);
  return ctx;
}

const slug = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '-');

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Controlled selected tab value. */
  value?: string;
  /** Initial selected tab value (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  /** `underline` = accent bottom border; `pill` = segmented track with a raised selected pill. */
  variant?: TabsVariant;
  size?: TabsSize;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onValueChange, orientation = 'horizontal', variant = 'underline', size = 'md', className, children, ...rest },
  ref,
) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue);
  const selected = value !== undefined ? value : internal;

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next);
      if (next !== selected) onValueChange?.(next);
    },
    [value, selected, onValueChange],
  );

  const ctx = useMemo<TabsContextValue>(
    () => ({
      baseId,
      value: selected,
      setValue,
      orientation,
      variant,
      size,
      tabId: (v) => `ds-tabs-${baseId}-tab-${slug(v)}`,
      panelId: (v) => `ds-tabs-${baseId}-panel-${slug(v)}`,
    }),
    [baseId, selected, setValue, orientation, variant, size],
  );

  return (
    <TabsContext.Provider value={ctx}>
      <div
        ref={ref}
        className={cx('ds-tabs', `ds-tabs--${orientation}`, `ds-tabs--${variant}`, `ds-tabs--${size}`, className)}
        data-orientation={orientation}
        {...rest}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
});

export type TabListProps = HTMLAttributes<HTMLDivElement>;

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList({ className, onKeyDown, children, ...rest }, ref) {
  const { orientation, setValue } = useTabsContext('TabList');
  const listRef = useRef<HTMLDivElement | null>(null);

  const setRefs = (node: HTMLDivElement | null) => {
    listRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []);
    if (tabs.length === 0) return;
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

    let target = -1;
    switch (event.key) {
      case nextKey:
        target = current < 0 ? 0 : (current + 1) % tabs.length;
        break;
      case prevKey:
        target = current < 0 ? tabs.length - 1 : (current - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    const tab = tabs[target];
    tab.focus();
    // Automatic activation: moving focus selects the tab.
    const value = tab.dataset.value;
    if (value !== undefined) setValue(value);
  };

  return (
    <div
      ref={setRefs}
      role="tablist"
      aria-orientation={orientation}
      className={cx('ds-tabs__list', className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
});

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string;
  /** Decorative leading icon (hidden from assistive tech). */
  icon?: ReactNode;
  /** Trailing count or status, e.g. a Badge or a number. */
  badge?: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, icon, badge, disabled, className, children, onClick, ...rest },
  ref,
) {
  const { value: selectedValue, setValue, tabId, panelId } = useTabsContext('Tab');
  const selected = selectedValue === value;

  return (
    <button
      ref={ref}
      id={tabId(value)}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={panelId(value)}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      data-state={selected ? 'active' : 'inactive'}
      className={cx('ds-tabs__tab', selected && 'ds-tabs__tab--selected', className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) setValue(value);
      }}
      {...rest}
    >
      {icon && (
        <span className="ds-tabs__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ds-tabs__label">{children}</span>
      {badge !== undefined && badge !== null && <span className="ds-tabs__badge">{badge}</span>}
    </button>
  );
});

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  /** Keep the panel mounted (but hidden) when not selected. */
  forceMount?: boolean;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, forceMount = false, className, children, ...rest },
  ref,
) {
  const { value: selectedValue, tabId, panelId } = useTabsContext('TabPanel');
  const selected = selectedValue === value;
  if (!selected && !forceMount) return null;

  return (
    <div
      ref={ref}
      id={panelId(value)}
      role="tabpanel"
      aria-labelledby={tabId(value)}
      tabIndex={0}
      hidden={!selected}
      data-state={selected ? 'active' : 'inactive'}
      className={cx('ds-tabs__panel', className)}
      {...rest}
    >
      {children}
    </div>
  );
});
