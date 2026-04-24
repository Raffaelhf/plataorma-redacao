import type { PlatformSettings, StudentPlan } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';

const SETTINGS_ID = 'platform';

export const READING_CLUB_PRICE_IN_CENTS = 3000;
export const MENTORING_PLAN_PRICE_IN_CENTS = 12000;

export const MENTORING_DISCOUNT_BY_PLAN = {
  MENSAL: 0,
  TRIMESTRAL: 10,
  SEMESTRAL: 15,
  ANUAL: 20,
} as const satisfies Record<StudentPlan, number>;

type PlanPriceSettings = Pick<
  PlatformSettings,
  | 'mensalPlanPriceInCents'
  | 'trimestralPlanPriceInCents'
  | 'semestralPlanPriceInCents'
  | 'anualPlanPriceInCents'
  | 'mentoriaPlanPriceInCents'
  | 'readingClubPriceInCents'
>;

const planPriceFields = {
  MENSAL: 'mensalPlanPriceInCents',
  TRIMESTRAL: 'trimestralPlanPriceInCents',
  SEMESTRAL: 'semestralPlanPriceInCents',
  ANUAL: 'anualPlanPriceInCents',
} as const satisfies Record<StudentPlan, keyof PlanPriceSettings>;

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

function amountOrFallback(amount: number | null | undefined, fallback: number) {
  return typeof amount === 'number' && Number.isFinite(amount) && amount >= 0 ? amount : fallback;
}

export function getStudentPlanCatalogFromSettings(settings?: Partial<PlanPriceSettings> | null) {
  return Object.fromEntries(
    Object.entries(STUDENT_PLAN_CATALOG).map(([plan, details]) => {
      const field = planPriceFields[plan as StudentPlan];
      return [
        plan,
        {
          ...details,
          amountInCents: amountOrFallback(settings?.[field], details.amountInCents),
        },
      ];
    }),
  ) as typeof STUDENT_PLAN_CATALOG;
}

export function getReadingClubPriceFromSettings(settings?: Partial<PlanPriceSettings> | null) {
  return amountOrFallback(settings?.readingClubPriceInCents, READING_CLUB_PRICE_IN_CENTS);
}

export function getMentoringPriceFromSettings(settings?: Partial<PlanPriceSettings> | null) {
  const amount = settings?.mentoriaPlanPriceInCents;
  return typeof amount === 'number' && Number.isFinite(amount) && amount > 0 ? amount : MENTORING_PLAN_PRICE_IN_CENTS;
}

export function calculateDiscountedMentoringPrice(plan: StudentPlan, mentoringPriceInCents: number) {
  const discountPercent = MENTORING_DISCOUNT_BY_PLAN[plan];
  return Math.round((mentoringPriceInCents * (100 - discountPercent)) / 100);
}

export async function getPlatformPlanSettings() {
  return prisma.platformSettings.findUnique({
    where: { id: SETTINGS_ID },
    select: {
      mensalPlanPriceInCents: true,
      trimestralPlanPriceInCents: true,
      semestralPlanPriceInCents: true,
      anualPlanPriceInCents: true,
      mentoriaPlanPriceInCents: true,
      readingClubPriceInCents: true,
    },
  });
}

export async function getStudentPlanCatalog() {
  const settings = await getPlatformPlanSettings();
  return getStudentPlanCatalogFromSettings(settings);
}

export async function getReadingClubPriceInCents() {
  const settings = await getPlatformPlanSettings();
  return getReadingClubPriceFromSettings(settings);
}

export async function getPublicPlanPricing() {
  const settings = await getPlatformPlanSettings();
  const catalog = getStudentPlanCatalogFromSettings(settings);

  return {
    readingClubPriceInCents: getReadingClubPriceFromSettings(settings),
    mentoringPriceInCents: getMentoringPriceFromSettings(settings),
    mentoringPackages: {
      mensal: calculateDiscountedMentoringPrice('MENSAL', getMentoringPriceFromSettings(settings)),
      trimestral: calculateDiscountedMentoringPrice('TRIMESTRAL', getMentoringPriceFromSettings(settings)),
      semestral: calculateDiscountedMentoringPrice('SEMESTRAL', getMentoringPriceFromSettings(settings)),
      anual: calculateDiscountedMentoringPrice('ANUAL', getMentoringPriceFromSettings(settings)),
    },
    mentoringDiscounts: {
      mensal: MENTORING_DISCOUNT_BY_PLAN.MENSAL,
      trimestral: MENTORING_DISCOUNT_BY_PLAN.TRIMESTRAL,
      semestral: MENTORING_DISCOUNT_BY_PLAN.SEMESTRAL,
      anual: MENTORING_DISCOUNT_BY_PLAN.ANUAL,
    },
    plans: {
      mensal: catalog.MENSAL.amountInCents,
      trimestral: catalog.TRIMESTRAL.amountInCents,
      semestral: catalog.SEMESTRAL.amountInCents,
      anual: catalog.ANUAL.amountInCents,
      mentoria: getMentoringPriceFromSettings(settings),
    },
  };
}

export function getStudentPlanFromSlug(slug?: string | null): StudentPlan | null {
  if (slug === 'mensal') return 'MENSAL';
  if (slug === 'trimestral') return 'TRIMESTRAL';
  if (slug === 'semestral') return 'SEMESTRAL';
  if (slug === 'anual') return 'ANUAL';
  return null;
}

export async function calculateStudentCheckoutAmount(plan: StudentPlan, readingClub: boolean, mentoring = false) {
  const [catalog, settings] = await Promise.all([getStudentPlanCatalog(), getPlatformPlanSettings()]);
  const baseAmount = catalog[plan].amountInCents;
  const readingClubAmount = readingClub ? getReadingClubPriceFromSettings(settings) : 0;
  const mentoringAmount = mentoring ? calculateDiscountedMentoringPrice(plan, getMentoringPriceFromSettings(settings)) : 0;
  return baseAmount + readingClubAmount + mentoringAmount;
}
