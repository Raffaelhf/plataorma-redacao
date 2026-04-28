import { BookOpen, BookOpenText, BookText, CalendarDays, GraduationCap, PackageCheck } from 'lucide-react';

const scheduleCards = [
  {
    title: 'Aulas teoricas de redacao',
    icon: GraduationCap,
    description: 'Encontros para embasar argumentos, aprofundar os temas de redacao e ampliar o repertorio cultural dos alunos.',
    details: ['Duracao do programa: 1 ano', 'Quartas-feiras, das 19h as 21h30'],
    tint: 'from-[#eef2ff] to-[#f7f8ff]',
    accent: 'text-[#4350c9]',
  },
  {
    title: 'Lives quinzenais de duvidas',
    icon: CalendarDays,
    description: 'Dois encontros por mes, sempre as segundas-feiras, para esclarecer duvidas e orientar a turma.',
    details: ['Iniciantes: 19h as 20h', 'Nivel medio: 20h as 21h30'],
    tint: 'from-[#fff2e9] to-[#fffaf5]',
    accent: 'text-[#ff7f32]',
  },
];

const supportItems = [
  {
    title: 'Clube de leitura',
    icon: BookOpen,
    description: 'Indicacao de livros comentados em lives selecionadas ao longo do ano.',
    note: 'Add-on opcional: + R$ 30',
  },
  {
    title: 'Suporte e material',
    icon: PackageCheck,
    description: 'Material impresso incluido e suporte continuo pelo WhatsApp.',
    note: 'Acompanhamento fora da aula para manter consistencia',
  },
  {
    title: 'Expansao futura',
    icon: BookText,
    description: 'Estudo dos classicos da filosofia e da lingua portuguesa em uma proxima etapa do programa.',
    note: 'Planejamento ja previsto para os proximos ciclos',
  },
];

export function ProgramOverview() {
  return (
    <section className="relative px-5 pb-10 pt-14 sm:px-8 lg:px-12 lg:pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_15%_16%,rgba(88,120,255,0.14),transparent_20%),radial-gradient(circle_at_86%_24%,rgba(255,149,92,0.15),transparent_18%)]" />
      <div className="relative mx-auto max-w-[1360px]">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="rounded-[32px] border border-[#dae0fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_54%,#fff5ed_100%)] p-6 shadow-[0_22px_60px_rgba(74,73,140,0.12)] sm:p-8">
            <p className="inline-flex rounded-full border border-[#dce2fb] bg-white/80 px-4 py-2 text-sm font-semibold text-[#5160a8]">
              Programa de Redacao
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[2.2rem] font-extrabold tracking-[-0.05em] text-slate-900 sm:text-[2.8rem]">
              Aulas e atividades com rotina clara.
            </h2>
            <p className="mt-4 max-w-[34rem] text-[1rem] leading-8 text-slate-600 sm:text-[1.05rem]">
              A plataforma agora apresenta de forma explicita a estrutura do programa de redacao, com cronograma fixo, acompanhamento complementar e beneficios que antes nao estavam detalhados.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#4350c9]">1 ano de duracao</span>
              <span className="rounded-full bg-[#fff1e8] px-4 py-2 text-sm font-semibold text-[#d6692d]">Material impresso incluido</span>
              <span className="rounded-full bg-[#edf8f2] px-4 py-2 text-sm font-semibold text-[#1f7d61]">Suporte no WhatsApp</span>
            </div>

            <div className="mt-8 rounded-[28px] border border-[#dfe5fb] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(243,246,255,0.92))] p-5 shadow-[0_16px_40px_rgba(74,73,140,0.08)]">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d9def8] bg-white/88 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5564a6]">
                <BookOpen className="h-3.5 w-3.5 text-[#4350d3]" />
                Clube de leitura
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-white shadow-[0_12px_28px_rgba(67,80,211,0.24)]">
                  <BookOpenText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-900">Leitura, repertorio e acompanhamento</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    O foco segue em fortalecer argumentos, repertorio cultural e leitura critica, conectando aulas, lives e clube de leitura em um mesmo percurso.
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a86b2]">Repertorio guiado ao longo do ano</p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-2">
              {scheduleCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-[30px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,255,0.92))] p-6 shadow-[0_20px_60px_rgba(74,73,140,0.1)]"
                  >
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.tint} ${card.accent}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-[1.4rem] font-extrabold tracking-[-0.04em] text-slate-900">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                    <ul className="mt-5 space-y-3">
                      {card.details.map((detail) => (
                        <li key={detail} className="rounded-[20px] bg-[#f7f8ff] px-4 py-3 text-sm font-semibold text-[#42508f]">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {supportItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-[28px] border border-[#e3e8fb] bg-white/88 p-5 shadow-[0_18px_48px_rgba(74,73,140,0.08)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f5ff] text-[#4653d4]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a86b2]">{item.note}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
