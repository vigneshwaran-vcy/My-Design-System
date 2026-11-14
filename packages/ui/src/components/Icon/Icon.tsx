import { forwardRef, type SVGAttributes } from 'react';
import { cx } from '../../utils/cx';
import { icons, type IconName } from './icons.generated';
import './Icon.css';

export type { IconName };
export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'dangerouslySetInnerHTML'> {
  /** A Solar Linear icon (see `icons.generated.ts`; add more in `scripts/build-icons.mjs`). */
  name: IconName;
  /** 12 / 16 / 20 / 24. Leave unset to let the parent component's CSS size it. */
  size?: IconSize;
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  label?: string;
}

/** Solar Linear icon. Inherits `currentColor`, so set the colour on the parent. */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon({ name, size, label, className, ...rest }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      className={cx('ds-icon', size && `ds-icon--${size}`, className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-icon={name}
      {...rest}
      // Bodies come from the generated Solar map, never from user input.
      dangerouslySetInnerHTML={{ __html: icons[name] }}
    />
  );
});

export const iconNames = Object.keys(icons) as IconName[];
