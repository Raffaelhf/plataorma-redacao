"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Star,
  Calendar,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Search,
  X,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

type ActivityStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";

export type AdminActivityItem = {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorInitials: string;
  tags: string[];
  status: ActivityStatus;
  submissionsCount: number;
  completionRate: number;
  createdAtLabel: string;
  publishedAtLabel: string | null;
  bg: string;
};

export type AdminActivitiesSummary = {
  generatedAtLabel: string;
  activities: AdminActivityItem[];
  filters: {
    creators: string[];
    tags: string[];
  };
  stats: {
    published: number;
    drafts: number;
    archived: number;
    createdThisMonth: number;
    createdMonthTrendLabel: string;
    mostSubmitted: {
      title: string;
      submissionsCount: number;
    } | null;
    averageSubmissionRate: number;
    highGradeRate: number;
    averageResponseTimeLabel: string;
  };
  highlights: Array<{
    id: string;
    title: string;
    active: boolean;
  }>;
};

const STATUS_LABELS: Record<ActivityStatus, string> = {
  PUBLISHED: "Publicado",
  DRAFT: "Rascunho",
  ARCHIVED: "Arquivado",
};

const STATUS_FILTERS = ["Todos", "Publicado", "Rascunho", "Arquivado"] as const;

function truncateTitle(title: string) {
  return title.length > 30 ? `${title.slice(0, 30)}...` : title;
}

function activityStatusFromLabel(label: string) {
  return Object.entries(STATUS_LABELS).find(([, statusLabel]) => statusLabel === label)?.[0] as ActivityStatus | undefined;
}

function statusBadgeClass(status: ActivityStatus) {
  if (status === "PUBLISHED") return "bg-[var(--em-green-soft)] text-[var(--em-green-deep)] border-[var(--em-green-deep)]/20";
  if (status === "DRAFT") return "bg-white text-[var(--em-text-soft)] border-[var(--em-border-strong)]";
  return "bg-[var(--em-bg)] text-[var(--em-text-mute)] border-[var(--em-border)]";
}

