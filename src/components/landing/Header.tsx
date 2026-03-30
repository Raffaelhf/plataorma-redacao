'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { PlatformLogo } from '@/components/branding/platform-logo';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Início', href: '#' },
  { label: 'Como Funciona', href: '/como-funciona' },
  { label: 'Planos', href: '#planos' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const resolveHref = (href: string) => (href.startsWith('#') && pathname !== '/' ? `/${href}` : href);

  return (
    <>
      <header className="relative z-30 mx-auto flex w-full max-w-[1360px] items-center justify-between px-5 py-6 text-white sm:px-8 md:py-7 lg:px-12">
      <Link href="/" className="flex items-center">
        <PlatformLogo
          priority
          className="w-[172px] sm:w-[220px] md:w-[340px] lg:w-[380px]"
          sizes="(max-width: 639px) 172px, (max-width: 767px) 220px, (max-width: 1023px) 340px, 380px"
        />
      </Link>

      <nav className="hidden items-center gap-3 rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[0.98rem] font-semibold text-white/88 shadow-[0_18px_40px_rgba(15,18,70,0.16)] backdrop-blur-md lg:flex">
        {navLinks.map((item, index) => (
          <a
            key={item.label}
            href={resolveHref(item.href)}
            className={
              index === 0
                ? 'rounded-full bg-white/14 px-4 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
                : 'rounded-full px-4 py-2 transition-colors hover:bg-white/10 hover:text-white'
            }
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="hidden lg:block">
        <Link href="/login">
          <Button className="h-[52px] rounded-full px-7 text-[0.98rem] font-bold shadow-[0_16px_34px_rgba(255,106,74,0.24)]">
            Área do Aluno
          </Button>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setIsMenuOpen((current) => !current)}
        className="relative z-30 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/12 text-white shadow-[0_14px_28px_rgba(20,25,84,0.22)] backdrop-blur lg:hidden"
        aria-expanded={isMenuOpen}
        aria-controls="landing-mobile-menu"
        aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      </header>

      {isMenuOpen ? (
        <div
          id="landing-mobile-menu"
          className="fixed inset-0 z-[80] flex min-h-dvh flex-col bg-[linear-gradient(160deg,rgba(14,20,74,0.99)_0%,rgba(33,41,126,0.98)_52%,rgba(88,76,183,0.96)_100%)] px-5 pb-8 pt-5 text-white lg:hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_80%_14%,rgba(255,188,111,0.14),transparent_16%),radial-gradient(circle_at_74%_74%,rgba(255,124,89,0.12),transparent_20%)]" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <PlatformLogo className="w-[180px]" sizes="180px" />
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/16 bg-white/10 text-white shadow-[0_12px_28px_rgba(10,13,48,0.24)] backdrop-blur"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative z-10 mt-10">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em] text-white/48">Navegação</p>
            <nav className="mt-5 flex flex-col gap-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={resolveHref(item.href)}
                  onClick={closeMenu}
                  className="rounded-[24px] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] px-5 py-4 text-lg font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="relative z-10 mt-auto rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))] p-5 shadow-[0_24px_50px_rgba(10,13,48,0.24)] backdrop-blur-md">
            <p className="text-sm leading-7 text-white/74">Acesse sua área para acompanhar redações, aulas e desempenho.</p>
            <Link href="/login" onClick={closeMenu} className="mt-5 block">
              <Button className="h-12 w-full rounded-full text-[0.98rem] font-bold shadow-[0_16px_34px_rgba(255,106,74,0.24)]">
                Área do Aluno
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
