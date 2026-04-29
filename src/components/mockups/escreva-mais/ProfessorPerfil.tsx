"use client";

import { 
  User, 
  Phone, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Plus, 
  Clock,
  Building2,
  FileText,
  Users,
  Award,
  X
} from "lucide-react";
import { AppLayout } from "./_shared/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "./_group.css";

type ProfessorProfileView = {
  name: string;
  email: string;
  initials: string;
  roleSinceLabel: string;
  expertise: string | null;
  bio: string;
  activityCount: number;
  correctionCount: number;
  studentCount: number;
};

export function ProfessorPerfil({ profile }: { profile: ProfessorProfileView }) {
  return (
    <AppLayout
      role="professor"
      userName={profile.name}
      userEmail={profile.email}
      pageKicker="Conta · Professor"
      pageTitle="Seu perfil profissional."
      primaryAction={{ label: "Salvar alterações" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Profile Card & Stats */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Main Profile Card */}
          <div className="em-card-hard p-8 bg-white flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-[var(--em-ink)] bg-[var(--em-green)] flex items-center justify-center text-[40px] font-extrabold text-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                {profile.initials}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[var(--em-yellow)] border-[1.5px] border-[var(--em-ink)] flex items-center justify-center shadow-[2px_2px_0_0_#0E0F12] hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-[var(--em-ink)]" />
              </button>
            </div>
            
            <h2 className="text-[24px] font-extrabold text-[var(--em-ink)] mb-1">{profile.name}</h2>
            <p className="text-[14px] font-medium text-[var(--em-text-soft)] mb-4">{profile.email}</p>
            
            <div className="em-chip bg-[var(--em-mint)] border-[var(--em-ink)] text-[var(--em-ink)] mb-6">
              <Award className="w-4 h-4" /> {profile.expertise ?? "Professor Escreva Mais"}
            </div>
            
            <div className="w-full h-px bg-[var(--em-border-strong)] mb-6" />
            
            <div className="text-[13px] font-bold text-[var(--em-text-mute)] uppercase tracking-wider">
              {profile.roleSinceLabel}
            </div>
          </div>

          {/* Stats Mini-cards */}
          <div className="grid gap-4">
            <div className="em-card-hard p-4 bg-[var(--em-peach)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12] shrink-0">
                <FileText className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-[var(--em-ink)] leading-none mb-1">{profile.activityCount}</div>
                <div className="text-[12px] font-bold text-[var(--em-ink-soft)]">Atividades criadas</div>
              </div>
            </div>

            <div className="em-card-hard p-4 bg-[var(--em-lavender)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12] shrink-0">
                <Users className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-[var(--em-ink)] leading-none mb-1">{profile.studentCount}</div>
                <div className="text-[12px] font-bold text-[var(--em-ink-soft)]">Alunos atendidos</div>
              </div>
            </div>

            <div className="em-card-hard p-4 bg-[var(--em-mint)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[var(--em-ink)] grid place-items-center shadow-[2px_2px_0_0_#0E0F12] shrink-0">
                <Check className="w-6 h-6 text-[var(--em-ink)]" />
              </div>
              <div>
                <div className="text-[20px] font-extrabold text-[var(--em-ink)] leading-none mb-1">{profile.correctionCount}</div>
                <div className="text-[12px] font-bold text-[var(--em-ink-soft)]">Correções no mês</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Forms & Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Personal Info Form */}
          <div className="em-card-hard p-6 sm:p-8 bg-white">
            <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <User className="w-5 h-5" /> Dados Pessoais
            </h3>
            
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">Nome completo</Label>
                  <Input defaultValue={profile.name} className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] font-medium text-[15px]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)] text-opacity-70">E-mail (somente leitura)</Label>
                  <Input defaultValue={profile.email} readOnly className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-muted)] text-[var(--em-text-mute)] font-medium text-[15px] cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <Input placeholder="Nao informado" className="h-11 pl-10 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] font-medium text-[15px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">Data de nascimento</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <Input type="date" className="h-11 pl-10 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] font-medium text-[15px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">CPF</Label>
                  <Input placeholder="Nao informado" readOnly className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-muted)] text-[var(--em-text-mute)] font-medium text-[15px] cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[14px] font-bold text-[var(--em-ink)]">Cidade / UF</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                    <Input placeholder="Nao informado" className="h-11 pl-10 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] font-medium text-[15px]" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Especialidade principal</Label>
                <Select defaultValue="enem">
                  <SelectTrigger className="h-11 rounded-xl border-[1.5px] border-[var(--em-border-strong)] font-medium bg-[var(--em-bg)] text-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-[1.5px] border-[var(--em-ink)] shadow-[4px_4px_0_0_#0E0F12]">
                    <SelectItem value="enem">Redação ENEM</SelectItem>
                    <SelectItem value="fuvest">Fuvest</SelectItem>
                    <SelectItem value="argumentacao">Argumentação</SelectItem>
                    <SelectItem value="repertorio">Repertório Sociocultural</SelectItem>
                    <SelectItem value="outras">Outras</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Outras especialidades</Label>
                <div className="flex flex-wrap gap-2">
                  {['Argumentação', 'Literatura', 'Gramática'].map((tag, i) => (
                    <div key={i} className="em-chip bg-[var(--em-bg)]">
                      {tag} <X className="w-3.5 h-3.5 text-[var(--em-text-mute)] hover:text-[var(--em-coral)] cursor-pointer" />
                    </div>
                  ))}
                  <button type="button" className="em-chip border-dashed border-[var(--em-border-strong)] bg-transparent text-[var(--em-text-soft)] hover:border-[var(--em-ink)] hover:text-[var(--em-ink)] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Formação acadêmica</Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--em-text-mute)]" />
                  <Input defaultValue={profile.expertise ?? ""} placeholder="Nao informado" className="h-11 pl-10 rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] font-medium text-[15px]" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[14px] font-bold text-[var(--em-ink)]">Bio profissional (Apresente-se aos alunos)</Label>
                <textarea 
                  className="w-full min-h-[120px] p-4 rounded-xl border-[1.5px] border-[var(--em-border-strong)] focus:outline-none focus:border-[var(--em-ink)] bg-[var(--em-bg)] text-[15px] font-medium resize-y transition-colors leading-relaxed"
                  defaultValue={profile.bio}
                  placeholder="Nao informado"
                />
              </div>
            </form>
          </div>

          {/* Availability Card */}
          <div className="em-card-hard p-6 sm:p-8 bg-[var(--em-cream)]">
            <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" /> Disponibilidade
            </h3>
            <p className="text-[14px] text-[var(--em-text-soft)] font-medium mb-6">Seus horários para plantões e aulas ao vivo.</p>

            <div className="space-y-4">
              {[
                { dia: "Segunda-feira", active: true, horas: "14:00 - 18:00" },
                { dia: "Terça-feira", active: true, horas: "09:00 - 12:00, 14:00 - 18:00" },
                { dia: "Quarta-feira", active: true, horas: "14:00 - 20:00" },
                { dia: "Quinta-feira", active: false, horas: "" },
                { dia: "Sexta-feira", active: true, horas: "09:00 - 16:00" },
              ].map((slot, i) => (
                <div key={i} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border-[1.5px] transition-colors ${slot.active ? 'bg-white border-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]' : 'bg-[var(--em-bg)] border-[var(--em-border-strong)] opacity-60'}`}>
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <Checkbox id={`day-${i}`} checked={slot.active} className="border-[1.5px] border-[var(--em-ink)] data-[state=checked]:bg-[var(--em-ink)] w-5 h-5 rounded-[6px]" />
                    <Label htmlFor={`day-${i}`} className="text-[14px] font-bold text-[var(--em-ink)] cursor-pointer">{slot.dia}</Label>
                  </div>
                  <div className="flex-1">
                    {slot.active ? (
                      <Input defaultValue={slot.horas} className="h-9 rounded-lg border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] font-medium text-[13px]" />
                    ) : (
                      <span className="text-[13px] font-semibold text-[var(--em-text-mute)]">Indisponível</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recebimentos Card */}
          <div className="em-card-hard p-6 sm:p-8 bg-white">
            <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Recebimentos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="p-5 rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                <div className="text-[12px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider mb-1">Chave PIX (CPF)</div>
                <div className="text-[16px] font-bold text-[var(--em-ink)]">***.456.789-**</div>
              </div>
              <div className="p-5 rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)]">
                <div className="text-[12px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider mb-1">Próximo pagamento</div>
                <div className="text-[16px] font-bold text-[var(--em-green-deep)]">R$ 1.840,00 <span className="text-[13px] font-semibold text-[var(--em-text-soft)] ml-1">(05/Nov)</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider">Banco</div>
                <div className="text-[14px] font-bold text-[var(--em-ink)]">Nubank (260)</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider">Agência</div>
                <div className="text-[14px] font-bold text-[var(--em-ink)]">0001</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-extrabold text-[var(--em-text-mute)] uppercase tracking-wider">Conta</div>
                <div className="text-[14px] font-bold text-[var(--em-ink)]">1234567-8</div>
              </div>
            </div>

            <button className="em-btn-primary bg-white text-[var(--em-ink)] justify-center w-full sm:w-auto">
              Atualizar dados bancários
            </button>
          </div>

          {/* Security Card */}
          <div className="em-card-hard p-6 sm:p-8 bg-white">
            <h3 className="text-[18px] font-extrabold text-[var(--em-ink)] mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Senha e segurança
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border-[1.5px] border-[var(--em-border-strong)] mb-4">
              <div>
                <div className="text-[15px] font-bold text-[var(--em-ink)] mb-1">Senha de acesso</div>
                <div className="text-[13px] font-medium text-[var(--em-text-soft)]">Última alteração há 3 meses</div>
              </div>
              <button className="px-4 py-2 text-[14px] font-bold text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] rounded-lg hover:bg-[var(--em-bg-alt)] transition-colors shadow-[2px_2px_0_0_#0E0F12]">
                Alterar senha
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border-[1.5px] border-[var(--em-border-strong)]">
              <div>
                <div className="text-[15px] font-bold text-[var(--em-ink)] mb-1">Autenticação em 2 fatores</div>
                <div className="text-[13px] font-medium text-[var(--em-text-soft)]">Adicione uma camada extra de segurança</div>
              </div>
              <button className="px-4 py-2 text-[14px] font-bold text-[var(--em-ink)] border-[1.5px] border-[var(--em-ink)] rounded-lg hover:bg-[var(--em-bg-alt)] transition-colors shadow-[2px_2px_0_0_#0E0F12]">
                Configurar 2FA
              </button>
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
