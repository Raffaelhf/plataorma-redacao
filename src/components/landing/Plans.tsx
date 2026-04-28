'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { planItems } from './data';

type PlanPricing = {
  readingClubPriceInCents: number;
  mentoringPriceInCents: number;
  mentoringPackages: Record<string, number>;
  mentoringDiscounts: Record<string, number>;
  plans: Record<string, number>;
};

const monthsByPlanSlug: Record<string, number> = {
  mensal: 1,
  trimestral: 3,
  semestral: 6,
  anual: 12,
};

function formatCurrencyFromCents(amountInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}

function getPlanPriceDetails(slug: string, fallback: { price: string; perMonth: string; highlight?: string }, pricing?: PlanPricing) {
  const amountInCents = pricing?.plans[slug];
  if (typeof amountInCents !== 'number') return fallback;

  const months = monthsByPlanSlug[slug] ?? 1;
  const monthlyAmount = pricing?.plans.mensal;
  const regularCycleAmount = typeof monthlyAmount === 'number' ? monthlyAmount * months : null;
  const savingsPercent =
    regularCycleAmount && months > 1 && regularCycleAmount > amountInCents
      ? Math.round(((regularCycleAmount - amountInCents) / regularCycleAmount) * 100)
      : null;

  return {
    price: formatCurrencyFromCents(amountInCents),
    perMonth: months === 1 ? fallback.perMonth : `Equivale a ${formatCurrencyFromCents(Math.round(amountInCents / months))}/mês`,
    highlight: savingsPercent ? `Economia de ${savingsPercent}% no ciclo` : undefined,
  };
}

function buildSignupHref(slug: string, options: { readingClub: boolean; mentoring: boolean }) {
  const params = new URLSearchParams({ plan: slug });
  if (options.readingClub) params.set('readingClub', '1');
  if (options.mentoring) params.set('mentoring', '1');
  return `/cadastro?${params.toString()}`;
}

function getMentoringPackageDetails(slug: string, pricing?: PlanPricing) {
  const packageAmount = pricing?.mentoringPackages[slug];
  const baseAmount = pricing?.mentoringPriceInCents;
  const discount = pricing?.mentoringDiscounts[slug] ?? 0;

  if (typeof packageAmount !== 'number' || typeof baseAmount !== 'number') {
    return {
      price: slug === 'mensal' ? 'R$ 120' : 'com desconto',
      discountLabel: discount ? `${discount}% off` : 'preco cheio',
      savingsLabel: null,
    };
  }

  const savings = baseAmount - packageAmount;
  return {
    price: formatCurrencyFromCents(packageAmount),
    discountLabel: discount ? `${discount}% off` : 'preco cheio',
    savingsLabel: savings > 0 ? `Voce economiza ${formatCurrencyFromCents(savings)}` : null,
  };
}

