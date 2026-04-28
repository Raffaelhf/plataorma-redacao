import Link from 'next/link';
import { MessageCircle, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type HeroProps = {
  whatsappHref: string;
};

export function Hero({ whatsappHref }: HeroProps) {
  return (
    <section className="relative z-10 mx-auto grid w-full max-w-[1360px] gap-10 px-5 pb-20 pt-2 sm:px-8 md:gap-12 md:pb-24 md:pt-4 lg:grid-cols-[0.94fr_1.06fr] lg:px-12 lg:pb-28 lg:pt-3 xl:min-h-[780px] xl:items-center">
      <div className="relative max-w-[580px] pt-6 text-white md:mx-auto md:flex md:max-w-[680px] md:flex-col md:items-center md:pt-4 md:text-center lg:mx-0 lg:block lg:max-w-[580px] lg:items-start lg:pt-10 lg:text-left">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 shadow-[0_12px_30px_rgba(21,24,92,0.16)] backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-[#ffd26f]" />
          Estudo guiado para ENEM e vestibulares
        </div>

        <h1 className="max-w-[9ch] text-[3.15rem] font-extrabold leading-[0.94] tracking-[-0.055em] text-white drop-shadow-[0_10px_28px_rgba(17,19,74,0.22)] sm:text-[4rem] md:max-w-[11ch] md:text-[4.4rem] lg:max-w-[9ch] lg:text-[5rem] xl:text-[5.7rem]">
          Escreva melhor, suba sua nota.
        </h1>

        <p className="mt-7 max-w-[32rem] rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,23,83,0.16),rgba(17,23,83,0.07))] px-6 py-5 text-[1.02rem] leading-8 text-white/82 shadow-[0_18px_45px_rgba(18,20,77,0.16)] backdrop-blur-[10px] sm:text-[1.08rem] md:max-w-[40rem]">
          Uma plataforma de redação com treino contínuo, correções detalhadas e recursos pensados para quem deseja evoluir com consistência.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 md:justify-center md:gap-5 lg:justify-start">
          <Link href={whatsappHref} target="_blank" rel="noreferrer">
            <Button className="h-14 rounded-full px-7 text-[1rem] font-bold sm:h-[60px] sm:px-8 sm:text-[1.02rem]">
              <MessageCircle className="mr-2 h-5 w-5" />
              Fale conosco
            </Button>
          </Link>
          <Button
            variant="secondary"
            className="group inline-flex h-14 items-center rounded-full border border-[#d8ddff]/70 bg-[linear-gradient(135deg,rgba(249,250,255,0.96),rgba(234,239,255,0.9))] px-3 pr-6 text-[#24329c] shadow-[0_22px_44px_rgba(17,21,78,0.16)] backdrop-blur-md hover:border-white hover:bg-[linear-gradient(135deg,#ffffff,rgba(240,243,255,0.98))] hover:text-[#1f2b86] sm:h-[60px] sm:pr-7"
          >
            <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3f4bd5_0%,#5e67ea_100%)] text-white shadow-[0_10px_22px_rgba(63,75,213,0.28)] transition-transform duration-200 group-hover:scale-105">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </span>
            <span className="flex items-center text-[1rem] font-bold leading-none sm:text-[1.02rem]">
              Ver vídeo
            </span>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/78 md:justify-center md:max-w-[42rem] lg:justify-start">
          <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 shadow-[0_12px_26px_rgba(17,21,78,0.14)] backdrop-blur-md">
            Correções com rubrica
          </span>
          <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 shadow-[0_12px_26px_rgba(17,21,78,0.14)] backdrop-blur-md">
            Plano de estudo
          </span>
          <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 shadow-[0_12px_26px_rgba(17,21,78,0.14)] backdrop-blur-md">
            Histórico de evolução
          </span>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[760px] items-center justify-center md:max-w-[820px] lg:max-w-none">
        <div className="absolute inset-[7%] rounded-[48px] bg-[radial-gradient(circle_at_58%_22%,rgba(255,255,255,0.24),transparent_22%),radial-gradient(circle_at_78%_20%,rgba(255,214,114,0.24),transparent_12%),radial-gradient(circle_at_66%_62%,rgba(255,154,95,0.18),transparent_18%),radial-gradient(circle_at_28%_61%,rgba(112,216,255,0.16),transparent_22%)] blur-[16px]" />
        <div className="absolute left-[9%] top-[18%] h-12 w-12 rounded-[16px] border border-white/12 bg-white/8 shadow-[0_14px_30px_rgba(17,21,78,0.14)] backdrop-blur-md" />
        <div className="absolute right-[6%] top-[12%] h-20 w-20 rounded-full border border-white/12 bg-white/8 shadow-[0_14px_30px_rgba(17,21,78,0.14)] backdrop-blur-md" />
        <div className="absolute bottom-[8%] left-[14%] h-16 w-16 rounded-full border border-white/12 bg-white/6 shadow-[0_14px_30px_rgba(17,21,78,0.14)] backdrop-blur-md" />

        <div className="relative aspect-[700/540] w-full max-w-[760px] overflow-hidden rounded-[32px] border border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))] p-3 shadow-[0_30px_72px_rgba(17,21,78,0.24)] backdrop-blur-md sm:p-5 md:max-w-[820px] md:rounded-[38px] xl:max-w-[820px]">
          <div className="pointer-events-none absolute inset-x-[10%] top-0 h-16 rounded-full bg-white/10 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[26px] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] md:rounded-[32px]">
            <video
              className="h-full w-full scale-[1.06] object-cover object-center"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="Vídeo principal da Escreva Mais"
            >
              <source src="/landing/video-banner.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-tl-[36px] bg-[radial-gradient(circle_at_bottom_right,rgba(20,26,92,0.995)_0%,rgba(28,34,108,0.97)_34%,rgba(44,50,144,0.9)_55%,rgba(44,50,144,0)_82%)] blur-[3px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
