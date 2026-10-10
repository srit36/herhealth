import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type FlowLevel = 'None' | 'Spotting' | 'Light' | 'Medium' | 'Heavy';

export type DayLog = {
  flow: FlowLevel;
  symptoms: string[];
  mood: number | null;
  note: string;
};

export const emptyLog = (): DayLog => ({
  flow: 'None',
  symptoms: [],
  mood: null,
  note: '',
});

export const initialPeriodLogs: Record<number, DayLog> = {
  1: { flow: 'Medium', symptoms: ['Cramps', 'Fatigue'], mood: 2, note: '' },
  2: { flow: 'Heavy', symptoms: ['Cramps', 'Back pain'], mood: 2, note: '' },
  3: {
    flow: 'Medium',
    symptoms: ['Bloating'],
    mood: 3,
    note: 'Used a heat pack.',
  },
  4: { flow: 'Light', symptoms: ['Fatigue'], mood: 3, note: '' },
  5: { flow: 'Spotting', symptoms: [], mood: 4, note: '' },
  8: { flow: 'None', symptoms: ['Headache'], mood: 3, note: '' },
  10: {
    flow: 'None',
    symptoms: [],
    mood: 4,
    note: 'Energy felt better today.',
  },
};

export const symptomOptions = [
  'Cramps',
  'Headache',
  'Bloating',
  'Back pain',
  'Fatigue',
  'Breast tenderness',
  'Mood changes',
  'Acne / skin changes',
  'Other',
];

export const moodOptions = ['Very low', 'Low', 'Okay', 'Good', 'Great'];
