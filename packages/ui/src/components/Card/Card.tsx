import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Card.css';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Semantic element. Use `section`/`article` with `aria-labelledby` when the card is a landmark. */
  as?: 'div' | 'section' | 'article' | 'form';
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { variant = 'elevated', padding = 'md', as: Element = 'div', className, ...rest },
  ref,
) {
  return (
    <Element
      // Union of intrinsic element refs; all are HTMLElement.
      ref={ref as never}
      className={cx('ds-card', `ds-card--${variant}`, `ds-card--padding-${padding}`, className)}
      {...rest}
    />
  );
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Trailing slot, e.g. a ghost Button. */
  action?: ReactNode;
  titleAs?: 'h2' | 'h3' | 'h4';
  titleId?: string;
}

export function CardHeader({ title, description, action, titleAs: Title = 'h3', titleId, className, ...rest }: CardHeaderProps) {
  return (
    <div className={cx('ds-card__header', className)} {...rest}>
      <div className="ds-card__heading">
        <Title id={titleId} className="ds-card__title">
          {title}
        </Title>
        {description && <p className="ds-card__description">{description}</p>}
      </div>
      {action && <div className="ds-card__action">{action}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ds-card__body', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ds-card__footer', className)} {...rest} />;
}
