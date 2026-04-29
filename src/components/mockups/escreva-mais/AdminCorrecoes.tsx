"use client";

import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ClipboardCheck, Clock, Filter, MoreVertical, Search, Users } from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

export type AdminCorrectionQueueItem = {
  id: string;
  aluno: string;
  tema: string;
  prof: string | null;
  tempo: string;
  waitHours: number;
  urgencia: "vermelho" | "ambar" | "verde";
  status: string;
  atividade: string;
};

export type AdminCorrectionDistributionItem = {
  prof: string;
  atual: number;
  percent: number;
  color: string;
};

export type AdminCorrectionTimelineItem = {
  text: string;
  time: string;
  type: "system" | "prof" | "alert" | "admin";
};

export type AdminCorrectionStats = {
  pending: number;
  overdue: number;
  averageWaitHours: number;
  activeTeachers: number;
};

export function AdminCorrecoes({
  viewer,
  stats,
  queue,
  distribution,
  timeline,
}: {
  viewer: { name: string; email: string };
  stats: AdminCorrectionStats;
  queue: AdminCorrectionQueueItem[];
  distribution: AdminCorrectionDistributionItem[];
  timeline: AdminCorrectionTimelineItem[];
}) {
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("Todos");
  const [activityFilter, setActivityFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const pageSize = 6;

  const teacherOptions = useMemo(() => {
    const values = Array.from(new Set(queue.map((item) => item.prof ?? "Nao atribuido")));
    return ["Todos", ...values.sort((a, b) => a.localeCompare(b, "pt-BR"))];
  }, [queue]);

  const activityOptions = useMemo(() => {
    const values = Array.from(new Set(queue.map((item) => item.atividade)));
    return ["Todas", ...values.sort((a, b) => a.localeCompare(b, "pt-BR"))];
  }, [queue]);

  const statusOptions = useMemo(() => {
    const values = Array.from(new Set(queue.map((item) => item.status)));
    return ["Todos", ...values.sort((a, b) => a.localeCompare(b, "pt-BR"))];
  }, [queue]);

  const filteredQueue = useMemo(() => {
    const query = search.trim().toLowerCase();

    return queue.filter((item) => {
      const teacherName = item.prof ?? "Nao atribuido";
      const matchesTeacher = teacherFilter === "Todos" || teacherName === teacherFilter;
      const matchesActivity = activityFilter === "Todas" || item.atividade === activityFilter;
      const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;
      const matchesSearch = !query || `${item.aluno} ${item.tema} ${teacherName}`.toLowerCase().includes(query);

      return matchesTeacher && matchesActivity && matchesStatus && matchesSearch;
    });
  }, [activityFilter, queue, search, statusFilter, teacherFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredQueue.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleQueue = filteredQueue.slice((safePage - 1) * pageSize, safePage * pageSize);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  function resetFilters() {
    setSearch("");
    setTeacherFilter("Todos");
    setActivityFilter("Todas");
    setStatusFilter("Todos");
    setPage(1);
  }

  return (
    <AppLayout
      role="admin"
      userName={viewer.name}
      userEmail={viewer.email}
      pageKicker="Correcoes · Visao administrativa"
      pageTitle="Fila geral da plataforma."
      primaryAction={{ label: "Distribuir para professores", onClick: () => notify(`${filteredQueue.length} envios na visualizacao atual.`) }}
    >
      <div className="space-y-8 pb-12">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="em-card-hard bg-[var(--em-cream)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--em-text-soft)]">Total pendentes</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--em-ink)] bg-white shadow-[2px_2px_0_0_#0E0F12]">
                <ClipboardCheck className="h-4 w-4 text-[var(--em-ink)]" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.pending}</div>
          </div>

          <div className="em-card-hard border-2 border-[var(--em-coral)] bg-[var(--em-surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--em-coral)]">Em atraso &gt;48h</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--em-ink)] bg-[var(--em-coral)] shadow-[2px_2px_0_0_#0E0F12]">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-coral)]">{stats.overdue}</div>
            <div className="mt-1 text-[12px] font-bold text-[var(--em-ink)]">Atencao necessaria</div>
          </div>

          <div className="em-card-hard bg-[var(--em-mint)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Tempo medio espera</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--em-ink)] bg-white shadow-[2px_2px_0_0_#0E0F12]">
                <Clock className="h-4 w-4 text-[var(--em-ink)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.averageWaitHours}</div>
              <span className="text-[18px] font-bold text-[var(--em-text-soft)]">h</span>
            </div>
          </div>

          <div className="em-card-hard bg-[var(--em-lavender)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Professores ativos hoje</span>
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--em-ink)] bg-white shadow-[2px_2px_0_0_#0E0F12]">
                <Users className="h-4 w-4 text-[var(--em-ink)]" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.activeTeachers}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="em-card-hard flex flex-col overflow-hidden bg-white">
              <div className="space-y-4 border-b border-[var(--em-ink)] bg-[var(--em-cream)] p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <h2 className="text-[20px] font-extrabold text-[var(--em-ink)]">Fila Geral</h2>
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--em-border-strong)] bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-[var(--em-text-mute)]" />
                    <input
                      type="text"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Buscar aluno..."
                      className="w-full border-none bg-transparent text-[13px] font-semibold outline-none sm:w-[200px]"
                    />
                  </div>
                </div>

                <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <select value={teacherFilter} onChange={(event) => { setTeacherFilter(event.target.value); setPage(1); }} className="em-chip shrink-0 cursor-pointer bg-white outline-none hover:bg-[var(--em-bg-alt)]">
                    {teacherOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <select value={activityFilter} onChange={(event) => { setActivityFilter(event.target.value); setPage(1); }} className="em-chip shrink-0 cursor-pointer bg-white outline-none hover:bg-[var(--em-bg-alt)]">
                    {activityOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="em-chip shrink-0 cursor-pointer bg-white outline-none hover:bg-[var(--em-bg-alt)]">
                    {statusOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                  <button type="button" onClick={resetFilters} className="em-chip flex shrink-0 items-center gap-1 border-[var(--em-ink)] bg-[var(--em-ink)] text-white">
                    <Filter className="h-3 w-3" /> Limpar filtros
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                      <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Aluno</th>
                      <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Atividade</th>
                      <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Professor</th>
                      <th className="p-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Espera</th>
                      <th className="p-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Acao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleQueue.map((item) => {
                      const teacherName = item.prof ?? "Nao atribuido";
                      return (
                        <tr key={item.id} className="group border-b border-[var(--em-border)] transition-colors hover:bg-[var(--em-cream)]">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--em-ink)] bg-[var(--em-peach)] text-[11px] font-bold text-[var(--em-ink)]">
                                {item.aluno.split(" ").map((name) => name[0]).join("").substring(0, 2)}
                              </div>
                              <span className="text-[14px] font-semibold text-[var(--em-ink)]">{item.aluno}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="line-clamp-1 text-[13px] font-semibold text-[var(--em-ink)]">{item.tema}</div>
                            <div className="mt-1 text-[11px] font-bold text-[var(--em-text-soft)]">{item.atividade}</div>
                          </td>
                          <td className="p-4">
                            {item.prof ? (
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--em-ink)] bg-[var(--em-lavender)] text-[9px] font-bold text-[var(--em-ink)]">
                                  {teacherName.split(" ").map((name) => name[0]).join("").substring(0, 2)}
                                </div>
                                <span className="text-[13px] font-semibold text-[var(--em-ink)]">{teacherName}</span>
                              </div>
                            ) : (
                              <span className="rounded border border-[var(--em-coral)] bg-[var(--em-rose)] px-2 py-0.5 text-[12px] font-bold text-[var(--em-coral)]">Sem prof.</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-md border border-[var(--em-ink)] px-2 py-1 text-[11px] font-bold ${
                              item.urgencia === "vermelho" ? "bg-[#FF5A5A] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" :
                              item.urgencia === "ambar" ? "bg-[#FFB020] text-[var(--em-ink)]" :
                              "bg-[var(--em-green)] text-[var(--em-ink)]"
                            }`}>
                              <Clock className="h-3 w-3" /> {item.tempo}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button type="button" onClick={() => notify(`Acoes abertas para ${item.aluno}.`)} className="rounded p-1.5 text-[var(--em-text-mute)] transition-colors hover:bg-[var(--em-bg-alt)] hover:text-[var(--em-ink)]">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {visibleQueue.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm font-extrabold text-[var(--em-text-soft)]">
                          Nenhuma correcao encontrada com os filtros atuais.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-[var(--em-ink)] bg-[var(--em-bg)] p-4 text-[13px] font-semibold text-[var(--em-text-soft)]">
                <span>Mostrando {visibleQueue.length ? (safePage - 1) * pageSize + 1 : 0}-{Math.min(safePage * pageSize, filteredQueue.length)} de {filteredQueue.length}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage <= 1} className="rounded border border-[var(--em-border-strong)] bg-white px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50">Anterior</button>
                  <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages} className="rounded border border-[var(--em-ink)] bg-white px-3 py-1 text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)] disabled:cursor-not-allowed disabled:opacity-50">Proxima</button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="em-card-hard bg-white p-6">
              <h3 className="mb-6 text-[16px] font-extrabold text-[var(--em-ink)]">Distribuicao atual</h3>

              <div className="space-y-4">
                {(distribution.length ? distribution : [{ prof: "Sem envios atribuidos", atual: 0, percent: 0, color: "var(--em-bg)" }]).map((item) => (
                  <div key={item.prof}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--em-ink)] text-[9px] font-bold text-[var(--em-ink)]" style={{ backgroundColor: item.color }}>
                          {item.prof.split(" ").map((name) => name[0]).join("").substring(0, 2)}
                        </div>
                        <span className="text-[13px] font-bold text-[var(--em-ink)]">{item.prof}</span>
                      </div>
                      <span className="text-[12px] font-extrabold text-[var(--em-ink)]">{item.atual} envios</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                      <div className="h-full border-r border-[var(--em-ink)] bg-[var(--em-green)]" style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => notify("Distribuicao baseada nos envios pendentes reais.")} className="mt-6 w-full rounded-xl border border-[var(--em-ink)] py-2 text-[13px] font-bold transition-colors hover:bg-[var(--em-cream)]">
                Gerenciar professores
              </button>
            </div>

            <div className="em-card-hard bg-[var(--em-cream)] p-6">
              <h3 className="mb-6 text-[16px] font-extrabold text-[var(--em-ink)]">Atividade recente</h3>

              <div className="relative space-y-5 before:absolute before:inset-0 before:ml-[11px] before:h-full before:w-0.5 before:-translate-x-px before:bg-[var(--em-border-strong)] md:before:mx-auto md:before:translate-x-0">
                {(timeline.length ? timeline : [{ text: "Nenhuma atividade recente registrada.", time: "Agora", type: "system" as const }]).map((act, i) => (
                  <div key={`${act.text}-${i}`} className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                    <div
                      className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--em-ink)] bg-white shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2"
                      style={{
                        backgroundColor: act.type === "alert" ? "var(--em-coral)" : act.type === "system" ? "var(--em-lavender)" : "var(--em-mint)",
                      }}
                    >
                      {act.type === "alert" && <AlertCircle className="h-3 w-3 text-white" />}
                      {act.type === "prof" && <CheckCircle2 className="h-3 w-3 text-[var(--em-ink)]" />}
                      {act.type === "system" && <Clock className="h-3 w-3 text-[var(--em-ink)]" />}
                      {act.type === "admin" && <Users className="h-3 w-3 text-[var(--em-ink)]" />}
                    </div>
                    <div className="w-[calc(100%-3rem)] rounded-xl border border-[var(--em-border-strong)] bg-white p-3 shadow-sm md:w-[calc(50%-2rem)]">
                      <p className="mb-1 text-[12px] font-semibold leading-tight text-[var(--em-ink)]">{act.text}</p>
                      <time className="text-[10px] font-bold text-[var(--em-text-mute)]">{act.time}</time>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
