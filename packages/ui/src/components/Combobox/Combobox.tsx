import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import '../Input/Input.css';
import '../Dropdown/Dropdown.css';
import './Combobox.css';

export type ComboboxSize = 'sm' | 'md' | 'lg';
export type ComboboxVariant = 'outline' | 'filled';

export interface ComboboxOption {
  value: string;
  /** Plain text: it is matched against the query and written into the input on select. */
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

interface ComboboxBaseProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'defaultValue' | 'onChange' | 'multiple' | 'type' | 'name'
  > {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  options: ComboboxOption[];
  /** Controlled text in the input. */
  inputValue?: string;
  defaultInputValue?: string;
  onInputChange?: (text: string) => void;
  /** Decides whether an option matches the typed text. Default: case-insensitive "label contains". */
  filter?: (option: ComboboxOption, query: string) => boolean;
  /** Shown in the popup when nothing matches. */
  emptyMessage?: ReactNode;
  /** Submits the value(s) with a form through hidden inputs. */
  name?: string;
  /** Show a clear button when there is a value. */
  clearable?: boolean;
  size?: ComboboxSize;
  variant?: ComboboxVariant;
}

export interface ComboboxSingleProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface ComboboxMultipleProps {
  /** Pick several options; they show as removable chips before the input. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type ComboboxProps = ComboboxBaseProps & (ComboboxSingleProps | ComboboxMultipleProps);

type AnyValue = string | string[] | null | undefined;
const toArray = (v: AnyValue): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

const defaultFilter = (option: ComboboxOption, query: string) =>
  option.label.toLowerCase().includes(query.trim().toLowerCase());

/**
 * Editable combobox with list autocomplete (WAI-ARIA combobox pattern): typing filters the options,
 * arrows move the active option, Enter picks it. Single or multiple selection (chips).
 * The ref and rest props go to the text input.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
  const {
    label,
    hideLabel = false,
    hint,
    error,
    options,
    inputValue: inputValueProp,
    defaultInputValue,
    onInputChange,
    filter = defaultFilter,
    emptyMessage = 'No results',
    name,
    clearable = true,
    size = 'md',
    variant = 'outline',
    multiple = false,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder,
    required,
    disabled,
    id,
    className,
    onKeyDown,
    onBlur,
    onFocus,
    ...rest
  } = props as ComboboxBaseProps & {
    multiple?: boolean;
    value?: AnyValue;
    defaultValue?: AnyValue;
    onChange?: (value: string | string[] | null) => void;
  };

  const autoId = useId();
  const inputId = id ?? `ds-combobox-${autoId}`;
  const labelId = `${inputId}-label`;
  const listId = `${inputId}-list`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  const [selected, setSelected] = useControllableState<string[]>(
    valueProp === undefined ? undefined : toArray(valueProp),
    toArray(defaultValue),
  );
  const labelFor = useCallback((v: string | undefined) => options.find((o) => o.value === v)?.label ?? '', [options]);

  const [text, setText] = useControllableState<string>(
    inputValueProp,
    defaultInputValue ?? (multiple ? '' : labelFor(toArray(defaultValue ?? valueProp)[0])),
    onInputChange,
  );

  const [open, setOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Only filter once the user has typed; opening with the arrow keys shows every option.
  const visible = options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !dirty || !text.trim() || filter(option, text));
  const enabled = visible.filter(({ option }) => !option.disabled).map(({ index }) => index);

  const commit = (next: string[]) => {
    setSelected(next);
    onChange?.(multiple ? next : (next[0] ?? null));
  };

  // Single: keep the input showing the selected label when it changes from outside.
  const selectedLabel = multiple ? '' : labelFor(selected[0]);
  useEffect(() => {
    if (!multiple && !dirty) setText(selectedLabel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLabel]);

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  /** Ends an edit: single mode reverts the text to the selection (or clears it if the text was emptied). */
  const settle = () => {
    if (!multiple) {
      if (!text.trim() && selected.length) commit([]);
      else setText(selectedLabel);
    } else if (text) {
      setText('');
    }
    setDirty(false);
    close();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (multiple) {
      const has = selected.includes(option.value);
      commit(has ? selected.filter((v) => v !== option.value) : [...selected, option.value]);
      setText('');
      setDirty(false);
      setActiveIndex(index);
    } else {
      if (selected[0] !== option.value) commit([option.value]);
      setText(option.label);
      setDirty(false);
      close();
    }
  };

  const remove = (value: string) => {
    commit(selected.filter((v) => v !== value));
    inputRef.current?.focus();
  };

  const clear = () => {
    commit([]);
    setText('');
    setDirty(false);
    inputRef.current?.focus();
  };

  const openList = (index: number) => {
    setOpen(true);
    setActiveIndex(index);
  };

  // Clicking outside blurs the input, and the root's onBlur settles and closes, so no document listener is needed.

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    setDirty(true);
    setOpen(true);
    setActiveIndex(-1);
  };

