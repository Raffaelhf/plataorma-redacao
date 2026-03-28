'use client';

import { useState } from 'react';
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
};

export function AdminSettingsForm({ initialSettings }: { initialSettings: SettingsData }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [whatsAppNumber, setWhatsAppNumber] = useState(() => formatWhatsAppNumber(initialSettings.whatsappNumber));
  const fieldClassName =
    'admin-readable-field w-full rounded-2xl border border-[#d9def8] bg-white/96 px-4 py-3 text-sm focus:border-[#7b86f8] focus:outline-none focus:ring-2 focus:ring-[#7b86f8]/20';

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage(null);
    setError(null);

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
    setLoading(false);
  };

  return (
    <form action={handleSubmit} className="admin-card space-y-5 rounded-[30px] p-5">
      <div>
        <p className="text-sm font-semibold text-[#5a69a1]">Financeiro e atendimento</p>
        <h2 className="mt-1 text-xl font-semibold text-[#22347e]">Dados operacionais da plataforma</h2>
        <p className="mt-2 text-sm leading-7 text-[#52618f]">
          Atualize a conta que recebe os pagamentos e o WhatsApp oficial utilizado no atendimento da plataforma.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#22347e]">Titular / razão social</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Nome da pessoa ou empresa que vai receber os pagamentos da plataforma.</span>
          <input name="bankRecipientName" defaultValue={initialSettings.bankRecipientName ?? ''} placeholder="Escreva Mais" className={fieldClassName} />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#22347e]">CPF ou CNPJ</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Documento do titular da conta de recebimento.</span>
          <input name="bankDocument" defaultValue={initialSettings.bankDocument ?? ''} placeholder="00.000.000/0001-00" className={fieldClassName} />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#22347e]">Banco</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Nome do banco onde a plataforma recebe os pagamentos.</span>
          <input name="bankName" defaultValue={initialSettings.bankName ?? ''} placeholder="Banco Exemplo" className={fieldClassName} />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#22347e]">Agência</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Número da agência bancária vinculada a essa conta.</span>
          <input name="bankAgency" defaultValue={initialSettings.bankAgency ?? ''} placeholder="0001" className={fieldClassName} />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#22347e]">Conta</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Número da conta com dígito, usada para recebimentos.</span>
          <input name="bankAccount" defaultValue={initialSettings.bankAccount ?? ''} placeholder="12345-6" className={fieldClassName} />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-semibold text-[#22347e]">Chave PIX</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Chave PIX oficial usada para transferências e repasses.</span>
          <input name="pixKey" defaultValue={initialSettings.pixKey ?? ''} placeholder="financeiro@redacao360.com" className={fieldClassName} />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="block text-sm font-semibold text-[#22347e]">WhatsApp oficial com DDI</span>
          <span className="block text-xs leading-5 text-[#6d79a5]">Número que será usado na plataforma para atendimento, suporte e contato com usuários. Ex.: +55 (11) 99999-9999.</span>
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

      <label className="space-y-2">
        <span className="block text-sm font-semibold text-[#22347e]">Observações internas</span>
        <span className="block text-xs leading-5 text-[#6d79a5]">Instruções administrativas sobre pagamentos, repasses, atendimento ou qualquer regra operacional da plataforma.</span>
        <textarea
          name="paymentNotes"
          defaultValue={initialSettings.paymentNotes ?? ''}
          rows={4}
          placeholder="Observações internas sobre pagamentos, repasses e atendimento."
          className="admin-readable-field w-full rounded-2xl border border-[#d9def8] bg-white/96 px-4 py-3 text-sm focus:border-[#7b86f8] focus:outline-none focus:ring-2 focus:ring-[#7b86f8]/20"
        />
      </label>

      {error ? <p className="text-sm text-[#b14545]">{error}</p> : null}
      {message ? <p className="text-sm text-[#1b7f62]">{message}</p> : null}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={loading} className="min-w-[220px] justify-center">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}
