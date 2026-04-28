"use client";

import { useState } from "react";
import { 
  Clock, 
  CheckCircle2, 
  Filter, 
  MessageSquare,
  ExternalLink
} from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

const QUEUE = [
  { id: 1, nome: "Beatriz Mendes", tema: "A importância da educação ambiental no Brasil", tipo: "ENEM 2026", data: "Hoje, 10:45", espera: "2 horas", urgencia: "verde", cor: "var(--em-peach)", preview: "Na obra 'Vidas Secas', de Graciliano Ramos, nota-se o impacto do meio sobre o indivíduo..." },
  { id: 2, nome: "Lucas Oliveira", tema: "Caminhos para combater a fome", tipo: "ENEM 2026", data: "Ontem, 14:20", espera: "26 horas", urgencia: "ambar", cor: "var(--em-mint)", preview: "Segundo Josué de Castro, a fome não é um fenômeno natural, mas sim produto da estrutura..." },
  { id: 3, nome: "Mariana Costa", tema: "Desafios da mobilidade urbana", tipo: "Fuvest", data: "Segunda, 09:15", espera: "50 horas", urgencia: "vermelho", cor: "var(--em-lavender)", preview: "O crescimento desordenado das metrópoles brasileiras, aliado ao histórico rodoviarismo..." },
  { id: 4, nome: "Rafael Souza", tema: "A persistência da violência contra a mulher", tipo: "ENEM 2026", data: "Hoje, 11:30", espera: "1 hora", urgencia: "verde", cor: "var(--em-cream)", preview: "Historicamente, a sociedade patriarcal consolidou uma visão de subjugação feminina..." },
  { id: 5, nome: "Ana Carolina", tema: "O papel da arte na sociedade", tipo: "Unicamp", data: "Ontem, 16:40", espera: "24 horas", urgencia: "ambar", cor: "var(--em-rose)", preview: "Desde a pré-história, com as pinturas rupestres, a arte se manifesta como necessidade..." },
  { id: 6, nome: "Pedro Lima", tema: "Impactos da inteligência artificial", tipo: "Tema livre", data: "Hoje, 08:00", espera: "4 horas", urgencia: "verde", cor: "var(--em-mint)", preview: "A quarta revolução industrial trouxe consigo avanços exponenciais, dentre os quais..." },
  { id: 7, nome: "Júlia Andrade", tema: "A importância da educação ambiental no Brasil", tipo: "ENEM 2026", data: "Ontem, 18:10", espera: "22 horas", urgencia: "ambar", cor: "var(--em-peach)", preview: "Apesar dos avanços legislativos, a conscientização ecológica no Brasil ainda caminha..." },
  { id: 8, nome: "Carlos Eduardo", tema: "Democratização do acesso à cultura", tipo: "ENEM 2026", data: "Segunda, 10:20", espera: "48 horas", urgencia: "vermelho", cor: "var(--em-lavender)", preview: "A Constituição Federal de 1988 garante a todos o direito à cultura. Contudo, na prática..." },
];

const COMPETENCIAS = [
  { id: 1, nome: "I - Domínio da norma culta" },
  { id: 2, nome: "II - Compreensão do tema" },
  { id: 3, nome: "III - Seleção e organização de argumentos" },
  { id: 4, nome: "IV - Coesão e articulação" },
  { id: 5, nome: "V - Proposta de intervenção" },
];

