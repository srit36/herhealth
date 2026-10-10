import type { ReactNode } from 'react';
import type { IconName } from '@/components/Icon';

export type SettingsSection =
  'Account' | 'Privacy & Data' | 'Notifications' | 'Preferences' | 'Security';

export const settingsNavigation: Array<{
  label: SettingsSection;
  icon: IconName;
}> = [
  { label: 'Account', icon: 'mood' },
  { label: 'Privacy & Data', icon: 'lock' },
  { label: 'Notifications', icon: 'bell' },
  { label: 'Preferences', icon: 'settings' },
  { label: 'Security', icon: 'vault' },
];
