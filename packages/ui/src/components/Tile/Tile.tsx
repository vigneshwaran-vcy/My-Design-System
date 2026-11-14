import { forwardRef, useId, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Tile.css';

export type TileVariant = 'plain' | 'card';
export type TileSize = 'sm' | 'md';

export interface TileDetail {
  label: ReactNode;
  value: ReactNode;
}

export interface TileProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Heading; also the tile's accessible name. Rendered as a link when `href` is set. */
  title: ReactNode;
  /** Makes the title a link to the record. */
  href?: string;
  /** Extra props for the title link (target, rel, onClick…). */
  linkProps?: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;
  /** Leading media: an Avatar, an Icon in a tinted square, or an image. */
  media?: ReactNode;
  /** Trailing actions, e.g. a `<ButtonIcon variant="bare" … />` or a Menu. */
  actions?: ReactNode;
  /** Key/value lines rendered as a description list under the title. */
  details?: TileDetail[];
  /** plain: no surface, for lists · card: surface with a ring-edge shadow. */
  variant?: TileVariant;
  /** sm: compact text and gaps · md: default. */
  size?: TileSize;
  /** Heading level of the title. */
  titleAs?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Body content below the details. */
  children?: ReactNode;
}

/**
 * Media + title + body + actions layout for list content (SLDS tile). Renders an `<article>` named by its title.
 * Rest props, `className` and the ref go to the article.
 */
export const Tile = forwardRef<HTMLElement, TileProps>(function Tile(
  {
    title,
    href,
    linkProps,
    media,
    actions,
    details,
    variant = 'plain',
    size = 'md',
    titleAs: Title = 'h3',
    className,
    children,
    ...rest
  },
  ref,
) {
  const titleId = `${useId()}-title`;
  return (
    <article
      ref={ref}
      aria-labelledby={titleId}
      className={cx('ds-tile', `ds-tile--${variant}`, `ds-tile--${size}`, className)}
      {...rest}
    >
      {media && <div className="ds-tile__media">{media}</div>}
      <div className="ds-tile__content">
        <div className="ds-tile__header">
          <Title id={titleId} className="ds-tile__title">
            {href ? (
              <a {...linkProps} href={href} className={cx('ds-tile__link', linkProps?.className)}>
                {title}
              </a>
            ) : (
              title
            )}
          </Title>
          {actions && <div className="ds-tile__actions">{actions}</div>}
        </div>
        {details && details.length > 0 && (
          <dl className="ds-tile__details">
            {details.map((detail, index) => (
              <div key={index} className="ds-tile__detail">
                <dt className="ds-tile__detail-label">{detail.label}</dt>
                <dd className="ds-tile__detail-value">{detail.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {children !== undefined && children !== null && <div className="ds-tile__body">{children}</div>}
      </div>
    </article>
  );
});
