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

export function DashboardAluno() {
  return (
    <AppLayout
      role="aluno"
      userName="Júlia Andrade"
      userEmail="julia.andrade@email.com"
      pageKicker="Visão geral · Semana 14"
      pageTitle="Olá, Júlia. Hoje é um bom dia para escrever."
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
            <div className="em-display text-[42px] text-[var(--em-ink)]">24</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-green-deep)] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +3 este mês
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
              <span className="em-display text-[42px] text-[var(--em-ink)]">842</span>
              <span className="text-[16px] font-bold text-[var(--em-text-soft)]">/1000</span>
            </div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18 vs mês passado
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
            <div className="em-display text-[42px] text-[var(--em-ink)]">3</div>
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
            <div className="em-display text-[42px] text-[var(--em-ink)]">5</div>
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
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--em-yellow)] border-[1.5px] border-[var(--em-ink)] rounded-full text-[12px] font-bold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] mb-4">
                    <span className="w-2 h-2 rounded-full bg-[var(--em-coral)] animate-pulse" />
                    Começa em 2h
                  </div>
                  <h3 className="em-display text-[32px] md:text-[40px] text-[var(--em-ink)] leading-tight mb-2">
                    Repertório sociocultural<br />meio ambiente
                  </h3>
                  <div className="flex items-center gap-3 text-[16px] font-bold text-[var(--em-ink-soft)]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-5 h-5" /> Hoje 19h
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-white border border-[var(--em-ink)] grid place-items-center overflow-hidden">
                        <img src="https://i.pravatar.cc/100?img=11" alt="Prof Pedro" className="w-full h-full object-cover" />
                      </div>
                      Prof. Pedro Lima
                    </div>
                  </div>
                </div>
                
                <Link href="/ao-vivo" className="em-btn-primary shrink-0 text-[16px] px-6 py-4">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Entrar na sala
                </Link>
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
                  { label: "Simulados", icon: CheckCircle2, done: 1, total: 2 },
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
                {[
                  { title: "Caminhos para combater a...", date: "Hoje, 10:45", status: "Corrigida", color: "var(--em-green)", note: "920" },
                  { title: "Democratização do acesso...", date: "Ontem, 16:20", status: "Em correção", color: "var(--em-yellow)", note: "---" },
                  { title: "Desafios da saúde pública...", date: "12 Mar", status: "Corrigida", color: "var(--em-green)", note: "880" },
                  { title: "Impactos da inteligência...", date: "05 Mar", status: "Rascunho", color: "var(--em-coral)", note: "---" },
                ].map((item, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-xl border border-[var(--em-border-strong)] p-3 hover:border-[var(--em-ink)] hover:bg-[var(--em-bg-alt)] transition-all cursor-pointer flex items-center justify-between gap-3 bg-[var(--em-surface)]">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-[var(--em-ink)] truncate mb-1">{item.title}</div>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--em-text-soft)]">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--em-border-strong)]" />
                        <span style={{ color: item.color }}>{item.status}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {item.note !== "---" ? (
                        <div className="text-[18px] font-extrabold text-[var(--em-ink)]">{item.note}</div>
                      ) : (
                        <div className="text-[18px] font-extrabold text-[var(--em-text-mute)]">--</div>
                      )}
                    </div>
                  </div>
                ))}
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
                title: "Simulado FUVEST 2026", 
                type: "Simulado", 
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
