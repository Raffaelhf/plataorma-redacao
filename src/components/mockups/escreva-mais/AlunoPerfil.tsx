import { UserRound, Lock, Bell, Smartphone, Shield, LogOut, CheckCircle2 } from "lucide-react";
import { AppLayout } from "./_shared/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { gradeLevelOptions } from "@/lib/grade-levels";
import "./_group.css";

type StudentProfileView = {
  name: string;
  email: string;
  initials: string;
  planLabel: string;
  monthlySubmissions: number;
  monthlyLimit: number;
  memberSinceLabel: string;
  gradeLevel: string | null;
  bio: string;
  enrollmentNumber: string | null;
};

export function AlunoPerfil({ profile }: { profile: StudentProfileView }) {
  const usagePercent = profile.monthlyLimit > 0 ? Math.min(100, Math.round((profile.monthlySubmissions / profile.monthlyLimit) * 100)) : 0;
  const usageLabel = profile.monthlyLimit > 0 ? `${profile.monthlySubmissions}/${profile.monthlyLimit} envios` : `${profile.monthlySubmissions} envios`;

  return (
    <AppLayout
      role="aluno"
      userName={profile.name}
      userEmail={profile.email}
      pageKicker="Conta · Aluno"
      pageTitle="Seu perfil."
      primaryAction={{ label: "Salvar alterações" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
        
        {/* LEFT COLUMN: Overview */}
        <div className="space-y-6">
          <div className="em-card-hard p-6 bg-white flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-[var(--em-green)] border-[3px] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12] grid place-items-center text-[32px] font-extrabold text-[var(--em-ink)] mb-4">
              {profile.initials}
            </div>
            <h2 className="text-[22px] font-extrabold text-[var(--em-ink)] leading-tight mb-1">{profile.name}</h2>
            <p className="text-[13px] font-semibold text-[var(--em-text-soft)] mb-4">{profile.email}</p>
            
            <div className="w-full pt-4 border-t border-[var(--em-border)]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[12px] font-extrabold text-[var(--em-text-soft)] uppercase">Plano</span>
                <span className="em-chip bg-[var(--em-yellow)] border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">{profile.planLabel}</span>
              </div>
              <div className="text-[12px] font-bold text-[var(--em-ink)] text-left mb-2">Uso mensal: {usageLabel}</div>
              <div className="h-2 w-full bg-[var(--em-bg)] border border-[var(--em-ink)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--em-green)] border-r border-[var(--em-ink)]" style={{ width: `${usagePercent}%` }} />
              </div>
              <div className="mt-4 text-[12px] font-semibold text-[var(--em-text-mute)]">{profile.memberSinceLabel}</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Forms */}
        <div className="space-y-8">
          
          {/* Dados Pessoais */}
          <div className="em-card-hard p-6 md:p-8 bg-white">
            <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <UserRound className="w-5 h-5 text-[var(--em-ink)]" /> Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Nome completo</Label>
                <Input defaultValue={profile.name} className="h-[44px] rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] focus:bg-white font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">E-mail</Label>
                <div className="relative">
                  <Input defaultValue={profile.email} readOnly className="h-[44px] rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] text-[var(--em-text-soft)] font-medium pr-10 cursor-not-allowed" />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Telefone</Label>
                <Input placeholder="Não informado" className="h-[44px] rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] focus:bg-white font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Data de nascimento</Label>
                <Input type="date" className="h-[44px] rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] focus:bg-white font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Série / Escolaridade</Label>
                <Select defaultValue={profile.gradeLevel ?? undefined}>
                  <SelectTrigger className="h-[44px] rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] focus:bg-white font-medium">
                    <SelectValue placeholder="Não informado" />
                  </SelectTrigger>
                  <SelectContent className="border-[1.5px] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12] rounded-xl">
                    {gradeLevelOptions.map((gradeLevel) => (
                      <SelectItem key={gradeLevel} value={gradeLevel}>{gradeLevel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Cidade / UF</Label>
                <Input placeholder="Não informado" className="h-[44px] rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] focus:bg-white font-medium" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Sobre seus objetivos (Bio)</Label>
                <textarea 
                  className="w-full p-3 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus-visible:outline-none focus-visible:border-[var(--em-ink)] bg-[var(--em-bg)] focus:bg-white font-medium min-h-[100px] resize-none"
                  defaultValue={profile.bio}
                  placeholder="Conte seus objetivos de estudo."
                ></textarea>
              </div>
              
              <div className="md:col-span-2 space-y-3 pt-4 border-t border-[var(--em-border)]">
                <Label className="text-[13px] font-bold text-[var(--em-ink)]">Foco Principal</Label>
                <div className="flex flex-wrap gap-2">
                  {["ENEM 2026", "Fuvest", "Unicamp", "Mackenzie", "Treino livre"].map((foco, i) => (
                    <button 
                      key={i} 
                      className={`px-4 py-2 rounded-full text-[13px] font-bold border-[1.5px] transition-all ${
                        foco === "ENEM 2026" || foco === "Fuvest" 
                        ? "bg-[var(--em-mint)] border-[var(--em-ink)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]" 
                        : "bg-[var(--em-bg)] border-[var(--em-border-strong)] text-[var(--em-text-soft)] hover:border-[var(--em-ink)]"
                      }`}
                    >
                      {foco}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferências */}
          <div className="em-card-hard p-6 md:p-8 bg-[var(--em-cream)]">
            <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-[var(--em-ink)]" /> Preferências
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[var(--em-border-strong)]">
                <div>
                  <div className="text-[14px] font-bold text-[var(--em-ink)]">Notificações por E-mail</div>
                  <div className="text-[12px] font-semibold text-[var(--em-text-soft)] mt-0.5">Receba alertas quando sua redação for corrigida.</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[var(--em-green)] border-2 border-[var(--em-ink)] data-[state=unchecked]:bg-[var(--em-bg)]" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[var(--em-border-strong)]">
                <div>
                  <div className="text-[14px] font-bold text-[var(--em-ink)]">Lembretes de Aulas Ao Vivo</div>
                  <div className="text-[12px] font-semibold text-[var(--em-text-soft)] mt-0.5">Notificação 30 minutos antes do início.</div>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-[var(--em-green)] border-2 border-[var(--em-ink)] data-[state=unchecked]:bg-[var(--em-bg)]" />
              </div>
            </div>
          </div>

          {/* Senha e Segurança */}
          <div className="em-card-hard p-6 md:p-8 bg-white">
            <h3 className="text-[20px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--em-ink)]" /> Senha e Segurança
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-[var(--em-bg)] rounded-xl border border-[var(--em-border-strong)] mb-6">
              <div>
                <div className="text-[14px] font-bold text-[var(--em-ink)]">Senha da conta</div>
                <div className="text-[12px] font-semibold text-[var(--em-text-soft)] mt-0.5">Última alteração há 2 meses.</div>
              </div>
              <button className="em-btn-ghost-dark !text-[var(--em-ink)] !border-[var(--em-ink)] hover:!bg-white">
                Alterar senha
              </button>
            </div>

            <div className="border-t border-[var(--em-border)] pt-6">
              <h4 className="text-[14px] font-bold text-[var(--em-ink)] mb-4">Dispositivos conectados</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--em-mint)] border border-[var(--em-ink)] grid place-items-center">
                      <Smartphone className="w-5 h-5 text-[var(--em-ink)]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[var(--em-ink)]">iPhone 13 - App AppStore</div>
                      <div className="text-[11px] font-semibold text-[var(--em-green-deep)] flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Sessão atual
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--em-bg)] border border-[var(--em-border-strong)] grid place-items-center">
                      <Smartphone className="w-5 h-5 text-[var(--em-text-mute)]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[var(--em-ink)]">MacBook Pro - Chrome</div>
                      <div className="text-[11px] font-semibold text-[var(--em-text-soft)] mt-0.5">Visto por último ontem</div>
                    </div>
                  </div>
                  <button className="text-[12px] font-bold text-[var(--em-text-soft)] hover:text-[var(--em-coral)] transition-colors">
                    Desconectar
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--em-border)] flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--em-rose)] text-[var(--em-rose-deep)] border border-[var(--em-rose-deep)] font-bold text-[13px] hover:brightness-95 transition-all">
                  <LogOut className="w-4 h-4" /> Sair de todos os dispositivos
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
