import { Award, CheckCircle2, Lock, PenSquare, Share2, Star, Target, TrendingUp, Trophy } from "lucide-react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";

export type StudentPerformancePoint = {
  id: string;
  title: string;
  score: number;
  submittedAtLabel: string;
};

export type StudentPerformanceMetric = {
  label: string;
  value: string;
  detail: string;
  progress: number;
  color: string;
};

export type StudentAchievement = {
  title: string;
  description: string;
  active: boolean;
  icon: "pen" | "target" | "award" | "star" | "trophy" | "check" | "trend";
};

export type StudentGoal = {
  title: string;
  description: string;
};

export type StudentPerformanceSummary = {
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  returnedSubmissions: number;
  averageScore: number | null;
  last30AverageScore: number | null;
  last30Delta: number | null;
  bestScore: number | null;
  lowestScore: number | null;
  sameGradeAverage: number | null;
  platformAverage: number | null;
  gradeLevel: string | null;
  generatedAtLabel: string;
  chart: StudentPerformancePoint[];
  metrics: StudentPerformanceMetric[];
  achievements: StudentAchievement[];
  goals: StudentGoal[];
};

type AlunoDesempenhoProps = {
  viewer: {
    name: string;
    email: string;
  };
  summary: StudentPerformanceSummary;
};

const ACHIEVEMENT_ICONS = {
  pen: PenSquare,
  target: Target,
  award: Award,
  star: Star,
  trophy: Trophy,
  check: CheckCircle2,
  trend: TrendingUp,
} as const;

function formatScore(score: number | null) {
  return typeof score === "number" ? String(score) : "--";
}

function formatDelta(delta: number | null) {
  if (delta === null) return "Sem comparativo nos ultimos 30 dias";
  if (delta === 0) return "Estavel nos ultimos 30 dias";
  return `${delta > 0 ? "+" : ""}${delta} pts nos ultimos 30 dias`;
}

function comparisonPercent(value: number | null) {
  if (value === null) return 0;
  return Math.max(0, Math.min(100, value / 10));
}

function getChartGeometry(points: StudentPerformancePoint[]) {
  if (!points.length) {
    return {
      areaPath: "",
      linePath: "",
      dots: [] as Array<{ x: number; y: number; point: StudentPerformancePoint }>,
    };
  }

  const minScore = Math.min(...points.map((point) => point.score));
  const maxScore = Math.max(...points.map((point) => point.score));
  const scoreRange = Math.max(1, maxScore - minScore);
  const xStep = points.length > 1 ? 800 / (points.length - 1) : 0;
  const dots = points.map((point, index) => {
    const x = points.length > 1 ? index * xStep : 400;
    const y = 170 - ((point.score - minScore) / scoreRange) * 130;
    return { x, y, point };
  });
  const linePath = dots.map((dot, index) => `${index === 0 ? "M" : "L"} ${dot.x.toFixed(2)} ${dot.y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${dots[dots.length - 1].x.toFixed(2)} 180 L ${dots[0].x.toFixed(2)} 180 Z`;

  return { areaPath, linePath, dots };
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="em-card-hard bg-white p-8 text-center">
      <h3 className="text-[22px] font-extrabold text-[var(--em-ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-2xl text-[14px] font-semibold leading-6 text-[var(--em-text-soft)]">{description}</p>
    </div>
  );
}

