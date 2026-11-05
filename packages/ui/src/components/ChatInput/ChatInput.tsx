import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import '../Input/Input.css';
import './ChatInput.css';

export type ChatInputSize = 'sm' | 'md' | 'lg';
export type ChatInputVariant = 'outline' | 'filled';

export interface ChatInputProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'value' | 'defaultValue' | 'onSubmit'> {
  /** Accessible label. Hidden by default; set `hideLabel={false}` to show it. */
  label?: ReactNode;
  hideLabel?: boolean;
  /** Helper text under the box, e.g. a disclaimer or shortcut hint. */
  hint?: ReactNode;
  error?: ReactNode;
  value?: string;
  defaultValue?: string;
  /** Called with the trimmed message on Enter or send-button click. Uncontrolled inputs clear afterwards. */
  onSubmit?: (message: string) => void;
  /** While true the send button becomes a stop button and submitting is blocked. */
  generating?: boolean;
  onStop?: () => void;
  /** Extra controls on the left of the toolbar (attach, model picker, …). */
  actions?: ReactNode;
  /** The textarea grows with its content up to this many rows, then scrolls. */
  maxRows?: number;
  /** Show a character counter; requires `maxLength`. */
  showCount?: boolean;
  sendLabel?: string;
  stopLabel?: string;
  size?: ChatInputSize;
  variant?: ChatInputVariant;
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(function ChatInput(
  {
    label = 'Message',
    hideLabel = true,
    hint,
    error,
    value,
    defaultValue = '',
    onChange,
    onSubmit,
    onKeyDown,
    generating = false,
    onStop,
    actions,
    maxRows = 8,
    rows = 1,
    maxLength,
    showCount = false,
    sendLabel = 'Send message',
    stopLabel = 'Stop generating',
    placeholder = 'Ask anything…',
    size = 'md',
    variant = 'outline',
    disabled,
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-chat-input-${autoId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const countId = showCount && maxLength ? `${inputId}-count` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const text = value ?? internalValue;
  const canSend = !disabled && !generating && text.trim().length > 0;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  // Grow with the content up to `maxRows`, then scroll.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const style = getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const max = lineHeight * maxRows + padding;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
    el.style.overflowY = el.scrollHeight > max ? 'auto' : 'hidden';
  }, [text, maxRows]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInternalValue(event.target.value);
    onChange?.(event);
  };

  const submit = () => {
    if (!canSend) return;
    onSubmit?.(text.trim());
    if (value === undefined) setInternalValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    // Enter sends, Shift+Enter inserts a newline; never send mid IME composition.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      className={cx(
        'ds-field',
        'ds-chat-input',
        `ds-chat-input--${variant}`,
        `ds-chat-input--${size}`,
        error && 'ds-chat-input--invalid',
        disabled && 'ds-field--disabled ds-chat-input--disabled',
        className,
      )}
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        submit();
      }}
    >
      <label htmlFor={inputId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
      </label>
      <div className="ds-chat-input__box" onClick={() => innerRef.current?.focus()}>
        <textarea
          ref={setRefs}
          id={inputId}
          className="ds-chat-input__textarea"
          rows={rows}
          value={text}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...rest}
          aria-describedby={describedBy}
        />
        <div className="ds-chat-input__toolbar">
          <div className="ds-chat-input__actions">{actions}</div>
          <div className="ds-chat-input__trailing">
            {countId && (
              <span id={countId} className="ds-chat-input__count" aria-live="polite">
                {text.length}/{maxLength}
              </span>
            )}
            {generating ? (
              <button
                type="button"
                className="ds-chat-input__send ds-chat-input__send--stop"
                aria-label={stopLabel}
                title={stopLabel}
                disabled={disabled || !onStop}
                onClick={onStop}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" fill="currentColor" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="ds-chat-input__send"
                aria-label={sendLabel}
                title={sendLabel}
                disabled={!canSend}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 15.5v-11M5 9.5l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
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
    </form>
  );
});
