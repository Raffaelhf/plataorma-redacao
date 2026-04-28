import { 
  Radio, 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Video, 
  XCircle, 
  Edit, 
  Bell,
  BarChart,
  ArrowRight,
  Settings,
  Filter
} from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

export function AdminAoVivo() {
  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Ao vivo · Agenda da plataforma"
      pageTitle="Todas as transmissões."
      primaryAction={{ label: "Agendar aula institucional" }}
    >
      <div className="space-y-8">
        
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="em-card-hard p-5 bg-[var(--em-mint)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Aulas esta semana</span>
              <CalendarIcon className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">18</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-green)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Acontecendo agora</span>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--em-ink)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--em-ink)]"></span>
              </span>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">3</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-lavender)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Total de inscritos</span>
              <Users className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">642</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-rose)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Cancelamentos</span>
              <XCircle className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">2</div>
          </div>
        </div>

        {/* HERO: ACONTECENDO AGORA */}
        <div className="p-6 md:p-8 rounded-[var(--em-radius-card-lg)] bg-[var(--em-ink)] relative overflow-hidden border-[1.5px] border-[var(--em-ink)] shadow-[var(--em-shadow-hard)]">
          <div className="absolute inset-0 em-noise opacity-10 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="px-3 py-1 bg-[var(--em-green)] text-[var(--em-ink)] text-[12px] font-extrabold uppercase tracking-widest rounded-full border border-[var(--em-ink)] flex items-center gap-2 shadow-[2px_2px_0_0_#000]">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Acontecendo Agora
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              { tema: "Redação Nota 1000", prof: "Profª. Júlia Silva", alunos: 124 },
              { tema: "Repertório Sociocultural", prof: "Prof. Rafael Costa", alunos: 89 },
              { title: "Plantão de Dúvidas", prof: "Equipe Suporte", alunos: 12 }
            ].map((live, i) => (
              <div key={i} className="em-card-hard p-5 bg-[var(--em-green)] border-2 border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                <h4 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-2 leading-tight">{live.tema || live.title}</h4>
                <div className="text-[13px] font-bold text-[var(--em-ink-soft)] mb-4">{live.prof}</div>
                <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--em-ink)] mb-6 bg-white/40 self-start inline-flex px-2 py-1 rounded border border-[var(--em-ink)]">
                  <Users className="w-3.5 h-3.5" /> {live.alunos} assistindo
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button className="py-2 text-[12px] font-bold bg-[var(--em-ink)] text-white rounded-lg border border-[var(--em-ink)] hover:bg-[#1a1c20] transition-colors flex items-center justify-center gap-1 shadow-[2px_2px_0_0_#fff]">
                    <Video className="w-3.5 h-3.5" /> Assistir
                  </button>
                  <button className="py-2 text-[12px] font-bold bg-white text-[var(--em-ink)] rounded-lg border border-[var(--em-ink)] hover:bg-[var(--em-bg)] transition-colors flex items-center justify-center gap-1 shadow-[2px_2px_0_0_#0E0F12]">
                    <XCircle className="w-3.5 h-3.5" /> Encerrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            
            {/* TABELA DE PRÓXIMAS AULAS */}
            <div className="em-card-hard bg-white overflow-hidden">
              <div className="p-6 border-b border-[var(--em-ink)] flex justify-between items-center bg-[var(--em-cream)]">
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Próximas aulas</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-white border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] text-[var(--em-ink)] transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--em-bg)] border-b border-[var(--em-ink)]">
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Data/Hora</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Professor & Tema</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Detalhes</th>
                      <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)] text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { data: "Hoje", hora: "19:00", dur: "1h", prof: "Profª. Ana Carolina", tema: "Mentoria Coletiva", inscritos: 156, plat: "Zoom", platColor: "bg-blue-100 text-blue-800 border-blue-300" },
                      { data: "Amanhã", hora: "14:00", dur: "1.5h", prof: "Prof. Lucas Mendes", tema: "Análise de Redações Nota 1000", inscritos: 89, plat: "Meet", platColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
                      { data: "Amanhã", hora: "18:30", dur: "1h", prof: "Prof. Rafael Costa", tema: "Estrutura FUVEST", inscritos: 210, plat: "Zoom", platColor: "bg-blue-100 text-blue-800 border-blue-300" },
                      { data: "15/Out", hora: "10:00", dur: "2h", prof: "Profª. Júlia Silva", tema: "Revisão Geral", inscritos: 340, plat: "Zoom", platColor: "bg-blue-100 text-blue-800 border-blue-300" },
                      { data: "16/Out", hora: "19:00", dur: "1h", prof: "Prof. Lucas Mendes", tema: "Argumentação", inscritos: 112, plat: "Meet", platColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
                    ].map((aula, i) => (
                      <tr key={i} className="border-b border-[var(--em-border-strong)] last:border-b-0 hover:bg-[var(--em-bg)] transition-colors">
                        <td className="px-4 py-4">
                          <div className="text-[13px] font-extrabold text-[var(--em-ink)]">{aula.data}</div>
                          <div className="text-[12px] font-semibold text-[var(--em-text-soft)]">{aula.hora} ({aula.dur})</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-[14px] font-bold text-[var(--em-ink)] mb-1">{aula.tema}</div>
                          <div className="text-[12px] font-medium text-[var(--em-text-soft)]">{aula.prof}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[12px] font-bold text-[var(--em-ink)] flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {aula.inscritos}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block w-max ${aula.platColor}`}>{aula.plat}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] bg-white text-[var(--em-ink)] hover:shadow-[2px_2px_0_0_#0E0F12] transition-all" title="Editar">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] bg-white text-[var(--em-ink)] hover:shadow-[2px_2px_0_0_#0E0F12] transition-all" title="Notificar inscritos">
                              <Bell className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] bg-white text-[var(--em-coral)] hover:shadow-[2px_2px_0_0_#0E0F12] transition-all" title="Cancelar">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* AGENDA SEMANAL (Visual) */}
            <div className="em-card-hard p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Agenda da Semana</h3>
                <div className="flex items-center gap-2">
                  <button className="text-[13px] font-bold text-[var(--em-ink)] border border-[var(--em-border-strong)] rounded-lg px-3 py-1.5 hover:bg-[var(--em-bg)]">&lt;</button>
                  <button className="text-[13px] font-bold text-[var(--em-ink)] border border-[var(--em-border-strong)] rounded-lg px-3 py-1.5 hover:bg-[var(--em-bg)]">&gt;</button>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 md:gap-4">
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((dia, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="text-center mb-3">
                      <div className="text-[12px] font-bold text-[var(--em-text-soft)] uppercase">{dia}</div>
                      <div className={`text-[18px] font-extrabold mt-1 ${i === 2 ? 'text-[var(--em-green-deep)]' : 'text-[var(--em-ink)]'}`}>{12 + i}</div>
                    </div>
                    <div className="flex-1 min-h-[150px] bg-[var(--em-bg)] rounded-xl border border-[var(--em-border-strong)] p-2 space-y-2">
                      {i === 0 && (
                        <div className="bg-[var(--em-mint)] border border-[var(--em-ink)] p-2 rounded-lg text-[10px] font-bold text-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12]">
                          10:00 - Revisão
                        </div>
                      )}
                      {i === 2 && (
                        <>
                          <div className="bg-[var(--em-yellow)] border border-[var(--em-ink)] p-2 rounded-lg text-[10px] font-bold text-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12]">
                            14:00 - Análise
                          </div>
                          <div className="bg-[var(--em-peach)] border border-[var(--em-ink)] p-2 rounded-lg text-[10px] font-bold text-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12]">
                            18:30 - FUVEST
                          </div>
                        </>
                      )}
                      {i === 4 && (
                        <div className="bg-[var(--em-lavender)] border border-[var(--em-ink)] p-2 rounded-lg text-[10px] font-bold text-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12]">
                          19:00 - Plantão
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-8">
            {/* ESTATÍSTICAS DO MÊS */}
            <div className="em-card-hard p-6 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <BarChart className="w-5 h-5 text-[var(--em-ink)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Estatísticas do mês</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[13px] font-bold text-[var(--em-text-soft)]">Pico de simultâneos</span>
                    <span className="text-[18px] font-extrabold text-[var(--em-ink)]">428</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--em-bg)] rounded-full overflow-hidden border border-[var(--em-border-strong)]">
                    <div className="h-full bg-[var(--em-peach)]" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[13px] font-bold text-[var(--em-text-soft)]">Taxa de presença</span>
                    <span className="text-[18px] font-extrabold text-[var(--em-ink)]">68%</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--em-bg)] rounded-full overflow-hidden border border-[var(--em-border-strong)]">
                    <div className="h-full bg-[var(--em-mint)]" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[13px] font-bold text-[var(--em-text-soft)]">Aulas realizadas</span>
                    <span className="text-[18px] font-extrabold text-[var(--em-ink)]">42</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--em-bg)] rounded-full overflow-hidden border border-[var(--em-border-strong)]">
                    <div className="h-full bg-[var(--em-lavender)]" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="em-card-hard p-6 bg-[var(--em-cream)]">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl border border-[var(--em-ink)] bg-white hover:bg-[var(--em-yellow-soft)] transition-colors flex items-center justify-between shadow-[2px_2px_0_0_#0E0F12]">
                  <span className="text-[13px] font-bold text-[var(--em-ink)] flex items-center gap-2"><Radio className="w-4 h-4"/> Criar link de emergência</span>
                  <ArrowRight className="w-4 h-4 text-[var(--em-text-mute)]" />
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-[var(--em-ink)] bg-white hover:bg-[var(--em-yellow-soft)] transition-colors flex items-center justify-between shadow-[2px_2px_0_0_#0E0F12]">
                  <span className="text-[13px] font-bold text-[var(--em-ink)] flex items-center gap-2"><Settings className="w-4 h-4"/> Configurações Zoom/Meet</span>
                  <ArrowRight className="w-4 h-4 text-[var(--em-text-mute)]" />
                </button>
                <button className="w-full text-left p-3 rounded-xl border border-[var(--em-ink)] bg-white hover:bg-[var(--em-yellow-soft)] transition-colors flex items-center justify-between shadow-[2px_2px_0_0_#0E0F12]">
                  <span className="text-[13px] font-bold text-[var(--em-ink)] flex items-center gap-2"><BarChart className="w-4 h-4"/> Exportar relatórios</span>
                  <ArrowRight className="w-4 h-4 text-[var(--em-text-mute)]" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
