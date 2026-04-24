'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatWhatsAppNumber, normalizeWhatsAppNumber } from '@/lib/phone';

type SettingsData = {
  bankRecipientName?: string | null;
  bankDocument?: string | null;
  bankName?: string | null;
  bankAgency?: string | null;
  bankAccount?: string | null;
  pixKey?: string | null;
  whatsappNumber?: string | null;
  paymentNotes?: string | null;
  mensalPlanPriceInCents?: number | null;
  trimestralPlanPriceInCents?: number | null;
  semestralPlanPriceInCents?: number | null;
  anualPlanPriceInCents?: number | null;
  mentoriaPlanPriceInCents?: number | null;
  readingClubPriceInCents?: number | null;
};

const fieldPanelClassName =
  'admin-field-panel theme-field-panel space-y-2 rounded-[24px] p-4';
const fieldClassName =
  'admin-form-input theme-field w-full rounded-2xl px-4 py-3 text-sm';

function formatPriceInput(amountInCents?: number | null) {
  return typeof amountInCents === 'number' ? (amountInCents / 100).toFixed(2).replace('.', ',') : '';
}

export function AdminSettingsForm({ initialSettings }: { initialSettings: SettingsData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [whatsAppNumber, setWhatsAppNumber] = useState(() => formatWhatsAppNumber(initialSettings.whatsappNumber));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());
    body.whatsappNumber = normalizeWhatsAppNumber(String(body.whatsappNumber ?? ''));

    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error || 'Não foi possível salvar as configurações.');
      setLoading(false);
      return;
    }

    setMessage('Configurações salvas com sucesso.');
    router.refresh();
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card space-y-5 rounded-[30px] p-5">
      <div>
        <p className="admin-overline text-sm font-semibold">Financeiro e atendimento</p>
        <h2 className="admin-title mt-1 text-xl font-semibold">Dados operacionais da plataforma</h2>
        <p className="admin-copy mt-2 text-sm leading-7">
          Atualize a conta que recebe os pagamentos e o WhatsApp oficial utilizado no atendimento da plataforma.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="admin-form-label text-sm font-semibold">Preços dos planos</p>
          <p className="admin-form-help mt-1 text-xs leading-5">Valores usados na vitrine, no cadastro e no checkout de novos alunos.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <label className={fieldPanelClassName}>
            <span className="admin-form-label block text-sm font-semibold">Mensal</span>
            <span className="admin-form-help block text-xs leading-5">Valor em reais.</span>
            <input name="mensalPlanPrice" defaultValue={formatPriceInput(initialSettings.mensalPlanPriceInCents)} placeholder="80,00" inputMode="decimal" className={fieldClassName} />
          </label>

          <label className={fieldPanelClassName}>
            <span className="admin-form-label block text-sm font-semibold">Trimestral</span>
            <span className="admin-form-help block text-xs leading-5">Valor em reais.</span>
            <input name="trimestralPlanPrice" defaultValue={formatPriceInput(initialSettings.trimestralPlanPriceInCents)} placeholder="218,00" inputMode="decimal" className={fieldClassName} />
          </label>

          <label className={fieldPanelClassName}>
            <span className="admin-form-label block text-sm font-semibold">Semestral</span>
            <span className="admin-form-help block text-xs leading-5">Valor em reais.</span>
            <input name="semestralPlanPrice" defaultValue={formatPriceInput(initialSettings.semestralPlanPriceInCents)} placeholder="413,00" inputMode="decimal" className={fieldClassName} />
          </label>

          <label className={fieldPanelClassName}>
            <span className="admin-form-label block text-sm font-semibold">Anual</span>
            <span className="admin-form-help block text-xs leading-5">Valor em reais.</span>
            <input name="anualPlanPrice" defaultValue={formatPriceInput(initialSettings.anualPlanPriceInCents)} placeholder="768,00" inputMode="decimal" className={fieldClassName} />
          </label>

          <label className={fieldPanelClassName}>
            <span className="admin-form-label block text-sm font-semibold">Mentoria</span>
            <span className="admin-form-help block text-xs leading-5">Valor em reais.</span>
            <input name="mentoriaPlanPrice" defaultValue={formatPriceInput(initialSettings.mentoriaPlanPriceInCents)} placeholder="120,00" inputMode="decimal" className={fieldClassName} />
          </label>

          <label className={fieldPanelClassName}>
            <span className="admin-form-label block text-sm font-semibold">Clube de Leitura</span>
            <span className="admin-form-help block text-xs leading-5">Complemento opcional.</span>
            <input name="readingClubPrice" defaultValue={formatPriceInput(initialSettings.readingClubPriceInCents)} placeholder="30,00" inputMode="decimal" className={fieldClassName} />
          </label>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className={fieldPanelClassName}>
          <span className="admin-form-label block text-sm font-semibold">Titular / razão social</span>
          <span className="admin-form-help block text-xs leading-5">Nome da pessoa ou empresa que vai receber os pagamentos da plataforma.</span>
          <input name="bankRecipientName" defaultValue={initialSettings.bankRecipientName ?? ''} placeholder="Escreva Mais" className={fieldClassName} />
        </label>

        <label className={fieldPanelClassName}>
          <span className="admin-form-label block text-sm font-semibold">CPF ou CNPJ</span>
          <span className="admin-form-help block text-xs leading-5">Documento do titular da conta de recebimento.</span>
          <input name="bankDocument" defaultValue={initialSettings.bankDocument ?? ''} placeholder="00.000.000/0001-00" className={fieldClassName} />
        </label>

        <label className={fieldPanelClassName}>
          <span className="admin-form-label block text-sm font-semibold">Banco</span>
          <span className="admin-form-help block text-xs leading-5">Nome do banco onde a plataforma recebe os pagamentos.</span>
          <input name="bankName" defaultValue={initialSettings.bankName ?? ''} placeholder="Banco Exemplo" className={fieldClassName} />
        </label>

        <label className={fieldPanelClassName}>
          <span className="admin-form-label block text-sm font-semibold">Agência</span>
          <span className="admin-form-help block text-xs leading-5">Número da agência bancária vinculada a essa conta.</span>
          <input name="bankAgency" defaultValue={initialSettings.bankAgency ?? ''} placeholder="0001" className={fieldClassName} />
        </label>

        <label className={fieldPanelClassName}>
          <span className="admin-form-label block text-sm font-semibold">Conta</span>
          <span className="admin-form-help block text-xs leading-5">Número da conta com dígito, usada para recebimentos.</span>
          <input name="bankAccount" defaultValue={initialSettings.bankAccount ?? ''} placeholder="12345-6" className={fieldClassName} />
        </label>

        <label className={fieldPanelClassName}>
          <span className="admin-form-label block text-sm font-semibold">Chave PIX</span>
          <span className="admin-form-help block text-xs leading-5">Chave PIX oficial usada para transferências e repasses.</span>
          <input name="pixKey" defaultValue={initialSettings.pixKey ?? ''} placeholder="financeiro@redacao360.com" className={fieldClassName} />
        </label>

        <label className={`${fieldPanelClassName} md:col-span-2`}>
          <span className="admin-form-label block text-sm font-semibold">WhatsApp oficial com DDI</span>
          <span className="admin-form-help block text-xs leading-5">
            Número que será usado na plataforma para atendimento, suporte e contato com usuários. Ex.:
            +55 (11) 99999-9999.
          </span>
          <input
            name="whatsappNumber"
            value={whatsAppNumber}
            onChange={(event) => setWhatsAppNumber(formatWhatsAppNumber(event.target.value))}
            placeholder="+55 (11) 99999-9999"
            inputMode="tel"
            autoComplete="tel"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className={`${fieldPanelClassName} block`}>
        <span className="admin-form-label block text-sm font-semibold">Observações internas</span>
        <span className="admin-form-help block text-xs leading-5">
          Instruções administrativas sobre pagamentos, repasses, atendimento ou qualquer regra operacional da plataforma.
        </span>
        <textarea
          name="paymentNotes"
          defaultValue={initialSettings.paymentNotes ?? ''}
          rows={4}
          placeholder="Observações internas sobre pagamentos, repasses e atendimento."
          className={`${fieldClassName} min-h-[120px] resize-y`}
        />
      </label>

      {error ? <p className="rounded-2xl border border-[#ffd7d7] bg-[#fff4f4] px-4 py-3 text-sm text-[#b14545] dark:border-[rgba(111,52,58,0.8)] dark:bg-[rgba(69,31,37,0.42)] dark:text-[#ffb4b4]">{error}</p> : null}
      {message ? <p className="rounded-2xl border border-[#d7ecdf] bg-[#f3fbf7] px-4 py-3 text-sm text-[#1b7f62] dark:border-[rgba(36,94,74,0.8)] dark:bg-[rgba(18,56,44,0.38)] dark:text-[#8fe0b7]">{message}</p> : null}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={loading} className="min-w-[220px] justify-center">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}
