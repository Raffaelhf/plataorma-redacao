"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  Plus, 
  Clock, 
  Users,
  Edit2,
  Copy,
  Trash2,
  CheckCircle2,
  Eye,
  MessageSquare
} from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

const ATIVIDADES = [
  { id: 1, titulo: "O impacto dos influenciadores digitais na formação dos jovens", descricao: "Proposta focada em argumentação sobre o consumo de conteúdo em redes sociais e seus reflexos comportamentais.", status: "Publicado", envios: 45, data: "12 Out 2023", tags: ["ENEM", "Tecnologia", "Comportamento"], bg: "var(--em-mint)", iconColor: "var(--em-green-deep)" },
  { id: 2, titulo: "Caminhos para combater a insegurança alimentar no Brasil", descricao: "Análise das raízes históricas e estruturais da fome no país, exigindo proposta de intervenção detalhada.", status: "Publicado", envios: 82, data: "05 Out 2023", tags: ["ENEM", "Desigualdade", "Saúde"], bg: "var(--em-peach)", iconColor: "var(--em-peach-deep)" },
  { id: 3, titulo: "A persistência do racismo estrutural e suas consequências", descricao: "Tema recorrente que exige repertório sociocultural consistente sobre a formação do Brasil.", status: "Rascunho", envios: 0, data: "Hoje", tags: ["Fuvest", "Sociedade"], bg: "var(--em-lavender)", iconColor: "var(--em-lavender-deep)" },
  { id: 4, titulo: "Desafios da mobilidade urbana nas grandes metrópoles", descricao: "Discussão sobre o modelo rodoviarista e alternativas sustentáveis de transporte público.", status: "Publicado", envios: 34, data: "28 Set 2023", tags: ["Unicamp", "Meio Ambiente"], bg: "var(--em-mint)", iconColor: "var(--em-green-deep)" },
  { id: 5, titulo: "O papel do esporte como ferramenta de inclusão social", descricao: "Reflexão sobre as políticas públicas de incentivo ao esporte em áreas de vulnerabilidade.", status: "Publicado", envios: 112, data: "15 Set 2023", tags: ["ENEM", "Educação", "Esporte"], bg: "var(--em-peach)", iconColor: "var(--em-peach-deep)" },
  { id: 6, titulo: "Efeitos da inteligência artificial no mercado de trabalho", descricao: "Proposta voltada para as inovações tecnológicas e a substituição da mão de obra humana.", status: "Rascunho", envios: 0, data: "Ontem", tags: ["Tecnologia", "Trabalho"], bg: "var(--em-lavender)", iconColor: "var(--em-lavender-deep)" },
  { id: 7, titulo: "A crise hídrica e a gestão dos recursos naturais", descricao: "Análise da falta de planejamento urbano e o impacto das mudanças climáticas no abastecimento.", status: "Arquivado", envios: 156, data: "02 Ago 2023", tags: ["Fuvest", "Meio Ambiente"], bg: "var(--em-mute)", iconColor: "var(--em-text-mute)" },
  { id: 8, titulo: "Limites entre a liberdade de expressão e o discurso de ódio", descricao: "Discussão jurídica e social sobre o uso da internet para disseminação de intolerância.", status: "Publicado", envios: 67, data: "10 Ago 2023", tags: ["ENEM", "Cidadania"], bg: "var(--em-mint)", iconColor: "var(--em-green-deep)" },
];

