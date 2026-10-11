import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardTone = 'surface' | 'soft';

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'px-6 py-[22px]',
  lg: 'p-8',
};

const tones: Record<CardTone, string> = {
  surface: 'border border-line bg-surface shadow-card',
  soft: 'border border-transparent bg-teal-soft',
};

export type CardProps = Omit<ComponentProps<'div'>, 'ref'> & {
  /** The element to render. Use `section` or `article` where it fits. */
  as?: 'div' | 'section' | 'article';
  padding?: CardPadding;
  tone?: CardTone;
};

export function Card({
  as: Component = 'div',
  padding = 'md',
  tone = 'surface',
  className,
  ...rest
}: CardProps) {
  return (
    <Component
      {...rest}
      className={cn('rounded-card', tones[tone], paddings[padding], className)}
    />
  );
}
