import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon, type IconName } from '../Icon';
import { Spinner } from '../Spinner';
import '../Input/Input.css';
import './ChatInput.css';

export type ChatInputSize = 'sm' | 'md' | 'lg';
export type ChatInputVariant = 'outline' | 'filled';

export interface ChatInputAttachment {
  id: string;
  /** File name, shown on the chip and in the remove button's label. */
  name: string;
  /** Second line, e.g. "PDF · 2.4 MB". */
  meta?: ReactNode;
  /** Thumbnail for images. Without it the chip shows a document icon. */
  previewUrl?: string;
  /** `uploading` shows a spinner; `error` marks the chip and shows `meta` as the error. */
  status?: 'ready' | 'uploading' | 'error';
}

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
  /** Tools on the left of the toolbar, after the attach button: `ChatInputAction`s, a model picker… */
  actions?: ReactNode;
  /** Files already attached, shown as chips above the text. */
  attachments?: ChatInputAttachment[];
  onRemoveAttachment?: (id: string) => void;
  /** Adds an attach button and accepts dropped or pasted files. Called with the chosen files. */
  onAttachFiles?: (files: File[]) => void;
  /** File types for the attach picker, e.g. "image/*,.pdf". */
  accept?: string;
  attachLabel?: string;
  /** Adds a microphone button before send. */
  onVoice?: () => void;
  /** Shows the microphone as active (pressed) while dictating. */
  listening?: boolean;
  voiceLabel?: string;
  /** The textarea grows with its content up to this many rows, then scrolls. */
  maxRows?: number;
  /** Show a character counter; requires `maxLength`. */
  showCount?: boolean;
  sendLabel?: string;
  stopLabel?: string;
  size?: ChatInputSize;
  variant?: ChatInputVariant;
}

const INTERACTIVE = 'button, a, input, select, [role="button"], [role="menuitem"], label';

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
    onPaste,
    generating = false,
    onStop,
    actions,
    attachments = [],
    onRemoveAttachment,
    onAttachFiles,
    accept,
    attachLabel = 'Attach files',
    onVoice,
    listening = false,
    voiceLabel = 'Dictate',
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
  const [dragging, setDragging] = useState(false);
  const text = value ?? internalValue;
  const uploading = attachments.some((a) => a.status === 'uploading');
  const hasContent = text.trim().length > 0 || attachments.length > 0;
  const canSend = !disabled && !generating && !uploading && hasContent;
  const acceptsFiles = Boolean(onAttachFiles) && !disabled;

  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
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

  const addFiles = (list: FileList | null | undefined) => {
    const files = list ? Array.from(list) : [];
    if (files.length && onAttachFiles) onAttachFiles(files);
  };

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    onPaste?.(event);
    if (!acceptsFiles || event.defaultPrevented || !event.clipboardData.files.length) return;
    event.preventDefault();
    addFiles(event.clipboardData.files);
  };

  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer.types).includes('Files');
  const dropProps = acceptsFiles
    ? {
        onDragOver: (event: DragEvent<HTMLDivElement>) => {
          if (!hasFiles(event)) return;
          event.preventDefault();
          setDragging(true);
        },
        onDragLeave: (event: DragEvent<HTMLDivElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
        },
        onDrop: (event: DragEvent<HTMLDivElement>) => {
          if (!hasFiles(event)) return;
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        },
      }
    : {};

  // Clicking the empty parts of the box focuses the text; toolbar controls keep their own clicks.
  const focusText = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target as HTMLElement).closest(INTERACTIVE)) innerRef.current?.focus();
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
      <div className="ds-chat-input__box" data-dragging={dragging || undefined} onClick={focusText} {...dropProps}>
        {attachments.length > 0 && (
          <ul className="ds-chat-input__attachments" aria-label="Attachments">
            {attachments.map((file) => (
              <li
                key={file.id}
                className={cx('ds-chat-input__attachment', file.status === 'error' && 'ds-chat-input__attachment--error')}
              >
                {file.previewUrl ? (
                  <img className="ds-chat-input__attachment-thumb" src={file.previewUrl} alt="" />
                ) : (
                  <span className="ds-chat-input__attachment-icon" aria-hidden="true">
                    {file.status === 'uploading' ? <Spinner size="sm" label="" /> : <Icon name="document-text" />}
                  </span>
                )}
                <span className="ds-chat-input__attachment-text">
                  <span className="ds-chat-input__attachment-name">{file.name}</span>
                  {(file.meta || file.status === 'uploading') && (
                    <span className="ds-chat-input__attachment-meta">
                      {file.status === 'uploading' && !file.meta ? 'Uploading…' : file.meta}
                    </span>
                  )}
                </span>
                {onRemoveAttachment && (
                  <button
                    type="button"
                    className="ds-chat-input__attachment-remove"
                    aria-label={`Remove ${file.name}`}
                    title={`Remove ${file.name}`}
                    disabled={disabled}
                    onClick={() => onRemoveAttachment(file.id)}
                  >
                    <Icon name="close" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
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
          onPaste={handlePaste}
          {...rest}
          aria-describedby={describedBy}
        />
        <div className="ds-chat-input__toolbar">
          <div className="ds-chat-input__actions">
            {onAttachFiles && (
              <>
                <ChatInputAction icon="add" label={attachLabel} disabled={disabled} onClick={() => fileRef.current?.click()} />
                <input
                  ref={fileRef}
                  type="file"
                  className="ds-visually-hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                  accept={accept}
                  multiple
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = '';
                  }}
                />
              </>
            )}
            {actions}
          </div>
          <div className="ds-chat-input__trailing">
            {countId && (
              <span id={countId} className="ds-chat-input__count" aria-live="polite">
                {text.length}/{maxLength}
              </span>
            )}
            {onVoice && (
              <ChatInputAction icon="microphone" label={voiceLabel} selected={listening} disabled={disabled} onClick={onVoice} />
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
                <Icon name="stop" />
              </button>
            ) : (
              <button
                type="submit"
                className="ds-chat-input__send"
                aria-label={sendLabel}
                title={sendLabel}
                disabled={!canSend}
              >
                <Icon name="arrow-up" />
              </button>
            )}
          </div>
        </div>
        {dragging && (
          <div className="ds-chat-input__drop" aria-hidden="true">
            <Icon name="cloud-upload" />
            Drop files to attach
          </div>
        )}
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

export interface ChatInputActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Accessible name; also the visible text when `showLabel` is set. */
  label: string;
  /** Show the label next to the icon (pill), e.g. "Search", "Deep research". */
  showLabel?: boolean;
  /** Makes it a toggle: sets aria-pressed and the selected look. */
  selected?: boolean;
  /** Trailing chevron, for a button that opens a menu (model picker). */
  menu?: boolean;
}

/** A tool button for the ChatInput toolbar: round icon button, or a labelled pill / toggle. */
export const ChatInputAction = forwardRef<HTMLButtonElement, ChatInputActionProps>(function ChatInputAction(
  { icon, label, showLabel = false, selected, menu = false, className, type = 'button', title, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'ds-chat-input__tool',
        (showLabel || menu) && 'ds-chat-input__tool--labelled',
        className,
      )}
      aria-label={showLabel ? undefined : label}
      title={title ?? (showLabel ? undefined : label)}
      aria-pressed={selected}
      {...rest}
    >
      <Icon name={icon} className="ds-chat-input__tool-icon" />
      {showLabel && <span className="ds-chat-input__tool-label">{label}</span>}
      {menu && <Icon name="alt-arrow-down" className="ds-chat-input__tool-chevron" />}
    </button>
  );
});
