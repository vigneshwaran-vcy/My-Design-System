import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Button } from '../Button';
import { Icon } from '../Icon';
import '../Input/Input.css';
import './DualListbox.css';

export type DualListboxSize = 'sm' | 'md' | 'lg';
export type DualListboxVariant = 'outline' | 'filled';

export interface DualListboxOption {
  value: string;
  label: ReactNode;
  /** Plain-text label (hover title) when `label` is not a string. */
  textValue?: string;
  disabled?: boolean;
}

export interface DualListboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Group label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, both lists are marked invalid and the message is announced. */
  error?: ReactNode;
  options: DualListboxOption[];
  /** Values in the Selected list, in order. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Heading of the left list. */
  sourceLabel?: string;
  /** Heading of the right list. */
  selectedLabel?: string;
  /** Show Move up / Move down buttons for the Selected list (also Alt + ↑ / ↓). */
  reorderable?: boolean;
  /** Rows visible before each list scrolls. */
  visibleRows?: number;
  /** Submits the selected values with a form through hidden inputs. */
  name?: string;
  required?: boolean;
  disabled?: boolean;
  size?: DualListboxSize;
  variant?: DualListboxVariant;
}

type Side = 'source' | 'target';

const textOf = (option: DualListboxOption) =>
  option.textValue ?? (typeof option.label === 'string' ? option.label : option.value);

/**
 * Two multi-select listboxes with buttons to move options between them (SLDS dual listbox).
 * Each list is a WAI-ARIA multi-select listbox: arrows move, Shift extends, Ctrl/⌘ moves without selecting,
 * Space toggles, Ctrl/⌘ + A selects all. Rest props and the ref go to the root group.
 */
