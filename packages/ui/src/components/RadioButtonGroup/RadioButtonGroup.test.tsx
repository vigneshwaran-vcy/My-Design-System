import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RadioButtonGroup, type RadioButtonOption } from './RadioButtonGroup';

const options: RadioButtonOption[] = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week', disabled: true },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

describe('RadioButtonGroup', () => {
  it('renders a labelled radiogroup with radios', () => {
    render(<RadioButtonGroup label="Period" options={options} defaultValue="month" />);
    expect(screen.getByRole('radiogroup', { name: 'Period' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'false');
  });

  it('uses a roving tabindex and arrow keys select, skipping disabled options and wrapping', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioButtonGroup label="Period" options={options} defaultValue="day" onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Month' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('month');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Year' })).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: 'Year' })).toHaveAttribute('aria-checked', 'true');
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('selects on click and ignores disabled options', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioButtonGroup label="Period" options={options} onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Week' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('radio', { name: 'Year' }));
    expect(onChange).toHaveBeenCalledWith('year');
  });

  it('stays controlled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<RadioButtonGroup label="Period" options={options} value="day" onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Month' }));
    expect(onChange).toHaveBeenCalledWith('month');
    expect(screen.getByRole('radio', { name: 'Day' })).toHaveAttribute('aria-checked', 'true');
  });

  it('disables the whole group, wires errors, submits a name and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <RadioButtonGroup ref={ref} label="Period" options={options} defaultValue="day" disabled error="Pick one" name="period" size="sm" />,
    );
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Pick one');
    expect(container.querySelector('input[name="period"]')).toHaveValue('day');
    expect(ref.current).toHaveClass('ds-radio-button-group--sm');
  });

  it('names icon-only options by their label', () => {
    render(
      <RadioButtonGroup
        label="View"
        options={[
          { value: 'list', label: 'List view', icon: 'list', iconOnly: true },
          { value: 'grid', label: 'Grid view', icon: 'widget', iconOnly: true },
        ]}
      />,
    );
    expect(screen.getByRole('radio', { name: 'Grid view' })).toBeInTheDocument();
  });
});
