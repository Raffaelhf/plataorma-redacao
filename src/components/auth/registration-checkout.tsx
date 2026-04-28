'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Check, Copy, CreditCard, ExternalLink, Loader2, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '@/components/mockups/escreva-mais/_group.css';

type PaymentMethod = 'PIX' | 'CARD';

type PixPayment = {
  paymentId: string;
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
};

type CardPaymentFormData = {
  token: string;
  issuer_id?: string | number | null;
  payment_method_id: string;
  transaction_amount: number;
  installments: number;
  payer?: {
    identification?: {
      type?: string;
      number?: string;
    };
  };
};

const mercadoPagoPublicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
const MIN_CARD_PAYMENT_AMOUNT_IN_CENTS = 100;

function formatCurrencyFromCents(amountInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}

type MercadoPagoBrickController = {
  unmount: () => void;
};

type MercadoPagoBrickBuilder = {
  create: (type: 'cardPayment', containerId: string, settings: object) => Promise<MercadoPagoBrickController>;
};

type MercadoPagoInstance = {
  bricks: () => MercadoPagoBrickBuilder;
};

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: 'pt-BR' }) => MercadoPagoInstance;
  }
}

function loadMercadoPagoSdk() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Janela indisponível.'));
    if (window.MercadoPago) return resolve();

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://sdk.mercadopago.com/js/v2"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Falha ao carregar Mercado Pago.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Falha ao carregar Mercado Pago.'));
    document.body.appendChild(script);
  });
}

const methodOptions: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof QrCode;
}> = [
  { value: 'PIX', label: 'Pix', description: 'Aprovação rápida por QR Code ou código copia e cola, sem login no Mercado Pago.', icon: QrCode },
  { value: 'CARD', label: 'Cartão', description: 'Pagamento por cartão dentro da plataforma, sem login no Mercado Pago.', icon: CreditCard },
];

