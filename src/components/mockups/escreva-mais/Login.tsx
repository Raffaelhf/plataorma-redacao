"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Mail, Star } from "lucide-react";
import { PlatformLogo } from "@/components/branding/platform-logo";
import { getDashboardPathByRole } from "@/lib/roles";
import "./_group.css";

export function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      login,
      password,
    });

    if (res?.error) {
      setError("Credenciais inválidas. Confira os dados e tente novamente.");
      setIsLoading(false);
      return;
    }

    const sessionResponse = await fetch("/api/auth/session");
    const session = (await sessionResponse.json()) as { user?: { role?: string } };
    const callbackUrl = searchParams.get("callbackUrl");
    const target = callbackUrl?.startsWith("/") ? callbackUrl : getDashboardPathByRole(session.user?.role);

    router.push(target);
    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="em-root flex min-h-screen flex-col bg-[var(--em-bg)] font-sans md:flex-row">
      <div className="relative flex w-full flex-col overflow-hidden bg-[var(--em-ink)] p-4 md:w-[60%] md:p-8">
        <div className="em-noise pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative z-10 flex flex-1 flex-col justify-between overflow-hidden rounded-[32px] border-2 border-[var(--em-ink)] bg-[var(--em-green)] p-8 md:rounded-[40px] md:p-12 lg:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[var(--em-yellow)] opacity-30 blur-3xl mix-blend-multiply" />
          <div className="em-spin-slow absolute right-[10%] top-[20%] text-[var(--em-coral)]">
            <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0L53.5 35.5L85.5 14.5L64.5 46.5L100 50L64.5 53.5L85.5 85.5L53.5 64.5L50 100L46.5 64.5L14.5 85.5L35.5 53.5L0 50L35.5 46.5L14.5 14.5L46.5 35.5L50 0Z" fill="currentColor" />
            </svg>
          </div>

          <Link href="/" className="relative z-10 mb-12 flex items-center">
            <PlatformLogo className="w-[190px]" sizes="190px" />
          </Link>

          <div className="relative z-10 max-w-xl">
            <h1 className="em-display mb-6 text-4xl leading-[1.05] text-[var(--em-ink)] md:text-5xl lg:text-[64px]">
              Bem-vindo de volta.
              <br />
              Continue sua <br />
              <span className="relative mt-2 inline-block">
                <span className="relative z-10 px-2 text-[var(--em-ink)]">evolução.</span>
                <span className="absolute inset-0 rounded-sm border-2 border-[var(--em-ink)] bg-[var(--em-yellow)] shadow-[4px_4px_0_0_#0E0F12] -skew-y-2" />
              </span>
            </h1>
            <p className="max-w-md text-[17px] font-medium leading-relaxed text-[var(--em-ink-soft)] md:text-[19px]">
              Acesse suas correções detalhadas, pratique com novos temas e melhore seu estilo de escrita hoje mesmo.
            </p>
          </div>

          <div className="relative z-10 mt-8 max-w-[620px] overflow-hidden rounded-[24px] border-2 border-[var(--em-ink)] bg-white shadow-[6px_6px_0_0_#0E0F12] md:mt-10">
            <Image
              src="/__mockup/images/escreva-mais/student.png"
              alt="Estudante lendo material de redação"
              width={1024}
              height={1024}
              sizes="(max-width: 767px) 100vw, 620px"
              className="h-[180px] w-full object-cover object-[center_48%] brightness-[1.04] saturate-[1.05] sm:h-[210px] lg:h-[230px]"
            />
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-3">
            <div className="em-chip border-[1.5px] border-[var(--em-ink)] bg-white shadow-[2px_2px_0_0_#0E0F12]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--em-green-deep)]" />
              +12 mil redações corrigidas
            </div>
            <div className="em-chip border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow-soft)] shadow-[2px_2px_0_0_#0E0F12]">
              <Star className="h-3.5 w-3.5 fill-[var(--em-yellow-deep)] text-[var(--em-yellow-deep)]" />
              Notas reais de 920+
            </div>
            <div className="em-chip border-[1.5px] border-[var(--em-ink)] bg-[var(--em-mint)] shadow-[2px_2px_0_0_#0E0F12]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--em-ink)]" />
              Cobertura ENEM e Fuvest
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center bg-[var(--em-bg)] p-6 md:w-[40%] md:p-12">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex items-center justify-center md:hidden">
            <PlatformLogo className="w-[210px]" sizes="210px" />
          </div>

          <div className="em-card-hard bg-white p-8 md:p-10">
            <div className="mb-8 text-center md:text-left">
              <h2 className="mb-2 text-[28px] font-extrabold leading-tight tracking-tight text-[var(--em-ink)]">Entre na sua conta</h2>
              <p className="text-[15px] font-medium text-[var(--em-text-soft)]">Insira seus dados para acessar o painel.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-[var(--em-ink)]">Login ou e-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--em-text-mute)]" />
                  <input
                    type="text"
                    placeholder="Seu login ou e-mail"
                    value={login}
                    onChange={(event) => setLogin(event.target.value)}
                    className="h-12 w-full rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] pl-11 pr-4 text-[15px] font-medium text-[var(--em-ink)] transition-colors placeholder:text-[var(--em-text-mute)] focus:border-[var(--em-ink)] focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[14px] font-bold text-[var(--em-ink)]">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] pl-4 pr-11 text-[15px] font-medium text-[var(--em-ink)] transition-colors placeholder:text-[var(--em-text-mute)] focus:border-[var(--em-ink)] focus:bg-white focus:outline-none"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--em-text-mute)] transition-colors hover:text-[var(--em-ink)]">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error ? <p className="rounded-xl border-[1.5px] border-[var(--em-coral)] bg-[var(--em-coral-soft)] px-3 py-2 text-sm font-bold text-[var(--em-ink)]">{error}</p> : null}

              <button type="submit" className="em-btn-primary h-12 w-full justify-center text-[16px]" disabled={isLoading}>
                {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--em-ink)] border-t-transparent" /> : <>Entrar na plataforma <ArrowRight className="h-5 w-5" /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-[14.5px] font-medium text-[var(--em-text-soft)]">
              Novo por aqui?{" "}
              <Link href="/cadastro" className="font-bold text-[var(--em-green-deep)] underline decoration-2 underline-offset-2 transition-colors hover:text-[var(--em-ink)]">
                Crie sua conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
