import { forwardRef, Fragment, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import './Kbd.css';

export type KbdSize = 'sm' | 'md';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /**
   * Keys of a shortcut, e.g. `['cmd', 'K']`. Each becomes its own keycap; well-known names map
   * to their symbol (cmd → ⌘, shift → ⇧ …) with an aria-label giving the full word.
   * When set, `children` is ignored.
   */
  keys?: string[];
  /** Placed between keycaps when `keys` is used. Hidden from assistive tech. */
  separator?: ReactNode;
  size?: KbdSize;
}

/** Common key names → displayed glyph and spoken label. Lookup is case-insensitive. */
export const KBD_SYMBOLS: Record<string, { symbol: string; label: string }> = {
  cmd: { symbol: '⌘', label: 'Command' },
  command: { symbol: '⌘', label: 'Command' },
  meta: { symbol: '⌘', label: 'Command' },
  shift: { symbol: '⇧', label: 'Shift' },
  alt: { symbol: '⌥', label: 'Option' },
  option: { symbol: '⌥', label: 'Option' },
  ctrl: { symbol: '⌃', label: 'Control' },
  control: { symbol: '⌃', label: 'Control' },
  enter: { symbol: '↵', label: 'Enter' },
  return: { symbol: '↵', label: 'Enter' },
  tab: { symbol: '⇥', label: 'Tab' },
  esc: { symbol: 'Esc', label: 'Escape' },
  escape: { symbol: 'Esc', label: 'Escape' },
  backspace: { symbol: '⌫', label: 'Backspace' },
  delete: { symbol: '⌦', label: 'Delete' },
  space: { symbol: '␣', label: 'Space' },
  up: { symbol: '↑', label: 'Arrow up' },
  down: { symbol: '↓', label: 'Arrow down' },
  left: { symbol: '←', label: 'Arrow left' },
  right: { symbol: '→', label: 'Arrow right' },
};

export function resolveKey(key: string): { symbol: string; label?: string } {
  const mapped = KBD_SYMBOLS[key.toLowerCase()];
  return mapped ?? { symbol: key };
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { keys, separator = null, size = 'md', className, children, ...rest },
  ref,
) {
  const capClass = cx('ds-kbd', `ds-kbd--${size}`);

  if (keys && keys.length > 0) {
    return (
      <span ref={ref} className={cx('ds-kbd-group', `ds-kbd-group--${size}`, className)} {...rest}>
        {keys.map((key, i) => {
          const { symbol, label } = resolveKey(key);
          return (
            <Fragment key={`${key}-${i}`}>
              {i > 0 && separator !== null && separator !== undefined && (
                <span className="ds-kbd-group__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
              <kbd className={capClass} aria-label={label}>
                {symbol}
              </kbd>
            </Fragment>
          );
        })}
      </span>
    );
  }

  return (
    <kbd ref={ref} className={cx(capClass, className)} {...rest}>
      {children}
    </kbd>
  );
});
