import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProgressIndicator, type ProgressStep } from './ProgressIndicator';

const steps: ProgressStep[] = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profile', description: 'Name and photo' },
  { id: 'billing', label: 'Billing' },
  { id: 'review', label: 'Review' },
];

describe('ProgressIndicator', () => {
  it('renders an ordered list with derived statuses and aria-current="step"', () => {
    const { container } = render(<ProgressIndicator steps={steps} currentStep="billing" />);
    const list = screen.getByRole('list', { name: 'Progress' });
    expect(list.tagName).toBe('OL');
    const items = screen.getAllByRole('listitem');
    expect(items.map((i) => i.getAttribute('data-status'))).toEqual(['completed', 'completed', 'current', 'upcoming']);
    expect(items[2]).toHaveAttribute('aria-current', 'step');
    expect(items.filter((i) => i.hasAttribute('aria-current'))).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Account, Completed');
    expect(items[3]).toHaveTextContent('Review, Not started');
    expect(container.querySelector('[data-icon="check"]')).toBeInTheDocument();
    container.querySelectorAll('.ds-progress-indicator__marker').forEach((m) => expect(m).toHaveAttribute('aria-hidden', 'true'));
  });

  it('honours an explicit error status with its own label', () => {
    const { container } = render(
      <ProgressIndicator steps={[steps[0], { ...steps[1], status: 'error' }, steps[2]]} currentStep="billing" statusLabels={{ error: 'Needs attention' }} />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[1]).toHaveAttribute('data-status', 'error');
    expect(items[1]).toHaveTextContent('Profile, Needs attention');
    expect(container.querySelector('[data-icon="alert"]')).toBeInTheDocument();
  });

  it('is static by default (no buttons)', () => {
    render(<ProgressIndicator steps={steps} currentStep="review" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('makes completed steps clickable and keyboard operable with onStepClick', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <ProgressIndicator steps={[steps[0], { ...steps[1], disabled: true }, steps[2], steps[3]]} currentStep="billing" onStepClick={onStepClick} />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(1);
    await user.click(buttons[0]);
    expect(onStepClick).toHaveBeenCalledWith('account', 0);
    buttons[0].blur();
    await user.tab();
    expect(buttons[0]).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onStepClick).toHaveBeenCalledTimes(2);
  });

  it('treats every step as upcoming without a currentStep', () => {
    render(<ProgressIndicator steps={steps} />);
    screen.getAllByRole('listitem').forEach((i) => expect(i).toHaveAttribute('data-status', 'upcoming'));
  });

  it('applies orientation, variant and size classes, a custom label, and forwards refs', () => {
    const ref = createRef<HTMLOListElement>();
    render(
      <ProgressIndicator ref={ref} steps={steps} orientation="vertical" variant="framed" size="sm" aria-label="Checkout" className="x" />,
    );
    expect(ref.current).toBe(screen.getByRole('list', { name: 'Checkout' }));
    expect(ref.current).toHaveClass(
      'ds-progress-indicator',
      'ds-progress-indicator--vertical',
      'ds-progress-indicator--framed',
      'ds-progress-indicator--sm',
      'x',
    );
  });
});
