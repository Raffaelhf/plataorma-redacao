import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Cookie, LockKeyhole, ShieldCheck } from 'lucide-react';
import { LegalPageShell } from '@/components/legal/legal-page-shell';
import { getPlatformWhatsAppContact } from '@/lib/platform-contact';

export const metadata: Metadata = {
  title: 'Politica de Cookies | Escreva Mais',
  description: 'Informacoes sobre os cookies utilizados pela plataforma Escreva Mais.',
};

const highlightItems = [
  {
    icon: ShieldCheck,
    title: 'Cookies necessarios',
    description: 'Garantem autenticacao, seguranca da sessao e o funcionamento das areas protegidas.',
    tint: 'from-[#eef2ff] to-[#f7f8ff]',
    color: 'text-[#4350c9]',
  },
  {
    icon: CheckCircle2,
    title: 'Preferencia do aviso',
    description: 'Registra que voce ja visualizou o banner para evitar repeticao em toda visita.',
    tint: 'from-[#edf8f2] to-[#f4fbf7]',
    color: 'text-[#1f7d61]',
  },
  {
    icon: LockKeyhole,
    title: 'Checkout seguro',
    description: 'Apoia a integridade do redirecionamento para pagamento e do fluxo de assinatura.',
    tint: 'from-[#fff2e9] to-[#fffaf5]',
    color: 'text-[#ff7f32]',
  },
];

const sections = [
  {
    number: '01',
    title: 'O que sao cookies',
    body: [
      'Cookies sao pequenos arquivos gravados no navegador para reconhecer sessoes, preservar preferencias e apoiar recursos tecnicos do site. Tecnologias equivalentes tambem podem ser usadas para finalidades semelhantes.',
      'Na Escreva Mais, eles sao utilizados principalmente para autenticacao, seguranca, fluxo de pagamento e memoria da sua preferencia sobre o aviso de cookies.',
    ],
  },
  {
    number: '02',
    title: 'Quais categorias usamos',
    list: [
      'Cookies necessarios: mantem a sessao autenticada, ajudam a proteger o login e apoiam operacoes essenciais da conta.',
      'Cookies funcionais: registram a ciencia do aviso de cookies para evitar exibicao repetida a cada acesso.',
      'Cookies de checkout e seguranca: apoiam o redirecionamento seguro para pagamento e a integridade do fluxo de assinatura.',
    ],
    note: 'No momento, a plataforma nao instala por padrao cookies proprios de publicidade comportamental ou rastreamento de marketing. Se isso mudar, esta politica sera atualizada.',
  },
  {
    number: '03',
    title: 'Cookies de terceiros',
    body: [
      'Quando voce e direcionado para o ambiente externo de pagamento, o provedor Mercado Pago pode aplicar seus proprios cookies e mecanismos de seguranca, de acordo com as politicas dele.',
      'Esses cookies de terceiros sao regidos pelas regras do respectivo fornecedor e podem continuar ativos fora do dominio principal da plataforma.',
    ],
  },
  {
    number: '04',
    title: 'Como gerenciar cookies',
    body: [
      'Voce pode bloquear ou remover cookies nas configuracoes do navegador. Ainda assim, a desativacao de cookies necessarios pode impedir login, manutencao da sessao, checkout e outras funcoes essenciais.',
      'O aviso exibido pela plataforma grava apenas a preferencia sobre esta politica, para nao repetir a mensagem em todas as visitas.',
    ],
  },
];

function SectionCard({
  number,
  title,
  body,
  list,
  note,
}: {
  number: string;
  title: string;
  body?: string[];
  list?: string[];
  note?: string;
}) {
  return (
    <section className="rounded-[30px] border border-[#dbe1fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,249,255,0.92))] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(11,18,32,0.96),rgba(17,24,39,0.92))] dark:shadow-[0_20px_54px_rgba(0,0,0,0.24)] sm:p-7">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-sm font-extrabold tracking-[0.06em] text-white shadow-[0_14px_28px_rgba(67,80,211,0.24)] dark:bg-[linear-gradient(135deg,#4f5ee8_0%,#7a84ff_100%)]">
          {number}
        </div>

        <div className="flex-1">
          <h2 className="text-[1.6rem] font-extrabold tracking-[-0.04em] text-slate-900 dark:text-slate-50 sm:text-[1.9rem]">
            {title}
          </h2>

          {body ? (
            <div className="mt-4 space-y-4 text-[1rem] leading-8 text-slate-700 dark:text-slate-300">
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {list ? (
            <ul className="mt-4 space-y-3 text-[1rem] leading-8 text-slate-700 dark:text-slate-300">
              {list.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#5a67e8] dark:bg-indigo-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {note ? (
            <div className="mt-5 rounded-[22px] border border-[#e4e8f7] bg-[#f8faff] px-4 py-4 text-sm leading-7 text-[#51608f] dark:border-slate-700 dark:bg-slate-800/72 dark:text-slate-300">
              {note}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default async function CookiePolicyPage() {
  const whatsappContact = await getPlatformWhatsAppContact();

  return (
    <LegalPageShell
      eyebrow="Cookies"
      title="Politica de Cookies"
      description="Esta politica explica como a Escreva Mais utiliza cookies e tecnologias semelhantes para manter a plataforma funcionando com seguranca, login, checkout e memoria de preferencias do usuario."
      updatedAt="18/03/2026"
    >
      <section className="rounded-[32px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_54%,#fff5ed_100%)] p-6 shadow-[0_22px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(135deg,#0f172a_0%,#172033_54%,#241a1a_100%)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-white shadow-[0_14px_28px_rgba(67,80,211,0.24)] dark:bg-[linear-gradient(135deg,#4f5ee8_0%,#7a84ff_100%)]">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1] dark:text-indigo-200">
              Em resumo
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
              Usamos apenas o necessario para a plataforma operar com seguranca e previsibilidade.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlightItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[26px] border border-[#e4e8f7] bg-white/84 p-5 shadow-[0_16px_40px_rgba(74,73,140,0.08)] dark:border-slate-700 dark:bg-slate-900/74 dark:shadow-[0_16px_40px_rgba(0,0,0,0.22)]"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tint} ${item.color} dark:from-slate-800 dark:to-slate-900`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <div className="grid gap-6">
        {sections.map((section) => (
          <SectionCard key={section.title} {...section} />
        ))}
      </div>

      <section className="rounded-[30px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#fbfcff_0%,#fff4ee_100%)] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] dark:border-slate-700/70 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(48,29,41,0.9))] dark:shadow-[0_20px_54px_rgba(0,0,0,0.24)] sm:p-7">
        <h2 className="text-[1.6rem] font-extrabold tracking-[-0.04em] text-slate-900 dark:text-slate-50 sm:text-[1.9rem]">
          Contato e politica complementar
        </h2>

        <div className="mt-4 space-y-4 text-[1rem] leading-8 text-slate-700 dark:text-slate-300">
          <p>
            Para mais informacoes sobre tratamento de dados pessoais, consulte a{' '}
            <Link
              href="/privacidade"
              className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-indigo-300 dark:decoration-slate-600"
            >
              Politica de Privacidade e LGPD
            </Link>
            .
          </p>

          {whatsappContact?.href ? (
            <p>
              Em caso de duvidas, utilize o canal oficial disponivel no momento:{' '}
              <a
                href={whatsappContact.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-indigo-300 dark:decoration-slate-600"
              >
                WhatsApp {whatsappContact.label}
              </a>
              .
            </p>
          ) : null}
        </div>
      </section>
    </LegalPageShell>
  );
}
