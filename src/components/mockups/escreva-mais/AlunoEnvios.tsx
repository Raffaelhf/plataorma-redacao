"use client";

import Link from "next/link";
import { AlertCircle, ChevronDown, ChevronUp, CheckCircle2, Clock, Download, Eye, FileText, RefreshCw, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";

type EnviosStatus = "Todas" | "Em correção" | "Corrigidas" | "Devolvidas";

type StudentCorrection = {
  score: number;
  comments: string | null;
  strengths: string[];
  improvements: string[];
  teacherName: string | null;
  createdAt: string;
};

export type StudentSubmissionItem = {
  id: string;
  submittedAt: string;
  title: string;
  status: string;
  grade: number | null;
  pdfHref: string | null;
  correction: StudentCorrection | null;
};

type AlunoEnviosProps = {
  viewer: { name: string; email: string };
  submissions: StudentSubmissionItem[];
  awaitingSubmissionCount: number;
};

function formatSubmissionDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(value))
    .replace(".", "");
}

function getStatusLabel(status: string) {
  if (status === "GRADED") return "Corrigida";
  if (status === "RETURNED") return "Devolvida";
  if (status === "UNDER_REVIEW") return "Em correção";
  return "Pendente";
}

function getTabStatus(label: EnviosStatus, status: string) {
  if (label === "Todas") return true;
  if (label === "Corrigidas") return status === "GRADED";
  if (label === "Devolvidas") return status === "RETURNED";
  if (label === "Em correção") return status === "PENDING" || status === "UNDER_REVIEW";
  return true;
}

function getSubmissionScore(submission: StudentSubmissionItem) {
  return submission.correction?.score ?? submission.grade;
}

function getStatusBadgeClasses(status: string) {
  if (status === "GRADED") return "bg-[var(--em-green-soft)] text-[var(--em-green-deep)]";
  if (status === "RETURNED") return "bg-[var(--em-rose)] text-[var(--em-rose-deep)]";
  return "bg-[var(--em-peach)] text-[var(--em-peach-deep)]";
}

function EmptyList() {
  return (
    <div className="em-card-hard bg-white p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-[var(--em-ink)] bg-[var(--em-cream)]">
        <FileText className="h-5 w-5 text-[var(--em-ink)]" />
      </div>
      <h3 className="mt-4 text-[18px] font-extrabold text-[var(--em-ink)]">Nenhum envio encontrado</h3>
      <p className="mt-2 text-sm font-semibold text-[var(--em-text-soft)]">
        Assim que você enviar uma redação, ela aparecerá aqui com o status real da correção.
      </p>
    </div>
  );
}

