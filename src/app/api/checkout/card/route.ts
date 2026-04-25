import { NextResponse } from 'next/server';
import { createMercadoPagoCardPayment, MercadoPagoApiError } from '@/lib/mercadopago';
import { getAppUrl } from '@/lib/app-url';
import {
  calculateDiscountedMentoringPrice,
  formatCurrencyFromCents,
  getMentoringPriceFromSettings,
  getPlatformPlanSettings,
  getReadingClubPriceInCents,
  getStudentPlanCatalog,
} from '@/lib/plans';
import { prisma } from '@/lib/prisma';
import { createApprovedUserFromRegistrationSession } from '@/lib/registration';

const MIN_CARD_PAYMENT_AMOUNT_IN_CENTS = 100;

type CardPaymentFormData = {
  token?: string;
  issuer_id?: string | number | null;
  payment_method_id?: string;
  installments?: number;
  payer?: {
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

function getStoredPaymentMethod(paymentTypeId?: string): 'CREDIT_CARD' | 'DEBIT_CARD' {
  return paymentTypeId === 'debit_card' ? 'DEBIT_CARD' : 'CREDIT_CARD';
}

function getCardPaymentErrorMessage(statusDetail?: string | null) {
  const messages: Record<string, string> = {
    cc_rejected_bad_filled_card_number: 'Número do cartão inválido. Revise os dígitos e tente novamente.',
    cc_rejected_bad_filled_date: 'Data de vencimento inválida. Use o formato MM/AA.',
    cc_rejected_bad_filled_security_code: 'Código de segurança inválido. Revise o CVV.',
    cc_rejected_bad_filled_other: 'Dados do cartão inválidos. Revise as informações e tente novamente.',
    cc_rejected_call_for_authorize: 'O banco do cartão pediu autorização da compra. Entre em contato com o banco ou use outro cartão.',
    cc_rejected_card_disabled: 'Cartão desabilitado. Use outro cartão ou fale com o banco emissor.',
    cc_rejected_duplicated_payment: 'O Mercado Pago identificou uma tentativa de pagamento duplicada.',
    cc_rejected_high_risk: 'Pagamento recusado pela análise de segurança do Mercado Pago.',
    cc_rejected_insufficient_amount: 'Limite ou saldo insuficiente no cartão.',
    cc_rejected_invalid_installments: 'Número de parcelas inválido para este cartão.',
    cc_rejected_max_attempts: 'Limite de tentativas excedido. Aguarde alguns minutos ou use outro cartão.',
    cc_rejected_other_reason: 'Pagamento recusado pelo Mercado Pago ou pelo banco emissor.',
  };

  return statusDetail ? messages[statusDetail] ?? `Pagamento recusado. Detalhe: ${statusDetail}.` : 'O pagamento não foi aprovado. Revise os dados do cartão ou escolha Pix.';
}

function getMercadoPagoApiErrorMessage(error: MercadoPagoApiError) {
  const payload = error.getPayload();
  const details = payload?.cause?.map((cause) => cause.description).filter(Boolean).join(' ');
  const rawMessage = [payload?.message, details].filter(Boolean).join(' ');
  const normalizedMessage = rawMessage.toLowerCase();

  if (error.status === 401 || normalizedMessage.includes('access_token')) {
    return 'Credenciais do Mercado Pago inválidas. Confira o MERCADOPAGO_ACCESS_TOKEN na Vercel.';
  }

  if (normalizedMessage.includes('test') || normalizedMessage.includes('sandbox')) {
    return 'Para usar cartão de teste, configure as credenciais TEST do Mercado Pago. Com credenciais de produção, use um cartão real.';
  }

  if (rawMessage) {
    return `Mercado Pago recusou o cartão: ${rawMessage}`;
  }

  return 'Mercado Pago recusou o processamento do cartão. Revise as credenciais e os dados informados.';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token || '').trim();
    const acceptedPrivacyPolicy = Boolean(body.acceptedPrivacyPolicy);
    const acceptedTerms = Boolean(body.acceptedTerms);
    const formData = (body.formData || {}) as CardPaymentFormData;

    if (!token) {
      return NextResponse.json({ error: 'Sessão de checkout não informada.' }, { status: 400 });
    }

    if (!acceptedPrivacyPolicy || !acceptedTerms) {
      return NextResponse.json({ error: 'Você precisa aceitar a política de privacidade e os termos para continuar.' }, { status: 400 });
    }

    if (!formData.token || !formData.payment_method_id || !formData.installments) {
      return NextResponse.json({ error: 'Dados do cartão incompletos. Revise as informações e tente novamente.' }, { status: 400 });
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

    if (session.amountInCents < MIN_CARD_PAYMENT_AMOUNT_IN_CENTS) {
      return NextResponse.json({ error: 'Pagamento por cartão está disponível a partir de R$ 1,00.' }, { status: 400 });
    }

    const baseUrl = getAppUrl();
    if (!baseUrl) {
      return NextResponse.json({ error: 'Não foi possível identificar a URL pública da aplicação.' }, { status: 500 });
    }

    const [catalog, readingClubPriceInCents, settings] = await Promise.all([
      getStudentPlanCatalog(),
      getReadingClubPriceInCents(),
      getPlatformPlanSettings(),
    ]);
    const plan = catalog[session.plan];
    const mentoringPriceInCents = calculateDiscountedMentoringPrice(session.plan, getMentoringPriceFromSettings(settings));
    const descriptionParts = [plan.label];
    if (session.readingClub) descriptionParts.push(`Clube de Leitura (${formatCurrencyFromCents(readingClubPriceInCents)})`);
    if (session.mentoring) descriptionParts.push(`Mentoria (${formatCurrencyFromCents(mentoringPriceInCents)})`);
    const description = descriptionParts.join(' + ');

    const payment = await createMercadoPagoCardPayment({
      token: formData.token,
      issuerId: formData.issuer_id,
      paymentMethodId: formData.payment_method_id,
      installments: Number(formData.installments),
      description: `Assinatura ${description} - Escreva Mais`,
      amountInCents: session.amountInCents,
      payerEmail: session.email,
      payerIdentification: formData.payer?.identification,
      externalReference: session.id,
      notificationUrl: `${baseUrl}/api/payments/mercadopago`,
    });

    if (payment.status === 'approved') {
      await prisma.registrationSession.update({
        where: { id: session.id },
        data: {
          acceptedPrivacyPolicy,
          acceptedTerms,
          selectedPaymentMethod: getStoredPaymentMethod(payment.payment_type_id),
          provider: 'MERCADO_PAGO',
          providerPreferenceId: null,
          providerPaymentId: String(payment.id),
          checkoutUrl: null,
          status: 'APPROVED',
          completedAt: new Date(),
        },
      });

      await createApprovedUserFromRegistrationSession(session.id);

      return NextResponse.json({
        status: 'APPROVED',
        paymentId: String(payment.id),
        redirectUrl: '/login?callbackUrl=/dashboard/aluno&checkout=approved',
      });
    }

    if (payment.status === 'pending' || payment.status === 'in_process') {
      await prisma.registrationSession.update({
        where: { id: session.id },
        data: {
          acceptedPrivacyPolicy,
          acceptedTerms,
          selectedPaymentMethod: getStoredPaymentMethod(payment.payment_type_id),
          provider: 'MERCADO_PAGO',
          providerPreferenceId: null,
          providerPaymentId: String(payment.id),
          checkoutUrl: null,
          status: 'PAYMENT_PENDING',
        },
      });

      return NextResponse.json({
        status: 'PAYMENT_PENDING',
        paymentId: String(payment.id),
      });
    }

    await prisma.registrationSession.update({
      where: { id: session.id },
      data: {
        acceptedPrivacyPolicy,
        acceptedTerms,
        selectedPaymentMethod: getStoredPaymentMethod(payment.payment_type_id),
        provider: 'MERCADO_PAGO',
        providerPreferenceId: null,
        providerPaymentId: String(payment.id),
        checkoutUrl: null,
        status: 'FAILED',
      },
    });

    return NextResponse.json(
      {
        error: getCardPaymentErrorMessage(payment.status_detail),
        status: 'FAILED',
        statusDetail: payment.status_detail,
      },
      { status: 402 },
    );
  } catch (error) {
    console.error(error);
    let message = 'Não foi possível processar o pagamento com cartão.';

    if (error instanceof Error && error.message === 'MERCADOPAGO_ACCESS_TOKEN não configurado.') {
      message = 'O checkout ainda não está configurado. Defina MERCADOPAGO_ACCESS_TOKEN no ambiente para liberar o pagamento.';
    }

    if (error instanceof MercadoPagoApiError) {
      console.error('Mercado Pago card payment error', {
        status: error.status,
        payload: error.payload,
      });
      message = getMercadoPagoApiErrorMessage(error);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
