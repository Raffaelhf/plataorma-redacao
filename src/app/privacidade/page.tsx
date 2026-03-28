import type { Metadata } from 'next';
import Link from 'next/link';
import { Database, Lock, Scale, ShieldCheck } from 'lucide-react';
import { LegalPageShell } from '@/components/legal/legal-page-shell';
import { getPlatformWhatsAppContact } from '@/lib/platform-contact';

export const metadata: Metadata = {
  title: 'Privacidade e LGPD | Escreva Mais',
  description: 'Como a Escreva Mais coleta, usa, compartilha e protege dados pessoais em conformidade com a LGPD.',
};

const highlightItems = [
  {
    icon: Database,
    title: 'Dados para operar a plataforma',
    description: 'Tratamos dados de cadastro, acesso, atividades e historico pedagogico para viabilizar o servico.',
    tint: 'from-[#eef2ff] to-[#f7f8ff]',
    color: 'text-[#4350c9]',
  },
  {
    icon: ShieldCheck,
    title: 'Seguranca e protecao',
    description: 'Aplicamos medidas tecnicas e organizacionais para reduzir riscos de acesso indevido e incidentes.',
    tint: 'from-[#edf8f2] to-[#f4fbf7]',
    color: 'text-[#1f7d61]',
  },
  {
    icon: Scale,
    title: 'Direitos do titular',
    description: 'O usuario pode solicitar acesso, correcao, revisao de consentimento e outros direitos previstos na LGPD.',
    tint: 'from-[#fff2e9] to-[#fffaf5]',
    color: 'text-[#ff7f32]',
  },
];

const sections = [
  {
    number: '01',
    title: 'Quais dados tratamos',
    body: [
      'Podemos tratar dados de identificacao e contato, como nome, e-mail, credenciais de acesso e informacoes cadastrais relacionadas ao perfil de aluno ou professor.',
      'Tambem tratamos dados ligados ao uso da plataforma, como redacoes enviadas, feedbacks, historico de atividades, desempenho, datas de acesso e registros tecnicos necessarios para autenticacao, seguranca e operacao do sistema.',
      'No fluxo de assinatura, tratamos informacoes de checkout e cobranca. Dados sensiveis de pagamento, como cartao e autenticacoes bancarias, sao processados em ambiente externo do provedor e nao ficam armazenados integralmente na plataforma.',
    ],
  },
  {
    number: '02',
    title: 'Para que usamos esses dados',
    list: [
      'Executar o cadastro, autenticar usuarios, liberar acesso a conteudos e manter a conta ativa.',
      'Permitir o envio de redacoes, a correcao por professores, a exibicao de desempenho e a prestacao dos servicos educacionais contratados.',
      'Processar cobrancas, registrar o status da assinatura e prevenir fraudes ou usos indevidos.',
      'Atender obrigacoes legais, regulatorias e administrativas relacionadas ao servico.',
      'Responder solicitacoes de suporte, seguranca da informacao e exercicio de direitos previstos na LGPD.',
    ],
    note: 'As bases legais aplicaveis podem incluir execucao de contrato, cumprimento de obrigacao legal, exercicio regular de direitos, protecao do credito, legitimo interesse e consentimento, quando cabivel.',
  },
  {
    number: '03',
    title: 'Compartilhamento de dados',
    body: [
      'Os dados podem ser compartilhados com operadores e fornecedores que viabilizam a operacao da plataforma, como infraestrutura, banco de dados, envio de e-mails transacionais, autenticacao e processamento de pagamentos.',
      'Quando o usuario segue para o checkout, o pagamento e processado pelo Mercado Pago em ambiente proprio do provedor, sujeito tambem aos seus termos e politicas.',
      'Nao comercializamos dados pessoais. Qualquer compartilhamento deve observar finalidade legitima, necessidade e medidas razoaveis de seguranca.',
    ],
  },
  {
    number: '04',
    title: 'Retencao e seguranca',
    body: [
      'Os dados pessoais sao mantidos pelo tempo necessario para cumprir as finalidades desta politica, viabilizar o historico pedagogico, cumprir obrigacoes legais e resguardar direitos da plataforma em processos administrativos, judiciais ou arbitrais.',
      'Adotamos medidas tecnicas e organizacionais razoaveis para reduzir o risco de acesso nao autorizado, perda, alteracao ou divulgacao indevida. Ainda assim, nenhum ambiente digital e completamente imune a incidentes.',
      'Se houver incidente de seguranca relevante envolvendo dados pessoais, a plataforma adotara as medidas cabiveis nos termos da legislacao aplicavel.',
    ],
  },
  {
    number: '05',
    title: 'Direitos do titular segundo a LGPD',
    list: [
      'Confirmacao da existencia de tratamento e acesso aos dados pessoais.',
      'Correcao de dados incompletos, inexatos ou desatualizados.',
      'Anonimizacao, bloqueio ou eliminacao de dados desnecessarios, excessivos ou tratados em desconformidade, quando aplicavel.',
      'Portabilidade, informacoes sobre compartilhamento e revisao de consentimentos concedidos, quando aplicavel.',
      'Revogacao do consentimento e solicitacao de eliminacao dos dados tratados com essa base legal, observadas as hipoteses legais de guarda.',
    ],
    note: 'Caso a resposta nao seja satisfatoria, o titular podera buscar os canais da Autoridade Nacional de Protecao de Dados, nos termos da LGPD.',
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

export default async function PrivacyPage() {
  const whatsappContact = await getPlatformWhatsAppContact();

  return (
    <LegalPageShell
      eyebrow="Privacidade"
      title="Politica de Privacidade e LGPD"
      description="Este documento explica como a Escreva Mais trata dados pessoais de alunos, professores e visitantes, quais sao as finalidades desse tratamento e como exercer os direitos previstos na Lei Geral de Protecao de Dados."
      updatedAt="18/03/2026"
    >
      <section className="rounded-[32px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_54%,#fff5ed_100%)] p-6 shadow-[0_22px_60px_rgba(74,73,140,0.12)] dark:border-slate-700/70 dark:bg-[linear-gradient(135deg,#0f172a_0%,#172033_54%,#241a1a_100%)] dark:shadow-[0_22px_60px_rgba(0,0,0,0.28)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-white shadow-[0_14px_28px_rgba(67,80,211,0.24)] dark:bg-[linear-gradient(135deg,#4f5ee8_0%,#7a84ff_100%)]">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1] dark:text-indigo-200">
              Em resumo
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-50">
              Tratamos o minimo necessario para prestar o servico, proteger a conta e cumprir obrigacoes legais.
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
          Como exercer seus direitos
        </h2>

        <div className="mt-4 space-y-4 text-[1rem] leading-8 text-slate-700 dark:text-slate-300">
          <p>
            Solicitacoes relacionadas a privacidade, acesso, correcao ou exclusao podem ser enviadas pelos canais oficiais de atendimento da plataforma.
          </p>

          {whatsappContact?.href ? (
            <p>
              Canal atualmente disponivel:{' '}
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

          <p>
            Para detalhes sobre cookies, preferencia de aviso e tecnologias correlatas, consulte a{' '}
            <Link
              href="/politica-de-cookies"
              className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-indigo-300 dark:decoration-slate-600"
            >
              Politica de Cookies
            </Link>
            .
          </p>
        </div>
      </section>
    </LegalPageShell>
  );
}
