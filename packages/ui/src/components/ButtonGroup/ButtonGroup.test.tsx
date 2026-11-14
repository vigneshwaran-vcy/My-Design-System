import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { ButtonIcon } from '../ButtonIcon';
import { ButtonGroup } from './ButtonGroup';

const items = [
  { id: 'draft', label: 'Save as draft' },
  { id: 'template', label: 'Save as template' },
  { id: 'off', label: 'Unavailable', disabled: true },
];

describe('ButtonGroup', () => {
  it('renders a labelled group with variant and size classes', () => {
    render(
      <ButtonGroup label="Text style">
        <Button variant="secondary">Bold</Button>
        <Button variant="secondary">Italic</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole('group', { name: 'Text style' });
    expect(group).toHaveClass('ds-button-group', 'ds-button-group--attached', 'ds-button-group--md');
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('applies the spaced variant', () => {
    render(<ButtonGroup variant="spaced" label="g"><Button>One</Button></ButtonGroup>);
    expect(screen.getByRole('group')).toHaveClass('ds-button-group--spaced');
  });

  it('passes size to children that do not set their own', () => {
    render(
      <ButtonGroup size="sm" label="g">
        <Button>Inherits</Button>
        <Button size="lg">Own</Button>
        <ButtonIcon icon="star" label="Star" />
      </ButtonGroup>,
    );
    expect(screen.getByRole('button', { name: 'Inherits' })).toHaveClass('ds-button--sm');
    expect(screen.getByRole('button', { name: 'Own' })).toHaveClass('ds-button--lg');
    expect(screen.getByRole('button', { name: 'Star' })).toHaveClass('ds-button-icon--sm');
  });

  it('keeps every button in the Tab order', async () => {
    const user = userEvent.setup();
    render(
      <ButtonGroup label="g">
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>,
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
  });

  it('adds a split menu button that opens with the keyboard and selects an item', async () => {
    const user = userEvent.setup();
    const onMenuSelect = vi.fn();
    render(
      <ButtonGroup label="Save" menuItems={items} menuLabel="More save options" onMenuSelect={onMenuSelect}>
        <Button>Save</Button>
      </ButtonGroup>,
    );
    const trigger = screen.getByRole('button', { name: 'More save options' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('menuitem', { name: 'Save as draft' })).toHaveFocus();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onMenuSelect).toHaveBeenCalledWith('template');
    expect(trigger).toHaveFocus();
  });

  it('closes the menu with Escape and returns focus', async () => {
    const user = userEvent.setup();
    render(<ButtonGroup label="g" menuItems={items}><Button>Save</Button></ButtonGroup>);
    const trigger = screen.getByRole('button', { name: 'More actions' });
    await user.click(trigger);
    expect(screen.getByRole('menu')).toBeVisible();
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('disables the menu button', async () => {
    const user = userEvent.setup();
    render(<ButtonGroup label="g" menuItems={items} menuDisabled><Button>Save</Button></ButtonGroup>);
    const trigger = screen.getByRole('button', { name: 'More actions' });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the overflow icon when asked', () => {
    render(<ButtonGroup label="g" menuItems={items} menuIcon="menu-dots"><Button>Edit</Button></ButtonGroup>);
    expect(screen.getByRole('button', { name: 'More actions' }).querySelector('[data-icon="menu-dots"]')).not.toBeNull();
  });

  it('forwards refs and rest props', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ButtonGroup ref={ref} data-testid="g" label="g"><Button>One</Button></ButtonGroup>);
    expect(ref.current).toBe(screen.getByTestId('g'));
  });
});
