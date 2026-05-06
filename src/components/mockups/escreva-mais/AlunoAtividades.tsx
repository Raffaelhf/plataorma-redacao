"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Book,
  Brain,
  Building,
  ChevronRight,
  Clock,
  Cpu,
  Download,
  FileText,
  Globe,
  Heart,
  Leaf,
  Search,
  Star,
  Users,
  Vote,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

export type AlunoActivityItem = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  bg: string;
  publishedAtMs: number;
  dueDateMs: number | null;
  dueDateLabel: string;
  submission:
    | {
        status: "PENDING" | "UNDER_REVIEW" | "RETURNED" | "GRADED";
        grade: number | null;
        submittedAtLabel: string;
      }
    | null;
  attachmentsCount: number;
  firstAttachmentHref: string | null;
};

type AlunoAtividadesProps = {
  viewer: {
    name: string;
    email: string;
  };
  activities: AlunoActivityItem[];
  generatedAtLabel: string;
};

const PAGE_SIZE = 6;

const STATUS_STYLES = {
  PENDING: {
    label: "Enviada",
    className: "bg-[var(--em-yellow)] text-[var(--em-ink)]",
  },
  UNDER_REVIEW: {
    label: "Em correcao",
    className: "bg-[var(--em-peach)] text-[var(--em-peach-deep)]",
  },
  RETURNED: {
    label: "Devolvida",
    className: "bg-[var(--em-rose)] text-[var(--em-ink)]",
  },
  GRADED: {
    label: "Corrigida",
    className: "bg-[var(--em-green)] text-white",
  },
} as const;

const ICON_RULES: Array<{ terms: string[]; icon: LucideIcon }> = [
  { terms: ["tecnologia", "digital", "ia", "inteligencia artificial", "dados"], icon: Cpu },
  { terms: ["saude", "mental", "produtividade"], icon: Brain },
  { terms: ["moradia", "cidade", "urbano", "metropole"], icon: Building },
  { terms: ["religiosa", "intolerancia", "direitos"], icon: Heart },
  { terms: ["ambiente", "clima", "agricultura", "sustentavel"], icon: Leaf },
  { terms: ["politica", "jovem", "cidadania"], icon: Vote },
  { terms: ["cultura", "memoria", "historia", "museu"], icon: Book },
  { terms: ["social", "global", "brasil"], icon: Globe },
  { terms: ["redes", "comunidades", "expressao"], icon: Users },
];

function activityIcon(activity: AlunoActivityItem) {
  const text = `${activity.title} ${activity.description} ${activity.tags.join(" ")}`.toLowerCase();
  return ICON_RULES.find((rule) => rule.terms.some((term) => text.includes(term)))?.icon ?? FileText;
}

function statusBadge(activity: AlunoActivityItem) {
  if (activity.submission) return STATUS_STYLES[activity.submission.status];

  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - activity.publishedAtMs <= sevenDaysMs) {
    return {
      label: "Nova",
      className: "bg-[var(--em-green)] text-white",
    };
  }

  return null;
}

