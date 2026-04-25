import { randomUUID } from 'crypto';
import type { PaymentMethod } from '@/generated/prisma';

export class MercadoPagoApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload: string,
  ) {
    super(message);
    this.name = 'MercadoPagoApiError';
  }

  hasMessage(fragment: string) {
    return this.payload.toLowerCase().includes(fragment.toLowerCase());
  }
}

function getAccessToken() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN não configurado.');
  }
  return token;
}

type CheckoutProPaymentMethod = Exclude<PaymentMethod, 'DEBIT_CARD'>;

function getExcludedPaymentTypes(selectedPaymentMethod: CheckoutProPaymentMethod) {
  const allTypes = ['bank_transfer', 'ticket', 'credit_card', 'debit_card'] as const;
  const selectedTypeByMethod: Record<CheckoutProPaymentMethod, (typeof allTypes)[number]> = {
    PIX: 'bank_transfer',
    BOLETO: 'ticket',
    CREDIT_CARD: 'credit_card',
  };

  const selectedType = selectedTypeByMethod[selectedPaymentMethod];
  return allTypes.filter((type) => type !== selectedType).map((id) => ({ id }));
}

type MercadoPagoPreferencePayload = {
  items: Array<{
    id: string;
    title: string;
    description: string;
    quantity: number;
    currency_id: 'BRL';
    unit_price: number;
  }>;
  payer: {
    email: string;
  };
  external_reference: string;
  notification_url: string;
  back_urls: {
    success: string;
    pending: string;
    failure: string;
  };
  auto_return: 'approved';
  payment_methods: {
    excluded_payment_types: Array<{ id: string }>;
  };
  // Do not add purpose: "wallet_purchase"; Mercado Pago uses it to require a registered buyer account.
};

export async function createMercadoPagoPreference({
  title,
  description,
  amountInCents,
  payerEmail,
  externalReference,
  notificationUrl,
  backUrls,
  selectedPaymentMethod,
}: {
  title: string;
  description: string;
  amountInCents: number;
  payerEmail: string;
  externalReference: string;
  notificationUrl: string;
  backUrls: {
    success: string;
    pending: string;
    failure: string;
  };
  selectedPaymentMethod: CheckoutProPaymentMethod;
}) {
  const accessToken = getAccessToken();
  const preferencePayload = {
    items: [
      {
        id: externalReference,
        title,
        description,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: amountInCents / 100,
      },
    ],
    payer: {
      email: payerEmail,
    },
    external_reference: externalReference,
    notification_url: notificationUrl,
    back_urls: backUrls,
    auto_return: 'approved',
    payment_methods: {
      excluded_payment_types: getExcludedPaymentTypes(selectedPaymentMethod),
    },
  } satisfies MercadoPagoPreferencePayload;

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify(preferencePayload),
    cache: 'no-store',
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new MercadoPagoApiError('Falha ao criar preferencia no Mercado Pago.', response.status, payload);
  }

  return response.json() as Promise<{
    id: string;
    init_point: string;
    sandbox_init_point?: string;
  }>;
}

export async function createMercadoPagoPixPayment({
  description,
  amountInCents,
  payerEmail,
  externalReference,
  notificationUrl,
}: {
  description: string;
  amountInCents: number;
  payerEmail: string;
  externalReference: string;
  notificationUrl: string;
}) {
  const accessToken = getAccessToken();
  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': randomUUID(),
    },
    body: JSON.stringify({
      transaction_amount: amountInCents / 100,
      description,
      payment_method_id: 'pix',
      payer: {
        email: payerEmail,
      },
      external_reference: externalReference,
      notification_url: notificationUrl,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new MercadoPagoApiError('Falha ao criar pagamento Pix no Mercado Pago.', response.status, payload);
  }

  return response.json() as Promise<{
    id: number | string;
    status: string;
    external_reference?: string;
    point_of_interaction?: {
      transaction_data?: {
        qr_code?: string;
        qr_code_base64?: string;
        ticket_url?: string;
      };
    };
  }>;
}

export async function getMercadoPagoPayment(paymentId: string) {
  const accessToken = getAccessToken();
  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new MercadoPagoApiError('Falha ao consultar pagamento no Mercado Pago.', response.status, payload);
  }

  return response.json() as Promise<{
    id: number;
    status: string;
    external_reference?: string;
  }>;
}
