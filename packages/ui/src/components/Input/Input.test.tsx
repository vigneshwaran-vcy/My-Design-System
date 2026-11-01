import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input', () => {
    render(<Input label="Email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('keeps a hidden label available to screen readers', () => {
    render(<Input label="Search" hideLabel />);
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('describes the input with its hint', () => {
    render(<Input label="Email" hint="Work address" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Work address');
  });

  it('marks the input invalid and announces the error', () => {
    render(<Input label="Email" hint="Work address" error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Work address Required');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('accepts typing and keyboard focus', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);
    await user.tab();
    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
    await user.keyboard('Ada');
    expect(input).toHaveValue('Ada');
  });

  it('cannot be edited when disabled', async () => {
    const user = userEvent.setup();
    render(<Input label="Name" disabled />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'x');
    expect(input).toBeDisabled();
    expect(input).toHaveValue('');
  });

  it('applies size and variant classes and forwards refs', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} label="Name" size="lg" variant="filled" required />);
    expect(ref.current).toHaveClass('ds-input--lg', 'ds-input--filled');
    expect(ref.current).toBeRequired();
  });
});
