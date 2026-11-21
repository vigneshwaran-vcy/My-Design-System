import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { useCollapse } from '../Accordion/useCollapse';
import { Icon, type IconName } from '../Icon';
import './VerticalNavigation.css';
import { safeHref } from '../../utils/safeHref';

export type VerticalNavigationVariant = 'default' | 'framed';
export type VerticalNavigationSize = 'sm' | 'md';

interface NavContextValue {
  value: string | undefined;
  select: (value: string) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

export interface VerticalNavigationProps extends Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'onChange'> {
  /** Controlled value of the current item. */
  value?: string;
  /** Initially current item (uncontrolled). */
  defaultValue?: string;
  /** Called when an item is activated. */
  onValueChange?: (value: string) => void;
  /** `default` = transparent; `framed` = sits in a tinted frame. */
  variant?: VerticalNavigationVariant;
  /** `sm` is the compact density. */
  size?: VerticalNavigationSize;
}

const ITEM_SELECTOR = '.ds-vertical-navigation__link, .ds-vertical-navigation__section-toggle';

/** Sidebar navigation: titled sections of links; the current item has aria-current="page". */
export const VerticalNavigation = forwardRef<HTMLElement, VerticalNavigationProps>(function VerticalNavigation(
  { value, defaultValue, onValueChange, variant = 'default', size = 'md', className, onKeyDown, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const [current, setCurrent] = useControllableState<string | undefined>(value, defaultValue, (next) => {
    if (next !== undefined) onValueChange?.(next);
  });
  const rootRef = useRef<HTMLElement | null>(null);
  const ctx = useMemo<NavContextValue>(() => ({ value: current, select: setCurrent }), [current, setCurrent]);

  const setRefs = (node: HTMLElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Optional arrow-key convenience on top of the normal Tab order.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !rootRef.current) return;
    const target = event.target as HTMLElement;
    if (!target.matches(ITEM_SELECTOR)) return;
    const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
      (el) => !el.closest('[hidden]') && !el.hasAttribute('disabled') && el.getAttribute('aria-disabled') !== 'true',
    );
    const index = items.indexOf(target);
    let next = -1;
    switch (event.key) {
      case 'ArrowDown':
        next = Math.min(index + 1, items.length - 1);
        break;
      case 'ArrowUp':
        next = Math.max(index - 1, 0);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = items.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    items[next]?.focus();
  };

  return (
    <NavContext.Provider value={ctx}>
      <nav
        ref={setRefs}
        aria-label={ariaLabel ?? 'Navigation'}
        className={cx('ds-vertical-navigation', `ds-vertical-navigation--${variant}`, `ds-vertical-navigation--${size}`, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
});

export interface VerticalNavigationSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section heading. Optional for an untitled group. */
  title?: ReactNode;
  /** Lets the heading toggle the section open and closed. */
  collapsible?: boolean;
  /** Controlled open state (collapsible sections). */
  open?: boolean;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export const VerticalNavigationSection = forwardRef<HTMLDivElement, VerticalNavigationSectionProps>(function VerticalNavigationSection(
  { title, collapsible = false, open, defaultOpen = true, onOpenChange, headingLevel = 2, className, children, ...rest },
  ref,
) {
  const id = useId();
  const headingId = `ds-vnav-${id}-heading`;
  const listId = `ds-vnav-${id}-list`;
  const [isOpen, setOpen] = useControllableState<boolean>(open, defaultOpen, onOpenChange);
  const expanded = !collapsible || isOpen;
  const collapse = useCollapse<HTMLDivElement>(expanded);
  const Heading = `h${headingLevel}` as 'h2';

  return (
    <div
      ref={ref}
      className={cx('ds-vertical-navigation__section', collapsible && 'ds-vertical-navigation__section--collapsible', className)}
      data-state={expanded ? 'open' : 'closed'}
      {...rest}
    >
      {title !== undefined && title !== null && (
        <Heading id={headingId} className="ds-vertical-navigation__heading">
          {collapsible ? (
            <button
              type="button"
              className="ds-vertical-navigation__section-toggle"
              aria-expanded={expanded}
              aria-controls={listId}
              onClick={() => setOpen(!isOpen)}
            >
              <span className="ds-vertical-navigation__section-title">{title}</span>
              <span className="ds-vertical-navigation__chevron" aria-hidden="true">
                <Icon name="alt-arrow-down" />
              </span>
            </button>
          ) : (
            <span className="ds-vertical-navigation__section-title">{title}</span>
          )}
        </Heading>
      )}
      <div
        ref={collapse.ref}
        id={listId}
        className="ds-vertical-navigation__collapse"
        data-state={collapse.state}
        hidden={collapse.hidden}
      >
        <div className="ds-vertical-navigation__collapse-inner">
          <ul className="ds-vertical-navigation__list" aria-labelledby={title !== undefined && title !== null ? headingId : undefined}>
            {children}
          </ul>
        </div>
      </div>
    </div>
  );
});

export interface VerticalNavigationItemProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** Identifies the item; it is current when it matches the navigation's value. */
  value: string;
  /** Leading icon: a Solar icon name or any node (decorative). */
  icon?: IconName | ReactNode;
  /** Trailing count or status. */
  badge?: ReactNode;
  /** Forces the current state regardless of the navigation value. */
  current?: boolean;
  disabled?: boolean;
  /** Renders a link when given, otherwise a button. */
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export const VerticalNavigationItem = forwardRef<HTMLElement, VerticalNavigationItemProps>(function VerticalNavigationItem(
  { value, icon, badge, current: currentProp, disabled = false, href, onClick, className, children, ...rest },
  ref,
) {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('<VerticalNavigationItem> must be rendered inside <VerticalNavigation>.');
  const isCurrent = currentProp ?? ctx.value === value;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    // Links may preventDefault for client-side routing; the item still becomes current.
    onClick?.(event);
    ctx.select(value);
  };

  const content = (
    <>
      {icon && (
        <span className="ds-vertical-navigation__icon" aria-hidden="true">
          {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}
        </span>
      )}
      <span className="ds-vertical-navigation__label">{children}</span>
      {badge !== undefined && badge !== null && <span className="ds-vertical-navigation__badge">{badge}</span>}
    </>
  );

  const shared = {
    className: cx('ds-vertical-navigation__link', isCurrent && 'ds-vertical-navigation__link--current', className),
    'aria-current': isCurrent ? ('page' as const) : undefined,
    'data-value': value,
    onClick: handleClick,
  };

  return (
    <li className="ds-vertical-navigation__item">
      {href !== undefined ? (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={disabled ? undefined : safeHref(href)}
          aria-disabled={disabled || undefined}
          role={disabled ? 'link' : undefined}
          {...rest}
          {...shared}
        >
          {content}
        </a>
      ) : (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          disabled={disabled}
          {...(rest as HTMLAttributes<HTMLButtonElement>)}
          {...shared}
        >
          {content}
        </button>
      )}
    </li>
  );
});
