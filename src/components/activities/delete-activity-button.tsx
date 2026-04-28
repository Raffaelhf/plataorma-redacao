'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DeleteActivityButtonProps = {
  activityId: string;
  activityTitle: string;
};

export function DeleteActivityButton({ activityId, activityTitle }: DeleteActivityButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Excluir a atividade "${activityTitle}"? Os envios, correcoes e anexos vinculados tambem serao removidos.`,
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    const response = await fetch(`/api/activities/${activityId}`, {
      method: 'DELETE',
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel excluir a atividade.');
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="ghost"
        disabled={loading}
        onClick={() => void handleDelete()}
        className="border-[var(--em-ink)] bg-[var(--em-rose)] px-4 py-2 text-xs font-semibold text-[var(--em-ink)] hover:bg-[var(--em-rose)]"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
        Excluir atividade
      </Button>
      {error ? <p className="text-xs text-[var(--em-rose-deep)]">{error}</p> : null}
    </div>
  );
}
