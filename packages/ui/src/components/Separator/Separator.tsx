import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Separator.css';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorSpacing = 'none' | 'sm' | 'md' | 'lg';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation;
  /**
   * Purely visual (default): rendered with role="none". Set to false when the rule separates
   * meaningful groups and should be exposed as a separator.
   */
  decorative?: boolean;
  /** Short muted text centred in the line (horizontal only). */
  label?: ReactNode;
  /** Outer margin along the cross axis: 0 / space-2 / space-4 / space-6. */
  spacing?: SeparatorSpacing;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = true, label, spacing = 'none', className, ...rest },
  ref,
) {
  const hasLabel = label !== undefined && label !== null && label !== '' && orientation === 'horizontal';
  // role="separator" exposes no child text, so a string label becomes the accessible name.
  const ariaLabel = !decorative && typeof label === 'string' ? label : undefined;

  return (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      aria-label={ariaLabel}
      className={cx(
        'ds-separator',
        `ds-separator--${orientation}`,
        `ds-separator--spacing-${spacing}`,
        hasLabel && 'ds-separator--labeled',
        className,
      )}
      {...rest}
    >
      {hasLabel && <span className="ds-separator__label">{label}</span>}
    </div>
  );
});
