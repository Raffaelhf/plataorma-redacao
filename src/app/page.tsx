import { CTASection } from '@/components/landing/CTASection';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';
import { Plans } from '@/components/landing/Plans';
import { Skills } from '@/components/landing/Skills';
import { getPlatformWhatsAppHref } from '@/lib/platform-contact';

export default async function Home() {
  const whatsappHref = await getPlatformWhatsAppHref();

  return (
    <main className="landing-shell min-h-screen overflow-x-hidden">
      <section className="relative overflow-hidden bg-[linear-gradient(132deg,#171d5a_0%,#2f3298_36%,#5e4fd0_68%,#d8927d_100%)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,79,0.94)_0%,rgba(41,44,132,0.84)_36%,rgba(89,67,188,0.54)_62%,rgba(226,151,123,0.18)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(255,255,255,0.14),transparent_16%),radial-gradient(circle_at_80%_18%,rgba(255,224,176,0.18),transparent_14%),radial-gradient(circle_at_70%_64%,rgba(255,164,120,0.12),transparent_18%)]" />
        <Header />
        <Hero whatsappHref={whatsappHref} />
        <div className="absolute bottom-[-92px] left-1/2 h-[186px] w-[130%] -translate-x-1/2 rounded-[999px] bg-[#f7f3ff] dark:bg-[#08101d]" />
      </section>

      <Features />
      <Skills />
      <Plans />
      <CTASection />
      <Footer whatsappHref={whatsappHref} />
    </main>
  );
}
