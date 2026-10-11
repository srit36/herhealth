import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckboxField, SelectField, TextareaField, TextField } from './Field';

describe('TextField', () => {
  it('associates the label with the input', () => {
    render(<TextField label="Email" type="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });

  it('describes the input with its hint', () => {
    render(<TextField label="Email" hint="We never share it" />);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'We never share it',
    );
  });

  it('marks the input invalid and describes it with the error', () => {
    render(<TextField label="Email" error="Enter a valid email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Enter a valid email');
  });

  it('describes with both hint and error', () => {
    render(<TextField label="Email" hint="Hint" error="Error" />);
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(
      'Hint Error',
    );
  });

  it('is not invalid without an error', () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  });

  it('sets the native required attribute', () => {
    render(<TextField label="Email" required />);
    expect(screen.getByLabelText(/Email/)).toBeRequired();
  });

  it('gives each field a unique id', () => {
    render(
      <>
        <TextField label="First" />
        <TextField label="Second" />
      </>,
    );
    expect(screen.getByLabelText('First').id).not.toBe(
      screen.getByLabelText('Second').id,
    );
  });

  it('respects an explicit id', () => {
    render(<TextField label="Email" id="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email');
  });
});

describe('TextareaField', () => {
  it('is labelled and shows its error', () => {
    render(<TextareaField label="Notes" error="Too long" />);
    const area = screen.getByLabelText('Notes');
    expect(area.tagName).toBe('TEXTAREA');
    expect(area).toHaveAccessibleDescription('Too long');
  });
});

describe('SelectField', () => {
  it('renders its options and is labelled', () => {
    render(
      <SelectField label="Flow">
        <option value="light">Light</option>
        <option value="heavy">Heavy</option>
      </SelectField>,
    );
    const select = screen.getByLabelText('Flow');
    expect(select.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });
});

describe('CheckboxField', () => {
  it('is a labelled checkbox', () => {
    render(<CheckboxField label="I am 18 or older" />);
    expect(
      screen.getByRole('checkbox', { name: 'I am 18 or older' }),
    ).not.toBeChecked();
  });

  it('shows an error and marks the checkbox invalid', () => {
    render(<CheckboxField label="Agree" error="You must agree" />);
    const box = screen.getByRole('checkbox', { name: 'Agree' });
    expect(box).toHaveAttribute('aria-invalid', 'true');
    expect(box).toHaveAccessibleDescription('You must agree');
  });

  it('supports defaultChecked', () => {
    render(<CheckboxField label="Agree" defaultChecked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
