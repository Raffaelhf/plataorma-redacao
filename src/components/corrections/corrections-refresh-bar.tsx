'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CorrectionsRefreshBar() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [lastUpdate, setLastUpdate] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => {
      startTransition(() => {
        router.refresh();
        setLastUpdate(new Date());
      });
    }, 15000);

    return () => window.clearInterval(interval);
  }, [router, startTransition]);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
      setLastUpdate(new Date());
    });
  };

  return (
    <div className="em-card-hard flex flex-col gap-3 bg-white p-4 text-sm text-[var(--em-text-soft)] sm:flex-row sm:items-center sm:justify-between">
      <p>
        A fila atualiza automaticamente a cada 15 segundos.
        {' '}
        Ultima atualizacao: {lastUpdate.toLocaleTimeString('pt-BR')}
      </p>
      <Button type="button" onClick={handleRefresh} disabled={isPending}>
        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Atualizar fila
      </Button>
    </div>
  );
}