export function AlunoEnvios({ viewer, submissions, awaitingSubmissionCount }: AlunoEnviosProps) {
  const [activeTab, setActiveTab] = useState<EnviosStatus>("Todas");
  const firstCorrectedSubmission = submissions.find((submission) => submission.status === "GRADED");
  const [expandedId, setExpandedId] = useState<string | null>(firstCorrectedSubmission?.id ?? submissions[0]?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  const stats = useMemo(() => {
    const corrected = submissions.filter((submission) => submission.status === "GRADED").length;
    const inCorrection = submissions.filter((submission) => submission.status === "PENDING" || submission.status === "UNDER_REVIEW").length;
    return {
      total: submissions.length,
      corrected,
      inCorrection,
    };
  }, [submissions]);

  const visibleSubmissions = submissions.filter((submission) => getTabStatus(activeTab, submission.status));

  return (
    <AppLayout
      role="aluno"
      userName={viewer.name}
      userEmail={viewer.email}
      pageKicker={`Meus envios · ${stats.total} redações`}
      pageTitle="Sua jornada em PDF."
      primaryAction={{ label: "Enviar nova redação", href: "/atividades" }}
    >
      <div className="space-y-8">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="em-card-hard flex flex-col justify-between bg-[var(--em-mint)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-extrabold text-[var(--em-ink)]">Total enviadas</span>
              <FileText className="h-5 w-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.total}</div>
          </div>

          <div className="em-card-hard flex flex-col justify-between bg-[var(--em-lavender)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-extrabold text-[var(--em-ink)]">Já corrigidas</span>
              <CheckCircle2 className="h-5 w-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.corrected}</div>
          </div>

          <div className="em-card-hard flex flex-col justify-between bg-[var(--em-peach)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-extrabold text-[var(--em-ink)]">Em correção</span>
              <Clock className="h-5 w-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.inCorrection}</div>
          </div>

          <div className="em-card-hard flex flex-col justify-between border-[2px] border-dashed bg-[var(--em-muted)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[14px] font-extrabold text-[var(--em-text-soft)]">Aguardando envio</span>
              <Upload className="h-5 w-5 text-[var(--em-text-soft)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-text-soft)]">{awaitingSubmissionCount}</div>
          </div>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-2">
          {(["Todas", "Em correção", "Corrigidas", "Devolvidas"] as EnviosStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`em-chip shrink-0 transition-all ${
                activeTab === tab ? "border-[var(--em-ink)] bg-[var(--em-ink)] text-white shadow-[2px_2px_0_0_#2BD37B]" : "bg-white hover:bg-[var(--em-bg-alt)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visibleSubmissions.length === 0 ? <EmptyList /> : null}

          {visibleSubmissions.map((submission) => {
            const isExpanded = expandedId === submission.id;
            const statusLabel = getStatusLabel(submission.status);
            const score = getSubmissionScore(submission);
            const correction = submission.correction;

            return (
              <div key={submission.id} className="em-card-hard overflow-hidden bg-white transition-all duration-300">
                <div
                  className="flex cursor-pointer flex-col gap-4 p-5 transition-colors hover:bg-[var(--em-bg)] md:flex-row md:items-center"
                  onClick={() => setExpandedId(isExpanded ? null : submission.id)}
                >
                  <div className="hidden h-16 w-12 shrink-0 flex-col items-center justify-center rounded border border-[var(--em-border-strong)] bg-[var(--em-cream)] text-[8px] font-bold text-[var(--em-text-mute)] md:flex">
                    <FileText className="mb-1 h-5 w-5 opacity-50" />
                    PDF
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center gap-3">
                      <span className="text-[12px] font-bold text-[var(--em-text-soft)]">{formatSubmissionDate(submission.submittedAt)}</span>
                      <span className={`rounded-full border border-[var(--em-ink)] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide shadow-[1px_1px_0_0_#0E0F12] ${getStatusBadgeClasses(submission.status)}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <h3 className="truncate text-[16px] font-extrabold leading-tight text-[var(--em-ink)] md:text-[18px]">{submission.title}</h3>
                  </div>

                  <div className="flex w-full items-center justify-between gap-6 border-t border-[var(--em-border)] pt-3 md:w-auto md:justify-end md:border-t-0 md:pt-0">
                    {typeof score === "number" ? (
                      <div className="flex items-baseline gap-1 rounded-full border border-[var(--em-ink)] bg-[var(--em-green-soft)] px-4 py-2 shadow-[2px_2px_0_0_#0E0F12]">
                        <span className="text-[20px] font-extrabold text-[var(--em-ink)]">{score}</span>
                        <span className="text-[12px] font-bold text-[var(--em-ink)]/60">/1000</span>
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-[14px] font-bold text-[var(--em-text-mute)]">-- /1000</div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          notify(correction ? `Correção aberta: ${submission.title}` : `Status atualizado: ${submission.title}`);
                        }}
                        className="rounded-lg border border-[var(--em-ink)] bg-[var(--em-bg)] p-2 text-[var(--em-ink)] transition-colors hover:bg-[var(--em-yellow)]"
                      >
                        {correction ? <Eye className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setExpandedId(isExpanded ? null : submission.id);
                        }}
                        className="rounded-lg p-2 text-[var(--em-ink)] transition-colors hover:bg-[var(--em-bg)]"
                      >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="animate-in fade-in slide-in-from-top-4 border-t border-[var(--em-ink)] bg-[var(--em-bg)] p-6 duration-300 md:p-8">
                    {correction ? (
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6">
                          <div className="rounded-2xl border border-[var(--em-ink)] bg-white p-6 text-center shadow-[4px_4px_0_0_#0E0F12]">
                            <div className="mb-2 text-[12px] font-extrabold uppercase tracking-widest text-[var(--em-text-soft)]">Nota Geral</div>
                            <div className="em-display text-center text-[64px] leading-none text-[var(--em-ink)]">
                              {correction.score} <span className="text-[24px] text-[var(--em-text-mute)]">/1000</span>
                            </div>
                          </div>

                          <div className="space-y-4 rounded-2xl border border-[var(--em-ink)] bg-white p-6 shadow-[4px_4px_0_0_#0E0F12]">
                            <h4 className="mb-2 text-[14px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Competências</h4>
                            <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] p-4 text-[13px] font-bold leading-6 text-[var(--em-text-soft)]">
                              A nota por competência ainda não é salva separadamente nesta correção. A plataforma registra a nota total real e o feedback do avaliador.
                            </div>
                          </div>
                        </div>

                        <div className="space-y-6 lg:col-span-2">
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FeedbackList
                              title="Pontos Fortes"
                              icon={<CheckCircle2 className="h-5 w-5 text-[var(--em-green-deep)]" />}
                              items={correction.strengths}
                              emptyLabel="Nenhum ponto forte registrado nessa correção."
                              className="bg-[var(--em-mint)]"
                            />
                            <FeedbackList
                              title="O que melhorar"
                              icon={<AlertCircle className="h-5 w-5 text-[var(--em-coral)]" />}
                              items={correction.improvements}
                              emptyLabel="Nenhuma melhoria registrada nessa correção."
                              className="bg-[var(--em-peach)]"
                            />
                          </div>

                          <div className="relative rounded-2xl border border-[var(--em-ink)] bg-white p-6 shadow-[4px_4px_0_0_#0E0F12]">
                            <div className="absolute right-4 top-4 opacity-10">
                              <FileText className="h-16 w-16 text-[var(--em-ink)]" />
                            </div>
                            <h4 className="mb-4 text-[14px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Comentário do Avaliador</h4>
                            <blockquote className="border-l-4 border-[var(--em-yellow)] pl-4 text-[16px] font-medium italic leading-relaxed text-[var(--em-ink)]">
                              {correction.comments || "O avaliador registrou a nota, mas ainda não adicionou um comentário geral."}
                            </blockquote>
                            <div className="mt-4 text-[13px] font-bold text-[var(--em-text-soft)]">
                              — {correction.teacherName ?? "Professor Escreva Mais"}
                            </div>
                          </div>

                          <div className="flex flex-col justify-end gap-4 pt-2 sm:flex-row">
                            {submission.pdfHref ? (
                              <a href={submission.pdfHref} target="_blank" rel="noreferrer" className="em-btn-ghost-dark !border-[var(--em-ink)] !text-[var(--em-ink)] hover:!bg-[var(--em-border)]">
                                <Download className="h-4 w-4" /> Abrir PDF enviado
                              </a>
                            ) : null}
                            <Link href="/atividades" className="em-btn-primary">
                              Próxima atividade
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-[var(--em-border-strong)] bg-white p-5 text-sm font-bold text-[var(--em-text-soft)]">
                        Este envio ainda não possui correção registrada. Quando o professor concluir, a nota, os comentários e as sugestões aparecerão aqui automaticamente.
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

function FeedbackList({
  title,
  icon,
  items,
  emptyLabel,
  className,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  emptyLabel: string;
  className: string;
}) {
  return (
    <div className={`rounded-2xl border border-[var(--em-ink)] p-6 shadow-[4px_4px_0_0_#0E0F12] ${className}`}>
      <h4 className="mb-4 flex items-center gap-2 text-[16px] font-extrabold text-[var(--em-ink)]">
        {icon} {title}
      </h4>
      {items.length ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--em-ink)]" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[14px] font-medium text-[var(--em-ink-soft)]">{emptyLabel}</p>
      )}
    </div>
  );
}
