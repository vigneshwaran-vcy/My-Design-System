import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

const items: BreadcrumbItem[] = [
  { label: 'Workspace', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Billing API', href: '/projects/billing' },
  { label: 'Settings', href: '/projects/billing/settings' },
  { label: 'Webhooks' },
];

describe('Breadcrumb', () => {
  it('renders a nav labelled "Breadcrumb" containing an ordered list', () => {
    render(<Breadcrumb items={items} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveClass('ds-breadcrumb');
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    expect(within(nav).getAllByRole('listitem')).toHaveLength(5);
  });

  it('allows overriding the aria-label', () => {
    render(<Breadcrumb items={items} aria-label="You are here" />);
    expect(screen.getByRole('navigation', { name: 'You are here' })).toBeInTheDocument();
  });

  it('marks the last item as the current page and does not link it', () => {
    render(<Breadcrumb items={items} />);
    const current = screen.getByText('Webhooks').closest('[aria-current]');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current?.tagName).toBe('SPAN');
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('respects an explicit current flag', () => {
    render(<Breadcrumb items={[{ label: 'A', href: '/a', current: true }, { label: 'B', href: '/b' }]} />);
    expect(screen.getByText('A').closest('.ds-breadcrumb__link')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'B' })).not.toHaveAttribute('aria-current');
  });

  it('renders links with hrefs and hides separators and icons from assistive tech', () => {
    const { container } = render(<Breadcrumb items={items.slice(0, 2).map((i) => ({ ...i, icon: <svg /> }))} />);
    expect(screen.getByRole('link', { name: 'Workspace' })).toHaveAttribute('href', '/');
    const separators = container.querySelectorAll('.ds-breadcrumb__separator');
    expect(separators).toHaveLength(1);
    separators.forEach((s) => expect(s).toHaveAttribute('aria-hidden', 'true'));
    container.querySelectorAll('.ds-breadcrumb__icon').forEach((i) => expect(i).toHaveAttribute('aria-hidden', 'true'));
  });

  it('accepts a custom separator', () => {
    render(<Breadcrumb items={items.slice(0, 2)} separator="/" />);
    expect(screen.getByText('/')).toHaveClass('ds-breadcrumb__separator');
  });

  it('collapses the middle behind an ellipsis button when maxItems is exceeded', () => {
    render(<Breadcrumb items={items} maxItems={3} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.queryByText('Projects')).not.toBeInTheDocument();
    expect(screen.getByText('Webhooks')).toBeInTheDocument();
    const ellipsis = screen.getByRole('button', { name: 'Show 3 more items' });
    expect(ellipsis).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps more trailing items when maxItems is larger', () => {
    render(<Breadcrumb items={items} maxItems={4} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show 2 more items' })).toBeInTheDocument();
  });

  it('does not collapse when the trail fits', () => {
    render(<Breadcrumb items={items} maxItems={5} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('expands the trail from the keyboard and moves focus to the first revealed crumb', async () => {
    const user = userEvent.setup();
    render(<Breadcrumb items={items} maxItems={3} />);
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Show 3 more items' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveFocus();
  });

  it('calls item onClick handlers', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((e) => e.preventDefault());
    render(<Breadcrumb items={[{ label: 'Home', href: '/', onClick }, { label: 'Here' }]} />);
    await user.click(screen.getByRole('link', { name: 'Home' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards refs, merges className and spreads rest props', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumb ref={ref} items={items} className="custom" data-testid="bc" />);
    expect(ref.current).toBe(screen.getByTestId('bc'));
    expect(ref.current).toHaveClass('ds-breadcrumb', 'custom');
  });
});
