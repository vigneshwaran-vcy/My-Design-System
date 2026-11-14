import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import './ButtonIcon.css';

export type ButtonIconVariant = 'bare' | 'container' | 'border' | 'brand';
export type ButtonIconSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** A Solar icon name, or any icon node (it is hidden from assistive tech). */
  icon: IconName | ReactNode;
  /** Accessible name (required: the button has no visible text). Also used as the native tooltip unless `title` is set. */
  label: string;
  /** bare: no fill · container: tinted fill · border: surface + ring edge · brand: solid accent. */
  variant?: ButtonIconVariant;
  /** Square, matching Button heights: xs 22 · sm 26 · md 32 · lg 40. */
  size?: ButtonIconSize;
  /**
   * Makes this a toggle button: `true`/`false` set `aria-pressed` and the selected look.
   * Leave undefined for a plain action button.
   */
  selected?: boolean;
  /** Use the label as the native `title` tooltip. Turn off when wrapping in a Tooltip. */
  showTitle?: boolean;
}

/** Icon-only button. Always has an accessible name; optional toggle state via `selected` (aria-pressed). */
export const ButtonIcon = forwardRef<HTMLButtonElement, ButtonIconProps>(function ButtonIcon(
  {
    icon,
    label,
    variant = 'border',
    size = 'md',
    selected,
    showTitle = true,
    type = 'button',
    title,
    className,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={selected}
      title={title ?? (showTitle ? label : undefined)}
      className={cx('ds-button-icon', `ds-button-icon--${variant}`, `ds-button-icon--${size}`, className)}
      {...rest}
    >
      <span className="ds-button-icon__icon" aria-hidden="true">
        {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}
      </span>
    </button>
  );
});
