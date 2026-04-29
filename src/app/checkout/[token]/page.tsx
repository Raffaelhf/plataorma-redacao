import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, CircleAlert, CircleCheckBig, Clock3, CreditCard, ShieldCheck, Sparkles } from 'lucide-react';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { RegistrationCheckout } from '@/components/auth/registration-checkout';
import '@/components/mockups/escreva-mais/_group.css';
import {
  calculateMentoringCheckoutPrice,
  formatCurrencyFromCents,
  getCheckoutSelectionLabel,
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
  const mentoringPriceInCents = session.mentoring
    ? calculateMentoringCheckoutPrice(session.plan, getMentoringPriceFromSettings(settings))
    : 0;
  const planLabel = getCheckoutSelectionLabel({
    planLabel: plan?.label,
    readingClub: session.readingClub,
    mentoring: session.mentoring,
  });

  return (
    <main className="em-root min-h-screen bg-[var(--em-bg)] px-4 py-5 text-[var(--em-ink)] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex w-fit items-center">
            <PlatformLogo className="w-[156px]" sizes="156px" variant="light" />
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex w-fit items-center gap-2 rounded-full border-[1.5px] border-[var(--em-ink)] bg-white px-4 py-2 text-xs font-extrabold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            Revisar cadastro
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </header>

        <section className="theme-panel-hero relative mb-6 overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full border-[16px] border-[var(--em-ink)] opacity-10" />
          <div className="absolute bottom-6 right-8 hidden text-[var(--em-coral)] sm:block">
            <Sparkles className="h-16 w-16 fill-current" />
          </div>
          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--em-ink)] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-[2px_2px_0_0_#0E0F12]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Checkout seguro
            </div>
            <h1 className="em-display text-[34px] leading-none text-[var(--em-ink)] sm:text-[44px] lg:text-[56px]">
              Finalize sua inscrição.
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-[var(--em-ink-soft)] sm:text-base">
              O cadastro permanece pendente até a confirmação do pagamento. Seus dados de cartão não são armazenados pela Escreva Mais.
            </p>
          </div>
        </section>

      {state === 'success' ? (
        <div className="em-card-hard mb-6 bg-[var(--em-mint)] px-5 py-4 text-sm text-[var(--em-ink)]">
          <div className="flex items-start gap-3">
            <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-extrabold">Retorno do pagamento recebido</p>
              <p className="mt-1">
                Se o pagamento já foi confirmado pelo provedor, sua conta será liberada automaticamente. Pix e boleto podem permanecer pendentes por alguns minutos ou horas.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {state === 'pending' ? (
        <div className="em-card-hard mb-6 bg-[var(--em-yellow-soft)] px-5 py-4 text-sm text-[var(--em-ink)]">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-extrabold">Pagamento pendente</p>
              <p className="mt-1">Aguardamos a confirmação do provedor. Assim que aprovado, sua conta será ativada automaticamente.</p>
            </div>
          </div>
        </div>
      ) : null}

      {state === 'failure' || session.status === 'FAILED' ? (
        <div className="em-card-hard mb-6 bg-[var(--em-rose)] px-5 py-4 text-sm text-[var(--em-ink)]">
          <div className="flex items-start gap-3">
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-extrabold">Não foi possível concluir o pagamento</p>
              <p className="mt-1">Você pode tentar novamente escolhendo outro meio de pagamento.</p>
            </div>
          </div>
        </div>
      ) : null}

      {session.status === 'APPROVED' && session.createdUserId ? (
        <div className="em-card-hard bg-[var(--em-mint)] p-6 text-[var(--em-ink)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em]">Conta liberada</p>
          <h2 className="mt-2 text-2xl font-extrabold">Pagamento confirmado</h2>
          <p className="mt-3 text-sm font-semibold leading-7">
            Sua inscrição foi ativada com sucesso. O acesso já pode ser feito com o e-mail e a senha informados no cadastro.
          </p>
          <Link href="/login?callbackUrl=/dashboard/aluno&checkout=approved" className="em-btn-primary mt-5">
            Entrar na área do aluno
          </Link>
        </div>
      ) : (
        <RegistrationCheckout
          publicToken={session.publicToken}
          role="STUDENT"
          planLabel={planLabel}
          totalLabel={formatCurrencyFromCents(session.amountInCents)}
          amountInCents={session.amountInCents}
          payerEmail={session.email}
        />
      )}

        <section className="em-card-hard mt-6 overflow-hidden bg-white">
          <div className="border-b-[1.5px] border-[var(--em-ink)] bg-[var(--em-cream)] px-5 py-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <p className="text-sm font-extrabold text-[var(--em-ink)]">Composição do valor</p>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {plan ? (
              <div className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">{plan.label}</p>
                <p className="mt-1 text-lg font-extrabold text-[var(--em-ink)]">{formatCurrencyFromCents(plan.amountInCents)}</p>
              </div>
            ) : null}
            {session.readingClub ? (
              <div className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-mint)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">Clube do Livro</p>
                <p className="mt-1 text-lg font-extrabold text-[var(--em-ink)]">{formatCurrencyFromCents(readingClubPriceInCents)}</p>
              </div>
            ) : null}
            {session.mentoring ? (
              <div className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-lavender)] p-4">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">Mentoria</p>
                <p className="mt-1 text-lg font-extrabold text-[var(--em-ink)]">{formatCurrencyFromCents(mentoringPriceInCents)}</p>
              </div>
            ) : null}
            <div className="rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow)] p-4 shadow-[2px_2px_0_0_#0E0F12]">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--em-ink)]">Total</p>
              <p className="mt-1 text-xl font-extrabold text-[var(--em-ink)]">{formatCurrencyFromCents(session.amountInCents)}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
