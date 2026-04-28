"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Book, Brain, Building, ChevronRight, Clock, Cpu, Download, Globe, Heart, Leaf, Search, Star, Users, Vote, X } from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

const ACTIVITIES = [
  { id: 1, title: "Os desafios da educacao digital no Brasil contemporaneo", icon: Cpu, bg: "var(--em-mint)", tags: ["ENEM", "Argumentacao"], desc: "Analise os impactos da exclusao digital e proponha solucoes para democratizar o ensino remoto.", deadline: "Hoje, 23:59", diff: 2, status: "Quase no prazo", statusColor: "bg-[var(--em-peach)] text-[var(--em-peach-deep)]" },
  { id: 2, title: "Caminhos para combater a intolerancia religiosa", icon: Heart, bg: "var(--em-lavender)", tags: ["Fuvest", "Repertorio"], desc: "Disserte sobre as raizes da intolerancia e o papel do Estado laico.", deadline: "Em 3 dias", diff: 3, status: "Em destaque", statusColor: "bg-[var(--em-yellow)] text-[var(--em-ink)]" },
  { id: 3, title: "Tecnologia e desigualdade social", icon: Globe, bg: "var(--em-peach)", tags: ["Unicamp", "Artigo"], desc: "Escreva um artigo de opiniao sobre como a automacao afeta as classes trabalhadoras.", deadline: "Em 5 dias", diff: 2, status: "Nova", statusColor: "bg-[var(--em-green)] text-[var(--em-ink)]" },
  { id: 4, title: "A crise habitacional nas metropoles", icon: Building, bg: "var(--em-yellow-soft)", tags: ["ENEM", "Estrutura"], desc: "Discuta o direito a moradia e os desafios do planejamento urbano sustentavel no Brasil.", deadline: "Sem prazo", diff: 1, status: "", statusColor: "" },
  { id: 5, title: "Preservacao da memoria cultural e historica", icon: Book, bg: "var(--em-mint)", tags: ["Fuvest", "Treino"], desc: "Reflita sobre a importancia dos museus na construcao da identidade nacional.", deadline: "Sem prazo", diff: 2, status: "", statusColor: "" },
  { id: 6, title: "Os limites da liberdade de expressao nas redes", icon: Users, bg: "var(--em-rose)", tags: ["Unicamp", "Carta"], desc: "Redija uma carta aberta sobre a linha entre opiniao e discurso de odio online.", deadline: "Em 7 dias", diff: 3, status: "", statusColor: "" },
  { id: 7, title: "Impactos das mudancas climaticas na agricultura", icon: Leaf, bg: "var(--em-lavender)", tags: ["ENEM", "Proposta"], desc: "Analise a relacao entre agronegocio e aquecimento global, propondo alternativas sustentaveis.", deadline: "Em 10 dias", diff: 2, status: "Nova", statusColor: "bg-[var(--em-green)] text-[var(--em-ink)]" },
  { id: 8, title: "O papel do jovem na politica contemporanea", icon: Vote, bg: "var(--em-peach)", tags: ["Tema livre", "Argumentacao"], desc: "Como a juventude pode transformar o cenario politico pelo engajamento digital e presencial.", deadline: "Sem prazo", diff: 1, status: "", statusColor: "" },
  { id: 9, title: "Saude mental e produtividade toxica", icon: Brain, bg: "var(--em-yellow-soft)", tags: ["ENEM", "Treino"], desc: "Os perigos da cultura do excesso de trabalho e seus impactos na saude psicologica.", deadline: "Sem prazo", diff: 2, status: "", statusColor: "" },
];

const FILTERS = ["Todas", "ENEM", "Fuvest", "Unicamp", "Tema livre", "Treino"];
const PAGE_SIZE = 6;

