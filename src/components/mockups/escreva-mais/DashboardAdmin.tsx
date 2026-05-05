"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";

export type DashboardAdminSummary = {
  generatedAtLabel: string;
  kpis: {
    activeStudents: MetricValue;
    activeTeachers: MetricValue;
    pendingCorrections: MetricValue;
    monthlyRevenueInCents: MetricValue;
  };
  revenue: {
    currentMonthInCents: number;
    trendLabel: string;
    trendUp: boolean | null;
    months: Array<{ label: string; amountInCents: number }>;
  };
  planDistribution: {
    total: number;
    rows: Array<{ label: string; count: number; percent: number; color: string }>;
  };
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    initials: string;
    type: string;
    typeColor: string;
    plan: string;
    status: string;
    statusColor: string;
  }>;
  whatsapp: {
    label: string;
    href: string | null;
  };
  finance: {
    pixKey: string | null;
    bankName: string | null;
    bankAgency: string | null;
    bankAccount: string | null;
    bankRecipientName: string | null;
    bankDocument: string | null;
  };
  health: {
    publishedActivities: number;
    submissionsLast7Days: number;
    averageCorrectionTimeLabel: string;
  };
  recentActivity: Array<{
    title: string;
    time: string;
    kind: "success" | "warning" | "submission" | "revenue";
  }>;
  pricing: {
    mensalInCents: number;
    trimestralInCents: number;
    semestralInCents: number;
    anualInCents: number;
  };
};

type MetricValue = {
  value: number;
  trendLabel: string;
  trendUp: boolean | null;
};

function formatCurrencyFromCents(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value / 100);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function displayOrFallback(value: string | null, fallback = "Não configurado") {
  return value?.trim() || fallback;
}

function maskDocument(value: string | null) {
  if (!value) return "Não configurado";
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return value;
  return `${digits.slice(0, 2)}.***.***/${digits.slice(-6, -2)}-**`;
}

