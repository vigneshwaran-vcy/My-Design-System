import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Button } from '../Button';
import { Icon } from '../Icon';
import './Carousel.css';

export type CarouselVariant = 'default' | 'framed';
export type CarouselSize = 'sm' | 'md';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface SlideContextValue {
  id: string;
  index: number;
  count: number;
  active: boolean;
  label: string;
}

const SlideContext = createContext<SlideContextValue | null>(null);

export interface CarouselProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Controlled index of the visible slide. */
  index?: number;
  /** Initially visible slide (uncontrolled). */
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Rotates slides automatically. Pauses on hover and focus; never starts with reduced motion. */
  autoPlay?: boolean;
  /** Milliseconds between automatic rotations. */
  interval?: number;
  /** Wraps from the last slide to the first (and back). */
  loop?: boolean;
  /** `default` = slide surface with controls below; `framed` = all of it in a tinted frame. */
  variant?: CarouselVariant;
  size?: CarouselSize;
  /** Accessible label for each slide; defaults to "N of M". */
  slideLabel?: (index: number, count: number) => string;
}

/** WAI-ARIA tabbed carousel: rotation control, previous/next buttons and a tablist of slide picks. */
export const Carousel = forwardRef<HTMLElement, CarouselProps>(function Carousel(
  {
    index,
    defaultIndex = 0,
    onIndexChange,
    autoPlay = false,
    interval = 5000,
    loop = true,
    variant = 'default',
    size = 'md',
    slideLabel = (i, n) => `${i + 1} of ${n}`,
    className,
    children,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const slides = Children.toArray(children).filter(isValidElement);
  const count = slides.length;
  const [rawCurrent, setCurrent] = useControllableState<number>(index, defaultIndex, onIndexChange);
  const current = Math.min(Math.max(0, rawCurrent), Math.max(0, count - 1));

  const [stopped, setStopped] = useState(() => prefersReducedMotion());
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const playing = autoPlay && !stopped && count > 1;
  const rotating = playing && !hovered && !focused;
  const tabsRef = useRef<HTMLDivElement>(null);

  const slideId = (i: number) => `ds-carousel-${baseId}-slide-${i}`;
  const trackId = `ds-carousel-${baseId}-track`;

  const go = (next: number) => {
    if (count === 0) return;
    const target = loop ? (next + count) % count : Math.min(Math.max(0, next), count - 1);
    setCurrent(target);
  };

  // Keep the latest `go` for the interval without restarting it on every render.
  const goRef = useRef(go);
  goRef.current = go;
  const currentRef = useRef(current);
  currentRef.current = current;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      const atEnd = currentRef.current >= count - 1;
      goRef.current(atEnd && !loop ? 0 : currentRef.current + 1);
    }, interval);
    return () => window.clearInterval(timer);
  }, [rotating, interval, count, loop]);

  const handleFocus = (event: FocusEvent<HTMLElement>) => {
    onFocus?.(event);
    // Focus on the rotation control itself does not pause, so "Start" takes effect right away.
    setFocused(!(event.target as HTMLElement).classList.contains('ds-carousel__rotation'));
  };
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  };

  const handleTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = -1;
    switch (event.key) {
      case 'ArrowRight':
        next = (current + 1) % count;
        break;
      case 'ArrowLeft':
        next = (current - 1 + count) % count;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = count - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setCurrent(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  const buttonSize = size === 'sm' ? 'xs' : 'sm';

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      className={cx('ds-carousel', `ds-carousel--${variant}`, `ds-carousel--${size}`, className)}
      data-playing={rotating || undefined}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        setHovered(true);
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event);
        setHovered(false);
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    >
      <div className="ds-carousel__viewport">
        <div
          id={trackId}
          className="ds-carousel__track"
          aria-live={rotating ? 'off' : 'polite'}
          style={{ transform: `translateX(${current * -100}%)` }}
        >
          {slides.map((slide, i) => (
            <SlideContext.Provider
              key={slide.key ?? i}
              value={{ id: slideId(i), index: i, count, active: i === current, label: slideLabel(i, count) }}
            >
              {slide}
            </SlideContext.Provider>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="ds-carousel__controls">
          {autoPlay && (
            <Button
              variant="ghost"
              size={buttonSize}
              className="ds-carousel__control ds-carousel__rotation"
              aria-label={playing ? 'Stop automatic slide show' : 'Start automatic slide show'}
              onClick={() => setStopped(playing)}
            >
              <Icon name={playing ? 'pause' : 'play'} />
            </Button>
          )}
          <Button
            variant="secondary"
            size={buttonSize}
            className="ds-carousel__control"
            aria-label="Previous slide"
            aria-controls={trackId}
            disabled={!loop && current === 0}
            onClick={() => go(current - 1)}
          >
            <Icon name="alt-arrow-left" />
          </Button>
          <div ref={tabsRef} role="tablist" aria-label="Slides" className="ds-carousel__dots" onKeyDown={handleTabsKeyDown}>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                className="ds-carousel__dot"
                aria-label={`Slide ${i + 1}`}
                aria-selected={i === current}
                aria-controls={slideId(i)}
                tabIndex={i === current ? 0 : -1}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
          <Button
            variant="secondary"
            size={buttonSize}
            className="ds-carousel__control"
            aria-label="Next slide"
            aria-controls={trackId}
            disabled={!loop && current === count - 1}
            onClick={() => go(current + 1)}
          >
            <Icon name="alt-arrow-right" />
          </Button>
        </div>
      )}
    </section>
  );
});

export interface CarouselSlideProps extends HTMLAttributes<HTMLDivElement> {}

/** One slide. Inactive slides are hidden from assistive tech and taken out of the tab order. */
export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(function CarouselSlide(
  { className, children, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const ctx = useContext(SlideContext);
  if (!ctx) throw new Error('<CarouselSlide> must be rendered inside <Carousel>.');
  const localRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localRef.current?.toggleAttribute('inert', !ctx.active);
  }, [ctx.active]);

  const setRefs = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={setRefs}
      id={ctx.id}
      role="tabpanel"
      aria-roledescription="slide"
      aria-label={ariaLabel ?? ctx.label}
      aria-hidden={!ctx.active || undefined}
      className={cx('ds-carousel__slide', ctx.active && 'ds-carousel__slide--active', className)}
      data-state={ctx.active ? 'active' : 'inactive'}
      {...rest}
    >
      {children}
    </div>
  );
});
