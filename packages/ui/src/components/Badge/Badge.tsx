import { forwardRef, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './Badge.css';

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warn' | 'danger' | 'outline';
export type BadgeAppearance = 'subtle' | 'solid';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour intent. `outline` is a neutral ring with no fill. */
  variant?: BadgeVariant;
  /** `subtle` = tinted fill with coloured text; `solid` = full colour fill with on-colour text. */
  appearance?: BadgeAppearance;
  size?: BadgeSize;
  /** Leading status dot in the variant colour. */
  dot?: boolean;
  /** Decorative leading icon (hidden from assistive tech). */
  icon?: ReactNode;
  /** Adds a remove ("×") button labelled `Remove <label>`. */
  removable?: boolean;
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /**
   * Plain-text label used for the remove button's aria-label when `children` is not a string.
   */
  removeLabel?: string;
}

const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  return '';
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = 'neutral',
    appearance = 'subtle',
    size = 'md',
    dot = false,
    icon,
    removable = false,
    onRemove,
    removeLabel,
    className,
    children,
    ...rest
  },
  ref,
) {
  const label = removeLabel ?? textOf(children);
  return (
    <span
      ref={ref}
      className={cx(
        'ds-badge',
        `ds-badge--${variant}`,
        `ds-badge--${appearance}`,
        `ds-badge--${size}`,
        removable && 'ds-badge--removable',
        className,
      )}
      {...rest}
    >
      {dot && <span className="ds-badge__dot" aria-hidden="true" />}
      {icon && (
        <span className="ds-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="ds-badge__label">{children}</span>
      {removable && (
        <button
          type="button"
          className="ds-badge__remove"
          aria-label={label ? `Remove ${label}` : 'Remove'}
          onClick={onRemove}
        >
          <Icon name="close" />
        </button>
      )}
    </span>
  );
});
