'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ArrowLeft, BookOpenCheck, CheckCircle2, LogOut, PenLine, ShieldCheck, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PlatformLogo } from '@/components/branding/platform-logo';

type SignoutConfirmationProps = {
  callbackUrl: string;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split('@')[0] || 'Usuario';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function SignoutConfirmation({ callbackUrl }: SignoutConfirmationProps) {
  const { data: session } = useSession();
  const [isLeaving, setIsLeaving] = useState(false);
  const userName = session?.user?.name?.trim() || 'Estudante Escreva Mais';
  const userEmail = session?.user?.email?.trim() || 'conta conectada';
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const continueHref =
    userRole === 'ADMIN'
      ? '/dashboard/admin'
      : userRole === 'TEACHER'
        ? '/dashboard/professor'
        : '/dashboard/aluno';
  const initials = useMemo(() => getInitials(session?.user?.name, session?.user?.email), [session?.user?.email, session?.user?.name]);

  async function handleSignOut() {
    setIsLeaving(true);
    await signOut({ callbackUrl });
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#fffaf1] text-[#0e0f12]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(14,15,18,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(14,15,18,0.04)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,#2bd37b_0_80px,#ffd34d_80px_140px,#ff7a57_140px_190px,#0e0f12_190px_230px)]" />
      <div className="pointer-events-none absolute -left-16 top-24 h-[74vh] w-40 -rotate-6 border-y-2 border-[#0e0f12] bg-[#2bd37b]" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[36vw] overflow-hidden border-l-2 border-[#0e0f12] bg-[#101114] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_18%,rgba(43,211,123,0.28),transparent_28%),radial-gradient(circle_at_28%_78%,rgba(255,211,77,0.2),transparent_26%)]" />
        <div className="absolute -right-28 top-20 h-72 w-72 rounded-full border-[42px] border-[#2bd37b]" />
        <div className="absolute -left-24 bottom-24 h-64 w-64 rounded-full border-[34px] border-[#ffd34d]" />
        <div className="absolute left-16 top-20 right-16">
          <div className="mb-8 h-px bg-white/18" />
          <div className="font-display text-[clamp(3.8rem,7vw,6.5rem)] font-black leading-[0.86] tracking-normal text-white">
            pausa
            <br />
            inteligente
          </div>
          <p className="mt-7 max-w-[20rem] text-base font-semibold leading-7 text-white/62">
            Saia com tranquilidade. Seus dados, envios e progresso continuam organizados para a próxima sessão.
          </p>
        </div>
        <div className="absolute bottom-28 left-16 right-16 grid grid-cols-2 gap-4">
          <div className="rounded-[24px] border-2 border-[#0e0f12] bg-[#2bd37b] p-5 shadow-[6px_6px_0_0_#0e0f12]">
            <div className="text-[34px] font-black leading-none text-[#0e0f12]">100%</div>
            <div className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-[#0e0f12]/70">progresso salvo</div>
          </div>
          <div className="rounded-[24px] border border-white/14 bg-white/[0.08] p-5">
            <div className="text-[34px] font-black leading-none text-white">24h</div>
            <div className="mt-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/50">acesso contínuo</div>
          </div>
        </div>
        <div className="absolute bottom-12 left-16 right-16 flex items-center justify-between border-t border-white/15 pt-5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45">
          <span>Escreva Mais</span>
          <span className="h-2 w-2 rounded-full bg-[#2bd37b]" />
        </div>
      </div>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_430px] lg:px-10">
        <div className="max-w-2xl">
          <Link href="/" className="mb-12 block w-[178px] sm:w-[216px]">
            <PlatformLogo priority sizes="(max-width: 640px) 178px, 216px" variant="light" />
          </Link>

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border-2 border-[#0e0f12] bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] shadow-[4px_4px_0_0_#0e0f12]">
            <ShieldCheck className="h-4 w-4 text-[#149c56]" />
            Sessao segura
          </div>

          <h1 className="max-w-3xl font-display text-[clamp(2.55rem,8vw,5.8rem)] font-black leading-[0.94] tracking-normal">
            Encerrar por agora?
          </h1>

          <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-[#4c5260]">
            Seu progresso fica guardado. Quando voltar, a plataforma continua no mesmo ritmo, pronta para a proxima redacao.
          </p>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { icon: BookOpenCheck, label: 'Atividades salvas' },
              { icon: PenLine, label: 'Envios preservados' },
              { icon: Sparkles, label: 'Painel atualizado' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl border-2 border-[#0e0f12] bg-white px-4 py-3 shadow-[3px_3px_0_0_#0e0f12]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ffd34d] text-[#0e0f12]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-extrabold leading-tight">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-4 -top-4 h-full w-full rotate-[-2deg] rounded-[28px] border-2 border-[#0e0f12] bg-[#ffd34d]" />
          <div className="relative rounded-[28px] border-2 border-[#0e0f12] bg-white p-5 shadow-[10px_10px_0_0_#0e0f12] sm:p-7">
            <div className="mb-7 flex items-center gap-4 rounded-2xl border-2 border-[#0e0f12] bg-[#f7f3ea] p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border-2 border-[#0e0f12] bg-[#0e0f12] text-lg font-black text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-black">{userName}</div>
                <div className="truncate text-sm font-semibold text-[#6b7280]">{userEmail}</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={isLeaving}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#0e0f12] bg-[#2bd37b] px-5 py-4 text-base font-black text-[#0e0f12] shadow-[5px_5px_0_0_#0e0f12] transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-75"
              >
                <LogOut className="h-5 w-5" />
                {isLeaving ? 'Encerrando...' : 'Sair da conta'}
              </button>

              <Link
                href={continueHref}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-[#0e0f12] bg-white px-5 py-4 text-base font-black text-[#0e0f12] transition-colors hover:bg-[#fff4d0]"
              >
                <ArrowLeft className="h-5 w-5" />
                Continuar na plataforma
              </Link>
            </div>

            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#f7f3ea] p-4 text-sm font-bold leading-6 text-[#4c5260]">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#149c56]" />
              Voce pode entrar novamente quando quiser usando seu login e senha.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
