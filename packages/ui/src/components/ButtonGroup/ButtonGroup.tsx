import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Menu, type MenuItem } from '../Menu';
import './ButtonGroup.css';

export type ButtonGroupSize = 'sm' | 'md' | 'lg';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Passed to every child Button / ButtonIcon that doesn't set its own `size`. */
  size?: ButtonGroupSize;
  /** Accessible name for the group (`aria-label`). */
  label?: string;
  /** Items for a trailing split / overflow menu. When set, a menu button is added at the end of the group. */
  menuItems?: MenuItem[];
  /** Accessible name of the menu button. */
  menuLabel?: string;
  /** Icon of the menu button: `alt-arrow-down` for a split button, `menu-dots` for an overflow menu. */
  menuIcon?: IconName;
  /** Fires with the selected menu item's id. */
  onMenuSelect?: (id: string) => void;
  /** Disables the menu button. */
  menuDisabled?: boolean;
  children?: ReactNode;
}

type Sizable = { size?: ButtonGroupSize };

/**
 * A segmented row of related secondary buttons (role="group"), optionally ending in a split/overflow menu.
 * Each child keeps its own Tab stop; rest props, `className` and the ref go to the group element.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  {
    size,
    label,
    menuItems,
    menuLabel = 'More actions',
    menuIcon = 'alt-arrow-down',
    onMenuSelect,
    menuDisabled = false,
    className,
    children,
    ...rest
  },
  ref,
) {
  const items = size
    ? Children.map(children, (child) => {
        if (!isValidElement<Sizable>(child) || child.props.size !== undefined) return child;
        return cloneElement(child as ReactElement<Sizable>, { size });
      })
    : children;

  const groupSize = size ?? 'md';

  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cx('ds-button-group', `ds-button-group--${groupSize}`, className)}
      {...rest}
    >
      {items}
      {menuItems && menuItems.length > 0 && (
        <Menu
          placement="bottom-end"
          items={menuItems}
          onSelect={onMenuSelect}
          trigger={
            <Button
              variant="secondary"
              size={groupSize}
              aria-label={menuLabel}
              title={menuLabel}
              disabled={menuDisabled}
              className="ds-button-group__menu-trigger"
            >
              <Icon name={menuIcon} className="ds-button-group__menu-icon" />
            </Button>
          }
        />
      )}
    </div>
  );
});
