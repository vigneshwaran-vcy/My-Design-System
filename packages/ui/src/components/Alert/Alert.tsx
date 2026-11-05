import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
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

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

const InfoIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
const SuccessIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);
const WarnIcon = () => (
  <svg {...svgProps}>
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);
const DangerIcon = () => (
  <svg {...svgProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
    <path d="m9 9 6 6" />
  </svg>
);
const CloseIcon = () => (
  <svg {...svgProps}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warn: <WarnIcon />,
  danger: <DangerIcon />,
  neutral: <InfoIcon />,
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
          <CloseIcon />
        </button>
      )}
    </div>
  );
});
