import Link from 'next/link';
import { CheckCircle2, Clock, PlayCircle, Users } from 'lucide-react';
import { RegisterForm } from '@/components/auth/register-form';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { formatCurrencyFromCents, getPublicPlanPricing } from '@/lib/plans';
import '@/components/mockups/escreva-mais/_group.css';

export const dynamic = 'force-dynamic';

export default async function CadastroPage() {
  const pricing = await getPublicPlanPricing();

  return (
    <main className="em-root flex min-h-screen flex-col font-sans lg:flex-row" style={{ background: 'var(--em-bg)' }}>
      <section className="relative flex w-full flex-col overflow-hidden p-6 md:p-10 lg:w-[45%] lg:p-14" style={{ background: 'var(--em-ink)' }}>
        <Link href="/" className="relative z-20 mb-12 flex items-center">
          <PlatformLogo className="w-[190px]" sizes="190px" />
        </Link>

        <div className="relative z-20 mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center">
          <div className="em-spin-slow pointer-events-none absolute -right-16 -top-16 text-[var(--em-coral)] opacity-90">
            <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>

          <h1 className="em-display relative z-10 mb-6 text-[40px] leading-[1.05] text-white md:text-[48px] lg:text-[56px]">
            Sua jornada de redação começa{' '}
            <span className="relative inline-block whitespace-nowrap">
              <span className="relative z-10 px-2 text-[var(--em-ink)]">aqui.</span>
              <span className="absolute inset-0 top-2 -z-0 -skew-y-2 bg-[var(--em-yellow)]" />
            </span>
          </h1>

          <p className="relative z-10 mb-10 max-w-[420px] text-[17px] leading-relaxed text-[var(--em-text-on-ink-soft)]">
            Junte-se a estudantes que evoluem com correções detalhadas, planos de estudo e prática focada nos vestibulares.
          </p>

          <div className="relative overflow-hidden rounded-[32px] border-2 border-[var(--em-ink)] bg-[var(--em-ink-soft)] p-6 shadow-[8px_8px_0_0_#2BD37B] md:p-8">
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full border-[24px] border-[var(--em-green)] opacity-20" />
            <div className="relative z-10 space-y-3.5">
              {[
                { icon: Clock, label: 'Correção em até 72h', color: 'bg-[var(--em-green-soft)] text-[var(--em-green-deep)]' },
                { icon: CheckCircle2, label: 'Plano semanal personalizado', color: 'bg-[var(--em-peach)] text-[var(--em-peach-deep)]' },
                { icon: PlayCircle, label: 'Acesso a videoaulas', color: 'bg-[var(--em-lavender)] text-[var(--em-lavender-deep)]' },
                { icon: Users, label: 'Comunidade de estudantes', color: 'bg-[var(--em-rose)] text-[var(--em-rose-deep)]' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/5 p-3.5 backdrop-blur-md">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[14px] border border-[var(--em-ink)]/10 shadow-[2px_2px_0_0_#0E0F12] ${item.color}`}>
                      <Icon className="h-5 w-5" strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] font-bold tracking-tight text-white">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto p-6 md:p-12 lg:p-16" style={{ background: 'var(--em-bg)' }}>
        <div className="em-noise" />
        <div className="relative z-10 w-full max-w-[560px]">
          <div className="mb-8 text-center">
            <h2 className="em-display mb-2 text-[36px] font-extrabold tracking-tight text-[var(--em-ink)]">Crie sua conta</h2>
            <p className="text-[16px] font-medium text-[var(--em-text-soft)]">Escolha um plano ou servico avulso e siga para o checkout seguro.</p>
          </div>

          <div className="em-card-hard bg-white p-6 sm:p-8">
            <RegisterForm
              planPrices={{
                mensal: `${formatCurrencyFromCents(pricing.plans.mensal)}/mês`,
                trimestral: `${formatCurrencyFromCents(pricing.plans.trimestral)}/trimestre`,
                semestral: `${formatCurrencyFromCents(pricing.plans.semestral)}/semestre`,
                anual: `${formatCurrencyFromCents(pricing.plans.anual)}/ano`,
              }}
              readingClubPriceLabel={formatCurrencyFromCents(pricing.readingClubPriceInCents)}
              mentoringPriceLabel={formatCurrencyFromCents(pricing.mentoringPriceInCents)}
              mentoringPackagePrices={{
                mensal: {
                  price: formatCurrencyFromCents(pricing.mentoringPackages.mensal),
                  discountLabel: pricing.mentoringDiscounts.mensal ? `${pricing.mentoringDiscounts.mensal}% off` : 'preço cheio',
                },
                trimestral: {
                  price: formatCurrencyFromCents(pricing.mentoringPackages.trimestral),
                  discountLabel: `${pricing.mentoringDiscounts.trimestral}% off`,
                },
                semestral: {
                  price: formatCurrencyFromCents(pricing.mentoringPackages.semestral),
                  discountLabel: `${pricing.mentoringDiscounts.semestral}% off`,
                },
                anual: {
                  price: formatCurrencyFromCents(pricing.mentoringPackages.anual),
                  discountLabel: `${pricing.mentoringDiscounts.anual}% off`,
                },
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
