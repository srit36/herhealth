import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders its children in a div by default', () => {
    render(<Card data-testid="card">Hello</Card>);
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveTextContent('Hello');
    expect(card).toHaveClass('rounded-card', 'bg-surface');
  });

  it('can render as a section', () => {
    render(
      <Card as="section" aria-label="Summary">
        Hi
      </Card>,
    );
    expect(screen.getByRole('region', { name: 'Summary' })).toBeInTheDocument();
  });

  it('supports padding and tone options', () => {
    render(
      <Card data-testid="card" padding="none" tone="soft">
        x
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-teal-soft');
    expect(card).not.toHaveClass('p-4');
  });
});
