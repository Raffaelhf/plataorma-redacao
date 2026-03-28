import { NextResponse } from 'next/server';
import type { PaymentMethod } from '@/generated/prisma';
import { getAppUrl } from '@/lib/app-url';
import { createMercadoPagoPreference } from '@/lib/mercadopago';
import { formatCurrencyFromCents, READING_CLUB_PRICE_IN_CENTS, STUDENT_PLAN_CATALOG } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

const allowedMethods: PaymentMethod[] = ['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token || '').trim();
    const acceptedPrivacyPolicy = Boolean(body.acceptedPrivacyPolicy);
    const acceptedTerms = Boolean(body.acceptedTerms);
    const selectedPaymentMethod = String(body.selectedPaymentMethod || '') as PaymentMethod;

    if (!token) {
      return NextResponse.json({ error: 'Sessão de checkout não informada.' }, { status: 400 });
    }

    if (!acceptedPrivacyPolicy || !acceptedTerms) {
      return NextResponse.json({ error: 'Você precisa aceitar a política de privacidade e os termos para continuar.' }, { status: 400 });
    }

    if (!allowedMethods.includes(selectedPaymentMethod)) {
      return NextResponse.json({ error: 'Selecione um meio de pagamento válido.' }, { status: 400 });
    }

    const session = await prisma.registrationSession.findUnique({
      where: { publicToken: token },
    });

    if (!session || session.status === 'EXPIRED') {
      return NextResponse.json({ error: 'Sessão de checkout não encontrada ou expirada.' }, { status: 404 });
    }

    if (session.role !== 'STUDENT' || !session.plan) {
      return NextResponse.json({ error: 'Apenas cadastros de aluno com plano podem seguir para pagamento.' }, { status: 400 });
    }

    const baseUrl = getAppUrl();
    if (!baseUrl) {
      return NextResponse.json({ error: 'Não foi possível identificar a URL pública da aplicação.' }, { status: 500 });
    }

    const plan = STUDENT_PLAN_CATALOG[session.plan];
    const description = session.readingClub
      ? `${plan.label} + Clube de Leitura (${formatCurrencyFromCents(READING_CLUB_PRICE_IN_CENTS)})`
      : plan.label;

    const preference = await createMercadoPagoPreference({
      title: `Assinatura ${plan.label} - Escreva Mais`,
      description,
      amountInCents: session.amountInCents,
      payerEmail: session.email,
      externalReference: session.id,
      notificationUrl: `${baseUrl}/api/payments/mercadopago`,
      backUrls: {
        success: `${baseUrl}/checkout/${session.publicToken}?state=success`,
        pending: `${baseUrl}/checkout/${session.publicToken}?state=pending`,
        failure: `${baseUrl}/checkout/${session.publicToken}?state=failure`,
      },
      selectedPaymentMethod,
    });

    await prisma.registrationSession.update({
      where: { id: session.id },
      data: {
        acceptedPrivacyPolicy,
        acceptedTerms,
        selectedPaymentMethod,
        provider: 'MERCADO_PAGO',
        providerPreferenceId: preference.id,
        checkoutUrl: preference.init_point,
        status: 'PAYMENT_PENDING',
      },
    });

    return NextResponse.json({ checkoutUrl: preference.init_point });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error && error.message === 'MERCADOPAGO_ACCESS_TOKEN não configurado.'
        ? 'O checkout ainda não está configurado. Defina MERCADOPAGO_ACCESS_TOKEN no ambiente para liberar o pagamento.'
        : 'Não foi possível iniciar o pagamento.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
