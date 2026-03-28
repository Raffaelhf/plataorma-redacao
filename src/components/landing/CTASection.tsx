import Link from 'next/link';
import { ArrowRight, BarChart3, CheckCircle2, PenSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const proofItems = [
  {
    icon: PenSquare,
    title: 'Pratica orientada',
    description: 'Propostas selecionadas para manter constancia sem deixar o estudo disperso.',
    tint: 'from-[#eef2ff] to-[#f7f8ff]',
    color: 'text-[#4350c9]',
  },
  {
    icon: CheckCircle2,
    title: 'Correcao clara',
    description: 'Devolutivas objetivas para voce entender onde evoluiu e onde ajustar.',
    tint: 'from-[#fff2e9] to-[#fffaf5]',
    color: 'text-[#ff7f32]',
  },
  {
    icon: BarChart3,
    title: 'Evolucao visivel',
    description: 'Um percurso pensado para transformar treino frequente em resultado real.',
    tint: 'from-[#edf8f2] to-[#f4fbf7]',
    color: 'text-[#1f7d61]',
  },
];

export function CTASection() {
  return (
    <section className="relative px-5 pb-12 pt-8 sm:px-8 lg:px-12 lg:pb-16 lg:pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(circle_at_18%_24%,rgba(88,120,255,0.12),transparent_18%),radial-gradient(circle_at_84%_28%,rgba(255,149,92,0.14),transparent_18%)]" />

      <div className="mx-auto max-w-[1360px]">
        <div className="relative overflow-hidden rounded-[36px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_54%,#fff5ed_100%)] p-6 shadow-[0_24px_64px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(135deg,#0f172a_0%,#172033_54%,#241a1a_100%)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute right-[-80px] top-[-70px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(105,114,238,0.22),transparent_68%)] blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-90px] left-[-50px] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,140,99,0.2),transparent_66%)] blur-2xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dce2fb] bg-white/84 px-4 py-2 text-sm font-semibold text-[#5160a8] shadow-[0_12px_30px_rgba(74,73,140,0.08)] dark:border-slate-600 dark:bg-slate-900/78 dark:text-indigo-200">
                <Sparkles className="h-4 w-4 text-[#ff8a29] dark:text-orange-300" />
                Seu proximo passo na plataforma
              </div>

              <h2 className="mt-5 max-w-[12ch] text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.055em] text-slate-900 dark:text-slate-50 sm:text-[3rem] lg:text-[3.35rem]">
                Entre em uma rotina que combina estudo, feedback e resultado.
              </h2>

              <p className="mt-5 max-w-[36rem] text-[1rem] leading-8 text-slate-600 dark:text-slate-300 sm:text-[1.06rem]">
                A Escreva Mais organiza seu preparo com mais clareza: voce escreve com frequencia, recebe
                orientacao de verdade e acompanha sua evolucao sem perder o ritmo.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#4350c9] dark:bg-slate-800 dark:text-indigo-200">
                  Propostas bem selecionadas
                </span>
                <span className="rounded-full bg-[#fff1e8] px-4 py-2 text-sm font-semibold text-[#d6692d] dark:bg-[#3b251f] dark:text-orange-300">
                  Devolutivas claras
                </span>
                <span className="rounded-full bg-[#edf8f2] px-4 py-2 text-sm font-semibold text-[#1f7d61] dark:bg-[#123126] dark:text-emerald-300">
                  Evolucao acompanhada
                </span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/cadastro">
                  <Button className="h-14 rounded-full px-8 text-[1rem] font-bold sm:h-[60px] sm:px-9">
                    Criar minha conta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="#planos">
                  <Button
                    variant="secondary"
                    className="h-14 rounded-full border-[#d7defe] bg-white/76 px-7 text-[1rem] font-bold text-[#24329c] shadow-[0_18px_38px_rgba(49,60,142,0.1)] backdrop-blur-md hover:bg-white sm:h-[60px] sm:px-8 dark:border-slate-600 dark:bg-slate-900/72"
                  >
                    Ver planos
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_18px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,24,39,0.9))] dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)] sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1] dark:text-indigo-200">
                  O que voce encontra aqui
                </p>

                <div className="mt-5 grid gap-4">
                  {proofItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-[24px] border border-[#e6eaf9] bg-white/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/72"
                      >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tint} ${item.color} dark:from-slate-800 dark:to-slate-900`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-[1.02rem] font-bold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-[#dfe5fb] bg-white/84 p-5 shadow-[0_16px_40px_rgba(74,73,140,0.08)] dark:border-slate-700 dark:bg-slate-900/76 dark:shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7a86b2] dark:text-slate-400">
                    Foco
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
                    Menos improviso, mais consistencia.
                  </p>
                </div>

                <div className="rounded-[28px] border border-[#ffd9cb] bg-[linear-gradient(135deg,rgba(255,244,238,0.96),rgba(255,251,247,0.92))] p-5 shadow-[0_16px_40px_rgba(255,128,82,0.1)] dark:border-slate-700 dark:bg-[linear-gradient(135deg,rgba(52,29,26,0.9),rgba(17,24,39,0.92))] dark:shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#cf5b34] dark:text-orange-300">
                    Movimento
                  </p>
                  <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
                    Comece agora e deixe a plataforma cuidar do ritmo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
