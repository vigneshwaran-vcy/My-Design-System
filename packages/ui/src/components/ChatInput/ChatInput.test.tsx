import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ChatInput, ChatInputAction } from './ChatInput';

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

  it('opens the file picker from the attach button and reports chosen files', async () => {
    const user = userEvent.setup();
    const onAttachFiles = vi.fn();
    const { container } = render(<ChatInput onAttachFiles={onAttachFiles} accept="image/*" />);
    expect(screen.getByRole('button', { name: 'Attach files' })).toBeInTheDocument();
    const picker = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(picker).toHaveAttribute('accept', 'image/*');
    const file = new File(['x'], 'photo.png', { type: 'image/png' });
    await user.upload(picker, file);
    expect(onAttachFiles).toHaveBeenCalledWith([file]);
  });

  it('accepts dropped files and shows a drop hint while dragging', () => {
    const onAttachFiles = vi.fn();
    const { container } = render(<ChatInput onAttachFiles={onAttachFiles} />);
    const box = container.querySelector('.ds-chat-input__box') as HTMLElement;
    const file = new File(['x'], 'a.png', { type: 'image/png' });
    const dataTransfer = { types: ['Files'], files: [file] };
    fireEvent.dragOver(box, { dataTransfer });
    expect(box).toHaveAttribute('data-dragging');
    expect(screen.getByText('Drop files to attach')).toBeInTheDocument();
    fireEvent.drop(box, { dataTransfer });
    expect(onAttachFiles).toHaveBeenCalledWith([file]);
    expect(box).not.toHaveAttribute('data-dragging');
  });

  it('lists attachments, removes them, and lets a file alone be sent', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onSubmit = vi.fn();
    render(
      <ChatInput
        onSubmit={onSubmit}
        onRemoveAttachment={onRemove}
        attachments={[{ id: '1', name: 'Q1 plan.pdf', meta: 'PDF · 2.4 MB' }]}
      />,
    );
    const list = screen.getByRole('list', { name: 'Attachments' });
    expect(within(list).getByText('Q1 plan.pdf')).toBeInTheDocument();
    expect(within(list).getByText('PDF · 2.4 MB')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Q1 plan.pdf' }));
    expect(onRemove).toHaveBeenCalledWith('1');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(onSubmit).toHaveBeenCalledWith('');
  });

  it('blocks sending while an attachment is uploading', async () => {
    const user = userEvent.setup();
    render(<ChatInput attachments={[{ id: '1', name: 'big.zip', status: 'uploading' }]} />);
    expect(screen.getByText('Uploading…')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox'), 'hi');
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('shows a voice toggle that reflects listening', async () => {
    const user = userEvent.setup();
    const onVoice = vi.fn();
    const { rerender } = render(<ChatInput onVoice={onVoice} />);
    const mic = screen.getByRole('button', { name: 'Dictate' });
    expect(mic).toHaveAttribute('aria-pressed', 'false');
    await user.click(mic);
    expect(onVoice).toHaveBeenCalled();
    rerender(<ChatInput onVoice={onVoice} listening />);
    expect(screen.getByRole('button', { name: 'Dictate' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps toolbar clicks from stealing focus into the text', async () => {
    const user = userEvent.setup();
    render(<ChatInput actions={<ChatInputAction icon="global" label="Search" showLabel />} />);
    const tool = screen.getByRole('button', { name: 'Search' });
    await user.click(tool);
    expect(tool).toHaveFocus();
  });
});

describe('ChatInputAction', () => {
  it('is an icon button named by its label, or a labelled toggle pill', () => {
    const { rerender } = render(<ChatInputAction icon="global" label="Web search" />);
    expect(screen.getByRole('button', { name: 'Web search' })).not.toHaveAttribute('aria-pressed');
    rerender(<ChatInputAction icon="global" label="Web search" showLabel selected />);
    const pill = screen.getByRole('button', { name: 'Web search' });
    expect(pill).toHaveTextContent('Web search');
    expect(pill).toHaveAttribute('aria-pressed', 'true');
    expect(pill).toHaveClass('ds-chat-input__tool--labelled');
  });
});
