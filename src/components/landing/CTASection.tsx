import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="px-5 pb-10 pt-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1360px]">
        <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1f2d8c_0%,#5d4ae6_46%,#ff8c63_100%)] px-6 py-12 text-center text-white shadow-[0_24px_70px_rgba(54,43,125,0.2)] sm:px-10 md:px-12 md:py-14 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(255,255,255,0.18),transparent_16%),radial-gradient(circle_at_78%_30%,rgba(255,219,141,0.24),transparent_18%),radial-gradient(circle_at_56%_76%,rgba(255,255,255,0.08),transparent_22%)]" />
          <div className="absolute -left-20 bottom-[-56px] h-40 w-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-16 top-[-40px] h-40 w-80 rounded-full bg-[#ffbe8e]/20 blur-2xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-[18ch] text-[2.3rem] font-extrabold tracking-[-0.05em] sm:text-[3rem] md:max-w-[14ch] md:text-[3.1rem] lg:text-[3.4rem]">
              Pronto para transformar sua redação em resultado?
            </h2>
            <p className="mx-auto mt-5 max-w-[44rem] text-[1rem] leading-8 text-white/88 sm:text-[1.1rem] md:max-w-[38rem]">
              Entre em uma rotina de estudo inteligente, com propostas bem selecionadas, devolutivas claras e uma experiência pensada para quem deseja evoluir de verdade.
            </p>
            <div className="mt-9 flex justify-center">
              <Link href="/cadastro">
                <Button className="inline-flex h-14 items-center justify-center gap-3 whitespace-nowrap rounded-[20px] px-8 text-[1rem] font-bold sm:h-16 sm:px-10 sm:text-[1.05rem]">
                  <span>Criar minha conta</span>
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
