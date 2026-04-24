import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { formatCurrencyFromCents, getPublicPlanPricing } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export default async function CadastroPage() {
  const pricing = await getPublicPlanPricing();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse items-center gap-6 px-4 py-8 sm:px-6 sm:py-12 lg:flex-row lg:gap-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-900/70 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
            <ShieldCheck className="h-4 w-4" /> Cadastro rápido
          </span>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-indigo-200">Comece agora</p>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Crie sua conta</h2>
          <p className="text-sm text-slate-400">Escolha o plano e siga para um checkout seguro com Pix, cartões ou boleto.</p>
        </div>
        <RegisterForm
          planPrices={{
            mensal: `${formatCurrencyFromCents(pricing.plans.mensal)}/mês`,
            trimestral: `${formatCurrencyFromCents(pricing.plans.trimestral)}/trimestre`,
            semestral: `${formatCurrencyFromCents(pricing.plans.semestral)}/semestre`,
            anual: `${formatCurrencyFromCents(pricing.plans.anual)}/ano`,
          }}
          readingClubPriceLabel={formatCurrencyFromCents(pricing.readingClubPriceInCents)}
          mentoringPriceLabel={formatCurrencyFromCents(pricing.mentoringPriceInCents)}
          mentoringPackagePrices={{
            mensal: {
              price: formatCurrencyFromCents(pricing.mentoringPackages.mensal),
              discountLabel: pricing.mentoringDiscounts.mensal ? `${pricing.mentoringDiscounts.mensal}% off` : 'preco cheio',
            },
            trimestral: {
              price: formatCurrencyFromCents(pricing.mentoringPackages.trimestral),
              discountLabel: `${pricing.mentoringDiscounts.trimestral}% off`,
            },
            semestral: {
              price: formatCurrencyFromCents(pricing.mentoringPackages.semestral),
              discountLabel: `${pricing.mentoringDiscounts.semestral}% off`,
            },
            anual: {
              price: formatCurrencyFromCents(pricing.mentoringPackages.anual),
              discountLabel: `${pricing.mentoringDiscounts.anual}% off`,
            },
          }}
        />
      </div>

      <div className="w-full flex-1">
        <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-900 p-6 shadow-2xl shadow-black/30 sm:p-10">
          <h3 className="text-2xl font-semibold text-white sm:text-3xl">Foque em escrever.</h3>
          <p className="mt-3 text-slate-300">
            A plataforma organiza prazos, feedbacks e métricas de evolução. Você acompanha tudo em um só lugar.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              'Gráficos de evolução',
              'Envios com histórico',
              'Correções detalhadas',
              'Biblioteca de propostas',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-800/70 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
