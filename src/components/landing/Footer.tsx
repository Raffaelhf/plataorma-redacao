import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MessageCircle } from 'lucide-react';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { footerColumns } from './data';

type FooterProps = {
  whatsappHref?: string | null;
};

export function Footer({ whatsappHref }: FooterProps) {
  return (
    <footer className="relative mt-4 overflow-hidden bg-[linear-gradient(180deg,#17205e_0%,#2a2574_54%,#2b2060_100%)] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/landing/footer-wave.svg" alt="Fundo do rodapé" fill className="object-cover opacity-55" sizes="100vw" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(255,168,192,0.2),transparent_10%),radial-gradient(circle_at_76%_22%,rgba(255,255,255,0.08),transparent_10%)]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1360px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.15fr_repeat(4,1fr)] lg:px-12">
          <div>
            <PlatformLogo
              className="w-[280px] md:w-[340px]"
              sizes="(max-width: 767px) 280px, 340px"
            />
            <p className="mt-5 max-w-[30ch] text-[1rem] leading-8 text-white/76">
              Plataforma para estudantes que desejam escrever melhor com orientação, prática e acompanhamento de desempenho.
            </p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="md:max-w-[18rem] lg:max-w-none">
              <p className="text-[1.1rem] font-bold uppercase tracking-[0.08em] text-white/92">{column.title}</p>
              <div className="mt-4 h-px bg-white/14" />
              <div className="mt-5 space-y-4 text-[0.98rem] text-white/76">
                {column.items.map((item) => (
                  item.href ? (
                    <Link key={item.label} href={item.href} className="block transition-colors hover:text-white">
                      {item.label}
                    </Link>
                  ) : (
                    <p key={item.label}>{item.label}</p>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-6 border-t border-white/12 px-5 py-6 text-white/78 sm:px-8 md:flex-row md:items-center lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f7a4d8_0%,#ff6b77_100%)] shadow-[0_8px_18px_rgba(0,0,0,0.14)]">
              <Instagram className="h-5 w-5 text-white" />
            </span>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Falar no WhatsApp"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#6be28d_0%,#1eb35b_100%)] px-5 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-white" />
                <span className="leading-none">WhatsApp</span>
              </a>
            ) : null}
          </div>
          <p className="text-center text-[0.95rem] md:text-right">2026 Escreva Mais. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
