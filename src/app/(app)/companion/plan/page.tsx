'use client';

import { AICompanion } from '@/components/companion/AICompanion';
import { useNavigate } from '@/lib/useNavigate';

export default function PlanPage() {
  const onNavigate = useNavigate();
  return (
    <AICompanion
      initialMode="Create Nutrition & Lifestyle Plan"
      onNavigate={onNavigate}
    />
  );
}
