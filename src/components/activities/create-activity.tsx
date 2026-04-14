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
    <form ref={formRef} action={handleSubmit} className="theme-form-surface space-y-3 rounded-2xl p-4">
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
      <label className="theme-field-panel flex cursor-pointer items-center gap-3 rounded-2xl border-dashed px-4 py-4 text-sm text-[var(--field-text-strong)]">
        <Paperclip className="h-4 w-4 text-indigo-300" />
        <span className="flex-1">Adicionar anexo opcional para a atividade</span>
        <input type="file" name="attachment" className="block w-full max-w-[180px] cursor-pointer text-xs text-[#6d79a5] file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-indigo-500/20 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-indigo-100 dark:text-[#a3b6dc]" />
      </label>
      <p className="text-xs text-[#6d79a5] dark:text-[#9db2d8]">O anexo e opcional. Se enviado, ele fica disponivel para download na atividade. Tamanho maximo: 10 MB.</p>
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
