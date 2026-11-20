import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FileSelector, fileMatchesAccept } from './FileSelector';

const pdf = new File(['%PDF'], 'report.pdf', { type: 'application/pdf' });
const png = new File(['png'], 'photo.png', { type: 'image/png' });

const drop = (target: Element, files: File[]) =>
  fireEvent.drop(target, { dataTransfer: { files, types: ['Files'] } });

describe('FileSelector', () => {
  it('renders a labelled browse button and a hidden file input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileSelector ref={ref} label="Attachments" multiple />);
    expect(screen.getByRole('button', { name: 'Upload files or drop files here Attachments' })).toBeInTheDocument();
    expect(ref.current).toHaveAttribute('type', 'file');
    expect(ref.current).toHaveAttribute('multiple');
    expect(ref.current).toHaveAccessibleName('Attachments');
  });

  it('adds picked files and removes them', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(<FileSelector ref={ref} label="Attachments" multiple onChange={onChange} />);
    await user.upload(ref.current!, [pdf, png]);
    expect(onChange).toHaveBeenLastCalledWith([pdf, png]);
    const list = screen.getByRole('list', { name: 'Selected files' });
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Remove report.pdf' }));
    expect(onChange).toHaveBeenLastCalledWith([png]);
    expect(screen.getByRole('button', { name: /Upload files/ })).toHaveFocus();
  });

  it('replaces the file in single mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const ref = createRef<HTMLInputElement>();
    render(<FileSelector ref={ref} label="File" defaultFiles={[pdf]} onChange={onChange} />);
    await user.upload(ref.current!, png);
    expect(onChange).toHaveBeenLastCalledWith([png]);
  });

  it('shows a drag-over state and filters drops by accept', () => {
    const onChange = vi.fn();
    const onReject = vi.fn();
    const { container } = render(
      <FileSelector label="Photos" accept="image/*" multiple onChange={onChange} onReject={onReject} />,
    );
    const zone = container.querySelector('.ds-file-selector__zone')!;
    fireEvent.dragEnter(zone, { dataTransfer: { files: [], types: ['Files'] } });
    expect(zone).toHaveClass('ds-file-selector__zone--dragging');
    drop(zone, [png, pdf]);
    expect(zone).not.toHaveClass('ds-file-selector__zone--dragging');
    expect(onChange).toHaveBeenCalledWith([png]);
    expect(onReject).toHaveBeenCalledWith([pdf]);
  });

  it('ignores drops and disables controls when disabled; announces errors', () => {
    const onChange = vi.fn();
    const { container } = render(<FileSelector label="Files" disabled error="Too large" onChange={onChange} />);
    drop(container.querySelector('.ds-file-selector__zone')!, [pdf]);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Upload file/ })).toBeDisabled();
    expect(screen.getByRole('alert')).toHaveTextContent('Too large');
    expect(screen.getByRole('button', { name: /Upload file/ })).toHaveAccessibleDescription('Too large');
  });

  it('matches accept rules', () => {
    expect(fileMatchesAccept(pdf, '.pdf')).toBe(true);
    expect(fileMatchesAccept(pdf, 'image/*')).toBe(false);
    expect(fileMatchesAccept(png, 'image/png, .pdf')).toBe(true);
    expect(fileMatchesAccept(png)).toBe(true);
  });
});
