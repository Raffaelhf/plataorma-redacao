import { featureItems } from './data';

export function Features() {
  return (
    <section id="recursos" className="relative px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-20">
      <div className="absolute inset-x-0 top-10 h-[320px] bg-[radial-gradient(circle_at_12%_50%,rgba(89,124,255,0.12),transparent_18%),radial-gradient(circle_at_88%_20%,rgba(255,143,98,0.14),transparent_16%)]" />
      <div className="mx-auto max-w-[1360px]">
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[linear-gradient(90deg,transparent,#cfd3ef)] dark:bg-[linear-gradient(90deg,transparent,#334155)]" />
          <h2 className="text-center text-[2rem] font-extrabold tracking-[-0.05em] text-slate-900 dark:text-slate-50 sm:text-[2.55rem] md:text-[2.35rem]">
            Por que escolher a Escreva Mais?
          </h2>
          <div className="h-px flex-1 bg-[linear-gradient(90deg,#cfd3ef,transparent)] dark:bg-[linear-gradient(90deg,#334155,transparent)]" />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featureItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="relative rounded-[28px] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.84))] p-6 shadow-[0_18px_50px_rgba(76,74,138,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,24,39,0.9))] dark:shadow-[0_18px_50px_rgba(0,0,0,0.24)] md:p-7"
              >
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tint} ${item.color} dark:from-slate-800 dark:to-slate-900`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-[1.35rem] font-extrabold tracking-[-0.04em] text-slate-900 dark:text-slate-50">{item.title}</h3>
                <div className="my-5 h-px bg-[#e6e9f6] dark:bg-slate-700" />
                <p className="max-w-[32ch] text-[1rem] leading-8 text-[#46547f] dark:text-slate-300">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
