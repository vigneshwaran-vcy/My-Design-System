import {
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

type ChildProps = {
  'aria-describedby'?: string;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'children'> {
  /** Short, plain-text help. Tooltips are supplementary: never put essential actions in them. */
  content: ReactNode;
  /** Side of the child the tooltip appears on. */
  placement?: TooltipPlacement;
  /** Hover delay in milliseconds before the tooltip shows. Keyboard focus shows it immediately. */
  delay?: number;
  /**
   * A single focusable element. It is cloned to receive `aria-describedby` and the hover/focus handlers.
   * A disabled button fires no mouse or focus events, so wrap it in a `<span tabIndex={0}>` first.
   */
  children: ReactElement<ChildProps>;
}

/** Text hint shown on hover and keyboard focus. Rest props, `className` and the ref go to the tooltip bubble. */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, placement = 'top', delay = 300, children, id, className, ...rest },
  ref,
) {
  const autoId = useId();
  const tooltipId = id ?? `ds-tooltip-${autoId}`;
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();

  const clearTimer = () => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
  };
  const show = (after: number) => {
    clearTimer();
    if (after <= 0) setOpen(true);
    else timer.current = window.setTimeout(() => setOpen(true), after);
  };
  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => clearTimer, []);

  const childProps = children.props;
  const describedBy = [childProps['aria-describedby'], tooltipId].filter(Boolean).join(' ');

  const child = cloneElement(children, {
    'aria-describedby': describedBy,
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(event);
      show(delay);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(event);
      hide();
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      show(0);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      hide();
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        hide();
      }
    },
  });

  return (
    <span className={cx('ds-tooltip', `ds-tooltip--${placement}`)}>
      {child}
      <div
        ref={ref}
        id={tooltipId}
        role="tooltip"
        hidden={!open}
        className={cx('ds-tooltip__bubble', className)}
        {...rest}
      >
        {content}
      </div>
    </span>
  );
});
