import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type VaultRecordType =
  | 'Lab report'
  | 'Imaging'
  | 'Prescription'
  | 'Doctor note'
  | 'Vaccination'
  | 'Other';

export type VaultRecord = {
  id: number;
  name: string;
  type: VaultRecordType;
  date: string;
  isoDate: string;
  added: string;
  related?: string;
  notes?: string;
  format: 'PDF' | 'JPG' | 'PNG';
};

export const startingVaultRecords: VaultRecord[] = [
  {
    id: 1,
    name: 'Complete Blood Count',
    type: 'Lab report',
    date: 'September 18, 2026',
    isoDate: '2026-09-18',
    added: 'September 19, 2026',
    related: 'General consultation · Dr. Meera Nair',
    notes: 'Routine blood work requested during my September consultation.',
    format: 'PDF',
  },
  {
    id: 2,
    name: 'Prescription — General Consultation',
    type: 'Prescription',
    date: 'September 12, 2026',
    isoDate: '2026-09-12',
    added: 'September 12, 2026',
    related: 'General consultation · Dr. Meera Nair',
    format: 'JPG',
  },
  {
    id: 3,
    name: 'Ultrasound Report',
    type: 'Imaging',
    date: 'August 26, 2026',
    isoDate: '2026-08-26',
    added: 'August 28, 2026',
    related: 'Women’s wellness visit · Dr. Rhea Kapoor',
    notes: 'Report and images shared by the imaging centre.',
    format: 'PDF',
  },
  {
    id: 4,
    name: 'Vitamin & Iron Panel',
    type: 'Lab report',
    date: 'August 14, 2026',
    isoDate: '2026-08-14',
    added: 'August 15, 2026',
    format: 'PDF',
  },
  {
    id: 5,
    name: 'Vaccination Record',
    type: 'Vaccination',
    date: 'July 30, 2026',
    isoDate: '2026-07-30',
    added: 'July 30, 2026',
    notes: 'Updated personal vaccination record.',
    format: 'PNG',
  },
  {
    id: 6,
    name: 'Annual Wellness Visit Notes',
    type: 'Doctor note',
    date: 'June 22, 2026',
    isoDate: '2026-06-22',
    added: 'June 23, 2026',
    related: 'Annual wellness visit · Dr. Meera Nair',
    format: 'PDF',
  },
];

export const vaultTypes: VaultRecordType[] = [
  'Lab report',
  'Imaging',
  'Prescription',
  'Doctor note',
  'Vaccination',
  'Other',
];
