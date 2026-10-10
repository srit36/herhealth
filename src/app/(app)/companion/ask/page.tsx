'use client';

import { AICompanion } from '@/components/companion/AICompanion';
import { useNavigate } from '@/lib/useNavigate';

export default function AskPage() {
  const onNavigate = useNavigate();
  return <AICompanion initialMode="Ask HerHealth" onNavigate={onNavigate} />;
}
