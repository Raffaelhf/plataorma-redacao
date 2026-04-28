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
import { SERVERLESS_SAFE_UPLOAD_BYTES, getServerlessUploadLimitLabel, getServerlessUploadLimitMessage } from '@/lib/upload-limits';
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
      className="theme-field w-full rounded-2xl px-4 py-3 text-sm"
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

    const totalAttachmentBytes = nextAttachments.reduce((sum, file) => sum + file.size, 0);
    if (totalAttachmentBytes > SERVERLESS_SAFE_UPLOAD_BYTES) {
      setError(getServerlessUploadLimitMessage('arquivos de apoio'));
      event.target.value = '';
      return;
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
      setError(response.status === 413 ? getServerlessUploadLimitMessage('arquivos de apoio') : body.error || 'Nao foi possivel atualizar a atividade.');
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
    <section className="em-card-hard bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-[var(--em-ink)]">Editar atividade</p>
          <p className="mt-1 text-sm leading-6 text-[var(--em-text-soft)]">
            Ajuste os campos do rascunho e publique quando quiser disponibilizar a proposta para os alunos.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-[var(--em-border-strong)] bg-[var(--em-mint)] px-3 py-1 text-xs font-extrabold text-[var(--em-ink)]">
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

        <div className="theme-field-panel rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm font-extrabold text-[var(--em-ink)]">
            <Paperclip className="h-4 w-4" />
            Materiais de apoio
          </div>
          <p className="mt-1 text-sm text-[var(--em-text-soft)]">
            Anexe videos, PDF, Word ou PowerPoint para acompanhar a proposta. Total por envio: ate {getServerlessUploadLimitLabel()}.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACTIVITY_ATTACHMENT_ACCEPT}
            onChange={handleAttachmentSelection}
            className="mt-3 block w-full text-sm text-[var(--em-ink)] file:mr-3 file:rounded-xl file:border file:border-[var(--em-ink)] file:bg-[var(--em-yellow)] file:px-4 file:py-2 file:font-extrabold file:text-[var(--em-ink)]"
          />
          <p className="mt-2 text-xs text-[var(--em-text-soft)]">
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
                        ? 'border-[#ffd0cf] bg-[#fff1f1]'
                        : 'border-[var(--em-border-strong)] bg-white/90'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--em-ink)]">
                        <AttachmentIcon className="h-4 w-4 shrink-0" />
                        <a href={`/api/activity-attachments/${attachment.id}`} target="_blank" rel="noreferrer" className="truncate hover:underline">
                          {attachment.fileName}
                        </a>
                      </div>
                      <p className="text-xs text-[var(--em-text-soft)]">
                        {attachmentKind} • {formatFileSize(attachment.sizeInBytes)}
                        {isMarkedForRemoval ? ' • Sera removido ao salvar' : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExistingAttachmentRemoval(attachment.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        isMarkedForRemoval
                          ? 'bg-white text-[#b14545]'
                          : 'bg-[var(--em-mint)] text-[var(--em-ink)]'
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
                  <div key={`${attachment.name}-${attachment.lastModified}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--em-border-strong)] bg-white/90 px-3 py-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--em-ink)]">
                        <AttachmentIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{attachment.name}</span>
                      </div>
                      <p className="text-xs text-[var(--em-text-soft)]">
                        {attachmentKind} • {formatFileSize(attachment.size)} • Sera enviado ao salvar
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewAttachment(index)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--em-mint)] text-[var(--em-ink)] transition-colors hover:bg-[#dfe7ff]"
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
          <label className="flex items-center gap-2 text-[#42507b]">
            <input
              type="radio"
              name="status"
              value="DRAFT"
              checked={status === 'DRAFT'}
              onChange={() => setStatus('DRAFT')}
              className="accent-[var(--em-green-deep)]"
            />
            Manter como rascunho
          </label>
          <label className="flex items-center gap-2 text-[#42507b]">
            <input
              type="radio"
              name="status"
              value="PUBLISHED"
              checked={status === 'PUBLISHED'}
              onChange={() => setStatus('PUBLISHED')}
              className="accent-[var(--em-green-deep)]"
            />
            Publicar para os alunos
          </label>
        </div>

        {error ? <p className="text-sm text-[#b54752]">{error}</p> : null}
        {success ? <p className="text-sm text-[#227357]">{success}</p> : null}

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
          className="w-full border-[var(--em-ink)] bg-[var(--em-rose)] text-[var(--em-ink)] hover:bg-[var(--em-rose)]"
        >
          {loadingAction === 'delete' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
          Excluir atividade
        </Button>
      </form>
    </section>
  );
}
