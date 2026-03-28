'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { planItems } from './data';

export function Plans() {
  const [readingClubByPlan, setReadingClubByPlan] = useState<Record<string, boolean>>({});

  const toggleReadingClub = (slug: string) => {
    setReadingClubByPlan((current) => ({ ...current, [slug]: !current[slug] }));
  };

  return (
    <section id="planos" className="relative px-5 pb-12 pt-[72px] sm:px-8 lg:px-12 lg:pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-8 h-[380px] bg-[radial-gradient(circle_at_18%_22%,rgba(88,120,255,0.1),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,149,92,0.12),transparent_16%)]" />
      <div className="mx-auto max-w-[1360px]">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="inline-flex rounded-full border border-[#d8defa] bg-white/80 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_12px_30px_rgba(74,73,140,0.08)] dark:border-slate-700/70 dark:bg-slate-900/72 dark:text-slate-300 dark:shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
            Planos para diferentes ritmos de preparo
          </div>
          <h2 className="mt-5 text-[2.1rem] font-extrabold tracking-[-0.05em] text-slate-900 dark:text-slate-50 sm:text-[2.8rem]">
            Escolha o plano ideal para sua rotina de estudo
          </h2>
          <p className="mt-4 text-[1rem] leading-8 text-slate-600 dark:text-slate-300 sm:text-[1.08rem]">
            Do teste rapido ao preparo completo para a prova, cada plano foi desenhado para um nivel diferente de
            frequencia, acompanhamento e profundidade.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 md:justify-items-center xl:grid-cols-4 xl:justify-items-stretch">
          {planItems.map((plan, index) => {
            const Icon = plan.icon;
            const withReadingClub = Boolean(readingClubByPlan[plan.slug]);
            const href = withReadingClub ? `/cadastro?plan=${plan.slug}&readingClub=1` : `/cadastro?plan=${plan.slug}`;

            return (
              <article
                key={plan.name}
                className={`relative flex h-full flex-col overflow-hidden rounded-[32px] border p-6 shadow-[0_20px_60px_rgba(74,73,140,0.12)] transition-transform duration-200 md:p-7 ${
                  plan.featured
                    ? 'border-[#5d61e8]/30 bg-[linear-gradient(180deg,#f8f9ff_0%,#f1f3ff_100%)] text-slate-900 shadow-[0_28px_80px_rgba(73,82,201,0.18)] dark:border-indigo-500/30 dark:bg-[linear-gradient(180deg,rgba(16,24,45,0.98)_0%,rgba(20,31,58,0.94)_100%)] dark:text-slate-50 dark:shadow-[0_28px_80px_rgba(0,0,0,0.28)] md:mx-auto md:w-full md:max-w-[620px] xl:col-span-1 xl:mx-0 xl:max-w-none xl:-translate-y-2'
                    : index === planItems.length - 1
                      ? 'border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,255,0.92))] text-slate-900 dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,24,39,0.92))] dark:text-slate-50 md:mx-auto md:w-full md:max-w-[620px] xl:mx-0 xl:max-w-none'
                      : 'border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,255,0.92))] text-slate-900 dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,24,39,0.92))] dark:text-slate-50'
                }`}
              >
                {plan.featured ? <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(93,97,232,0.26),transparent_70%)]" /> : null}

                {plan.badge ? (
                  <div
                    className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] ${
                      plan.featured ? 'bg-[#4e57d8] text-white dark:bg-indigo-500 dark:text-white' : 'bg-[#eef1ff] text-[#4350c9] dark:bg-slate-800 dark:text-indigo-200'
                    }`}
                  >
                    {plan.badge}
                  </div>
                ) : null}

                <div
                  className={`relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-2xl ${
                    plan.featured
                      ? 'bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-white shadow-[0_14px_28px_rgba(76,88,219,0.28)] dark:bg-[linear-gradient(135deg,#4f5ee8_0%,#7a84ff_100%)]'
                      : 'bg-[#f2f4ff] text-[#4e5bda] dark:bg-slate-800 dark:text-indigo-200'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <p className={`mt-5 text-[0.76rem] font-extrabold uppercase tracking-[0.16em] ${plan.featured ? 'text-[#6270c8] dark:text-indigo-200' : 'text-[#7a86b2] dark:text-slate-400'}`}>
                  {plan.fit}
                </p>
                <h3 className="mt-3 text-[1.55rem] font-extrabold tracking-[-0.04em] text-slate-900 dark:text-slate-50">{plan.name}</h3>
                <p className={`mt-2 min-h-[84px] text-[0.98rem] leading-7 md:min-h-[72px] xl:min-h-[84px] ${plan.featured ? 'text-[#5b6793] dark:text-slate-300' : 'text-[#60709a] dark:text-slate-300'}`}>
                  {plan.description}
                </p>

                <div
                  className={`mt-6 rounded-[24px] border px-5 py-5 ${
                    plan.featured
                      ? 'border-[#dce1ff] bg-white shadow-[0_14px_34px_rgba(79,91,208,0.08)] dark:border-slate-600 dark:bg-slate-900/84 dark:shadow-[0_14px_34px_rgba(0,0,0,0.2)]'
                      : 'border-[#e6eaf9] bg-[#f9faff] dark:border-slate-700 dark:bg-slate-900/72'
                  }`}
                >
                  <div className="text-[2.5rem] font-extrabold tracking-[-0.06em] text-slate-900 dark:text-slate-50">
                    {plan.price}
                    <span className="ml-2 text-[1rem] font-semibold tracking-normal text-slate-500 dark:text-slate-300">{plan.cadence}</span>
                  </div>
                  <p className={`mt-2 text-sm font-semibold ${plan.featured ? 'text-[#4350c9] dark:text-indigo-300' : 'text-[#4d5ca3] dark:text-indigo-200'}`}>{plan.perMonth}</p>
                  {plan.highlight ? <p className="mt-1 text-sm text-[#6a75a0] dark:text-slate-400">{plan.highlight}</p> : null}
                </div>

                <ul className="mt-6 flex-1 space-y-3 md:max-w-[34ch] xl:max-w-none">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className={`flex items-start gap-3 text-[0.98rem] leading-7 ${plan.featured ? 'text-[#46547f] dark:text-slate-200' : 'text-[#4a577f] dark:text-slate-200'}`}>
                      <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${plan.featured ? 'bg-[#edf1ff] text-[#4957d8] dark:bg-slate-800 dark:text-indigo-200' : 'bg-[#edf1ff] text-[#4957d8] dark:bg-slate-800 dark:text-indigo-200'}`}>
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
                      ? 'border-[#ffd4bf] bg-[#fff3ec] dark:border-orange-400/40 dark:bg-orange-950/40'
                      : 'border-[#e6eaf9] bg-white/85 hover:border-[#cfd7ff] dark:border-slate-700 dark:bg-slate-900/72 dark:hover:border-slate-500'
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      withReadingClub ? 'border-[#ff8b4b] bg-[#ff8b4b] text-white dark:border-orange-400 dark:bg-orange-400' : 'border-[#c9d0ef] bg-white dark:border-slate-500 dark:bg-slate-950/80'
                    }`}
                  >
                    {withReadingClub ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">Adicionar Clube de leitura</span>
                    <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Acrescente o complemento por + R$ 30 e leve as leituras comentadas para o seu plano.
                    </span>
                  </span>
                </button>

                <div className="mt-7 border-t border-[#e7eaf8] pt-6 dark:border-slate-700/70">
                  <Link href={href} className="block">
                    <Button
                      className={`h-12 w-full rounded-full px-6 text-[0.98rem] font-bold ${
                        plan.featured
                          ? 'bg-[linear-gradient(135deg,#ff8d34_0%,#ff5a55_100%)] text-white shadow-[0_18px_32px_rgba(255,103,76,0.28)]'
                          : 'bg-[linear-gradient(135deg,#3141bf_0%,#5363e6_100%)] text-white shadow-[0_16px_30px_rgba(69,85,210,0.22)]'
                      }`}
                    >
                      {withReadingClub ? `${plan.cta} + Clube` : plan.cta}
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-sm text-[#7580a8] dark:text-slate-300">
          Todos os planos incluem acesso imediato pela area do aluno. O mensal reduz a barreira de entrada; o semestral e o anual concentram o melhor custo-beneficio.
        </p>
        <div className="mx-auto mt-5 max-w-[820px] rounded-[28px] border border-[#d9def8] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,242,255,0.92))] px-6 py-5 text-center shadow-[0_18px_46px_rgba(74,73,140,0.08)] dark:border-slate-600 dark:bg-slate-900 dark:shadow-[0_18px_46px_rgba(0,0,0,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1] dark:text-indigo-200">Add-on opcional</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Clube de leitura por + R$ 30</p>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-200">Indicacao de livros para leitura ao longo do ciclo, com comentarios em lives selecionadas.</p>
        </div>
      </div>
    </section>
  );
}
