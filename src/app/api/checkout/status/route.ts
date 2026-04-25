import { NextResponse } from 'next/server';
import { getMercadoPagoPayment } from '@/lib/mercadopago';
import { prisma } from '@/lib/prisma';
import { createApprovedUserFromRegistrationSession } from '@/lib/registration';

async function syncPaymentStatus(sessionId: string, paymentId: string) {
  const payment = await getMercadoPagoPayment(paymentId);

  if (payment.status === 'approved') {
    await prisma.registrationSession.update({
      where: { id: sessionId },
      data: {
        providerPaymentId: String(payment.id),
        status: 'APPROVED',
        completedAt: new Date(),
      },
    });

    await createApprovedUserFromRegistrationSession(sessionId);
    return 'APPROVED';
  }

  if (payment.status === 'pending' || payment.status === 'in_process') {
    await prisma.registrationSession.update({
      where: { id: sessionId },
      data: {
        providerPaymentId: String(payment.id),
        status: 'PAYMENT_PENDING',
      },
    });

    return 'PAYMENT_PENDING';
  }

  await prisma.registrationSession.update({
    where: { id: sessionId },
    data: {
      providerPaymentId: String(payment.id),
      status: 'FAILED',
    },
  });

  return 'FAILED';
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token')?.trim();

  if (!token) {
    return NextResponse.json({ error: 'Sessao de checkout nao informada.' }, { status: 400 });
  }

  const session = await prisma.registrationSession.findUnique({
    where: { publicToken: token },
  });

  if (!session) {
    return NextResponse.json({ error: 'Sessao de checkout nao encontrada.' }, { status: 404 });
  }

  let status = session.status;

  if (status === 'PAYMENT_PENDING' && session.providerPaymentId) {
    try {
      status = await syncPaymentStatus(session.id, session.providerPaymentId);
    } catch (error) {
      console.error(error);
    }
  }

  const refreshedSession = await prisma.registrationSession.findUnique({
    where: { id: session.id },
    select: {
      status: true,
      createdUserId: true,
    },
  });

  const currentStatus = refreshedSession?.status ?? status;

  return NextResponse.json({
    status: currentStatus,
    approved: currentStatus === 'APPROVED' && Boolean(refreshedSession?.createdUserId),
    redirectUrl: currentStatus === 'APPROVED' ? '/login?callbackUrl=/dashboard/aluno&checkout=approved' : null,
  });
}