  const step = (delta: 1 | -1) => {
    if (!enabled.length) return;
    const pos = enabled.indexOf(activeIndex);
    if (pos < 0) setActiveIndex(delta === 1 ? enabled[0] : enabled[enabled.length - 1]);
    else setActiveIndex(enabled[(pos + delta + enabled.length) % enabled.length]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        if (!open) {
          const current = options.findIndex((o) => o.value === selected[selected.length - 1]);
          openList(event.altKey ? -1 : enabled.includes(current) ? current : (enabled[0] ?? -1));
        } else step(1);
        break;
      }
      case 'ArrowUp':
        event.preventDefault();
        if (!open) openList(enabled[enabled.length - 1] ?? -1);
        else if (event.altKey) {
          if (activeIndex >= 0) choose(activeIndex);
          close();
        } else step(-1);
        break;
      case 'Enter':
        if (open && activeIndex >= 0) {
          event.preventDefault();
          choose(activeIndex);
        }
        break;
      case 'Escape':
        if (open) {
          event.preventDefault();
          settle();
        } else if (text || (!multiple && selected.length)) {
          event.preventDefault();
          setText('');
          if (!multiple) commit([]);
        }
        break;
      case 'Backspace':
        if (multiple && !text && selected.length) commit(selected.slice(0, -1));
        break;
      default:
    }
  };

  const hasValue = selected.length > 0 || Boolean(text);
  const activeVisible = open && activeIndex >= 0 && visible.some((v) => v.index === activeIndex);

  return (
    <div
      ref={rootRef}
      className={cx('ds-field', 'ds-combobox', multiple && 'ds-combobox--multiple', disabled && 'ds-field--disabled', className)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) settle();
      }}
    >
      <label id={labelId} htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </label>
      <div className="ds-combobox__anchor">
        <div
          className={cx(
            'ds-combobox__control',
            `ds-combobox__control--${variant}`,
            `ds-combobox__control--${size}`,
            error && 'ds-combobox__control--invalid',
            disabled && 'ds-combobox__control--disabled',
            open && 'ds-combobox__control--open',
          )}
          onMouseDown={(event) => {
            // Clicking the padding or icon focuses the input instead of blurring it.
            if (event.target === event.currentTarget || (event.target as Element).closest('.ds-combobox__search')) {
              event.preventDefault();
              inputRef.current?.focus();
            }
          }}
        >
          <Icon name="search" className="ds-combobox__search" />
          {multiple &&
            selected.map((value) => (
              <Badge
                key={value}
                className="ds-combobox__chip"
                variant="neutral"
                size={size === 'sm' ? 'sm' : 'md'}
                removable={!disabled}
                removeLabel={labelFor(value) || value}
                onRemove={() => remove(value)}
              >
                {labelFor(value) || value}
              </Badge>
            ))}
          <input
            ref={setRefs}
            id={inputId}
            type="text"
            role="combobox"
            className="ds-combobox__input"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={activeVisible ? optionId(activeIndex) : undefined}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            placeholder={multiple && selected.length ? undefined : placeholder}
            disabled={disabled}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={() => {
              if (!open) openList(-1);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            {...rest}
            aria-describedby={describedBy}
          />
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              className="ds-combobox__clear"
              aria-label="Clear selection"
              onMouseDown={(event) => event.preventDefault()}
              onClick={clear}
            >
              <Icon name="close" />
            </button>
          )}
        </div>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          aria-multiselectable={multiple || undefined}
          tabIndex={-1}
          hidden={!open || visible.length === 0}
          className="ds-dropdown__list ds-combobox__list"
          // Keep focus in the input while clicking options.
          onMouseDown={(event) => event.preventDefault()}
        >
          {visible.map(({ option, index }) => {
            const isSelected = selected.includes(option.value);
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled || undefined}
                className={cx(
                  'ds-dropdown__option',
                  'ds-combobox__option',
                  index === activeIndex && 'ds-dropdown__option--active',
                  isSelected && 'ds-dropdown__option--selected',
                )}
                onPointerMove={() => !option.disabled && setActiveIndex(index)}
                onClick={() => {
                  choose(index);
                  inputRef.current?.focus();
                }}
              >
                <span className="ds-dropdown__option-text">
                  <span className="ds-dropdown__option-label">{option.label}</span>
                  {option.description && <span className="ds-dropdown__option-description">{option.description}</span>}
                </span>
                <Icon name="check" className="ds-dropdown__check" />
              </li>
            );
          })}
        </ul>
        {open && visible.length === 0 && (
          <div className="ds-dropdown__list ds-combobox__empty" role="status">
            <Icon name="search" className="ds-combobox__empty-icon" />
            {emptyMessage}
          </div>
        )}
      </div>
      {name &&
        (multiple ? (
          selected.map((v) => <input key={v} type="hidden" name={name} value={v} />)
        ) : (
          <input type="hidden" name={name} value={selected[0] ?? ''} />
        ))}
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
