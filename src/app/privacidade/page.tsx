import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/legal/legal-page-shell';
import { getPlatformWhatsAppContact } from '@/lib/platform-contact';

export const metadata: Metadata = {
  title: 'Privacidade e LGPD | Escreva Mais',
  description: 'Como a Escreva Mais coleta, usa, compartilha e protege dados pessoais em conformidade com a LGPD.',
};

export default async function PrivacyPage() {
  const whatsappContact = await getPlatformWhatsAppContact();

  return (
    <LegalPageShell
      eyebrow="Privacidade"
      title="Política de Privacidade e LGPD"
      description="Este documento explica como a plataforma Escreva Mais trata dados pessoais de alunos, professores e visitantes, quais são as finalidades desse tratamento e como exercer os direitos previstos na Lei Geral de Proteção de Dados."
      updatedAt="18/03/2026"
    >
      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">1. Quais dados tratamos</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Podemos tratar dados de identificação e contato, como nome, e-mail, credenciais de acesso e informações cadastrais relacionadas ao perfil de aluno ou professor.</p>
          <p>Também tratamos dados ligados ao uso da plataforma, como redações enviadas, feedbacks, histórico de atividades, desempenho, datas de acesso e registros técnicos necessários para autenticação, segurança e operação do sistema.</p>
          <p>No fluxo de assinatura, tratamos informações de checkout e cobrança. Os dados sensíveis de pagamento, como cartão e autenticações bancárias, são processados em ambiente externo do provedor de pagamento e não ficam armazenados na plataforma.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">2. Para que usamos esses dados</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <li>Executar o cadastro, autenticar usuários, liberar acesso a conteúdos e manter a conta ativa.</li>
          <li>Permitir o envio de redações, a correção por professores, a exibição de desempenho e a prestação dos serviços educacionais contratados.</li>
          <li>Processar cobranças, registrar o status da assinatura e prevenir fraudes ou usos indevidos.</li>
          <li>Atender obrigações legais, regulatórias e administrativas relacionadas ao serviço.</li>
          <li>Responder solicitações de suporte, segurança da informação e exercício de direitos previstos na LGPD.</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          As bases legais aplicáveis podem incluir execução de contrato, cumprimento de obrigação legal, exercício regular de direitos, proteção do crédito, legítimo interesse e consentimento, quando cabível.
        </p>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">3. Compartilhamento de dados</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Os dados podem ser compartilhados com operadores e fornecedores que viabilizam a operação da plataforma, como infraestrutura, banco de dados, envio de e-mails transacionais, autenticação e processamento de pagamentos.</p>
          <p>Quando o usuário segue para o checkout, o pagamento é processado pelo Mercado Pago em ambiente próprio do provedor, sujeito também aos seus termos e políticas.</p>
          <p>Não comercializamos dados pessoais. Qualquer compartilhamento deve observar finalidade legítima, necessidade e medidas razoáveis de segurança.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">4. Retenção e segurança</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Os dados pessoais são mantidos pelo tempo necessário para cumprir as finalidades desta política, viabilizar o histórico pedagógico, cumprir obrigações legais e resguardar direitos da plataforma em processos administrativos, judiciais ou arbitrais.</p>
          <p>Adotamos medidas técnicas e organizacionais razoáveis para reduzir o risco de acesso não autorizado, perda, alteração ou divulgação indevida. Ainda assim, nenhum ambiente digital é completamente imune a incidentes.</p>
          <p>Se houver incidente de segurança relevante envolvendo dados pessoais, a plataforma adotará as medidas cabíveis nos termos da legislação aplicável.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">5. Direitos do titular segundo a LGPD</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <li>Confirmação da existência de tratamento e acesso aos dados pessoais.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade, quando aplicável.</li>
          <li>Portabilidade, informações sobre compartilhamento e revisão de consentimentos concedidos, quando aplicável.</li>
          <li>Revogação do consentimento e solicitação de eliminação dos dados tratados com essa base legal, observadas as hipóteses legais de guarda.</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          Caso a resposta não seja satisfatória, o titular poderá buscar os canais da Autoridade Nacional de Proteção de Dados, nos termos da LGPD.
        </p>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">6. Como exercer seus direitos</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Solicitações relacionadas à privacidade, ao acesso, à correção ou à exclusão podem ser enviadas pelos canais oficiais de atendimento da plataforma.</p>
          {whatsappContact?.href ? (
            <p>
              Canal atualmente disponível:{' '}
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
          <p>Ao entrar em contato, informe os dados mínimos para identificação da conta e descreva de forma objetiva o pedido, para acelerar a análise.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-[linear-gradient(135deg,#f7f9ff_0%,#fff5ef_100%)] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">7. Cookies e alterações desta política</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>
            Para detalhes sobre cookies, preferência de aviso e tecnologias correlatas, consulte a{' '}
            <Link href="/politica-de-cookies" className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4">
              Política de Cookies
            </Link>
            .
          </p>
          <p>Esta política pode ser atualizada para refletir mudanças legais, operacionais ou técnicas. A versão vigente será sempre a publicada nesta página.</p>
        </div>
      </section>
    </LegalPageShell>
  );
}
