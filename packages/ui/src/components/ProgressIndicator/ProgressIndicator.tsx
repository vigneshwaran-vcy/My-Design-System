import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../Icon';
import './ProgressIndicator.css';

export type ProgressStepStatus = 'completed' | 'current' | 'upcoming' | 'error';
export type ProgressIndicatorOrientation = 'horizontal' | 'vertical';
export type ProgressIndicatorVariant = 'default' | 'framed';
export type ProgressIndicatorSize = 'sm' | 'md';

export interface ProgressStep {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  /** Overrides the status derived from `currentStep` (e.g. `error`). */
  status?: ProgressStepStatus;
  /** Prevents a completed step from being clickable. */
  disabled?: boolean;
}

const DEFAULT_STATUS_LABELS: Record<ProgressStepStatus, string> = {
  completed: 'Completed',
  current: 'Current step',
  upcoming: 'Not started',
  error: 'Error',
};

export interface ProgressIndicatorProps extends Omit<HTMLAttributes<HTMLOListElement>, 'onChange'> {
  steps: ProgressStep[];
  /** Id of the current step. Steps before it are completed, steps after it upcoming. */
  currentStep?: string;
  orientation?: ProgressIndicatorOrientation;
  /** `default` = bare; `framed` = sits in a tinted frame. */
  variant?: ProgressIndicatorVariant;
  size?: ProgressIndicatorSize;
  /** Makes completed (and errored) steps buttons that call this, e.g. to go back. */
  onStepClick?: (id: string, index: number) => void;
  /** Screen-reader text appended to each step's name, per status. */
  statusLabels?: Partial<Record<ProgressStepStatus, string>>;
}

/** Stepper showing progress through a multi-step flow. The current step has aria-current="step". */
export const ProgressIndicator = forwardRef<HTMLOListElement, ProgressIndicatorProps>(function ProgressIndicator(
  {
    steps,
    currentStep,
    orientation = 'horizontal',
    variant = 'default',
    size = 'md',
    onStepClick,
    statusLabels,
    className,
    'aria-label': ariaLabel = 'Progress',
    ...rest
  },
  ref,
) {
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };
  const currentIndex = currentStep === undefined ? -1 : steps.findIndex((s) => s.id === currentStep);

  return (
    <ol
      ref={ref}
      aria-label={ariaLabel}
      className={cx(
        'ds-progress-indicator',
        `ds-progress-indicator--${orientation}`,
        `ds-progress-indicator--${variant}`,
        `ds-progress-indicator--${size}`,
        className,
      )}
      data-orientation={orientation}
      {...rest}
    >
      {steps.map((step, index) => {
        const status: ProgressStepStatus =
          step.status ??
          (currentIndex < 0 ? 'upcoming' : index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming');
        const clickable = !!onStepClick && !step.disabled && (status === 'completed' || status === 'error');
        const marker =
          status === 'completed' ? (
            <Icon name="check" />
          ) : status === 'error' ? (
            <Icon name="alert" />
          ) : status === 'current' ? (
            <span className="ds-progress-indicator__dot" />
          ) : (
            <span className="ds-progress-indicator__number">{index + 1}</span>
          );
        const inner = (
          <>
            <span className="ds-progress-indicator__marker" aria-hidden="true">
              {marker}
            </span>
            <span className="ds-progress-indicator__text">
              <span className="ds-progress-indicator__label">
                {step.label}
                <span className="ds-progress-indicator__sr">, {labels[status]}</span>
              </span>
              {step.description && <span className="ds-progress-indicator__description">{step.description}</span>}
            </span>
          </>
        );
        return (
          <li
            key={step.id}
            className={cx('ds-progress-indicator__step', `ds-progress-indicator__step--${status}`)}
            aria-current={status === 'current' ? 'step' : undefined}
            data-status={status}
          >
            {clickable ? (
              <button type="button" className="ds-progress-indicator__target" onClick={() => onStepClick?.(step.id, index)}>
                {inner}
              </button>
            ) : (
              <div className="ds-progress-indicator__target">{inner}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
});
