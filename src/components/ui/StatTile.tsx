import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type StatTileProps = {
  /** Short name of the measurement, for example "Sleep". */
  label: string;
  /** The measurement as it should be displayed. Pass "—" when there is no data. */
  value: ReactNode;
  /** Small supporting line under the value. */
  note?: string;
  /** Decorative icon shown in a tinted square. */
  icon?: ReactNode;
  /**
   * Optional progress from 0 to 100, drawn as a thin bar and exposed to
   * assistive tech as a meter. Values outside the range are clamped, and
   * non-numeric values hide the bar.
   */
  level?: number;
  className?: string;
};

function clampLevel(level: number | undefined): number | null {
  if (level === undefined || !Number.isFinite(level)) return null;
  return Math.min(100, Math.max(0, level));
}

export function StatTile({
  label,
  value,
  note,
  icon,
  level,
  className,
}: StatTileProps) {
  const safeLevel = clampLevel(level);

  return (
    <div
      className={cn(
        'grid min-w-0 grid-cols-[36px_1fr] gap-x-3 gap-y-0.5',
        className,
      )}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className="row-span-3 grid size-9 place-items-center rounded-field bg-teal-soft text-teal"
        >
          {icon}
        </div>
      ) : null}
      <div className={cn('text-xs text-muted', !icon && 'col-span-2')}>
        {label}
      </div>
      <div
        className={cn(
          'font-display text-[15px] font-bold text-ink',
          !icon && 'col-span-2',
        )}
      >
        {value}
      </div>
      {note ? (
        <div className={cn('text-xs text-muted', !icon && 'col-span-2')}>
          {note}
        </div>
      ) : null}
      {safeLevel !== null ? (
        <div
          role="meter"
          aria-label={`${label} level`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeLevel}
          className="col-span-2 mt-2.5 h-[3px] overflow-hidden rounded-sm bg-line"
        >
          <div
            className="h-full rounded-[inherit] bg-teal"
            style={{ width: `${safeLevel}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}
