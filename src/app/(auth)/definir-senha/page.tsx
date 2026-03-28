import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAppUrl } from '@/lib/app-url';

async function submitPasswordSetup(formData: FormData) {
  'use server';

  const token = String(formData.get('token') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirmPassword') || '');

  if (!token) {
    redirect('/login');
  }

  if (password.length < 6) {
    redirect(`/definir-senha?token=${encodeURIComponent(token)}&error=${encodeURIComponent('A senha deve ter pelo menos 6 caracteres.')}`);
  }

  if (password !== confirmPassword) {
    redirect(`/definir-senha?token=${encodeURIComponent(token)}&error=${encodeURIComponent('As senhas não coincidem.')}`);
  }

  const baseUrl = getAppUrl() ?? 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/password-setup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    redirect(`/definir-senha?token=${encodeURIComponent(token)}&error=${encodeURIComponent(payload.error || 'Não foi possível definir a senha.')}`);
  }

  redirect('/login?passwordSet=1');
}

export default async function PasswordSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? '';
  const error = params.error ?? '';

  if (!token) {
    redirect('/login');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
      <section className="w-full max-w-xl rounded-[32px] border border-[#dbe1fb] bg-[linear-gradient(180deg,rgba(25,31,97,0.97),rgba(53,58,171,0.92))] p-6 text-white shadow-[0_30px_80px_rgba(25,31,97,0.24)] sm:p-8">
        <div className="mb-6 rounded-[28px] border border-white/14 bg-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
          <PlatformLogo
            priority
            className="w-[210px] sm:w-[240px]"
            sizes="(max-width: 640px) 210px, 240px"
            imageClassName="drop-shadow-[0_10px_24px_rgba(8,14,41,0.28)]"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#c8d3ff]">Identidade da plataforma</p>
          <p className="mt-2 text-sm leading-6 text-white/72">
            Ambiente oficial da Escreva Mais para acesso seguro, redefinição de senha e entrada na área da plataforma.
          </p>
        </div>

        <p className="text-sm font-semibold text-[#c8d3ff]">Acesso da plataforma</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-white">Definir senha</h1>
        <p className="mt-4 text-sm leading-7 text-white/80">
          Use este formulário para definir ou redefinir sua senha de acesso. O link recebido por e-mail é temporário.
        </p>

        <form action={submitPasswordSetup} className="mt-6 space-y-4">
          <input type="hidden" name="token" value={token} />
          <div className="space-y-2">
            <label className="text-sm text-white/85">Nova senha</label>
            <Input
              name="password"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              required
              className="border-white/12 bg-white/8 text-white placeholder:text-white/45 focus:border-[#9fb0ff] focus:ring-[#9fb0ff]/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/85">Confirmar senha</label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              required
              className="border-white/12 bg-white/8 text-white placeholder:text-white/45 focus:border-[#9fb0ff] focus:ring-[#9fb0ff]/20"
            />
          </div>

          {error ? <p className="rounded-2xl border border-[#ffd0cf]/60 bg-[#fff1f1]/12 px-4 py-3 text-sm text-[#ffd3cc]">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit">Salvar senha</Button>
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-white">
              Voltar para o login
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
