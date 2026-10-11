import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap cursor-pointer select-none transition-colors ' +
  'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-teal/25 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 aria-busy:cursor-progress';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-teal text-white shadow-button hover:bg-teal-dark',
  secondary: 'border border-teal-line bg-surface text-teal hover:bg-teal-soft',
  quiet: 'bg-transparent text-teal hover:text-teal-dark',
  danger: 'border border-danger/30 bg-surface text-danger hover:bg-danger-soft',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-control px-3 text-xs',
  md: 'h-[38px] rounded-control px-4 text-[13px]',
  lg: 'h-11 rounded-control px-5 text-sm',
};

// Quiet buttons are text-only, so they size by padding rather than height.
const quietSizes: Record<ButtonSize, string> = {
  sm: 'py-1 text-xs',
  md: 'py-1.5 text-[13px]',
  lg: 'py-2 text-sm',
};

export type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

/**
 * Class names for a button. Exported so a link (next/link) can look exactly
 * like a button without nesting an <a> inside a <button>.
 */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    base,
    variants[variant],
    variant === 'quiet' ? quietSizes[size] : sizes[size],
    fullWidth && 'w-full',
    className,
  );
}

export type ButtonProps = ComponentProps<'button'> &
  ButtonStyleOptions & {
    /** Shows a spinner, disables the button and sets aria-busy. */
    loading?: boolean;
  };

export function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
    >
      {loading ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4 animate-spin"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <circle cx="12" cy="12" r="9" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