export function RegistrationCheckout({
  publicToken,
  role,
  planLabel,
  totalLabel,
  amountInCents,
  payerEmail,
}: {
  publicToken: string;
  role: 'STUDENT' | 'TEACHER';
  planLabel?: string | null;
  totalLabel: string;
  amountInCents: number;
  payerEmail: string;
}) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('PIX');
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixPayment, setPixPayment] = useState<PixPayment | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  const [cardBrickReady, setCardBrickReady] = useState(false);
  const cardPaymentAvailable = amountInCents >= MIN_CARD_PAYMENT_AMOUNT_IN_CENTS;

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setPixPayment(null);
    setPendingPaymentId(null);
    setCopySuccess(false);
    setPaymentStatusMessage(null);
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
    setPaymentStatusMessage(null);

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
      setPendingPaymentId(payload.pix.paymentId);
      setPaymentStatusMessage('Aguardando confirmação do pagamento...');
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

  const handleCardSubmit = useCallback(async (formData: CardPaymentFormData) => {
    setLoading(true);
    setError(null);
    setPaymentStatusMessage(null);
    setPendingPaymentId(null);

    if (!acceptedPolicies) {
      setLoading(false);
      setError('Você precisa aceitar a política de privacidade e os termos para continuar.');
      throw new Error('Políticas não aceitas.');
    }

    const response = await fetch('/api/checkout/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: publicToken,
        acceptedPrivacyPolicy: acceptedPolicies,
        acceptedTerms: acceptedPolicies,
        formData,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(payload.error || 'Não foi possível processar o pagamento com cartão.');
      setLoading(false);
      throw new Error(payload.error || 'Pagamento recusado.');
    }

    if (payload.redirectUrl) {
      setPaymentStatusMessage('Pagamento confirmado. Redirecionando...');
      window.location.href = payload.redirectUrl;
      return;
    }

    setPendingPaymentId(payload.paymentId || null);
    setPaymentStatusMessage('Pagamento em análise. Aguardando confirmação...');
    setLoading(false);
  }, [acceptedPolicies, publicToken]);

  useEffect(() => {
    if (selectedMethod !== 'CARD' || !acceptedPolicies || !mercadoPagoPublicKey || !cardPaymentAvailable) return;

    let active = true;
    let controller: MercadoPagoBrickController | null = null;

    const renderCardBrick = async () => {
      try {
        setCardBrickReady(false);
        await loadMercadoPagoSdk();

        if (!active || !window.MercadoPago) return;

        const mercadoPago = new window.MercadoPago(mercadoPagoPublicKey, { locale: 'pt-BR' });
        const bricksBuilder = mercadoPago.bricks();

        controller = await bricksBuilder.create('cardPayment', 'cardPaymentBrick_container', {
          initialization: {
            amount: amountInCents / 100,
            payer: {
              email: payerEmail,
            },
          },
          customization: {
            paymentMethods: {
              minInstallments: 1,
              maxInstallments: 12,
              types: {
                included: ['credit_card', 'debit_card'],
              },
            },
            visual: {
              hideFormTitle: true,
            },
          },
          callbacks: {
            onReady: () => {
              setCardBrickReady(true);
              setPaymentStatusMessage(null);
            },
            onSubmit: (formData: CardPaymentFormData) => handleCardSubmit(formData),
            onError: () => {
              setError('Não foi possível carregar o pagamento por cartão. Atualize a página e tente novamente.');
            },
          },
        });
      } catch {
        setError('Não foi possível carregar o Checkout Bricks. Atualize a página e tente novamente.');
      }
    };

    renderCardBrick();

    return () => {
      active = false;
      controller?.unmount();
    };
  }, [acceptedPolicies, amountInCents, cardPaymentAvailable, handleCardSubmit, payerEmail, selectedMethod]);

  useEffect(() => {
    if (!pixPayment && !pendingPaymentId) return;

    let active = true;

    const checkPaymentStatus = async () => {
      const response = await fetch(`/api/checkout/status?token=${encodeURIComponent(publicToken)}`, {
        cache: 'no-store',
      });
      const payload = await response.json().catch(() => ({}));

      if (!active || !response.ok) return;

      if (payload.approved && payload.redirectUrl) {
        setPaymentStatusMessage('Pagamento confirmado. Redirecionando...');
        window.location.href = payload.redirectUrl;
        return;
      }

      if (payload.status === 'FAILED') {
        setError('O pagamento não foi aprovado. Tente gerar um novo Pix ou escolha outro meio de pagamento.');
        setPaymentStatusMessage(null);
        return;
      }

      setPaymentStatusMessage('Aguardando confirmação do pagamento...');
    };

    checkPaymentStatus();
    const intervalId = window.setInterval(checkPaymentStatus, 5000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [pendingPaymentId, pixPayment, publicToken]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="em-card-hard bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex aspect-square h-12 w-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[var(--em-ink)] bg-[var(--em-mint)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--em-text-soft)]">Pagamento seguro</p>
            <h2 className="mt-1 text-2xl font-extrabold text-[var(--em-ink)]">Escolha como deseja pagar</h2>
            <p className="mt-2 text-sm font-semibold leading-7 text-[var(--em-text-soft)]">
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
                  'rounded-[22px] border-[1.5px] px-4 py-4 text-left transition-all',
                  active
                    ? 'border-[var(--em-ink)] bg-[var(--em-yellow-soft)] shadow-[4px_4px_0_0_#0E0F12]'
                    : 'border-[var(--em-border-strong)] bg-[var(--em-bg)] hover:border-[var(--em-ink)] hover:bg-white',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 flex aspect-square h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--em-ink)]', active ? 'bg-white text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]' : 'bg-white text-[var(--em-text-soft)]')}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[var(--em-ink)]">{method.label}</p>
                    <p className="mt-1 text-xs font-semibold leading-6 text-[var(--em-text-soft)]">{method.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3">
          <label className="flex items-start gap-3 rounded-[22px] border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-cream)] px-4 py-4 text-sm text-[var(--em-ink)] transition-colors focus-within:border-[var(--em-ink)]">
            <input
              type="checkbox"
              checked={acceptedPolicies}
              onChange={(event) => setAcceptedPolicies(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[var(--em-ink)]"
            />
            <span>
              <span className="block font-extrabold">
                Concordo com os{' '}
                <Link href="/termos-de-servico" target="_blank" className="text-[var(--em-ink)] underline decoration-[var(--em-yellow)] decoration-2 underline-offset-4">
                  termos de serviço
                </Link>
                , com a{' '}
                <Link href="/privacidade" target="_blank" className="text-[var(--em-ink)] underline decoration-[var(--em-yellow)] decoration-2 underline-offset-4">
                  política de privacidade e LGPD
                </Link>{' '}
                e com a{' '}
                <Link href="/politica-de-cookies" target="_blank" className="text-[var(--em-ink)] underline decoration-[var(--em-yellow)] decoration-2 underline-offset-4">
                  política de cookies
                </Link>
              </span>
              <span className="mt-1 block text-xs font-semibold leading-6 text-[var(--em-text-soft)]">
                Autorizo o uso dos meus dados para cadastro, cobrança e suporte. O acesso é liberado após a confirmação do pagamento pelo provedor escolhido.
              </span>
            </span>
          </label>
        </div>

        {error ? <p className="mt-4 rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-rose)] px-4 py-3 text-sm font-bold text-[var(--em-ink)]">{error}</p> : null}

        {selectedMethod === 'CARD' ? (
          <div className="mt-5 rounded-[24px] border-[1.5px] border-[var(--em-ink)] bg-[var(--em-bg)] p-4 text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
            {!mercadoPagoPublicKey ? (
              <p className="rounded-2xl border border-[var(--em-ink)] bg-[var(--em-rose)] px-4 py-3 text-sm font-bold text-[var(--em-ink)]">
                Checkout Bricks ainda não está configurado. Defina NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY no ambiente da Vercel.
              </p>
            ) : !cardPaymentAvailable ? (
              <p className="rounded-2xl border border-[var(--em-ink)] bg-[var(--em-yellow-soft)] px-4 py-3 text-sm font-bold text-[var(--em-ink)]">
                Pagamento por cartão está disponível a partir de {formatCurrencyFromCents(MIN_CARD_PAYMENT_AMOUNT_IN_CENTS)}. O valor atual é {totalLabel}.
              </p>
            ) : !acceptedPolicies ? (
              <p className="rounded-2xl border border-[var(--em-ink)] bg-[var(--em-yellow-soft)] px-4 py-3 text-sm font-bold text-[var(--em-ink)]">
                Aceite os termos e políticas para carregar o formulário seguro do cartão.
              </p>
            ) : (
              <>
                {!cardBrickReady ? (
                  <p className="rounded-2xl border border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)]">
                    Carregando formulário seguro...
                  </p>
                ) : null}
                <div id="cardPaymentBrick_container" />
                {loading ? (
                  <p className="mt-3 rounded-2xl border border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)]">
                    Processando pagamento...
                  </p>
                ) : null}
                {paymentStatusMessage ? (
                  <p className="mt-3 rounded-2xl border border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)]">
                    {paymentStatusMessage}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-semibold leading-5 text-[var(--em-text-soft)]">
                  Cartões de teste do Mercado Pago funcionam somente com credenciais TEST. Em produção, use um cartão real.
                </p>
              </>
            )}
          </div>
        ) : pixPayment ? (
          <div className="mt-5 rounded-[24px] border-[1.5px] border-[var(--em-ink)] bg-[var(--em-cream)] p-4 text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {pixPayment.qrCodeBase64 ? (
                <div className="mx-auto flex h-44 w-44 shrink-0 items-center justify-center rounded-[20px] border-[1.5px] border-[var(--em-ink)] bg-white p-3 shadow-[4px_4px_0_0_#0E0F12]">
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
                <p className="text-sm font-extrabold text-[var(--em-ink)]">Pix gerado com sucesso</p>
                <p className="mt-1 text-xs font-semibold leading-6 text-[var(--em-text-soft)]">
                  Escaneie o QR Code ou use o código copia e cola. A conta será liberada automaticamente depois da confirmação do pagamento.
                </p>
                {paymentStatusMessage ? (
                  <p className="mt-3 rounded-2xl border border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--em-ink)]">
                    {paymentStatusMessage}
                  </p>
                ) : null}

                {pixPayment.qrCode ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      readOnly
                      value={pixPayment.qrCode}
                      className="h-24 w-full resize-none rounded-2xl border-[1.5px] border-[var(--em-border-strong)] bg-white px-3 py-2 text-xs font-semibold leading-5 text-[var(--em-ink)] outline-none focus:border-[var(--em-ink)]"
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
                    className="mt-3 inline-flex items-center rounded-xl border-[1.5px] border-[var(--em-ink)] bg-white px-4 py-2 text-sm font-extrabold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12] transition-colors hover:bg-[var(--em-yellow-soft)]"
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
            Gerar QR Code Pix
          </Button>
        )}
      </section>

      <aside className="em-card-hard bg-white p-5 sm:p-6">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border-[1.5px] border-[var(--em-ink)] bg-[var(--em-lavender)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] shadow-[2px_2px_0_0_#0E0F12]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Resumo
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--em-ink)]">{role === 'STUDENT' ? 'Assinatura do aluno' : 'Cadastro do professor'}</h2>

        <div className="mt-5 space-y-4 rounded-[22px] border-[1.5px] border-[var(--em-ink)] bg-[var(--em-cream)] p-4">
          {planLabel ? (
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-[var(--em-text-soft)]">Plano</span>
              <span className="text-right font-extrabold text-[var(--em-ink)]">{planLabel}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-bold text-[var(--em-text-soft)]">Total</span>
            <span className="rounded-xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow)] px-3 py-1 text-lg font-extrabold text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]">{totalLabel}</span>
          </div>
        </div>

        <div className="mt-5 space-y-3 text-sm font-semibold text-[var(--em-text-soft)]">
          <p className="rounded-[22px] border border-[var(--em-border-strong)] bg-[var(--em-mint)] px-4 py-4 text-[var(--em-ink)]">
            Pix e cartão são processados sem redirecionar o aluno para a tela de login do Mercado Pago.
          </p>
          <p className="rounded-[22px] border border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-4">
            Assim que o provedor confirmar o pagamento, a conta é liberada automaticamente.
          </p>
        </div>
      </aside>
    </div>
  );
}
