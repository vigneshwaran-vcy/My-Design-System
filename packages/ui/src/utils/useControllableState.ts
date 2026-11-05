import { useCallback, useRef, useState } from 'react';

/**
 * Controlled/uncontrolled state in one hook: when `value` is defined the caller owns it,
 * otherwise internal state (seeded from `defaultValue`) is used. `onChange` fires on every change.
 */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const latest = useRef({ current, isControlled, onChange });
  latest.current = { current, isControlled, onChange };

  const set = useCallback((next: T) => {
    const { current: prev, isControlled: controlled, onChange: change } = latest.current;
    if (Object.is(prev, next)) return;
    if (!controlled) setInternal(next);
    change?.(next);
  }, []);

  return [current, set];
}
