import type { Metadata } from 'next';
import Link from 'next/link';
import { BookCheck, CreditCard, FileText, Shield, Wrench, XCircle } from 'lucide-react';
import { LegalPageShell } from '@/components/legal/legal-page-shell';

export const metadata: Metadata = {
  title: 'Termos de Servico | Escreva Mais',
  description: 'Regras gerais de uso da plataforma Escreva Mais.',
};

const highlightItems = [
  {
    icon: BookCheck,
    title: 'Uso educacional da plataforma',
    description: 'A conta existe para estudo, pratica de redacao, acompanhamento e acesso aos recursos contratados.',
    tint: 'from-[#eef2ff] to-[#f7f8ff]',
    color: 'text-[#4350c9]',
  },
  {
    icon: CreditCard,
    title: 'Planos e cobranca',
    description: 'A liberacao de acesso pode depender da confirmacao de pagamento em provedor externo.',
    tint: 'from-[#fff2e9] to-[#fffaf5]',
    color: 'text-[#ff7f32]',
  },
  {
    icon: Shield,
    title: 'Responsabilidade de uso',
    description: 'O usuario deve manter credenciais seguras e respeitar as regras de uso da conta.',
    tint: 'from-[#edf8f2] to-[#f4fbf7]',
    color: 'text-[#1f7d61]',
  },
];

const sections = [
  {
    number: '01',
    title: 'Objeto',
    body: [
      'A plataforma oferece recursos de pratica de redacao, acompanhamento pedagogico, correcao, videoaulas, atividades e areas administrativas vinculadas ao servico contratado.',
      'O uso da plataforma depende de cadastro valido, aceite destes termos e respeito as regras operacionais e de convivencia aplicaveis.',
    ],
  },
  {
    number: '02',
    title: 'Conta e responsabilidade do usuario',
    list: [
      'O usuario deve fornecer dados verdadeiros, atualizados e manter o sigilo de suas credenciais de acesso.',
      'E vedado compartilhar conta, tentar acessar areas sem autorizacao, interferir na seguranca da aplicacao ou usar a plataforma para finalidade ilicita.',
      'Conteudos enviados para correcao ou interacao devem respeitar a legislacao, os direitos autorais e as regras de uso da comunidade academica.',
    ],
  },
  {
    number: '03',
    title: 'Planos, cobranca e liberacao de acesso',
    body: [
      'Planos pagos podem exigir confirmacao de pagamento por provedor externo antes da liberacao do acesso. Enquanto a confirmacao nao ocorrer, a conta pode permanecer pendente.',
      'O processamento financeiro acontece em ambiente seguro de terceiro especializado. A plataforma nao armazena dados sensiveis completos de cartao.',
      'Falhas de pagamento, chargeback, fraude, uso abusivo ou descumprimento destes termos podem resultar em bloqueio ou cancelamento do acesso, conforme o caso.',
    ],
  },
  {
    number: '04',
    title: 'Conteudo, disponibilidade e limitacoes',
    body: [
      'Os conteudos educacionais, trilhas, correcoes e materiais de apoio sao disponibilizados conforme a estrutura do plano, a agenda academica e a evolucao da plataforma.',
      'A Escreva Mais pode promover manutencoes, atualizacoes, ajustes de funcionalidades e melhorias tecnicas, inclusive com indisponibilidades temporarias.',
      'Sem prejuizo do dever de cuidado, a plataforma nao garante operacao ininterrupta ou totalmente livre de falhas em qualquer ambiente digital.',
    ],
  },
];

function SectionCard({
  number,
  title,
  body,
  list,
}: {
  number: string;
  title: string;
  body?: string[];
  list?: string[];
}) {
  return (
    <section className="rounded-[30px] border border-[#dbe1fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,249,255,0.92))] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-sm font-extrabold tracking-[0.06em] text-white shadow-[0_14px_28px_rgba(67,80,211,0.24)]">
          {number}
        </div>

        <div className="flex-1">
          <h2 className="text-[1.6rem] font-extrabold tracking-[-0.04em] text-slate-900 sm:text-[1.9rem]">
            {title}
          </h2>

          {body ? (
            <div className="mt-4 space-y-4 text-[1rem] leading-8 text-slate-700">
              {body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {list ? (
            <ul className="mt-4 space-y-3 text-[1rem] leading-8 text-slate-700">
              {list.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#5a67e8]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Termos"
      title="Termos de Servico"
      description="Estes termos disciplinam o acesso e o uso da plataforma Escreva Mais por alunos, professores e demais usuarios cadastrados."
      updatedAt="18/03/2026"
    >
      <section className="rounded-[32px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#ffffff_0%,#f5f2ff_54%,#fff5ed_100%)] p-6 shadow-[0_22px_60px_rgba(74,73,140,0.12)] sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4350d3_0%,#6972ee_100%)] text-white shadow-[0_14px_28px_rgba(67,80,211,0.24)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#5a69a1]">
              Em resumo
            </p>
            <p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-900">
              Estes termos explicam como a conta deve ser usada, quando o acesso e liberado e quais limites se aplicam ao servico.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {highlightItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[26px] border border-[#e4e8f7] bg-white/84 p-5 shadow-[0_16px_40px_rgba(74,73,140,0.08)]"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tint} ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold tracking-[-0.03em] text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
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

      <section className="rounded-[30px] border border-[#dbe1fb] bg-[linear-gradient(135deg,#fbfcff_0%,#fff4ee_100%)] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-[#e4e8f7] bg-white/82 p-5">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-[#4350c9]" />
              <h2 className="text-lg font-bold tracking-[-0.03em] text-slate-900">
                Plataforma em evolucao
              </h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Funcionalidades, conteudos e estruturas podem ser ajustados ao longo do tempo para melhorar o servico e a experiencia do aluno.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ffd9cb] bg-[linear-gradient(135deg,rgba(255,244,238,0.96),rgba(255,251,247,0.92))] p-5">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-[#cf5b34]" />
              <h2 className="text-lg font-bold tracking-[-0.03em] text-slate-900">
                Bloqueio por uso indevido
              </h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              Fraude, chargeback, compartilhamento indevido de conta ou violacao das regras pode resultar em restricao ou cancelamento de acesso.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-[1rem] leading-8 text-slate-700">
          <p>
            O tratamento de dados pessoais segue a{' '}
            <Link
              href="/privacidade"
              className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4"
            >
              Politica de Privacidade e LGPD
            </Link>{' '}
            e a{' '}
            <Link
              href="/politica-de-cookies"
              className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4"
            >
              Politica de Cookies
            </Link>
            .
          </p>
          <p>
            Ao continuar usando a plataforma, o usuario declara que leu e compreendeu estes documentos na extensao aplicavel ao seu relacionamento com o servico.
          </p>
        </div>
      </section>
    </LegalPageShell>
  );
}
