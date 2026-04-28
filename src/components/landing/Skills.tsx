import Image from 'next/image';

const skillCards = [
  {
    title: 'Desafios de Escrita',
    description: 'Temas criativos e exercicios guiados para tirar voce da pagina em branco.',
    image: '/landing/skill-dseafios.png',
    tone: 'from-[#0f4a90]/70 to-transparent',
    titleClass: 'text-white',
    bodyClass: 'text-white/88',
  },
  {
    title: 'Banco de Redacoes',
    description: 'Modelos fortes, repertorio e exemplos de estrutura para servir de referencia.',
    image: '/landing/skill-banco.png',
    tone: 'from-[#a4431f]/35 to-transparent',
    titleClass: 'text-white',
    bodyClass: 'text-white/88',
  },
  {
    title: 'Dicas e Exemplos',
    description: 'Guias objetivos para argumentacao, coesao e desenvolvimento de tese.',
    image: '/landing/skill-dicas.png',
    tone: 'from-[#ffffff]/45 to-transparent',
    titleClass: 'text-[#51315c]',
    bodyClass: 'text-[#614b6a]',
  },
];

export function Skills() {
  return (
    <section className="px-5 pb-12 pt-16 sm:px-8 lg:px-12 lg:pt-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-3 flex items-center gap-4">
          <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#cfd3ef)]" />
          <h2 className="text-center text-[2rem] font-extrabold tracking-[-0.05em] text-slate-900 sm:text-[2.55rem] md:text-[2.35rem]">
            Desenvolva suas habilidades de escrita
          </h2>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#cfd3ef,transparent)]" />
        </div>
        <p className="text-center text-[1rem] text-[#596898] sm:text-[1.08rem]">
          Recursos praticos para desenvolver repertorio, estrutura e consistencia textual.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillCards.map((card, index) => (
            <article
              key={card.title}
              className={`group relative overflow-hidden rounded-[30px] border border-white/60 shadow-[0_20px_60px_rgba(74,73,140,0.14)] ${
                index === skillCards.length - 1 ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-[620px] xl:col-span-1 xl:mx-0 xl:max-w-none' : ''
              }`}
            >
              <div className={`relative aspect-[353/210] ${index === skillCards.length - 1 ? 'md:aspect-[620/270] xl:aspect-[420/240]' : 'md:aspect-[420/255] xl:aspect-[420/240]'}`}>
                <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 420px" />
                <div className={`absolute inset-0 bg-gradient-to-br ${card.tone} via-transparent to-black/10`} />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                    <h3 className={`max-w-[14ch] text-[1.3rem] font-extrabold tracking-[-0.04em] ${card.titleClass}`}>{card.title}</h3>
                    <p className={`mt-3 max-w-[26ch] text-[0.98rem] leading-7 ${card.bodyClass}`}>{card.description}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
