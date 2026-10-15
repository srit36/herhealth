import { redirect } from 'next/navigation';
import { AppShell } from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { getVerifiedUser } from '@/lib/auth/session';
import { latestConsents, missingRequiredConsents } from '@/lib/consents';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getVerifiedUser();
  if (!user) redirect('/login');

  const rows = await prisma.consentRecord.findMany({
    where: { userId: user.id },
    select: { type: true, granted: true, version: true, createdAt: true },
  });
  if (missingRequiredConsents(latestConsents(rows)).length > 0) {
    redirect('/consent');
  }

  return <AppShell>{children}</AppShell>;
}
