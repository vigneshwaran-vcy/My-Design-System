import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Icon, type IconName } from '../Icon';
import { useCollapse } from './useCollapse';
import './Accordion.css';

export type AccordionType = 'single' | 'multiple';
export type AccordionVariant = 'default' | 'framed';
export type AccordionSize = 'sm' | 'md';
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

interface AccordionContextValue {
  baseId: string;
  open: string[];
  toggle: (value: string) => void;
  disabled: boolean;
  headingLevel: AccordionHeadingLevel;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const slug = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '-');
const EMPTY: string[] = [];

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** `single` keeps at most one item open; `multiple` lets any number stay open. */
  type?: AccordionType;
  /** Controlled open item values. */
  value?: string[];
  /** Initially open item values (uncontrolled). */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** `single` only: whether the open item can be closed again, leaving none open. */
  collapsible?: boolean;
  /** `default` = hairline dividers; `framed` = items as inset surfaces in a tinted frame. */
  variant?: AccordionVariant;
  size?: AccordionSize;
  /** Heading level wrapping each trigger. */
  headingLevel?: AccordionHeadingLevel;
  /** Disables every item. */
  disabled?: boolean;
}

/** WAI-ARIA accordion: headings wrapping buttons that show and hide their regions. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type = 'single',
    value,
    defaultValue,
    onValueChange,
    collapsible = true,
    variant = 'default',
    size = 'md',
    headingLevel = 3,
    disabled = false,
    className,
    onKeyDown,
    children,
    ...rest
  },
  ref,
) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useControllableState<string[]>(value, defaultValue ?? EMPTY, onValueChange);

  const toggle = useCallback(
    (item: string) => {
      if (open.includes(item)) {
        if (type === 'single' && !collapsible) return;
        setOpen(open.filter((v) => v !== item));
      } else {
        setOpen(type === 'single' ? [item] : [...open, item]);
      }
    },
    [open, setOpen, type, collapsible],
  );

  const ctx = useMemo<AccordionContextValue>(
    () => ({ baseId, open, toggle, disabled, headingLevel }),
    [baseId, open, toggle, disabled, headingLevel],
  );

  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Up/Down/Home/End move between this accordion's headers (nested accordions keep their own).
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const root = rootRef.current;
    const target = event.target as HTMLElement;
    if (!root || !target.classList.contains('ds-accordion__trigger') || target.closest('.ds-accordion') !== root) return;
    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('.ds-accordion__trigger')).filter(
      (t) => t.closest('.ds-accordion') === root && !t.disabled,
    );
    const current = triggers.indexOf(target as HTMLButtonElement);
    let next = -1;
    switch (event.key) {
      case 'ArrowDown':
        next = (current + 1) % triggers.length;
        break;
      case 'ArrowUp':
        next = (current - 1 + triggers.length) % triggers.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = triggers.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    triggers[next]?.focus();
  };

  return (
    <AccordionContext.Provider value={ctx}>
      <div
        ref={setRefs}
        className={cx('ds-accordion', `ds-accordion--${variant}`, `ds-accordion--${size}`, className)}
        data-type={type}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  value: string;
  /** Header text shown in the trigger button. */
  title: ReactNode;
  /** Leading icon: a Solar icon name or any node (decorative). */
  icon?: IconName | ReactNode;
  /** Trailing summary in the header, e.g. a count or status Badge. */
  meta?: ReactNode;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, title, icon, meta, disabled: itemDisabled, className, children, ...rest },
  ref,
) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('<AccordionItem> must be rendered inside <Accordion>.');
  const { baseId, open: openValues, toggle, headingLevel } = ctx;
  const open = openValues.includes(value);
  const disabled = itemDisabled || ctx.disabled;
  const collapse = useCollapse<HTMLDivElement>(open);
  const triggerId = `ds-accordion-${baseId}-trigger-${slug(value)}`;
  const regionId = `ds-accordion-${baseId}-region-${slug(value)}`;
  const Heading = `h${headingLevel}` as 'h3';

  return (
    <div
      ref={ref}
      className={cx('ds-accordion__item', open && 'ds-accordion__item--open', disabled && 'ds-accordion__item--disabled', className)}
      data-state={open ? 'open' : 'closed'}
      {...rest}
    >
      <Heading className="ds-accordion__heading">
        <button
          type="button"
          id={triggerId}
          className="ds-accordion__trigger"
          aria-expanded={open}
          aria-controls={regionId}
          disabled={disabled}
          onClick={() => toggle(value)}
        >
          {icon && (
            <span className="ds-accordion__icon" aria-hidden="true">
              {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}
            </span>
          )}
          <span className="ds-accordion__title">{title}</span>
          {meta !== undefined && meta !== null && <span className="ds-accordion__meta">{meta}</span>}
          <span className="ds-accordion__chevron" aria-hidden="true">
            <Icon name="alt-arrow-down" />
          </span>
        </button>
      </Heading>
      <div
        ref={collapse.ref}
        id={regionId}
        role="region"
        aria-labelledby={triggerId}
        className="ds-accordion__region"
        data-state={collapse.state}
        hidden={collapse.hidden}
      >
        <div className="ds-accordion__region-inner">
          <div className="ds-accordion__content">{children}</div>
        </div>
      </div>
    </div>
  );
});
