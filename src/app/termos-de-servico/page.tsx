import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPageShell } from '@/components/legal/legal-page-shell';

export const metadata: Metadata = {
  title: 'Termos de Serviço | Escreva Mais',
  description: 'Regras gerais de uso da plataforma Escreva Mais.',
};

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Termos"
      title="Termos de Serviço"
      description="Estes termos disciplinam o acesso e o uso da plataforma Escreva Mais por alunos, professores e demais usuários cadastrados."
      updatedAt="18/03/2026"
    >
      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">1. Objeto</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>A plataforma oferece recursos de prática de redação, acompanhamento pedagógico, correção, videoaulas, atividades e áreas administrativas vinculadas ao serviço contratado.</p>
          <p>O uso da plataforma depende de cadastro válido, aceite destes termos e respeito às regras operacionais e de convivência aplicáveis.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">2. Conta e responsabilidade do usuário</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <li>O usuário deve fornecer dados verdadeiros, atualizados e manter o sigilo de suas credenciais de acesso.</li>
          <li>É vedado compartilhar conta, tentar acessar áreas sem autorização, interferir na segurança da aplicação ou usar a plataforma para finalidade ilícita.</li>
          <li>Conteúdos enviados para correção ou interação devem respeitar a legislação, os direitos autorais e as regras de uso da comunidade acadêmica.</li>
        </ul>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">3. Planos, cobrança e liberação de acesso</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Planos pagos podem exigir confirmação de pagamento por provedor externo antes da liberação do acesso. Enquanto a confirmação não ocorrer, a conta pode permanecer pendente.</p>
          <p>O processamento financeiro acontece em ambiente seguro de terceiro especializado. A plataforma não armazena dados sensíveis completos de cartão.</p>
          <p>Falhas de pagamento, chargeback, fraude, uso abusivo ou descumprimento destes termos podem resultar em bloqueio ou cancelamento do acesso, conforme o caso.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">4. Conteúdo, disponibilidade e limitações</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>Os conteúdos educacionais, trilhas, correções e materiais de apoio são disponibilizados conforme a estrutura do plano, a agenda acadêmica e a evolução da plataforma.</p>
          <p>A Escreva Mais pode promover manutenções, atualizações, ajustes de funcionalidades e melhorias técnicas, inclusive com indisponibilidades temporárias.</p>
          <p>Sem prejuízo do dever de cuidado, a plataforma não garante operação ininterrupta ou totalmente livre de falhas em qualquer ambiente digital.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-[#d9def8] bg-[linear-gradient(135deg,#f7f9ff_0%,#fff5ef_100%)] p-6 shadow-[0_20px_54px_rgba(74,73,140,0.08)] sm:p-7">
        <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#22347e]">5. Privacidade e documentos complementares</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-[#5f6d98] sm:text-[0.98rem]">
          <p>
            O tratamento de dados pessoais segue a{' '}
            <Link href="/privacidade" className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4">
              Política de Privacidade e LGPD
            </Link>{' '}
            e a{' '}
            <Link href="/politica-de-cookies" className="font-semibold text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4">
              Política de Cookies
            </Link>
            .
          </p>
          <p>Ao continuar usando a plataforma, o usuário declara que leu e compreendeu estes documentos na extensão aplicável ao seu relacionamento com o serviço.</p>
        </div>
      </section>
    </LegalPageShell>
  );
}
