import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('associates the label with the textarea', () => {
    render(<Textarea label="Message" />);
    const field = screen.getByRole('textbox', { name: 'Message' });
    expect(field.tagName).toBe('TEXTAREA');
    expect(field).toHaveAttribute('rows', '3');
  });

  it('keeps a hidden label available to screen readers', () => {
    render(<Textarea label="Notes" hideLabel />);
    expect(screen.getByRole('textbox', { name: 'Notes' })).toBeInTheDocument();
  });

  it('describes the textarea with its hint', () => {
    render(<Textarea label="Message" hint="Markdown supported" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Markdown supported');
  });

  it('marks the textarea invalid and announces the error', () => {
    render(<Textarea label="Message" hint="Markdown supported" error="Required" />);
    const field = screen.getByRole('textbox');
    expect(field).toBeInvalid();
    expect(field).toHaveAccessibleDescription('Markdown supported Required');
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('accepts typing and keyboard focus (uncontrolled)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea label="Message" onChange={onChange} />);
    await user.tab();
    const field = screen.getByRole('textbox');
    expect(field).toHaveFocus();
    await user.keyboard('Hi');
    expect(field).toHaveValue('Hi');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('respects a controlled value', async () => {
    const user = userEvent.setup();
    function Form() {
      const [text, setText] = useState('a');
      return <Textarea label="Message" value={text} onChange={(e) => setText(e.target.value.toUpperCase())} />;
    }
    render(<Form />);
    const field = screen.getByRole('textbox');
    await user.type(field, 'b');
    expect(field).toHaveValue('AB');
  });

  it('shows the character count and flags overflow', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Textarea label="Bio" maxLength={5} showCount defaultValue="abc" />);
    const field = screen.getByRole('textbox');
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
    expect(field).toHaveAccessibleDescription('3 / 5');
    await user.type(field, 'de');
    expect(screen.getByText('5 / 5')).toBeInTheDocument();
    expect(screen.getByText('5 / 5')).not.toHaveClass('ds-textarea__count--over');

    rerender(<Textarea label="Bio" maxLength={5} showCount value="toolong" onChange={() => {}} />);
    expect(screen.getByText('7 / 5')).toHaveClass('ds-textarea__count--over');
  });

  it('cannot be edited when disabled', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Message" disabled />);
    const field = screen.getByRole('textbox');
    await user.type(field, 'x');
    expect(field).toBeDisabled();
    expect(field).toHaveValue('');
  });

  it('applies size, variant and resize classes and forwards refs', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="Message" size="lg" variant="filled" resize="none" required />);
    expect(ref.current).toHaveClass('ds-textarea--lg', 'ds-textarea--filled', 'ds-textarea--resize-none');
    expect(ref.current).toBeRequired();
  });

  it('sets an explicit height and disables manual resizing when autoResize is on', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="Message" autoResize maxRows={4} defaultValue="one\ntwo" />);
    expect(ref.current).toHaveClass('ds-textarea--auto-resize', 'ds-textarea--resize-none');
    expect(ref.current?.style.height).toMatch(/px$/);
  });
});
