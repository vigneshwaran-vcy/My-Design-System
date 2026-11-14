import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../../utils/cx';
import '../Input/Input.css';
import './Textarea.css';

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaVariant = 'outline' | 'filled';
export type TextareaResize = 'none' | 'vertical';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  hint?: ReactNode;
  /** Error message. When set, the field is marked invalid and the message is announced. */
  error?: ReactNode;
  size?: TextareaSize;
  variant?: TextareaVariant;
  /** Grows with the content (up to `maxRows`) instead of scrolling. Disables manual resizing. */
  autoResize?: boolean;
  /** Upper bound for `autoResize`, in rows. Unlimited when omitted. */
  maxRows?: number;
  /** Shows the character count; pairs with `maxLength` as `n / max`. */
  showCount?: boolean;
  /** Whether the user can drag the corner to resize. */
  resize?: TextareaResize;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hideLabel = false,
    hint,
    error,
    size = 'md',
    variant = 'outline',
    rows = 3,
    autoResize = false,
    maxRows,
    maxLength,
    showCount = false,
    resize = 'vertical',
    id,
    className,
    required,
    disabled,
    value,
    defaultValue,
    onChange,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const textareaId = id ?? `ds-textarea-${autoId}`;
  const hintId = hint ? `${textareaId}-hint` : undefined;
  const errorId = error ? `${textareaId}-error` : undefined;
  const countId = showCount ? `${textareaId}-count` : undefined;
  const describedBy = [rest['aria-describedby'], hintId, errorId, countId].filter(Boolean).join(' ') || undefined;

  // Track the length for the counter when uncontrolled.
  const [internalValue, setInternalValue] = useState(() => String(defaultValue ?? ''));
  const text = value !== undefined ? String(value ?? '') : internalValue;
  const length = text.length;
  const over = maxLength !== undefined && length > maxLength;

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
    if (!el || !autoResize) return;
    const style = getComputedStyle(el);
    const px = (value: string) => parseFloat(value) || 0;
    // Computed styles can be empty in non-layout environments; fall back to a sane line height.
    const lineHeight = px(style.lineHeight) || (px(style.fontSize) || 16) * 1.5;
    const padding = px(style.paddingTop) + px(style.paddingBottom);
    const border = px(style.borderTopWidth) + px(style.borderBottomWidth);
    const min = lineHeight * rows + padding + border;
    const max = maxRows ? lineHeight * maxRows + padding + border : Infinity;
    el.style.height = 'auto';
    const next = Math.min(Math.max(el.scrollHeight + border, min), max);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight + border > max ? 'auto' : 'hidden';
  }, [text, autoResize, rows, maxRows]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (value === undefined) setInternalValue(event.target.value);
    onChange?.(event);
  };

  const showMeta = Boolean(hint || error || showCount);

  return (
    <div className={cx('ds-field', 'ds-textarea-field', disabled && 'ds-field--disabled', className)}>
      <label htmlFor={textareaId} className={cx('ds-field__label', hideLabel && 'ds-visually-hidden')}>
        {label}
        {required && <span className="ds-field__required" aria-hidden="true"> *</span>}
      </label>
      <textarea
        ref={setRefs}
        id={textareaId}
        className={cx(
          'ds-textarea',
          `ds-textarea--${variant}`,
          `ds-textarea--${size}`,
          error && 'ds-textarea--invalid',
          (resize === 'none' || autoResize) && 'ds-textarea--resize-none',
          autoResize && 'ds-textarea--auto-resize',
        )}
        rows={rows}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        {...rest}
        aria-describedby={describedBy}
        onChange={handleChange}
      />
      {showMeta && (
        <div className="ds-textarea__meta">
          <div className="ds-textarea__messages">
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
          {showCount && (
            <span id={countId} className={cx('ds-textarea__count', over && 'ds-textarea__count--over')}>
              {maxLength !== undefined ? `${length} / ${maxLength}` : length}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
