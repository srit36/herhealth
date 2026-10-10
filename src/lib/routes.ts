/** Design page name -> URL. Page code keeps calling onNavigate("Page Name"). */
export const routeFor: Record<string, string> = {
  Home: '/',
  'Daily Check-in': '/check-in',
  'Health Timeline': '/timeline',
  Periods: '/periods',
  Insights: '/insights',
  'Ask HerHealth': '/companion/ask',
  'Analyze My Health': '/companion/analyze',
  'Create Nutrition & Lifestyle Plan': '/companion/plan',
  'Nutrition & Lifestyle': '/nutrition',
  'Health Vault': '/vault',
  Consultation: '/consultation',
  Settings: '/settings',
};
