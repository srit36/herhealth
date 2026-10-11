import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatTile } from './StatTile';

describe('StatTile', () => {
  it('shows label, value and note', () => {
    render(<StatTile label="Sleep" value="7h 20m" note="Last night" />);
    expect(screen.getByText('Sleep')).toBeInTheDocument();
    expect(screen.getByText('7h 20m')).toBeInTheDocument();
    expect(screen.getByText('Last night')).toBeInTheDocument();
  });

  it('exposes level as a meter', () => {
    render(<StatTile label="Mood" value="Good" level={80} />);
    const meter = screen.getByRole('meter', { name: 'Mood level' });
    expect(meter).toHaveAttribute('aria-valuenow', '80');
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
  });

  it('has no meter when level is omitted', () => {
    render(<StatTile label="Mood" value="Good" />);
    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
  });

  it.each([
    [150, '100'],
    [-20, '0'],
  ])('clamps level %s to %s', (input, expected) => {
    render(<StatTile label="Energy" value="x" level={input} />);
    expect(screen.getByRole('meter')).toHaveAttribute(
      'aria-valuenow',
      expected,
    );
  });

  it('hides the meter for a non-numeric level', () => {
    render(<StatTile label="Energy" value="x" level={Number.NaN} />);
    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
  });

  it('hides the decorative icon from assistive tech', () => {
    render(
      <StatTile label="Sleep" value="7h" icon={<svg data-testid="icon" />} />,
    );
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});