export function AlunoAtividades() {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [order, setOrder] = useState("Mais recentes");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<(typeof ACTIVITIES)[number] | null>(null);

  const filtered = useMemo(() => {
    const result = ACTIVITIES.filter((activity) => activeFilter === "Todas" || activity.tags.includes(activeFilter));
    return [...result].sort((a, b) => {
      if (order === "Maior dificuldade") return b.diff - a.diff;
      if (order === "Menor dificuldade") return a.diff - b.diff;
      if (order === "Prazo mais proximo") return Number(b.deadline.includes("Hoje")) - Number(a.deadline.includes("Hoje"));
      return b.id - a.id;
    });
  }, [activeFilter, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const showingStart = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const showingEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  const chooseFilter = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <AppLayout
      role="aluno"
      userName="Julia Andrade"
      userEmail="julia.andrade@email.com"
      pageKicker="Atividades - Outubro 2026"
      pageTitle="Escolha sua proxima redacao."
      primaryAction={{ label: "Buscar tema", icon: <Search className="w-4 h-4" /> }}
    >
      <div className="flex flex-col gap-8 pb-12 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => chooseFilter(filter)}
                  className={`em-chip shrink-0 ${activeFilter === filter ? "bg-[var(--em-ink)] text-white border-[var(--em-ink)]" : "hover:bg-[var(--em-bg-alt)]"}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--em-text-soft)]">Ordenar por:</span>
              <select
                value={order}
                onChange={(event) => {
                  setOrder(event.target.value);
                  setPage(1);
                }}
                className="cursor-pointer rounded-xl border-2 border-[var(--em-border-strong)] bg-white px-3 py-2 text-[13px] font-extrabold text-[var(--em-ink)] outline-none transition-colors hover:border-[var(--em-ink)] focus:border-[var(--em-ink)]"
              >
                <option>Mais recentes</option>
                <option>Prazo mais proximo</option>
                <option>Maior dificuldade</option>
                <option>Menor dificuldade</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="em-card-hard group flex flex-col overflow-hidden bg-white">
                  <div className="relative flex h-20 items-center border-b-2 border-[var(--em-ink)] px-5" style={{ background: activity.bg }}>
                    <div className="grid h-12 w-12 -translate-y-2 place-items-center rounded-xl border-2 border-[var(--em-ink)] bg-white text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-transform group-hover:scale-105">
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                    {activity.status ? (
                      <span className={`absolute right-4 top-4 rounded-full border border-[var(--em-ink)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-[2px_2px_0_0_#0E0F12] ${activity.statusColor}`}>
                        {activity.status}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {activity.tags.map((tag) => (
                        <span key={tag} className="rounded-md border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">{tag}</span>
                      ))}
                    </div>
                    <h3 className="mb-2 line-clamp-3 text-[18px] font-extrabold leading-[1.2] text-[var(--em-ink)] transition-colors group-hover:text-[var(--em-green-deep)]">{activity.title}</h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-[14px] font-medium leading-relaxed text-[var(--em-text-soft)]">{activity.desc}</p>
                    <div className="mb-4 mt-auto flex items-center justify-between border-t border-[var(--em-border-strong)] py-3">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--em-ink)]">
                        <Clock className="h-4 w-4 text-[var(--em-text-mute)]" />
                        {activity.deadline}
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((level) => (
                          <span key={level} className={`h-2.5 w-2.5 rounded-full ${activity.diff >= level ? "bg-[var(--em-ink)]" : "bg-[var(--em-border-strong)]"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelected(activity)} className="flex-1 rounded-xl border-2 border-[var(--em-ink)] py-2.5 text-[13px] font-extrabold text-[var(--em-ink)] transition-colors hover:bg-[var(--em-bg-alt)]">
                        Ver detalhes
                      </button>
                      <button onClick={() => setSelected(activity)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--em-ink)] bg-[var(--em-yellow)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-all hover:-translate-y-0.5">
                        <Download className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--em-border-strong)] pt-8">
            <span className="text-[13px] font-bold text-[var(--em-text-soft)]">Mostrando {showingStart}-{showingEnd} de {filtered.length} atividades</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage <= 1} className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--em-border-strong)] text-[var(--em-text-mute)] transition-colors hover:border-[var(--em-ink)] hover:text-[var(--em-ink)] disabled:opacity-50">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </button>
              <span className="grid h-10 min-w-10 place-items-center rounded-xl border-2 border-[var(--em-ink)] bg-[var(--em-ink)] px-3 text-[14px] font-extrabold text-white">{safePage}/{totalPages}</span>
              <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages} className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[var(--em-border-strong)] text-[var(--em-ink)] transition-colors hover:border-[var(--em-ink)] disabled:opacity-50">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden w-full shrink-0 md:block lg:w-[320px] xl:w-[360px]">
          <div className="sticky top-28 space-y-6">
            <div className="em-card-hard relative overflow-hidden bg-[var(--em-mint)] p-6">
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--em-ink)] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                  <Star className="h-3.5 w-3.5 fill-[var(--em-coral)] text-[var(--em-coral)]" />
                  Proxima da rotina
                </div>
                <h3 className="mb-3 text-[20px] font-extrabold leading-tight text-[var(--em-ink)]">Simulado FUVEST: A persistencia da fome</h3>
                <p className="mb-6 text-[14px] font-semibold text-[var(--em-ink-soft)]">Recomendado para focar em argumentacao sociologica.</p>
                <button className="em-btn-primary w-full justify-center !py-3" onClick={() => setSelected(ACTIVITIES[1])}>
                  Iniciar agora
                  <ArrowRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--em-ink)]/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[24px] border-2 border-[var(--em-ink)] bg-white p-6 shadow-[8px_8px_0_0_#0E0F12]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--em-text-soft)]">Detalhes da atividade</p>
                <h3 className="mt-1 text-2xl font-extrabold leading-tight text-[var(--em-ink)]">{selected.title}</h3>
              </div>
              <button className="rounded-xl border border-[var(--em-ink)] bg-white p-2" onClick={() => setSelected(null)} aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-5 text-sm font-semibold leading-relaxed text-[var(--em-text-soft)]">{selected.desc}</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-2 py-1 text-xs font-extrabold text-[var(--em-text-soft)]">{tag}</span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href="/envios" className="em-btn-primary justify-center">Iniciar redacao</a>
              <button className="rounded-xl border-2 border-[var(--em-ink)] px-5 py-3 text-sm font-extrabold text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]" onClick={() => setSelected(null)}>
                Continuar escolhendo
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}
