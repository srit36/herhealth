import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type TimelineEventType =
  | 'Check-ins'
  | 'Symptoms'
  | 'Periods'
  | 'Consultations'
  | 'Health Records'
  | 'Notes';

export type TimelineEvent = {
  id: number;
  date: string;
  shortDate: string;
  dayOffset: number;
  type: TimelineEventType;
  title: string;
  subtitle?: string;
  icon: IconName;
  action: string;
  details: Array<[string, string]>;
  note?: string;
};

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: 'October 5, 2026',
    shortDate: 'MON, OCT 5',
    dayOffset: 0,
    type: 'Check-ins',
    title: 'Daily Check-in',
    icon: 'check',
    action: 'View entry',
    details: [
      ['Mood', 'Good'],
      ['Energy', '7 / 10'],
      ['Sleep', '7h 20m'],
      ['Sleep quality', 'Good'],
      ['Stress', 'Low'],
      ['Symptoms', 'None'],
    ],
    note: 'Felt focused through the afternoon. The evening walk helped me unwind.',
  },
  {
    id: 2,
    date: 'October 3, 2026',
    shortDate: 'SAT, OCT 3',
    dayOffset: 2,
    type: 'Symptoms',
    title: 'Symptom logged',
    subtitle: 'Headache · Moderate',
    icon: 'mood',
    action: 'View details',
    details: [
      ['Symptom', 'Headache'],
      ['Severity', 'Moderate'],
      ['Duration', 'About 2 hours'],
      ['Time recorded', '4:15 PM'],
    ],
    note: 'Improved after resting and drinking water.',
  },
  {
    id: 3,
    date: 'October 1, 2026',
    shortDate: 'THU, OCT 1',
    dayOffset: 4,
    type: 'Consultations',
    title: 'Doctor consultation',
    subtitle: 'General consultation · Dr. Meera Nair',
    icon: 'consultation',
    action: 'View summary',
    details: [
      ['Visit type', 'General consultation'],
      ['Clinician', 'Dr. Meera Nair'],
      ['Clinic', 'Apollo Women’s Health'],
      ['Follow-up', 'Not required'],
    ],
    note: 'Discussed recent sleep patterns and routine blood work.',
  },
  {
    id: 4,
    date: 'September 28, 2026',
    shortDate: 'MON, SEP 28',
    dayOffset: 7,
    type: 'Periods',
    title: 'Period started',
    subtitle: 'Cycle day 1 · Medium flow',
    icon: 'period',
    action: 'View period',
    details: [
      ['Cycle day', '1'],
      ['Flow', 'Medium'],
      ['Symptoms', 'Mild cramps, fatigue'],
      ['Cycle length', '29 days'],
    ],
  },
  {
    id: 5,
    date: 'September 21, 2026',
    shortDate: 'MON, SEP 21',
    dayOffset: 14,
    type: 'Health Records',
    title: 'Blood test report added',
    subtitle: 'Complete Blood Count · Apollo Diagnostics',
    icon: 'vault',
    action: 'View record',
    details: [
      ['Record type', 'Lab report'],
      ['Test', 'Complete Blood Count'],
      ['Provider', 'Apollo Diagnostics'],
      ['Files', '1 PDF'],
    ],
  },
  {
    id: 6,
    date: 'September 12, 2026',
    shortDate: 'SAT, SEP 12',
    dayOffset: 23,
    type: 'Notes',
    title: 'Health note',
    subtitle: 'Started a new evening routine',
    icon: 'note',
    action: 'Read note',
    details: [['Recorded', '8:40 PM']],
    note: 'Trying an earlier dinner and a screen-free hour before bed for the next two weeks.',
  },
];

export const timelineFilters: Array<'All' | TimelineEventType> = [
  'All',
  'Check-ins',
  'Symptoms',
  'Periods',
  'Consultations',
  'Health Records',
];
