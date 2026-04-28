"use client";

import { Play, Calendar as CalendarIcon, Clock, Users, Bell, ArrowRight, Video, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

export function AlunoAoVivo() {
  const [message, setMessage] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState("14");

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  const weekDays = [
    { day: "Seg", date: "13", active: false, classes: [] },
    { day: "Ter", date: "14", active: true, classes: [{ time: "19:00", title: "UERJ", color: "bg-[var(--em-mint)]" }] },
    { day: "Qua", date: "15", active: false, classes: [] },
    { day: "Qui", date: "16", active: false, classes: [{ time: "18:30", title: "Dúvidas", color: "bg-[var(--em-peach)]" }] },
    { day: "Sex", date: "17", active: false, classes: [{ time: "20:00", title: "Repertório", color: "bg-[var(--em-lavender)]" }] },
    { day: "Sáb", date: "18", active: false, classes: [{ time: "10:00", title: "Revisão", color: "bg-[var(--em-yellow)]" }] },
    { day: "Dom", date: "19", active: false, classes: [] },
  ];

  return (
    <AppLayout
      role="aluno"
      userName="Júlia Andrade"
      userEmail="julia.andrade@email.com"
      pageKicker="Aulas ao vivo · Esta semana"
      pageTitle="Não perca nenhuma aula."
      primaryAction={{ label: "Calendário completo", icon: <CalendarIcon className="w-4 h-4" />, onClick: () => notify("Calendário completo aberto.") }}
    >
      <div className="flex flex-col gap-10 pb-12">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}
        
        {/* HERO BLOCK - ACONTECENDO AGORA */}
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--em-green)] border-[2px] border-[var(--em-ink)] shadow-[var(--em-shadow-hard)] p-8 md:p-12">
          {/* Decorações do background */}
          <div className="absolute top-10 right-10 text-[var(--em-coral)] em-spin-slow opacity-90">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 8.5L23.5 11.5L14.59 14.5L12 23.5L9.41 14.5L0.5 11.5L9.41 8.5L12 0Z"/>
            </svg>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[40px] border-[var(--em-ink)] rounded-full opacity-5"></div>
          <div className="absolute inset-0 em-noise opacity-20 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[var(--em-ink)] text-[var(--em-green)] px-4 py-1.5 rounded-full text-[13px] font-extrabold uppercase tracking-widest border-2 border-[var(--em-ink)] mb-6 shadow-[4px_4px_0_0_#000]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--em-green)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--em-green)]"></span>
                </span>
                Acontecendo agora
              </div>
              
              <h2 className="em-display-xl text-[40px] md:text-[56px] text-[var(--em-ink)] leading-[1.05] mb-6">
                Repertório sociocultural — <br/> meio ambiente
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[15px] font-extrabold text-[var(--em-ink-soft)] bg-white/40 p-3 pr-6 rounded-2xl border-2 border-[var(--em-ink)] w-fit backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--em-ink)] overflow-hidden bg-white">
                    <img src="https://i.pravatar.cc/100?img=11" alt="Prof Pedro" className="w-full h-full object-cover" />
                  </div>
                  Prof. Pedro Lima
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] hidden md:block"></div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> 47 assistindo
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] hidden md:block"></div>
                <div className="flex items-center gap-2 text-[var(--em-coral)] drop-shadow-sm">
                  <Clock className="w-5 h-5" /> Ao vivo há 14 min
                </div>
              </div>
            </div>
            
            <div className="shrink-0 w-full lg:w-auto">
              <button type="button" onClick={() => notify("Entrando na aula ao vivo.")} className="w-full lg:w-auto bg-[var(--em-ink)] text-white border-[3px] border-[var(--em-ink)] rounded-[20px] px-10 py-5 font-extrabold text-[20px] flex items-center justify-center gap-3 hover:bg-[var(--em-ink-soft)] hover:-translate-y-1 shadow-[6px_6px_0_0_#FFF,8px_8px_0_0_#0E0F12] transition-all active:translate-y-[2px] active:shadow-[2px_2px_0_0_#FFF,4px_4px_0_0_#0E0F12]">
                <Play className="w-6 h-6 fill-current text-[var(--em-green)]" />
                Entrar na aula
              </button>
            </div>
            
          </div>
        </div>

        {/* ROW 2: Próximas Aulas & Rotina */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* PRÓXIMAS AULAS (2/3 width) */}
          <div className="xl:col-span-2 space-y-6">
            <h3 className="text-[24px] font-extrabold text-[var(--em-ink)]">Próximas aulas agendadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { title: "Redação UERJ: O que muda?", prof: "Prof. Lucas Mendes", date: "Amanhã", time: "19:00", bg: "bg-white", chipBg: "bg-[var(--em-mint)]" },
                { title: "Tira-dúvidas: Crise Climática", prof: "Profª. Ana Carolina", date: "Qui, 16 Out", time: "18:30", bg: "bg-white", chipBg: "bg-[var(--em-peach)]" },
                { title: "Revisão Geral ENEM 2026", prof: "Prof. Pedro Lima", date: "Sáb, 18 Out", time: "10:00", bg: "bg-[var(--em-cream)]", chipBg: "bg-[var(--em-yellow)]" },
              ].map((aula, i) => (
                <div key={i} className={`em-card-hard p-5 flex flex-col justify-between ${aula.bg}`}>
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2.5 py-1 rounded border border-[var(--em-ink)] text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] ${aula.chipBg}`}>
                        {aula.date} · {aula.time}
                      </div>
                    <button type="button" onClick={() => notify(`Opções abertas para ${aula.title}.`)} className="text-[var(--em-text-mute)] hover:text-[var(--em-ink)] transition-colors">
                      <MoreVertical />
                    </button>
                    </div>
                    
                    <h4 className="text-[18px] font-extrabold text-[var(--em-ink)] leading-tight mb-2 line-clamp-2">
                      {aula.title}
                    </h4>
                    
                    <p className="text-[13px] font-semibold text-[var(--em-text-soft)] mb-5">
                      {aula.prof}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-auto">
                    <button type="button" onClick={() => notify(`${aula.title} adicionada à agenda.`)} className="flex-1 text-[13px] font-extrabold text-[var(--em-ink)] bg-white border-2 border-[var(--em-ink)] rounded-xl py-2 hover:bg-[var(--em-bg-alt)] transition-colors">
                      Adicionar à agenda
                    </button>
                    <button type="button" onClick={() => notify(`Lembrete ativado para ${aula.title}.`)} className="w-10 h-10 shrink-0 bg-[var(--em-ink)] text-white border-2 border-[var(--em-ink)] rounded-xl flex items-center justify-center hover:bg-[var(--em-ink-soft)] transition-colors">
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add New/Explore Card */}
              <button type="button" onClick={() => notify("Calendário mensal aberto.")} className="em-card-hard p-5 bg-[var(--em-bg-alt)] border-dashed border-2 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-white transition-colors">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-[var(--em-border-strong)] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-[var(--em-text-soft)]" />
                </div>
                <div>
                  <h4 className="text-[15px] font-extrabold text-[var(--em-ink)]">Explorar calendário</h4>
                  <p className="text-[13px] font-medium text-[var(--em-text-soft)] mt-1">Veja todas as aulas do mês</p>
                </div>
              </button>
            </div>
          </div>
          
          {/* ROTINA DA SEMANA & HISTÓRICO (1/3 width) */}
          <div className="space-y-6">
            
            {/* Rotina Mini-calendar */}
            <div className="em-card-hard p-6 bg-white">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-4">Sua semana</h3>
              
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {weekDays.map((d, i) => (
                  <button type="button" onClick={() => setSelectedDay(d.date)} key={i} className={`flex flex-col items-center shrink-0 w-[45px] py-3 rounded-full border-2 transition-colors ${selectedDay === d.date ? 'bg-[var(--em-ink)] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]' : 'bg-white border-[var(--em-border-strong)] hover:border-[var(--em-ink)]'}`}>
                    <span className={`text-[10px] font-extrabold uppercase mb-1 ${selectedDay === d.date ? 'text-white/70' : 'text-[var(--em-text-soft)]'}`}>{d.day}</span>
                    <span className={`text-[16px] font-extrabold leading-none mb-2 ${selectedDay === d.date ? 'text-white' : 'text-[var(--em-ink)]'}`}>{d.date}</span>
                    
                    <div className="flex flex-col gap-1 mt-1">
                      {d.classes.length > 0 ? (
                        d.classes.map((c, j) => (
                          <div key={j} className={`w-2.5 h-2.5 rounded-full ${c.color} border border-[var(--em-ink)]`}></div>
                        ))
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--em-border)]"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aulas anteriores pastel */}
            <div className="em-card-hard p-6 bg-[var(--em-lavender)]">
              <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-4">Aulas que você assistiu</h3>
              
              <div className="space-y-3">
                {[
                  { title: "Módulo 2: O desenvolvimento", duration: "1h 12m", type: "Revisão", icon: Video },
                  { title: "Plantão de Gramática", duration: "45m", type: "Dúvidas", icon: Users },
                  { title: "Análise de Redação Nota 1000", duration: "58m", type: "Prática", icon: FileText },
                ].map((aula, i) => {
                  const Icon = aula.icon;
                  return (
                    <button type="button" onClick={() => notify(`Reprodução aberta: ${aula.title}`)} key={i} className="w-full bg-white border border-[var(--em-ink)] rounded-xl p-3 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#0E0F12] transition-all cursor-pointer text-left">
                      <div className="w-10 h-10 rounded-lg bg-[var(--em-bg-alt)] border border-[var(--em-border-strong)] grid place-items-center shrink-0">
                        <Icon className="w-5 h-5 text-[var(--em-text-soft)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-extrabold text-[var(--em-ink)] truncate">{aula.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--em-text-soft)] mt-0.5">
                          <span className="bg-[var(--em-bg)] px-1.5 rounded">{aula.type}</span>
                          <span>·</span>
                          <span>{aula.duration}</span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[var(--em-green-deep)] shrink-0" />
                    </button>
                  )
                })}
              </div>
              
              <button type="button" onClick={() => notify("Histórico completo aberto.")} className="w-full mt-4 flex items-center justify-center gap-2 text-[13px] font-extrabold text-[var(--em-ink)] py-2 border-2 border-[var(--em-ink)] rounded-xl hover:bg-white transition-colors">
                Ver histórico completo <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}

// Helper icon component for MoreVertical
function MoreVertical() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
    </svg>
  );
}
