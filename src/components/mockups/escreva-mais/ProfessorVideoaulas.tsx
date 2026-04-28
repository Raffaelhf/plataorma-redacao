"use client";

import { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";
import {
  PlayCircle,
  Users,
  Settings,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Video,
  GripVertical,
  Edit2,
  Trash2,
  Eye,
  BarChart2,
  Clock,
  FolderOpen
} from "lucide-react";

const TURMAS = [
  {
    id: 1,
    titulo: "ENEM Essencial — Redação do Zero",
    descricao: "Curso completo abordando as 5 competências do ENEM com foco em alunos iniciantes.",
    alunos: 84,
    aulas: 12,
    status: "Publicado",
    bg: "var(--em-mint)",
    iconColor: "var(--em-green-deep)",
    expanded: true,
    modulos: [
      {
        id: 101,
        titulo: "Módulo 1: Estrutura Dissertativa",
        aulas: [
          { id: 1001, titulo: "Introdução e Tese", duracao: "15:20", views: 82, thumb: "var(--em-green-soft)" },
          { id: 1002, titulo: "Desenvolvimento 1 e 2", duracao: "22:45", views: 76, thumb: "var(--em-green-soft)" },
          { id: 1003, titulo: "Conclusão e Proposta", duracao: "18:30", views: 70, thumb: "var(--em-green-soft)" },
        ]
      },
      {
        id: 102,
        titulo: "Módulo 2: Competência I e II",
        aulas: [
          { id: 1004, titulo: "Desvios gramaticais comuns", duracao: "12:15", views: 65, thumb: "var(--em-peach)" },
          { id: 1005, titulo: "Fuga ao tema vs Tangenciamento", duracao: "20:00", views: 58, thumb: "var(--em-peach)" },
        ]
      }
    ]
  },
  {
    id: 2,
    titulo: "Fuvest 2ª Fase — Aprofundamento",
    descricao: "Treinamento intensivo para a prova discursiva da USP, com foco em repertório e argumentação crítica.",
    alunos: 42,
    aulas: 8,
    status: "Publicado",
    bg: "var(--em-lavender)",
    iconColor: "var(--em-lavender-deep)",
    expanded: true,
    modulos: [
      {
        id: 201,
        titulo: "Módulo Único: Temas Filosóficos",
        aulas: [
          { id: 2001, titulo: "Como a Fuvest cobra filosofia?", duracao: "25:10", views: 40, thumb: "var(--em-lavender-deep)" },
          { id: 2002, titulo: "Análise de redações nota máxima", duracao: "30:45", views: 38, thumb: "var(--em-lavender-deep)" },
        ]
      }
    ]
  },
  {
    id: 3,
    titulo: "Repertório Sociocultural na Prática",
    descricao: "Como usar filmes, séries, livros e alusões históricas sem parecer forçado.",
    alunos: 126,
    aulas: 15,
    status: "Rascunho",
    bg: "var(--em-peach)",
    iconColor: "var(--em-peach-deep)",
    expanded: true,
    modulos: [
      {
        id: 301,
        titulo: "Módulo 1: Cultura Pop",
        aulas: [
          { id: 3001, titulo: "Black Mirror e Tecnologia", duracao: "18:20", views: 0, thumb: "var(--em-coral)" },
          { id: 3002, titulo: "O Poço e a desigualdade", duracao: "16:40", views: 0, thumb: "var(--em-coral)" },
        ]
      },
      {
        id: 302,
        titulo: "Módulo 2: História do Brasil",
        aulas: [
          { id: 3003, titulo: "Era Vargas e Direitos Trabalhistas", duracao: "21:15", views: 0, thumb: "var(--em-yellow-deep)" },
        ]
      }
    ]
  },
  {
    id: 4,
    titulo: "Unicamp — Gêneros Textuais",
    descricao: "Preparação específica para os gêneros textuais cobrados pela banca da Unicamp.",
    alunos: 55,
    aulas: 6,
    status: "Publicado",
    bg: "var(--em-rose)",
    iconColor: "var(--em-rose-deep)",
    expanded: false,
    modulos: []
  },
  {
    id: 5,
    titulo: "Gramática Aplicada à Redação",
    descricao: "Regras gramaticais essenciais focadas nos erros mais comuns cometidos em redações.",
    alunos: 0,
    aulas: 0,
    status: "Rascunho",
    bg: "var(--em-mute)",
    iconColor: "var(--em-text-mute)",
    expanded: false,
    modulos: []
  }
];

export function ProfessorVideoaulas() {
  const [turmas, setTurmas] = useState(TURMAS);

  const toggleExpanded = (id: number) => {
    setTurmas(turmas.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));
  };

  return (
    <AppLayout
      role="professor"
      userName="Pedro Lima"
      userEmail="pedro.lima@escrevamais.com"
      pageKicker="Conteúdo · Sua biblioteca"
      pageTitle="Organize suas turmas."
      primaryAction={{ label: "Nova turma" }}
    >
      <div className="space-y-8 pb-20 md:pb-0">
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="em-card-hard p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--em-bg-alt)] border border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-ink)]">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div className="text-[14px] font-bold text-[var(--em-text-soft)]">Turmas</div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">5</div>
          </div>
          <div className="em-card-hard p-5 bg-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--em-bg-alt)] border border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-ink)]">
                <Settings className="w-4 h-4" />
              </div>
              <div className="text-[14px] font-bold text-[var(--em-text-soft)]">Módulos</div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">18</div>
          </div>
          <div className="em-card-hard p-5 bg-[var(--em-cream)]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--em-mint)] border border-[var(--em-ink)] flex items-center justify-center text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                <PlayCircle className="w-4 h-4" />
              </div>
              <div className="text-[14px] font-bold text-[var(--em-text-soft)]">Aulas publicadas</div>
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">62</div>
          </div>
        </div>

        {/* LISTA DE TURMAS */}
        <div className="space-y-6">
          {turmas.map(turma => (
            <div key={turma.id} className="em-card-hard bg-white flex flex-col overflow-hidden transition-all duration-300">
              
              {/* Header da Turma */}
              <div className="relative">
                <div className="h-16 absolute top-0 inset-x-0 border-b border-[var(--em-ink)]" style={{ backgroundColor: turma.bg }} />
                
                <div className="relative pt-8 px-6 pb-6 z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white border-[1.5px] border-[var(--em-ink)] flex items-center justify-center shadow-[4px_4px_0_0_#0E0F12]">
                      <Video className="w-6 h-6" style={{ color: turma.iconColor }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                          turma.status === "Publicado" ? "bg-[var(--em-green-soft)] text-[var(--em-green-deep)] border-[var(--em-green)]" :
                          "bg-[var(--em-cream)] text-[var(--em-text-soft)] border-[var(--em-border-strong)]"
                        }`}>
                          {turma.status}
                        </span>
                        <span className="text-[12px] font-bold text-[var(--em-text-soft)] flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> {turma.alunos} alunos
                        </span>
                        <span className="text-[12px] font-bold text-[var(--em-text-soft)] flex items-center gap-1.5">
                          <PlayCircle className="w-3.5 h-3.5" /> {turma.aulas} aulas
                        </span>
                      </div>
                      <h3 className="text-[22px] font-extrabold text-[var(--em-ink)] leading-tight mb-2">
                        {turma.titulo}
                      </h3>
                      <p className="text-[14px] font-medium text-[var(--em-text-soft)] max-w-2xl">
                        {turma.descricao}
                      </p>
                    </div>
                  </div>

                  {/* Ações da Turma */}
                  <div className="flex items-center gap-2 shrink-0 md:self-end">
                    <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] hover:!border-[var(--em-ink)] !py-2 !px-3 !text-[13px] bg-[var(--em-bg)]">
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] hover:!border-[var(--em-ink)] !py-2 !px-3 !text-[13px] bg-[var(--em-bg)]">
                      <Plus className="w-4 h-4 mr-1" /> Módulo
                    </button>
                    <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] hover:!border-[var(--em-ink)] !py-2 !px-3 !text-[13px] bg-[var(--em-bg)]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleExpanded(turma.id)}
                      className="w-10 h-10 rounded-xl border-[1.5px] border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-ink)] hover:bg-[var(--em-bg-alt)] bg-[var(--em-bg)] transition-colors"
                    >
                      {turma.expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                  
                </div>
              </div>

              {/* Módulos Expandidos */}
              {turma.expanded && (
                <div className="border-t border-[var(--em-border-strong)] bg-[var(--em-bg)] p-6">
                  {turma.modulos.length > 0 ? (
                    <div className="space-y-6">
                      {turma.modulos.map(mod => (
                        <div key={mod.id} className="bg-white rounded-[16px] border border-[var(--em-border-strong)] overflow-hidden">
                          <div className="bg-[var(--em-cream)] px-5 py-3 border-b border-[var(--em-border-strong)] flex items-center justify-between">
                            <h4 className="text-[15px] font-extrabold text-[var(--em-ink)] flex items-center gap-2">
                              <GripVertical className="w-4 h-4 text-[var(--em-text-mute)] cursor-grab" />
                              {mod.titulo}
                            </h4>
                            <div className="flex items-center gap-2">
                              <button className="text-[12px] font-bold text-[var(--em-ink)] hover:text-[var(--em-green-deep)] bg-white px-2 py-1 rounded-md border border-[var(--em-border-strong)] shadow-[1px_1px_0_0_#0E0F12]">
                                + Aula
                              </button>
                              <button className="text-[var(--em-text-mute)] hover:text-[var(--em-ink)]"><MoreVertical className="w-4 h-4" /></button>
                            </div>
                          </div>
                          
                          <div className="divide-y divide-[var(--em-border-strong)]">
                            {mod.aulas.map(aula => (
                              <div key={aula.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[var(--em-bg-alt)] transition-colors group">
                                <GripVertical className="w-4 h-4 text-[var(--em-text-mute)] cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="w-16 h-10 rounded-lg border border-[var(--em-ink)] flex items-center justify-center shrink-0 relative overflow-hidden" style={{ backgroundColor: aula.thumb }}>
                                  <PlayCircle className="w-4 h-4 text-white opacity-80" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="text-[14px] font-bold text-[var(--em-ink)] truncate">{aula.titulo}</div>
                                  <div className="flex items-center gap-3 text-[11px] font-semibold text-[var(--em-text-soft)] mt-0.5">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {aula.duracao}</span>
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {aula.views} views</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="w-8 h-8 rounded-md hover:bg-white border border-transparent hover:border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-text-soft)] hover:text-[var(--em-ink)]">
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button className="w-8 h-8 rounded-md hover:bg-white border border-transparent hover:border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-text-soft)] hover:text-[var(--em-coral)]">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-white border border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-text-mute)] mx-auto mb-3">
                        <Video className="w-5 h-5" />
                      </div>
                      <p className="text-[14px] font-bold text-[var(--em-text-soft)] mb-3">Nenhum módulo criado ainda.</p>
                      <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] bg-white !py-2 !text-[13px] mx-auto">
                        <Plus className="w-4 h-4 mr-1" /> Adicionar primeiro módulo
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Floating Action Button (Mobile Only) */}
        <button className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--em-yellow)] border-2 border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12] flex items-center justify-center text-[var(--em-ink)] z-50">
          <Plus className="w-6 h-6" strokeWidth={3} />
        </button>

      </div>
    </AppLayout>
  );
}
