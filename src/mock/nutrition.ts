import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type WellnessPanelMode =
  'food' | 'activity' | 'recommendation' | 'goal' | null;

export type WellnessRecommendation = {
  title: string;
  description: string;
  category: string;
  status: 'In progress' | 'Active';
};

export type WellnessGoal = {
  title: string;
  progress: number;
  total: number;
  unit: string;
  category: string;
};
