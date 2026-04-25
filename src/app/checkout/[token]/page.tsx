import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CircleAlert, CircleCheckBig, Clock3 } from 'lucide-react';
import { RegistrationCheckout } from '@/components/auth/registration-checkout';
import {
  calculateDiscountedMentoringPrice,
  formatCurrencyFromCents,
  getMentoringPriceFromSettings,
  getPlatformPlanSettings,
  getReadingClubPriceInCents,
  getStudentPlanCatalog,
} from '@/lib/plans';
import { prisma } from '@/lib/prisma';

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ state?: string }>;
}) {
  const { token } = await params;
  const { state } = await searchParams;

  const session = await prisma.registrationSession.findUnique({
    where: { publicToken: token },
  });

  if (!session) {
    notFound();
  }

  if (session.role !== 'STUDENT') {
    redirect('/login');
  }

  const [catalog, readingClubPriceInCents, settings] = await Promise.all([
    getStudentPlanCatalog(),
    getReadingClubPriceInCents(),
    getPlatformPlanSettings(),
  ]);
  const plan = session.plan ? catalog[session.plan] : null;
  const mentoringPriceInCents = session.plan
    ? calculateDiscountedMentoringPrice(session.plan, getMentoringPriceFromSettings(settings))
    : 0;
  const planLabel = plan
    ? [plan.label, session.readingClub ? 'Clube de Leitura' : null, session.mentoring ? 'Mentoria' : null].filter(Boolean).join(' + ')
    : null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-6 rounded-[32px] border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f4f2ff_52%,#fff2ea_100%)] p-6 shadow-[0_24px_70px_rgba(74,73,140,0.12)] dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.92)_52%,rgba(49,46,72,0.9))] dark:shadow-[0_24px_70px_rgba(0,0,0,0.34)] sm:p-8">
        <p className="text-sm font-semibold text-[#5a69a1] dark:text-indigo-200">Checkout</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[#22347e] dark:text-white">
          Finalize sua assinatura
        </h1>
        <p className="mt-3 max-w-[56rem] text-sm leading-7 text-[#63719c] dark:text-slate-300">
          O cadastro do aluno permanece pendente ate a confirmacao do pagamento. Os dados do cartao nao sao armazenados pela plataforma.
        </p>
      </section>

      {state === 'success' ? (
        <div className="mb-6 rounded-[26px] border border-[#cfeedd] bg-[#eefbf5] px-5 py-4 text-sm text-[#1b7f62] dark:border-emerald-400/40 dark:bg-emerald-950/35 dark:text-emerald-100">
          <div className="flex items-start gap-3">
            <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Retorno do pagamento recebido</p>
              <p className="mt-1">
                Se o pagamento ja foi confirmado pelo provedor, sua conta sera liberada automaticamente. Pix e boleto podem permanecer pendentes por alguns minutos ou horas.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {state === 'pending' ? (
        <div className="mb-6 rounded-[26px] border border-[#ffe5bf] bg-[#fff7ea] px-5 py-4 text-sm text-[#996515] dark:border-amber-400/40 dark:bg-amber-950/35 dark:text-amber-100">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Pagamento pendente</p>
              <p className="mt-1">Aguardamos a confirmacao do provedor. Assim que aprovado, sua conta sera ativada automaticamente.</p>
            </div>
          </div>
        </div>
      ) : null}

      {state === 'failure' || session.status === 'FAILED' ? (
        <div className="mb-6 rounded-[26px] border border-[#ffd0cf] bg-[#fff1f1] px-5 py-4 text-sm text-[#b14545] dark:border-red-400/40 dark:bg-red-950/35 dark:text-red-100">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Nao foi possivel concluir o pagamento</p>
              <p className="mt-1">Voce pode tentar novamente escolhendo outro meio de pagamento.</p>
            </div>
          </div>
        </div>
      ) : null}

      {session.status === 'APPROVED' && session.createdUserId ? (
        <div className="rounded-[30px] border border-[#cfeedd] bg-[#eefbf5] p-6 text-[#1b7f62] shadow-[0_22px_60px_rgba(74,73,140,0.08)] dark:border-emerald-400/40 dark:bg-emerald-950/35 dark:text-emerald-100 dark:shadow-[0_22px_60px_rgba(0,0,0,0.3)]">
          <p className="text-sm font-semibold">Conta liberada</p>
          <h2 className="mt-2 text-2xl font-bold text-[#174f40] dark:text-white">Pagamento confirmado</h2>
          <p className="mt-3 text-sm leading-7">
            Sua assinatura foi ativada com sucesso. O acesso ja pode ser feito com o e-mail e a senha informados no cadastro.
          </p>
          <Link href="/login?callbackUrl=/dashboard/aluno&checkout=approved" className="mt-5 inline-flex rounded-full bg-[#1b7f62] px-5 py-3 text-sm font-semibold text-white">
            Entrar na area do aluno
          </Link>
        </div>
      ) : (
        <RegistrationCheckout
          publicToken={session.publicToken}
          role="STUDENT"
          planLabel={planLabel}
          totalLabel={formatCurrencyFromCents(session.amountInCents)}
        />
      )}

      <section className="mt-6 rounded-[26px] border border-[#dde3fb] bg-white/88 p-5 text-sm text-[#61719b] shadow-[0_18px_40px_rgba(74,73,140,0.08)] dark:border-slate-700 dark:bg-slate-950/88 dark:text-slate-300 dark:shadow-[0_18px_40px_rgba(0,0,0,0.28)]">
        <p className="font-semibold text-[#22347e] dark:text-white">Composicao do valor</p>
        <div className="mt-3 space-y-2">
          {plan ? (
            <p>
              {plan.label}: <span className="font-semibold text-[#22347e] dark:text-white">{formatCurrencyFromCents(plan.amountInCents)}</span>
            </p>
          ) : null}
          {session.readingClub ? (
            <p>
              Clube de Leitura: <span className="font-semibold text-[#22347e] dark:text-white">{formatCurrencyFromCents(readingClubPriceInCents)}</span>
            </p>
          ) : null}
          {session.mentoring ? (
            <p>
              Mentoria: <span className="font-semibold text-[#22347e] dark:text-white">{formatCurrencyFromCents(mentoringPriceInCents)}</span>
            </p>
          ) : null}
          <p>
            Total: <span className="font-semibold text-[#22347e] dark:text-white">{formatCurrencyFromCents(session.amountInCents)}</span>
          </p>
        </div>
      </section>
    </main>
  );
}
