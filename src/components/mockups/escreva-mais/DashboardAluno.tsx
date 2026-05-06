import Link from "next/link";
import { 
  FileText, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Play, 
  Calendar, 
  ArrowRight, 
  PenSquare, 
  Video, 
  BookOpen,
  CheckCircle2,
  Star
} from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

type StudentDashboardStats = {
  totalSubmissions: number;
  monthlySubmissions: number;
  averageGrade: number;
  averageGradeDelta: number;
  inCorrection: number;
  weeklyPublishedActivities: number;
};

type StudentLiveClass = {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  meetingUrl: string | null;
  teacherName: string | null;
};

type StudentRecentSubmission = {
  id: string;
  title: string;
  submittedAt: string;
  status: string;
  grade: number | null;
};

type DashboardAlunoProps = {
  viewer: { name: string; email: string };
  stats: StudentDashboardStats;
  liveClasses: StudentLiveClass[];
  recentSubmissions: StudentRecentSubmission[];
};

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "aluno";
}

function formatClassDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = date.toDateString() === today.toDateString();
  const nextDay = date.toDateString() === tomorrow.toDateString();
  const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);

  if (sameDay) return `Hoje ${time}`;
  if (nextDay) return `Amanhã ${time}`;

  const day = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "short" })
    .format(date)
    .replace(".", "");
  return `${day} · ${time}`;
}

function getStartLabel(value: string) {
  const diffInMinutes = Math.round((new Date(value).getTime() - Date.now()) / 60000);

  if (diffInMinutes <= 0) return "Acontecendo agora";
  if (diffInMinutes < 60) return `Começa em ${diffInMinutes}min`;

  const hours = Math.round(diffInMinutes / 60);
  if (hours < 24) return `Começa em ${hours}h`;

  const days = Math.round(hours / 24);
  return `Começa em ${days}d`;
}

function getSubmissionStatusLabel(status: string) {
  if (status === "GRADED") return "Corrigida";
  if (status === "RETURNED") return "Devolvida";
  if (status === "UNDER_REVIEW") return "Em correção";
  return "Pendente";
}

function getRelativeSubmissionDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const time = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date);

  if (date.toDateString() === today.toDateString()) return `Hoje, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Ontem, ${time}`;

  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
}

function getShortTitle(title: string) {
  return title.length > 30 ? `${title.slice(0, 27)}...` : title;
}

