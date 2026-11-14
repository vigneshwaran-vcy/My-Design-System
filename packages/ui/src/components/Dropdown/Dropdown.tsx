import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import '../Input/Input.css';
import './Dropdown.css';

export type DropdownSize = 'sm' | 'md' | 'lg';
export type DropdownVariant = 'outline' | 'filled';

export interface DropdownOption {
  value: string;
  label: ReactNode;
  /** Plain-text label used for typeahead when `label` is not a string. */
  textValue?: string;
  description?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  options: DropdownOption[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Submits the value with a form through a hidden input. */
  name?: string;
  required?: boolean;
  size?: DropdownSize;
  variant?: DropdownVariant;
}

const textOf = (option: DropdownOption) =>
  option.textValue ?? (typeof option.label === 'string' ? option.label : option.value);

/** Single-select dropdown following the WAI-ARIA "select-only combobox" pattern. */
export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(function Dropdown(
  {
    label,
    hideLabel = false,
    hint,
    error,
    options,
    value,
    defaultValue = null,
    onChange,
    placeholder = 'Select…',
    name,
    required,
    disabled,
    size = 'md',
    variant = 'outline',
    id,
    className,
    onKeyDown,
    onClick,
    onBlur,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const triggerId = id ?? `ds-dropdown-${autoId}`;
  const labelId = `${triggerId}-label`;
  const listId = `${triggerId}-list`;
  const hintId = hint ? `${triggerId}-hint` : undefined;
  const errorId = error ? `${triggerId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  const optionId = (index: number) => `${triggerId}-option-${index}`;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;
  const selectedIndex = options.findIndex((o) => o.value === selectedValue);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: '', timer: 0 });

  const enabledIndexes = options.flatMap((o, i) => (o.disabled ? [] : [i]));
  const firstEnabled = enabledIndexes[0] ?? -1;
  const lastEnabled = enabledIndexes[enabledIndexes.length - 1] ?? -1;

  const step = (from: number, delta: 1 | -1) => {
    for (let i = from + delta; i >= 0 && i < options.length; i += delta) {
      if (!options[i].disabled) return i;
    }
    return from;
  };

  const openList = (index = selectedIndex >= 0 ? selectedIndex : firstEnabled) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (value === undefined) setInternalValue(option.value);
    if (option.value !== selectedValue) onChange?.(option.value);
    setOpen(false);
  };

  // Close when clicking anywhere outside the component.
  useEffect(() => {
    if (!open) return;
    const handle = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`);
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);

  const runTypeahead = (char: string) => {
    const state = typeahead.current;
    window.clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = window.setTimeout(() => (state.query = ''), 500);
    const start = open ? activeIndex : selectedIndex;
    const ordered = [...options.keys()].map((i) => (i + start + 1) % options.length);
    const match = ordered.find((i) => !options[i].disabled && textOf(options[i]).toLowerCase().startsWith(state.query));
    if (match === undefined) return;
    if (open) setActiveIndex(match);
    else commit(match);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const { key } = event;

    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        openList(selectedIndex >= 0 ? selectedIndex : key === 'ArrowUp' ? lastEnabled : firstEnabled);
      } else if (key === 'Home' || key === 'End') {
        event.preventDefault();
        openList(key === 'Home' ? firstEnabled : lastEnabled);
      } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        runTypeahead(key);
      }
      return;
    }

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((i) => step(i, 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.altKey) commit(activeIndex);
        else setActiveIndex((i) => step(i, -1));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(firstEnabled);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(lastEnabled);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        commit(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        break;
      case 'Tab':
        commit(activeIndex);
        break;
      default:
        if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) runTypeahead(key);
    }
  };

  return (
    <div ref={rootRef} className={cx('ds-field', 'ds-dropdown', disabled && 'ds-field--disabled', className)}>
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <div className="ds-dropdown__control">
        <button
          ref={ref}
          id={triggerId}
          type="button"
          role="combobox"
          className={cx(
            'ds-dropdown__trigger',
            `ds-dropdown__trigger--${variant}`,
            `ds-dropdown__trigger--${size}`,
            error && 'ds-dropdown__trigger--invalid',
          )}
          aria-labelledby={`${labelId} ${triggerId}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          disabled={disabled}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) (open ? setOpen(false) : openList());
          }}
          onBlur={(event) => {
            onBlur?.(event);
            if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
          }}
          onKeyDown={handleKeyDown}
          {...rest}
          aria-describedby={describedBy}
        >
          <span className={cx('ds-dropdown__value', !selected && 'ds-dropdown__value--placeholder')}>
            {selected ? selected.label : placeholder}
          </span>
          <Icon name="alt-arrow-down" className="ds-dropdown__chevron" />
        </button>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          hidden={!open}
          className="ds-dropdown__list"
          // Keep focus on the trigger while clicking options.
          onMouseDown={(event) => event.preventDefault()}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              aria-disabled={option.disabled || undefined}
              className={cx(
                'ds-dropdown__option',
                index === activeIndex && 'ds-dropdown__option--active',
                index === selectedIndex && 'ds-dropdown__option--selected',
              )}
              onPointerMove={() => !option.disabled && setActiveIndex(index)}
              onClick={() => commit(index)}
            >
              <span className="ds-dropdown__option-text">
                <span className="ds-dropdown__option-label">{option.label}</span>
                {option.description && <span className="ds-dropdown__option-description">{option.description}</span>}
              </span>
              <Icon name="check" className="ds-dropdown__check" />
            </li>
          ))}
        </ul>
      </div>
      {name && <input type="hidden" name={name} value={selectedValue ?? ''} />}
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
