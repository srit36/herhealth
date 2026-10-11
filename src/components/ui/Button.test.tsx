import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonClasses } from './Button';

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('allows type="submit"', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute(
      'type',
      'submit',
    );
  });

  it('applies the primary variant by default', () => {
    render(<Button>Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-teal', 'text-white');
  });

  it.each([
    ['secondary', 'border-teal-line'],
    ['quiet', 'bg-transparent'],
    ['danger', 'text-danger'],
  ] as const)('applies the %s variant', (variant, expected) => {
    render(<Button variant={variant}>Go</Button>);
    expect(screen.getByRole('button')).toHaveClass(expected);
  });

  it('applies size and fullWidth', () => {
    render(
      <Button size="lg" fullWidth>
        Go
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveClass('h-11', 'w-full');
  });

  it('calls onClick when enabled', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('when loading: is disabled, is aria-busy and ignores clicks', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('is not aria-busy when idle', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });

  it('merges a custom className', () => {
    render(<Button className="mt-4">Go</Button>);
    expect(screen.getByRole('button')).toHaveClass('mt-4', 'bg-teal');
  });
});

describe('buttonClasses', () => {
  it('returns the same classes the component uses', () => {
    render(<Button variant="secondary">Go</Button>);
    const classes = buttonClasses({ variant: 'secondary' }).split(' ');
    expect(screen.getByRole('button')).toHaveClass(...classes);
  });

  it('sizes quiet buttons by padding, not fixed height', () => {
    expect(buttonClasses({ variant: 'quiet' })).not.toMatch(/\bh-/);
  });
});
