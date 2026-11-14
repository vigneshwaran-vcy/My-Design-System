import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { useControllableState } from '../../utils/useControllableState';
import { Button } from '../Button';
import { Icon } from '../Icon';
import '../Input/Input.css';
import './FileSelector.css';

export type FileSelectorSize = 'sm' | 'md' | 'lg';
export type FileSelectorVariant = 'dropzone' | 'inline';

export interface FileSelectorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  /** Controlled list of selected files. */
  files?: File[];
  defaultFiles?: File[];
  onChange?: (files: File[]) => void;
  /** Called with dropped files that do not match `accept`. */
  onReject?: (files: File[]) => void;
  /** Text of the browse button. */
  buttonLabel?: string;
  /** Text next to the button. */
  dropLabel?: ReactNode;
  /** Hide the list of selected files (render your own). */
  hideFileList?: boolean;
  size?: FileSelectorSize;
  /** `dropzone` = framed drop area with an upload icon tile; `inline` = a compact row. */
  variant?: FileSelectorVariant;
}

/** Does `file` match an `accept` string like "image/*,.pdf,application/json"? */
export function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return accept
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

const UNITS = ['B', 'KB', 'MB', 'GB'];
const formatBytes = (bytes: number) => {
  let n = bytes;
  let unit = 0;
  while (n >= 1024 && unit < UNITS.length - 1) {
    n /= 1024;
    unit += 1;
  }
  return `${unit === 0 ? n : n.toFixed(1)} ${UNITS[unit]}`;
};

const fileKey = (file: File) => `${file.name}-${file.size}-${file.lastModified}`;

/**
 * File picker with a drop zone. A visually hidden native file input does the picking (the ref goes to it);
 * a Button opens it and files can also be dropped onto the zone. Selected files are listed with remove buttons.
 */
export const FileSelector = forwardRef<HTMLInputElement, FileSelectorProps>(function FileSelector(
  {
    label,
    hideLabel = false,
    hint,
    error,
    files: filesProp,
    defaultFiles = [],
    onChange,
    onReject,
    buttonLabel,
    dropLabel = 'or drop files here',
    hideFileList = false,
    size = 'md',
    variant = 'dropzone',
    accept,
    multiple = false,
    disabled,
    required,
    id,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? `ds-file-selector-${autoId}`;
  const labelId = `${inputId}-label`;
  const buttonId = `${inputId}-button`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  const [files, setFiles] = useControllableState<File[]>(filesProp, defaultFiles, onChange);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const add = (incoming: File[]) => {
    if (!incoming.length) return;
    if (!multiple) {
      setFiles([incoming[0]]);
      return;
    }
    const seen = new Set(files.map(fileKey));
    setFiles([...files, ...incoming.filter((f) => !seen.has(fileKey(f)))]);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    add([...(event.target.files ?? [])]);
    // Reset so picking the same file again still fires change.
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;
    const dropped = [...(event.dataTransfer?.files ?? [])];
    const accepted = dropped.filter((f) => fileMatchesAccept(f, accept));
    const rejected = dropped.filter((f) => !fileMatchesAccept(f, accept));
    if (rejected.length) onReject?.(rejected);
    add(accepted);
  };

  const remove = (file: File) => {
    setFiles(files.filter((f) => f !== file));
    document.getElementById(buttonId)?.focus();
  };

  const text = buttonLabel ?? (multiple ? 'Upload files' : 'Upload file');

  return (
    <div
      className={cx(
        'ds-field',
        'ds-file-selector',
        `ds-file-selector--${variant}`,
        `ds-file-selector--${size}`,
        error && 'ds-file-selector--invalid',
        disabled && 'ds-field--disabled',
        className,
      )}
    >
      <span id={labelId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </span>
      <div
        className={cx(
          'ds-file-selector__zone',
          dragging && 'ds-file-selector__zone--dragging',
          disabled && 'ds-file-selector__zone--disabled',
        )}
        data-dragging={dragging || undefined}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) return;
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
        }}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={handleDrop}
      >
        <input
          ref={setRefs}
          id={inputId}
          type="file"
          className="ds-visually-hidden"
          tabIndex={-1}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required && files.length === 0}
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          onChange={handleInput}
          {...rest}
          aria-describedby={describedBy}
        />
        {variant === 'dropzone' && (
          <span className="ds-file-selector__tile" aria-hidden="true">
            <Icon name="cloud-upload" />
          </span>
        )}
        <Button
          id={buttonId}
          variant="secondary"
          size={size === 'lg' ? 'md' : 'sm'}
          leadingIcon={variant === 'inline' ? <Icon name="upload" /> : undefined}
          disabled={disabled}
          aria-labelledby={`${buttonId} ${labelId}`}
          aria-describedby={describedBy}
          onClick={() => inputRef.current?.click()}
        >
          {text}
        </Button>
        <span className="ds-file-selector__drop-label">{dropLabel}</span>
      </div>

      {!hideFileList && files.length > 0 && (
        <ul className="ds-file-selector__list" aria-label="Selected files">
          {files.map((file) => (
            <li key={fileKey(file)} className="ds-file-selector__file">
              <span className="ds-file-selector__file-icon" aria-hidden="true">
                <Icon name="file-text" />
              </span>
              <span className="ds-file-selector__file-text">
                <span className="ds-file-selector__file-name">{file.name}</span>
                <span className="ds-file-selector__file-size">{formatBytes(file.size)}</span>
              </span>
              <Button
                variant="ghost"
                size="xs"
                className="ds-file-selector__remove"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
                onClick={() => remove(file)}
              >
                <Icon name="close" />
              </Button>
            </li>
          ))}
        </ul>
      )}
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