export function DashboardAluno({ viewer, stats, liveClasses, recentSubmissions }: DashboardAlunoProps) {
  const nextLiveClass = liveClasses[0] ?? null;
  const nextCalendarItems = liveClasses.slice(1, 4);
  const firstName = getFirstName(viewer.name);

  return (
    <AppLayout
      role="aluno"
      userName={viewer.name}
      userEmail={viewer.email}
      pageKicker="Visão geral · agenda do aluno"
      pageTitle={`Olá, ${firstName}. Hoje é um bom dia para escrever.`}
      primaryAction={{ label: "Enviar redação em PDF", href: "/envios" }}
    >
      <div className="space-y-8">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1: White */}
          <div className="em-card-hard p-5 bg-[var(--em-surface)]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-bold text-[var(--em-text-soft)]">Envios totais</div>
              <div className="w-8 h-8 bg-[var(--em-ink)] rounded-lg grid place-items-center text-white">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.totalSubmissions}</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-green-deep)] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +{stats.monthlySubmissions} este mês
            </div>
          </div>

          {/* Stat 2: Mint */}
          <div className="em-card-hard p-5 bg-[var(--em-mint)]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-bold text-[var(--em-ink-soft)]">Nota média</div>
              <div className="w-8 h-8 bg-[var(--em-ink)] rounded-lg grid place-items-center text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="em-display text-[42px] text-[var(--em-ink)]">{stats.averageGrade || "--"}</span>
              <span className="text-[16px] font-bold text-[var(--em-text-soft)]">/1000</span>
            </div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> {stats.averageGradeDelta >= 0 ? "+" : ""}{stats.averageGradeDelta} vs mês passado
            </div>
          </div>

          {/* Stat 3: Peach */}
          <div className="em-card-hard p-5 bg-[var(--em-peach)]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-bold text-[var(--em-ink-soft)]">Em correção</div>
              <div className="w-8 h-8 bg-[var(--em-ink)] rounded-lg grid place-items-center text-white">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.inCorrection}</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Prazo médio: 2 dias
            </div>
          </div>

          {/* Stat 4: Lavender */}
          <div className="em-card-hard p-5 bg-[var(--em-lavender)]">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[14px] font-bold text-[var(--em-ink-soft)]">Atividades novas</div>
              <div className="w-8 h-8 bg-[var(--em-ink)] rounded-lg grid place-items-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">{stats.weeklyPublishedActivities}</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Para esta semana
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AULA AO VIVO */}
            <div className="relative overflow-hidden rounded-[var(--em-radius-card-lg)] bg-[var(--em-green)] border-[1.5px] border-[var(--em-ink)] shadow-[var(--em-shadow-hard)] p-8 md:p-10 transition-transform duration-200 hover:-translate-y-1">
              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--em-yellow)] border-[1.5px] border-[var(--em-ink)] rounded-full text-[12px] font-bold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] mb-4">
                    <span className="w-2 h-2 rounded-full bg-[var(--em-coral)] animate-pulse" />
                    {nextLiveClass ? getStartLabel(nextLiveClass.scheduledAt) : "Agenda em atualização"}
                  </div>
                  <h3 className="em-display text-[32px] md:text-[40px] text-[var(--em-ink)] leading-tight mb-2">
                    {nextLiveClass?.title ?? "Nenhuma live agendada"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[16px] font-bold text-[var(--em-ink-soft)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-5 h-5" /> {nextLiveClass ? formatClassDate(nextLiveClass.scheduledAt) : "Sem horário definido"}
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white border border-[var(--em-ink)] grid place-items-center overflow-hidden">
                        <span className="text-[10px] font-extrabold">{(nextLiveClass?.teacherName ?? "EM").split(" ").map((name) => name[0]).join("").slice(0, 2)}</span>
                      </div>
                      {nextLiveClass?.teacherName ?? "Equipe Escreva Mais"}
                    </div>
                  </div>
                  {nextCalendarItems.length ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {nextCalendarItems.map((liveClass) => (
                        <Link key={liveClass.id} href="/ao-vivo" className="rounded-xl border border-[var(--em-ink)] bg-white/50 px-3 py-2 text-[12px] font-extrabold text-[var(--em-ink)] hover:bg-white">
                          {formatClassDate(liveClass.scheduledAt)} · {getShortTitle(liveClass.title)}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
                
                <a href={nextLiveClass?.meetingUrl || "/ao-vivo"} target={nextLiveClass?.meetingUrl ? "_blank" : undefined} rel={nextLiveClass?.meetingUrl ? "noreferrer" : undefined} className="em-btn-primary shrink-0 text-[16px] px-6 py-4">
                  <Play className="w-5 h-5" fill="currentColor" />
                  {nextLiveClass?.meetingUrl ? "Entrar na sala" : "Ver calendário"}
                </a>
              </div>

              {/* Decorative shapes */}
              <Star className="absolute -top-6 -right-6 w-32 h-32 text-[var(--em-coral)] opacity-80" strokeWidth={1.5} fill="currentColor" />
              <div className="absolute -bottom-10 right-20 w-40 h-40 border-4 border-[var(--em-ink)] rounded-full opacity-10" />
            </div>

            {/* SUA EVOLUÇÃO */}
            <div className="em-card-hard p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[20px] font-extrabold text-[var(--em-ink)]">Sua evolução</h3>
                <div className="em-chip">Últimos 8 envios</div>
              </div>
              
              <div className="relative h-[200px] w-full">
                {/* SVG Chart */}
                <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--em-green)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--em-green)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="20" x2="800" y2="20" stroke="var(--em-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="800" y2="100" stroke="var(--em-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="800" y2="180" stroke="var(--em-border-strong)" strokeWidth="1" />
                  
                  {/* Y Axis Labels */}
                  <text x="-10" y="25" fill="var(--em-text-mute)" fontSize="12" fontWeight="bold" textAnchor="end">1000</text>
                  <text x="-10" y="105" fill="var(--em-text-mute)" fontSize="12" fontWeight="bold" textAnchor="end">800</text>
                  <text x="-10" y="185" fill="var(--em-text-mute)" fontSize="12" fontWeight="bold" textAnchor="end">600</text>
                  
                  {/* Chart Area */}
                  <path 
                    d="M 0 160 C 100 160, 150 140, 228 120 C 300 100, 350 130, 457 90 C 550 50, 650 60, 800 30 L 800 180 L 0 180 Z" 
                    fill="url(#chart-fill)" 
                  />
                  
                  {/* Chart Line */}
                  <path 
                    d="M 0 160 C 100 160, 150 140, 228 120 C 300 100, 350 130, 457 90 C 550 50, 650 60, 800 30" 
                    fill="none" 
                    stroke="var(--em-green)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data Points */}
                  <circle cx="0" cy="160" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  <circle cx="114" cy="148" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  <circle cx="228" cy="120" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  <circle cx="342" cy="124" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  <circle cx="457" cy="90" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  <circle cx="571" cy="74" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  <circle cx="685" cy="55" r="6" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                  
                  {/* Active Point */}
                  <circle cx="800" cy="30" r="8" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2.5" className="animate-pulse" />
                  
                  {/* Active Point Label */}
                  <rect x="740" y="-10" width="60" height="30" rx="8" fill="var(--em-ink)" />
                  <text x="770" y="10" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">920</text>
                </svg>
              </div>
            </div>
            
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            
            {/* ROTINA SEMANAL */}
            <div className="em-card-hard p-6 bg-[var(--em-cream)]">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-6">Sua rotina semanal</h3>
              
              <div className="space-y-5">
                {[
                  { label: "Redações", icon: PenSquare, done: 3, total: 4 },
                  { label: "Videoaulas", icon: Video, done: 2, total: 3 },
                  { label: "Temas guiados", icon: CheckCircle2, done: 1, total: 2 },
                  { label: "Leituras", icon: BookOpen, done: 5, total: 5 },
                ].map((item, idx) => {
                  const pct = Math.round((item.done / item.total) * 100);
                  const isComplete = item.done === item.total;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-[14px] font-bold text-[var(--em-ink)]">
                          <item.icon className="w-4 h-4 text-[var(--em-text-mute)]" />
                          {item.label}
                        </div>
                        <div className="text-[13px] font-bold text-[var(--em-text-soft)]">
                          {item.done}/{item.total}
                        </div>
                      </div>
                      <div className="h-3 w-full bg-white border border-[var(--em-border-strong)] rounded-full overflow-hidden">
                        <div 
                          className={`h-full border-r border-[var(--em-ink)] transition-all duration-500 ${isComplete ? 'bg-[var(--em-green)]' : 'bg-[var(--em-yellow)]'}`} 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ENVIOS RECENTES */}
            <div className="em-card-hard p-6 bg-[var(--em-surface)]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Envios recentes</h3>
                <Link href="/envios" className="text-[13px] font-bold text-[var(--em-text-soft)] hover:text-[var(--em-ink)] transition-colors">
                  Ver todos
                </Link>
              </div>
              
              <div className="space-y-3">
                {recentSubmissions.map((item) => {
                  const statusLabel = getSubmissionStatusLabel(item.status);
                  const statusColor = item.status === "GRADED" || item.status === "RETURNED" ? "var(--em-green)" : item.status === "UNDER_REVIEW" ? "var(--em-yellow)" : "var(--em-coral)";

                  return (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl border border-[var(--em-border-strong)] p-3 hover:border-[var(--em-ink)] hover:bg-[var(--em-bg-alt)] transition-all cursor-pointer flex items-center justify-between gap-3 bg-[var(--em-surface)]">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-[var(--em-ink)] truncate mb-1">{getShortTitle(item.title)}</div>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--em-text-soft)]">
                        <span>{getRelativeSubmissionDate(item.submittedAt)}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--em-border-strong)]" />
                        <span style={{ color: statusColor }}>{statusLabel}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {typeof item.grade === "number" ? (
                        <div className="text-[18px] font-extrabold text-[var(--em-ink)]">{item.grade}</div>
                      ) : (
                        <div className="text-[18px] font-extrabold text-[var(--em-text-mute)]">--</div>
                      )}
                    </div>
                  </div>
                  );
                })}
                {recentSubmissions.length === 0 ? (
                  <div className="rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] p-4 text-[13px] font-bold text-[var(--em-text-soft)]">
                    Seus envios mais recentes aparecerão aqui assim que você mandar uma redação.
                  </div>
                ) : null}
              </div>
            </div>

          </div>
        </div>

        {/* ATIVIDADES EM DESTAQUE */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-extrabold text-[var(--em-ink)]">Atividades em destaque</h2>
            <Link href="/atividades" className="text-[14px] font-bold text-[var(--em-text-soft)] hover:text-[var(--em-ink)] transition-colors flex items-center gap-1">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Tema guiado: persistência da fome", 
                type: "Redação", 
                deadline: "Até domingo", 
                bg: "var(--em-mint)", 
                diff: "Alta" 
              },
              { 
                title: "Proposta: O impacto dos influenciadores", 
                type: "Redação", 
                deadline: "Em 3 dias", 
                bg: "var(--em-peach)", 
                diff: "Média" 
              },
              { 
                title: "Módulo: Coesão e coerência", 
                type: "Videoaula", 
                deadline: "Livre", 
                bg: "var(--em-lavender)", 
                diff: "Fácil" 
              }
            ].map((item, idx) => (
              <div key={idx} className="em-card-hard flex flex-col overflow-hidden bg-white">
                {/* Colored Top Banner */}
                <div className="h-16 border-b border-[var(--em-ink)]" style={{ background: item.bg }} />
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold tracking-wider uppercase px-2 py-1 rounded bg-[var(--em-bg-alt)] border border-[var(--em-border-strong)]">
                      {item.type}
                    </span>
                    <span className="text-[12px] font-bold text-[var(--em-text-soft)] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.deadline}
                    </span>
                  </div>
                  
                  <h4 className="text-[18px] font-extrabold text-[var(--em-ink)] leading-snug mb-2 flex-1">
                    {item.title}
                  </h4>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--em-border-strong)] flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-[var(--em-text-soft)]">
                      Dificuldade: <span className="text-[var(--em-ink)]">{item.diff}</span>
                    </div>
                    <Link href="/atividades" className="em-btn-primary !py-2 !px-4 !text-[13px] !gap-1">
                      Começar <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
