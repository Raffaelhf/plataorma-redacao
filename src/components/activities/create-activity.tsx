'use client';

import { useRef, useState, type ChangeEvent, type FormEvent, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FileText, FileVideo, Loader2, Paperclip, Plus, X } from 'lucide-react';
import {
  ACTIVITY_ATTACHMENT_ACCEPT,
  ACTIVITY_ATTACHMENT_MAX_FILES,
  formatFileSize,
  getActivityAttachmentKindLabel,
  validateActivityAttachmentFile,
} from '@/lib/activity-attachments';
import { isDemoLogin } from '@/lib/demo';
import { isTeacherRole } from '@/lib/roles';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
    />
  );
}

export function CreateActivity() {
  const router = useRouter();
  const { data } = useSession();
  const role = (data?.user as { role?: string } | undefined)?.role;
  const login =
    (data?.user as { email?: string; name?: string } | undefined)?.email ??
    (data?.user as { name?: string } | undefined)?.name;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  if (!isTeacherRole(role)) return null;

  function handleAttachmentSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const nextAttachments = [...attachments];

    for (const file of selectedFiles) {
      const validationError = validateActivityAttachmentFile(file);
      if (validationError) {
        setError(validationError);
        event.target.value = '';
        return;
      }

      if (nextAttachments.length >= ACTIVITY_ATTACHMENT_MAX_FILES) {
        setError(`Voce pode anexar no maximo ${ACTIVITY_ATTACHMENT_MAX_FILES} materiais de apoio.`);
        event.target.value = '';
        return;
      }

      nextAttachments.push(file);
    }

    setAttachments(nextAttachments);
    setError(null);
    event.target.value = '';
  }

  function removeAttachment(index: number) {
    setAttachments((current) => current.filter((_, attachmentIndex) => attachmentIndex !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (isDemoLogin(login)) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    attachments.forEach((attachment) => {
      formData.append('attachments', attachment);
    });

    const res = await fetch('/api/activities', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const bodyRes = await res.json().catch(() => ({}));
      setError(bodyRes.error || 'Erro ao criar atividade');
    } else {
      setSuccess(true);
      setAttachments([]);
      fileInputRef.current?.form?.reset();
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">Nova atividade</p>
        {success && <span className="text-xs text-emerald-300">{isDemoLogin(login) ? 'Simulado!' : 'Salvo!'}</span>}
      </div>
      <Input name="title" placeholder="Titulo" required />
      <TextArea name="description" placeholder="Descricao breve" required rows={2} />
      <TextArea name="prompt" placeholder="Enunciado / prompt" required rows={3} />
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <Input name="tags" placeholder="Tags separadas por virgula" />
        <Input name="dueDate" type="date" />
      </div>
      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/30 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <Paperclip className="h-4 w-4" />
          Materiais de apoio
        </div>
        <p className="mt-1 text-xs leading-6 text-slate-300">
          Anexe ate {ACTIVITY_ATTACHMENT_MAX_FILES} arquivos por atividade. Formatos aceitos: video, PDF, Word e PowerPoint.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACTIVITY_ATTACHMENT_ACCEPT}
          onChange={handleAttachmentSelection}
          className="mt-3 block w-full text-sm text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:font-semibold file:text-slate-100 hover:file:bg-slate-600"
        />
        {attachments.length > 0 ? (
          <div className="mt-3 space-y-2">
            {attachments.map((attachment, index) => {
              const attachmentKind = getActivityAttachmentKindLabel(attachment.name, attachment.type);
              const AttachmentIcon = attachmentKind === 'Video' ? FileVideo : FileText;

              return (
                <div key={`${attachment.name}-${attachment.lastModified}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/80 bg-slate-900/60 px-3 py-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                      <AttachmentIcon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{attachment.name}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {attachmentKind} • {formatFileSize(attachment.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-200 transition-colors hover:bg-slate-700"
                    aria-label={`Remover ${attachment.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-slate-200">
          <input type="radio" name="status" value="DRAFT" defaultChecked className="accent-indigo-500" /> Rascunho
        </label>
        <label className="flex items-center gap-2 text-slate-200">
          <input type="radio" name="status" value="PUBLISHED" className="accent-indigo-500" /> Publicar
        </label>
      </div>
      {error && <p className="text-xs text-amber-200">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Salvar atividade
      </Button>
    </form>
  );
}
