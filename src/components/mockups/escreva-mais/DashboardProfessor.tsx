import Link from "next/link";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";
import { 
  ClipboardCheck, 
  ListChecks, 
  Users, 
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  Award,
  MoreHorizontal
} from "lucide-react";

export function DashboardProfessor() {
  return (
    <AppLayout
      role="professor"
      userName="Pedro Lima"
      userEmail="pedro.lima@escrevamais.com"
      pageKicker="Painel do professor · Outubro"
      pageTitle="Bom dia, Pedro. 12 redações esperam por você."
      primaryAction={{ label: "Nova atividade", href: "/atividades" }}
    >
      <div className="flex flex-col gap-8 pb-12">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="em-card-hard p-5 flex flex-col justify-between" style={{ background: "var(--em-mint)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-[var(--em-ink)]">Correções pendentes</span>
              <ClipboardCheck className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="flex items-end justify-between">
              <span className="em-display text-[42px] text-[var(--em-ink)]">12</span>
              <span className="text-[13px] font-medium text-[var(--em-ink-soft)] bg-white/40 px-2 py-1 rounded-md border border-[var(--em-ink)] mb-1">-3 hoje</span>
            </div>
          </div>

          <div className="em-card-hard p-5 flex flex-col justify-between" style={{ background: "var(--em-peach)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-[var(--em-ink)]">Atividades criadas</span>
              <ListChecks className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="flex items-end justify-between">
              <span className="em-display text-[42px] text-[var(--em-ink)]">28</span>
              <span className="text-[13px] font-medium text-[var(--em-ink-soft)] bg-white/40 px-2 py-1 rounded-md border border-[var(--em-ink)] mb-1">Neste semestre</span>
            </div>
          </div>

          <div className="em-card-hard p-5 flex flex-col justify-between" style={{ background: "var(--em-lavender)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-[var(--em-ink)]">Alunos ativos</span>
              <Users className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="flex items-end justify-between">
              <span className="em-display text-[42px] text-[var(--em-ink)]">84</span>
              <span className="text-[13px] font-medium text-[var(--em-ink-soft)] bg-white/40 px-2 py-1 rounded-md border border-[var(--em-ink)] mb-1">3 turmas</span>
            </div>
          </div>

          <div className="em-card-hard p-5 flex flex-col justify-between" style={{ background: "var(--em-cream)" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-[var(--em-ink)]">Nota média</span>
              <TrendingUp className="w-5 h-5 text-[var(--em-ink)]" />
            </div>
            <div className="flex items-end justify-between">
              <span className="em-display text-[42px] text-[var(--em-ink)]">768<span className="text-[20px]">/1000</span></span>
              <span className="text-[13px] font-bold text-[var(--em-green-deep)] bg-[var(--em-green-soft)] px-2 py-1 rounded-md border border-[var(--em-ink)] mb-1">+42 pts</span>
            </div>
          </div>
        </div>

        {/* MAIN ROW: Table + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FILA DE CORREÇÕES */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="em-card-hard overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[var(--em-ink)] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-[20px] font-extrabold text-[var(--em-ink)]">Fila de correções pendentes</h2>
                <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button className="em-chip bg-[var(--em-ink)] text-white border-[var(--em-ink)] shrink-0">Todas</button>
                  <button className="em-chip shrink-0">ENEM</button>
                  <button className="em-chip shrink-0">Fuvest</button>
                  <button className="em-chip shrink-0">Tema livre</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="border-b border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                      <th className="p-4 text-[12px] font-bold text-[var(--em-text-soft)] uppercase tracking-wider">Aluno</th>
                      <th className="p-4 text-[12px] font-bold text-[var(--em-text-soft)] uppercase tracking-wider">Atividade / Tema</th>
                      <th className="p-4 text-[12px] font-bold text-[var(--em-text-soft)] uppercase tracking-wider">Espera</th>
                      <th className="p-4 text-[12px] font-bold text-[var(--em-text-soft)] uppercase tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nome: "Ana Carolina", tema: "A persistência da violência contra a mulher", tipo: "ENEM 2026", espera: "2 dias", urgencia: "vermelho", cor: "var(--em-peach)" },
                      { nome: "Lucas Moraes", tema: "Desafios da mobilidade urbana", tipo: "Fuvest", espera: "1 dia", urgencia: "ambar", cor: "var(--em-lavender)" },
                      { nome: "Beatriz Silva", tema: "O papel da arte na sociedade", tipo: "Tema livre", espera: "12 horas", urgencia: "verde", cor: "var(--em-mint)" },
                      { nome: "Rafael Costa", tema: "Caminhos para combater a fome", tipo: "ENEM 2026", espera: "5 horas", urgencia: "verde", cor: "var(--em-cream)" },
                      { nome: "Júlia Ferreira", tema: "A importância da leitura na infância", tipo: "Unicamp", espera: "2 horas", urgencia: "verde", cor: "var(--em-rose)" },
                    ].map((item, i) => (
                      <tr key={i} className="border-b border-[var(--em-border)] hover:bg-[var(--em-cream)] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-[var(--em-ink)] flex items-center justify-center font-bold text-[var(--em-ink)]" style={{ backgroundColor: item.cor }}>
                              {item.nome.split(" ").map(n => n[0]).join("").substring(0,2)}
                            </div>
                            <span className="font-semibold text-[15px] text-[var(--em-ink)]">{item.nome}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-[14px] text-[var(--em-ink)] line-clamp-1">{item.tema}</div>
                          <div className="text-[12px] font-medium text-[var(--em-text-soft)] mt-0.5">{item.tipo}</div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold border border-[var(--em-ink)] ${
                            item.urgencia === "vermelho" ? "bg-[#FF5A5A] text-[var(--em-ink)]" :
                            item.urgencia === "ambar" ? "bg-[#FFB020] text-[var(--em-ink)]" :
                            "bg-[var(--em-green)] text-[var(--em-ink)]"
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {item.espera}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link href="/correcoes" className="em-btn-primary py-2 px-4 text-[13px] opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                            Corrigir agora
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-[var(--em-bg)] border-t border-[var(--em-ink)] text-center">
                <Link href="/correcoes" className="text-[13px] font-bold text-[var(--em-ink)] hover:underline flex items-center justify-center gap-2 mx-auto">
                  Ver todas as 12 correções pendentes <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* GRÁFICO DE ADESÃO */}
            <div className="em-card-hard bg-white p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-extrabold text-[var(--em-ink)]">Adesão mensal</h3>
                <select className="bg-[var(--em-bg)] border border-[var(--em-ink)] rounded-lg px-3 py-1.5 text-[13px] font-semibold outline-none focus:ring-2 focus:ring-[var(--em-green)]">
                  <option>Últimos 6 meses</option>
                  <option>Este ano</option>
                </select>
              </div>
              
              <div className="h-[200px] flex items-end gap-4 sm:gap-8 pt-4">
                {[
                  { mes: "Mai", val: 40, cor: "bg-[var(--em-ink)]" },
                  { mes: "Jun", val: 55, cor: "bg-[var(--em-ink)]" },
                  { mes: "Jul", val: 45, cor: "bg-[var(--em-ink)]" },
                  { mes: "Ago", val: 70, cor: "bg-[var(--em-ink)]" },
                  { mes: "Set", val: 85, cor: "bg-[var(--em-green)]" },
                  { mes: "Out", val: 95, cor: "bg-[var(--em-green)]" },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 relative group">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--em-ink)] text-white text-[12px] font-bold px-2 py-1 rounded border border-[var(--em-ink)]">
                      {b.val}%
                    </div>
                    <div className={`w-full ${b.cor} rounded-t-sm border-t border-l border-r border-[var(--em-ink)] transition-all group-hover:brightness-110 shadow-[2px_0_0_0_#0E0F12]`} style={{ height: `${b.val}%` }}></div>
                    <span className="text-[12px] font-bold text-[var(--em-text-soft)]">{b.mes}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR RIGHT */}
          <div className="flex flex-col gap-6">
            
            {/* PRÓXIMA AULA */}
            <div className="em-card-hard p-6 flex flex-col gap-4 relative overflow-hidden" style={{ background: "var(--em-green)" }}>
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-[var(--em-ink)] rounded-full opacity-5"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[var(--em-ink)] text-[var(--em-green)] px-3 py-1 rounded-full text-[12px] font-bold tracking-wide uppercase mb-3 border border-[var(--em-ink)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--em-green)] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--em-green)]"></span>
                  </span>
                  Ao vivo
                </div>
                <h3 className="text-[22px] font-extrabold text-[var(--em-ink)] leading-tight mb-2">Próxima aula ao vivo</h3>
                <p className="text-[15px] font-bold text-[var(--em-ink)] bg-white/40 inline-block px-2 py-1 rounded border border-[var(--em-ink)] mb-4">Hoje 19h-20h · Repertório sociocultural</p>
                
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {['var(--em-peach)', 'var(--em-lavender)', 'var(--em-rose)'].map((bg, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[var(--em-green)] flex items-center justify-center" style={{ backgroundColor: bg }}>
                          <Users className="w-3.5 h-3.5 text-[var(--em-ink)]" />
                        </div>
                      ))}
                    </div>
                    <span className="ml-3 text-[13px] font-bold text-[var(--em-ink)]">+44 inscritos</span>
                  </div>
                </div>

                <Link href="/ao-vivo" className="w-full bg-[var(--em-ink)] text-[var(--em-green)] border-2 border-[var(--em-ink)] rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-[#1a1c20] transition-colors shadow-[4px_4px_0_0_#0E0F12] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#0E0F12]">
                  <Play className="w-4 h-4 fill-current" /> Iniciar transmissão
                </Link>
              </div>
            </div>

            {/* ATIVIDADES RECENTES */}
            <div className="em-card-hard bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Atividades criadas</h3>
                <button className="text-[var(--em-ink)] hover:bg-[var(--em-bg)] p-1 rounded"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col gap-3">
                <div className="p-3 rounded-xl border border-[var(--em-ink)] bg-[var(--em-peach)] shadow-[2px_2px_0_0_#0E0F12]">
                  <h4 className="font-bold text-[14px] text-[var(--em-ink)] mb-1">Tema ENEM - Outubro</h4>
                  <div className="flex items-center gap-3 text-[12px] font-semibold text-[var(--em-ink-soft)]">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 45 envios</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Faltam 2 dias</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-[var(--em-ink)] bg-[var(--em-lavender)] shadow-[2px_2px_0_0_#0E0F12]">
                  <h4 className="font-bold text-[14px] text-[var(--em-ink)] mb-1">Redação Fuvest 2026</h4>
                  <div className="flex items-center gap-3 text-[12px] font-semibold text-[var(--em-ink-soft)]">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 28 envios</span>
                    <span className="flex items-center gap-1 bg-white/50 px-1.5 rounded border border-[var(--em-ink)]">Encerrado</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl border border-[var(--em-ink)] bg-[var(--em-mint)] shadow-[2px_2px_0_0_#0E0F12]">
                  <h4 className="font-bold text-[14px] text-[var(--em-ink)] mb-1">Tema Livre: Tecnologia</h4>
                  <div className="flex items-center gap-3 text-[12px] font-semibold text-[var(--em-ink-soft)]">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 12 envios</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Contínuo</span>
                  </div>
                </div>
              </div>
              <Link href="/atividades" className="block w-full mt-4 py-2 text-center text-[13px] font-bold text-[var(--em-ink)] border border-[var(--em-ink)] rounded-xl hover:bg-[var(--em-cream)] transition-colors">
                Ver todas atividades
              </Link>
            </div>

            {/* EVOLUÇÃO */}
            <div className="em-card-hard bg-[var(--em-cream)] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-[var(--em-ink)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Maior evolução este mês</h3>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { nome: "Pedro Lima", ganho: "+87 pts", avatar: "PL" },
                  { nome: "Mariana Souza", ganho: "+65 pts", avatar: "MS" },
                  { nome: "Gabriel Silva", ganho: "+52 pts", avatar: "GS" },
                  { nome: "Isabela Costa", ganho: "+48 pts", avatar: "IC" },
                  { nome: "João Pedro", ganho: "+40 pts", avatar: "JP" },
                ].map((aluno, i) => (
                  <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--em-peach)] border border-[var(--em-ink)] flex items-center justify-center text-[11px] font-bold text-[var(--em-ink)]">
                        {aluno.avatar}
                      </div>
                      <span className="font-semibold text-[14px] text-[var(--em-ink)]">{aluno.nome}</span>
                    </div>
                    <span className="bg-[var(--em-yellow)] border border-[var(--em-ink)] px-2 py-0.5 rounded text-[12px] font-bold text-[var(--em-ink)] shadow-[1px_1px_0_0_#0E0F12]">
                      {aluno.ganho}
                    </span>
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
