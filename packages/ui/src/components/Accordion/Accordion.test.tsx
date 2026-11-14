import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionItem, type AccordionProps } from './Accordion';

const renderAccordion = (props: Partial<AccordionProps> = {}) =>
  render(
    <Accordion {...props}>
      <AccordionItem value="one" title="One">Body one</AccordionItem>
      <AccordionItem value="two" title="Two" meta="3">Body two</AccordionItem>
      <AccordionItem value="three" title="Three" disabled>Body three</AccordionItem>
      <AccordionItem value="four" title="Four" icon="settings">Body four</AccordionItem>
    </Accordion>,
  );

describe('Accordion', () => {
  it('renders headings wrapping buttons linked to labelled regions', () => {
    renderAccordion({ defaultValue: ['one'] });
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    const trigger = screen.getByRole('button', { name: 'One' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const region = screen.getByRole('region', { name: 'One' });
    expect(trigger).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveTextContent('Body one');
    expect(screen.getByRole('button', { name: 'Two 3' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Body two').closest('[role="region"]')).not.toBeVisible();
  });

  it('keeps only one item open in single mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderAccordion({ defaultValue: ['one'], onValueChange });
    await user.click(screen.getByRole('button', { name: 'Two 3' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['two']);
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Body two')).toBeVisible();
    expect(screen.getByText('Body one')).not.toBeVisible();
  });

  it('can close the open item unless collapsible is false', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAccordion({ defaultValue: ['one'] });
    await user.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'false');
    unmount();
    renderAccordion({ defaultValue: ['one'], collapsible: false });
    await user.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByRole('button', { name: 'One' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('lets several items stay open in multiple mode', async () => {
    const user = userEvent.setup();
    renderAccordion({ type: 'multiple' });
    await user.click(screen.getByRole('button', { name: 'One' }));
    await user.click(screen.getByRole('button', { name: 'Four' }));
    expect(screen.getByText('Body one')).toBeVisible();
    expect(screen.getByText('Body four')).toBeVisible();
  });

  it('moves between headers with Up/Down/Home/End, skipping disabled ones, and toggles with Enter/Space', async () => {
    const user = userEvent.setup();
    renderAccordion();
    await user.tab();
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Two 3' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Four' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Four' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Four' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Four' })).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Four' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not toggle disabled items, and disables everything with the root prop', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = renderAccordion({ onValueChange });
    const disabled = screen.getByRole('button', { name: 'Three' });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
    unmount();
    renderAccordion({ disabled: true });
    screen.getAllByRole('button').forEach((b) => expect(b).toBeDisabled());
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Accordion value={[]} onValueChange={onValueChange}>
        <AccordionItem value="a" title="A">PA</AccordionItem>
      </Accordion>,
    );
    await user.click(screen.getByRole('button', { name: 'A' }));
    expect(onValueChange).toHaveBeenCalledWith(['a']);
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <Accordion value={['a']} onValueChange={onValueChange}>
        <AccordionItem value="a" title="A">PA</AccordionItem>
      </Accordion>,
    );
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('PA')).toBeVisible();
  });

  it('applies variant, size and heading level, hides icons, and forwards refs', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Accordion ref={ref} variant="framed" size="sm" headingLevel={4} className="extra" data-testid="acc">
        <AccordionItem value="a" title="A" icon="settings">PA</AccordionItem>
      </Accordion>,
    );
    expect(ref.current).toBe(screen.getByTestId('acc'));
    expect(ref.current).toHaveClass('ds-accordion', 'ds-accordion--framed', 'ds-accordion--sm', 'extra');
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
    expect(container.querySelector('.ds-accordion__icon')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.ds-accordion__chevron')).toHaveAttribute('aria-hidden', 'true');
  });
});
