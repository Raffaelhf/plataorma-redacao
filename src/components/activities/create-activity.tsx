'use client';

<<<<<<< HEAD
import { useRef, useState, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Paperclip, Plus } from 'lucide-react';
=======
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
>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
import { isDemoLogin } from '@/lib/demo';
import { isTeacherRole } from '@/lib/roles';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="theme-field w-full rounded-xl px-4 py-3 text-sm"
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
<<<<<<< HEAD
  const formRef = useRef<HTMLFormElement>(null);
=======
  const fileInputRef = useRef<HTMLInputElement | null>(null);
>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
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

<<<<<<< HEAD
=======
    const formData = new FormData(event.currentTarget);
    attachments.forEach((attachment) => {
      formData.append('attachments', attachment);
    });

>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
    const res = await fetch('/api/activities', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const bodyRes = await res.json().catch(() => ({}));
      setError(bodyRes.error || 'Erro ao criar atividade');
    } else {
      setSuccess(true);
<<<<<<< HEAD
      formRef.current?.reset();
=======
      setAttachments([]);
      fileInputRef.current?.form?.reset();
>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
      router.refresh();
    }
    setLoading(false);
  }

  return (
<<<<<<< HEAD
    <form ref={formRef} action={handleSubmit} className="theme-form-surface space-y-3 rounded-2xl p-4">
=======
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-lg">
>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-[#22347e] dark:text-[#f3f7ff]">Nova atividade</p>
        {success && <span className="text-xs text-[#1b7f62] dark:text-[#8fe0b7]">{isDemoLogin(login) ? 'Simulado!' : 'Salvo!'}</span>}
      </div>
      <Input name="title" placeholder="Titulo" required />
      <TextArea name="description" placeholder="Descricao breve" required rows={2} />
      <TextArea name="prompt" placeholder="Enunciado / prompt" required rows={3} />
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <Input name="tags" placeholder="Tags separadas por virgula" />
        <Input name="dueDate" type="date" />
      </div>
<<<<<<< HEAD
      <label className="theme-field-panel flex cursor-pointer items-center gap-3 rounded-2xl border-dashed px-4 py-4 text-sm text-[var(--field-text-strong)]">
        <Paperclip className="h-4 w-4 text-indigo-300" />
        <span className="flex-1">Adicionar anexo opcional para a atividade</span>
        <input type="file" name="attachment" className="block w-full max-w-[180px] cursor-pointer text-xs text-[#6d79a5] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-100 dark:text-[#a3b6dc]" />
      </label>
      <p className="text-xs text-[#6d79a5] dark:text-[#9db2d8]">O anexo e opcional. Se enviado, ele fica disponivel para download na atividade. Tamanho maximo: 10 MB.</p>
=======
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
>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
      <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-[var(--field-text-strong)]">
          <input type="radio" name="status" value="DRAFT" defaultChecked className="accent-indigo-500" /> Rascunho
        </label>
        <label className="flex items-center gap-2 text-[var(--field-text-strong)]">
          <input type="radio" name="status" value="PUBLISHED" className="accent-indigo-500" /> Publicar
        </label>
      </div>
      {error && <p className="text-xs text-[#b14545] dark:text-[#ffb4b4]">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Salvar atividade
      </Button>
    </form>
  );
}
