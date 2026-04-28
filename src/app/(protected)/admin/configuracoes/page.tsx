import { redirect } from 'next/navigation';
import { AdminConfiguracoes } from '@/components/mockups/escreva-mais/AdminConfiguracoes';
import { getAuthSession } from '@/lib/auth';
import { MENTORING_PLAN_PRICE_IN_CENTS, READING_CLUB_PRICE_IN_CENTS, STUDENT_PLAN_CATALOG } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

export default async function AdminSettingsPage() {
  const session = await getAuthSession();
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login');

  const settings = await prisma.platformSettings.findUnique({
    where: { id: 'platform' },
    select: {
      mensalPlanPriceInCents: true,
      trimestralPlanPriceInCents: true,
      semestralPlanPriceInCents: true,
      anualPlanPriceInCents: true,
      mentoriaPlanPriceInCents: true,
      readingClubPriceInCents: true,
    },
  });

  return (
    <AdminConfiguracoes
      initialPricing={{
        mensalPlanPriceInCents: settings?.mensalPlanPriceInCents ?? STUDENT_PLAN_CATALOG.MENSAL.amountInCents,
        trimestralPlanPriceInCents: settings?.trimestralPlanPriceInCents ?? STUDENT_PLAN_CATALOG.TRIMESTRAL.amountInCents,
        semestralPlanPriceInCents: settings?.semestralPlanPriceInCents ?? STUDENT_PLAN_CATALOG.SEMESTRAL.amountInCents,
        anualPlanPriceInCents: settings?.anualPlanPriceInCents ?? STUDENT_PLAN_CATALOG.ANUAL.amountInCents,
        mentoriaPlanPriceInCents: settings?.mentoriaPlanPriceInCents ?? MENTORING_PLAN_PRICE_IN_CENTS,
        readingClubPriceInCents: settings?.readingClubPriceInCents ?? READING_CLUB_PRICE_IN_CENTS,
      }}
    />
  );
}
