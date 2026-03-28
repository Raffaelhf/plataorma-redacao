'use client';

import { useMemo, useState, type TextareaHTMLAttributes } from 'react';
import { useSession } from 'next-auth/react';
import { CalendarPlus2, Loader2, RadioTower } from 'lucide-react';
import { isDemoLogin } from '@/lib/demo';
import { isTeacherRole } from '@/lib/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-2xl border border-[#d9def8] bg-white/90 px-4 py-3 text-sm text-[#22347e] placeholder:text-[#8a93b8] focus:border-[#7b86f8] focus:outline-none focus:ring-2 focus:ring-[#7b86f8]/20"
    />
  );
}

export function CreateLiveClass() {
  const { data } = useSession();
  const role = (data?.user as { role?: string } | undefined)?.role;
  const login =
    (data?.user as { email?: string; name?: string } | undefined)?.email ??
    (data?.user as { name?: string } | undefined)?.name;
  const isDemo = useMemo(() => isDemoLogin(login), [login]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isTeacherRole(role)) return null;

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isDemo) {
      setMessage('Agendamento simulado com sucesso no modo teste.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/live-classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.get('title'),
        description: formData.get('description'),
        scheduledAt: formData.get('scheduledAt'),
        meetingUrl: formData.get('meetingUrl') || null,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Não foi possível agendar a aula ao vivo.');
    } else {
      setMessage('Aula ao vivo agendada com sucesso.');
    }

    setLoading(false);
  };

  return (
    <form
      action={handleSubmit}
      className="rounded-[30px] border border-[#dde3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,249,255,0.9))] p-5 shadow-[0_20px_50px_rgba(74,73,140,0.1)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#5a69a1]">Encontro ao vivo</p>
          <h2 className="mt-1 text-lg font-semibold text-[#22347e]">Agendar aula ao vivo</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4250d4]">
          <CalendarPlus2 className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Input
          name="title"
          placeholder="Tema da aula ao vivo"
          required
          className="border-[#d9def8] bg-white/90 text-[#22347e] placeholder:text-[#8a93b8] focus:border-[#7b86f8] focus:ring-[#7b86f8]/20"
        />
        <TextArea name="description" rows={3} placeholder="Explique o que será tratado e para quem a aula é indicada." required />
        <Input
          name="scheduledAt"
          type="datetime-local"
          required
          className="border-[#d9def8] bg-white/90 text-[#22347e] placeholder:text-[#8a93b8] focus:border-[#7b86f8] focus:ring-[#7b86f8]/20"
        />
        <Input
          name="meetingUrl"
          type="url"
          placeholder="https://meet.google.com/... ou outra sala"
          className="border-[#d9def8] bg-white/90 text-[#22347e] placeholder:text-[#8a93b8] focus:border-[#7b86f8] focus:ring-[#7b86f8]/20"
        />
      </div>

      {error ? <p className="mt-3 text-xs text-[#c05252]">{error}</p> : null}
      {message ? <p className="mt-3 text-xs text-[#1b7f62]">{message}</p> : null}

      <Button type="submit" disabled={loading} className="mt-4 w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RadioTower className="mr-2 h-4 w-4" />}
        Agendar aula
      </Button>
    </form>
  );
}
