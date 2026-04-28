'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FileText, Loader2, Send } from 'lucide-react';
import { isDemoLogin } from '@/lib/demo';
import { getSubmissionPdfHref } from '@/lib/submission-pdf';
import { SERVERLESS_SAFE_UPLOAD_BYTES, getServerlessUploadLimitLabel, getServerlessUploadLimitMessage } from '@/lib/upload-limits';
import { Button } from '../ui/button';

type ExistingSubmission = {
  id: string;
  pdfUrl?: string | null;
  pdfName?: string | null;
  submittedAt: Date | string;
  status: string;
};

export function SubmitWork({ activityId, existingSubmission }: { activityId: string; existingSubmission?: ExistingSubmission | null }) {
  const router = useRouter();
  const { data } = useSession();
  const role = (data?.user as { role?: string } | undefined)?.role;
  const login =
    (data?.user as { email?: string; name?: string } | undefined)?.email ??
    (data?.user as { name?: string } | undefined)?.name;
  const [content, setContent] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [sentFileName, setSentFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (role !== 'STUDENT') return null;

  const existingPdfHref = existingSubmission ? getSubmissionPdfHref(existingSubmission) : null;

  if (existingSubmission) {
    return (
      <div className="em-card-hard space-y-3 bg-white p-5">
        <p className="text-sm font-extrabold text-[var(--em-ink)]">Atividade ja enviada</p>
        <div className="rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-mint)] px-4 py-4 text-sm text-[var(--em-ink)]">
          <p className="font-semibold">Seu PDF desta atividade ja foi enviado.</p>
          <p className="mt-1">Data do envio: {new Date(existingSubmission.submittedAt).toLocaleString('pt-BR')}</p>
          <p className="mt-1">Status atual: {existingSubmission.status === 'GRADED' ? 'Corrigido' : 'Aguardando correcao'}</p>
          {existingSubmission.pdfName ? <p className="mt-1 text-xs text-[var(--em-text-soft)]">Arquivo: {existingSubmission.pdfName}</p> : null}
          <div className="mt-3 flex flex-wrap gap-2">
            {existingPdfHref ? (
              <Link href={existingPdfHref} target="_blank" className="em-btn-primary !px-4 !py-2 text-xs">
                Abrir PDF enviado
              </Link>
            ) : null}
            <Link href="/envios" className="inline-flex rounded-xl border-[1.5px] border-[var(--em-ink)] bg-white px-4 py-2 text-xs font-extrabold text-[var(--em-ink)]">
              Ver meus envios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setLoading(true);
    setStatus(null);

    if (!pdfFile) {
      setLoading(false);
      setStatus('Selecione um PDF para enviar.');
      return;
    }

    if (pdfFile.size > SERVERLESS_SAFE_UPLOAD_BYTES) {
      setLoading(false);
      setStatus(getServerlessUploadLimitMessage('arquivos PDF'));
      return;
    }

    if (isDemoLogin(login)) {
      setLoading(false);
      setStatus('Envio de PDF simulado no modo demo.');
      setSentFileName(pdfFile.name);
      setContent('');
      setPdfFile(null);
      return;
    }

    const formData = new FormData();
    formData.append('activityId', activityId);
    formData.append('content', content);
    formData.append('pdf', pdfFile);

    const res = await fetch('/api/submissions', {
      method: 'POST',
      body: formData,
    });

    const body = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setStatus(res.status === 413 ? getServerlessUploadLimitMessage('arquivos PDF') : body.error || 'Erro ao enviar PDF.');
      return;
    }

    setContent('');
    setSentFileName(pdfFile.name);
    setPdfFile(null);
    setStatus('PDF enviado com sucesso. O professor ja pode ver este envio na area de correcoes.');
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="em-card-hard space-y-3 bg-white p-5">
      <p className="text-sm font-extrabold text-[var(--em-ink)]">Enviar redacao em PDF</p>
      <p className="text-xs leading-6 text-[var(--em-text-soft)]">Ao enviar, sua redacao entra automaticamente na fila de correcoes do professor. Tamanho maximo por envio no deploy atual: {getServerlessUploadLimitLabel()}.</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Se desejar, adicione uma observacao para o professor..."
        rows={4}
        className="theme-field w-full rounded-xl px-4 py-3 text-sm"
      />
      <label className="theme-field-panel flex cursor-pointer items-center gap-3 rounded-2xl border-dashed px-4 py-4 text-sm text-[var(--em-ink)]">
        <FileText className="h-5 w-5" />
        <span className="flex-1">{pdfFile ? pdfFile.name : 'Selecionar arquivo PDF da redacao'}</span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <Button
        disabled={loading || isPending || !pdfFile}
        onClick={handleSubmit}
        className="w-full"
      >
        {loading || isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Enviar PDF
      </Button>
      {status ? (
        <div className="rounded-2xl border-[1.5px] border-[var(--em-ink)] bg-[var(--em-mint)] px-4 py-3 text-sm text-[var(--em-ink)]">
          <p className="font-semibold">Envio confirmado</p>
          <p className="mt-1">{status}</p>
          {sentFileName ? <p className="mt-1 text-xs text-[var(--em-text-soft)]">Arquivo enviado: {sentFileName}</p> : null}
          <Link href="/envios?sent=1" className="em-btn-primary mt-3 !px-4 !py-2 text-xs">
            Ver em meus envios
          </Link>
        </div>
      ) : null}
    </div>
  );
}
