import type { ReactNode } from 'react';

export type IconName =
  | 'home'
  | 'check'
  | 'timeline'
  | 'period'
  | 'insights'
  | 'nutrition'
  | 'vault'
  | 'consultation'
  | 'settings'
  | 'collapse'
  | 'bell'
  | 'moon'
  | 'mood'
  | 'energy'
  | 'stress'
  | 'arrow'
  | 'spark'
  | 'calendar'
  | 'note'
  | 'close'
  | 'chevronLeft'
  | 'chevronRight'
  | 'search'
  | 'filter'
  | 'plus'
  | 'lock'
  | 'upload'
  | 'dots'
  | 'download'
  | 'trash';

const iconPaths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.5 12 3l8.5 7.5" />
      <path d="M5.5 9.5V21h13V9.5M9.5 21v-6h5v6" />
    </>
  ),
  check: (
    <>
      <path d="M7 3v3M17 3v3M4 9h16" />
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="m8.5 15 2.3 2.3 4.9-5" />
    </>
  ),
  timeline: (
    <>
      <path d="M6 3v18" />
      <circle cx="6" cy="7" r="2" />
      <circle cx="6" cy="16" r="2" />
      <path d="M11 7h9M11 16h6" />
    </>
  ),
  period: <path d="M12 3.5s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z" />,
  insights: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19V3" />
      <path d="m3 7 6-4 6 6 6-7" />
    </>
  ),
  nutrition: (
    <>
      <path d="M12 21c5-2.2 7-7.2 6-15-7-1-12 3-12 9 0 3.5 2.3 5.5 6 6Z" />
      <path d="M6 21c2.1-5.7 5.8-9.3 11-11" />
    </>
  ),
  vault: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 5V3h8v2M9 12h6M12 9v6" />
    </>
  ),
  consultation: (
    <>
      <path d="M4 5h16v12H9l-5 4V5Z" />
      <path d="M9 10h6M12 7v6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  collapse: <path d="m14 6-6 6 6 6" />,
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </>
  ),
  moon: <path d="M20 15.2A8.5 8.5 0 1 1 8.8 4 7 7 0 0 0 20 15.2Z" />,
  mood: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 14.5s1.3 2 3.5 2 3.5-2 3.5-2M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  energy: <path d="M13 2 5 14h7l-1 8 8-12h-7l1-8Z" />,
  stress: (
    <>
      <path d="M12 3v18M5.6 6.5l12.8 11M18.4 6.5l-12.8 11" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  spark: (
    <>
      <path d="m12 2 1.3 4.7L18 8l-4.7 1.3L12 14l-1.3-4.7L6 8l4.7-1.3L12 2Z" />
      <path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </>
  ),
  note: (
    <>
      <path d="M5 3h10l4 4v14H5V3Z" />
      <path d="M14 3v5h5M8 12h8M8 16h6" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  plus: <path d="M12 5v14M5 12h14" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="3" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M5 15v5h14v-5" />
    </>
  ),
  dots: (
    <>
      <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {iconPaths[name]}
    </svg>
  );
}
