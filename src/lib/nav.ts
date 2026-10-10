import type { IconName } from '@/components/Icon';

export const navGroups: Array<{
  label?: string;
  items: Array<{ label: string; icon: IconName; route: string }>;
}> = [
  { items: [{ label: 'Home', icon: 'home', route: '/' }] },
  {
    label: 'Track',
    items: [
      { label: 'Daily Check-in', icon: 'check', route: '/check-in' },
      { label: 'Health Timeline', icon: 'timeline', route: '/timeline' },
      { label: 'Periods', icon: 'period', route: '/periods' },
    ],
  },
  {
    label: 'Understand',
    items: [{ label: 'Insights', icon: 'insights', route: '/insights' }],
  },
  {
    label: 'AI Companion',
    items: [
      { label: 'Ask HerHealth', icon: 'consultation', route: '/companion/ask' },
      {
        label: 'Analyze My Health',
        icon: 'insights',
        route: '/companion/analyze',
      },
      {
        label: 'Create Nutrition & Lifestyle Plan',
        icon: 'nutrition',
        route: '/companion/plan',
      },
    ],
  },
  {
    label: 'Wellness',
    items: [
      {
        label: 'Nutrition & Lifestyle',
        icon: 'nutrition',
        route: '/nutrition',
      },
    ],
  },
  {
    label: 'Health records',
    items: [{ label: 'Health Vault', icon: 'vault', route: '/vault' }],
  },
  {
    label: 'Care',
    items: [
      { label: 'Consultation', icon: 'consultation', route: '/consultation' },
    ],
  },
];
