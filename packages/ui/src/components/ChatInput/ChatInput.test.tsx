import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ChatInput } from './ChatInput';

describe('ChatInput', () => {
  it('renders a labelled textarea with a disabled send button when empty', () => {
    render(<ChatInput />);
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('sends the trimmed message on Enter and clears itself', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    const box = screen.getByRole('textbox');
    await user.type(box, '  Hello there  {Enter}');
    expect(onSubmit).toHaveBeenCalledWith('Hello there');
    expect(box).toHaveValue('');
  });

  it('inserts a newline on Shift+Enter instead of sending', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    const box = screen.getByRole('textbox');
    await user.type(box, 'line 1{Shift>}{Enter}{/Shift}line 2');
    expect(onSubmit).not.toHaveBeenCalled();
    expect(box).toHaveValue('line 1\nline 2');
  });

  it('sends with the send button', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    await user.type(screen.getByRole('textbox'), 'Hi');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledWith('Hi');
  });

  it('does not send whitespace-only messages', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ChatInput onSubmit={onSubmit} />);
    await user.type(screen.getByRole('textbox'), '   {Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows a stop button and blocks sending while generating', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(<ChatInput generating onStop={onStop} onSubmit={onSubmit} defaultValue="draft" />);
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
    await user.type(screen.getByRole('textbox'), '{Enter}');
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Stop generating' }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it('works as a controlled input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ChatInput value="fixed" onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'x');
    expect(onChange).toHaveBeenCalled();
    expect(screen.getByRole('textbox')).toHaveValue('fixed');
  });

  it('shows a character counter', async () => {
    const user = userEvent.setup();
    render(<ChatInput maxLength={10} showCount />);
    await user.type(screen.getByRole('textbox'), 'abc');
    expect(screen.getByText('3/10')).toBeInTheDocument();
  });

  it('announces hint and error and marks itself invalid', () => {
    render(<ChatInput hint="Enter to send" error="Failed" />);
    const box = screen.getByRole('textbox');
    expect(box).toBeInvalid();
    expect(box).toHaveAccessibleDescription('Enter to send Failed');
    expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  });

  it('cannot be used when disabled', async () => {
    const user = userEvent.setup();
    render(<ChatInput disabled />);
    await user.type(screen.getByRole('textbox'), 'x');
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('applies size and variant classes, renders actions and forwards refs', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <ChatInput ref={ref} size="lg" variant="filled" actions={<button type="button">Attach</button>} />,
    );
    expect(ref.current).toBe(screen.getByRole('textbox'));
    expect(container.firstChild).toHaveClass('ds-chat-input--lg', 'ds-chat-input--filled');
    expect(screen.getByRole('button', { name: 'Attach' })).toBeInTheDocument();
  });
});