export const DualListbox = forwardRef<HTMLDivElement, DualListboxProps>(function DualListbox(
  {
    label,
    hideLabel = false,
    hint,
    error,
    options,
    value: valueProp,
    defaultValue = [],
    onChange,
    sourceLabel = 'Available',
    selectedLabel = 'Selected',
    reorderable = false,
    visibleRows = 6,
    name,
    required = false,
    disabled = false,
    size = 'md',
    variant = 'outline',
    id,
    className,
    style,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const rootId = id ?? `ds-dual-listbox-${autoId}`;
  const labelId = `${rootId}-label`;
  const hintId = hint ? `${rootId}-hint` : undefined;
  const errorId = error ? `${rootId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  const optionId = (value: string) => `${rootId}-option-${options.findIndex((o) => o.value === value)}`;

  const [value, setValue] = useControllableState<string[]>(valueProp, defaultValue, onChange);
  const byValue = new Map(options.map((o) => [o.value, o]));
  const lists: Record<Side, DualListboxOption[]> = {
    source: options.filter((o) => !value.includes(o.value)),
    target: value.map((v) => byValue.get(v)).filter((o): o is DualListboxOption => Boolean(o)),
  };

  const [highlight, setHighlight] = useState<Record<Side, string[]>>({ source: [], target: [] });
  const [active, setActive] = useState<Record<Side, string | null>>({ source: null, target: null });
  const [anchor, setAnchor] = useState<Record<Side, string | null>>({ source: null, target: null });
  const [announcement, setAnnouncement] = useState('');

  // Highlights only count while their option is still in that list.
  const highlighted = (side: Side) => highlight[side].filter((v) => lists[side].some((o) => o.value === v));
  const enabledIn = (side: Side) => lists[side].filter((o) => !o.disabled && !disabled);

  const update = (side: Side, next: { highlight?: string[]; active?: string | null; anchor?: string | null }) => {
    if (next.highlight) setHighlight((h) => ({ ...h, [side]: next.highlight }));
    if (next.active !== undefined) setActive((a) => ({ ...a, [side]: next.active }));
    if (next.anchor !== undefined) setAnchor((a) => ({ ...a, [side]: next.anchor }));
  };

  const range = (side: Side, from: string | null, to: string) => {
    const items = lists[side];
    const a = Math.max(0, items.findIndex((o) => o.value === from));
    const b = items.findIndex((o) => o.value === to);
    const [lo, hi] = a < b ? [a, b] : [b, a];
    return items.slice(lo, hi + 1).filter((o) => !o.disabled).map((o) => o.value);
  };

  const announce = (count: number, where: string) =>
    setAnnouncement(`${count} ${count === 1 ? 'item' : 'items'} moved to ${where}`);

  const move = (from: Side, values = highlighted(from)) => {
    const movable = values.filter((v) => !byValue.get(v)?.disabled);
    if (!movable.length || disabled) return;
    const to: Side = from === 'source' ? 'target' : 'source';
    if (from === 'source') {
      const ordered = lists.source.map((o) => o.value).filter((v) => movable.includes(v));
      setValue([...value, ...ordered]);
    } else {
      setValue(value.filter((v) => !movable.includes(v)));
    }
    // Keep the "from" list's cursor on a nearby remaining option.
    const remaining = lists[from].filter((o) => !movable.includes(o.value));
    const oldIndex = lists[from].findIndex((o) => o.value === (active[from] ?? movable[0]));
    const nextActive = remaining[Math.min(Math.max(oldIndex, 0), remaining.length - 1)]?.value ?? null;
    update(from, { highlight: [], active: nextActive, anchor: nextActive });
    update(to, { highlight: movable, active: movable[0], anchor: movable[0] });
    announce(movable.length, from === 'source' ? selectedLabel : sourceLabel);
  };

  const reorder = (delta: -1 | 1) => {
    const picked = new Set(highlighted('target'));
    if (!picked.size || disabled) return;
    const next = [...value];
    const indexes = next.map((v, i) => (picked.has(v) ? i : -1)).filter((i) => i >= 0);
    if (delta === 1) indexes.reverse();
    for (const i of indexes) {
      const j = i + delta;
      if (j < 0 || j >= next.length || picked.has(next[j])) continue;
      [next[i], next[j]] = [next[j], next[i]];
    }
    setValue(next);
    setAnnouncement(`Moved ${delta === -1 ? 'up' : 'down'}`);
  };

  const handleClick = (side: Side, option: DualListboxOption, event: MouseEvent) => {
    if (option.disabled || disabled) return;
    const v = option.value;
    if (event.shiftKey) update(side, { highlight: range(side, anchor[side], v), active: v });
    else if (event.metaKey || event.ctrlKey) {
      const current = highlighted(side);
      update(side, {
        highlight: current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
        active: v,
        anchor: v,
      });
    } else update(side, { highlight: [v], active: v, anchor: v });
  };

  const handleKeyDown = (side: Side, event: KeyboardEvent<HTMLUListElement>) => {
    if (disabled) return;
    const items = enabledIn(side);
    if (!items.length) return;
    const values = items.map((o) => o.value);
    const pos = values.indexOf(active[side] ?? '');
    const ctrl = event.ctrlKey || event.metaKey;

    if (side === 'target' && reorderable && event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      event.preventDefault();
      reorder(event.key === 'ArrowUp' ? -1 : 1);
      return;
    }

    let target: string | undefined;
    switch (event.key) {
      case 'ArrowDown':
        target = values[pos < 0 ? 0 : Math.min(pos + 1, values.length - 1)];
        break;
      case 'ArrowUp':
        target = values[pos < 0 ? 0 : Math.max(pos - 1, 0)];
        break;
      case 'Home':
        target = values[0];
        break;
      case 'End':
        target = values[values.length - 1];
        break;
      case ' ': {
        event.preventDefault();
        const v = active[side] ?? values[0];
        if (event.shiftKey) {
          update(side, { highlight: range(side, anchor[side], v), active: v });
        } else {
          const current = highlighted(side);
          update(side, {
            highlight: current.includes(v) ? current.filter((x) => x !== v) : [...current, v],
            active: v,
            anchor: v,
          });
        }
        return;
      }
      case 'a':
      case 'A':
        if (ctrl) {
          event.preventDefault();
          update(side, { highlight: values });
        }
        return;
      case 'Enter':
        event.preventDefault();
        move(side);
        return;
      default:
        return;
    }
    event.preventDefault();
    if (!target) return;
    if (event.shiftKey) update(side, { highlight: range(side, anchor[side], target), active: target });
    else if (ctrl) update(side, { active: target });
    else update(side, { highlight: [target], active: target, anchor: target });
    document.getElementById(optionId(target))?.scrollIntoView?.({ block: 'nearest' });
  };

  const renderList = (side: Side, heading: string) => {
    const headingId = `${rootId}-${side}-label`;
    const items = lists[side];
    const picked = highlighted(side);
    const current = items.some((o) => o.value === active[side]) ? active[side] : null;
    return (
      <div className={cx('ds-dual-listbox__pane', `ds-dual-listbox__pane--${side}`)}>
        <span id={headingId} className="ds-dual-listbox__heading">
          {heading}
        </span>
        <ul
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={`${headingId}`}
          aria-describedby={describedBy}
          aria-required={side === 'target' && required ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-disabled={disabled || undefined}
          aria-activedescendant={current ? optionId(current) : undefined}
          tabIndex={disabled ? -1 : 0}
          className={cx(
            'ds-dual-listbox__list',
            `ds-dual-listbox__list--${variant}`,
            error && 'ds-dual-listbox__list--invalid',
          )}
          onFocus={() => {
            if (!current) {
              const first = picked[0] ?? enabledIn(side)[0]?.value ?? null;
              update(side, { active: first, anchor: first });
            }
          }}
          onKeyDown={(event) => handleKeyDown(side, event)}
        >
          {items.length === 0 && (
            <li role="presentation" className="ds-dual-listbox__empty">
              {side === 'source' ? 'No more options' : 'Nothing selected'}
            </li>
          )}
          {items.map((option) => (
            <li
              key={option.value}
              id={optionId(option.value)}
              title={textOf(option)}
              role="option"
              aria-selected={picked.includes(option.value)}
              aria-disabled={option.disabled || undefined}
              className={cx(
                'ds-dual-listbox__option',
                option.value === current && 'ds-dual-listbox__option--active',
                picked.includes(option.value) && 'ds-dual-listbox__option--selected',
              )}
              // Keep focus on the listbox (aria-activedescendant) while clicking.
              onMouseDown={(event) => {
                event.preventDefault();
                (event.currentTarget.parentElement as HTMLElement | null)?.focus();
              }}
              onClick={(event) => handleClick(side, option, event)}
              onDoubleClick={() => !option.disabled && move(side, [option.value])}
            >
              <span className="ds-dual-listbox__option-label">{option.label}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const canRight = !disabled && highlighted('source').length > 0;
  const canLeft = !disabled && highlighted('target').length > 0;
  const buttonSize = size === 'lg' ? 'md' : 'sm';

  return (
    <div
      ref={ref}
      id={rootId}
      role="group"
      aria-labelledby={labelId}
      className={cx(
        'ds-field',
        'ds-dual-listbox',
        `ds-dual-listbox--${size}`,
        reorderable && 'ds-dual-listbox--reorderable',
        disabled && 'ds-field--disabled',
        disabled && 'ds-dual-listbox--disabled',
        className,
      )}
      style={{ ...style, '--dual-listbox-rows': visibleRows } as CSSProperties}
      {...rest}
      aria-describedby={undefined}
    >
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <div className="ds-dual-listbox__body">
        {renderList('source', sourceLabel)}
        <div className="ds-dual-listbox__actions">
          <Button
            variant="secondary"
            size={buttonSize}
            className="ds-dual-listbox__action"
            aria-label={`Move selection to ${selectedLabel}`}
            title={`Move selection to ${selectedLabel}`}
            disabled={!canRight}
            onClick={() => move('source')}
          >
            <Icon name="alt-arrow-right" />
          </Button>
          <Button
            variant="secondary"
            size={buttonSize}
            className="ds-dual-listbox__action"
            aria-label={`Move selection to ${sourceLabel}`}
            title={`Move selection to ${sourceLabel}`}
            disabled={!canLeft}
            onClick={() => move('target')}
          >
            <Icon name="alt-arrow-left" />
          </Button>
        </div>
        {renderList('target', selectedLabel)}
        {reorderable && (
          <div className="ds-dual-listbox__actions">
            <Button
              variant="secondary"
              size={buttonSize}
              className="ds-dual-listbox__action"
              aria-label="Move selection up"
              title="Move selection up"
              disabled={!canLeft}
              onClick={() => reorder(-1)}
            >
              <Icon name="alt-arrow-up" />
            </Button>
            <Button
              variant="secondary"
              size={buttonSize}
              className="ds-dual-listbox__action"
              aria-label="Move selection down"
              title="Move selection down"
              disabled={!canLeft}
              onClick={() => reorder(1)}
            >
              <Icon name="alt-arrow-down" />
            </Button>
          </div>
        )}
      </div>
      <span className="ds-visually-hidden" aria-live="polite">
        {announcement}
      </span>
      {name && value.map((v) => <input key={v} type="hidden" name={name} value={v} />)}
      {hint && (
        <p id={hintId} className="ds-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="ds-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

