import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type Ref } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Tab, TabList, TabPanel } from '../Tabs';
import { ScopedTabs, type ScopedTabsProps } from './ScopedTabs';

const renderScoped = (props: Partial<ScopedTabsProps> & { ref?: Ref<HTMLDivElement> } = {}) =>
  render(
    <ScopedTabs defaultValue="details" data-testid="scoped" {...props}>
      <TabList aria-label="Record">
        <Tab value="details">Details</Tab>
        <Tab value="activity" badge={2}>Activity</Tab>
        <Tab value="files" disabled>Files</Tab>
        <Tab value="notes">Notes</Tab>
      </TabList>
      <TabPanel value="details">Details panel</TabPanel>
      <TabPanel value="activity">Activity panel</TabPanel>
      <TabPanel value="files">Files panel</TabPanel>
      <TabPanel value="notes">Notes panel</TabPanel>
    </ScopedTabs>,
  );

describe('ScopedTabs', () => {
  it('renders the tabs pattern with a linked panel', () => {
    renderScoped();
    expect(screen.getByRole('tablist', { name: 'Record' })).toHaveAttribute('aria-orientation', 'horizontal');
    const tab = screen.getByRole('tab', { name: 'Details' });
    const panel = screen.getByRole('tabpanel', { name: 'Details' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Details panel');
  });

  it('selects on click and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderScoped({ onValueChange });
    await user.click(screen.getByRole('tab', { name: 'Activity 2' }));
    expect(onValueChange).toHaveBeenCalledWith('activity');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });

  it('supports the arrow/Home/End keyboard model and skips disabled tabs', async () => {
    const user = userEvent.setup();
    renderScoped();
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Notes' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Notes panel');
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Notes' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('does not select disabled tabs', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderScoped({ onValueChange });
    await user.click(screen.getByRole('tab', { name: 'Files' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('applies scoped classes, variant and size, and forwards refs', () => {
    const ref = createRef<HTMLDivElement>();
    renderScoped({ ref, variant: 'plain', size: 'sm', className: 'extra' });
    expect(ref.current).toBe(screen.getByTestId('scoped'));
    expect(ref.current).toHaveClass('ds-tabs', 'ds-scoped-tabs', 'ds-scoped-tabs--plain', 'ds-scoped-tabs--sm', 'ds-tabs--sm', 'extra');
  });

  it('defaults to the framed variant', () => {
    renderScoped();
    expect(screen.getByTestId('scoped')).toHaveClass('ds-scoped-tabs--framed', 'ds-scoped-tabs--md');
  });
});