export function Plans({ pricing }: { pricing?: PlanPricing }) {
  const [readingClubByPlan, setReadingClubByPlan] = useState<Record<string, boolean>>({});
  const [mentoringByPlan, setMentoringByPlan] = useState<Record<string, boolean>>({});
  const readingClubPriceLabel = pricing ? formatCurrencyFromCents(pricing.readingClubPriceInCents) : 'R$ 30';
  const mentoringPriceLabel = pricing ? formatCurrencyFromCents(pricing.mentoringPriceInCents) : 'R$ 120';

  const toggleReadingClub = (slug: string) => {
    setReadingClubByPlan((current) => ({ ...current, [slug]: !current[slug] }));
  };

  const toggleMentoring = (slug: string) => {
    setMentoringByPlan((current) => ({ ...current, [slug]: !current[slug] }));
  };

  return (
    <section id="planos" className="relative px-5 pb-12 pt-[72px] sm:px-8 lg:px-12 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-8 h-[380px] bg-[radial-gradient(circle_at_18%_22%,rgba(88,120,255,0.1),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,149,92,0.12),transparent_16%)]" />
      <div className="mx-auto max-w-[1360px]">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="inline-flex rounded-full border border-[#d8defa] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_12px_30px_rgba(74,73,140,0.08)]">
            Planos para diferentes ritmos de preparo
          </div>
          <h2 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.05em] text-slate-900 sm:text-[2.8rem]">
            Escolha o plano ideal para sua rotina de estudo
          </h2>
          <p className="mt-4 text-[1rem] leading-8 text-slate-600 sm:text-[1.08rem]">
            Do teste rapido ao preparo completo para a prova, cada plano foi desenhado para um nivel diferente de
            frequencia, acompanhamento e profundidade.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 md:justify-items-center xl:grid-cols-4 xl:justify-items-stretch">
          {planItems.map((plan, index) => {
            const Icon = plan.icon;
            const withReadingClub = Boolean(readingClubByPlan[plan.slug]);
            const withMentoring = Boolean(mentoringByPlan[plan.slug]);
            const href = buildSignupHref(plan.slug, { readingClub: withReadingClub, mentoring: withMentoring });
            const priceDetails = getPlanPriceDetails(plan.slug, plan, pricing);
            const mentoringDetails = getMentoringPackageDetails(plan.slug, pricing);
            const packageTotal =
              pricing && withMentoring
                ? formatCurrencyFromCents((pricing.plans[plan.slug] ?? 0) + (pricing.mentoringPackages[plan.slug] ?? 0) + (withReadingClub ? pricing.readingClubPriceInCents : 0))
                : null;

            return (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col overflow-hidden rounded-[32px] border p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] transition-transform duration-200 md:p-7 ${
                  plan.featured
                    ? 'border-[#5d61e8]/30 bg-[linear-gradient(180deg,#f8f9ff_0%,#f1f3ff_100%)] text-slate-900 shadow-[0_28px_80px_rgba(73,82,201,0.18)] md:mx-auto md:w-full md:max-w-[620px] xl:col-span-1 xl:mx-0 xl:max-w-none xl:-translate-y-2'
                    : index === planItems.length - 1
                      ? 'border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,255,0.92))] text-slate-900 md:mx-auto md:w-full md:max-w-[620px] xl:mx-0 xl:max-w-none'
                      : 'border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,255,0.92))] text-slate-900'
                }`}
              >
                {plan.featured ? <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(93,97,232,0.26),transparent_70%)]" /> : null}

                {plan.badge ? (
                  <div
                    className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] ${
                      plan.featured ? 'bg-[#4e57d8] text-white' : 'bg-[#eef1ff] text-[#4350c9]'
                    }`}
                  >
                    {plan.badge}
                  </div>
                ) : null}

                <div
                  className={`relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${
                    plan.featured
                      ? 'bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-white shadow-[0_14px_28px_rgba(76,88,219,0.28)]'
                      : 'bg-[#f2f4ff] text-[#4e5bda]'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <p className={`mt-5 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] ${plan.featured ? 'text-[#6270c8]' : 'text-[#7a86b2]'}`}>
                  {plan.fit}
                </p>
                <h3 className="mt-3 text-[1.55rem] font-extrabold tracking-[-0.04em] text-slate-900">{plan.name}</h3>
                <p className={`mt-2 min-h-[84px] text-[0.98rem] leading-7 md:min-h-[72px] xl:min-h-[84px] ${plan.featured ? 'text-[#5b6793]' : 'text-[#60709a]'}`}>
                  {plan.description}
                </p>

                <div
                  className={`mt-6 rounded-[24px] border px-5 py-5 ${
                    plan.featured
                      ? 'border-[#dce1ff] bg-white shadow-[0_14px_34px_rgba(79,91,208,0.08)]'
                      : 'border-[#e6eaf9] bg-[#f9faff]'
                  }`}
                >
                  <div className="text-[2.5rem] font-extrabold tracking-[-0.06em] text-slate-900">
                    {priceDetails.price}
                    <span className="ml-2 text-[1rem] font-semibold tracking-normal text-slate-500">{plan.cadence}</span>
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${plan.featured ? 'text-[#4350c9]' : 'text-[#4d5ca3]'}`}>{priceDetails.perMonth}</p>
                  {priceDetails.highlight ? <p className="mt-1 text-sm text-[#6a75a0]">{priceDetails.highlight}</p> : null}
                </div>

                <ul className="mt-6 flex-1 space-y-3 md:max-w-[34ch] xl:max-w-none">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className={`flex items-start gap-3 text-[0.98rem] leading-7 ${plan.featured ? 'text-[#46547f]' : 'text-[#4a577f]'}`}>
                      <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? 'bg-[#edf1ff] text-[#4957d8]' : 'bg-[#edf1ff] text-[#4957d8]'}`}>
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => toggleReadingClub(plan.slug)}
                  className={`mt-6 flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition-colors ${
                    withReadingClub
                      ? 'border-[#ffd4bf] bg-[#fff3ec]'
                      : 'border-[#e6eaf9] bg-white/85 hover:border-[#cfd7ff]'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      withReadingClub ? 'border-[#ff8b4b] bg-[#ff8b4b] text-white' : 'border-[#c9d0ef] bg-white'
                    }`}
                  >
                    {withReadingClub ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Adicionar Clube de leitura</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      Acrescente o complemento por + {readingClubPriceLabel} e leve as leituras comentadas para o seu plano.
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleMentoring(plan.slug)}
                  className={`mt-3 flex w-full items-start gap-3 rounded-[22px] border px-4 py-4 text-left transition-colors ${
                    withMentoring
                      ? 'border-[#bfc9ff] bg-[#eef2ff]'
                      : 'border-[#e6eaf9] bg-white/85 hover:border-[#cfd7ff]'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      withMentoring ? 'border-[#5363e6] bg-[#5363e6] text-white' : 'border-[#c9d0ef] bg-white'
                    }`}
                  >
                    {withMentoring ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span>
                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
                      Adicionar Mentoria
                      <span className="rounded-full bg-white px-2 py-0.5 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-[#4350c9]">
                        {mentoringDetails.discountLabel}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">
                      Pacote com o plano por + {mentoringDetails.price}. Preco avulso: {mentoringPriceLabel}.
                      {mentoringDetails.savingsLabel ? ` ${mentoringDetails.savingsLabel}.` : ''}
                    </span>
                  </span>
                </button>

                {packageTotal ? (
                  <div className="mt-3 rounded-[20px] border border-[#dbe1ff] bg-[#f8f9ff] px-4 py-3 text-sm text-[#53618f]">
                    Pacote selecionado: <span className="font-extrabold text-[#22347e]">{packageTotal}</span>
                  </div>
                ) : null}

                <div className="mt-7 border-t border-[#e7eaf8] pt-6">
                  <Link href={href} className="block">
                    <Button
                      className={`h-12 w-full rounded-full px-6 text-[0.98rem] font-bold ${
                        plan.featured
                          ? 'bg-[linear-gradient(135deg,#ff8d34_0%,#ff5a55_100%)] text-white shadow-[0_18px_32px_rgba(255,103,76,0.28)]'
                          : 'bg-[linear-gradient(135deg,#3141bf_0%,#5363e6_100%)] text-white shadow-[0_16px_30px_rgba(69,85,210,0.22)]'
                      }`}
                    >
                      {withMentoring || withReadingClub ? `${plan.cta} + Pacote` : plan.cta}
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-[#7580a8]">
          Todos os planos incluem acesso imediato pela area do aluno. O mensal reduz a barreira de entrada; o semestral e o anual concentram o melhor custo-beneficio.
        </p>
        <div className="mx-auto mt-5 max-w-[820px] rounded-[28px] border border-[#d9def8] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,242,255,0.92))] px-6 py-5 text-center shadow-[0_18px_46px_rgba(74,73,140,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1]">Add-on opcional</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Clube de leitura por + {readingClubPriceLabel}</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">Indicacao de livros para leitura ao longo do ciclo, com comentarios em lives selecionadas.</p>
        </div>
        <div className="mx-auto mt-4 max-w-[820px] rounded-[28px] border border-[#d9def8] bg-white/92 px-6 py-5 text-center shadow-[0_18px_46px_rgba(74,73,140,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1]">Pacote com mentoria</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Mentoria avulsa por {mentoringPriceLabel}, com desconto ao juntar com um plano</p>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Desconto progressivo: mensal sem desconto, trimestral 10%, semestral 15% e anual 20% sobre a mentoria.
          </p>
        </div>
      </div>
    </section>
  );
}
