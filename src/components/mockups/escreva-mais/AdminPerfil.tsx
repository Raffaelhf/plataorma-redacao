import { 
  ShieldCheck, 
  Activity, 
  Smartphone, 
  Key, 
  User,
  Mail,
  Phone,
  Briefcase,
  FileText
} from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

export function AdminPerfil() {
  return (
    <AppLayout
      role="admin"
      userName="Ana Carolina Vieira"
      userEmail="ana@escrevamais.com"
      pageKicker="Conta · Administrador"
      pageTitle="Sua conta admin."
      primaryAction={{ label: "Salvar alterações" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ESQUERDA: PERFIL CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="em-card-hard p-8 bg-[var(--em-surface)] flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--em-green)] border-2 border-[var(--em-ink)] grid place-items-center mb-6 shadow-[4px_4px_0_0_#0E0F12]">
              <span className="text-[32px] font-extrabold text-[var(--em-ink)] tracking-tighter">AV</span>
            </div>
            
            <h2 className="text-[24px] font-extrabold text-[var(--em-ink)] mb-1">Ana Carolina Vieira</h2>
            <div className="text-[14px] font-medium text-[var(--em-text-soft)] mb-4">ana@escrevamais.com</div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--em-ink)] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full border border-[var(--em-ink)] mb-6 shadow-[2px_2px_0_0_#2BD37B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--em-green)]" />
              Acesso Total
            </div>

            <div className="text-[12px] font-bold text-[var(--em-text-mute)] w-full text-center pb-6 border-b border-[var(--em-border-strong)]">
              Admin desde Jan 2024
            </div>
            
            <div className="w-full pt-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider mb-1">Ações registradas</span>
                <span className="text-[20px] font-extrabold text-[var(--em-ink)]">1.247</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider mb-1">Usrs gerenciados</span>
                <span className="text-[20px] font-extrabold text-[var(--em-ink)]">1.348</span>
              </div>
            </div>
          </div>

          <div className="em-card-hard p-6 bg-[var(--em-cream)]">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[var(--em-ink)]" />
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Atividade recente</h3>
            </div>
            
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--em-border-strong)] before:to-transparent">
              {[
                { label: "Cancelou cadastro de Lucas Mendes", time: "Há 2h" },
                { label: "Aprovou nova atividade (Prof. Pedro)", time: "Há 5h" },
                { label: "Alterou permissões de suporte", time: "Ontem" },
                { label: "Exportou relatório mensal", time: "Ontem" },
                { label: "Sessão iniciada (MacBook)", time: "Ontem" },
              ].map((act, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border border-[var(--em-ink)] bg-[var(--em-yellow)] text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[1px_1px_0_0_#0E0F12]"></div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-[var(--em-border-strong)] bg-white ml-4 md:ml-0 shadow-sm">
                    <div className="text-[12px] font-bold text-[var(--em-ink)] leading-tight">{act.label}</div>
                    <div className="text-[10px] font-semibold text-[var(--em-text-mute)] mt-1">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DIREITA: FORMULÁRIOS */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="em-card-hard p-6 md:p-8 bg-white">
            <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <User className="w-5 h-5" /> Dados pessoais
            </h3>
            
            <form className="space-y-5" onSubmit={e=>e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <input 
                      type="text" 
                      defaultValue="Ana Carolina Vieira"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] text-[14px] font-medium text-[var(--em-ink)] focus:outline-none focus:border-[var(--em-ink)] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">E-mail (Acesso)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <input 
                      type="email" 
                      defaultValue="ana@escrevamais.com"
                      readOnly
                      className="w-full h-11 pl-10 pr-4 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] text-[14px] font-medium text-[var(--em-text-soft)] cursor-not-allowed opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <input 
                      type="tel" 
                      defaultValue="(11) 98765-4321"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] text-[14px] font-medium text-[var(--em-ink)] focus:outline-none focus:border-[var(--em-ink)] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <select className="w-full h-11 pl-10 pr-4 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] text-[14px] font-medium text-[var(--em-ink)] focus:outline-none focus:border-[var(--em-ink)] focus:bg-white transition-colors appearance-none">
                      <option>Administrador</option>
                      <option>Diretor de operações</option>
                      <option>Suporte Avançado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[13px] font-bold text-[var(--em-ink)]">Bio / Notas internas</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--em-text-mute)]" />
                  <textarea 
                    rows={3}
                    placeholder="Informações adicionais..."
                    className="w-full py-3 pl-10 pr-4 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] text-[14px] font-medium text-[var(--em-ink)] focus:outline-none focus:border-[var(--em-ink)] focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </form>
          </div>

          <div className="em-card-hard p-6 md:p-8 bg-white">
            <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Permissões da Conta
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Gerenciar usuários", desc: "Criar, editar e suspender alunos/professores.", active: true },
                { label: "Gerenciar finanças", desc: "Acesso a métricas de receita e planos.", active: true },
                { label: "Gerenciar conteúdo", desc: "Aprovar, editar ou apagar atividades e aulas.", active: true },
                { label: "Acesso a logs", desc: "Visualizar histórico de ações de outros admins.", active: true },
                { label: "Exportar dados", desc: "Baixar CSV de notas, usuários e finanças.", active: true },
                { label: "Aprovar professores", desc: "Dar permissão final para novos mentores.", active: false },
              ].map((perm, i) => (
                <div key={i} className={`p-4 rounded-xl border-[1.5px] flex items-start gap-3 transition-colors ${perm.active ? 'border-[var(--em-ink)] bg-[var(--em-mint)]/30' : 'border-[var(--em-border-strong)] bg-[var(--em-bg)]'}`}>
                  <div className="mt-0.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={perm.active} />
                      <div className="w-9 h-5 bg-[var(--em-border-strong)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--em-green)] border border-[var(--em-ink)]"></div>
                    </label>
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold text-[var(--em-ink)] leading-none mb-1">{perm.label}</div>
                    <div className="text-[11px] font-medium text-[var(--em-text-soft)] leading-snug">{perm.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="em-card-hard p-6 md:p-8 bg-white">
            <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <Key className="w-5 h-5" /> Senha e Segurança
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow-soft)] shadow-[2px_2px_0_0_#0E0F12]">
                <div>
                  <div className="text-[14px] font-extrabold text-[var(--em-ink)] mb-1">Autenticação em 2 Fatores (2FA)</div>
                  <div className="text-[12px] font-medium text-[var(--em-ink-soft)]">Proteja sua conta admin com uma camada extra de segurança.</div>
                </div>
                <button className="em-btn-primary !py-2 !px-4 !text-[13px] bg-white hover:bg-[var(--em-yellow)]">Configurar</button>
              </div>
              
              <div className="pt-2">
                <button className="text-[13px] font-bold text-[var(--em-ink)] border border-[var(--em-border-strong)] rounded-xl px-4 py-2 hover:bg-[var(--em-bg)] transition-colors">
                  Alterar senha
                </button>
              </div>

              <div className="pt-4 border-t border-[var(--em-border-strong)]">
                <h4 className="text-[13px] font-extrabold text-[var(--em-text-soft)] uppercase tracking-wider mb-4">Sessões Ativas</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-[var(--em-border-strong)]">
                        <Smartphone className="w-4 h-4 text-[var(--em-ink)]" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[var(--em-ink)]">MacBook Pro - Chrome</div>
                        <div className="text-[11px] font-medium text-[var(--em-text-soft)]">São Paulo, BR · Ativo agora</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[var(--em-green-soft)] text-[var(--em-green-deep)] rounded border border-[var(--em-green-deep)]/20">Atual</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-[var(--em-border-strong)]">
                        <Smartphone className="w-4 h-4 text-[var(--em-ink)]" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[var(--em-ink)]">iPhone 14 - Safari</div>
                        <div className="text-[11px] font-medium text-[var(--em-text-soft)]">São Paulo, BR · Há 2 dias</div>
                      </div>
                    </div>
                    <button className="text-[12px] font-bold text-[var(--em-coral)] hover:underline">Revogar</button>
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