export function ProfessorCorrecoes() {
  const [selectedId, setSelectedId] = useState(1);
  const [mobileTab, setMobileTab] = useState<"fila" | "correcao">("fila");
  const [scores, setScores] = useState<Record<number, number>>({ 1: 160, 2: 160, 3: 120, 4: 160, 5: 120 });
  const [tags, setTags] = useState<string[]>(["Ótima argumentação", "Repertório rico"]);

  const selected = QUEUE.find(q => q.id === selectedId) || QUEUE[0];
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleScoreChange = (id: number, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 200) {
      setScores(prev => ({ ...prev, [id]: num }));
    }
  };

  const toggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <AppLayout
      role="professor"
      userName="Pedro Lima"
      userEmail="pedro.lima@escrevamais.com"
      pageKicker="Correções · 12 pendentes"
      pageTitle="Sua mesa de correção."
      primaryAction={{ label: "Próxima da fila" }}
    >
      {/* Mobile Tabs */}
      <div className="md:hidden flex p-1 mb-6 rounded-[16px] bg-[var(--em-bg-alt)] border-[1.5px] border-[var(--em-border-strong)]">
        <button
          onClick={() => setMobileTab("fila")}
          className={`flex-1 py-2 px-4 rounded-[10px] text-[14px] font-extrabold transition-all ${
            mobileTab === "fila" ? "bg-[var(--em-yellow)] text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" : "text-[var(--em-text-soft)]"
          }`}
        >
          Fila (12)
        </button>
        <button
          onClick={() => setMobileTab("correcao")}
          className={`flex-1 py-2 px-4 rounded-[10px] text-[14px] font-extrabold transition-all ${
            mobileTab === "correcao" ? "bg-[var(--em-yellow)] text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" : "text-[var(--em-text-soft)]"
          }`}
        >
          Correção atual
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        
        {/* ESQUERDA: FILA */}
        <div className={`w-full md:w-[40%] lg:w-[35%] flex-col gap-4 ${mobileTab === "fila" ? "flex" : "hidden md:flex"}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Fila prioritária</h3>
            <button className="w-8 h-8 rounded-lg bg-white border-[1.5px] border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12]">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {QUEUE.map(item => {
              const isSelected = item.id === selectedId;
              return (
                <div 
                  key={item.id}
                  onClick={() => { setSelectedId(item.id); setMobileTab("correcao"); }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border-[1.5px] ${
                    isSelected 
                      ? "bg-white border-[var(--em-ink)] shadow-[4px_4px_0_0_#FFC93D] outline outline-2 outline-offset-2 outline-[var(--em-yellow)]" 
                      : "bg-white border-[var(--em-border-strong)] hover:border-[var(--em-ink)] hover:bg-[var(--em-bg-alt)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full border border-[var(--em-ink)] grid place-items-center text-[12px] font-bold text-[var(--em-ink)]" style={{ backgroundColor: item.cor }}>
                        {item.nome.split(" ").map(n => n[0]).join("").substring(0,2)}
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-[var(--em-ink)] leading-tight">{item.nome}</div>
                        <div className="text-[12px] font-semibold text-[var(--em-text-soft)] mt-0.5">{item.tipo}</div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-[11px] font-extrabold px-2 py-1 rounded border border-[var(--em-ink)] ${
                      item.urgencia === "vermelho" ? "bg-[#FF5A5A]" : 
                      item.urgencia === "ambar" ? "bg-[var(--em-peach)]" : "bg-[var(--em-mint)]"
                    }`}>
                      <Clock className="w-3 h-3" />
                      {item.espera}
                    </div>
                  </div>
                  
                  <div className="text-[13px] font-bold text-[var(--em-ink)] line-clamp-1 mb-1">{item.tema}</div>
                  <div className="text-[13px] text-[var(--em-text-soft)] line-clamp-2 leading-relaxed">{item.preview}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DIREITA: PAINEL DE CORREÇÃO */}
        <div className={`w-full md:w-[60%] lg:w-[65%] flex-col gap-6 ${mobileTab === "correcao" ? "flex" : "hidden md:flex"}`}>
          
          {/* Header */}
          <div className="em-card-hard p-6 bg-white">
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[var(--em-ink)] grid place-items-center text-[14px] font-bold text-[var(--em-ink)] shrink-0" style={{ backgroundColor: selected.cor }}>
                  {selected.nome.split(" ").map(n => n[0]).join("").substring(0,2)}
                </div>
                <div>
                  <h2 className="text-[24px] font-extrabold text-[var(--em-ink)] leading-tight mb-1">{selected.nome}</h2>
                  <div className="text-[14px] font-bold text-[var(--em-ink)] bg-[var(--em-bg-alt)] inline-block px-2.5 py-1 rounded-md border border-[var(--em-border-strong)]">{selected.tipo}</div>
                </div>
              </div>
              <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-border-strong)] hover:!border-[var(--em-ink)] !py-2 !px-4 !text-[13px] bg-[var(--em-bg)] w-fit shrink-0">
                <ExternalLink className="w-4 h-4" /> Abrir PDF original
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)] mb-1">Tema da redação</div>
              <div className="text-[18px] font-bold text-[var(--em-ink)]">{selected.tema}</div>
            </div>
          </div>

          {/* Texto da redação */}
          <div className="em-card-hard bg-[var(--em-cream)] p-6 md:p-8 h-[400px] overflow-y-auto">
            <div className="prose prose-p:font-serif prose-p:text-[16px] prose-p:leading-loose prose-p:text-[var(--em-ink)] max-w-none">
              <p>
                Apesar dos avanços legislativos, a conscientização ecológica no Brasil ainda caminha a passos lentos. Na obra &quot;Vidas Secas&quot;, de Graciliano Ramos, nota-se o impacto do meio sobre o indivíduo, evidenciando como a degradação ambiental afeta diretamente a qualidade de vida. De maneira análoga, a exploração desenfreada dos recursos naturais na contemporaneidade reflete uma mentalidade predatória que ignora a interdependência entre homem e natureza.
              </p>
              <p>
                Nesse contexto, é imperativo analisar a deficiência da educação ambiental nas escolas públicas brasileiras. Segundo Paulo Freire, a educação é fundamental para transformar o mundo. Contudo, o ensino tradicional frequentemente negligencia a transversalidade das questões ecológicas, tratando-as como um apêndice curricular. Essa lacuna formativa contribui para a formação de cidadãos alienados quanto ao seu papel na preservação do ecossistema, perpetuando práticas insustentáveis.
              </p>
              <p>
                Ademais, a atuação midiática possui papel dúbio nesse cenário. Se por um lado documentários e reportagens denunciam o desmatamento e a poluição, por outro, a lógica de consumo estimulada por propagandas massivas reforça o descarte irracional e o esgotamento dos recursos. A ausência de um letramento midiático focado na sustentabilidade impede que a população filtre e questione os impactos reais do seu modo de vida, dificultando a construção de uma sociedade verdadeiramente sustentável.
              </p>
              <p>
                Portanto, medidas são necessárias para mitigar o problema. Cabe ao Ministério da Educação, em parceria com o Ministério do Meio Ambiente, implementar diretrizes curriculares que integrem a educação ambiental de forma prática e contínua, por meio de projetos comunitários e hortas escolares, visando engajar os alunos desde a primeira infância. Somente assim, alinhando conhecimento teórico à prática cidadã, será possível superar o determinismo imposto e construir uma nação ecologicamente consciente e responsável.
              </p>
            </div>
          </div>

          {/* Painel de Avaliação */}
          <div className="em-card-hard p-6 md:p-8 bg-white border-t-8 border-t-[var(--em-yellow)]">
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-[var(--em-border-strong)]">
              <div>
                <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-1">Avaliação</h3>
                <p className="text-[14px] font-medium text-[var(--em-text-soft)]">Critérios do {selected.tipo}</p>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--em-text-mute)] mb-1">Nota Final</div>
                <div className="flex items-baseline gap-1">
                  <span className="em-display text-[48px] text-[var(--em-ink)] leading-none">{totalScore}</span>
                  <span className="text-[18px] font-bold text-[var(--em-text-soft)]">/1000</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {COMPETENCIAS.map(comp => (
                <div key={comp.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">{comp.nome}</div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <input 
                      type="range" 
                      min="0" 
                      max="200" 
                      step="40"
                      value={scores[comp.id]} 
                      onChange={(e) => handleScoreChange(comp.id, e.target.value)}
                      className="flex-1 sm:w-[200px] accent-[var(--em-green)]"
                    />
                    <div className="w-16 shrink-0 relative">
                      <input 
                        type="number" 
                        value={scores[comp.id]}
                        onChange={(e) => handleScoreChange(comp.id, e.target.value)}
                        className="w-full h-10 rounded-lg border-[1.5px] border-[var(--em-ink)] text-center font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-[var(--em-green)] bg-[var(--em-bg)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedbacks */}
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-extrabold text-[var(--em-ink)] mb-2">Tags rápidas</label>
                <div className="flex flex-wrap gap-2">
                  {["Ótima argumentação", "Repertório rico", "Coesão precisa melhorar", "Conclusão fraca", "Estrutura ENEM perfeita", "Fuga ao tema", "Gramática excelente"].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
                        tags.includes(tag) 
                          ? "bg-[var(--em-ink)] text-white border-[var(--em-ink)]" 
                          : "bg-white text-[var(--em-ink)] border-[var(--em-border-strong)] hover:border-[var(--em-ink)]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-extrabold text-[var(--em-ink)] mb-2">Pontos fortes</label>
                  <textarea 
                    className="w-full h-24 rounded-xl border-[1.5px] border-[var(--em-border-strong)] p-3 text-[14px] focus:outline-none focus:border-[var(--em-ink)] resize-none bg-[var(--em-bg)] focus:bg-white transition-colors"
                    placeholder="O que o aluno fez bem?"
                    defaultValue="O repertório sociocultural foi muito bem escolhido e produtivo. A estrutura da redação atende perfeitamente ao modelo dissertativo-argumentativo."
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[14px] font-extrabold text-[var(--em-ink)] mb-2">O que melhorar</label>
                  <textarea 
                    className="w-full h-24 rounded-xl border-[1.5px] border-[var(--em-border-strong)] p-3 text-[14px] focus:outline-none focus:border-[var(--em-ink)] resize-none bg-[var(--em-bg)] focus:bg-white transition-colors"
                    placeholder="Onde o aluno perdeu pontos?"
                    defaultValue="A proposta de intervenção está incompleta, faltando o detalhamento da ação. Alguns desvios de vírgula no segundo parágrafo."
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-extrabold text-[var(--em-ink)] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Comentários gerais
                </label>
                <textarea 
                  className="w-full h-32 rounded-xl border-[1.5px] border-[var(--em-border-strong)] p-3 text-[14px] focus:outline-none focus:border-[var(--em-ink)] resize-none bg-[var(--em-bg)] focus:bg-white transition-colors"
                  placeholder="Escreva um recado de apoio ou resumo da correção..."
                  defaultValue="Muito bem, Beatriz! Sua escrita evoluiu bastante desde a última semana. Fique atenta aos elementos da PI (GOMIF) para garantir os 200 pontos na C5. Continue assim!"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-8 border-t border-[var(--em-border-strong)]">
              <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-ink)] bg-transparent hover:bg-[var(--em-bg-alt)] justify-center">
                Salvar rascunho
              </button>
              <button className="em-btn-primary !bg-[var(--em-green)] justify-center">
                <CheckCircle2 className="w-5 h-5" /> Enviar correção
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
