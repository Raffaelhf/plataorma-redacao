import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAuthSession } from '@/lib/auth';
import { normalizeWhatsAppNumber } from '@/lib/phone';
import { MENTORING_PLAN_PRICE_IN_CENTS, READING_CLUB_PRICE_IN_CENTS, STUDENT_PLAN_CATALOG } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

const SETTINGS_ID = 'platform';

function asOptionalString(value: unknown) {
  const normalized = String(value ?? '').trim();
  return normalized ? normalized : null;
}

function hasOwn(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function parsePriceInCents(value: unknown, fallback: number) {
  const raw = String(value ?? '').replace('R$', '').trim();
  if (!raw) return fallback;

  const normalized = raw.includes(',')
    ? raw.replace(/\./g, '').replace(',', '.')
    : raw;
  const amount = Number(normalized.replace(/[^0-9.-]/g, ''));

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return Math.round(amount * 100);
}

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const settings = await prisma.platformSettings.findUnique({
    where: { id: SETTINGS_ID },
  });

  return NextResponse.json(
    settings ?? {
      id: SETTINGS_ID,
      bankRecipientName: null,
      bankDocument: null,
      bankName: null,
      bankAgency: null,
      bankAccount: null,
      pixKey: null,
      whatsappNumber: null,
      paymentNotes: null,
      mensalPlanPriceInCents: STUDENT_PLAN_CATALOG.MENSAL.amountInCents,
      trimestralPlanPriceInCents: STUDENT_PLAN_CATALOG.TRIMESTRAL.amountInCents,
      semestralPlanPriceInCents: STUDENT_PLAN_CATALOG.SEMESTRAL.amountInCents,
      anualPlanPriceInCents: STUDENT_PLAN_CATALOG.ANUAL.amountInCents,
      mentoriaPlanPriceInCents: MENTORING_PLAN_PRICE_IN_CENTS,
      readingClubPriceInCents: READING_CLUB_PRICE_IN_CENTS,
    },
  );
}

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json() as Record<string, unknown>;
  const whatsappNumber = hasOwn(body, 'whatsappNumber') ? normalizeWhatsAppNumber(String(body.whatsappNumber ?? '')) : undefined;
  const parsedPlanPrices = {
    mensalPlanPriceInCents: parsePriceInCents(body.mensalPlanPrice, STUDENT_PLAN_CATALOG.MENSAL.amountInCents),
    trimestralPlanPriceInCents: parsePriceInCents(body.trimestralPlanPrice, STUDENT_PLAN_CATALOG.TRIMESTRAL.amountInCents),
    semestralPlanPriceInCents: parsePriceInCents(body.semestralPlanPrice, STUDENT_PLAN_CATALOG.SEMESTRAL.amountInCents),
    anualPlanPriceInCents: parsePriceInCents(body.anualPlanPrice, STUDENT_PLAN_CATALOG.ANUAL.amountInCents),
    mentoriaPlanPriceInCents: parsePriceInCents(body.mentoriaPlanPrice, MENTORING_PLAN_PRICE_IN_CENTS),
    readingClubPriceInCents: parsePriceInCents(body.readingClubPrice, READING_CLUB_PRICE_IN_CENTS),
  };

  if (Object.values(parsedPlanPrices).some((price) => price === null)) {
    return NextResponse.json({ error: 'Informe preços válidos para os planos.' }, { status: 400 });
  }

  const planPrices = {
    mensalPlanPriceInCents: parsedPlanPrices.mensalPlanPriceInCents ?? STUDENT_PLAN_CATALOG.MENSAL.amountInCents,
    trimestralPlanPriceInCents: parsedPlanPrices.trimestralPlanPriceInCents ?? STUDENT_PLAN_CATALOG.TRIMESTRAL.amountInCents,
    semestralPlanPriceInCents: parsedPlanPrices.semestralPlanPriceInCents ?? STUDENT_PLAN_CATALOG.SEMESTRAL.amountInCents,
    anualPlanPriceInCents: parsedPlanPrices.anualPlanPriceInCents ?? STUDENT_PLAN_CATALOG.ANUAL.amountInCents,
    mentoriaPlanPriceInCents: parsedPlanPrices.mentoriaPlanPriceInCents ?? MENTORING_PLAN_PRICE_IN_CENTS,
    readingClubPriceInCents: parsedPlanPrices.readingClubPriceInCents ?? READING_CLUB_PRICE_IN_CENTS,
  };

  const settings = await prisma.platformSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {
      ...(hasOwn(body, 'bankRecipientName') ? { bankRecipientName: asOptionalString(body.bankRecipientName) } : {}),
      ...(hasOwn(body, 'bankDocument') ? { bankDocument: asOptionalString(body.bankDocument) } : {}),
      ...(hasOwn(body, 'bankName') ? { bankName: asOptionalString(body.bankName) } : {}),
      ...(hasOwn(body, 'bankAgency') ? { bankAgency: asOptionalString(body.bankAgency) } : {}),
      ...(hasOwn(body, 'bankAccount') ? { bankAccount: asOptionalString(body.bankAccount) } : {}),
      ...(hasOwn(body, 'pixKey') ? { pixKey: asOptionalString(body.pixKey) } : {}),
      ...(hasOwn(body, 'whatsappNumber') ? { whatsappNumber: asOptionalString(whatsappNumber) } : {}),
      ...(hasOwn(body, 'paymentNotes') ? { paymentNotes: asOptionalString(body.paymentNotes) } : {}),
      ...planPrices,
    },
    create: {
      id: SETTINGS_ID,
      bankRecipientName: asOptionalString(body.bankRecipientName),
      bankDocument: asOptionalString(body.bankDocument),
      bankName: asOptionalString(body.bankName),
      bankAgency: asOptionalString(body.bankAgency),
      bankAccount: asOptionalString(body.bankAccount),
      pixKey: asOptionalString(body.pixKey),
      whatsappNumber: asOptionalString(whatsappNumber),
      paymentNotes: asOptionalString(body.paymentNotes),
      ...planPrices,
    },
  });

  revalidatePath('/', 'page');
  revalidatePath('/cadastro', 'page');
  revalidatePath('/checkout/[token]', 'page');

  return NextResponse.json(settings);
}
