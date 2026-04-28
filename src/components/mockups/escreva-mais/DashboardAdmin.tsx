import Link from "next/link";
import { 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  MessageCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppLayout } from "./_shared/AppLayout";
import "./_group.css";

export function DashboardAdmin() {
  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Painel administrativo"
      pageTitle="Visão geral da plataforma."
      primaryAction={{ label: "Adicionar usuário", href: "/admin/usuarios" }}
    >
      <div className="space-y-8">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <KpiCard 
            title="Alunos ativos" 
            value="1.248" 
            trend="+6.4%" 
            trendUp={true} 
            icon={GraduationCap} 
            bgColor="var(--em-mint)" 
          />
          <KpiCard 
            title="Professores ativos" 
            value="32" 
            trend="+2.1%" 
            trendUp={true} 
            icon={Users} 
            bgColor="var(--em-peach)" 
          />
          <KpiCard 
            title="Correções pendentes" 
            value="27" 
            trend="-12%" 
            trendUp={true} 
            icon={ClipboardCheck} 
            bgColor="var(--em-lavender)" 
          />
          <KpiCard 
            title="Receita mensal" 
            value="R$ 84.260" 
            trend="+12%" 
            trendUp={true} 
            icon={TrendingUp} 
            bgColor="var(--em-yellow-soft)" 
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Revenue Chart */}
            <div className="em-card-hard p-8 bg-white relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-[14px] font-bold tracking-tight text-[var(--em-text-soft)] uppercase mb-1">Receita Mensal</h3>
                  <div className="flex items-baseline gap-4">
                    <div className="text-[32px] font-extrabold text-[var(--em-ink)] tracking-tight">R$ 84.260</div>
                    <div className="flex items-center gap-1 text-[13px] font-bold text-[var(--em-green-deep)]">
                      <ArrowUpRight className="w-4 h-4" /> 12% vs mês anterior
                    </div>
                  </div>
                </div>
                <select className="px-3 py-1.5 bg-[var(--em-bg)] border border-[var(--em-border)] rounded-lg text-[13px] font-semibold text-[var(--em-ink)] outline-none focus:border-[var(--em-ink)]">
                  <option>Últimos 6 meses</option>
                  <option>Este ano</option>
                </select>
              </div>

              {/* Area Chart SVG */}
              <div className="h-[240px] w-full mt-4 relative">
                <svg viewBox="0 0 800 240" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--em-green)" stopOpacity="1" />
                      <stop offset="100%" stopColor="var(--em-green)" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  <line x1="0" y1="60" x2="800" y2="60" stroke="var(--em-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="800" y2="120" stroke="var(--em-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="800" y2="180" stroke="var(--em-border)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="0" y1="240" x2="800" y2="240" stroke="var(--em-ink)" strokeWidth="1.5" />
                  
                  <path 
                    d="M0,200 L114,180 L228,190 L342,130 L457,150 L571,80 L685,90 L800,40 L800,240 L0,240 Z" 
                    fill="var(--em-green)"
                  />
                  <path 
                    d="M0,200 L114,180 L228,190 L342,130 L457,150 L571,80 L685,90 L800,40" 
                    fill="none" 
                    stroke="var(--em-ink)" 
                    strokeWidth="3" 
                  />
                  
                  {/* Data points */}
                  <circle cx="114" cy="180" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  <circle cx="228" cy="190" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  <circle cx="342" cy="130" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  <circle cx="457" cy="150" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  <circle cx="571" cy="80" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  <circle cx="685" cy="90" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                  <circle cx="800" cy="40" r="5" fill="var(--em-yellow)" stroke="var(--em-ink)" strokeWidth="2" />
                </svg>
                <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[11px] font-bold text-[var(--em-text-mute)] px-2">
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>Mai</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Ago</span>
                </div>
              </div>
            </div>

            {/* Cadastros Recentes */}
            <div className="em-card-hard p-0 bg-white overflow-hidden">
              <div className="p-6 border-b border-[var(--em-ink)] flex justify-between items-center bg-[var(--em-cream)]">
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Cadastros Recentes</h3>
                <Link href="/admin/usuarios" className="text-[13px] font-bold text-[var(--em-ink)] hover:text-[var(--em-green-deep)] transition-colors">
                  Ver todos
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-[var(--em-ink)]">
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Usuário</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Tipo</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Plano</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)]">Status</th>
                      <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-ink)] text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Júlia Mendes", email: "julia.m@email.com", type: "Aluno", typeColor: "var(--em-mint)", plan: "Anual", status: "Ativo", statusColor: "var(--em-green)", avatar: "JM" },
                      { name: "Prof. Rafael Costa", email: "rafael@escrevamais.com", type: "Professor", typeColor: "var(--em-lavender)", plan: "Premium", status: "Ativo", statusColor: "var(--em-green)", avatar: "RC" },
                      { name: "Lucas Batista", email: "lucas.b@email.com", type: "Aluno", typeColor: "var(--em-mint)", plan: "Mensal", status: "Pendente", statusColor: "var(--em-yellow)", avatar: "LB" },
                      { name: "Beatriz Oliveira", email: "bia.oli@email.com", type: "Aluno", typeColor: "var(--em-mint)", plan: "Semestral", status: "Ativo", statusColor: "var(--em-green)", avatar: "BO" },
                      { name: "Pedro Henrique", email: "pedro.h@email.com", type: "Aluno", typeColor: "var(--em-mint)", plan: "Mensal", status: "Ativo", statusColor: "var(--em-green)", avatar: "PH" },
                      { name: "Ana Clara Silva", email: "ana.c@email.com", type: "Aluno", typeColor: "var(--em-mint)", plan: "Anual", status: "Ativo", statusColor: "var(--em-green)", avatar: "AC" },
                    ].map((user, i) => (
                      <tr key={i} className="border-b border-[var(--em-ink)] last:border-b-0 hover:bg-[var(--em-bg)] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border border-[var(--em-ink)] bg-[var(--em-cream)] text-[var(--em-ink)] flex items-center justify-center text-[11px] font-bold">
                              {user.avatar}
                            </div>
                            <div>
                              <div className="text-[14px] font-bold text-[var(--em-ink)] leading-tight">{user.name}</div>
                              <div className="text-[12px] text-[var(--em-text-soft)]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" style={{ backgroundColor: user.typeColor }}>
                            {user.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[13px] font-bold text-[var(--em-ink)]">{user.plan}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full border border-[var(--em-ink)]" style={{ backgroundColor: user.statusColor }}></span>
                            <span className="text-[13px] font-bold text-[var(--em-ink)]">{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link href="/admin/usuarios" className="inline-flex px-3 py-1.5 text-[11px] font-bold bg-white border border-[var(--em-ink)] rounded-lg hover:bg-[var(--em-bg)] shadow-[2px_2px_0_0_#0E0F12] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#0E0F12] transition-all">
                            Ver perfil
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Breakdown Chart */}
            <div className="em-card-hard p-6 bg-white">
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] mb-6">Distribuição por plano</h3>
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-[180px] h-[180px] mb-8">
                  {/* Simplified Donut SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--em-mint)" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--em-peach)" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="75.36" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--em-lavender)" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="145.7" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--em-yellow)" strokeWidth="20" strokeDasharray="251.2" strokeDashoffset="200.96" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--em-ink)" strokeWidth="2" />
                    <circle cx="50" cy="50" r="60" fill="transparent" stroke="var(--em-ink)" strokeWidth="2" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[24px] font-extrabold text-[var(--em-ink)] leading-none">1.2k</span>
                    <span className="text-[11px] font-bold text-[var(--em-text-mute)] mt-1">Assinantes</span>
                  </div>
                </div>
                
                <div className="w-full space-y-3">
                  <PlanRow label="Semestral" value="30%" color="var(--em-mint)" />
                  <PlanRow label="Trimestral" value="28%" color="var(--em-peach)" />
                  <PlanRow label="Mensal" value="22%" color="var(--em-lavender)" />
                  <PlanRow label="Anual" value="20%" color="var(--em-yellow)" />
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="rounded-[22px] border-[1.5px] border-[var(--em-ink)] p-6 shadow-[6px_6px_0_0_#0E0F12] relative overflow-hidden" style={{ backgroundColor: "var(--em-green)" }}>
              {/* Decorative elements */}
              <div className="absolute -right-4 -top-4 w-24 h-24 border-[1.5px] border-[var(--em-ink)] rounded-full opacity-20" />
              <div className="absolute -right-8 -top-8 w-32 h-32 border-[1.5px] border-[var(--em-ink)] rounded-full opacity-20" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--em-ink)] flex items-center justify-center text-white">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-extrabold text-[var(--em-ink)] leading-tight">WhatsApp Oficial</h3>
                    <p className="text-[12px] font-semibold text-[var(--em-ink-soft)] opacity-80">Atendimento a alunos</p>
                  </div>
                </div>
                
                <div className="bg-white/90 border-[1.5px] border-[var(--em-ink)] rounded-xl p-3 flex justify-between items-center mb-5">
                  <span className="font-bold text-[15px] text-[var(--em-ink)]">+55 (11) 98765-4321</span>
                  <button className="p-1.5 hover:bg-[var(--em-bg-alt)] border border-transparent hover:border-[var(--em-ink)] rounded-md transition-colors bg-white">
                    <Copy className="w-4 h-4 text-[var(--em-ink)]" />
                  </button>
                </div>
                
                <a href="https://wa.me/5511987654321" target="_blank" rel="noreferrer" className="w-full bg-[var(--em-ink)] text-white font-bold py-3 rounded-xl border-[1.5px] border-[var(--em-ink)] mb-5 hover:bg-[var(--em-ink-soft)] transition-colors flex justify-center items-center gap-2">
                  Abrir conversa <ExternalLink className="w-4 h-4" />
                </a>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-white/50 border border-[var(--em-ink)] rounded-full text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">Configurar planos</span>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-white/50 border border-[var(--em-ink)] rounded-full text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">Política cancelamento</span>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-white/50 border border-[var(--em-ink)] rounded-full text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">Cupons</span>
                </div>
              </div>
            </div>

            {/* PIX / Financeiro */}
            <div className="em-card-hard p-6" style={{ backgroundColor: "var(--em-cream)" }}>
              <div className="flex items-center gap-2 mb-5">
                <ShieldCheck className="w-5 h-5 text-[var(--em-ink)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Dados financeiros (PIX)</h3>
              </div>
              
              <div className="space-y-4 mb-6 bg-white p-4 rounded-xl border border-[var(--em-ink)]">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)] mb-1">Chave PIX (CNPJ)</div>
                  <div className="font-mono text-[14px] font-bold text-[var(--em-ink)]">42.***.***/0001-**</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[var(--em-ink)]">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)] mb-1">Banco</div>
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">Itaú (341)</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)] mb-1">Ag / Conta</div>
                    <div className="text-[14px] font-bold text-[var(--em-ink)]">1234 / 56789-0</div>
                  </div>
                </div>
              </div>
              
              <Link href="/admin/configuracoes" className="em-btn-primary w-full justify-center">
                Atualizar dados
              </Link>
            </div>

            {/* Saúde da Plataforma */}
            <div className="em-card-hard p-6 bg-white">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-[var(--em-ink)]" />
                <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Saúde da plataforma</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--em-ink)] bg-[var(--em-bg)]">
                  <span className="text-[13px] font-bold text-[var(--em-ink)]">Uptime Geral</span>
                  <span className="text-[12px] font-extrabold px-2.5 py-1 rounded-full bg-[var(--em-green)] border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">99.98%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--em-ink)] bg-[var(--em-bg)]">
                  <span className="text-[13px] font-bold text-[var(--em-ink)]">Tempo Médio Corr.</span>
                  <span className="text-[12px] font-extrabold px-2.5 py-1 rounded-full bg-[var(--em-yellow)] border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">38h</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--em-ink)] bg-[var(--em-bg)]">
                  <span className="text-[13px] font-bold text-[var(--em-ink)]">NPS</span>
                  <span className="text-[12px] font-extrabold px-2.5 py-1 rounded-full bg-[var(--em-green)] border border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">71</span>
                </div>
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="em-card-hard p-6 bg-white">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[var(--em-ink)]" />
                  <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Atividade recente</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { title: "Novo professor cadastrado", time: "Há 10 min", icon: CheckCircle2, color: "text-[var(--em-green-deep)]" },
                  { title: "Plano Anual assinado: Lucas B.", time: "Há 45 min", icon: TrendingUp, color: "text-[var(--em-yellow-deep)]" },
                  { title: "Lote de 50 redações enviadas", time: "Há 2 horas", icon: ClipboardCheck, color: "text-[var(--em-ink)]" },
                  { title: "Falha no envio de e-mail", time: "Há 3 horas", icon: AlertCircle, color: "text-[var(--em-coral)]" },
                  { title: "Atualização de sistema concluída", time: "Ontem, 23:00", icon: ShieldCheck, color: "text-[var(--em-lavender-deep)]" },
                ].map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="mt-0.5">
                        <Icon className={`w-4 h-4 ${act.color}`} />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[var(--em-ink)] leading-tight">{act.title}</div>
                        <div className="text-[11px] font-semibold text-[var(--em-text-mute)] mt-0.5">{act.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}

function KpiCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  bgColor,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: LucideIcon;
  bgColor: string;
}) {
  return (
    <div 
      className="rounded-[22px] border-[1.5px] border-[var(--em-ink)] p-5 shadow-[4px_4px_0_0_#0E0F12] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0E0F12] transition-all relative overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-white border-[1.5px] border-[var(--em-ink)] flex items-center justify-center shadow-[2px_2px_0_0_#0E0F12]">
          <Icon className="w-5 h-5 text-[var(--em-ink)]" strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-[12px] font-extrabold px-2.5 py-1 rounded-full border border-[var(--em-ink)] bg-white/70 shadow-[2px_2px_0_0_rgba(14,15,18,0.2)]`}>
          {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-[13px] font-bold text-[var(--em-ink)] opacity-90 mb-1">{title}</h3>
        <div className="text-[28px] font-extrabold text-[var(--em-ink)] tracking-tight leading-none">{value}</div>
      </div>
    </div>
  );
}

function PlanRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between w-full p-2.5 rounded-xl hover:bg-[var(--em-bg-alt)] border border-transparent hover:border-[var(--em-border-strong)] transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-md border border-[var(--em-ink)]" style={{ backgroundColor: color }}></div>
        <span className="text-[13px] font-bold text-[var(--em-ink)]">{label}</span>
      </div>
      <span className="text-[13px] font-extrabold text-[var(--em-ink)]">{value}</span>
    </div>
  );
}
