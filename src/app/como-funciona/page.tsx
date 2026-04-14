import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import { ProgramOverview } from '@/components/landing/ProgramOverview';
import { getPlatformWhatsAppHref } from '@/lib/platform-contact';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  MessageCircle,
  PenSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroHighlights = [
  {
    title: 'Aulas com base teorica',
    description: 'Conteudo para ampliar repertorio, organizar argumentos e melhorar a construcao da redacao.',
    icon: BookOpenText,
  },
  {
    title: 'Rotina com encontros ao vivo',
    description: 'Aulas e lives distribuidas ao longo do ano para manter o estudo constante e orientado.',
    icon: CalendarDays,
  },
  {
    title: 'Acompanhamento continuo',
    description: 'Feedbacks, materiais e suporte para transformar pratica em progresso real.',
    icon: MessageCircle,
  },
];

const journeySteps = [
  {
    title: '1. Entre na rotina',
    description: 'O aluno acessa uma estrutura clara, com proposta de estudo e agenda organizada desde o inicio.',
  },
  {
    title: '2. Estude com direcao',
    description: 'As aulas aprofundam tema, repertorio e tecnica para que a escrita nao dependa de improviso.',
  },
  {
    title: '3. Tire duvidas ao vivo',
    description: 'As lives quinzenais ajudam a ajustar percurso, reforcar entendimento e manter consistencia.',
  },
  {
    title: '4. Evolua com continuidade',
    description: 'Materiais, leitura guiada e suporte acompanham o aluno ao longo do ano inteiro.',
  },
];

export default async function HowItWorksPage() {
  const whatsappHref = await getPlatformWhatsAppHref();

  return (
    <main className="landing-shell min-h-screen overflow-x-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(132deg,#171d5a_0%,#2f3298_36%,#5e4fd0_68%,#d8927d_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.94)_0%,rgba(41,44,132,0.84)_36%,rgba(89,67,188,0.54)_62%,rgba(226,151,123,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.14),transparent_16%),radial-gradient(circle_at_80%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_70%_64%,rgba(255,164,120,0.12),transparent_18%)]" />
        <Header />

        <div className="relative mx-auto w-full max-w-[1360px] px-5 pb-24 pt-4 text-white sm:px-8 lg:px-12 lg:pb-30">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.88fr)] lg:items-end lg:gap-10">
            <div className="max-w-4xl">
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/88 shadow-[0_14px_30px_rgba(16,20,74,0.16)] backdrop-blur-md">
                Como Funciona
              </p>
              <h1 className="mt-6 max-w-[11ch] text-[2.4rem] font-extrabold leading-[0.98] tracking-[-0.06em] text-white sm:text-[3.4rem] lg:max-w-[12ch] lg:text-[4.45rem]">
                Entenda a rotina do programa antes de entrar.
              </h1>
              <p className="mt-5 max-w-3xl text-[1rem] leading-8 text-white/80 sm:text-[1.08rem]">
                Aqui voce encontra a estrutura completa da jornada: aulas teoricas, lives quinzenais,
                materiais, suporte e acompanhamento para sustentar a evolucao do aluno ao longo do ano.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/cadastro">
                  <Button className="h-13 rounded-full px-7 text-[0.98rem] font-bold sm:h-14 sm:px-8">
                    Criar minha conta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/#planos">
                  <Button
                    variant="secondary"
                    className="h-13 rounded-full border border-white/20 bg-white/12 px-7 text-[0.98rem] font-bold text-white shadow-[0_16px_32px_rgba(15,18,70,0.16)] backdrop-blur-md hover:bg-white/18 sm:h-14 sm:px-8"
                  >
                    Ver planos
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/14 bg-white/10 px-4 py-4 shadow-[0_16px_36px_rgba(14,18,70,0.14)] backdrop-blur-md">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/56">Formato</p>
                  <p className="mt-2 text-base font-semibold text-white">Aulas, lives e materiais</p>
                </div>
                <div className="rounded-[24px] border border-white/14 bg-white/10 px-4 py-4 shadow-[0_16px_36px_rgba(14,18,70,0.14)] backdrop-blur-md">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/56">Duracao</p>
                  <p className="mt-2 text-base font-semibold text-white">1 ano de acompanhamento</p>
                </div>
                <div className="rounded-[24px] border border-white/14 bg-white/10 px-4 py-4 shadow-[0_16px_36px_rgba(14,18,70,0.14)] backdrop-blur-md">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/56">Ritmo</p>
                  <p className="mt-2 text-base font-semibold text-white">Constancia com orientacao</p>
                </div>
              </div>
            </div>

            <section className="rounded-[30px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] p-5 shadow-[0_26px_60px_rgba(12,15,62,0.22)] backdrop-blur-md sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/58">Visao geral</p>
                  <h2 className="mt-1 text-[1.35rem] font-extrabold tracking-[-0.04em] text-white">
                    Um caminho claro do estudo ao resultado
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {heroHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))] px-4 py-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-7 text-white/72">{item.description}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </div>

        <div className="absolute bottom-[-92px] left-1/2 h-[186px] w-[130%] -translate-x-1/2 rounded-[999px] bg-[#f7f3ff] dark:bg-[#08101d]" />
      </section>

      <section className="relative px-5 pb-4 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_18%_26%,rgba(88,120,255,0.1),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,149,92,0.12),transparent_16%)]" />
        <div className="relative mx-auto grid max-w-[1360px] gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <section className="rounded-[32px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_54%,#fff5ed_100%)] p-6 shadow-[0_22px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(135deg,#0f172a_0%,#172033_54%,#241a1a_100%)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.28)] sm:p-8">
            <p className="inline-flex rounded-full border border-[#dce2fb] bg-white/84 px-4 py-2 text-sm font-semibold text-[#5160a8] dark:border-slate-600 dark:bg-slate-900/78 dark:text-indigo-200">
              Visao pratica
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[2rem] font-extrabold tracking-[-0.05em] text-slate-900 dark:text-slate-50 sm:text-[2.6rem]">
              O programa foi desenhado para caber na rotina real.
            </h2>
            <p className="mt-4 text-[1rem] leading-8 text-slate-600 dark:text-slate-300 sm:text-[1.05rem]">
              Em vez de uma pagina longa demais na home, esta area concentra tudo o que o aluno
              precisa entender: o que acontece, com que frequencia e como cada etapa contribui para
              a evolucao da escrita.
            </p>

            <div className="mt-7 rounded-[26px] border border-[#dfe5fb] bg-white/80 p-5 shadow-[0_14px_34px_rgba(74,73,140,0.08)] dark:border-slate-700 dark:bg-slate-900/76 dark:shadow-[0_14px_34px_rgba(0,0,0,0.2)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4350c9] dark:bg-slate-800 dark:text-indigo-200">
                  <PenSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
                    Clareza antes da matricula
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    A pagina agora entrega uma leitura mais objetiva, com melhor hierarquia visual e
                    ritmo de navegacao em qualquer tela.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {journeySteps.map((step) => (
              <article
                key={step.title}
                className="rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,255,0.92))] p-5 shadow-[0_18px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,24,39,0.92))] dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-6"
              >
                <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[#6270c8] dark:text-indigo-200">
                  Jornada
                </p>
                <h3 className="mt-3 text-[1.2rem] font-extrabold tracking-[-0.04em] text-slate-900 dark:text-slate-50">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProgramOverview />
      <CTASection />
      <Footer whatsappHref={whatsappHref} />
    </main>
  );
}
