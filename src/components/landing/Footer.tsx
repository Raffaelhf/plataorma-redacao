import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { footerColumns } from './data';

type FooterProps = {
  whatsappHref?: string | null;
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M19.1 4.9A9.84 9.84 0 0 0 12.02 2C6.58 2 2.16 6.42 2.16 11.87c0 1.74.45 3.44 1.3 4.94L2 22l5.34-1.4a9.82 9.82 0 0 0 4.68 1.19h.01c5.44 0 9.86-4.42 9.86-9.87 0-2.63-1.03-5.1-2.79-7.02Zm-7.08 15.2h-.01a8.14 8.14 0 0 1-4.14-1.13l-.3-.18-3.17.83.85-3.09-.2-.32a8.17 8.17 0 0 1-1.25-4.34c0-4.5 3.67-8.17 8.19-8.17 2.18 0 4.23.84 5.77 2.39a8.08 8.08 0 0 1 2.39 5.78c0 4.51-3.67 8.18-8.13 8.23Zm4.49-6.13c-.25-.13-1.48-.73-1.7-.81-.23-.08-.39-.12-.56.12-.16.24-.64.8-.78.96-.14.17-.28.18-.53.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.69-.14-.24-.01-.37.1-.49.11-.11.25-.29.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.24-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.23 3.74.59.25 1.05.4 1.4.5.59.19 1.13.16 1.55.1.47-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(180deg,#6be28d_0%,#1eb35b_100%)] text-white shadow-[0_8px_18px_rgba(0,0,0,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <WhatsAppIcon />
              </a>
            ) : null}
          </div>
          <p className="text-center text-[0.95rem] md:text-right">2026 Escreva Mais. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
