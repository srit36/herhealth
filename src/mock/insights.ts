import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type InsightDetail = {
  title: string;
  label: string;
  noticed: string;
  tracking: string;
  values: number[];
  secondValues?: number[];
};

export const insightDetails: Record<string, InsightDetail> = {
  sleep: {
    title: 'Sleep trend',
    label: 'Based on your recent check-ins',
    noticed:
      'Your average sleep over the last 7 days was about 6h 35m, compared with your usual 7h 20m.',
    tracking:
      'Continue logging your sleep, mood, energy, and stress to see whether the change continues.',
    values: [72, 58, 64, 49, 54, 67, 57],
  },
  'sleep-energy': {
    title: 'Sleep & Energy',
    label: 'Pattern across 24 check-ins',
    noticed:
      'On 8 of the 10 days when you slept 7 hours or more, your energy rating was 7 or higher.',
    tracking:
      'Continue logging sleep and energy to see whether this pattern remains consistent.',
    values: [62, 78, 55, 83, 70, 88, 76],
    secondValues: [58, 82, 51, 79, 67, 91, 74],
  },
  'stress-mood': {
    title: 'Stress & Mood',
    label: 'Pattern across 18 check-ins',
    noticed:
      'Higher-stress days appeared alongside lower mood ratings on 5 occasions this month.',
    tracking:
      'Keep tracking both factors to learn whether this pattern appears again over time.',
    values: [38, 52, 73, 46, 81, 58, 42],
    secondValues: [76, 65, 42, 70, 35, 53, 74],
  },
  'cycle-symptoms': {
    title: 'Cycle & Symptoms',
    label: 'Based on your last 2 cycles',
    noticed:
      'You logged fatigue and cramps more often around the beginning of your last two periods.',
    tracking:
      'Continue noting symptoms throughout your cycle to build a clearer picture over time.',
    values: [78, 85, 70, 43, 28, 22, 18],
  },
  consistency: {
    title: 'Your consistency',
    label: 'Based on this month',
    noticed:
      'You completed 18 of 24 possible daily check-ins this month, giving you a useful view of recent patterns.',
    tracking:
      'Regular check-ins can make patterns easier to notice, but missing a day is completely okay.',
    values: [100, 100, 0, 100, 100, 100, 0, 100, 100, 100],
  },
  headaches: {
    title: 'Headache entries',
    label: 'Based on the last 30 days',
    noticed: 'You logged headaches on four days during the last 30 days.',
    tracking:
      'If this continues, consider discussing the pattern and your timeline entries with a healthcare professional.',
    values: [0, 62, 0, 0, 77, 0, 48, 0, 0, 69],
  },
};

export const insightTrendData: Record<
  'Sleep' | 'Mood' | 'Energy' | 'Stress',
  { value: string; change: string; direction: string; points: number[] }
> = {
  Sleep: {
    value: '7h 20m average',
    change: '18 min vs previous period',
    direction: 'up',
    points: [62, 68, 58, 72, 65, 79, 70, 76, 68, 81, 74, 78],
  },
  Mood: {
    value: 'Good average',
    change: 'Stable',
    direction: 'stable',
    points: [66, 68, 65, 70, 72, 69, 71, 68, 73, 70, 72, 71],
  },
  Energy: {
    value: '7.1 / 10',
    change: '0.6 vs previous period',
    direction: 'up',
    points: [54, 62, 58, 69, 64, 72, 67, 78, 74, 80, 71, 76],
  },
  Stress: {
    value: 'Low–moderate',
    change: 'slightly',
    direction: 'down',
    points: [70, 62, 66, 54, 58, 50, 56, 45, 48, 42, 46, 39],
  },
};
