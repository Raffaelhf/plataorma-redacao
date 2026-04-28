"use client";

import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";
import { 
  ClipboardCheck, 
  AlertCircle, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { useMemo, useState } from "react";

const CORRECTION_QUEUE = [
  { aluno: "Lucas Oliveira", tema: "Caminhos para combater a fome", prof: "Marina Costa", tempo: "52h", urgencia: "vermelho", status: "Pendente", atividade: "ENEM 2026" },
  { aluno: "Beatriz Mendes", tema: "A importância da arte", prof: "Não atribuído", tempo: "49h", urgencia: "vermelho", status: "Pendente", atividade: "Fuvest" },
  { aluno: "Rafael Souza", tema: "Inteligência Artificial na educação", prof: "Pedro Lima", tempo: "18h", urgencia: "ambar", status: "Em correção", atividade: "ENEM 2026" },
  { aluno: "Mariana Costa", tema: "Mobilidade urbana no Brasil", prof: "Carlos Andrade", tempo: "12h", urgencia: "verde", status: "Em correção", atividade: "ENEM 2026" },
  { aluno: "João Gabriel", tema: "Saúde mental dos jovens", prof: "Marina Costa", tempo: "5h", urgencia: "verde", status: "Pendente", atividade: "Fuvest" },
  { aluno: "Ana Clara Silva", tema: "O impacto das redes sociais", prof: "Não atribuído", tempo: "2h", urgencia: "verde", status: "Pendente", atividade: "ENEM 2026" },
  { aluno: "Felipe Rocha", tema: "Desafios da sustentabilidade", prof: "Pedro Lima", tempo: "40h", urgencia: "ambar", status: "Pendente", atividade: "Fuvest" },
  { aluno: "Camila Dias", tema: "O futuro do trabalho", prof: "Carlos Andrade", tempo: "22h", urgencia: "ambar", status: "Em correção", atividade: "ENEM 2026" },
  { aluno: "Thiago Mendes", tema: "Esportes e inclusão social", prof: "Marina Costa", tempo: "1h", urgencia: "verde", status: "Pendente", atividade: "Unicamp" },
  { aluno: "Laura Castro", tema: "Fake news e democracia", prof: "Pedro Lima", tempo: "30h", urgencia: "ambar", status: "Pendente", atividade: "ENEM 2026" },
];

export function AdminCorrecoes() {
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("Todos");
  const [activityFilter, setActivityFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const pageSize = 6;
  const filteredQueue = useMemo(() => {
    const query = search.trim().toLowerCase();

    return CORRECTION_QUEUE.filter((item) => {
      const matchesTeacher = teacherFilter === "Todos" || item.prof === teacherFilter;
      const matchesActivity = activityFilter === "Todas" || item.atividade === activityFilter;
      const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;
      const matchesSearch = !query || `${item.aluno} ${item.tema} ${item.prof}`.toLowerCase().includes(query);

      return matchesTeacher && matchesActivity && matchesStatus && matchesSearch;
    });
  }, [activityFilter, search, statusFilter, teacherFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredQueue.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleQueue = filteredQueue.slice((safePage - 1) * pageSize, safePage * pageSize);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Correções · Visão administrativa"
      pageTitle="Fila geral da plataforma."
      primaryAction={{ label: "Distribuir para professores", onClick: () => notify(`${filteredQueue.length} redações redistribuídas na visualização atual.`) }}
    >
      <div className="space-y-8 pb-12">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="em-card-hard p-5 bg-[var(--em-cream)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-text-soft)]">Total pendentes</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <ClipboardCheck className="w-4 h-4 text-[var(--em-ink)]" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">47</div>
          </div>

          <div className="em-card-hard p-5 bg-[var(--em-surface)] border-2 border-[var(--em-coral)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-coral)]">Em atraso {'>'}48h</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--em-coral)] grid place-items-center border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-coral)]">8</div>
            <div className="mt-1 text-[12px] font-bold text-[var(--em-ink)]">Atenção necessária</div>
          </div>

          <div className="em-card-hard p-5 bg-[var(--em-mint)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Tempo médio espera</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <Clock className="w-4 h-4 text-[var(--em-ink)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <div className="em-display text-[42px] text-[var(--em-ink)]">18</div>
              <span className="text-[18px] font-bold text-[var(--em-text-soft)]">h</span>
            </div>
          </div>

          <div className="em-card-hard p-5 bg-[var(--em-lavender)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Professores ativos hoje</span>
              <div className="w-8 h-8 rounded-lg bg-white border border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <Users className="w-4 h-4 text-[var(--em-ink)]" />
              </div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">12</div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tabela de Fila */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="em-card-hard bg-white overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[var(--em-ink)] bg-[var(--em-cream)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-[20px] font-extrabold text-[var(--em-ink)]">Fila Geral</h2>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-[var(--em-border-strong)]">
                    <Search className="w-4 h-4 text-[var(--em-text-mute)]" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setPage(1);
                      }}
                      placeholder="Buscar aluno..." 
                      className="bg-transparent border-none outline-none text-[13px] font-semibold w-full sm:w-[200px]"
                    />
                  </div>
                </div>
                
                {/* Filtros */}
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                  <select value={teacherFilter} onChange={(event) => { setTeacherFilter(event.target.value); setPage(1); }} className="em-chip bg-white shrink-0 outline-none hover:bg-[var(--em-bg-alt)] cursor-pointer">
                    <option>Todos</option>
                    <option>Pedro Lima</option>
                    <option>Marina Costa</option>
                    <option>Carlos Andrade</option>
                    <option>Não atribuído</option>
                  </select>
                  <select value={activityFilter} onChange={(event) => { setActivityFilter(event.target.value); setPage(1); }} className="em-chip bg-white shrink-0 outline-none hover:bg-[var(--em-bg-alt)] cursor-pointer">
                    <option>Todas</option>
                    <option>ENEM 2026</option>
                    <option>Fuvest</option>
                    <option>Unicamp</option>
                  </select>
                  <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="em-chip bg-white shrink-0 outline-none hover:bg-[var(--em-bg-alt)] cursor-pointer">
                    <option>Todos</option>
                    <option>Pendente</option>
                    <option>Em correção</option>
                  </select>
                  <button type="button" onClick={() => { setSearch(""); setTeacherFilter("Todos"); setActivityFilter("Todas"); setStatusFilter("Todos"); setPage(1); }} className="em-chip bg-[var(--em-ink)] text-white border-[var(--em-ink)] shrink-0 flex items-center gap-1">
                    <Filter className="w-3 h-3" /> Mais filtros
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[var(--em-bg)] border-b border-[var(--em-border-strong)]">
                      <th className="p-4 text-[11px] font-extrabold text-[var(--em-text-soft)] uppercase tracking-wider">Aluno</th>
                      <th className="p-4 text-[11px] font-extrabold text-[var(--em-text-soft)] uppercase tracking-wider">Atividade</th>
                      <th className="p-4 text-[11px] font-extrabold text-[var(--em-text-soft)] uppercase tracking-wider">Professor</th>
                      <th className="p-4 text-[11px] font-extrabold text-[var(--em-text-soft)] uppercase tracking-wider">Espera</th>
                      <th className="p-4 text-[11px] font-extrabold text-[var(--em-text-soft)] uppercase tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleQueue.map((item, i) => (
                      <tr key={i} className="border-b border-[var(--em-border)] hover:bg-[var(--em-cream)] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--em-peach)] border border-[var(--em-ink)] flex items-center justify-center font-bold text-[var(--em-ink)] text-[11px]">
                              {item.aluno.split(" ").map(n => n[0]).join("").substring(0,2)}
                            </div>
                            <span className="font-semibold text-[14px] text-[var(--em-ink)]">{item.aluno}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[13px] text-[var(--em-ink)] line-clamp-1">{item.tema}</div>
                        </td>
                        <td className="p-4">
                          {item.prof !== "Não atribuído" ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[var(--em-lavender)] border border-[var(--em-ink)] flex items-center justify-center font-bold text-[var(--em-ink)] text-[9px]">
                                {item.prof.split(" ").map(n => n[0]).join("").substring(0,2)}
                              </div>
                              <span className="font-semibold text-[13px] text-[var(--em-ink)]">{item.prof}</span>
                            </div>
                          ) : (
                            <span className="text-[12px] font-bold text-[var(--em-coral)] bg-[var(--em-rose)] px-2 py-0.5 rounded border border-[var(--em-coral)]">Sem prof.</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold border border-[var(--em-ink)] ${
                            item.urgencia === "vermelho" ? "bg-[#FF5A5A] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" :
                            item.urgencia === "ambar" ? "bg-[#FFB020] text-[var(--em-ink)]" :
                            "bg-[var(--em-green)] text-[var(--em-ink)]"
                          }`}>
                            <Clock className="w-3 h-3" /> {item.tempo}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button type="button" onClick={() => notify(`Ações abertas para ${item.aluno}.`)} className="p-1.5 text-[var(--em-text-mute)] hover:bg-[var(--em-bg-alt)] hover:text-[var(--em-ink)] rounded transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {visibleQueue.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm font-extrabold text-[var(--em-text-soft)]">
                          Nenhuma correção encontrada com os filtros atuais.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-[var(--em-bg)] border-t border-[var(--em-ink)] flex justify-between items-center text-[13px] font-semibold text-[var(--em-text-soft)]">
                <span>Mostrando {visibleQueue.length ? (safePage - 1) * pageSize + 1 : 0}-{Math.min(safePage * pageSize, filteredQueue.length)} de {filteredQueue.length}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={safePage <= 1} className="px-3 py-1 bg-white border border-[var(--em-border-strong)] rounded disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                  <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={safePage >= totalPages} className="px-3 py-1 bg-white border border-[var(--em-ink)] text-[var(--em-ink)] rounded hover:bg-[var(--em-bg-alt)] disabled:opacity-50 disabled:cursor-not-allowed">Próxima</button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Distribuição */}
            <div className="em-card-hard p-6 bg-white">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-6">Distribuição atual</h3>
              
              <div className="space-y-4">
                {[
                  { prof: "Carlos Andrade", atual: 14, cap: 20, color: "var(--em-lavender)" },
                  { prof: "Pedro Lima", atual: 12, cap: 15, color: "var(--em-peach)" },
                  { prof: "Marina Costa", atual: 8, cap: 10, color: "var(--em-mint)" },
                  { prof: "Juliana Alves", atual: 5, cap: 15, color: "var(--em-yellow)" },
                ].map((p, i) => {
                  const pct = Math.round((p.atual / p.cap) * 100);
                  const isHigh = pct > 80;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full border border-[var(--em-ink)] flex items-center justify-center font-bold text-[var(--em-ink)] text-[9px]" style={{ backgroundColor: p.color }}>
                            {p.prof.split(" ").map(n => n[0]).join("").substring(0,2)}
                          </div>
                          <span className="text-[13px] font-bold text-[var(--em-ink)]">{p.prof}</span>
                        </div>
                        <span className="text-[12px] font-extrabold text-[var(--em-ink)]">{p.atual}/{p.cap}</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-full overflow-hidden">
                        <div className={`h-full border-r border-[var(--em-ink)] ${isHigh ? 'bg-[var(--em-coral)]' : 'bg-[var(--em-green)]'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button type="button" onClick={() => notify("Painel de capacidade dos professores aberto.")} className="w-full mt-6 py-2 border border-[var(--em-ink)] rounded-xl text-[13px] font-bold hover:bg-[var(--em-cream)] transition-colors">
                Gerenciar professores
              </button>
            </div>

            {/* Timeline */}
            <div className="em-card-hard p-6 bg-[var(--em-cream)]">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-6">Atividade recente</h3>
              
              <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[var(--em-border-strong)]">
                {[
                  { text: "Lote de 15 redações distribuídas automaticamente.", time: "10 min atrás", type: "system" },
                  { text: "Pedro Lima concluiu 3 correções.", time: "45 min atrás", type: "prof" },
                  { text: "Alerta: 8 redações passaram de 48h.", time: "2 horas atrás", type: "alert" },
                  { text: "Marina Costa iniciou o turno.", time: "3 horas atrás", type: "prof" },
                  { text: "Ana Vieira reatribuiu 5 redações para Carlos.", time: "Ontem", type: "admin" },
                ].map((act, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[var(--em-ink)] bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" style={{ 
                      backgroundColor: act.type === 'alert' ? 'var(--em-coral)' : act.type === 'system' ? 'var(--em-lavender)' : 'var(--em-mint)' 
                    }}>
                      {act.type === 'alert' && <AlertCircle className="w-3 h-3 text-white" />}
                      {act.type === 'prof' && <CheckCircle2 className="w-3 h-3 text-[var(--em-ink)]" />}
                      {act.type === 'system' && <Clock className="w-3 h-3 text-[var(--em-ink)]" />}
                      {act.type === 'admin' && <Users className="w-3 h-3 text-[var(--em-ink)]" />}
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 rounded-xl border border-[var(--em-border-strong)] bg-white shadow-sm">
                      <p className="text-[12px] font-semibold text-[var(--em-ink)] leading-tight mb-1">{act.text}</p>
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
