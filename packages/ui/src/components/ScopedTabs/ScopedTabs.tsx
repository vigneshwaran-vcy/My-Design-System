import { forwardRef } from 'react';
import { cx } from '../../utils/cx';
import { Tabs, type TabsProps } from '../Tabs';
import '../Tabs/Tabs.css';
import './ScopedTabs.css';

export type ScopedTabsSize = 'sm' | 'md';
/** `framed` = tabs and panel in a tinted frame; `plain` = no frame, the panel surface stands alone. */
export type ScopedTabsVariant = 'framed' | 'plain';

export interface ScopedTabsProps extends Omit<TabsProps, 'orientation' | 'variant' | 'size'> {
  variant?: ScopedTabsVariant;
  size?: ScopedTabsSize;
}

/**
 * Scoped tabs: the selected tab joins the panel surface below it, so the content reads as
 * belonging to that tab. Compose with `TabList`, `Tab` and `TabPanel` (same API and keyboard
 * model as `Tabs`); always horizontal.
 */
export const ScopedTabs = forwardRef<HTMLDivElement, ScopedTabsProps>(function ScopedTabs(
  { variant = 'framed', size = 'md', className, ...rest },
  ref,
) {
  return (
    <Tabs
      ref={ref}
      orientation="horizontal"
      variant="underline"
      size={size}
      className={cx('ds-scoped-tabs', `ds-scoped-tabs--${variant}`, `ds-scoped-tabs--${size}`, className)}
      {...rest}
    />
  );
});
