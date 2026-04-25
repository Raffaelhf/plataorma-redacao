'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Banknote, Check, Copy, CreditCard, ExternalLink, Landmark, Loader2, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaymentMethod = 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BOLETO';

type PixPayment = {
  paymentId: string;
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
};

const methodOptions: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof QrCode;
}> = [
  { value: 'PIX', label: 'Pix', description: 'Aprovação rápida por QR Code ou código copia e cola.', icon: QrCode },
  { value: 'CREDIT_CARD', label: 'Cartão de crédito', description: 'Pagamento parcelado ou à vista em ambiente seguro.', icon: CreditCard },
  { value: 'DEBIT_CARD', label: 'Cartão de débito', description: 'Débito processado diretamente pelo provedor de pagamento.', icon: Landmark },
  { value: 'BOLETO', label: 'Boleto bancário', description: 'Emissão de boleto para pagamento dentro do vencimento.', icon: Banknote },
];

export function RegistrationCheckout({
  publicToken,
  role,
  planLabel,
  totalLabel,
}: {
  publicToken: string;
  role: 'STUDENT' | 'TEACHER';
  planLabel?: string | null;
  totalLabel: string;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PIX');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixPayment, setPixPayment] = useState<PixPayment | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPixPayment(null);
    setCopySuccess(false);
    setError(null);
  };

  const handleCopyPixCode = async () => {
    if (!pixPayment?.qrCode) return;

    try {
      await navigator.clipboard.writeText(pixPayment.qrCode);
      setCopySuccess(true);
    } catch {
      setError('Não foi possível copiar automaticamente. Selecione o código Pix e copie manualmente.');
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    setError(null);
    setCopySuccess(false);

    const response = await fetch('/api/checkout/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: publicToken,
        selectedPaymentMethod: selectedMethod,
        acceptedPrivacyPolicy: acceptedPolicies,
        acceptedTerms: acceptedPolicies,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Não foi possível iniciar o checkout.');
      setLoading(false);
      return;
    }

    if (payload.pix) {
      setPixPayment(payload.pix);
      setLoading(false);
      return;
    }

    if (!payload.checkoutUrl) {
      setError('Não foi possível abrir o pagamento. Tente novamente.');
      setLoading(false);
      return;
    }

    window.location.href = payload.checkoutUrl;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[30px] border border-[#d9def8] bg-white/92 p-5 shadow-[0_22px_60px_rgba(74,73,140,0.1)] dark:border-slate-700 dark:bg-slate-950/92 dark:shadow-[0_22px_60px_rgba(0,0,0,0.32)] sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#eef2ff_0%,#fff1eb_100%)] text-[#4250d4] dark:bg-slate-800 dark:text-indigo-200">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#5a69a1] dark:text-indigo-200">Pagamento seguro</p>
            <h2 className="mt-1 text-xl font-semibold text-[#22347e] dark:text-white">Escolha como deseja pagar</h2>
            <p className="mt-2 text-sm leading-7 text-[#5f6d98] dark:text-slate-300">
              Seus dados de pagamento não são armazenados na plataforma. O processamento acontece em ambiente seguro do provedor.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {methodOptions.map((method) => {
            const Icon = method.icon;
            const active = selectedMethod === method.value;
            return (
              <button
                key={method.value}
                type="button"
                onClick={() => handleMethodSelect(method.value)}
                className={cn(
                  'rounded-[24px] border px-4 py-4 text-left transition-colors',
                  active
                    ? 'border-[#bfc9ff] bg-[linear-gradient(135deg,#eef2ff_0%,#fff4ee_100%)] dark:border-indigo-400 dark:bg-[linear-gradient(135deg,rgba(49,65,191,0.34),rgba(255,127,50,0.12))]'
                    : 'border-[#dde3fb] bg-[#fbfcff] hover:border-[#cfd6ff] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-400/70',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl', active ? 'bg-white text-[#4250d4] dark:bg-indigo-500 dark:text-white' : 'bg-[#eef2ff] text-[#6072dd] dark:bg-slate-800 dark:text-indigo-200')}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#22347e] dark:text-white">{method.label}</p>
                    <p className="mt-1 text-xs leading-6 text-[#61719b] dark:text-slate-300">{method.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-start gap-3 rounded-[22px] border border-[#dde3fb] bg-[#fbfcff] px-4 py-4 text-sm text-[#22347e] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <input
              type="checkbox"
              checked={acceptedPolicies}
              onChange={(event) => setAcceptedPolicies(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#4250d4] dark:accent-indigo-400"
            />
            <span>
              <span className="block font-semibold">
                Concordo com os{' '}
                <Link href="/termos-de-servico" target="_blank" className="text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-indigo-200 dark:decoration-indigo-300/50">
                  termos de serviço
                </Link>
                , com a{' '}
                <Link href="/privacidade" target="_blank" className="text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-indigo-200 dark:decoration-indigo-300/50">
                  política de privacidade e LGPD
                </Link>{' '}
                e com a{' '}
                <Link href="/politica-de-cookies" target="_blank" className="text-[#4250d4] underline decoration-[#cfd6ff] underline-offset-4 dark:text-indigo-200 dark:decoration-indigo-300/50">
                  política de cookies
                </Link>
              </span>
              <span className="mt-1 block text-xs leading-6 text-[#61719b] dark:text-slate-300">
                Autorizo o uso dos meus dados para cadastro, cobrança e suporte. O acesso é liberado após a confirmação do pagamento pelo provedor escolhido.
              </span>
            </span>
          </label>
        </div>

        {error ? <p className="mt-4 rounded-2xl border border-[#ffd0cf] bg-[#fff1f1] px-4 py-3 text-sm text-[#b14545] dark:border-red-400/40 dark:bg-red-950/35 dark:text-red-100">{error}</p> : null}

        {pixPayment ? (
          <div className="mt-5 rounded-[24px] border border-[#c9d2ff] bg-[#f7f9ff] p-4 text-[#22347e] dark:border-indigo-400/45 dark:bg-slate-900 dark:text-slate-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {pixPayment.qrCodeBase64 ? (
                <div className="mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-[20px] border border-[#dde3fb] bg-white p-3 dark:border-slate-600 dark:bg-white">
                  <Image
                    src={`data:image/png;base64,${pixPayment.qrCodeBase64}`}
                    alt="QR Code Pix"
                    width={152}
                    height={152}
                    unoptimized
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#22347e] dark:text-white">Pix gerado com sucesso</p>
                <p className="mt-1 text-xs leading-6 text-[#61719b] dark:text-slate-300">
                  Escaneie o QR Code ou use o código copia e cola. A conta será liberada automaticamente depois da confirmação do pagamento.
                </p>

                {pixPayment.qrCode ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      readOnly
                      value={pixPayment.qrCode}
                      className="h-24 w-full resize-none rounded-2xl border border-[#c9d2ff] bg-white px-3 py-2 text-xs leading-5 text-[#24305f] outline-none dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <Button type="button" variant="secondary" onClick={handleCopyPixCode} className="w-full sm:w-auto">
                      {copySuccess ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      {copySuccess ? 'Código copiado' : 'Copiar código Pix'}
                    </Button>
                  </div>
                ) : null}

                {pixPayment.ticketUrl ? (
                  <a
                    href={pixPayment.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center rounded-xl border border-[#c9d2ff] bg-white px-4 py-2 text-sm font-semibold text-[#4250d4] transition-colors hover:border-[#9daaff] dark:border-slate-600 dark:bg-slate-950 dark:text-indigo-200 dark:hover:border-indigo-400"
                  >
                    Abrir Pix no Mercado Pago
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <Button type="button" onClick={handleContinue} disabled={loading} className="mt-5 w-full sm:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {selectedMethod === 'PIX' ? 'Gerar QR Code Pix' : 'Ir para o pagamento seguro'}
          </Button>
        )}
      </section>

      <aside className="rounded-[30px] border border-[#d9def8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,248,255,0.92))] p-5 shadow-[0_22px_60px_rgba(74,73,140,0.1)] dark:border-slate-700 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(17,24,39,0.92))] dark:shadow-[0_22px_60px_rgba(0,0,0,0.32)] sm:p-6">
        <p className="text-sm font-semibold text-[#5a69a1] dark:text-indigo-200">Resumo</p>
        <h2 className="mt-2 text-xl font-semibold text-[#22347e] dark:text-white">{role === 'STUDENT' ? 'Assinatura do aluno' : 'Cadastro do professor'}</h2>

        <div className="mt-5 space-y-3 rounded-[24px] border border-[#dde3fb] bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-950/70">
          {planLabel ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#61719b] dark:text-slate-300">Plano</span>
              <span className="text-right font-semibold text-[#22347e] dark:text-white">{planLabel}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[#61719b] dark:text-slate-300">Total</span>
            <span className="text-lg font-extrabold tracking-[-0.03em] text-[#22347e] dark:text-white">{totalLabel}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm text-[#5f6d98] dark:text-slate-300">
          <p className="rounded-[22px] border border-[#dde3fb] bg-white/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
            O checkout externo reduz o risco de exposição de dados sensíveis, porque cartões e autenticações bancárias não passam pelo seu backend.
          </p>
          <p className="rounded-[22px] border border-[#dde3fb] bg-white/80 px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
            Pix e boleto podem permanecer pendentes até a compensação. Assim que o provedor confirmar o pagamento, a conta é liberada automaticamente.
          </p>
        </div>
      </aside>
    </div>
  );
}
