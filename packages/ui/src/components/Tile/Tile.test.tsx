import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ButtonIcon } from '../ButtonIcon';
import { Tile } from './Tile';

describe('Tile', () => {
  it('renders an article named by its heading with default classes', () => {
    render(<Tile title="Acme Corporation">Enterprise account</Tile>);
    const tile = screen.getByRole('article', { name: 'Acme Corporation' });
    expect(tile).toHaveClass('ds-tile', 'ds-tile--plain', 'ds-tile--md');
    expect(screen.getByRole('heading', { level: 3, name: 'Acme Corporation' })).toBeInTheDocument();
    expect(screen.getByText('Enterprise account')).toHaveClass('ds-tile__body');
  });

  it('applies variant, size and heading level', () => {
    render(<Tile title="Acme" variant="card" size="sm" titleAs="h4" />);
    expect(screen.getByRole('article')).toHaveClass('ds-tile--card', 'ds-tile--sm');
    expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
  });

  it('links the title when href is set and the link is keyboard reachable', async () => {
    const user = userEvent.setup();
    render(<Tile title="Acme" href="#acme" linkProps={{ target: '_self' }} />);
    const link = screen.getByRole('link', { name: 'Acme' });
    expect(link).toHaveAttribute('href', '#acme');
    expect(link).toHaveAttribute('target', '_self');
    await user.tab();
    expect(link).toHaveFocus();
  });

  it('renders details as a description list', () => {
    render(<Tile title="Acme" details={[{ label: 'Owner', value: 'Ada' }, { label: 'Stage', value: 'Won' }]} />);
    const list = screen.getByRole('article').querySelector('dl')!;
    expect(within(list).getAllByRole('term').map((t) => t.textContent)).toEqual(['Owner', 'Stage']);
    expect(within(list).getAllByRole('definition').map((d) => d.textContent)).toEqual(['Ada', 'Won']);
  });

  it('renders media and actions; actions stay operable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Tile
        title="Acme"
        media={<span data-testid="media" />}
        actions={<ButtonIcon icon="menu-dots" label="Acme actions" variant="bare" size="xs" onClick={onClick} />}
      />,
    );
    expect(screen.getByTestId('media').parentElement).toHaveClass('ds-tile__media');
    await user.tab();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('forwards refs and rest props', () => {
    const ref = createRef<HTMLElement>();
    render(<Tile ref={ref} title="Acme" data-testid="t" />);
    expect(ref.current).toBe(screen.getByTestId('t'));
  });
});
