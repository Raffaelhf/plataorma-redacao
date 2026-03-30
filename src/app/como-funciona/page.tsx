import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import { ProgramOverview } from '@/components/landing/ProgramOverview';
import { getPlatformWhatsAppHref } from '@/lib/platform-contact';

export default async function HowItWorksPage() {
  const whatsappHref = await getPlatformWhatsAppHref();

  return (
    <main className="landing-shell min-h-screen overflow-x-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(132deg,#171d5a_0%,#2f3298_36%,#5e4fd0_68%,#d8927d_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.94)_0%,rgba(41,44,132,0.84)_36%,rgba(89,67,188,0.54)_62%,rgba(226,151,123,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.14),transparent_16%),radial-gradient(circle_at_80%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_70%_64%,rgba(255,164,120,0.12),transparent_18%)]" />
        <Header />

        <div className="relative mx-auto flex w-full max-w-[1360px] flex-col px-5 pb-24 pt-6 text-white sm:px-8 lg:px-12 lg:pb-28">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/88 shadow-[0_14px_30px_rgba(16,20,74,0.16)] backdrop-blur-md">
              Como Funciona
            </p>
            <h1 className="mt-6 text-[2.4rem] font-extrabold tracking-[-0.06em] text-white sm:text-[3.4rem] lg:text-[4.2rem]">
              Entenda a rotina do programa antes de entrar.
            </h1>
            <p className="mt-5 max-w-3xl text-[1.02rem] leading-8 text-white/78 sm:text-[1.08rem]">
              Aqui esta a estrutura completa da jornada: aulas teoricas, lives quinzenais, clube de leitura, materiais e acompanhamento que sustentam a evolucao do aluno ao longo do ano.
            </p>
          </div>
        </div>

        <div className="absolute bottom-[-92px] left-1/2 h-[186px] w-[130%] -translate-x-1/2 rounded-[999px] bg-[#f7f3ff] dark:bg-[#08101d]" />
      </section>

      <ProgramOverview />
      <CTASection />
      <Footer whatsappHref={whatsappHref} />
    </main>
  );
}
