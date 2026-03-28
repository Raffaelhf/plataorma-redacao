import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { normalizeWhatsAppNumber } from '@/lib/phone';
import { prisma } from '@/lib/prisma';

const SETTINGS_ID = 'platform';

function asOptionalString(value: unknown) {
  const normalized = String(value ?? '').trim();
  return normalized ? normalized : null;
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
    },
  );
}

export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session?.user || session.user.isActive === false || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
  }

  const body = await req.json();
  const whatsappNumber = normalizeWhatsAppNumber(body.whatsappNumber);

  const settings = await prisma.platformSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {
      bankRecipientName: asOptionalString(body.bankRecipientName),
      bankDocument: asOptionalString(body.bankDocument),
      bankName: asOptionalString(body.bankName),
      bankAgency: asOptionalString(body.bankAgency),
      bankAccount: asOptionalString(body.bankAccount),
      pixKey: asOptionalString(body.pixKey),
      whatsappNumber: asOptionalString(whatsappNumber),
      paymentNotes: asOptionalString(body.paymentNotes),
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
    },
  });

  return NextResponse.json(settings);
}
