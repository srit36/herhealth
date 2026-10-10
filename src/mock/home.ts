import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export const metrics: Array<{
  icon: IconName;
  label: string;
  value: string;
  note: string;
  level: number;
}> = [
  { icon: 'moon', label: 'Sleep', value: '7h 24m', note: 'Restful', level: 74 },
  { icon: 'mood', label: 'Mood', value: 'Good', note: 'Steady', level: 82 },
  {
    icon: 'energy',
    label: 'Energy',
    value: 'Moderate',
    note: '6 of 10',
    level: 60,
  },
  { icon: 'stress', label: 'Stress', value: 'Low', note: '2 of 10', level: 24 },
];
