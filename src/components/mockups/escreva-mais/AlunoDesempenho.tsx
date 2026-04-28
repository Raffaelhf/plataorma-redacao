import { Share2, TrendingUp, Award, Target, Trophy, Star, Lock, PenSquare, CheckCircle2 } from "lucide-react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";

export function AlunoDesempenho() {
  return (
    <AppLayout
      role="aluno"
      userName="Júlia Andrade"
      userEmail="julia.andrade@email.com"
      pageKicker="Desempenho · Sua evolução"
      pageTitle="Olha o quanto você cresceu."
      primaryAction={{ label: "Compartilhar progresso", icon: <Share2 className="w-4 h-4" /> }}
    >
      <div className="space-y-8">
        
        {/* HERO BIG NUMBER & CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="em-card-hard p-8 bg-[var(--em-cream)] flex flex-col justify-center relative overflow-hidden h-[320px]">
            <div className="absolute top-4 right-4 text-[var(--em-coral)] opacity-80 em-spin-slow">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 8.5L23.5 11.5L14.59 14.5L12 23.5L9.41 14.5L0.5 11.5L9.41 8.5L12 0Z"/>
              </svg>
            </div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-[16px] border-[var(--em-green)] rounded-full opacity-30"></div>
            
            <div className="relative z-10 text-center">
              <div className="text-[14px] font-extrabold uppercase tracking-widest text-[var(--em-text-mute)] mb-4">Média Geral</div>
              <div className="em-display-xl text-[80px] leading-none text-[var(--em-ink)] mb-2 flex justify-center items-baseline gap-2">
                842
                <span className="text-[32px] text-[var(--em-text-mute)]">/1000</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-[var(--em-green)] text-[var(--em-ink)] font-bold px-4 py-2 rounded-full border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] mt-4 mx-auto">
                <TrendingUp className="w-4 h-4" /> +87 pts nos últimos 30 dias
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2 em-card-hard p-8 bg-white flex flex-col h-[320px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Evolução das últimas 12 redações</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--em-text-soft)]">
                  <div className="w-3 h-3 rounded-full bg-[var(--em-ink)]/10 border border-[var(--em-ink)]"></div> Menor: 720
                </div>
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--em-text-soft)]">
                  <div className="w-3 h-3 rounded-full bg-[var(--em-yellow)] border border-[var(--em-ink)]"></div> Maior: 940
                </div>
              </div>
            </div>
            
            <div className="flex-1 relative w-full h-full">
              <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chart-fill-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--em-green)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--em-green)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                <line x1="0" y1="20" x2="800" y2="20" stroke="var(--em-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="800" y2="100" stroke="var(--em-border-strong)" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="180" x2="800" y2="180" stroke="var(--em-ink)" strokeWidth="1.5" />
                
                {/* Chart Area */}
                <path 
                  d="M 0 160 L 72 170 L 145 150 L 218 160 L 290 120 L 363 130 L 436 100 L 509 110 L 581 80 L 654 60 L 727 90 L 800 40 L 800 180 L 0 180 Z" 
                  fill="url(#chart-fill-2)" 
                />
                
                {/* Chart Line */}
                <path 
                  d="M 0 160 L 72 170 L 145 150 L 218 160 L 290 120 L 363 130 L 436 100 L 509 110 L 581 80 L 654 60 L 727 90 L 800 40" 
                  fill="none" 
                  stroke="var(--em-green)" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data Points */}
                {[160, 170, 150, 160, 120, 130, 100, 110, 80, 60, 90].map((cy, i) => (
                  <circle key={i} cx={i * 72.7} cy={cy} r="5" fill="var(--em-surface)" stroke="var(--em-ink)" strokeWidth="2.5" />
                ))}
                
                {/* Last Point */}
                <circle cx="800" cy="40" r="8" fill="var(--em-coral)" stroke="var(--em-ink)" strokeWidth="2.5" className="animate-pulse" />
                <rect x="760" y="0" width="50" height="26" rx="6" fill="var(--em-ink)" />
                <text x="785" y="17" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">920</text>
              </svg>
            </div>
          </div>
        </div>

        {/* COMPETÊNCIAS */}
        <div>
          <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-4">Suas médias por competência</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            {[
              { num: 1, label: "Norma Culta", avg: 164, trend: "+12", color: "var(--em-green)" },
              { num: 2, label: "Compreensão", avg: 182, trend: "+8", color: "var(--em-mint-deep)" },
              { num: 3, label: "Argumentação", avg: 168, trend: "+20", color: "var(--em-mint-deep)" },
              { num: 4, label: "Coesão", avg: 172, trend: "-4", color: "var(--em-peach-deep)" },
              { num: 5, label: "Intervenção", avg: 156, trend: "+16", color: "var(--em-yellow)" },
            ].map((comp, i) => (
              <div key={i} className="em-card-hard p-5 bg-white flex flex-col justify-between h-[160px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[12px] font-extrabold text-[var(--em-text-mute)]">Comp. {comp.num}</div>
                  <div className={`text-[11px] font-extrabold px-2 py-0.5 rounded border border-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12] ${comp.trend.startsWith('+') ? 'bg-[var(--em-green)] text-[var(--em-ink)]' : 'bg-[var(--em-rose)] text-[var(--em-ink)]'}`}>
                    {comp.trend}
                  </div>
                </div>
                <div className="text-[14px] font-extrabold text-[var(--em-ink)] leading-tight flex-1 mt-1">{comp.label}</div>
                <div>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-[28px] font-extrabold text-[var(--em-ink)] leading-none">{comp.avg}</span>
                    <span className="text-[12px] font-bold text-[var(--em-text-mute)]">/200</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--em-bg)] border border-[var(--em-ink)] rounded-full overflow-hidden">
                    <div className="h-full border-r border-[var(--em-ink)]" style={{ width: `${(comp.avg/200)*100}%`, backgroundColor: comp.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CONQUISTAS */}
          <div className="lg:col-span-2 em-card-hard p-6 md:p-8 bg-[var(--em-lavender)]">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-[var(--em-ink)]" />
              <h3 className="text-[20px] font-extrabold text-[var(--em-ink)]">Quadro de Conquistas</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: "Primeiro passo", desc: "1ª redação enviada", icon: PenSquare, active: true },
                { title: "Consistente", desc: "5 semanas seguidas", icon: Target, active: true },
                { title: "Clube 800+", desc: "Nota > 800", icon: Award, active: true },
                { title: "Clube 900+", desc: "Nota > 900", icon: Star, active: true },
                { title: "Expert", desc: "20 redações", icon: Trophy, active: true },
                { title: "Gabarito", desc: "Competência no 200", icon: CheckCircle2, active: true },
                { title: "Nota 1000", desc: "Gabaritar redação", icon: Star, active: false },
                { title: "Maratona", desc: "50 redações", icon: TrendingUp, active: false },
              ].map((badge, i) => (
                <div key={i} className={`flex flex-col items-center text-center p-4 rounded-xl border-2 ${badge.active ? 'bg-white border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]' : 'bg-[var(--em-bg)] border-dashed border-[var(--em-text-mute)] opacity-60'}`}>
                  <div className={`w-12 h-12 rounded-full grid place-items-center mb-3 ${badge.active ? 'bg-[var(--em-yellow)] border border-[var(--em-ink)] text-[var(--em-ink)]' : 'bg-[var(--em-bg-alt)] text-[var(--em-text-mute)]'}`}>
                    {badge.active ? <badge.icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="text-[13px] font-extrabold text-[var(--em-ink)] leading-tight">{badge.title}</div>
                  <div className="text-[11px] font-semibold text-[var(--em-text-soft)] mt-1">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* COMPARATIVO & METAS */}
          <div className="space-y-8">
            <div className="em-card-hard p-6 bg-white">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-6">Comparativo</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[13px] font-bold text-[var(--em-ink)] mb-2">
                    <span>Sua Média</span>
                    <span>842</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--em-bg)] border border-[var(--em-ink)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--em-green)] border-r border-[var(--em-ink)]" style={{ width: '84.2%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold text-[var(--em-text-soft)] mb-2">
                    <span>Média da Turma</span>
                    <span>780</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--em-muted)] border-r border-[var(--em-border-strong)]" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[13px] font-bold text-[var(--em-text-soft)] mb-2">
                    <span>Média da Plataforma</span>
                    <span>720</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--em-muted)] border-r border-[var(--em-border-strong)]" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="em-card-hard p-6 bg-[var(--em-green)] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-4">Próximas Metas</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-[var(--em-ink)]">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-[var(--em-ink)] bg-white"></div>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">Gabaritar Competência 5</div>
                    <div className="text-[12px] font-semibold text-[var(--em-ink-soft)]">Focar nos 5 elementos da proposta.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/50 p-3 rounded-xl border border-[var(--em-ink)]">
                  <div className="mt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-[var(--em-ink)] bg-white"></div>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">Nota +900 constante</div>
                    <div className="text-[12px] font-semibold text-[var(--em-ink-soft)]">Manter a média nas próximas 3 red.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}
