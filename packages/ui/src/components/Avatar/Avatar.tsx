import { Children, forwardRef, isValidElement, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Avatar.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';
export type AvatarTint = 'accent' | 'success' | 'warn' | 'danger';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Image source. Falls back to initials when missing or when the image fails to load. */
  src?: string;
  /** Alternative text for the image. Defaults to `name`. */
  alt?: string;
  /** Person's name; drives the initials fallback, its tint and the accessible name. */
  name?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  /** Presence indicator shown bottom-right. */
  status?: AvatarStatus;
}

/** First letters of the first two words of a name, upper-cased. */
export function getInitials(name = ''): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

const TINTS: AvatarTint[] = ['accent', 'success', 'warn', 'danger'];

/** Deterministic tint for an initials fallback, so the same name always gets the same colour. */
export function getAvatarTint(name = ''): AvatarTint {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TINTS[hash % TINTS.length];
}

const STATUS_LABEL: Record<AvatarStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  busy: 'Busy',
  away: 'Away',
};

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, size = 'md', shape = 'circle', status, className, ...rest },
  ref,
) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  const showImage = Boolean(src) && !failed;
  const initials = getInitials(name);
  const label = alt ?? name;

  return (
    <span
      ref={ref}
      className={cx(
        'ds-avatar',
        `ds-avatar--${size}`,
        `ds-avatar--${shape}`,
        !showImage && `ds-avatar--tint-${getAvatarTint(name)}`,
        className,
      )}
      role="img"
      aria-label={label ? (status ? `${label}, ${STATUS_LABEL[status].toLowerCase()}` : label) : undefined}
      aria-hidden={label ? undefined : true}
      {...rest}
    >
      {showImage ? (
        <img className="ds-avatar__image" src={src} alt="" onError={() => setFailed(true)} />
      ) : initials ? (
        <span className="ds-avatar__initials" aria-hidden="true">
          {initials}
        </span>
      ) : (
        <svg className="ds-avatar__placeholder" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.4-8 5.5V21h16v-1.5c0-3.1-3.6-5.5-8-5.5Z"
            fill="currentColor"
          />
        </svg>
      )}
      {status && <span className={cx('ds-avatar__status', `ds-avatar__status--${status}`)} aria-hidden="true" />}
    </span>
  );
});

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum avatars shown before collapsing the rest into a "+N" bubble. */
  max?: number;
  size?: AvatarSize;
  shape?: AvatarShape;
  children: ReactNode;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { max, size = 'md', shape = 'circle', className, children, ...rest },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement);
  const limit = max !== undefined && max >= 0 ? max : items.length;
  const visible = items.slice(0, limit);
  const overflow = items.length - visible.length;

  return (
    <div ref={ref} role="group" className={cx('ds-avatar-group', `ds-avatar-group--${size}`, className)} {...rest}>
      {visible.map((child, index) => (
        <span key={child.key ?? index} className="ds-avatar-group__item">
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span className="ds-avatar-group__item">
          <span
            className={cx('ds-avatar', `ds-avatar--${size}`, `ds-avatar--${shape}`, 'ds-avatar--overflow')}
            role="img"
            aria-label={`${overflow} more`}
          >
            <span className="ds-avatar__initials" aria-hidden="true">
              +{overflow}
            </span>
          </span>
        </span>
      )}
    </div>
  );
});
