"use client";

import { useState } from "react";
import { PlayCircle, Video, ChevronDown, CheckCircle2, Clock, Calendar, LayoutGrid } from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

export function AlunoVideoaulas() {
  const [openModules, setOpenModules] = useState<number[]>([1, 2, 3]);

  const toggleModule = (id: number) => {
    setOpenModules(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const modules = [
    {
      id: 1,
      title: "ENEM Essencial — Redação do Zero",
      progress: 8,
      total: 12,
      badge: "var(--em-mint)",
      lessons: [
        { id: 101, title: "Compreendendo a proposta e os textos motivadores", duration: "15min", status: "assistida", thumbBg: "var(--em-mint)" },
        { id: 102, title: "Estrutura do dissertativo-argumentativo", duration: "22min", status: "assistida", thumbBg: "var(--em-peach)" },
        { id: 103, title: "Projeto de texto perfeito (A introdução)", duration: "18min", status: "em andamento", thumbBg: "var(--em-lavender)" },
        { id: 104, title: "Desenvolvimento 1: Tópico frasal e repertório", duration: "25min", status: "não iniciada", thumbBg: "var(--em-rose)" },
      ]
    },
    {
      id: 2,
      title: "Fuvest 2026 — Repertório Cultural",
      progress: 3,
      total: 8,
      badge: "var(--em-peach)",
      lessons: [
        { id: 201, title: "O que a banca da Fuvest espera de você", duration: "12min", status: "assistida", thumbBg: "var(--em-yellow-soft)" },
        { id: 202, title: "Análise de obras literárias obrigatórias", duration: "34min", status: "em andamento", thumbBg: "var(--em-mint)" },
        { id: 203, title: "Filosofia e Sociologia aplicadas ao tema", duration: "28min", status: "não iniciada", thumbBg: "var(--em-peach)" },
      ]
    },
    {
      id: 3,
      title: "Argumentação Avançada",
      progress: 0,
      total: 6,
      badge: "var(--em-lavender)",
      lessons: [
        { id: 301, title: "Evitando o senso comum", duration: "16min", status: "não iniciada", thumbBg: "var(--em-lavender)" },
        { id: 302, title: "Conectivos de alto valor", duration: "14min", status: "não iniciada", thumbBg: "var(--em-rose)" },
      ]
    },
    {
      id: 4,
      title: "Competência 5: Proposta de Intervenção",
      progress: 0,
      total: 5,
      badge: "var(--em-yellow-soft)",
      lessons: []
    },
    {
      id: 5,
      title: "Análise de Redações Nota 1000",
      progress: 0,
      total: 10,
      badge: "var(--em-mint)",
      lessons: []
    }
  ];

  return (
    <AppLayout
      role="aluno"
      userName="Júlia Andrade"
      userEmail="julia.andrade@email.com"
      pageKicker="Videoaulas · 12 turmas"
      pageTitle="Aprenda no seu ritmo."
      primaryAction={{ label: "Continuar última aula", icon: <PlayCircle className="w-4 h-4" /> }}
    >
      <div className="flex flex-col xl:flex-row gap-8 pb-12">
        
        {/* MAIN AREA */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="em-card-hard p-5 bg-[var(--em-mint)] flex items-center justify-between">
              <div>
                <div className="text-[14px] font-extrabold text-[var(--em-ink)] mb-1">Turmas matriculadas</div>
                <div className="em-display text-[32px] text-[var(--em-ink)] leading-none">12</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <LayoutGrid className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
            </div>
            
            <div className="em-card-hard p-5 bg-[var(--em-peach)] flex items-center justify-between">
              <div>
                <div className="text-[14px] font-extrabold text-[var(--em-ink)] mb-1">Módulos concluídos</div>
                <div className="em-display text-[32px] text-[var(--em-ink)] leading-none">38</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <CheckCircle2 className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
            </div>
            
            <div className="em-card-hard p-5 bg-[var(--em-lavender)] flex items-center justify-between">
              <div>
                <div className="text-[14px] font-extrabold text-[var(--em-ink)] mb-1">Aulas disponíveis</div>
                <div className="em-display text-[32px] text-[var(--em-ink)] leading-none">147</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white border-2 border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <Video className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
            </div>
          </div>

          {/* TRILHA LIST */}
          <div className="space-y-4 relative">
            {/* Desktop visual line connector */}
            <div className="hidden md:block absolute left-6 top-8 bottom-8 w-1 bg-[var(--em-border-strong)] z-0"></div>

            {modules.map((mod) => {
              const isOpen = openModules.includes(mod.id);
              const isComplete = mod.progress === mod.total;
              
              return (
                <div key={mod.id} className="relative z-10">
                  {/* Trilha Dot (Desktop) */}
                  <div className="hidden md:flex absolute -left-6 top-6 w-8 h-8 rounded-full border-4 border-[var(--em-bg)] bg-[var(--em-ink)] z-20 items-center justify-center transform -translate-x-[2px]">
                    <div className={`w-2.5 h-2.5 rounded-full ${isComplete ? 'bg-[var(--em-green)]' : 'bg-[var(--em-yellow)]'}`}></div>
                  </div>

                  <div className="em-card-hard bg-white overflow-hidden ml-0 md:ml-10 transition-all duration-300">
                    
                    {/* Header */}
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-[var(--em-bg-alt)] transition-colors select-none"
                      onClick={() => toggleModule(mod.id)}
                    >
                      <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-8 rounded-md border-2 border-[var(--em-ink)]" style={{ background: mod.badge }}></div>
                          <h3 className="text-[18px] md:text-[20px] font-extrabold text-[var(--em-ink)] leading-tight">{mod.title}</h3>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3 md:ml-auto w-full md:w-64 shrink-0">
                          <div className="text-[13px] font-bold text-[var(--em-text-soft)] min-w-[40px]">
                            {mod.progress}/{mod.total}
                          </div>
                          <div className="h-2.5 flex-1 bg-[var(--em-bg)] rounded-full border border-[var(--em-border-strong)] overflow-hidden">
                            <div 
                              className={`h-full border-r border-[var(--em-ink)] ${isComplete ? 'bg-[var(--em-green)]' : 'bg-[var(--em-yellow)]'}`}
                              style={{ width: `${(mod.progress / mod.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-8 h-8 rounded-full border-2 border-[var(--em-border-strong)] flex items-center justify-center text-[var(--em-ink)] shrink-0 transition-transform">
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    {/* Content (Lessons) */}
                    {isOpen && mod.lessons.length > 0 && (
                      <div className="border-t-2 border-[var(--em-ink)] bg-[var(--em-cream)] p-5 md:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mod.lessons.map((lesson) => (
                            <div key={lesson.id} className="group bg-white border-2 border-[var(--em-ink)] rounded-xl p-3 flex items-start gap-4 hover:shadow-[4px_4px_0_0_#0E0F12] hover:-translate-y-1 transition-all cursor-pointer">
                              
                              <div className="w-24 md:w-32 aspect-video rounded-lg border-2 border-[var(--em-ink)] overflow-hidden relative shrink-0" style={{ background: lesson.thumbBg }}>
                                <div className="absolute inset-0 em-noise opacity-30 mix-blend-multiply"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                                  <PlayCircle className="w-8 h-8 text-white fill-black" />
                                </div>
                                {/* Mock play icon for default state */}
                                <div className="absolute bottom-1 right-1 bg-[var(--em-ink)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/20">
                                  {lesson.duration}
                                </div>
                              </div>
                              
                              <div className="flex-1 py-1">
                                <h4 className="text-[14px] md:text-[15px] font-extrabold text-[var(--em-ink)] leading-tight mb-2 group-hover:text-[var(--em-green-deep)] transition-colors line-clamp-2">
                                  {lesson.title}
                                </h4>
                                
                                <div className="flex items-center">
                                  {lesson.status === "assistida" && (
                                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-[var(--em-green-deep)] uppercase tracking-wide">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Concluída
                                    </span>
                                  )}
                                  {lesson.status === "em andamento" && (
                                    <span className="flex items-center gap-1 text-[11px] font-extrabold text-[#B86C2C] uppercase tracking-wide bg-[var(--em-peach)] px-2 py-0.5 rounded-full border border-[#B86C2C]/20">
                                      Em andamento
                                    </span>
                                  )}
                                  {lesson.status === "não iniciada" && (
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-[var(--em-text-mute)] uppercase tracking-wide">
                                      <Clock className="w-3.5 h-3.5" /> {lesson.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="w-full xl:w-[320px] shrink-0">
          <div className="sticky top-28 space-y-6">
            
            {/* Continue Widget */}
            <div className="em-card-hard p-6 bg-white border-b-[6px] border-b-[var(--em-yellow)]">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-[var(--em-green-deep)]" />
                Continue de onde parou
              </h3>
              
              <div className="w-full aspect-video rounded-xl border-2 border-[var(--em-ink)] mb-4 relative overflow-hidden bg-[var(--em-lavender)] group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-50" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full border-2 border-[var(--em-ink)] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[4px_4px_0_0_#0E0F12]">
                    <PlayCircle className="w-7 h-7 text-[var(--em-ink)]" fill="var(--em-green)" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[var(--em-ink)]/20">
                  <div className="h-full bg-[var(--em-yellow)] w-[45%] border-r-2 border-[var(--em-ink)]"></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-[12px] font-bold text-[var(--em-text-soft)] mb-1">Módulo 1: Redação do zero</div>
                <div className="text-[15px] font-extrabold text-[var(--em-ink)] leading-tight">Projeto de texto perfeito (A introdução)</div>
              </div>
              
              <button className="em-btn-primary w-full justify-center">
                Retomar aula
              </button>
            </div>
            
            {/* Próximas ao vivo */}
            <div className="em-card-hard p-6 bg-[var(--em-bg-alt)]">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--em-ink)]" />
                Agendadas
              </h3>
              
              <div className="space-y-3">
                <div className="bg-white border-2 border-[var(--em-border-strong)] rounded-xl p-3 flex gap-3">
                  <div className="w-12 shrink-0 flex flex-col items-center justify-center bg-[var(--em-mint)] border-2 border-[var(--em-ink)] rounded-lg py-1 shadow-[2px_2px_0_0_#0E0F12]">
                    <span className="text-[10px] font-bold uppercase text-[var(--em-ink)]">Ter</span>
                    <span className="text-[16px] font-extrabold text-[var(--em-ink)] leading-none">14</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold text-[var(--em-ink)] leading-tight mb-1">Redação UERJ: O que muda?</div>
                    <div className="text-[11px] font-bold text-[var(--em-text-soft)]">19h00 · Prof. Lucas</div>
                  </div>
                </div>
                
                <div className="bg-white border-2 border-[var(--em-border-strong)] rounded-xl p-3 flex gap-3">
                  <div className="w-12 shrink-0 flex flex-col items-center justify-center bg-[var(--em-peach)] border-2 border-[var(--em-ink)] rounded-lg py-1 shadow-[2px_2px_0_0_#0E0F12]">
                    <span className="text-[10px] font-bold uppercase text-[var(--em-ink)]">Qui</span>
                    <span className="text-[16px] font-extrabold text-[var(--em-ink)] leading-none">16</span>
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold text-[var(--em-ink)] leading-tight mb-1">Tira-dúvidas: Crise Climática</div>
                    <div className="text-[11px] font-bold text-[var(--em-text-soft)]">18h30 · Profª. Ana</div>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 text-[13px] font-bold text-[var(--em-ink)] border-2 border-[var(--em-border-strong)] rounded-xl py-2 hover:bg-white hover:border-[var(--em-ink)] transition-colors">
                Ver calendário
              </button>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}
