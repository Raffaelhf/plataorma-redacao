import { LoginForm } from '@/components/auth/login-form';
import { PlatformLogo } from '@/components/branding/platform-logo';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const highlights = ['Correção com rubricas', 'Painel de evolução', 'Aulas e atividades no mesmo lugar'];

  return (
    <main className="landing-shell min-h-screen overflow-hidden bg-[linear-gradient(132deg,#171d5a_0%,#2f3298_36%,#5e4fd0_68%,#d8927d_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.94)_0%,rgba(41,44,132,0.84)_36%,rgba(89,67,188,0.54)_62%,rgba(226,151,123,0.18)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.14),transparent_16%),radial-gradient(circle_at_80%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_70%_64%,rgba(255,164,120,0.12),transparent_18%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1360px] flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 text-white">
          <Link href="/" className="flex items-center">
            <PlatformLogo
              priority
              className="w-[260px] md:w-[340px] lg:w-[380px]"
              sizes="(max-width: 767px) 260px, (max-width: 1023px) 340px, 380px"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 shadow-[0_12px_30px_rgba(21,24,92,0.16)] backdrop-blur-md transition-colors hover:bg-white/16"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o início
          </Link>
        </header>

        <section className="relative z-10 grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-12">
          <div className="max-w-[620px] text-white">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 shadow-[0_12px_30px_rgba(21,24,92,0.16)] backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-[#ffd26f]" />
              Acesse sua área de estudo
            </p>
            <h1 className="mt-6 max-w-[10ch] text-[3rem] font-extrabold leading-[0.95] tracking-[-0.055em] drop-shadow-[0_10px_28px_rgba(17,19,74,0.22)] sm:text-[4rem] lg:text-[4.8rem]">
              Escreva melhor, todos os dias.
            </h1>
            <p className="mt-6 max-w-[34rem] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,83,0.16),rgba(17,23,83,0.07))] px-6 py-5 text-[1.02rem] leading-8 text-white/82 shadow-[0_18px_45px_rgba(18,20,77,0.16)] backdrop-blur-[10px] sm:text-[1.08rem]">
              Entre para acompanhar suas redações, revisar feedbacks detalhados e manter uma rotina de estudo consistente na mesma plataforma.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/14 bg-white/10 px-4 py-4 text-sm font-medium text-white/88 shadow-[0_14px_30px_rgba(17,21,78,0.14)] backdrop-blur-md"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3 text-sm text-white/82">
              {['Aluno: acompanhe envios, notas e progresso.', 'Professor: gerencie correções, aulas e turmas.'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/14">
                    <CheckCircle2 className="h-4 w-4 text-[#ffe08a]" />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative w-full max-w-xl justify-self-end overflow-hidden rounded-[32px] border border-white/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] p-5 shadow-[0_30px_72px_rgba(17,21,78,0.24)] backdrop-blur-xl sm:p-7">
            <div className="pointer-events-none absolute inset-x-[12%] top-0 h-16 rounded-full bg-white/16 blur-2xl" />
            <div className="relative rounded-[28px] border border-white/16 bg-[linear-gradient(180deg,rgba(20,25,92,0.72),rgba(26,21,78,0.58))] p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-xs font-semibold text-white/88">
                  Acesso seguro
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.24em] text-white/48">Login</span>
              </div>
              <div className="mb-6 space-y-2">
                <p className="text-sm font-semibold text-[#ffdca8]">Bem-vindo de volta</p>
                <h2 className="text-2xl font-semibold sm:text-[2rem]">Entre com sua conta</h2>
                <p className="max-w-md text-sm leading-6 text-white/68">
                  Use seu login ou o e-mail cadastrado para acessar o painel correspondente ao seu perfil.
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
