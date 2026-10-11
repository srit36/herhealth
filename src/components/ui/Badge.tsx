import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'teal' | 'warn' | 'danger';

const tones: Record<BadgeTone, string> = {
  neutral: 'border border-line bg-surface text-muted',
  teal: 'border border-transparent bg-teal-soft text-teal-dark',
  warn: 'border border-transparent bg-sand text-warn-strong',
  danger: 'border border-transparent bg-danger-soft text-danger',
};

export type BadgeProps = ComponentProps<'span'> & {
  tone?: BadgeTone;
};

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center rounded-pill px-2.5 py-1 text-xs leading-none font-medium whitespace-nowrap',
        tones[tone],
        className,
      )}
    />
  );
}
