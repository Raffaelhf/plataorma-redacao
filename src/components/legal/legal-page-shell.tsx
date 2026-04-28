import type { ReactNode } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { getPlatformWhatsAppHref } from '@/lib/platform-contact';

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  updatedAt: string;
  children: ReactNode;
};

export async function LegalPageShell({
  eyebrow,
  title,
  description,
  updatedAt,
  children,
}: LegalPageShellProps) {
  const whatsappHref = await getPlatformWhatsAppHref();

  return (
    <main className="landing-shell min-h-screen overflow-x-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(132deg,#171d5a_0%,#2f3298_36%,#5e4fd0_68%,#d8927d_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.94)_0%,rgba(41,44,132,0.84)_36%,rgba(89,67,188,0.54)_62%,rgba(226,151,123,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.14),transparent_16%),radial-gradient(circle_at_80%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_70%_64%,rgba(255,164,120,0.12),transparent_18%)]" />
        <Header />

        <div className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-8 sm:px-8 lg:px-12">
          <div className="max-w-3xl rounded-[34px] border border-white/14 bg-white/10 p-6 text-white shadow-[0_28px_68px_rgba(14,18,64,0.2)] backdrop-blur-md sm:p-8">
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.28em] text-white/72">{eyebrow}</p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-[60ch] text-sm leading-7 text-white/84 sm:text-base">{description}</p>
            <p className="mt-5 inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
              Ultima atualizacao: {updatedAt}
            </p>
          </div>
        </div>

        <div className="absolute bottom-[-92px] left-1/2 h-[186px] w-[130%] -translate-x-1/2 rounded-[999px] bg-[#f7f3ff]" />
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8 lg:px-12">
        <div className="space-y-6">{children}</div>

        <div className="mt-8 rounded-[30px] border border-[#d9def8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_18px_48px_rgba(74,73,140,0.08)] sm:p-6">
          <p className="text-sm font-semibold text-[#5a69a1]">Documentos relacionados</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/privacidade"
              className="rounded-full border border-[#d7defe] bg-[#f6f8ff] px-4 py-2 text-sm font-semibold text-[#22347e] transition-colors hover:bg-white"
            >
              Privacidade e LGPD
            </Link>
            <Link
              href="/politica-de-cookies"
              className="rounded-full border border-[#d7defe] bg-[#f6f8ff] px-4 py-2 text-sm font-semibold text-[#22347e] transition-colors hover:bg-white"
            >
              Politica de Cookies
            </Link>
            <Link
              href="/termos-de-servico"
              className="rounded-full border border-[#d7defe] bg-[#f6f8ff] px-4 py-2 text-sm font-semibold text-[#22347e] transition-colors hover:bg-white"
            >
              Termos de Servico
            </Link>
          </div>
        </div>
      </section>

      <Footer whatsappHref={whatsappHref} />
    </main>
  );
}
