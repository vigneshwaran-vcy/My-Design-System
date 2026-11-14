import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import './Pill.css';

export type PillVariant = 'neutral' | 'accent' | 'danger';
export type PillSize = 'sm' | 'md';

interface PillItemContextValue {
  index: number;
  active: boolean;
  hintId: string;
  size?: PillSize;
  onFocusItem: (index: number) => void;
  onRemoveItem: (index: number) => void;
}

const PillItemContext = createContext<PillItemContextValue | null>(null);

export interface PillProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Visible text; also the accessible name. */
  label: ReactNode;
  /** Leading Solar icon name or icon node (decorative). */
  icon?: IconName | ReactNode;
  /** Leading avatar, e.g. `<Avatar size="xs" name="…" />`. Takes the place of `icon`. */
  avatar?: ReactNode;
  /** neutral: surface + ring edge · accent: blue tint · danger: an invalid/error value. */
  variant?: PillVariant;
  /** sm 22 · md 26 (Button xs / sm heights). Inside a PillContainer, defaults to the container's size. */
  size?: PillSize;
  /** Makes the pill removable: shows a remove button and Backspace/Delete remove it. */
  onRemove?: () => void;
  /** Accessible name of the remove button. Defaults to "Remove <label>" for string labels. */
  removeLabel?: string;
  disabled?: boolean;
}

/**
 * A compact value token (a selected record, filter or recipient), optionally removable.
 * Standalone it is a plain element whose remove button takes focus; inside a PillContainer it becomes
 * a `role="option"` with a roving tab stop. Rest props, `className` and the ref go to the root.
 */
export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
  {
    label,
    icon,
    avatar,
    variant = 'neutral',
    size: sizeProp,
    onRemove,
    removeLabel,
    disabled = false,
    className,
    onKeyDown,
    onFocus,
    ...rest
  },
  ref,
) {
  const item = useContext(PillItemContext);
  const labelId = useId();
  const size = sizeProp ?? item?.size ?? 'md';
  const removable = Boolean(onRemove) && !disabled;
  const removeName = removeLabel ?? (typeof label === 'string' ? `Remove ${label}` : 'Remove');

  const remove = () => {
    if (!removable) return;
    if (item) item.onRemoveItem(item.index);
    onRemove?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if ((event.key === 'Backspace' || event.key === 'Delete') && removable) {
      event.preventDefault();
      remove();
    }
  };

  const handleFocus = (event: FocusEvent<HTMLSpanElement>) => {
    onFocus?.(event);
    if (item && event.target === event.currentTarget) item.onFocusItem(item.index);
  };

  const media = avatar ? (
    <span className="ds-pill__avatar" aria-hidden="true">
      {avatar}
    </span>
  ) : icon ? (
    <span className="ds-pill__icon" aria-hidden="true">
      {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}
    </span>
  ) : null;

  return (
    <span
      ref={ref}
      className={cx(
        'ds-pill',
        `ds-pill--${variant}`,
        `ds-pill--${size}`,
        removable && 'ds-pill--removable',
        disabled && 'ds-pill--disabled',
        className,
      )}
      role={item ? 'option' : undefined}
      aria-selected={item ? true : undefined}
      aria-labelledby={item ? labelId : undefined}
      aria-describedby={item && removable ? item.hintId : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={item ? (item.active ? 0 : -1) : undefined}
      data-pill-index={item?.index}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...rest}
    >
      {media}
      <span id={labelId} className="ds-pill__label">
        {label}
      </span>
      {removable && (
        <button
          type="button"
          className="ds-pill__remove"
          aria-label={removeName}
          title={removeName}
          // Inside a container the option itself is the tab stop; Backspace/Delete remove it.
          tabIndex={item ? -1 : undefined}
          onClick={(event) => {
            event.stopPropagation();
            remove();
          }}
        >
          <Icon name="close" />
        </button>
      )}
    </span>
  );
});

export interface PillContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Accessible name of the group, e.g. "Selected recipients". */
  label: string;
  /** Default size for the pills inside. */
  size?: PillSize;
  /** bare: pills only · framed: pills on a tinted frame, like a multi-select's selection area. */
  variant?: 'bare' | 'framed';
  /** Read out with every removable pill. */
  removeHint?: string;
  children?: ReactNode;
}

/**
 * A horizontal listbox of Pills with a single Tab stop: Left/Right (and Up/Down) move between pills,
 * Home/End jump to the ends, Backspace/Delete remove the focused pill and focus moves to its neighbour.
 */
export const PillContainer = forwardRef<HTMLDivElement, PillContainerProps>(function PillContainer(
  {
    label,
    size,
    variant = 'bare',
    removeHint = 'Press Delete or Backspace to remove.',
    className,
    children,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const hintId = `${useId()}-hint`;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pills = Children.toArray(children).filter(isValidElement);
  const count = pills.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const pendingFocus = useRef<{ index: number; count: number } | null>(null);
  const active = Math.min(activeIndex, Math.max(count - 1, 0));

  const focusAt = (index: number) => {
    rootRef.current?.querySelector<HTMLElement>(`[data-pill-index="${index}"]`)?.focus();
  };

  // After a pill is removed, keep focus in the group: the next pill, else the previous one, else the group.
  useEffect(() => {
    const pending = pendingFocus.current;
    if (!pending) return;
    pendingFocus.current = null;
    if (count >= pending.count) return;
    if (count === 0) {
      rootRef.current?.focus();
      return;
    }
    const next = Math.min(pending.index, count - 1);
    setActiveIndex(next);
    focusAt(next);
  });

  const move = (index: number) => {
    if (count === 0) return;
    const next = (index + count) % count;
    setActiveIndex(next);
    focusAt(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        move(active + (rtl ? -1 : 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        move(active + (rtl ? 1 : -1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        move(active + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(active - 1);
        break;
      case 'Home':
        event.preventDefault();
        move(0);
        break;
      case 'End':
        event.preventDefault();
        move(count - 1);
        break;
      default:
    }
  };

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      role="listbox"
      aria-label={label}
      aria-orientation="horizontal"
      tabIndex={count === 0 ? -1 : undefined}
      className={cx('ds-pill-container', `ds-pill-container--${variant}`, className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {pills.map((pill, index) => (
        <PillItemContext.Provider
          key={pill.key ?? index}
          value={{
            index,
            active: index === active,
            hintId,
            size,
            onFocusItem: setActiveIndex,
            onRemoveItem: (i) => {
              pendingFocus.current = { index: i, count };
              setActiveIndex(i);
            },
          }}
        >
          {pill}
        </PillItemContext.Provider>
      ))}
      <span id={hintId} hidden>
        {removeHint}
      </span>
    </div>
  );
});
