"use client";

import { 
  PlayCircle, 
  Layers, 
  Video, 
  Clock, 
  Edit2, 
  Archive, 
  BarChart2,
  Users,
  Filter,
  Search,
  ChevronDown
} from "lucide-react";
import { useMemo, useState } from "react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

const CLASSROOMS = [
  { title: "Intensivo ENEM 2026", prof: "Profª. Júlia Silva", avatar: "JS", alunos: 842, status: "Publicado", bg: "var(--em-mint)", pct: 68, modulos: 12 },
  { title: "Dominando a Fuvest", prof: "Prof. Rafael Costa", avatar: "RC", alunos: 430, status: "Publicado", bg: "var(--em-lavender)", pct: 45, modulos: 8 },
  { title: "Repertório Sociocultural", prof: "Profª. Ana Carolina", avatar: "AC", alunos: 1250, status: "Publicado", bg: "var(--em-peach)", pct: 82, modulos: 15 },
  { title: "Gramática Aplicada", prof: "Prof. Lucas Mendes", avatar: "LM", alunos: 320, status: "Em produção", bg: "var(--em-cream)", pct: 15, modulos: 6 },
];

export function AdminVideoaulas() {
  const [teacherFilter, setTeacherFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [expandedClassroom, setExpandedClassroom] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const filteredClassrooms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return CLASSROOMS.filter((classroom) => {
      const matchesTeacher = teacherFilter === "Todos" || classroom.prof === teacherFilter;
      const matchesStatus = statusFilter === "Todos" || classroom.status === statusFilter;
      const matchesSearch = !query || `${classroom.title} ${classroom.prof}`.toLowerCase().includes(query);

      return matchesTeacher && matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, teacherFilter]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Videoaulas · Biblioteca completa"
      pageTitle="Conteúdo da plataforma."
      primaryAction={{ label: "Importar lote de aulas", onClick: () => notify("Importador de lote de aulas aberto.") }}
    >
      <div className="space-y-8">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}
        
        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="em-card-hard p-5 bg-[var(--em-mint)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Turmas</span>
              <Users className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">28</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-ink)]">Ativas</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-peach)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Módulos</span>
              <Layers className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">94</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-ink)]">Publicados</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-lavender)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Aulas</span>
              <Video className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">412</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-ink)]">+18 em produção</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-cream)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Horas totais</span>
              <Clock className="w-5 h-5 text-[var(--em-text-soft)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">147h</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-text-soft)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-border-strong)]">De conteúdo gravado</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 space-y-6">
            {/* FILTERS */}
            <div className="em-card-hard p-4 bg-white flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="w-4 h-4 text-[var(--em-ink)]" />
                <span className="text-[14px] font-bold text-[var(--em-ink)]">Filtros</span>
              </div>
              
              <select value={teacherFilter} onChange={(event) => setTeacherFilter(event.target.value)} className="px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-semibold text-[var(--em-ink)] outline-none min-w-[140px]">
                <option>Todos</option>
                <option>Prof. Rafael Costa</option>
                <option>Profª. Júlia Silva</option>
                <option>Profª. Ana Carolina</option>
                <option>Prof. Lucas Mendes</option>
              </select>
              
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-semibold text-[var(--em-ink)] outline-none min-w-[120px]">
                <option>Todos</option>
                <option>Publicado</option>
                <option>Em produção</option>
                <option>Arquivado</option>
              </select>

              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar turmas..." 
                  className="w-full pl-9 pr-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-medium outline-none focus:border-[var(--em-ink)] transition-colors"
                />
              </div>
            </div>

            {/* LISTA DE TURMAS */}
            <div className="space-y-4">
              {filteredClassrooms.map((turma, i) => (
                <div key={i} className="em-card-hard overflow-hidden bg-white">
                  <div className="flex flex-col md:flex-row">
                    {/* Left Banner Info */}
                    <div className="w-full md:w-1/3 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[var(--em-ink)]" style={{ backgroundColor: turma.bg }}>
                      <div>
                        {turma.status === "Publicado" ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--em-green-soft)] text-[var(--em-green-deep)] rounded border border-[var(--em-green-deep)]/20 inline-block mb-3">Publicado</span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white text-[var(--em-text-soft)] rounded border border-[var(--em-border-strong)] inline-block mb-3">Em Produção</span>
                        )}
                        <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] leading-snug mb-4">{turma.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border border-[var(--em-ink)] flex items-center justify-center text-[10px] font-bold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                          {turma.avatar}
                        </div>
                        <span className="text-[13px] font-bold text-[var(--em-ink)]">{turma.prof}</span>
                      </div>
                    </div>
                    
                    {/* Right Actions & Details */}
                    <div className="w-full md:w-2/3 p-5 flex flex-col justify-between">
                      <div className="flex flex-wrap items-center gap-6 mb-6">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[var(--em-text-mute)] uppercase tracking-wider">Alunos</span>
                          <span className="text-[16px] font-extrabold text-[var(--em-ink)] flex items-center gap-1.5"><Users className="w-4 h-4 text-[var(--em-text-soft)]"/> {turma.alunos}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-[var(--em-text-mute)] uppercase tracking-wider">Módulos</span>
                          <span className="text-[16px] font-extrabold text-[var(--em-ink)] flex items-center gap-1.5"><Layers className="w-4 h-4 text-[var(--em-text-soft)]"/> {turma.modulos}</span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-[150px]">
                          <span className="text-[11px] font-bold text-[var(--em-text-mute)] uppercase tracking-wider mb-1">Conclusão Média</span>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-[var(--em-bg-alt)] rounded-full overflow-hidden border border-[var(--em-border-strong)]">
                              <div className="h-full bg-[var(--em-green)]" style={{ width: `${turma.pct}%` }}></div>
                            </div>
                            <span className="text-[13px] font-extrabold text-[var(--em-ink)]">{turma.pct}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--em-border-strong)]">
                        <button type="button" onClick={() => setExpandedClassroom((current) => (current === turma.title ? null : turma.title))} className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--em-ink)] hover:text-[var(--em-green-deep)] transition-colors">
                          <ChevronDown className={`w-4 h-4 transition-transform ${expandedClassroom === turma.title ? "rotate-180" : ""}`} /> Expandir módulos
                        </button>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => notify(`Editor aberto para ${turma.title}.`)} className="p-2 rounded-lg bg-[var(--em-bg)] border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] hover:bg-white text-[var(--em-ink)] transition-colors shadow-[2px_2px_0_0_transparent] hover:shadow-[2px_2px_0_0_#0E0F12]" title="Editar metadados">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => notify(`Estatísticas carregadas para ${turma.title}.`)} className="p-2 rounded-lg bg-[var(--em-bg)] border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] hover:bg-white text-[var(--em-ink)] transition-colors shadow-[2px_2px_0_0_transparent] hover:shadow-[2px_2px_0_0_#0E0F12]" title="Estatísticas detalhadas">
                            <BarChart2 className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => notify(`${turma.title} marcada para arquivamento.`)} className="p-2 rounded-lg bg-[var(--em-bg)] border border-[var(--em-border-strong)] hover:border-[var(--em-ink)] hover:bg-white text-[var(--em-coral)] transition-colors shadow-[2px_2px_0_0_transparent] hover:shadow-[2px_2px_0_0_#0E0F12]" title="Arquivar">
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {expandedClassroom === turma.title ? (
                        <div className="mt-4 rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-3 text-[13px] font-bold text-[var(--em-ink)]">
                          {turma.modulos} módulos disponíveis: fundamentos, repertório, prática guiada e revisão.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              {filteredClassrooms.length === 0 ? (
                <div className="em-card-hard bg-white p-8 text-center text-sm font-extrabold text-[var(--em-text-soft)]">
                  Nenhuma turma encontrada com os filtros atuais.
                </div>
              ) : null}
            </div>
            
          </div>
          
          <div className="space-y-6">
            {/* PRÓXIMAS AULAS A PUBLICAR */}
            <div className="em-card-hard p-6 bg-[var(--em-ink)] text-white">
              <div className="flex items-center gap-2 mb-6">
                <Video className="w-5 h-5 text-[var(--em-yellow)]" />
                <h3 className="text-[16px] font-extrabold text-white">Próximas aulas a publicar</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Coesão e coerência pt. 2", date: "Amanhã", prof: "Lucas Mendes" },
                  { title: "A introdução perfeita", date: "Em 3 dias", prof: "Júlia Silva" },
                  { title: "Erros comuns no ENEM", date: "Na próxima semana", prof: "Rafael Costa" }
                ].map((aula, i) => (
                  <div key={i} className="flex flex-col p-3 rounded-xl border border-white/20 bg-white/5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--em-yellow)]"></div>
                    <h4 className="text-[14px] font-bold text-white mb-1 pl-2">{aula.title}</h4>
                    <div className="flex items-center justify-between text-[12px] font-medium text-white/60 pl-2">
                      <span>{aula.prof}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {aula.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => notify("Calendário de produção aberto.")} className="w-full mt-6 py-2.5 text-[13px] font-bold text-[var(--em-ink)] bg-[var(--em-yellow)] rounded-xl hover:brightness-110 transition-all border border-transparent shadow-[4px_4px_0_0_#000]">
                Ver calendário de produção
              </button>
            </div>
            
            {/* TOP 5 AULAS MAIS ASSISTIDAS */}
            <div className="em-card-hard p-6 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <PlayCircle className="w-5 h-5 text-[var(--em-green-deep)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Top 5 aulas mais assistidas</h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Estrutura base da redação", views: "12.4k", bg: "var(--em-mint)" },
                  { title: "Como analisar o tema", views: "9.8k", bg: "var(--em-peach)" },
                  { title: "Uso de conectivos", views: "8.2k", bg: "var(--em-lavender)" },
                  { title: "Citações coringas", views: "7.5k", bg: "var(--em-rose)" },
                  { title: "Conclusão e proposta", views: "6.9k", bg: "var(--em-yellow-soft)" }
                ].map((aula, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className="text-[14px] font-extrabold text-[var(--em-text-mute)] w-4 text-center">{i + 1}</div>
                    <div className="w-16 h-10 rounded-lg border border-[var(--em-ink)] flex items-center justify-center shadow-[2px_2px_0_0_#0E0F12] group-hover:shadow-[3px_3px_0_0_#0E0F12] transition-all" style={{ backgroundColor: aula.bg }}>
                      <PlayCircle className="w-4 h-4 text-[var(--em-ink)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[var(--em-ink)] truncate group-hover:text-[var(--em-green-deep)] transition-colors">{aula.title}</div>
                      <div className="text-[11px] font-semibold text-[var(--em-text-soft)]">{aula.views} visualizações</div>
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
