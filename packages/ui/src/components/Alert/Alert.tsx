import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './Alert.css';

export type AlertVariant = 'info' | 'success' | 'warn' | 'danger' | 'neutral';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Intent. `info` uses the accent tint; `warn` and `danger` announce assertively (role="alert"). */
  variant?: AlertVariant;
  /** Optional bold heading above the message. */
  title?: ReactNode;
  /** Leading icon. Each variant has a default; pass `null` to hide it. */
  icon?: ReactNode;
  /** Shows a × button that calls `onDismiss`. The parent owns visibility. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Trailing slot, e.g. a ghost or secondary Button. */
  action?: ReactNode;
}

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Icon name="info-circle" />,
  success: <Icon name="check-circle" />,
  warn: <Icon name="danger-triangle" />,
  danger: <Icon name="danger-circle" />,
  neutral: <Icon name="info-circle" />,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, icon, dismissible = false, onDismiss, action, role, className, children, ...rest },
  ref,
) {
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon;
  const resolvedRole = role ?? (variant === 'danger' || variant === 'warn' ? 'alert' : 'status');

  return (
    <div
      ref={ref}
      role={resolvedRole}
      className={cx('ds-alert', `ds-alert--${variant}`, title && 'ds-alert--titled', className)}
      {...rest}
    >
      {resolvedIcon && (
        <span className="ds-alert__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
      <div className="ds-alert__body">
        {title && <div className="ds-alert__title">{title}</div>}
        {children && <div className="ds-alert__message">{children}</div>}
      </div>
      {action && <div className="ds-alert__action">{action}</div>}
      {dismissible && (
        <button type="button" className="ds-alert__dismiss" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="close" />
        </button>
      )}
    </div>
  );
});