function buildRevenueChart(months: DashboardAdminSummary["revenue"]["months"]) {
  const width = 800;
  const height = 240;
  const max = Math.max(...months.map((month) => month.amountInCents), 0);
  const points = months.map((month, index) => {
    const x = months.length === 1 ? 0 : (index / (months.length - 1)) * width;
    const y = max > 0 ? 220 - (month.amountInCents / max) * 170 : 205;
    return { ...month, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return { points, linePath, areaPath };
}

export function DashboardAdmin({ summary }: { summary: DashboardAdminSummary }) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const chart = useMemo(() => buildRevenueChart(summary.revenue.months), [summary.revenue.months]);
  const donutBackground = useMemo(() => {
    if (!summary.planDistribution.total) return "conic-gradient(var(--em-bg-alt) 0 100%)";

    let cursor = 0;
    const slices = summary.planDistribution.rows
      .filter((row) => row.count > 0)
      .map((row) => {
        const size = (row.count / summary.planDistribution.total) * 100;
        const start = cursor;
        cursor += size;
        return `${row.color} ${start}% ${cursor}%`;
      });

    return `conic-gradient(${slices.join(", ")})`;
  }, [summary.planDistribution]);

  async function copyWhatsApp() {
    if (!summary.whatsapp.label || summary.whatsapp.label === "Não configurado") return;
    await navigator.clipboard.writeText(summary.whatsapp.label);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  }

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Painel administrativo"
      pageTitle="Visão geral da plataforma."
      primaryAction={{ label: "Adicionar usuário", href: "/admin/usuarios" }}
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--em-border-strong)] bg-white/80 px-4 py-3 text-[12px] font-bold text-[var(--em-text-soft)] sm:flex-row sm:items-center sm:justify-between">
          <span>Informações atuais do banco de dados da plataforma.</span>
          <span className="text-[var(--em-ink)]">Atualizado em {summary.generatedAtLabel}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Alunos ativos"
            value={formatNumber(summary.kpis.activeStudents.value)}
            trend={summary.kpis.activeStudents.trendLabel}
            trendUp={summary.kpis.activeStudents.trendUp}
            icon={GraduationCap}
            bgColor="var(--em-mint)"
          />
          <KpiCard
            title="Professores ativos"
            value={formatNumber(summary.kpis.activeTeachers.value)}
            trend={summary.kpis.activeTeachers.trendLabel}
            trendUp={summary.kpis.activeTeachers.trendUp}
            icon={Users}
            bgColor="var(--em-peach)"
          />
          <KpiCard
            title="Correções pendentes"
            value={formatNumber(summary.kpis.pendingCorrections.value)}
            trend={summary.kpis.pendingCorrections.trendLabel}
            trendUp={summary.kpis.pendingCorrections.trendUp}
            icon={ClipboardCheck}
            bgColor="var(--em-lavender)"
          />
          <KpiCard
            title="Receita do mês"
            value={formatCurrencyFromCents(summary.kpis.monthlyRevenueInCents.value)}
            trend={summary.kpis.monthlyRevenueInCents.trendLabel}
            trendUp={summary.kpis.monthlyRevenueInCents.trendUp}
            icon={TrendingUp}
            bgColor="var(--em-yellow-soft)"
          />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="em-card-hard relative overflow-hidden bg-white p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="mb-1 text-[14px] font-bold uppercase tracking-tight text-[var(--em-text-soft)]">Receita do mês</h3>
                  <div className="flex flex-wrap items-baseline gap-4">
                    <div className="text-[32px] font-extrabold tracking-tight text-[var(--em-ink)]">
                      {formatCurrencyFromCents(summary.revenue.currentMonthInCents)}
                    </div>
                    <TrendBadge label={`${summary.revenue.trendLabel} vs mês anterior`} trendUp={summary.revenue.trendUp} />
                  </div>
                </div>
                <div className="rounded-lg border border-[var(--em-border)] bg-[var(--em-bg)] px-3 py-1.5 text-[13px] font-semibold text-[var(--em-ink)]">
                  Últimos 6 meses
                </div>
              </div>

              <div className="relative mt-4 h-[240px] w-full">
                <svg viewBox="0 0 800 240" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                  <line x1="0" y1="60" x2="800" y2="60" stroke="var(--em-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="800" y2="120" stroke="var(--em-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="800" y2="180" stroke="var(--em-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="240" x2="800" y2="240" stroke="var(--em-ink)" strokeWidth="1.5" />
                  <path d={chart.areaPath} fill="var(--em-green)" opacity={summary.revenue.currentMonthInCents > 0 ? 1 : 0.18} />
                  <path d={chart.linePath} fill="none" stroke="var(--em-ink)" strokeWidth="3" />
                  {chart.points.map((point) => (
                    <circle key={point.label} cx={point.x} cy={point.y} r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  ))}
                </svg>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-[11px] font-bold text-[var(--em-text-mute)]">
                  {summary.revenue.months.map((month) => (
                    <span key={month.label}>{month.label}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="em-card-hard overflow-hidden bg-white p-0">
              <div className="flex items-center justify-between border-b border-[var(--em-ink)] bg-[var(--em-cream)] p-6">
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Cadastros recentes</h3>
                <Link href="/admin/usuarios" className="text-[13px] font-bold text-[var(--em-ink)] transition-colors hover:text-[var(--em-green-deep)]">
                  Ver todos
                </Link>
              </div>
              <div className="grid gap-3 p-4 md:hidden">
                {summary.recentUsers.length ? (
                  summary.recentUsers.map((user) => (
                    <div key={user.id} className="rounded-2xl border-2 border-[var(--em-ink)] bg-white p-4 shadow-[3px_3px_0_0_#0E0F12]">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--em-ink)] bg-[var(--em-cream)] text-[11px] font-black text-[var(--em-ink)]">
                          {user.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="break-words text-[14px] font-extrabold leading-tight text-[var(--em-ink)]">{user.name}</div>
                          <div className="mt-1 break-all text-[12px] font-semibold leading-5 text-[var(--em-text-soft)]">{user.email}</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-cream)] p-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--em-text-soft)]">Tipo</div>
                            <span
                              className="mt-2 inline-flex rounded-full border border-[var(--em-ink)] px-2.5 py-1 text-[11px] font-extrabold shadow-[2px_2px_0_0_#0E0F12]"
                              style={{ backgroundColor: user.typeColor }}
                            >
                              {user.type}
                            </span>
                          </div>
                          <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-cream)] p-3">
                            <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--em-text-soft)]">Status</div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-[var(--em-ink)]" style={{ backgroundColor: user.statusColor }} />
                              <span className="text-[12px] font-extrabold text-[var(--em-ink)]">{user.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-3">
                          <div className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--em-text-soft)]">Plano</div>
                          <div className="mt-1 break-words text-[13px] font-extrabold text-[var(--em-ink)]">{user.plan}</div>
                        </div>

                        <Link href="/admin/usuarios" className="inline-flex w-full justify-center rounded-xl border-2 border-[var(--em-ink)] bg-[var(--em-yellow)] px-4 py-3 text-[12px] font-black text-[var(--em-ink)] shadow-[3px_3px_0_0_#0E0F12] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#0E0F12]">
                          Ver perfil
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-[var(--em-border-strong)] bg-[var(--em-cream)] px-4 py-8 text-center text-[13px] font-bold text-[var(--em-text-soft)]">
                    Nenhum cadastro encontrado ainda.
                  </div>
                )}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--em-ink)] bg-white">
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Usuario</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Tipo</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Plano</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Status</th>
                      <th className="px-6 py-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentUsers.length ? (
                      summary.recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-[var(--em-ink)] transition-colors last:border-b-0 hover:bg-[var(--em-bg)]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--em-ink)] bg-[var(--em-cream)] text-[11px] font-bold text-[var(--em-ink)]">
                                {user.initials}
                              </div>
                              <div>
                                <div className="text-[14px] font-bold leading-tight text-[var(--em-ink)]">{user.name}</div>
                                <div className="text-[12px] text-[var(--em-text-soft)]">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="rounded-full border border-[var(--em-ink)] px-2.5 py-1 text-[11px] font-extrabold shadow-[2px_2px_0_0_#0E0F12]"
                              style={{ backgroundColor: user.typeColor }}
                            >
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-[13px] font-bold text-[var(--em-ink)]">{user.plan}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="h-2.5 w-2.5 rounded-full border border-[var(--em-ink)]" style={{ backgroundColor: user.statusColor }} />
                              <span className="text-[13px] font-bold text-[var(--em-ink)]">{user.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href="/admin/usuarios" className="inline-flex rounded-lg border border-[var(--em-ink)] bg-white px-3 py-1.5 text-[11px] font-bold shadow-[2px_2px_0_0_#0E0F12] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[var(--em-bg)] hover:shadow-[1px_1px_0_0_#0E0F12]">
                              Ver perfil
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[13px] font-bold text-[var(--em-text-soft)]">
                          Nenhum cadastro encontrado ainda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="em-card-hard bg-white p-6">
              <h3 className="mb-6 text-[16px] font-extrabold text-[var(--em-ink)]">Distribuicao por plano</h3>
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-8 h-[180px] w-[180px] rounded-full border-[2px] border-[var(--em-ink)] p-5 shadow-[4px_4px_0_0_#0E0F12]" style={{ background: donutBackground }}>
                  <div className="grid h-full w-full place-items-center rounded-full border-[1.5px] border-[var(--em-ink)] bg-white text-center">
                    <div>
                      <span className="block text-[24px] font-extrabold leading-none text-[var(--em-ink)]">{formatCompactNumber(summary.planDistribution.total)}</span>
                      <span className="mt-1 block text-[11px] font-bold text-[var(--em-text-mute)]">Assinantes</span>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3">
                  {summary.planDistribution.rows.map((row) => (
                    <PlanRow key={row.label} label={row.label} value={`${row.percent}% (${row.count})`} color={row.color} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[22px] border-[1.5px] border-[var(--em-ink)] p-6 shadow-[6px_6px_0_0_#0E0F12]" style={{ backgroundColor: "var(--em-green)" }}>
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border-[1.5px] border-[var(--em-ink)] opacity-20" />
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[1.5px] border-[var(--em-ink)] opacity-20" />

              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--em-ink)] text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-extrabold leading-tight text-[var(--em-ink)]">WhatsApp oficial</h3>
                    <p className="text-[12px] font-semibold text-[var(--em-ink-soft)] opacity-80">Atendimento a alunos</p>
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between rounded-xl border-[1.5px] border-[var(--em-ink)] bg-white/90 p-3">
                  <span className="text-[15px] font-bold text-[var(--em-ink)]">{summary.whatsapp.label}</span>
                  <button
                    type="button"
                    onClick={copyWhatsApp}
                    className="rounded-md border border-transparent bg-white p-1.5 transition-colors hover:border-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]"
                    aria-label="Copiar WhatsApp"
                  >
                    {copyState === "copied" ? <Check className="h-4 w-4 text-[var(--em-green-deep)]" /> : <Copy className="h-4 w-4 text-[var(--em-ink)]" />}
                  </button>
                </div>

                {summary.whatsapp.href ? (
                  <a href={summary.whatsapp.href} target="_blank" rel="noreferrer" className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-ink)] py-3 font-bold text-white transition-colors hover:bg-[var(--em-ink-soft)]">
                    Abrir conversa <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link href="/admin/configuracoes" className="mb-5 flex w-full items-center justify-center rounded-xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-ink)] py-3 font-bold text-white transition-colors hover:bg-[var(--em-ink-soft)]">
                    Configurar WhatsApp
                  </Link>
                )}

                <div className="flex flex-wrap gap-2">
                  <InfoPill label={`Mensal ${formatCurrencyFromCents(summary.pricing.mensalInCents)}`} />
                  <InfoPill label={`Trimestral ${formatCurrencyFromCents(summary.pricing.trimestralInCents)}`} />
                  <InfoPill label={`Anual ${formatCurrencyFromCents(summary.pricing.anualInCents)}`} />
                </div>
              </div>
            </div>

            <div className="em-card-hard p-6" style={{ backgroundColor: "var(--em-cream)" }}>
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[var(--em-ink)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Dados financeiros</h3>
              </div>

              <div className="mb-6 space-y-4 rounded-xl border border-[var(--em-ink)] bg-white p-4">
                <div>
                  <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Titular</div>
                  <div className="text-[14px] font-bold text-[var(--em-ink)]">{displayOrFallback(summary.finance.bankRecipientName)}</div>
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Chave PIX / Documento</div>
                  <div className="font-mono text-[14px] font-bold text-[var(--em-ink)]">{displayOrFallback(summary.finance.pixKey, maskDocument(summary.finance.bankDocument))}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-[var(--em-ink)] pt-3">
                  <div>
                    <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Banco</div>
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">{displayOrFallback(summary.finance.bankName)}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Ag / Conta</div>
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">
                      {summary.finance.bankAgency || summary.finance.bankAccount
                        ? `${summary.finance.bankAgency ?? "-"} / ${summary.finance.bankAccount ?? "-"}`
                        : "Não configurado"}
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/admin/configuracoes" className="em-btn-primary w-full justify-center">
                Atualizar dados
              </Link>
            </div>

            <div className="em-card-hard bg-white p-6">
              <div className="mb-5 flex items-center gap-2">
                <Activity className="h-5 w-5 text-[var(--em-ink)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Saúde da plataforma</h3>
              </div>

              <div className="space-y-3">
                <HealthRow label="Atividades publicadas" value={formatNumber(summary.health.publishedActivities)} color="var(--em-green)" />
                <HealthRow label="Envios em 7 dias" value={formatNumber(summary.health.submissionsLast7Days)} color="var(--em-yellow)" />
                <HealthRow label="Tempo médio correção" value={summary.health.averageCorrectionTimeLabel} color="var(--em-lavender)" />
              </div>
            </div>

            <div className="em-card-hard bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--em-ink)]" />
                  <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Atividade recente</h3>
                </div>
              </div>

              <div className="space-y-4">
                {summary.recentActivity.length ? (
                  summary.recentActivity.map((item, index) => {
                    const Icon = activityIconByKind[item.kind];
                    return (
                      <div key={`${item.title}-${index}`} className="flex gap-3">
                        <div className="mt-0.5">
                          <Icon className={`h-4 w-4 ${activityColorByKind[item.kind]}`} />
                        </div>
                        <div>
                          <div className="text-[13px] font-bold leading-tight text-[var(--em-ink)]">{item.title}</div>
                          <div className="mt-0.5 text-[11px] font-semibold text-[var(--em-text-mute)]">{item.time}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-3 py-4 text-[13px] font-bold text-[var(--em-text-soft)]">
                    Nenhuma atividade recente registrada.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

const activityIconByKind: Record<DashboardAdminSummary["recentActivity"][number]["kind"], LucideIcon> = {
  success: CheckCircle2,
  warning: AlertCircle,
  submission: FileText,
  revenue: TrendingUp,
};

const activityColorByKind: Record<DashboardAdminSummary["recentActivity"][number]["kind"], string> = {
  success: "text-[var(--em-green-deep)]",
  warning: "text-[var(--em-coral)]",
  submission: "text-[var(--em-ink)]",
  revenue: "text-[var(--em-yellow-deep)]",
};

function TrendBadge({ label, trendUp }: { label: string; trendUp: boolean | null }) {
  const Icon = trendUp === null ? Activity : trendUp ? ArrowUpRight : ArrowDownRight;
  const color = trendUp === null ? "text-[var(--em-text-soft)]" : trendUp ? "text-[var(--em-green-deep)]" : "text-[var(--em-coral)]";

  return (
    <div className={`flex items-center gap-1 text-[13px] font-bold ${color}`}>
      <Icon className="h-4 w-4" /> {label}
    </div>
  );
}

function KpiCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  bgColor,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
  icon: LucideIcon;
  bgColor: string;
}) {
  const TrendIcon = trendUp === null ? Activity : trendUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border-[1.5px] border-[var(--em-ink)] p-5 shadow-[4px_4px_0_0_#0E0F12] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0E0F12]"
      style={{ backgroundColor: bgColor }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-[1.5px] border-[var(--em-ink)] bg-white shadow-[2px_2px_0_0_#0E0F12]">
          <Icon className="h-5 w-5 text-[var(--em-ink)]" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-1 rounded-full border border-[var(--em-ink)] bg-white/70 px-2.5 py-1 text-[12px] font-extrabold shadow-[2px_2px_0_0_rgba(14,15,18,0.2)]">
          <TrendIcon className="h-3 w-3" />
          {trend}
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-[13px] font-bold text-[var(--em-ink)] opacity-90">{title}</h3>
        <div className="text-[28px] font-extrabold leading-none tracking-tight text-[var(--em-ink)]">{value}</div>
      </div>
    </div>
  );
}

function PlanRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex w-full items-center justify-between rounded-xl border border-transparent p-2.5 transition-colors hover:border-[var(--em-border-strong)] hover:bg-[var(--em-bg-alt)]">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-md border border-[var(--em-ink)]" style={{ backgroundColor: color }} />
        <span className="text-[13px] font-bold text-[var(--em-ink)]">{label}</span>
      </div>
      <span className="text-[13px] font-extrabold text-[var(--em-ink)]">{value}</span>
    </div>
  );
}

function InfoPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[var(--em-ink)] bg-white/50 px-2.5 py-1 text-[11px] font-bold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
      {label}
    </span>
  );
}

function HealthRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--em-ink)] bg-[var(--em-bg)] p-3">
      <span className="text-[13px] font-bold text-[var(--em-ink)]">{label}</span>
      <span className="rounded-full border border-[var(--em-ink)] px-2.5 py-1 text-[12px] font-extrabold shadow-[2px_2px_0_0_#0E0F12]" style={{ backgroundColor: color }}>
        {value}
      </span>
    </div>
  );
}