export function AlunoAtividades({ viewer, activities, generatedAtLabel }: AlunoAtividadesProps) {
  const filters = useMemo(() => {
    const tags = [...new Set(activities.flatMap((activity) => activity.tags))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    return ["Todas", ...tags];
  }, [activities]);

  const [activeFilter, setActiveFilter] = useState("Todas");
  const [order, setOrder] = useState("Mais recentes");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AlunoActivityItem | null>(null);

  const filtered = useMemo(() => {
    const result = activities.filter((activity) => activeFilter === "Todas" || activity.tags.includes(activeFilter));

    return [...result].sort((a, b) => {
      if (order === "Prazo mais proximo") {
        if (a.dueDateMs === null && b.dueDateMs === null) return b.publishedAtMs - a.publishedAtMs;
        if (a.dueDateMs === null) return 1;
        if (b.dueDateMs === null) return -1;
        return a.dueDateMs - b.dueDateMs;
      }

      if (order === "Nao enviadas primeiro") return Number(Boolean(a.submission)) - Number(Boolean(b.submission));
      if (order === "Ja enviadas primeiro") return Number(Boolean(b.submission)) - Number(Boolean(a.submission));

      return b.publishedAtMs - a.publishedAtMs;
    });
  }, [activeFilter, activities, order]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const showingStart = filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const showingEnd = Math.min(safePage * PAGE_SIZE, filtered.length);
  const recommended = activities.find((activity) => !activity.submission) ?? activities[0] ?? null;

  const chooseFilter = (filter: string) => {
    setActiveFilter(filter);
    setPage(1);
  };

  return (
    <AppLayout
      role="aluno"
      userName={viewer.name}
      userEmail={viewer.email}
      pageKicker={`Atividades publicadas - atualizado em ${generatedAtLabel}`}
      pageTitle="Escolha sua proxima redacao."
      primaryAction={{ label: "Buscar tema", icon: <Search className="w-4 h-4" />, href: "/atividades" }}
    >
      <div className="flex flex-col gap-8 pb-12 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filters.map((filter) => (
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
                <option>Nao enviadas primeiro</option>
                <option>Ja enviadas primeiro</option>
              </select>
            </div>
          </div>

          {visible.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((activity) => {
                const Icon = activityIcon(activity);
                const badge = statusBadge(activity);

                return (
                  <div key={activity.id} className="em-card-hard group flex flex-col overflow-hidden bg-white">
                    <div className="relative flex h-20 items-center border-b-2 border-[var(--em-ink)] px-5" style={{ background: activity.bg }}>
                      <div className="grid h-12 w-12 -translate-y-2 place-items-center rounded-xl border-2 border-[var(--em-ink)] bg-white text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-transform group-hover:scale-105">
                        <Icon className="h-6 w-6" strokeWidth={2.5} />
                      </div>
                      {badge ? (
                        <span className={`absolute right-4 top-4 rounded-full border border-[var(--em-ink)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-[2px_2px_0_0_#0E0F12] ${badge.className}`}>
                          {badge.label}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        {activity.tags.length ? (
                          activity.tags.map((tag) => (
                            <span key={tag} className="rounded-md border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-md border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--em-text-soft)]">Redacao</span>
                        )}
                      </div>
                      <h3 className="mb-2 line-clamp-3 text-[18px] font-extrabold leading-[1.2] text-[var(--em-ink)] transition-colors group-hover:text-[var(--em-green-deep)]">{activity.title}</h3>
                      <p className="mb-4 line-clamp-2 flex-1 text-[14px] font-medium leading-relaxed text-[var(--em-text-soft)]">{activity.description}</p>
                      <div className="mb-4 mt-auto flex items-center justify-between gap-3 border-t border-[var(--em-border-strong)] py-3">
                        <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--em-ink)]">
                          <Clock className="h-4 w-4 text-[var(--em-text-mute)]" />
                          {activity.dueDateLabel}
                        </div>
                        <span className="shrink-0 text-[11px] font-bold text-[var(--em-text-soft)]">
                          {activity.attachmentsCount ? `${activity.attachmentsCount} material${activity.attachmentsCount > 1 ? "s" : ""}` : "Sem material"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSelected(activity)} className="flex-1 rounded-xl border-2 border-[var(--em-ink)] py-2.5 text-[13px] font-extrabold text-[var(--em-ink)] transition-colors hover:bg-[var(--em-bg-alt)]">
                          Ver detalhes
                        </button>
                        {activity.firstAttachmentHref ? (
                          <a
                            href={activity.firstAttachmentHref}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--em-ink)] bg-[var(--em-yellow)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-all hover:-translate-y-0.5"
                            aria-label="Baixar primeiro material"
                          >
                            <Download className="h-4 w-4" strokeWidth={2.5} />
                          </a>
                        ) : (
                          <Link
                            href={`/atividades/${activity.id}`}
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--em-ink)] bg-[var(--em-yellow)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-all hover:-translate-y-0.5"
                            aria-label="Abrir atividade"
                          >
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="em-card-hard bg-white p-8 text-center">
              <h3 className="text-[22px] font-extrabold text-[var(--em-ink)]">Nenhuma atividade publicada por enquanto.</h3>
              <p className="mx-auto mt-2 max-w-xl text-[14px] font-semibold leading-6 text-[var(--em-text-soft)]">
                Assim que uma proposta real for publicada pelos professores, ela aparece aqui automaticamente.
              </p>
            </div>
          )}

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
            {recommended ? (
              <div className="em-card-hard relative overflow-hidden bg-[var(--em-mint)] p-6">
                <div className="relative z-10">
                  <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--em-ink)] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                    <Star className="h-3.5 w-3.5 fill-[var(--em-coral)] text-[var(--em-coral)]" />
                    Proxima da rotina
                  </div>
                  <h3 className="mb-3 text-[20px] font-extrabold leading-tight text-[var(--em-ink)]">{recommended.title}</h3>
                  <p className="mb-6 line-clamp-3 text-[14px] font-semibold text-[var(--em-ink-soft)]">{recommended.description}</p>
                  <Link href={`/atividades/${recommended.id}`} className="em-btn-primary w-full justify-center !py-3">
                    Iniciar agora
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : null}
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
            <p className="mb-4 text-sm font-semibold leading-relaxed text-[var(--em-text-soft)]">{selected.description}</p>
            <div className="mb-5 rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--em-text-soft)]">Proposta</p>
              <p className="mt-2 line-clamp-6 whitespace-pre-wrap text-sm font-medium leading-7 text-[var(--em-ink)]">{selected.prompt}</p>
            </div>
            <div className="mb-6 flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <span key={tag} className="rounded-md border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-2 py-1 text-xs font-extrabold text-[var(--em-text-soft)]">{tag}</span>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href={`/atividades/${selected.id}`} className="em-btn-primary justify-center">Iniciar redacao</Link>
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
