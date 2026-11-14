import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pill, PillContainer } from './Pill';

function Pills({ initial = ['Acme', 'Globex', 'Initech'] }: { initial?: string[] }) {
  const [items, setItems] = useState(initial);
  return (
    <PillContainer label="Selected accounts">
      {items.map((name) => (
        <Pill key={name} label={name} onRemove={() => setItems((all) => all.filter((n) => n !== name))} />
      ))}
    </PillContainer>
  );
}

describe('Pill', () => {
  it('renders a label with variant and size classes', () => {
    render(<Pill label="Acme" variant="accent" size="sm" data-testid="p" />);
    expect(screen.getByTestId('p')).toHaveClass('ds-pill', 'ds-pill--accent', 'ds-pill--sm');
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows a labelled remove button when removable and calls onRemove on click', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Pill label="Acme" onRemove={onRemove} />);
    await user.click(screen.getByRole('button', { name: 'Remove Acme' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('removes with Backspace or Delete from the focused remove button', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<Pill label="Acme" onRemove={onRemove} />);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Remove Acme' })).toHaveFocus();
    await user.keyboard('{Backspace}');
    await user.keyboard('{Delete}');
    expect(onRemove).toHaveBeenCalledTimes(2);
  });

  it('renders a leading icon or avatar as decoration', () => {
    const { rerender, container } = render(<Pill label="Acme" icon="user" />);
    expect(container.querySelector('.ds-pill__icon svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Pill label="Acme" avatar={<span data-testid="avatar" />} />);
    expect(screen.getByTestId('avatar').parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('cannot be removed while disabled', () => {
    render(<Pill label="Acme" disabled onRemove={() => {}} data-testid="p" />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByTestId('p')).toHaveAttribute('aria-disabled', 'true');
  });

  it('forwards refs and rest props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Pill ref={ref} label="Acme" data-testid="p" />);
    expect(ref.current).toBe(screen.getByTestId('p'));
  });
});

describe('PillContainer', () => {
  it('is a labelled horizontal listbox of options with one tab stop', async () => {
    const user = userEvent.setup();
    render(<Pills />);
    const listbox = screen.getByRole('listbox', { name: 'Selected accounts' });
    expect(listbox).toHaveAttribute('aria-orientation', 'horizontal');
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveAccessibleName('Acme');
    expect(options[0]).toHaveAccessibleDescription('Press Delete or Backspace to remove.');
    expect(options.map((o) => o.tabIndex)).toEqual([0, -1, -1]);
    await user.tab();
    expect(options[0]).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('moves focus with arrows, Home and End', async () => {
    const user = userEvent.setup();
    render(<Pills />);
    const options = screen.getAllByRole('option');
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(options[1]).toHaveFocus();
    expect(options[1]).toHaveAttribute('tabindex', '0');
    await user.keyboard('{End}');
    expect(options[2]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(options[0]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(options[2]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(options[0]).toHaveFocus();
  });

  it('removes the focused pill with Backspace/Delete and focuses its neighbour', async () => {
    const user = userEvent.setup();
    render(<Pills />);
    await user.tab();
    await user.keyboard('{ArrowRight}{Delete}');
    expect(screen.queryByRole('option', { name: 'Globex' })).toBeNull();
    expect(screen.getByRole('option', { name: 'Initech' })).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(screen.getByRole('option', { name: 'Acme' })).toHaveFocus();
    await user.keyboard('{Backspace}');
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(screen.getByRole('listbox')).toHaveFocus();
  });

  it('keeps remove buttons out of the tab order inside a container', () => {
    render(<Pills />);
    for (const button of screen.getAllByRole('button', { hidden: true })) expect(button).toHaveAttribute('tabindex', '-1');
  });

  it('passes its size to pills and forwards refs', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <PillContainer ref={ref} label="Tags" size="sm">
        <Pill label="One" />
      </PillContainer>,
    );
    expect(ref.current).toBe(screen.getByRole('listbox'));
    expect(screen.getByRole('option')).toHaveClass('ds-pill--sm');
  });
});
