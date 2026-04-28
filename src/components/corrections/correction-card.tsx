'use client';

import { useState, type TextareaHTMLAttributes } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Send } from 'lucide-react';
import { isDemoLogin } from '@/lib/demo';
import { Button } from '../ui/button';

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="theme-field w-full rounded-xl px-3 py-2 text-sm"
    />
  );
}

export function CorrectionCard({ submissionId }: { submissionId: string }) {
  const { data } = useSession();
  const login =
    (data?.user as { email?: string; name?: string } | undefined)?.email ??
    (data?.user as { name?: string } | undefined)?.name;
  const [score, setScore] = useState(800);
  const [comments, setComments] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setStatus(null);

    if (isDemoLogin(login)) {
      setLoading(false);
      setStatus('Correção simulada no modo demo.');
      return;
    }

    const res = await fetch('/api/corrections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submissionId,
        comments,
        score,
        strengths: strengths.split(',').map((item) => item.trim()).filter(Boolean),
        improvements: improvements.split(',').map((item) => item.trim()).filter(Boolean),
      }),
    });
    setLoading(false);
    setStatus(res.ok ? 'Salvo' : 'Erro');
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <label className="flex items-center gap-2 text-[var(--field-text-strong)]">
          Nota
          <input
            type="number"
            min={0}
            max={1000}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="theme-field w-full rounded-lg px-2 py-2 text-sm"
          />
        </label>
      </div>
      <TextArea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Feedback para o aluno" />
      <TextArea rows={2} value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="Pontos fortes separados por vírgula" />
      <TextArea rows={2} value={improvements} onChange={(e) => setImprovements(e.target.value)} placeholder="Pontos a melhorar separados por vírgula" />
      <Button
        onClick={handleSave}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar correção
      </Button>
      {status && <p className="text-xs text-[var(--em-text-soft)]">{status}</p>}
    </div>
  );
}
