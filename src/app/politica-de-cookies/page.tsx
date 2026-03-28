import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/legal/legal-page-shell';
import { getPlatformWhatsAppContact } from '@/lib/platform-contact';

export const metadata: Metadata = {
  title: 'Política de Cookies | Escreva Mais',
  description: 'Informações sobre os cookies utilizados pela plataforma Escreva Mais.',
};

export default async function CookiePolicyPage() {
  const whatsappContact = await getPlatformWhatsAppContact();

  return (
    <LegalPageShell
      eyebrow="Cookies"
      title="Política de Cookies"
      description="Esta política descreve como a Escreva Mais utiliza cookies e tecnologias semelhantes para manter a plataforma funcionando com segurança, login, checkout e memória de preferências do usuário."
      updatedAt="18/03/2026"
    >
      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">1. O que são cookies</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Cookies são pequenos arquivos gravados no navegador para reconhecer sessões, preservar preferências e apoiar recursos técnicos do site. Tecnologias equivalentes também podem ser usadas para finalidades semelhantes.</p>
          <p>Na Escreva Mais, os cookies são usados principalmente para autenticação, segurança, fluxo de pagamento e memória do aviso de cookies apresentado ao usuário.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">2. Categorias de cookies utilizadas</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <li>Cookies necessários: mantêm a sessão autenticada, ajudam a proteger o login, a navegação autenticada e as operações essenciais da conta.</li>
          <li>Cookies funcionais: registram a ciência do aviso de cookies para evitar exibição repetida a cada visita.</li>
          <li>Cookies de checkout e segurança: apoiam o redirecionamento seguro para pagamento e a integridade do fluxo de assinatura.</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          No momento, a plataforma não instala, por padrão, cookies próprios de publicidade comportamental ou rastreamento de marketing. Se isso mudar, esta política será atualizada.
        </p>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">3. Cookies de terceiros</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Quando o usuário é direcionado para o ambiente externo de pagamento, o provedor Mercado Pago pode aplicar seus próprios cookies e mecanismos de segurança, de acordo com as políticas dele.</p>
          <p>Esses cookies de terceiros são regidos pelas regras do respectivo fornecedor e podem continuar ativos fora do domínio principal da plataforma.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">4. Como gerenciar cookies</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Você pode bloquear ou remover cookies nas configurações do navegador. No entanto, a desativação de cookies necessários pode impedir login, manutenção da sessão, checkout e outras funções essenciais.</p>
          <p>O aviso exibido pela plataforma grava apenas a preferência de ciência sobre esta política, para não repetir a mensagem em todas as visitas.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-[linear-gradient(135deg,#f7f9ff_0%,#fff5ef_100%)] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">5. Contato e política complementar</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>
            Para mais informações sobre tratamento de dados pessoais, consulte a{' '}
            <Link href="/privacidade" className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4">
              Política de Privacidade e LGPD
            </Link>
            .
          </p>
          {whatsappContact?.href ? (
            <p>
              Em caso de dúvidas, utilize o canal oficial disponível no momento:{' '}
              <a
                href={whatsappContact.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4"
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
