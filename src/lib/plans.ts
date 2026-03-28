import type { StudentPlan } from '@/generated/prisma';

export const READING_CLUB_PRICE_IN_CENTS = 3000;

export const STUDENT_PLAN_CATALOG: Record<
  StudentPlan,
  {
    slug: 'mensal' | 'trimestral' | 'semestral' | 'anual';
    label: string;
    amountInCents: number;
    cadenceLabel: string;
  }
> = {
  MENSAL: {
    slug: 'mensal',
    label: 'Mensal',
    amountInCents: 8000,
    cadenceLabel: '/mês',
  },
  TRIMESTRAL: {
    slug: 'trimestral',
    label: 'Trimestral',
    amountInCents: 21800,
    cadenceLabel: '/trimestre',
  },
  SEMESTRAL: {
    slug: 'semestral',
    label: 'Semestral',
    amountInCents: 41300,
    cadenceLabel: '/semestre',
  },
  ANUAL: {
    slug: 'anual',
    label: 'Anual',
    amountInCents: 76800,
    cadenceLabel: '/ano',
  },
};

export function formatCurrencyFromCents(amountInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}

export function getStudentPlanFromSlug(slug?: string | null): StudentPlan | null {
  if (slug === 'mensal') return 'MENSAL';
  if (slug === 'trimestral') return 'TRIMESTRAL';
  if (slug === 'semestral') return 'SEMESTRAL';
  if (slug === 'anual') return 'ANUAL';
  return null;
}

export function calculateStudentCheckoutAmount(plan: StudentPlan, readingClub: boolean) {
  const baseAmount = STUDENT_PLAN_CATALOG[plan].amountInCents;
  return baseAmount + (readingClub ? READING_CLUB_PRICE_IN_CENTS : 0);
}
