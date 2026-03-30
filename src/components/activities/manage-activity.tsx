'use client';

import { useState, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Send } from 'lucide-react';
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
  };
};

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-[#d9def8] bg-white/96 px-4 py-3 text-sm text-[#22347e] placeholder:text-[#7b86b4] focus:border-[#7b86f8] focus:outline-none focus:ring-2 focus:ring-[#7b86f8]/20"
    />
  );
}

export function ManageActivity({ activity }: ManageActivityProps) {
  const router = useRouter();
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description);
  const [prompt, setPrompt] = useState(activity.prompt);
  const [tags, setTags] = useState(activity.tags.join(', '));
  const [status, setStatus] = useState<ActivityStatus>(activity.status);
  const [dueDate, setDueDate] = useState(activity.dueDate ?? '');
  const [loadingAction, setLoadingAction] = useState<'save' | 'publish' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submitActivity(nextStatus: ActivityStatus, action: 'save' | 'publish') {
    setLoadingAction(action);
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/activities/${activity.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        prompt,
        tags: tags
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        status: nextStatus,
        dueDate: dueDate || null,
      }),
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel atualizar a atividade.');
      setLoadingAction(null);
      return;
    }

    setStatus(body.status);
    setDueDate(body.dueDate ? String(body.dueDate).slice(0, 10) : '');
    setSuccess(nextStatus === 'PUBLISHED' ? 'Atividade publicada e liberada para os alunos.' : 'Alteracoes salvas com sucesso.');
    setLoadingAction(null);
    router.refresh();
  }

  return (
    <section className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,248,255,0.94))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#5a69a1]">Editar atividade</p>
          <p className="mt-1 text-sm leading-6 text-[#6d79a5]">
            Ajuste os campos do rascunho e publique quando quiser disponibilizar a proposta para os alunos.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-[#4250d4]">
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

        <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 text-[#42507b]">
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
          <label className="flex items-center gap-2 text-[#42507b]">
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
      </form>
    </section>
  );
}
