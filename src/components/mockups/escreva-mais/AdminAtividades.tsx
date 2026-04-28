"use client";

import { 
  ClipboardList, 
  FileText, 
  Star, 
  Calendar, 
  Filter, 
  MoreVertical, 
  Edit, 
  Eye,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

const ADMIN_ACTIVITIES = [
  { title: "Desafios da mobilidade urbana no Brasil", prof: "Prof. Rafael Costa", avatar: "RC", tags: ["ENEM 2026", "Geografia"], status: "Publicado", envios: "142", taxa: "78%", bg: "var(--em-mint)" },
  { title: "Inteligência Artificial e o futuro do trabalho", prof: "Profª. Júlia Silva", avatar: "JS", tags: ["Fuvest", "Tecnologia"], status: "Publicado", envios: "287", taxa: "84%", bg: "var(--em-lavender)" },
  { title: "Caminhos para combater a fome", prof: "Prof. Lucas Mendes", avatar: "LM", tags: ["ENEM 2026", "Sociologia"], status: "Publicado", envios: "95", taxa: "62%", bg: "var(--em-peach)" },
  { title: "O papel da arte na sociedade contemporânea", prof: "Profª. Ana Carolina", avatar: "AC", tags: ["Unicamp", "Artes"], status: "Rascunho", envios: "0", taxa: "0%", bg: "var(--em-cream)" },
  { title: "A persistência da violência contra a mulher", prof: "Profª. Júlia Silva", avatar: "JS", tags: ["ENEM 2026", "Atualidades"], status: "Publicado", envios: "210", taxa: "88%", bg: "var(--em-rose)" },
  { title: "Democratização do acesso à cultura", prof: "Prof. Rafael Costa", avatar: "RC", tags: ["ENEM 2026", "Cultura"], status: "Publicado", envios: "156", taxa: "75%", bg: "var(--em-yellow-soft)" },
  { title: "Desafios da saúde pública", prof: "Prof. Lucas Mendes", avatar: "LM", tags: ["Fuvest", "Saúde"], status: "Rascunho", envios: "0", taxa: "0%", bg: "var(--em-cream)" },
  { title: "Impactos ambientais no século XXI", prof: "Profª. Ana Carolina", avatar: "AC", tags: ["Unicamp", "Meio Ambiente"], status: "Publicado", envios: "112", taxa: "68%", bg: "var(--em-mint)" },
  { title: "O limite entre liberdade de expressão e discurso de ódio", prof: "Prof. Rafael Costa", avatar: "RC", tags: ["ENEM 2026", "Direito"], status: "Publicado", envios: "198", taxa: "82%", bg: "var(--em-lavender)" },
];

export function AdminAtividades() {
  const [creatorFilter, setCreatorFilter] = useState("Todos");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [highlights, setHighlights] = useState(["Simulado FUVEST 2026", "Desafios da mobilidade...", "Inteligência Artificial..."]);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return ADMIN_ACTIVITIES.filter((activity) => {
      const matchesCreator = creatorFilter === "Todos" || activity.prof === creatorFilter;
      const matchesCategory = categoryFilter === "Todas" || activity.tags.includes(categoryFilter);
      const matchesStatus = statusFilter === "Todos" || activity.status === statusFilter;
      const matchesSearch =
        !query || `${activity.title} ${activity.prof} ${activity.tags.join(" ")}`.toLowerCase().includes(query);

      return matchesCreator && matchesCategory && matchesStatus && matchesSearch;
    });
  }, [categoryFilter, creatorFilter, search, statusFilter]);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Atividades · 142 na plataforma"
      pageTitle="Gestão geral de atividades."
      primaryAction={{ label: "Nova atividade global", onClick: () => notify("Criador de atividade global aberto.") }}
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
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Total publicadas</span>
              <ClipboardList className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">118</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-ink)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-ink)]">Ativas hoje</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-cream)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Rascunhos</span>
              <FileText className="w-5 h-5 text-[var(--em-text-soft)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">24</div>
            <div className="mt-2 text-[12px] font-semibold text-[var(--em-text-soft)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-border-strong)]">Aguardando revisão</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-peach)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Mais respondida</span>
              <Star className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="text-[18px] font-extrabold text-[var(--em-ink)] leading-tight mb-2">Tecnologia e desigualdade</div>
            <div className="mt-auto text-[12px] font-bold text-[var(--em-ink)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-ink)]">287 envios</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-lavender)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-bold text-[var(--em-ink)]">Criadas este mês</span>
              <Calendar className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">12</div>
            <div className="mt-2 text-[12px] font-bold text-[var(--em-ink)] bg-white/40 self-start px-2 py-1 rounded-md border border-[var(--em-ink)]">+4 vs mês passado</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          <div className="xl:col-span-3 space-y-6">
            {/* FILTERS */}
            <div className="em-card-hard p-4 bg-white flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="w-4 h-4 text-[var(--em-ink)]" />
                <span className="text-[14px] font-bold text-[var(--em-ink)]">Filtros</span>
              </div>
              
              <select value={creatorFilter} onChange={(event) => setCreatorFilter(event.target.value)} className="px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-semibold text-[var(--em-ink)] outline-none min-w-[140px]">
                <option>Todos</option>
                <option>Prof. Rafael Costa</option>
                <option>Profª. Júlia Silva</option>
                <option>Profª. Ana Carolina</option>
                <option>Prof. Lucas Mendes</option>
              </select>
              
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-semibold text-[var(--em-ink)] outline-none min-w-[120px]">
                <option>Todas</option>
                <option>ENEM 2026</option>
                <option>Fuvest</option>
                <option>Unicamp</option>
              </select>
              
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-semibold text-[var(--em-ink)] outline-none min-w-[120px]">
                <option>Todos</option>
                <option>Publicado</option>
                <option>Rascunho</option>
                <option>Arquivado</option>
              </select>

              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar atividade..." 
                  className="w-full pl-9 pr-3 py-2 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded-xl text-[13px] font-medium outline-none focus:border-[var(--em-ink)] transition-colors"
                />
              </div>
            </div>

            {/* GRID OF ACTIVITIES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((item, i) => (
                <div key={i} className="em-card-hard flex flex-col overflow-hidden bg-white group hover:-translate-y-1 transition-transform">
                  <div className="h-12 border-b border-[var(--em-ink)] px-4 flex items-center justify-between" style={{ backgroundColor: item.bg }}>
                    {item.status === "Publicado" ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--em-green-soft)] text-[var(--em-green-deep)] rounded border border-[var(--em-green-deep)]/20">Publicado</span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white text-[var(--em-text-soft)] rounded border border-[var(--em-border-strong)]">Rascunho</span>
                    )}
                    <button type="button" onClick={() => notify(`Menu de opções aberto para: ${item.title}`)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/50 transition-colors">
                      <MoreVertical className="w-4 h-4 text-[var(--em-ink)]" />
                    </button>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-[16px] font-extrabold text-[var(--em-ink)] leading-snug mb-3 line-clamp-2 flex-1">{item.title}</h4>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-[var(--em-bg-alt)] border border-[var(--em-border-strong)] flex items-center justify-center text-[9px] font-bold text-[var(--em-ink)]">
                        {item.avatar}
                      </div>
                      <span className="text-[12px] font-semibold text-[var(--em-text-soft)]">{item.prof}</span>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      {item.tags.map((tag, j) => (
                        <span key={j} className="text-[11px] font-bold px-2 py-0.5 bg-[var(--em-bg)] border border-[var(--em-border)] rounded text-[var(--em-text-soft)]">{tag}</span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--em-border-strong)]">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[var(--em-text-mute)] uppercase">Envios</span>
                        <span className="text-[14px] font-extrabold text-[var(--em-ink)]">{item.envios}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-bold text-[var(--em-text-mute)] uppercase">Conclusão</span>
                        <span className="text-[14px] font-extrabold text-[var(--em-ink)]">{item.taxa}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[var(--em-ink)] bg-[var(--em-bg-alt)] grid grid-cols-2 divide-x divide-[var(--em-ink)]">
                    <button type="button" onClick={() => notify(`Detalhes carregados para: ${item.title}`)} className="py-2 text-[12px] font-bold text-[var(--em-ink)] hover:bg-[var(--em-yellow)] transition-colors flex items-center justify-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Detalhes
                    </button>
                    <button type="button" onClick={() => notify(`Editor aberto para: ${item.title}`)} className="py-2 text-[12px] font-bold text-[var(--em-ink)] hover:bg-[var(--em-yellow)] transition-colors flex items-center justify-center gap-1">
                      <Edit className="w-3.5 h-3.5" /> Editar
                    </button>
                  </div>
                </div>
              ))}
              {filteredActivities.length === 0 ? (
                <div className="em-card-hard col-span-full bg-white p-8 text-center text-sm font-extrabold text-[var(--em-text-soft)]">
                  Nenhuma atividade encontrada com os filtros atuais.
                </div>
              ) : null}
            </div>
            
          </div>
          
          <div className="space-y-6">
            {/* DESTAQUES HOME */}
            <div className="em-card-hard p-6 bg-white">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-[var(--em-yellow-deep)] fill-current" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Destaques na Home</h3>
              </div>
              <p className="text-[13px] font-medium text-[var(--em-text-soft)] mb-4">Estas atividades estão fixadas no topo do painel dos alunos.</p>
              
              <div className="space-y-3">
                {[
                  { title: "Simulado FUVEST 2026", active: true },
                  { title: "Desafios da mobilidade...", active: true },
                  { title: "Inteligência Artificial...", active: true },
                  { title: "Democratização do acesso...", active: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between p-3 rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                    <span className="text-[13px] font-bold text-[var(--em-ink)] flex-1 pr-3 leading-snug">{item.title}</span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={highlights.includes(item.title)}
                        onChange={(event) => {
                          setHighlights((current) =>
                            event.target.checked ? [...current, item.title] : current.filter((title) => title !== item.title),
                          );
                        }}
                      />
                      <div className="w-9 h-5 bg-[var(--em-border-strong)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--em-green)] border border-[var(--em-ink)]"></div>
                    </label>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => notify("Lista de atividades disponíveis para destaque aberta.")} className="w-full mt-5 py-2 text-[13px] font-bold text-[var(--em-ink)] border border-[var(--em-ink)] rounded-xl hover:bg-[var(--em-cream)] transition-colors border-dashed">
                + Adicionar destaque
              </button>
            </div>
            
            {/* ESTATÍSTICAS RÁPIDAS */}
            <div className="em-card-hard p-6 bg-[var(--em-ink)] text-white">
              <h3 className="text-[16px] font-extrabold mb-6">Desempenho das atividades</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-[12px] font-bold mb-1">
                    <span className="text-[var(--em-text-on-dark-soft)]">Taxa média de envio</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--em-green)] rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] font-bold mb-1">
                    <span className="text-[var(--em-text-on-dark-soft)]">Atividades com nota &gt; 800</span>
                    <span>45%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--em-yellow)] rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] font-bold mb-1">
                    <span className="text-[var(--em-text-on-dark-soft)]">Tempo médio de resposta</span>
                    <span>4.2 dias</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--em-lavender)] rounded-full" style={{ width: '60%' }}></div>
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
