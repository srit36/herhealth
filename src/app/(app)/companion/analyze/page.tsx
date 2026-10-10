'use client';

import { AICompanion } from '@/components/companion/AICompanion';
import { useNavigate } from '@/lib/useNavigate';

export default function AnalyzePage() {
  const onNavigate = useNavigate();
  return (
    <AICompanion initialMode="Analyze My Health" onNavigate={onNavigate} />
  );
}
