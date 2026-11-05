import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './EmptyState.css';

export type EmptyStateSize = 'sm' | 'md';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Decorative icon, shown inside a dashed-ring tile unless `tile` is false. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary call to action, e.g. a primary Button. */
  action?: ReactNode;
  /** Low-emphasis alternative, e.g. a ghost Button or a link. */
  secondaryAction?: ReactNode;
  size?: EmptyStateSize;
  /** Wraps the icon in a subtle tile with a dashed ring. */
  tile?: boolean;
  /** Heading level for the title — match the page outline. */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p';
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { icon, title, description, action, secondaryAction, size = 'md', tile = true, titleAs: Title = 'h3', className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ds-empty-state', `ds-empty-state--${size}`, className)} {...rest}>
      {icon && (
        <span className={cx('ds-empty-state__icon', tile && 'ds-empty-state__icon--tile')} aria-hidden="true">
          {icon}
        </span>
      )}
      <Title className="ds-empty-state__title">{title}</Title>
      {description && <p className="ds-empty-state__description">{description}</p>}
      {(action || secondaryAction) && (
        <div className="ds-empty-state__actions">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
});
