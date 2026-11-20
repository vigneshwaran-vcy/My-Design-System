import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';
import { getFocusable } from '../../utils/focus';
import { ButtonIcon } from '../ButtonIcon';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean;
  /** Called when the user asks to close: Escape, the scrim, or the close button. */
  onClose: () => void;
  /** Heading; also the dialog's accessible name. */
  title: ReactNode;
  /** Supporting copy under the title; also the dialog's accessible description. */
  description?: ReactNode;
  /** Max width: sm 384 · md 512 · lg 768 (multiples of space-16). */
  size?: ModalSize;
  /** Actions, right-aligned at the bottom of the panel. */
  footer?: ReactNode;
  /** When false, Escape and the scrim do nothing and the close button is hidden; closing must come from `footer`. */
  dismissible?: boolean;
  /**
   * Show the × button in the header. Defaults to true only when there is no `footer`: a footer normally has
   * its own Cancel, so a second way out is noise. Escape and the scrim still close a dismissible modal.
   */
  showClose?: boolean;
  children?: ReactNode;
}

/**
 * Modal dialog rendered in a portal on `document.body`. Traps Tab inside, focuses the first control on open,
 * restores focus on close and locks body scroll while open. Rest props, `className` and the ref go to the panel.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { open, onClose, title, description, size = 'md', footer, dismissible = true, showClose, children, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const panelId = id ?? `ds-modal-${autoId}`;
  const titleId = `${panelId}-title`;
  const descriptionId = description ? `${panelId}-description` : undefined;

  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrimPress = useRef(false);
  const latest = useRef({ onClose, dismissible });
  latest.current = { onClose, dismissible };

  // Focus: first control on open (not the close button when there is a better one), restore on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const candidates = getFocusable(panel).filter((el) => el !== closeRef.current);
    (candidates[0] ?? closeRef.current ?? panel)?.focus();
    return () => {
      if (previous && previous.isConnected) previous.focus();
    };
  }, [open]);

  // Body scroll lock.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  // Escape closes (unless something inside already handled it); Tab cycles within the panel.
  useEffect(() => {
    if (!open) return;
    const handle = (event: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (event.key === 'Escape') {
        if (event.defaultPrevented || !latest.current.dismissible) return;
        event.preventDefault();
        latest.current.onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = getFocusable(panel);
      const active = document.activeElement as HTMLElement | null;
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = active ? panel.contains(active) : false;
      if (!inside) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  // Only a press that starts *and* ends on the scrim closes, so drag-selecting text out of the panel does not.
  const onScrimPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    scrimPress.current = event.target === event.currentTarget;
  };
  const onScrimClick = (event: MouseEvent<HTMLDivElement>) => {
    const onScrim = scrimPress.current && event.target === event.currentTarget;
    scrimPress.current = false;
    if (onScrim && dismissible) onClose();
  };

  return createPortal(
    <>
      <div className="ds-modal__scrim" aria-hidden="true" />
      <div
        className={cx('ds-modal', `ds-modal--${size}`)}
        onPointerDown={onScrimPointerDown}
        onClick={onScrimClick}
      >
        <div
          ref={(node) => {
            panelRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className={cx('ds-modal__panel', className)}
          {...rest}
        >
          <div className="ds-modal__header">
            <div className="ds-modal__heading">
              <h2 id={titleId} className="ds-modal__title">
                {title}
              </h2>
              {description && (
                <p id={descriptionId} className="ds-modal__description">
                  {description}
                </p>
              )}
            </div>
            {dismissible && (showClose ?? !footer) && (
              <ButtonIcon
                ref={closeRef}
                icon="close"
                label="Close"
                variant="container"
                size="sm"
                className="ds-modal__close"
                onClick={onClose}
              />
            )}
          </div>
          {children !== undefined && children !== null && <div className="ds-modal__body">{children}</div>}
          {footer && <div className="ds-modal__footer">{footer}</div>}
        </div>
      </div>
    </>,
    document.body,
  );
});
