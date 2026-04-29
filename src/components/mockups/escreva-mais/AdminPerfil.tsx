"use client";

import { Activity, Briefcase, FileText, Key, Mail, Phone, ShieldCheck, Smartphone, User } from "lucide-react";
import "./_group.css";
import { AppLayout } from "./_shared/AppLayout";

type AdminProfileView = {
  name: string;
  email: string;
  initials: string;
  roleSinceLabel: string;
  phone: string | null;
  roleLabel: string;
  bio: string | null;
  actionCountLabel: string;
  managedUsersLabel: string;
  recentActivity: Array<{ label: string; time: string }>;
};

const permissions = [
  { label: "Gerenciar usuarios", desc: "Criar, editar e suspender alunos/professores.", active: true },
  { label: "Gerenciar financas", desc: "Acesso a metricas de receita e planos.", active: true },
  { label: "Gerenciar conteudo", desc: "Aprovar, editar ou apagar atividades e aulas.", active: true },
  { label: "Acesso a logs", desc: "Visualizar historico operacional da plataforma.", active: true },
  { label: "Exportar dados", desc: "Baixar dados administrativos da plataforma.", active: true },
  { label: "Aprovar professores", desc: "Permissao vinculada ao perfil administrador.", active: true },
];

export function AdminPerfil({ profile }: { profile: AdminProfileView }) {
  const recentActivity = profile.recentActivity.length
    ? profile.recentActivity
    : [{ label: "Nenhuma atividade recente registrada.", time: "Agora" }];

  return (
    <AppLayout
      role="admin"
      userName={profile.name}
      userEmail={profile.email}
      pageKicker="Conta · Administrador"
      pageTitle="Sua conta admin."
      primaryAction={{ label: "Salvar alteracoes" }}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="em-card-hard flex flex-col items-center bg-[var(--em-surface)] p-8 text-center">
            <div className="mb-6 grid h-24 w-24 place-items-center rounded-full border-2 border-[var(--em-ink)] bg-[var(--em-green)] shadow-[4px_4px_0_0_#0E0F12]">
              <span className="text-[32px] font-extrabold tracking-tighter text-[var(--em-ink)]">{profile.initials}</span>
            </div>

            <h2 className="mb-1 text-[24px] font-extrabold text-[var(--em-ink)]">{profile.name}</h2>
            <div className="mb-4 text-[14px] font-medium text-[var(--em-text-soft)]">{profile.email}</div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--em-ink)] bg-[var(--em-ink)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[2px_2px_0_0_#2BD37B]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--em-green)]" />
              Acesso Total
            </div>

            <div className="w-full border-b border-[var(--em-border-strong)] pb-6 text-center text-[12px] font-bold text-[var(--em-text-mute)]">
              {profile.roleSinceLabel}
            </div>

            <div className="grid w-full grid-cols-2 gap-4 pt-6">
              <div className="flex flex-col">
                <span className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Acoes registradas</span>
                <span className="text-[20px] font-extrabold text-[var(--em-ink)]">{profile.actionCountLabel}</span>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--em-text-mute)]">Usuarios</span>
                <span className="text-[20px] font-extrabold text-[var(--em-ink)]">{profile.managedUsersLabel}</span>
              </div>
            </div>
          </div>

          <div className="em-card-hard bg-[var(--em-cream)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[var(--em-ink)]" />
              <h3 className="text-[16px] font-extrabold text-[var(--em-ink)]">Atividade recente</h3>
            </div>

            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-[var(--em-border-strong)] before:to-transparent md:before:mx-auto md:before:translate-x-0">
              {recentActivity.map((act, i) => (
                <div key={`${act.label}-${i}`} className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                  <div className="shrink-0 rounded-full border border-[var(--em-ink)] bg-[var(--em-yellow)] shadow-[1px_1px_0_0_#0E0F12] md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <div className="h-4 w-4" />
                  </div>
                  <div className="ml-4 w-[calc(100%-2.5rem)] rounded-xl border border-[var(--em-border-strong)] bg-white p-3 shadow-sm md:ml-0 md:w-[calc(50%-1.5rem)]">
                    <div className="text-[12px] font-bold leading-tight text-[var(--em-ink)]">{act.label}</div>
                    <div className="mt-1 text-[10px] font-semibold text-[var(--em-text-mute)]">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="em-card-hard bg-white p-6 md:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-[20px] font-extrabold text-[var(--em-ink)]">
              <User className="h-5 w-5" /> Dados pessoais
            </h3>

            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">Nome completo</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
                    <input type="text" defaultValue={profile.name} className="h-11 w-full rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] pl-10 pr-4 text-[14px] font-medium text-[var(--em-ink)] transition-colors focus:border-[var(--em-ink)] focus:bg-white focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">E-mail (Acesso)</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
                    <input type="email" defaultValue={profile.email} readOnly className="h-11 w-full cursor-not-allowed rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] pl-10 pr-4 text-[14px] font-medium text-[var(--em-text-soft)] opacity-70" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">Telefone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
                    <input type="tel" defaultValue={profile.phone ?? ""} placeholder="Nao informado" className="h-11 w-full rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] pl-10 pr-4 text-[14px] font-medium text-[var(--em-ink)] transition-colors focus:border-[var(--em-ink)] focus:bg-white focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[var(--em-ink)]">Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--em-text-mute)]" />
                    <input type="text" value={profile.roleLabel} readOnly className="h-11 w-full cursor-not-allowed rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg-alt)] pl-10 pr-4 text-[14px] font-medium text-[var(--em-text-soft)] opacity-70" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[13px] font-bold text-[var(--em-ink)]">Bio / Notas internas</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--em-text-mute)]" />
                  <textarea rows={3} defaultValue={profile.bio ?? ""} placeholder="Nao informado" className="w-full resize-none rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] py-3 pl-10 pr-4 text-[14px] font-medium text-[var(--em-ink)] transition-colors focus:border-[var(--em-ink)] focus:bg-white focus:outline-none" />
                </div>
              </div>
            </form>
          </div>

          <div className="em-card-hard bg-white p-6 md:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-[20px] font-extrabold text-[var(--em-ink)]">
              <ShieldCheck className="h-5 w-5" /> Permissoes da Conta
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {permissions.map((perm) => (
                <div key={perm.label} className={`flex items-start gap-3 rounded-xl border-[1.5px] p-4 transition-colors ${perm.active ? "border-[var(--em-ink)] bg-[var(--em-mint)]/30" : "border-[var(--em-border-strong)] bg-[var(--em-bg)]"}`}>
                  <div className="mt-0.5">
                    <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-[var(--em-ink)] bg-[var(--em-green)]">
                      <span className="absolute right-[2px] h-4 w-4 rounded-full border border-gray-300 bg-white" />
                    </span>
                  </div>
                  <div>
                    <div className="mb-1 text-[13px] font-extrabold leading-none text-[var(--em-ink)]">{perm.label}</div>
                    <div className="text-[11px] font-medium leading-snug text-[var(--em-text-soft)]">{perm.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="em-card-hard bg-white p-6 md:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-[20px] font-extrabold text-[var(--em-ink)]">
              <Key className="h-5 w-5" /> Senha e Seguranca
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow-soft)] p-4 shadow-[2px_2px_0_0_#0E0F12]">
                <div>
                  <div className="mb-1 text-[14px] font-extrabold text-[var(--em-ink)]">Autenticacao em 2 Fatores (2FA)</div>
                  <div className="text-[12px] font-medium text-[var(--em-ink-soft)]">Proteja sua conta admin com uma camada extra de seguranca.</div>
                </div>
                <button className="em-btn-primary bg-white !px-4 !py-2 !text-[13px] hover:bg-[var(--em-yellow)]">Configurar</button>
              </div>

              <div className="pt-2">
                <button className="rounded-xl border border-[var(--em-border-strong)] px-4 py-2 text-[13px] font-bold text-[var(--em-ink)] transition-colors hover:bg-[var(--em-bg)]">
                  Alterar senha
                </button>
              </div>

              <div className="border-t border-[var(--em-border-strong)] pt-4">
                <h4 className="mb-4 text-[13px] font-extrabold uppercase tracking-wider text-[var(--em-text-soft)]">Sessao atual</h4>
                <div className="flex items-center justify-between rounded-xl border border-[var(--em-border-strong)] bg-[var(--em-bg)] p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-[var(--em-border-strong)] bg-white p-2">
                      <Smartphone className="h-4 w-4 text-[var(--em-ink)]" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[var(--em-ink)]">Navegador atual</div>
                      <div className="text-[11px] font-medium text-[var(--em-text-soft)]">Sessao autenticada na Escreva Mais</div>
                    </div>
                  </div>
                  <span className="rounded border border-[var(--em-green-deep)]/20 bg-[var(--em-green-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--em-green-deep)]">Atual</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