export function ProfessorAtividades() {
  const [activeTab, setActiveTab] = useState("Todas");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  };

  const filtered = ATIVIDADES.filter(a => {
    const matchesSearch = !search || `${a.titulo} ${a.descricao} ${a.tags.join(" ")}`.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "Todas") return a.status !== "Arquivado" && matchesSearch;
    if (activeTab === "Publicadas") return a.status === "Publicado" && matchesSearch;
    if (activeTab === "Rascunhos") return a.status === "Rascunho" && matchesSearch;
    if (activeTab === "Arquivadas") return a.status === "Arquivado" && matchesSearch;
    return matchesSearch;
  });

  return (
    <AppLayout
      role="professor"
      userName="Pedro Lima"
      userEmail="pedro.lima@escrevamais.com"
      pageKicker="Atividades · 28 criadas"
      pageTitle="Suas propostas de redação."
      primaryAction={{ label: "Nova atividade", onClick: () => notify("Criador de atividade aberto para validacao da tela.") }}
    >
      <div className="space-y-8">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="em-card-hard p-5 bg-white">
            <div className="text-[14px] font-bold text-[var(--em-text-soft)] mb-1">Publicadas</div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">22</div>
          </div>
          <div className="em-card-hard p-5 bg-[var(--em-cream)]">
            <div className="text-[14px] font-bold text-[var(--em-text-soft)] mb-1">Rascunhos</div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">6</div>
          </div>
          <div className="em-card-hard p-5 bg-[var(--em-mint)]">
            <div className="text-[14px] font-bold text-[var(--em-ink-soft)] mb-1">Total de envios recebidos</div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">314</div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {["Todas", "Publicadas", "Rascunhos", "Arquivadas"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`em-chip shrink-0 ${activeTab === tab ? "bg-[var(--em-ink)] text-white border-[var(--em-ink)]" : "hover:bg-[var(--em-bg-alt)]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
              <input 
                type="text" 
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar atividades..." 
                className="w-full pl-9 pr-4 h-10 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-white text-[13px] font-semibold focus:outline-none focus:border-[var(--em-ink)]"
              />
            </div>
            <button onClick={() => notify("Filtros avancados aplicados na visualizacao.")} className="w-10 h-10 shrink-0 rounded-xl bg-white border-[1.5px] border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-text-soft)] hover:border-[var(--em-ink)] hover:text-[var(--em-ink)]">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create New Card */}
          {activeTab === "Todas" && (
            <button type="button" onClick={() => notify("Criador de atividade aberto para validacao da tela.")} className="rounded-[var(--em-radius-card)] border-2 border-dashed border-[var(--em-border-strong)] hover:border-[var(--em-ink)] hover:bg-white/50 transition-colors cursor-pointer flex flex-col items-center justify-center p-8 text-center min-h-[280px] group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--em-bg-alt)] group-hover:bg-[var(--em-yellow)] border-[1.5px] border-[var(--em-border-strong)] group-hover:border-[var(--em-ink)] flex items-center justify-center mb-4 transition-colors group-hover:shadow-[4px_4px_0_0_#0E0F12]">
                <Plus className="w-6 h-6 text-[var(--em-text-soft)] group-hover:text-[var(--em-ink)]" strokeWidth={2.5} />
              </div>
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-1">Criar nova atividade</h3>
              <p className="text-[14px] font-medium text-[var(--em-text-soft)]">Crie em 3 minutos usando modelos ou comece do zero.</p>
            </button>
          )}

          {/* Activity Cards */}
          {filtered.map(item => (
            <div key={item.id} className="em-card-hard bg-white flex flex-col overflow-hidden group">
              
              {/* Banner Top */}
              <div className="h-16 relative flex items-end p-4 border-b border-[var(--em-ink)]" style={{ backgroundColor: item.bg }}>
                <div className="absolute -bottom-5 right-4 w-10 h-10 rounded-xl bg-white border-[1.5px] border-[var(--em-ink)] flex items-center justify-center shadow-[2px_2px_0_0_#0E0F12]">
                  <FileText className="w-4.5 h-4.5" style={{ color: item.iconColor }} strokeWidth={2.5} />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                    item.status === "Publicado" ? "bg-[var(--em-green-soft)] text-[var(--em-green-deep)] border-[var(--em-green)]" :
                    item.status === "Rascunho" ? "bg-[var(--em-cream)] text-[var(--em-text-soft)] border-[var(--em-border-strong)]" :
                    "bg-[var(--em-bg)] text-[var(--em-text-mute)] border-[var(--em-border)]"
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-[12px] font-bold text-[var(--em-text-mute)] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.data}
                  </span>
                </div>

                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] leading-snug mb-2 line-clamp-2">
                  {item.titulo}
                </h3>
                <p className="text-[13px] font-medium text-[var(--em-text-soft)] line-clamp-2 mb-4 flex-1">
                  {item.descricao}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-bold px-2 py-0.5 bg-[var(--em-bg)] border border-[var(--em-border-strong)] rounded text-[var(--em-text-soft)]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <Users className="w-4 h-4 text-[var(--em-text-soft)]" />
                  <span className="text-[13px] font-bold text-[var(--em-ink)]">{item.envios} alunos enviaram</span>
                </div>

                {/* Footer Actions */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-2 pt-4 border-t border-[var(--em-border-strong)]">
                  <button onClick={() => notify(`Editando: ${item.titulo}`)} className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] hover:!border-[var(--em-ink)] !py-2 !px-0 justify-center !text-[12px]">
                    <Edit2 className="w-3.5 h-3.5 mr-1" /> Editar
                  </button>
                  <button onClick={() => notify(`${item.envios} envios encontrados para esta atividade.`)} className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] hover:!border-[var(--em-ink)] !py-2 !px-0 justify-center !text-[12px]">
                    <Eye className="w-3.5 h-3.5 mr-1" /> Ver envios
                  </button>
                  <button onClick={() => notify("Menu de opcoes aberto.")} className="w-9 h-9 rounded-xl border-[1.5px] border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-text-soft)] hover:border-[var(--em-ink)] hover:text-[var(--em-ink)]">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </AppLayout>
  );
}
