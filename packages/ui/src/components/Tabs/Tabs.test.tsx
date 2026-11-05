import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './Tabs';

const renderTabs = (props: Partial<TabsProps> = {}) =>
  render(
    <Tabs defaultValue="one" {...props}>
      <TabList aria-label="Sections">
        <Tab value="one">One</Tab>
        <Tab value="two" badge={3}>Two</Tab>
        <Tab value="three" disabled>Three</Tab>
        <Tab value="four" icon="★">Four</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="three">Panel three</TabPanel>
      <TabPanel value="four">Panel four</TabPanel>
    </Tabs>,
  );

describe('Tabs', () => {
  it('renders the WAI-ARIA tabs structure with linked ids', () => {
    renderTabs();
    const list = screen.getByRole('tablist', { name: 'Sections' });
    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    const one = screen.getByRole('tab', { name: 'One' });
    const panel = screen.getByRole('tabpanel', { name: 'One' });
    expect(one).toHaveAttribute('aria-selected', 'true');
    expect(one).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', one.id);
    expect(panel).toHaveTextContent('Panel one');
    expect(screen.queryByText('Panel two')).not.toBeInTheDocument();
  });

  it('uses a roving tabindex: only the selected tab is in the tab order', async () => {
    const user = userEvent.setup();
    renderTabs();
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Two 3' })).toHaveAttribute('tabindex', '-1');
    await user.tab();
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('selects a tab on click and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });
    await user.click(screen.getByRole('tab', { name: 'Two 3' }));
    expect(onValueChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('tab', { name: 'Two 3' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });

  it('moves with arrow keys, skips disabled tabs, wraps, and activates automatically', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });
    screen.getByRole('tab', { name: 'One' }).focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two 3' })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('two');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Four' })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('four');

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Four' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Four' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel four');
  });

  it('uses up/down arrows when vertical', async () => {
    const user = userEvent.setup();
    renderTabs({ orientation: 'vertical' });
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    screen.getByRole('tab', { name: 'One' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Two 3' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two 3' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
  });

  it('ignores clicks on disabled tabs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderTabs({ onValueChange });
    const disabled = screen.getByRole('tab', { name: 'Three' });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('works as a controlled component', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Tabs value="one" onValueChange={onValueChange}>
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    await user.click(screen.getByRole('tab', { name: 'Two' }));
    expect(onValueChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel one');
    rerender(
      <Tabs value="two" onValueChange={onValueChange}>
        <TabList>
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });

  it('applies variant, size and orientation classes', () => {
    renderTabs({ variant: 'pill', size: 'sm', orientation: 'vertical' });
    expect(screen.getByRole('tablist').parentElement).toHaveClass('ds-tabs', 'ds-tabs--pill', 'ds-tabs--sm', 'ds-tabs--vertical');
  });

  it('keeps forceMount panels in the DOM but hidden', () => {
    render(
      <Tabs defaultValue="a">
        <TabList>
          <Tab value="a">A</Tab>
          <Tab value="b">B</Tab>
        </TabList>
        <TabPanel value="a">PA</TabPanel>
        <TabPanel value="b" forceMount>PB</TabPanel>
      </Tabs>,
    );
    expect(screen.getByText('PB')).not.toBeVisible();
    expect(screen.getByText('PA')).toBeVisible();
  });

  it('hides icons from assistive tech and exposes badges in the name', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Four' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Two 3' })).toBeInTheDocument();
  });

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Tabs ref={ref} defaultValue="a" data-testid="tabs">
        <TabList>
          <Tab value="a">A</Tab>
        </TabList>
      </Tabs>,
    );
    expect(ref.current).toBe(screen.getByTestId('tabs'));
  });
});
