import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './Breadcrumb.css';
import { safeHref } from '../../utils/safeHref';

export interface BreadcrumbItem {
  label: ReactNode;
  /** Renders the item as a link. Omit for a non-link crumb (e.g. a section without a page). */
  href?: string;
  icon?: ReactNode;
  /** Marks the current page. Defaults to the last item. */
  current?: boolean;
  /** Click handler for client-side routing. */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  /** Visual separator between crumbs (aria-hidden). Defaults to a chevron. */
  separator?: ReactNode;
  /**
   * Maximum visible slots (minimum 2). When exceeded, the middle crumbs collapse behind an
   * ellipsis button that reveals them; the first and the last items always stay visible.
   */
  maxItems?: number;
}

type Slot = { kind: 'item'; item: BreadcrumbItem; index: number } | { kind: 'ellipsis'; hidden: number };

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator, maxItems, className, 'aria-label': ariaLabel = 'Breadcrumb', ...rest },
  ref,
) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const focusIndexRef = useRef<number | null>(null);

  // Reset collapse when the trail changes.
  useEffect(() => {
    setExpanded(false);
  }, [items.length, maxItems]);

  // After expanding, move focus to the first revealed crumb so keyboard users don't lose their place.
  useEffect(() => {
    if (!expanded || focusIndexRef.current === null) return;
    const target = listRef.current?.querySelector<HTMLElement>(`[data-index="${focusIndexRef.current}"] a, [data-index="${focusIndexRef.current}"] span`);
    target?.focus();
    focusIndexRef.current = null;
  }, [expanded]);

  const lastIndex = items.length - 1;
  // The last crumb is the current page unless an item says otherwise.
  const hasExplicitCurrent = items.some((item) => item.current);
  const shouldCollapse = maxItems !== undefined && !expanded && items.length > Math.max(2, maxItems);
  const slots: Slot[] = [];
  if (shouldCollapse) {
    const after = Math.max(1, Math.max(2, maxItems) - 2);
    const firstTail = items.length - after;
    slots.push({ kind: 'item', item: items[0], index: 0 });
    slots.push({ kind: 'ellipsis', hidden: firstTail - 1 });
    for (let i = firstTail; i < items.length; i++) slots.push({ kind: 'item', item: items[i], index: i });
  } else {
    items.forEach((item, index) => slots.push({ kind: 'item', item, index }));
  }

  const sep = <span className="ds-breadcrumb__separator" aria-hidden="true">{separator ?? <Icon name="alt-arrow-right" />}</span>;

  return (
    <nav ref={ref} aria-label={ariaLabel} className={cx('ds-breadcrumb', className)} {...rest}>
      <ol ref={listRef} className="ds-breadcrumb__list">
        {slots.map((slot, slotIndex) => {
          const isLast = slotIndex === slots.length - 1;
          if (slot.kind === 'ellipsis') {
            return (
              <li key="ellipsis" className="ds-breadcrumb__item">
                <button
                  type="button"
                  className="ds-breadcrumb__ellipsis"
                  aria-label={`Show ${slot.hidden} more ${slot.hidden === 1 ? 'item' : 'items'}`}
                  aria-expanded={false}
                  onClick={() => {
                    focusIndexRef.current = 1;
                    setExpanded(true);
                  }}
                >
                  <Icon name="menu-dots" />
                </button>
                {sep}
              </li>
            );
          }
          const { item, index } = slot;
          const current = item.current ?? (!hasExplicitCurrent && index === lastIndex);
          const content = (
            <>
              {item.icon && <span className="ds-breadcrumb__icon" aria-hidden="true">{item.icon}</span>}
              <span className="ds-breadcrumb__label">{item.label}</span>
            </>
          );
          return (
            <li key={index} className="ds-breadcrumb__item" data-index={index}>
              {item.href && !current ? (
                <a href={safeHref(item.href)} className="ds-breadcrumb__link" onClick={item.onClick}>
                  {content}
                </a>
              ) : (
                <span
                  className={cx('ds-breadcrumb__link', current && 'ds-breadcrumb__link--current')}
                  aria-current={current ? 'page' : undefined}
                  onClick={item.onClick}
                >
                  {content}
                </span>
              )}
              {!isLast && sep}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