export function AlunoDesempenho({ viewer, summary }: AlunoDesempenhoProps) {
  const chart = getChartGeometry(summary.chart);
  const latestPoint = summary.chart[summary.chart.length - 1] ?? null;

  return (
    <AppLayout
      role="aluno"
      userName={viewer.name}
      userEmail={viewer.email}
      pageKicker={`Desempenho real - atualizado em ${summary.generatedAtLabel}`}
      pageTitle="Seu progresso em redacoes."
      primaryAction={{ label: "Compartilhar progresso", icon: <Share2 className="w-4 h-4" /> }}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="em-card-hard relative flex h-[320px] flex-col justify-center overflow-hidden bg-[var(--em-cream)] p-8">
            <div className="absolute right-4 top-4 text-[var(--em-coral)] opacity-80 em-spin-slow">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0L14.59 8.5L23.5 11.5L14.59 14.5L12 23.5L9.41 14.5L0.5 11.5L9.41 8.5L12 0Z" />
              </svg>
            </div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full border-[16px] border-[var(--em-green)] opacity-30" />

            <div className="relative z-10 text-center">
              <div className="mb-4 text-[14px] font-extrabold uppercase tracking-widest text-[var(--em-text-mute)]">Media geral</div>
              <div className="em-display-xl mb-2 flex items-baseline justify-center gap-2 text-[80px] leading-none text-[var(--em-ink)]">
                {formatScore(summary.averageScore)}
                <span className="text-[32px] text-[var(--em-text-mute)]">/1000</span>
              </div>
              <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--em-ink)] bg-[var(--em-green)] px-4 py-2 font-bold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                <TrendingUp className="h-4 w-4" />
                {formatDelta(summary.last30Delta)}
              </div>
            </div>
          </div>

          <div className="em-card-hard flex h-[320px] flex-col bg-white p-8 lg:col-span-2">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Evolucao das ultimas {summary.chart.length || 0} redacoes corrigidas</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--em-text-soft)]">
                  <div className="h-3 w-3 rounded-full border border-[var(--em-ink)] bg-[var(--em-ink)]/10" /> Menor: {formatScore(summary.lowestScore)}
                </div>
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--em-text-soft)]">
                  <div className="h-3 w-3 rounded-full border border-[var(--em-ink)] bg-[var(--em-yellow)]" /> Maior: {formatScore(summary.bestScore)}
                </div>
              </div>
            </div>

            {summary.chart.length ? (
              <div className="relative h-full w-full flex-1">
                <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="student-performance-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--em-green)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="var(--em-green)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="20" x2="800" y2="20" stroke="var(--em-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="var(--em-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="800" y2="180" stroke="var(--em-ink)" strokeWidth="1.5" />
                  <path d={chart.areaPath} fill="url(#student-performance-fill)" />
                  <path d={chart.linePath} fill="none" stroke="var(--em-green)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  {chart.dots.map((dot, index) => {
                    const isLatest = index === chart.dots.length - 1;
                    return (
                      <circle
                        key={dot.point.id}
                        cx={dot.x}
                        cy={dot.y}
                        r={isLatest ? 8 : 5}
                        fill={isLatest ? "var(--em-coral)" : "var(--em-surface)"}
                        stroke="var(--em-ink)"
                        strokeWidth="2.5"
                        className={isLatest ? "animate-pulse" : undefined}
                      />
                    );
                  })}
                  {latestPoint ? (
                    <>
                      <rect x="748" y="0" width="64" height="26" rx="6" fill="var(--em-ink)" />
                      <text x="780" y="17" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">{latestPoint.score}</text>
                    </>
                  ) : null}
                </svg>
              </div>
            ) : (
              <div className="grid flex-1 place-items-center rounded-2xl border border-dashed border-[var(--em-border-strong)] bg-[var(--em-bg)] p-6 text-center text-sm font-semibold text-[var(--em-text-soft)]">
                Assim que uma redacao for corrigida, sua evolucao aparece aqui.
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[20px] font-extrabold text-[var(--em-ink)]">Indicadores reais do seu desempenho</h3>
          {summary.metrics.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              {summary.metrics.map((metric) => (
                <div key={metric.label} className="em-card-hard flex h-[160px] flex-col justify-between bg-white p-5">
                  <div>
                    <div className="mb-2 text-[12px] font-extrabold text-[var(--em-text-mute)]">{metric.label}</div>
                    <div className="text-[14px] font-extrabold leading-tight text-[var(--em-ink)]">{metric.detail}</div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-end gap-1">
                      <span className="text-[28px] font-extrabold leading-none text-[var(--em-ink)]">{metric.value}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full border border-[var(--em-ink)] bg-[var(--em-bg)]">
                      <div className="h-full border-r border-[var(--em-ink)]" style={{ width: `${metric.progress}%`, backgroundColor: metric.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Ainda sem indicadores suficientes." description="Envie e receba correcoes para formar seu historico de desempenho." />
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="em-card-hard bg-[var(--em-lavender)] p-6 md:p-8 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[var(--em-ink)]" />
              <h3 className="text-[20px] font-extrabold text-[var(--em-ink)]">Quadro de conquistas reais</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {summary.achievements.map((achievement) => {
                const Icon = ACHIEVEMENT_ICONS[achievement.icon];
                return (
                  <div
                    key={achievement.title}
                    className={`flex flex-col items-center rounded-xl border-2 p-4 text-center ${achievement.active ? "border-[var(--em-ink)] bg-white shadow-[4px_4px_0_0_#0E0F12]" : "border-dashed border-[var(--em-text-mute)] bg-[var(--em-bg)] opacity-60"}`}
                  >
                    <div className={`mb-3 grid h-12 w-12 place-items-center rounded-full ${achievement.active ? "border border-[var(--em-ink)] bg-[var(--em-yellow)] text-[var(--em-ink)]" : "bg-[var(--em-bg-alt)] text-[var(--em-text-mute)]"}`}>
                      {achievement.active ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                    </div>
                    <div className="text-[13px] font-extrabold leading-tight text-[var(--em-ink)]">{achievement.title}</div>
                    <div className="mt-1 text-[11px] font-semibold text-[var(--em-text-soft)]">{achievement.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8">
            <div className="em-card-hard bg-white p-6">
              <h3 className="mb-6 text-[18px] font-extrabold text-[var(--em-ink)]">Comparativo real</h3>
              <div className="space-y-6">
                <ComparisonRow label="Sua media" value={summary.averageScore} color="var(--em-green)" />
                <ComparisonRow label={summary.gradeLevel ? `Media da sua serie (${summary.gradeLevel})` : "Media da sua serie"} value={summary.sameGradeAverage} color="var(--em-muted)" muted />
                <ComparisonRow label="Media da plataforma" value={summary.platformAverage} color="var(--em-muted)" muted />
              </div>
            </div>

            <div className="em-card-hard border-[var(--em-ink)] bg-[var(--em-green)] p-6 shadow-[4px_4px_0_0_#0E0F12]">
              <h3 className="mb-4 text-[18px] font-extrabold text-[var(--em-ink)]">Proximas metas</h3>
              <div className="space-y-3">
                {summary.goals.map((goal) => (
                  <div key={goal.title} className="flex items-start gap-3 rounded-xl border border-[var(--em-ink)] bg-white/50 p-3">
                    <div className="mt-0.5">
                      <div className="h-5 w-5 rounded-full border-2 border-[var(--em-ink)] bg-white" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[var(--em-ink)]">{goal.title}</div>
                      <div className="text-[12px] font-semibold text-[var(--em-ink-soft)]">{goal.description}</div>
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

function ComparisonRow({ label, value, color, muted = false }: { label: string; value: number | null; color: string; muted?: boolean }) {
  return (
    <div>
      <div className={`mb-2 flex justify-between text-[13px] font-bold ${muted ? "text-[var(--em-text-soft)]" : "text-[var(--em-ink)]"}`}>
        <span>{label}</span>
        <span>{formatScore(value)}</span>
      </div>
      <div className={`h-3 w-full overflow-hidden rounded-full border ${muted ? "border-[var(--em-border-strong)]" : "border-[var(--em-ink)]"} bg-[var(--em-bg)]`}>
        <div className={`h-full border-r ${muted ? "border-[var(--em-border-strong)]" : "border-[var(--em-ink)]"}`} style={{ width: `${comparisonPercent(value)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}
