"use client";

import Link from "next/link";
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Download, Eye, Upload, RefreshCw } from "lucide-react";
import { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";

type EnviosStatus = "Todas" | "Em correção" | "Corrigidas" | "Devolvidas";

export function AlunoEnvios() {
  const [activeTab, setActiveTab] = useState<EnviosStatus>("Todas");
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [message, setMessage] = useState<string | null>(null);

  function notify(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }

  const envios = [
    { id: 1, data: "12 Out 2026", tema: "Caminhos para combater a intolerância religiosa no Brasil", status: "Corrigida", nota: 920, isRecent: true },
    { id: 2, data: "05 Out 2026", tema: "Os impactos da inteligência artificial no mercado de trabalho", status: "Em correção", nota: null, isRecent: false },
    { id: 3, data: "28 Set 2026", tema: "A democratização do acesso ao cinema no Brasil", status: "Corrigida", nota: 880, isRecent: false },
    { id: 4, data: "21 Set 2026", tema: "Desafios para a valorização de comunidades tradicionais", status: "Corrigida", nota: 840, isRecent: false },
    { id: 5, data: "14 Set 2026", tema: "O estigma associado às doenças mentais na sociedade", status: "Devolvida", nota: null, isRecent: false },
    { id: 6, data: "07 Set 2026", tema: "Manipulação do comportamento do usuário pelo controle de dados", status: "Corrigida", nota: 900, isRecent: false },
    { id: 7, data: "31 Ago 2026", tema: "Desafios para a formação educacional de surdos", status: "Corrigida", nota: 860, isRecent: false },
    { id: 8, data: "24 Ago 2026", tema: "Caminhos para combater o racismo estrutural", status: "Corrigida", nota: 820, isRecent: false },
  ];

  return (
    <AppLayout
      role="aluno"
      userName="Júlia Andrade"
      userEmail="julia.andrade@email.com"
      pageKicker="Meus envios · 24 redações"
      pageTitle="Sua jornada em PDF."
      primaryAction={{ label: "Enviar nova redação", href: "/atividades" }}
    >
      <div className="space-y-8">
        {message ? (
          <div className="em-card-hard bg-[var(--em-mint)] px-4 py-3 text-sm font-extrabold text-[var(--em-ink)]">
            {message}
          </div>
        ) : null}
        
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="em-card-hard p-5 bg-[var(--em-mint)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-extrabold text-[var(--em-ink)]">Total enviadas</span>
              <FileText className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">24</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-lavender)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-extrabold text-[var(--em-ink)]">Já corrigidas</span>
              <CheckCircle2 className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">18</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-peach)] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-extrabold text-[var(--em-ink)]">Em correção</span>
              <Clock className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-ink)]">3</div>
          </div>
          
          <div className="em-card-hard p-5 bg-[var(--em-muted)] flex flex-col justify-between border-dashed border-[2px]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-extrabold text-[var(--em-text-soft)]">Aguardando envio</span>
              <Upload className="w-5 h-5 text-[var(--em-text-soft)]" />
            </div>
            <div className="em-display text-[42px] text-[var(--em-text-soft)]">3</div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {(["Todas", "Em correção", "Corrigidas", "Devolvidas"] as EnviosStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`em-chip shrink-0 transition-all ${
                activeTab === tab 
                  ? "bg-[var(--em-ink)] text-white border-[var(--em-ink)] shadow-[2px_2px_0_0_#2BD37B]" 
                  : "bg-white hover:bg-[var(--em-bg-alt)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LISTA DE ENVIOS */}
        <div className="space-y-4">
          {envios.filter((e) => {
            if (activeTab === "Todas") return true;
            if (activeTab === "Corrigidas") return e.status === "Corrigida";
            if (activeTab === "Devolvidas") return e.status === "Devolvida";
            return e.status === activeTab;
          }).map((envio) => {
            const isExpanded = expandedId === envio.id;
            
            return (
              <div key={envio.id} className="em-card-hard bg-white overflow-hidden transition-all duration-300">
                <div 
                  className="p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-[var(--em-bg)] transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : envio.id)}
                >
                  {/* Thumb Placeholder */}
                  <div className="hidden md:flex w-12 h-16 bg-[var(--em-cream)] border border-[var(--em-border-strong)] rounded flex-col items-center justify-center text-[8px] font-bold text-[var(--em-text-mute)] shrink-0">
                    <FileText className="w-5 h-5 mb-1 opacity-50" />
                    PDF
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[12px] font-bold text-[var(--em-text-soft)]">{envio.data}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border border-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12] ${
                        envio.status === "Corrigida" ? "bg-[var(--em-green-soft)] text-[var(--em-green-deep)]" :
                        envio.status === "Em correção" ? "bg-[var(--em-peach)] text-[var(--em-peach-deep)]" :
                        "bg-[var(--em-rose)] text-[var(--em-rose-deep)]"
                      }`}>
                        {envio.status}
                      </span>
                    </div>
                    <h3 className="text-[16px] md:text-[18px] font-extrabold text-[var(--em-ink)] leading-tight truncate">{envio.tema}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full pt-3 md:pt-0 border-t border-[var(--em-border)] md:border-t-0">
                    {envio.nota ? (
                      <div className="flex items-baseline gap-1 bg-[var(--em-green-soft)] px-4 py-2 rounded-full border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                        <span className="text-[20px] font-extrabold text-[var(--em-ink)]">{envio.nota}</span>
                        <span className="text-[12px] font-bold text-[var(--em-ink)]/60">/1000</span>
                      </div>
                    ) : (
                      <div className="text-[14px] font-bold text-[var(--em-text-mute)] px-4 py-2">-- /1000</div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={(event) => { event.stopPropagation(); notify(envio.status === "Corrigida" ? `Correção aberta: ${envio.tema}` : `Status atualizado: ${envio.tema}`); }} className="p-2 text-[var(--em-ink)] bg-[var(--em-bg)] border border-[var(--em-ink)] rounded-lg hover:bg-[var(--em-yellow)] transition-colors">
                        {envio.status === "Corrigida" ? <Eye className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                      </button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); setExpandedId(isExpanded ? null : envio.id); }} className="p-2 text-[var(--em-ink)] hover:bg-[var(--em-bg)] rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDED CONTENT (LATEST CORRECTED) */}
                {isExpanded && envio.status === "Corrigida" && (
                  <div className="border-t border-[var(--em-ink)] bg-[var(--em-bg)] p-6 md:p-8 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left: Score & Competencies */}
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12] text-center">
                          <div className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--em-text-soft)] mb-2">Nota Geral</div>
                          <div className="em-display text-[64px] text-[var(--em-ink)] leading-none text-center">
                            {envio.nota} <span className="text-[24px] text-[var(--em-text-mute)]">/1000</span>
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-2xl border border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12] space-y-4">
                          <h4 className="font-extrabold text-[14px] text-[var(--em-ink)] uppercase tracking-wider mb-2">Competências</h4>
                          {[
                            { label: "1. Norma culta", nota: 180, cor: "bg-[var(--em-green)]" },
                            { label: "2. Compreensão tema", nota: 200, cor: "bg-[var(--em-mint-deep)]" },
                            { label: "3. Argumentação", nota: 200, cor: "bg-[var(--em-mint-deep)]" },
                            { label: "4. Coesão/coerência", nota: 180, cor: "bg-[var(--em-green)]" },
                            { label: "5. Proposta intervenção", nota: 160, cor: "bg-[var(--em-yellow)]" },
                          ].map((comp, i) => (
                            <div key={i}>
                              <div className="flex justify-between text-[13px] font-bold text-[var(--em-ink)] mb-1">
                                <span>{comp.label}</span>
                                <span>{comp.nota}/200</span>
                              </div>
                              <div className="h-2.5 w-full bg-[var(--em-bg)] border border-[var(--em-ink)] rounded-full overflow-hidden">
                                <div className={`h-full ${comp.cor} border-r border-[var(--em-ink)]`} style={{ width: `${(comp.nota/200)*100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Feedback */}
                      <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-[var(--em-mint)] p-6 rounded-2xl border border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                            <h4 className="font-extrabold text-[16px] text-[var(--em-ink)] mb-4 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-[var(--em-green-deep)]" /> Pontos Fortes
                            </h4>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] mt-1.5 shrink-0" />
                                Excelente repertório sociocultural utilizando Zygmunt Bauman.
                              </li>
                              <li className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] mt-1.5 shrink-0" />
                                Argumentação bem estruturada nos desenvolvimentos.
                              </li>
                              <li className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] mt-1.5 shrink-0" />
                                Domínio da norma padrão, com raras falhas de pontuação.
                              </li>
                            </ul>
                          </div>

                          <div className="bg-[var(--em-peach)] p-6 rounded-2xl border border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                            <h4 className="font-extrabold text-[16px] text-[var(--em-ink)] mb-4 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-[var(--em-coral)]" /> O que melhorar
                            </h4>
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] mt-1.5 shrink-0" />
                                A proposta de intervenção precisa detalhar melhor o &quot;modo/meio&quot;.
                              </li>
                              <li className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] mt-1.5 shrink-0" />
                                Evitar repetição de conectivos (&quot;além disso&quot;) no D2.
                              </li>
                              <li className="flex items-start gap-2 text-[14px] font-medium text-[var(--em-ink-soft)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--em-ink)] mt-1.5 shrink-0" />
                                Conclusão ficou um pouco extensa em relação aos desenvolvimentos.
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12] relative">
                          <div className="absolute top-4 right-4 opacity-10">
                            <FileText className="w-16 h-16 text-[var(--em-ink)]" />
                          </div>
                          <h4 className="font-extrabold text-[14px] text-[var(--em-text-mute)] uppercase tracking-wider mb-4">Comentário do Avaliador</h4>
                          <blockquote className="text-[16px] font-medium text-[var(--em-ink)] leading-relaxed border-l-4 border-[var(--em-yellow)] pl-4 italic">
                            &quot;Júlia, excelente evolução! Seu texto está muito mais maduro. Cuidado apenas com a PI: lembre-se sempre de responder às 5 perguntas (Quem? O que? Como? Para que? Detalhamento). Continue assim, o 1000 está próximo!&quot;
                          </blockquote>
                          <div className="mt-4 text-[13px] font-bold text-[var(--em-text-soft)]">
                            — Prof. Pedro Lima
                          </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-2">
                          <button type="button" onClick={() => notify(`Download iniciado: ${envio.tema}`)} className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-ink)] hover:!bg-[var(--em-border)]">
                            <Download className="w-4 h-4" /> Baixar PDF Corrigido
                          </button>
                          <Link href="/atividades" className="em-btn-primary">
                            Próxima atividade
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
