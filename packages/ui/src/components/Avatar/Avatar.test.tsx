import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Avatar, AvatarGroup, getAvatarTint, getInitials } from './Avatar';

describe('getInitials', () => {
  it('takes the first letters of the first two words', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
    expect(getInitials('Katherine Coleman Johnson')).toBe('KC');
    expect(getInitials('  linus ')).toBe('L');
    expect(getInitials('')).toBe('');
  });
});

describe('getAvatarTint', () => {
  it('is deterministic and picks one of the four tints', () => {
    const tint = getAvatarTint('Ada Lovelace');
    expect(getAvatarTint('Ada Lovelace')).toBe(tint);
    expect(['accent', 'success', 'warn', 'danger']).toContain(tint);
  });
});

describe('Avatar', () => {
  it('renders an image with the name as accessible label', () => {
    render(<Avatar src="/ada.png" name="Ada Lovelace" />);
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' });
    expect(avatar).toHaveClass('ds-avatar', 'ds-avatar--md', 'ds-avatar--circle');
    expect(avatar.querySelector('img')).toHaveAttribute('src', '/ada.png');
    expect(avatar.querySelector('.ds-avatar__initials')).toBeNull();
  });

  it('prefers alt over name for the label', () => {
    render(<Avatar src="/ada.png" alt="Ada's photo" name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: "Ada's photo" })).toBeInTheDocument();
  });

  it('falls back to initials with a deterministic tint when there is no src', () => {
    render(<Avatar name="Grace Hopper" />);
    const avatar = screen.getByRole('img', { name: 'Grace Hopper' });
    expect(avatar).toHaveTextContent('GH');
    expect(avatar).toHaveClass(`ds-avatar--tint-${getAvatarTint('Grace Hopper')}`);
  });

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar src="/broken.png" name="Alan Turing" />);
    const avatar = screen.getByRole('img', { name: 'Alan Turing' });
    fireEvent.error(avatar.querySelector('img')!);
    expect(avatar.querySelector('img')).toBeNull();
    expect(avatar).toHaveTextContent('AT');
  });

  it('renders a generic placeholder when there is no name or image', () => {
    const { container } = render(<Avatar />);
    const avatar = container.querySelector('.ds-avatar')!;
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
    expect(avatar.querySelector('.ds-avatar__placeholder')).toBeInTheDocument();
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('applies the %s size class', (size) => {
    render(<Avatar name="A" size={size} />);
    expect(screen.getByRole('img')).toHaveClass(`ds-avatar--${size}`);
  });

  it('applies the square shape', () => {
    render(<Avatar name="A" shape="square" />);
    expect(screen.getByRole('img')).toHaveClass('ds-avatar--square');
  });

  it('shows a status dot and appends the status to the label', () => {
    render(<Avatar name="Ada Lovelace" status="busy" />);
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace, busy' });
    expect(avatar.querySelector('.ds-avatar__status--busy')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards refs and extra props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="A" data-testid="a" />);
    expect(ref.current).toBe(screen.getByTestId('a'));
  });
});

describe('AvatarGroup', () => {
  const people = ['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Katherine Johnson', 'Linus Torvalds'];

  it('renders all avatars inside a group when max is not set', () => {
    render(
      <AvatarGroup aria-label="Team">
        {people.map((p) => <Avatar key={p} name={p} />)}
      </AvatarGroup>,
    );
    expect(screen.getByRole('group', { name: 'Team' })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(5);
  });

  it('collapses extras into a "+N" bubble', () => {
    render(
      <AvatarGroup max={3}>
        {people.map((p) => <Avatar key={p} name={p} />)}
      </AvatarGroup>,
    );
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
    expect(screen.queryByRole('img', { name: 'Katherine Johnson' })).not.toBeInTheDocument();
  });

  it('does not show an overflow bubble when everything fits', () => {
    render(
      <AvatarGroup max={5}>
        {people.map((p) => <Avatar key={p} name={p} />)}
      </AvatarGroup>,
    );
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });
});
