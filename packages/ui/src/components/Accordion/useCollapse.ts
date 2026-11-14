import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hasTransition(el: HTMLElement | null): boolean {
  if (!el || prefersReducedMotion()) return false;
  const duration = getComputedStyle(el).transitionDuration;
  return !!duration && duration.split(',').some((part) => parseFloat(part) > 0);
}

/**
 * Animated show/hide for a collapsible region. The region stays mounted (so `aria-controls`
 * always resolves) and gets `hidden` once fully closed, which removes it from the tab order
 * and the accessibility tree. `state` drives the CSS height animation (grid rows 0fr → 1fr);
 * with reduced motion or no transition the region simply toggles.
 */
export function useCollapse<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null);
  const [hidden, setHidden] = useState(!open);
  const [expanded, setExpanded] = useState(open);

  useLayoutEffect(() => {
    if (open) {
      setHidden(false);
    } else {
      setExpanded(false);
      if (!hasTransition(ref.current)) setHidden(true);
    }
  }, [open]);

  // Once the region is displayed in its closed state, flip it open so the height animates.
  useLayoutEffect(() => {
    if (open && !hidden && !expanded) {
      void ref.current?.offsetHeight;
      setExpanded(true);
    }
  }, [open, hidden, expanded]);

  // Closing: hide after the height transition ends (with a fallback in case it never fires).
  useEffect(() => {
    const el = ref.current;
    if (!el || open || hidden) return;
    const done = (event: TransitionEvent) => {
      if (event.target === el) setHidden(true);
    };
    el.addEventListener('transitionend', done);
    const timer = window.setTimeout(() => setHidden(true), 600);
    return () => {
      el.removeEventListener('transitionend', done);
      window.clearTimeout(timer);
    };
  }, [open, hidden]);

  return { ref, hidden, state: (expanded ? 'open' : 'closed') as 'open' | 'closed' };
}
