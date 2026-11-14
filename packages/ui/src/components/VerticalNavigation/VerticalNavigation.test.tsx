import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  VerticalNavigation,
  VerticalNavigationItem,
  VerticalNavigationSection,
  type VerticalNavigationProps,
} from './VerticalNavigation';

const renderNav = (props: Partial<VerticalNavigationProps> = {}, sectionProps = {}) =>
  render(
    <VerticalNavigation aria-label="Workspace" defaultValue="home" {...props}>
      <VerticalNavigationSection title="General">
        <VerticalNavigationItem value="home" icon="home">Home</VerticalNavigationItem>
        <VerticalNavigationItem value="inbox" icon="inbox" badge={4}>Inbox</VerticalNavigationItem>
        <VerticalNavigationItem value="locked" disabled>Locked</VerticalNavigationItem>
      </VerticalNavigationSection>
      <VerticalNavigationSection title="Reports" collapsible {...sectionProps}>
        <VerticalNavigationItem value="recent" href="#recent">Recent</VerticalNavigationItem>
        <VerticalNavigationItem value="shared" href="#shared">Shared</VerticalNavigationItem>
      </VerticalNavigationSection>
    </VerticalNavigation>,
  );

describe('VerticalNavigation', () => {
  it('renders a labelled nav with headed lists and marks the current item', () => {
    renderNav();
    const nav = screen.getByRole('navigation', { name: 'Workspace' });
    expect(within(nav).getByRole('heading', { name: 'General' })).toBeInTheDocument();
    expect(within(nav).getByRole('list', { name: 'General' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Inbox 4' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Recent' })).toHaveAttribute('href', '#recent');
  });

  it('activates items on click and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderNav({ onValueChange });
    await user.click(screen.getByRole('link', { name: 'Recent' }));
    expect(onValueChange).toHaveBeenCalledWith('recent');
    expect(screen.getByRole('link', { name: 'Recent' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('aria-current');
  });

  it('ignores disabled items', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderNav({ onValueChange });
    const locked = screen.getByRole('button', { name: 'Locked' });
    expect(locked).toBeDisabled();
    await user.click(locked);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('collapses and expands a collapsible section', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderNav({}, { onOpenChange });
    const toggle = screen.getByRole('button', { name: 'Reports' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).toBeInTheDocument();
    await user.click(toggle);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Recent' })).not.toBeInTheDocument();
    await user.click(toggle);
    expect(screen.getByRole('link', { name: 'Recent' })).toBeVisible();
  });

  it('starts closed with defaultOpen={false}', () => {
    renderNav({}, { defaultOpen: false });
    expect(screen.getByRole('button', { name: 'Reports' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Shared' })).not.toBeInTheDocument();
  });

  it('moves focus with Up/Down/Home/End, skipping disabled and hidden items', async () => {
    const user = userEvent.setup();
    renderNav();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Inbox 4' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: 'Reports' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('link', { name: 'Shared' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: 'Home' })).toHaveFocus();
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <VerticalNavigation value="a" onValueChange={onValueChange}>
        <VerticalNavigationSection>
          <VerticalNavigationItem value="a">A</VerticalNavigationItem>
          <VerticalNavigationItem value="b">B</VerticalNavigationItem>
        </VerticalNavigationSection>
      </VerticalNavigation>,
    );
    await user.click(screen.getByRole('button', { name: 'B' }));
    expect(onValueChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-current', 'page');
  });

  it('applies variant and size, hides icons and forwards refs', () => {
    const ref = createRef<HTMLElement>();
    const itemRef = createRef<HTMLElement>();
    const { container } = render(
      <VerticalNavigation ref={ref} variant="framed" size="sm" data-testid="nav">
        <VerticalNavigationSection title="S">
          <VerticalNavigationItem ref={itemRef} value="a" icon="home" current>A</VerticalNavigationItem>
        </VerticalNavigationSection>
      </VerticalNavigation>,
    );
    expect(ref.current).toBe(screen.getByTestId('nav'));
    expect(ref.current).toHaveClass('ds-vertical-navigation--framed', 'ds-vertical-navigation--sm');
    expect(itemRef.current).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('.ds-vertical-navigation__icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
