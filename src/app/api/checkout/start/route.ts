import { NextResponse } from 'next/server';
import type { PaymentMethod } from '@/generated/prisma';
import { getAppUrl } from '@/lib/app-url';
import { MercadoPagoApiError, createMercadoPagoPixPayment, createMercadoPagoPreference } from '@/lib/mercadopago';
import { calculateDiscountedMentoringPrice, formatCurrencyFromCents, getMentoringPriceFromSettings, getPlatformPlanSettings, getReadingClubPriceInCents, getStudentPlanCatalog } from '@/lib/plans';
import { prisma } from '@/lib/prisma';

type CheckoutPaymentMethod = Exclude<PaymentMethod, 'DEBIT_CARD'>;

const allowedMethods: CheckoutPaymentMethod[] = ['PIX', 'CREDIT_CARD', 'BOLETO'];

function isAllowedPaymentMethod(paymentMethod: PaymentMethod): paymentMethod is CheckoutPaymentMethod {
  return allowedMethods.includes(paymentMethod as CheckoutPaymentMethod);
}

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

    if (!isAllowedPaymentMethod(selectedPaymentMethod)) {
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

    const [catalog, readingClubPriceInCents, settings] = await Promise.all([getStudentPlanCatalog(), getReadingClubPriceInCents(), getPlatformPlanSettings()]);
    const plan = catalog[session.plan];
    const mentoringPriceInCents = calculateDiscountedMentoringPrice(session.plan, getMentoringPriceFromSettings(settings));
    const descriptionParts = [plan.label];
    if (session.readingClub) descriptionParts.push(`Clube de Leitura (${formatCurrencyFromCents(readingClubPriceInCents)})`);
    if (session.mentoring) descriptionParts.push(`Mentoria (${formatCurrencyFromCents(mentoringPriceInCents)})`);
    const description = descriptionParts.join(' + ');

    if (selectedPaymentMethod === 'PIX') {
      const payment = await createMercadoPagoPixPayment({
        description: `Assinatura ${description} - Escreva Mais`,
        amountInCents: session.amountInCents,
        payerEmail: session.email,
        externalReference: session.id,
        notificationUrl: `${baseUrl}/api/payments/mercadopago`,
      });

      const transactionData = payment.point_of_interaction?.transaction_data;
      const qrCode = transactionData?.qr_code;
      const qrCodeBase64 = transactionData?.qr_code_base64;
      const ticketUrl = transactionData?.ticket_url;

      if (!qrCode && !qrCodeBase64 && !ticketUrl) {
        throw new Error('Mercado Pago nao retornou os dados do Pix.');
      }

      await prisma.registrationSession.update({
        where: { id: session.id },
        data: {
          acceptedPrivacyPolicy,
          acceptedTerms,
          selectedPaymentMethod,
          provider: 'MERCADO_PAGO',
          providerPreferenceId: null,
          providerPaymentId: String(payment.id),
          checkoutUrl: ticketUrl || null,
          status: 'PAYMENT_PENDING',
        },
      });

      return NextResponse.json({
        pix: {
          paymentId: String(payment.id),
          qrCode,
          qrCodeBase64,
          ticketUrl,
        },
      });
    }

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
    let message = 'Não foi possível iniciar o pagamento.';

    if (error instanceof Error && error.message === 'MERCADOPAGO_ACCESS_TOKEN não configurado.') {
      message = 'O checkout ainda não está configurado. Defina MERCADOPAGO_ACCESS_TOKEN no ambiente para liberar o pagamento.';
    }

    if (error instanceof MercadoPagoApiError && error.hasMessage('Unauthorized use of live credentials')) {
      message =
        'As credenciais do Mercado Pago não estão liberadas para gerar Pix. Ative as credenciais de produção, confirme o escopo de pagamentos e cadastre uma chave Pix na conta Mercado Pago.';
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
