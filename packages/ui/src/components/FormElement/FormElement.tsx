import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import '../Input/Input.css';
import './FormElement.css';

export type FormElementSize = 'sm' | 'md' | 'lg';
export type FormElementLayout = 'stacked' | 'horizontal';

/** Props FormElement wires onto its control. Spread them onto the focusable element. */
export interface FormElementControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

export interface FormElementRenderMeta {
  /** Id of the visible label, for controls that are not labelable elements (use with aria-labelledby). */
  labelId: string;
  invalid: boolean;
  disabled: boolean;
}

type ChildProps = Partial<FormElementControlProps> & Record<string, unknown>;

export interface FormElementProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label. Required for accessibility; use `hideLabel` to keep it screen-reader only. */
  label: ReactNode;
  hideLabel?: boolean;
  /** Shows a red `*` and sets aria-required on the control. */
  required?: boolean;
  /** Help text under the control, linked via aria-describedby. */
  hint?: ReactNode;
  /** Short text shown in a tooltip from an info button next to the label. */
  inlineHelp?: ReactNode;
  /** Accessible name of the inline help button. */
  inlineHelpLabel?: string;
  /** Error message. When set, the control is marked invalid and the message is announced. */
  error?: ReactNode;
  /** `stacked` puts the label above the control; `horizontal` puts it in a column to the left. */
  layout?: FormElementLayout;
  /** Label size and the row height the horizontal label aligns to (matches control sizes). */
  size?: FormElementSize;
  disabled?: boolean;
  /** Id for the control. Generated when omitted (or taken from the child's own `id`). */
  controlId?: string;
  /**
   * The control. A single element is cloned to receive `id`, `aria-describedby`, `aria-invalid` and
   * `aria-required`; a function receives those props (plus `labelId`) to spread wherever they belong.
   */
  children: ReactElement<ChildProps> | ((props: FormElementControlProps, meta: FormElementRenderMeta) => ReactNode);
}

/** Generic field wrapper: label, required marker, inline help, help text and error around any control. */
export const FormElement = forwardRef<HTMLDivElement, FormElementProps>(function FormElement(
  {
    label,
    hideLabel = false,
    required = false,
    hint,
    inlineHelp,
    inlineHelpLabel = 'More information',
    error,
    layout = 'stacked',
    size = 'md',
    disabled = false,
    controlId,
    className,
    children,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const childId = typeof children !== 'function' && isValidElement(children) ? (children.props.id as string | undefined) : undefined;
  const id = controlId ?? childId ?? `ds-form-element-${autoId}`;
  const labelId = `${id}-label`;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const invalid = Boolean(error);

  const childDescribedBy = typeof children !== 'function' ? (children.props['aria-describedby'] as string | undefined) : undefined;
  const describedBy = [childDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined;

  const controlProps: FormElementControlProps = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': invalid ? true : undefined,
    'aria-required': required ? true : undefined,
  };

  const control =
    typeof children === 'function'
      ? children(controlProps, { labelId, invalid, disabled })
      : cloneElement(children, {
          ...controlProps,
          'aria-invalid': controlProps['aria-invalid'] ?? children.props['aria-invalid'],
          'aria-required': controlProps['aria-required'] ?? children.props['aria-required'],
        } as ChildProps);

  return (
    <div
      ref={ref}
      className={cx(
        'ds-field',
        'ds-form-element',
        `ds-form-element--${layout}`,
        `ds-form-element--${size}`,
        invalid && 'ds-form-element--invalid',
        disabled && 'ds-field--disabled',
        className,
      )}
      {...rest}
    >
      <div className={cx('ds-form-element__label-row', hideLabel && 'ds-visually-hidden')}>
        <label id={labelId} htmlFor={id} className="ds-field__label ds-form-element__label">
          {label}
          {required && (
            <abbr className="ds-field__required ds-form-element__required" title="required" aria-hidden="true">
              *
            </abbr>
          )}
        </label>
        {inlineHelp && (
          <Tooltip content={inlineHelp} placement="top">
            <button type="button" className="ds-form-element__help" aria-label={inlineHelpLabel}>
              <Icon name="info-circle" />
            </button>
          </Tooltip>
        )}
      </div>
      <div className="ds-form-element__body">
        <div className="ds-form-element__control">{control}</div>
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
    </div>
  );
});
