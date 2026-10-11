'use client';

import { useId } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const controlBase =
  'w-full rounded-field border bg-surface px-3 text-sm text-ink placeholder:text-muted ' +
  'focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-teal/25 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

function controlClasses(invalid: boolean, extra?: string): string {
  return cn(controlBase, invalid ? 'border-danger' : 'border-line', extra);
}

/* ---------- Raw styled controls (use these only inside a Field) ---------- */

export type InputProps = ComponentProps<'input'> & { invalid?: boolean };

export function Input({ invalid = false, className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={controlClasses(invalid, cn('h-11', className))}
    />
  );
}

export type TextareaProps = ComponentProps<'textarea'> & {
  invalid?: boolean;
};

export function Textarea({
  invalid = false,
  className,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={controlClasses(invalid, cn('min-h-24 py-2.5', className))}
    />
  );
}

export type SelectProps = ComponentProps<'select'> & { invalid?: boolean };

export function Select({ invalid = false, className, ...rest }: SelectProps) {
  return (
    <select
      {...rest}
      aria-invalid={invalid || undefined}
      className={controlClasses(invalid, cn('h-11', className))}
    />
  );
}

/* ---------- Shared label / hint / error wiring ---------- */

type FieldMessages = {
  label: string;
  hint?: string;
  error?: string;
};

type ShellProps = FieldMessages & {
  id: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

function describedBy(
  id: string,
  { hint, error }: Pick<FieldMessages, 'hint' | 'error'>,
): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');
  return ids || undefined;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: ShellProps) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      <label htmlFor={id} className="text-xs font-semibold text-muted">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Labelled fields ---------- */

export type TextFieldProps = Omit<InputProps, 'invalid'> &
  FieldMessages & { containerClassName?: string };

export function TextField({
  label,
  hint,
  error,
  id,
  required,
  containerClassName,
  ...rest
}: TextFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <Input
        {...rest}
        id={fieldId}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={describedBy(fieldId, { hint, error })}
      />
    </FieldShell>
  );
}

export type TextareaFieldProps = Omit<TextareaProps, 'invalid'> &
  FieldMessages & { containerClassName?: string };

export function TextareaField({
  label,
  hint,
  error,
  id,
  required,
  containerClassName,
  ...rest
}: TextareaFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <Textarea
        {...rest}
        id={fieldId}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={describedBy(fieldId, { hint, error })}
      />
    </FieldShell>
  );
}

export type SelectFieldProps = Omit<SelectProps, 'invalid'> &
  FieldMessages & { containerClassName?: string };

export function SelectField({
  label,
  hint,
  error,
  id,
  required,
  containerClassName,
  children,
  ...rest
}: SelectFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={containerClassName}
    >
      <Select
        {...rest}
        id={fieldId}
        required={required}
        invalid={Boolean(error)}
        aria-describedby={describedBy(fieldId, { hint, error })}
      >
        {children}
      </Select>
    </FieldShell>
  );
}

export type CheckboxFieldProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: ReactNode;
  hint?: string;
  error?: string;
  /** Draws the checkbox inside a bordered box, as on the consent screen. */
  boxed?: boolean;
};

export function CheckboxField({
  label,
  hint,
  error,
  boxed = false,
  id,
  className,
  ...rest
}: CheckboxFieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  return (
    <div className="grid gap-1.5">
      <label
        htmlFor={fieldId}
        className={cn(
          'flex items-start gap-2.5 text-[13px] leading-snug text-ink',
          boxed &&
            'rounded-xl border bg-canvas px-3.5 py-3 ' +
              (error ? 'border-danger' : 'border-line'),
        )}
      >
        <input
          {...rest}
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fieldId, { hint, error })}
          className={cn(
            'mt-0.5 size-4 shrink-0 accent-teal focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal/25',
            className,
          )}
        />
        <span>{label}</span>
      </label>
      {hint ? (
        <p id={`${fieldId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${fieldId}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
