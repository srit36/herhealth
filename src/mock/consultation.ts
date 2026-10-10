import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type ConsultationRecord = {
  id: number;
  date: string;
  type: string;
  doctor?: string;
  reason?: string;
  notes?: string;
  followUp?: string;
  summary: boolean;
};

export const initialConsultations: ConsultationRecord[] = [
  {
    id: 1,
    date: 'October 1, 2026',
    type: 'General consultation',
    doctor: 'Dr. Meera Sharma',
    reason: 'Discussing recurring headaches and fatigue.',
    notes:
      'Reviewed recent headache entries and sleep patterns. Continue tracking when headaches occur and bring the recent blood report to the next visit.',
    followUp: 'October 15, 2026',
    summary: true,
  },
  {
    id: 2,
    date: 'August 14, 2026',
    type: 'Dermatology consultation',
    doctor: 'Dr. Kavya Rao',
    reason: 'Reviewing recent skin changes.',
    notes: 'Discussed changes recorded over the previous month.',
    summary: true,
  },
  {
    id: 3,
    date: 'June 22, 2026',
    type: 'General consultation',
    doctor: 'Dr. Meera Sharma',
    notes: 'Annual wellness visit.',
    summary: false,
  },
];
