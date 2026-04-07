'use client';

import { useRef, useState, type TextareaHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, Paperclip, Plus } from 'lucide-react';
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
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isTeacherRole(role)) return null;

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (isDemoLogin(login)) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    const res = await fetch('/api/activities', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const bodyRes = await res.json().catch(() => ({}));
      setError(bodyRes.error || 'Erro ao criar atividade');
    } else {
      setSuccess(true);
      formRef.current?.reset();
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-lg">
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
      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-4 text-sm text-slate-200">
        <Paperclip className="h-4 w-4 text-indigo-300" />
        <span className="flex-1">Adicionar anexo opcional para a atividade</span>
        <input type="file" name="attachment" className="block w-full max-w-[180px] cursor-pointer text-xs text-slate-300 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-100" />
      </label>
      <p className="text-xs text-slate-400">O anexo e opcional. Se enviado, ele fica disponivel para download na atividade. Tamanho maximo: 10 MB.</p>
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
