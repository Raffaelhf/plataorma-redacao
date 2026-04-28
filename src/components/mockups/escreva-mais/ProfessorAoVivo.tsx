"use client";

import { 
  Play, 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  X, 
  Bell, 
  Video, 
  BarChart, 
  Star
} from "lucide-react";
import { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./_group.css";

export function ProfessorAoVivo() {
  const [message, setMessage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  return (
    <AppLayout
      role="professor"
      userName="Pedro Lima"
      userEmail="pedro.lima@escrevamais.com"
      pageKicker="Aulas ao vivo · Outubro"
      pageTitle="Suas transmissões."
      primaryAction={{ label: "Agendar nova aula", onClick: () => document.getElementById("live-class-form")?.scrollIntoView({ behavior: "smooth", block: "start" }) }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)] lg:col-span-3">
            {message}
          </div>
        ) : null}
        
        {/* Left Column - Hero and Tabs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* HERO CARD */}
          <div className="relative overflow-hidden rounded-[var(--em-radius-card-lg)] bg-[var(--em-green)] border-[1.5px] border-[var(--em-ink)] shadow-[var(--em-shadow-hard)] p-8 md:p-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[var(--em-ink)] text-[var(--em-green)] px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase mb-6 border border-[var(--em-ink)]">
                Próxima aula que você vai dar
              </div>
              <h3 className="em-display text-[32px] md:text-[44px] text-[var(--em-ink)] leading-tight mb-4 max-w-xl">
                Repertório sociocultural — meio ambiente
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-[16px] font-bold text-[var(--em-ink)] mb-8">
                <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-lg border border-[var(--em-ink)]">
                  <Calendar className="w-5 h-5" /> Hoje
                </div>
                <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-lg border border-[var(--em-ink)]">
                  <Clock className="w-5 h-5" /> 19:00
                </div>
                <div className="flex items-center gap-1.5 bg-white/40 px-3 py-1.5 rounded-lg border border-[var(--em-ink)]">
                  <Users className="w-5 h-5" /> 47 confirmados
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button type="button" onClick={() => notify("Link da transmissão aberto em nova aba.")} className="w-full sm:w-auto bg-[var(--em-ink)] text-white border-2 border-[var(--em-ink)] rounded-xl px-8 py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-[#1a1c20] transition-colors shadow-[4px_4px_0_0_#0E0F12] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#0E0F12]">
                  <Play className="w-5 h-5 fill-current" /> Iniciar transmissão
                </button>
                <button type="button" onClick={() => document.getElementById("live-class-form")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="w-full sm:w-auto bg-transparent text-[var(--em-ink)] border-2 border-[var(--em-ink)] rounded-xl px-8 py-3.5 font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                  <Edit className="w-5 h-5" /> Editar agenda
                </button>
              </div>
            </div>

            {/* Decorative shapes */}
            <Star className="absolute top-6 right-6 w-24 h-24 text-[var(--em-coral)] opacity-90" strokeWidth={2} fill="currentColor" />
            <div className="absolute -bottom-10 right-20 w-40 h-40 border-[8px] border-[var(--em-ink)] rounded-full opacity-10" />
          </div>

          {/* STATS CARD */}
          <div className="em-card-hard p-6 bg-[var(--em-cream)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border-[1.5px] border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
                <BarChart className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[var(--em-text-soft)]">Resumo da semana</div>
                <div className="text-[16px] font-extrabold text-[var(--em-ink)]">4 aulas · 187 alunos atendidos</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-bold text-[var(--em-text-soft)] uppercase tracking-wider">NPS Médio</div>
              <div className="text-[28px] font-extrabold text-[var(--em-green-deep)]">8.7</div>
            </div>
          </div>

          {/* TABS */}
          <Tabs defaultValue="proximas" className="w-full">
            <TabsList className="bg-[var(--em-bg-alt)] border-[1.5px] border-[var(--em-border-strong)] p-1 rounded-xl w-full sm:w-auto mb-6">
              <TabsTrigger value="proximas" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[14px] px-6">Próximas</TabsTrigger>
              <TabsTrigger value="agora" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[14px] px-6">Acontecendo agora</TabsTrigger>
              <TabsTrigger value="anteriores" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-[14px] px-6">Anteriores</TabsTrigger>
            </TabsList>

            <TabsContent value="proximas" className="space-y-4">
              {[
                { data: "24 Out", hora: "14:00", tema: "Estrutura do texto dissertativo-argumentativo", inscritos: 124, color: "var(--em-peach)" },
                { data: "26 Out", hora: "19:00", tema: "Como argumentar com eficiência", inscritos: 89, color: "var(--em-lavender)" },
                { data: "28 Out", hora: "10:00", tema: "Aulão de véspera: possíveis temas", inscritos: 312, color: "var(--em-mint)" },
                { data: "01 Nov", hora: "18:30", tema: "Análise de redações nota 1000", inscritos: 156, color: "var(--em-yellow-soft)" },
                { data: "05 Nov", hora: "19:00", tema: "Técnicas de coesão avançadas", inscritos: 67, color: "var(--em-rose)" },
              ].map((aula, i) => (
                <div key={i} className="em-card-hard p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white group hover:border-[var(--em-ink)] transition-colors">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="shrink-0 w-14 h-14 rounded-xl border-[1.5px] border-[var(--em-ink)] flex flex-col items-center justify-center shadow-[2px_2px_0_0_#0E0F12]" style={{ backgroundColor: aula.color }}>
                      <span className="text-[14px] font-extrabold text-[var(--em-ink)] leading-none mb-0.5">{aula.data.split(' ')[0]}</span>
                      <span className="text-[10px] font-bold uppercase text-[var(--em-ink)]/70">{aula.data.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h4 className="text-[16px] sm:text-[18px] font-extrabold text-[var(--em-ink)] leading-tight mb-1">{aula.tema}</h4>
                      <div className="flex items-center gap-3 text-[13px] font-semibold text-[var(--em-text-soft)]">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {aula.hora}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {aula.inscritos} alunos</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button type="button" onClick={() => notify(`Editando aula: ${aula.tema}`)} className="p-2 rounded-lg border-[1.5px] border-[var(--em-border-strong)] text-[var(--em-text-soft)] hover:text-[var(--em-ink)] hover:border-[var(--em-ink)] bg-[var(--em-bg)]" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => notify(`Aula cancelada na visualização: ${aula.tema}`)} className="p-2 rounded-lg border-[1.5px] border-[var(--em-border-strong)] text-[var(--em-text-soft)] hover:text-[var(--em-coral)] hover:border-[var(--em-coral)] bg-[var(--em-bg)]" title="Cancelar">
                      <X className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => notify(`Lembrete enviado para ${aula.inscritos} alunos.`)} className="p-2 rounded-lg border-[1.5px] border-[var(--em-border-strong)] text-[var(--em-text-soft)] hover:text-[var(--em-green-deep)] hover:border-[var(--em-green-deep)] bg-[var(--em-bg)]" title="Enviar lembrete">
                      <Bell className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="agora" className="space-y-4">
              <div className="text-center py-12 px-4 border-2 border-dashed border-[var(--em-border-strong)] rounded-xl">
                <Video className="w-12 h-12 text-[var(--em-text-mute)] mx-auto mb-3" />
                <h3 className="text-[18px] font-bold text-[var(--em-ink)] mb-1">Nenhuma aula acontecendo agora</h3>
                <p className="text-[14px] text-[var(--em-text-soft)]">Sua próxima aula está agendada para hoje às 19:00.</p>
              </div>
            </TabsContent>

            <TabsContent value="anteriores" className="space-y-4">
               {[
                { tema: "Introdução e Tese matadoras", data: "18 Out", duracao: "1h 15m", presentes: "112/140", nota: "9.2" },
                { tema: "Citações coringa para qualquer tema", data: "15 Out", duracao: "55m", presentes: "89/100", nota: "8.9" },
                { tema: "Como não tangenciar o tema", data: "10 Out", duracao: "1h 05m", presentes: "210/250", nota: "9.5" },
              ].map((aula, i) => (
                <div key={i} className="em-card-hard p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <h4 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-2">{aula.tema}</h4>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[13px] font-semibold text-[var(--em-text-soft)]">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {aula.data}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {aula.duracao}</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {aula.presentes} presentes</span>
                      <span className="flex items-center gap-1 text-[var(--em-green-deep)]"><Star className="w-3.5 h-3.5 fill-current" /> Nota: {aula.nota}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button type="button" onClick={() => notify(`Gravação aberta: ${aula.tema}`)} className="px-4 py-2 text-[13px] font-bold text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] rounded-lg hover:bg-[var(--em-bg-alt)] transition-colors shadow-[2px_2px_0_0_#0E0F12]">
                      Ver gravação
                    </button>
                    <button type="button" onClick={() => notify(`Estatísticas abertas: ${aula.tema}`)} className="px-4 py-2 text-[13px] font-bold text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] rounded-lg hover:bg-[var(--em-bg-alt)] transition-colors shadow-[2px_2px_0_0_#0E0F12]">
                      Estatísticas
                    </button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

        </div>

        {/* Right Column - Form */}
        <div className="space-y-6">
          <div id="live-class-form" className="em-card-hard p-6 sm:p-8 bg-white sticky top-24">
            <div className="mb-6">
              <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-1">Agendar aula ao vivo</h3>
              <p className="text-[14px] text-[var(--em-text-soft)] font-medium">Preencha os dados para notificar seus alunos.</p>
            </div>

            <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); notify("Aula agendada e alunos notificados."); }}>
              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Título da aula</Label>
                <Input placeholder="Ex: Aulão de véspera" className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] font-medium" />
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Descrição (opcional)</Label>
                <textarea 
                  className="w-full min-h-[80px] p-3 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus:outline-none focus:border-[var(--em-ink)] bg-[var(--em-bg)] text-[14px] font-medium resize-none transition-colors"
                  placeholder="O que será abordado?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">Data</Label>
                  <Input type="date" className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] font-medium" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">Horário</Label>
                  <Input type="time" className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] font-medium" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Duração estimada</Label>
                <Select>
                  <SelectTrigger className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] font-medium bg-[var(--em-bg)]">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[1.5px] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="90">1h 30m</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Plataforma</Label>
                <Select defaultValue="zoom">
                  <SelectTrigger className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] font-medium bg-[var(--em-bg)]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[1.5px] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="meet">Google Meet</SelectItem>
                    <SelectItem value="jitsi">Jitsi</SelectItem>
                    <SelectItem value="youtube">YouTube Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Link da sala</Label>
                <Input placeholder="https://" className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] font-medium" />
              </div>

              <div className="space-y-3">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Capa (cor de destaque)</Label>
                <div className="flex gap-3">
                  {['var(--em-mint)', 'var(--em-peach)', 'var(--em-lavender)', 'var(--em-rose)', 'var(--em-yellow-soft)'].map((bg, i) => (
                    <button 
                      key={i} 
                      type="button"
                      onClick={() => setSelectedColor(i)}
                      className={`w-8 h-8 rounded-full border-[1.5px] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] hover:scale-110 transition-transform ${selectedColor === i ? 'ring-2 ring-offset-2 ring-[var(--em-ink)]' : ''}`}
                      style={{ backgroundColor: bg }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox id="notify" defaultChecked className="mt-0.5 border-[1.5px] border-[var(--em-ink)] data-[state=checked]:bg-[var(--em-ink)] rounded-[6px] w-5 h-5 shadow-[2px_2px_0_0_#0E0F12]" />
                <Label htmlFor="notify" className="text-[13px] font-medium text-[var(--em-text-soft)] cursor-pointer">
                  Notificar todos os alunos inscritos por e-mail sobre esta nova aula.
                </Label>
              </div>

              <div className="pt-4">
                <button type="submit" className="em-btn-primary w-full justify-center py-3.5 text-[15px]">
                  Agendar aula ao vivo
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
