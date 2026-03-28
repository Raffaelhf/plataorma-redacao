import { NextResponse } from 'next/server';
import { getMercadoPagoPayment } from '@/lib/mercadopago';
import { prisma } from '@/lib/prisma';
import { createApprovedUserFromRegistrationSession } from '@/lib/registration';

function getPaymentId(body: Record<string, unknown>, req: Request) {
  const url = new URL(req.url);
  const fromBody =
    (body?.data as { id?: string | number } | undefined)?.id ??
    (body?.resource as { id?: string | number } | undefined)?.id ??
    body?.['data.id'];
  const fromQuery = url.searchParams.get('data.id') ?? url.searchParams.get('id');
  const paymentId = fromBody ?? fromQuery;
  return paymentId ? String(paymentId) : null;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const paymentId = getPaymentId(body, req);

    if (!paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = await getMercadoPagoPayment(paymentId);
    const externalReference = payment.external_reference;

    if (!externalReference) {
      return NextResponse.json({ received: true });
    }

    const session = await prisma.registrationSession.findUnique({
      where: { id: externalReference },
    });

    if (!session) {
      return NextResponse.json({ received: true });
    }

    if (payment.status === 'approved') {
      await prisma.registrationSession.update({
        where: { id: session.id },
        data: {
          providerPaymentId: String(payment.id),
          status: 'APPROVED',
          completedAt: new Date(),
        },
      });

      await createApprovedUserFromRegistrationSession(session.id);
    } else if (payment.status === 'pending' || payment.status === 'in_process') {
      await prisma.registrationSession.update({
        where: { id: session.id },
        data: {
          providerPaymentId: String(payment.id),
          status: 'PAYMENT_PENDING',
        },
      });
    } else {
      await prisma.registrationSession.update({
        where: { id: session.id },
        data: {
          providerPaymentId: String(payment.id),
          status: 'FAILED',
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ received: false }, { status: 500 });
  }
}
