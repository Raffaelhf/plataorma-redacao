'use client';

import { useRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, FileVideo, Loader2, Paperclip, Save, Send, Trash2, X } from 'lucide-react';
import {
  ACTIVITY_ATTACHMENT_ACCEPT,
  ACTIVITY_ATTACHMENT_MAX_FILES,
  formatFileSize,
  getActivityAttachmentKindLabel,
  validateActivityAttachmentFile,
} from '@/lib/activity-attachments';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type ActivityStatus = 'DRAFT' | 'PUBLISHED';

type ManageActivityProps = {
  activity: {
    id: string;
    title: string;
    description: string;
    prompt: string;
    tags: string[];
    status: ActivityStatus;
    dueDate: string | null;
    attachments: {
      id: string;
      fileName: string;
      mimeType: string;
      sizeInBytes: number;
    }[];
  };
};

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] placeholder:opacity-100 focus:border-[#7b86f8] focus:outline-none focus:ring-2 focus:ring-[#7b86f8]/20 dark:[color-scheme:dark] dark:focus:border-[#7d8eff] dark:focus:ring-[#6278ff]/25"
    />
  );
}

export function ManageActivity({ activity }: ManageActivityProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [prompt, setPrompt] = useState(activity.prompt);
  const [tags, setTags] = useState(activity.tags.join(', '));
  const [status, setStatus] = useState<ActivityStatus>(activity.status);
  const [dueDate, setDueDate] = useState(activity.dueDate ?? '');
  const [existingAttachments, setExistingAttachments] = useState(activity.attachments);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [loadingAction, setLoadingAction] = useState<'save' | 'publish' | 'delete' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleAttachmentSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const activeExistingAttachments = existingAttachments.filter((attachment) => !removedAttachmentIds.includes(attachment.id));
    const nextAttachments = [...newAttachments];

    for (const file of selectedFiles) {
      const validationError = validateActivityAttachmentFile(file);
      if (validationError) {
        setError(validationError);
        event.target.value = '';
        return;
      }

      if (activeExistingAttachments.length + nextAttachments.length >= ACTIVITY_ATTACHMENT_MAX_FILES) {
        setError(`Voce pode manter no maximo ${ACTIVITY_ATTACHMENT_MAX_FILES} materiais de apoio por atividade.`);
        event.target.value = '';
        return;
      }

      nextAttachments.push(file);
    }

    setNewAttachments(nextAttachments);
    setError(null);
    event.target.value = '';
  }

  function toggleExistingAttachmentRemoval(attachmentId: string) {
    setRemovedAttachmentIds((current) =>
      current.includes(attachmentId) ? current.filter((id) => id !== attachmentId) : [...current, attachmentId],
    );
  }

  function removeNewAttachment(index: number) {
    setNewAttachments((current) => current.filter((_, attachmentIndex) => attachmentIndex !== index));
  }

  async function submitActivity(nextStatus: ActivityStatus, action: 'save' | 'publish') {
    setLoadingAction(action);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('prompt', prompt);
    formData.append('tags', tags);
    formData.append('status', nextStatus);
    formData.append('dueDate', dueDate || '');
    newAttachments.forEach((attachment) => {
      formData.append('attachments', attachment);
    });
    removedAttachmentIds.forEach((attachmentId) => {
      formData.append('removeAttachmentIds', attachmentId);
    });

    const response = await fetch(`/api/activities/${activity.id}`, {
      method: 'PUT',
      body: formData,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel atualizar a atividade.');
      setLoadingAction(null);
      return;
    }

    setStatus(body.status);
    setDueDate(body.dueDate ? String(body.dueDate).slice(0, 10) : '');
    setExistingAttachments(Array.isArray(body.attachments) ? body.attachments : []);
    setRemovedAttachmentIds([]);
    setNewAttachments([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSuccess(nextStatus === 'PUBLISHED' ? 'Atividade publicada e liberada para os alunos.' : 'Alteracoes salvas com sucesso.');
    setLoadingAction(null);
    router.refresh();
  }

  async function deleteActivity() {
    const confirmed = window.confirm('Excluir esta atividade? Os envios e correcoes vinculados tambem serao removidos.');
    if (!confirmed) return;

    setLoadingAction('delete');
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/activities/${activity.id}`, {
      method: 'DELETE',
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel excluir a atividade.');
      setLoadingAction(null);
      return;
    }

    router.push('/atividades');
    router.refresh();
  }

  return (
    <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,255,0.94))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] dark:border-slate-700/80 dark:bg-[linear-gradient(180deg,rgba(10,18,31,0.96),rgba(14,23,42,0.92))] dark:shadow-[0_20px_50px_rgba(0,0,0,0.24)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#5a69a1] dark:text-[#a9bbf0]">Editar atividade</p>
          <p className="mt-1 text-sm leading-6 text-[#6d79a5] dark:text-[#b3c3e6]">
            Ajuste os campos do rascunho e publique quando quiser disponibilizar a proposta para os alunos.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4] dark:bg-[#1d2b4d] dark:text-[#c8d5ff]">
          {status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
        </span>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submitActivity(status, 'save');
        }}
      >
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titulo" required />
        <TextArea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descricao breve" required rows={3} />
        <TextArea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Enunciado / prompt" required rows={6} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags separadas por virgula" />
          <Input value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" />
        </div>

        <div className="rounded-2xl border border-[#dde3fb] bg-white/70 p-4 dark:border-slate-700/80 dark:bg-[#0d172b]/80">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#22347e] dark:text-[#eef4ff]">
            <Paperclip className="h-4 w-4" />
            Materiais de apoio
          </div>
          <p className="mt-1 text-sm text-[#6d79a5] dark:text-[#b3c3e6]">
            Anexe videos, PDF, Word ou PowerPoint para acompanhar a proposta.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACTIVITY_ATTACHMENT_ACCEPT}
            onChange={handleAttachmentSelection}
            className="mt-3 block w-full text-sm text-[var(--input-text)] file:mr-3 file:rounded-full file:border-0 file:bg-[#eef2ff] file:px-4 file:py-2 file:font-semibold file:text-[#4250d4] hover:file:bg-[#dfe7ff] dark:file:bg-[#1d2b4d] dark:file:text-[#d6e2ff] dark:hover:file:bg-[#26385f]"
          />
          <p className="mt-2 text-xs text-[#6d79a5] dark:text-[#9fb0d8]">
            Ate {ACTIVITY_ATTACHMENT_MAX_FILES} anexos por atividade.
          </p>

          {existingAttachments.length > 0 ? (
            <div className="mt-4 space-y-2">
              {existingAttachments.map((attachment) => {
                const isMarkedForRemoval = removedAttachmentIds.includes(attachment.id);
                const attachmentKind = getActivityAttachmentKindLabel(attachment.fileName, attachment.mimeType);
                const AttachmentIcon = attachmentKind === 'Video' ? FileVideo : FileText;

                return (
                  <div
                    key={attachment.id}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${
                      isMarkedForRemoval
                        ? 'border-[#ffd0cf] bg-[#fff1f1] dark:border-[rgba(111,52,58,0.8)] dark:bg-[rgba(69,31,37,0.42)]'
                        : 'border-[#dde3fb] bg-white/90 dark:border-slate-700/80 dark:bg-[#10192d]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#22347e] dark:text-[#eef4ff]">
                        <AttachmentIcon className="h-4 w-4 shrink-0" />
                        <a href={`/api/activity-attachments/${attachment.id}`} target="_blank" rel="noreferrer" className="truncate hover:underline">
                          {attachment.fileName}
                        </a>
                      </div>
                      <p className="text-xs text-[#6d79a5] dark:text-[#9fb0d8]">
                        {attachmentKind} • {formatFileSize(attachment.sizeInBytes)}
                        {isMarkedForRemoval ? ' • Sera removido ao salvar' : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExistingAttachmentRemoval(attachment.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        isMarkedForRemoval
                          ? 'bg-white text-[#b14545] dark:bg-[#221319] dark:text-[#ffb4b4]'
                          : 'bg-[#eef2ff] text-[#4250d4] dark:bg-[#1d2b4d] dark:text-[#c8d5ff]'
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isMarkedForRemoval ? 'Desfazer' : 'Remover'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}

          {newAttachments.length > 0 ? (
            <div className="mt-4 space-y-2">
              {newAttachments.map((attachment, index) => {
                const attachmentKind = getActivityAttachmentKindLabel(attachment.name, attachment.type);
                const AttachmentIcon = attachmentKind === 'Video' ? FileVideo : FileText;

                return (
                  <div key={`${attachment.name}-${attachment.lastModified}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#dde3fb] bg-white/90 px-3 py-2 dark:border-slate-700/80 dark:bg-[#10192d]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[#22347e] dark:text-[#eef4ff]">
                        <AttachmentIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{attachment.name}</span>
                      </div>
                      <p className="text-xs text-[#6d79a5] dark:text-[#9fb0d8]">
                        {attachmentKind} • {formatFileSize(attachment.size)} • Sera enviado ao salvar
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewAttachment(index)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef2ff] text-[#4250d4] transition-colors hover:bg-[#dfe7ff] dark:bg-[#1d2b4d] dark:text-[#d6e2ff] dark:hover:bg-[#26385f]"
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
          <label className="flex items-center gap-2 text-[#42507b] dark:text-[#d8e3ff]">
            <input
              type="radio"
              name="status"
              value="DRAFT"
              checked={status === 'DRAFT'}
              onChange={() => setStatus('DRAFT')}
              className="accent-[#4250d4]"
            />
            Manter como rascunho
          </label>
          <label className="flex items-center gap-2 text-[#42507b] dark:text-[#d8e3ff]">
            <input
              type="radio"
              name="status"
              value="PUBLISHED"
              checked={status === 'PUBLISHED'}
              onChange={() => setStatus('PUBLISHED')}
              className="accent-[#4250d4]"
            />
            Publicar para os alunos
          </label>
        </div>

        {error ? <p className="text-sm text-[#b54752] dark:text-[#ffb4b4]">{error}</p> : null}
        {success ? <p className="text-sm text-[#227357] dark:text-[#8fe0b7]">{success}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={loadingAction !== null} className="sm:flex-1">
            {loadingAction === 'save' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar alteracoes
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={loadingAction !== null || status === 'PUBLISHED'}
            onClick={() => void submitActivity('PUBLISHED', 'publish')}
            className="sm:flex-1"
          >
            {loadingAction === 'publish' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Publicar atividade
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          disabled={loadingAction !== null}
          onClick={() => void deleteActivity()}
          className="w-full border-[#ffd0cf] bg-[#fff1f1] text-[#b14545] hover:bg-[#ffe7e7] dark:border-[rgba(111,52,58,0.8)] dark:bg-[rgba(69,31,37,0.42)] dark:text-[#ffb4b4] dark:hover:bg-[rgba(88,39,46,0.52)]"
        >
          {loadingAction === 'delete' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Excluir atividade
        </Button>
      </form>
    </section>
  );
}
