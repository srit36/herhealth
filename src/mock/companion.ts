import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type AIMode =
  'Ask HerHealth' | 'Analyze My Health' | 'Create Nutrition & Lifestyle Plan';
export type AIViewState =
  'home' | 'conversation' | 'loading' | 'error' | 'insufficient' | 'emergency';

export const aiCapabilities: Array<{
  mode: AIMode;
  icon: IconName;
  description: string;
  action: string;
}> = [
  {
    mode: 'Ask HerHealth',
    icon: 'consultation',
    description:
      'Ask questions about your health information and everyday wellbeing.',
    action: 'Ask HerHealth',
  },
  {
    mode: 'Analyze My Health',
    icon: 'insights',
    description:
      'Explore your health records, recent trends, and patterns in one place.',
    action: 'Analyze my health',
  },
  {
    mode: 'Create Nutrition & Lifestyle Plan',
    icon: 'nutrition',
    description:
      'Build a practical plan based on your goals and the information you’ve tracked.',
    action: 'Create a plan',
  },
];

export const aiSuggestedQuestions = [
  'Why has my energy been lower this week?',
  'What patterns have you noticed in my sleep?',
  'Have I logged headaches more often recently?',
  'What should I discuss at my next consultation?',
  'Can you help me understand my recent health information?',
  'What could I focus on this week?',
];
