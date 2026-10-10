'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { routeFor } from '@/lib/routes';

/** Returns (pageName) => router.push(route). Drop-in for the design's onNavigate. */
export function useNavigate() {
  const router = useRouter();
  return useCallback(
    (name: string) => {
      const href = routeFor[name];
      if (href) router.push(href);
      else console.warn(`useNavigate: no route for "${name}"`);
    },
    [router],
  );
}
