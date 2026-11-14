import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders a labelled slider with range attributes', () => {
    render(<Slider label="Volume" min={10} max={90} step={5} defaultValue={30} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '90');
    expect(slider).toHaveAttribute('step', '5');
    expect(slider).toHaveValue('30');
  });

  it('supports arrows, PageUp/PageDown, Home and End', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider label="Volume" defaultValue={50} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    await user.tab();
    expect(slider).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(slider).toHaveValue('51');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(slider).toHaveValue('49');
    await user.keyboard('{PageUp}');
    expect(slider).toHaveValue('59');
    await user.keyboard('{PageDown}');
    expect(slider).toHaveValue('49');
    await user.keyboard('{End}');
    expect(slider).toHaveValue('100');
    await user.keyboard('{Home}');
    expect(slider).toHaveValue('0');
    expect(onChange).toHaveBeenLastCalledWith(0, expect.anything());
  });

  it('snaps to step and clamps to the range', async () => {
    const user = userEvent.setup();
    render(<Slider label="Opacity" min={0} max={1} step={0.1} defaultValue={0.9} />);
    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(slider).toHaveValue('1');
    await user.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(slider).toHaveValue('0.7');
  });

  it('works controlled and via pointer change events', () => {
    function Controlled() {
      const [value, setValue] = useState(20);
      return <Slider label="Level" value={value} onChange={setValue} showValue formatValue={(v) => `${v}%`} />;
    }
    render(<Controlled />);
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '65' } });
    expect(slider).toHaveValue('65');
    expect(slider).toHaveAttribute('aria-valuetext', '65%');
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('ignores keys when disabled and marks errors', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Slider label="Volume" defaultValue={10} disabled error="Too low" onChange={onChange} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
    expect(slider).toHaveAttribute('aria-invalid', 'true');
    expect(slider).toHaveAccessibleDescription('Too low');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    await user.keyboard('{ArrowRight}');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Slider ref={ref} label="Volume" size="lg" variant="neutral" />);
    expect(ref.current).toBe(screen.getByRole('slider'));
    expect(ref.current?.closest('.ds-slider')).toHaveClass('ds-slider--lg', 'ds-slider--neutral');
  });
});
