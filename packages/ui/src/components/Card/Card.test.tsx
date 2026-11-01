import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders as a div with default variant and padding', () => {
    render(<Card data-testid="card">Hi</Card>);
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('ds-card', 'ds-card--elevated', 'ds-card--padding-md');
  });

  it('can render as a labelled region landmark', () => {
    render(
      <Card as="section" aria-labelledby="plan-title">
        <CardHeader title="Plan" titleId="plan-title" />
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'Plan' })).toBeInTheDocument();
  });

  it('renders header title as a heading at the requested level', () => {
    render(
      <Card>
        <CardHeader title="Settings" titleAs="h2" description="Manage things" action={<button>Edit</button>} />
      </Card>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByText('Manage things')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('applies variant and padding classes', () => {
    render(<Card data-testid="card" variant="outlined" padding="lg" />);
    expect(screen.getByTestId('card')).toHaveClass('ds-card--outlined', 'ds-card--padding-lg');
  });

  it('renders body and footer slots', () => {
    render(
      <Card>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Body')).toHaveClass('ds-card__body');
    expect(screen.getByText('Footer')).toHaveClass('ds-card__footer');
  });
});
