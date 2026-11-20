import { forwardRef, useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Modal, type ModalProps } from '../Modal';
import './Prompt.css';

export type PromptVariant = 'info' | 'warn' | 'danger' | 'success';
export type PromptSize = 'sm' | 'md';

export interface PromptProps extends Omit<ModalProps, 'size' | 'title' | 'onClose' | 'dismissible'> {
  open: boolean;
  /** Heading; also the alert dialog's accessible name. */
  title: ReactNode;
  /** Short message under the title; also the accessible description. */
  description?: ReactNode;
  /** Colour of the header band and status icon. */
  variant?: PromptVariant;
  /** sm 384 · md 512. */
  size?: PromptSize;
  /** Label of the built-in confirm button. Ignored when `footer` is set. */
  confirmLabel?: string;
  onConfirm?: () => void;
  /** Label of the built-in cancel button (shown when `onCancel` is set). Ignored when `footer` is set. */
  cancelLabel?: string;
  /** Cancel action. Escape also calls it. */
  onCancel?: () => void;
  /** Called when the user dismisses the prompt (Escape, or the close button when `dismissible`). Defaults to `onCancel`. */
  onClose?: () => void;
  /** Adds a close button and lets the scrim close the prompt. Off by default: a prompt asks for an explicit answer. */
  dismissible?: boolean;
  /** Replaces the built-in buttons. */
  footer?: ReactNode;
  children?: ReactNode;
}

const ICONS: Record<PromptVariant, IconName> = {
  info: 'info-circle',
  warn: 'danger-triangle',
  danger: 'danger-circle',
  success: 'check-circle',
};

/**
 * A system message that interrupts the user and needs a response (SLDS prompt). Built on Modal with
 * `role="alertdialog"`, a coloured header band and a status icon. Focus starts on the first footer button
 * (Cancel when present, so a destructive confirm is never the default), Tab is trapped, focus is restored on close.
 */
export const Prompt = forwardRef<HTMLDivElement, PromptProps>(function Prompt(
  {
    open,
    title,
    description,
    variant = 'warn',
    size = 'sm',
    confirmLabel = 'OK',
    onConfirm,
    cancelLabel = 'Cancel',
    onCancel,
    onClose,
    dismissible = false,
    footer,
    className,
    children,
    ...rest
  },
  ref,
) {
  const close = onClose ?? onCancel;
  const latest = useRef(close);
  latest.current = close;

  // Escape answers the prompt with its cancel/close action even when it is not dismissible.
  useEffect(() => {
    if (!open || dismissible) return;
    const handle = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !latest.current) return;
      event.preventDefault();
      latest.current();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open, dismissible]);

  const actions =
    footer ??
    (
      <>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm ?? close}>
          {confirmLabel}
        </Button>
      </>
    );

  return (
    <Modal
      ref={ref}
      role="alertdialog"
      open={open}
      onClose={close ?? (() => {})}
      dismissible={dismissible}
      // A dismissible prompt asks for the ×, unless it already has a Cancel button.
      showClose={dismissible && !onCancel}
      size={size}
      title={
        <span className="ds-prompt__heading">
          <span className="ds-prompt__icon" aria-hidden="true">
            <Icon name={ICONS[variant]} />
          </span>
          <span className="ds-prompt__title">{title}</span>
        </span>
      }
      description={description}
      footer={actions}
      className={cx('ds-prompt', `ds-prompt--${variant}`, `ds-prompt--${size}`, className)}
      {...rest}
    >
      {children}
    </Modal>
  );
});