export function AdminAtividades({ summary }: { summary: AdminActivitiesSummary }) {
  const router = useRouter();
  const [creatorFilter, setCreatorFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [highlightState, setHighlightState] = useState<Record<string, boolean>>(
    Object.fromEntries(summary.highlights.map((highlight) => [highlight.id, highlight.active])),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    title: "",
    description: "",
    prompt: "",
    tags: "",
    status: "PUBLISHED" as "PUBLISHED" | "DRAFT",
  });
  const [isCreating, setIsCreating] = useState(false);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();
    const selectedStatus = activityStatusFromLabel(statusFilter);

    return summary.activities.filter((activity) => {
      const matchesCreator = creatorFilter === "Todos" || activity.authorName === creatorFilter;
      const matchesCategory = categoryFilter === "Todas" || activity.tags.includes(categoryFilter);
      const matchesStatus = statusFilter === "Todos" || activity.status === selectedStatus;
      const matchesSearch =
        !query || `${activity.title} ${activity.description} ${activity.authorName} ${activity.tags.join(" ")}`.toLowerCase().includes(query);

      return matchesCreator && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [categoryFilter, creatorFilter, search, statusFilter, summary.activities]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  async function createActivity() {
    setIsCreating(true);
    setMessage(null);

    const response = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: createDraft.title,
        description: createDraft.description,
        prompt: createDraft.prompt,
        tags: createDraft.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: createDraft.status,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    setIsCreating(false);

    if (!response.ok) {
      notify(payload.error || "Não foi possível criar a atividade.");
      return;
    }

    setCreateOpen(false);
    setCreateDraft({ title: "", description: "", prompt: "", tags: "", status: "PUBLISHED" });
    notify("Atividade criada com sucesso.");
    router.refresh();
  }

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker={`Atividades · ${summary.activities.length} na plataforma`}
      pageTitle="Gestão geral de atividades."
      primaryAction={{ label: "Nova atividade global", onClick: () => setCreateOpen(true) }}
    >
      <div className="space-y-8">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}

        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--em-border-strong)] bg-white/80 px-4 py-3 text-[12px] font-bold text-[var(--em-text-soft)] sm:flex-row sm:items-center sm:justify-between">
          <span>Atividades carregadas do banco de dados, com envios e desempenho atuais.</span>
          <span className="text-[var(--em-ink)]">Atualizado em {summary.generatedAtLabel}</span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total publicadas"
            value={summary.stats.published}
            caption="Ativas para alunos"
            icon={ClipboardList}
            bg="var(--em-mint)"
          />
          <StatCard
            title="Rascunhos"
            value={summary.stats.drafts}
            caption={`${summary.stats.archived} arquivadas`}
            icon={FileText}
            bg="var(--em-cream)"
          />
          <div className="em-card-hard flex flex-col justify-between bg-[var(--em-peach)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Mais respondida</span>
              <Star className="h-5 w-5 text-[var(--em-ink)]" />
            </div>
            <div className="mb-2 text-[18px] font-extrabold leading-tight text-[var(--em-ink)]">
              {summary.stats.mostSubmitted?.title ?? "Sem envios ainda"}
            </div>
            <div className="mt-auto self-start rounded-md border border-[var(--em-ink)] bg-white/40 px-2 py-1 text-[12px] font-bold text-[var(--em-ink)]">
              {summary.stats.mostSubmitted ? `${summary.stats.mostSubmitted.submissionsCount} envios` : "0 envios"}
            </div>
          </div>
          <div className="em-card-hard flex flex-col justify-between bg-[var(--em-lavender)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Criadas este mês</span>
              <Calendar className="h-5 w-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{summary.stats.createdThisMonth}</div>
            <div className="mt-2 self-start rounded-md border border-[var(--em-ink)] bg-white/40 px-2 py-1 text-[12px] font-bold text-[var(--em-ink)]">
              {summary.stats.createdMonthTrendLabel} vs mês passado
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          <div className="space-y-6 xl:col-span-3">
            <div className="em-card-hard flex flex-wrap items-center gap-4 bg-white p-4">
              <div className="mr-2 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--em-ink)]" />
                <span className="text-[14px] font-bold text-[var(--em-ink)]">Filtros</span>
              </div>

              <select value={creatorFilter} onChange={(event) => setCreatorFilter(event.target.value)} className="min-w-[140px] rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-3 py-2 text-[13px] font-semibold text-[var(--em-ink)] outline-none">
                <option>Todos</option>
                {summary.filters.creators.map((creator) => (
                  <option key={creator}>{creator}</option>
                ))}
              </select>

              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-w-[120px] rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-3 py-2 text-[13px] font-semibold text-[var(--em-ink)] outline-none">
                <option>Todas</option>
                {summary.filters.tags.map((tag) => (
                  <option key={tag}>{tag}</option>
                ))}
              </select>

              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-w-[120px] rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-3 py-2 text-[13px] font-semibold text-[var(--em-ink)] outline-none">
                {STATUS_FILTERS.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <div className="relative min-w-[200px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar atividade..."
                  className="w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] py-2 pl-9 pr-3 text-[13px] font-medium outline-none transition-colors focus:border-[var(--em-ink)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((item) => (
                <div key={item.id} className="em-card-hard group flex flex-col overflow-hidden bg-white transition-transform hover:-translate-y-1">
                  <div className="flex h-12 items-center justify-between border-b border-[var(--em-ink)] px-4" style={{ backgroundColor: item.bg }}>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass(item.status)}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                    <Link href={`/atividades/${item.id}`} className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-white/50" aria-label={`Abrir ${item.title}`}>
                      <MoreVertical className="h-4 w-4 text-[var(--em-ink)]" />
                    </Link>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="mb-3 line-clamp-2 flex-1 text-[16px] font-extrabold leading-snug text-[var(--em-ink)]">{item.title}</h4>

                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] text-[9px] font-bold text-[var(--em-ink)]">
                        {item.authorInitials}
                      </div>
                      <span className="text-[12px] font-semibold text-[var(--em-text-soft)]">{item.authorName}</span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {item.tags.length ? (
                        item.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded border border-[var(--em-border)] bg-[var(--em-bg)] px-2 py-0.5 text-[11px] font-bold text-[var(--em-text-soft)]">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded border border-[var(--em-border)] bg-[var(--em-bg)] px-2 py-0.5 text-[11px] font-bold text-[var(--em-text-mute)]">
                          Sem tags
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-[var(--em-border-strong)] pt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase text-[var(--em-text-mute)]">Envios</span>
                        <span className="text-[14px] font-extrabold text-[var(--em-ink)]">{item.submissionsCount}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-bold uppercase text-[var(--em-text-mute)]">Conclusão</span>
                        <span className="text-[14px] font-extrabold text-[var(--em-ink)]">{item.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[var(--em-ink)] border-t border-[var(--em-ink)] bg-[var(--em-bg-alt)]">
                    <Link href={`/atividades/${item.id}`} className="flex items-center justify-center gap-1 py-2 text-[12px] font-bold text-[var(--em-ink)] transition-colors hover:bg-[var(--em-yellow)]">
                      <Eye className="h-3.5 w-3.5" /> Detalhes
                    </Link>
                    <Link href={`/atividades/${item.id}`} className="flex items-center justify-center gap-1 py-2 text-[12px] font-bold text-[var(--em-ink)] transition-colors hover:bg-[var(--em-yellow)]">
                      <Edit className="h-3.5 w-3.5" /> Editar
                    </Link>
                  </div>
                </div>
              ))}
              {filteredActivities.length === 0 ? (
                <div className="em-card-hard col-span-full bg-white p-8 text-center text-sm font-extrabold text-[var(--em-text-soft)]">
                  Nenhuma atividade encontrada com os filtros atuais.
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="em-card-hard bg-white p-6">
              <div className="mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 fill-current text-[var(--em-yellow-deep)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Destaques na Home</h3>
              </div>
              <p className="mb-4 text-[13px] font-medium text-[var(--em-text-soft)]">
                Lista calculada com as atividades publicadas mais recentes e com mais envios.
              </p>

              <div className="space-y-3">
                {summary.highlights.length ? (
                  summary.highlights.map((item) => (
                    <div key={item.id} className="flex items-start justify-between rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-3">
                      <span className="flex-1 pr-3 text-[13px] font-bold leading-snug text-[var(--em-ink)]">{truncateTitle(item.title)}</span>
                      <label className="relative mt-0.5 inline-flex shrink-0 cursor-pointer items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={highlightState[item.id] ?? item.active}
                          onChange={(event) => {
                            setHighlightState((current) => ({ ...current, [item.id]: event.target.checked }));
                          }}
                        />
                        <div className="peer h-5 w-9 rounded-full border border-[var(--em-ink)] bg-[var(--em-border-strong)] after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[var(--em-green)] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-4 text-[13px] font-bold text-[var(--em-text-soft)]">
                    Publique atividades para gerar destaques.
                  </div>
                )}
              </div>
              <button type="button" onClick={() => setCreateOpen(true)} className="mt-5 w-full rounded-xl border border-dashed border-[var(--em-ink)] py-2 text-[13px] font-bold text-[var(--em-ink)] transition-colors hover:bg-[var(--em-cream)]">
                + Adicionar destaque
              </button>
            </div>

            <div className="em-card-hard bg-[var(--em-ink)] p-6 text-white">
              <h3 className="mb-6 text-[16px] font-extrabold">Desempenho das atividades</h3>
              <div className="space-y-5">
                <ProgressRow label="Taxa média de envio" value={summary.stats.averageSubmissionRate} color="var(--em-green)" />
                <ProgressRow label="Atividades com nota > 800" value={summary.stats.highGradeRate} color="var(--em-yellow)" />
                <div>
                  <div className="mb-1 flex justify-between text-[12px] font-bold">
                    <span className="text-[var(--em-text-on-dark-soft)]">Tempo médio de resposta</span>
                    <span>{summary.stats.averageResponseTimeLabel}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[var(--em-lavender)]" style={{ width: "60%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {createOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-2xl rounded-[22px] border-[1.5px] border-[var(--em-ink)] bg-white p-5 shadow-[8px_8px_0_0_#0E0F12]">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Nova atividade global</h3>
                <p className="mt-1 text-[13px] font-semibold text-[var(--em-text-soft)]">Crie uma proposta real e publique para os alunos.</p>
              </div>
              <button type="button" onClick={() => setCreateOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--em-border-strong)] hover:border-[var(--em-ink)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input value={createDraft.title} onChange={(event) => setCreateDraft((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-3 text-sm font-bold outline-none focus:border-[var(--em-ink)]" placeholder="Título da atividade" />
              <textarea value={createDraft.description} onChange={(event) => setCreateDraft((current) => ({ ...current, description: event.target.value }))} className="min-h-[84px] w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-3 text-sm font-semibold outline-none focus:border-[var(--em-ink)]" placeholder="Descrição breve" />
              <textarea value={createDraft.prompt} onChange={(event) => setCreateDraft((current) => ({ ...current, prompt: event.target.value }))} className="min-h-[140px] w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-3 text-sm font-semibold outline-none focus:border-[var(--em-ink)]" placeholder="Enunciado / prompt para o aluno" />
              <div className="grid gap-3 sm:grid-cols-[1fr_170px]">
                <input value={createDraft.tags} onChange={(event) => setCreateDraft((current) => ({ ...current, tags: event.target.value }))} className="w-full rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-3 text-sm font-semibold outline-none focus:border-[var(--em-ink)]" placeholder="Tags separadas por vírgula" />
                <select value={createDraft.status} onChange={(event) => setCreateDraft((current) => ({ ...current, status: event.target.value as "PUBLISHED" | "DRAFT" }))} className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-3 text-sm font-bold outline-none focus:border-[var(--em-ink)]">
                  <option value="PUBLISHED">Publicar agora</option>
                  <option value="DRAFT">Salvar rascunho</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-xl border border-[var(--em-border-strong)] px-4 py-3 text-sm font-bold text-[var(--em-text-soft)] hover:border-[var(--em-ink)] hover:text-[var(--em-ink)]">
                Cancelar
              </button>
              <button type="button" onClick={createActivity} disabled={isCreating} className="em-btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60">
                <Send className="h-4 w-4" />
                {isCreating ? "Criando..." : "Criar atividade"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}

function StatCard({ title, value, caption, icon: Icon, bg }: { title: string; value: number; caption: string; icon: typeof ClipboardList; bg: string }) {
  return (
    <div className="em-card-hard flex flex-col justify-between p-5" style={{ backgroundColor: bg }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[14px] font-bold text-[var(--em-ink)]">{title}</span>
        <Icon className="h-5 w-5 text-[var(--em-ink)]" />
      </div>
      <div className="em-display text-[42px] text-[var(--em-ink)]">{value}</div>
      <div className="mt-2 self-start rounded-md border border-[var(--em-ink)] bg-white/40 px-2 py-1 text-[12px] font-semibold text-[var(--em-ink)]">
        {caption}
      </div>
    </div>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12px] font-bold">
        <span className="text-[var(--em-text-on-dark-soft)]">{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
