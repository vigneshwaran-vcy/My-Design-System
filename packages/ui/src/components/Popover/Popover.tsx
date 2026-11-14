import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { getFocusable } from '../../utils/focus';
import { useControllableState } from '../../utils/useControllableState';
import './Popover.css';

export type PopoverPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

type TriggerProps = {
  id?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The element that opens the popover. Cloned to receive `aria-haspopup`, `aria-expanded`, `aria-controls` and a click handler. */
  trigger: ReactElement<TriggerProps>;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Corner of the trigger the panel grows from. */
  placement?: PopoverPlacement;
  /** Optional heading; it also labels the dialog. Without it, pass `aria-label`. */
  title?: ReactNode;
  children: ReactNode;
}

/**
 * Non-modal dialog anchored to its trigger. Rest props, `className` and the ref go to the panel (`role="dialog"`).
 * Focus moves into the panel on open and returns to the trigger on close (Escape, selecting, or a programmatic close).
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    trigger,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom-start',
    title,
    children,
    id,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const panelId = id ?? `ds-popover-${autoId}`;
  const titleId = title ? `${panelId}-title` : undefined;
  const triggerId = trigger.props.id ?? `${panelId}-trigger`;

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);
  const restoreFocus = useRef(true);

  const close = (reason: 'escape' | 'outside' | 'toggle') => {
    restoreFocus.current = reason !== 'outside';
    setOpen(false);
  };

  // Close on pointer down anywhere outside the trigger + panel.
  useEffect(() => {
    if (!open) return;
    const handle = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close('outside');
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  // Focus management: into the panel on open, back to the trigger on close.
  useEffect(() => {
    const panel = panelRef.current;
    if (open) {
      restoreFocus.current = true;
      const [first] = getFocusable(panel);
      (first ?? panel)?.focus();
    } else if (wasOpen.current && restoreFocus.current) {
      document.getElementById(triggerId)?.focus();
    }
    wasOpen.current = open;
  }, [open, triggerId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      close('escape');
    }
  };

  const triggerEl = cloneElement(trigger, {
    id: triggerId,
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': panelId,
    onClick: (event: MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event);
      if (event.defaultPrevented) return;
      if (open) close('toggle');
      else setOpen(true);
    },
  } as Partial<TriggerProps> & Record<string, unknown>);

  return (
    <div ref={rootRef} className={cx('ds-popover', `ds-popover--${placement}`)} onKeyDown={handleKeyDown}>
      {triggerEl}
      <div
        ref={(node) => {
          panelRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={panelId}
        role="dialog"
        aria-labelledby={rest['aria-label'] ? undefined : titleId}
        tabIndex={-1}
        hidden={!open}
        className={cx('ds-popover__panel', className)}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {title && (
          <div id={titleId} className="ds-popover__title">
            {title}
          </div>
        )}
        <div className="ds-popover__body">{children}</div>
      </div>
    </div>
  );
});
