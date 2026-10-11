import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text with the neutral tone by default', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).toHaveClass('text-muted');
  });

  it.each([
    ['teal', 'bg-teal-soft'],
    ['warn', 'bg-sand'],
    ['danger', 'bg-danger-soft'],
  ] as const)('applies the %s tone', (tone, expected) => {
    render(<Badge tone={tone}>x</Badge>);
    expect(screen.getByText('x')).toHaveClass(expected);
  });
});
