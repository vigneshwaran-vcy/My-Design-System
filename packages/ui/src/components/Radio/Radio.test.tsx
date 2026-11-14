import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from './Radio';

function Plans(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup label="Plan" {...props}>
      <Radio value="free" label="Free" description="For personal projects" />
      <Radio value="team" label="Team" />
      <Radio value="enterprise" label="Enterprise" disabled />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders a labelled radiogroup with native radios sharing a name', () => {
    render(<Plans />);
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    const names = new Set(radios.map((r) => r.getAttribute('name')));
    expect(names.size).toBe(1);
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveAccessibleDescription('For personal projects');
  });

  it('uses the provided name and keeps a hidden label accessible', () => {
    render(<Plans name="plan" hideLabel />);
    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveAttribute('name', 'plan');
  });

  it('describes the group with hint and error, and marks radios invalid', () => {
    render(<Plans hint="Pick one" error="Required" />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Pick one Required');
    expect(screen.getByRole('radiogroup')).toBeInvalid();
    expect(screen.getByRole('radio', { name: 'Team' })).toBeInvalid();
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('selects uncontrolled and reports the value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Plans defaultValue="free" onChange={onChange} />);
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    await user.click(screen.getByText('Team'));
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith('team', expect.anything());
  });

  it('respects a controlled value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Plans value="free" onChange={onChange} />);
    await user.click(screen.getByRole('radio', { name: 'Team' }));
    expect(onChange).toHaveBeenCalledWith('team', expect.anything());
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Team' })).not.toBeChecked();
  });

  it('works with a controlled parent', async () => {
    const user = userEvent.setup();
    function Form() {
      const [value, setValue] = useState<string | null>(null);
      return <Plans value={value} onChange={setValue} hint={value ?? 'none'} />;
    }
    render(<Form />);
    await user.click(screen.getByRole('radio', { name: 'Team' }));
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(screen.getByText('team')).toBeInTheDocument();
  });

  it('moves selection with the arrow keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Plans defaultValue="free" onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Team' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Team' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('team', expect.anything());
  });

  it('disables every radio when the group is disabled, and single options individually', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Plans onChange={onChange} />);
    const enterprise = screen.getByRole('radio', { name: 'Enterprise' });
    expect(enterprise).toBeDisabled();
    await user.click(enterprise);
    expect(onChange).not.toHaveBeenCalled();

    rerender(<Plans disabled onChange={onChange} />);
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
  });

  it('applies orientation and size classes and forwards refs', () => {
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLInputElement>();
    render(
      <RadioGroup ref={groupRef} label="Plan" orientation="horizontal" size="sm" className="extra">
        <Radio ref={radioRef} value="free" label="Free" />
      </RadioGroup>,
    );
    expect(groupRef.current).toHaveClass('ds-radio-group', 'ds-radio-group--horizontal', 'extra');
    expect(radioRef.current).toHaveAttribute('type', 'radio');
    expect(radioRef.current?.closest('.ds-radio')).toHaveClass('ds-radio--sm');
  });
});
