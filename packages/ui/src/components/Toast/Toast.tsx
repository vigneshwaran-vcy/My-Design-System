import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import './Toast.css';

export type ToastVariant = 'neutral' | 'success' | 'warn' | 'danger' | 'info';
export type ToastPosition = 'bottom-right' | 'top-right' | 'bottom-center';

export interface ToastAction {
  label: ReactNode;
  onClick: () => void;
}

export interface ToastOptions {
  /** Stable id to update an existing toast in place; generated when omitted. */
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss after this many milliseconds. `0` keeps the toast until dismissed. */
  duration?: number;
  action?: ToastAction;
}

export interface ToastData extends ToastOptions {
  id: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  toasts: ToastData[];
}

export interface ToastProviderProps {
  children?: ReactNode;
  position?: ToastPosition;
  /** Default auto-dismiss duration in milliseconds for toasts that do not set their own. */
  duration?: number;
  /** Maximum toasts shown at once; the oldest are dropped first. */
  limit?: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let counter = 0;

/** Renders `children` plus a fixed notification viewport, and provides `useToast()`. */
export function ToastProvider({ children, position = 'bottom-right', duration = 5000, limit = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const dismissAll = useCallback(() => setToasts([]), []);
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `ds-toast-${++counter}`;
      const next: ToastData = { variant: 'neutral', duration, ...options, id };
      setToasts((list) => {
        const without = list.filter((t) => t.id !== id);
        return [...without, next].slice(-limit);
      });
      return id;
    },
    [duration, limit],
  );

  const value = useMemo<ToastContextValue>(() => ({ toast, dismiss, dismissAll, toasts }), [toast, dismiss, dismissAll, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div role="region" aria-label="Notifications" className={cx('ds-toast-viewport', `ds-toast-viewport--${position}`)}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Access `toast()` / `dismiss()`. Must be used inside a `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>.');
  return ctx;
}

const icons: Record<ToastVariant, ReactNode> = {
  neutral: null,
  info: <path d="M10 9v5M10 6.5v.01" />,
  success: <path d="M6 10.5l2.5 2.5L14 7.5" />,
  warn: <path d="M10 6.5v4.5M10 14v.01" />,
  danger: <path d="M7 7l6 6M13 7l-6 6" />,
};

function ToastItem({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const { id, title, description, variant, duration, action } = toast;
  const timer = useRef<number>();
  const startedAt = useRef(0);
  const remaining = useRef(duration);
  const dismiss = useCallback(() => onDismiss(id), [onDismiss, id]);

  const pause = useCallback(() => {
    if (timer.current === undefined) return;
    window.clearTimeout(timer.current);
    timer.current = undefined;
    remaining.current -= Date.now() - startedAt.current;
  }, []);
  const resume = useCallback(() => {
    if (duration === 0 || timer.current !== undefined) return;
    startedAt.current = Date.now();
    timer.current = window.setTimeout(dismiss, Math.max(remaining.current, 0));
  }, [duration, dismiss]);

  useEffect(() => {
    remaining.current = duration;
    resume();
    return () => {
      window.clearTimeout(timer.current);
      timer.current = undefined;
    };
  }, [duration, resume]);

  const icon = icons[variant];

  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={cx('ds-toast', `ds-toast--${variant}`)}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) resume();
      }}
    >
      {icon && (
        <span className="ds-toast__icon" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </span>
      )}
      <div className="ds-toast__content">
        <div className="ds-toast__title">{title}</div>
        {description && <div className="ds-toast__description">{description}</div>}
        {action && (
          <div className="ds-toast__actions">
            <Button
              size="xs"
              variant="soft"
              onClick={() => {
                action.onClick();
                dismiss();
              }}
            >
              {action.label}
            </Button>
          </div>
        )}
      </div>
      <Button variant="ghost" size="xs" aria-label="Dismiss" className="ds-toast__close" onClick={dismiss}>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="ds-toast__close-icon">
          <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </Button>
    </div>
  );
}
