'use client';

import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProfileUpdateButton() {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (!clicked) return;

    const timeout = window.setTimeout(() => {
      setClicked(false);
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [clicked]);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={() => setClicked(true)}
        className="group relative w-full overflow-hidden px-5 py-3 sm:w-fit"
      >
        <span className="relative inline-flex items-center gap-2">
          <Save className={`h-4 w-4 transition-transform duration-200 ${clicked ? 'scale-110' : 'group-hover:-translate-y-0.5'}`} />
          {clicked ? 'Salvamento em breve' : 'Atualizar perfil'}
        </span>
      </Button>
      <p className={`text-xs transition-colors duration-200 ${clicked ? 'text-[var(--em-green-deep)]' : 'text-[var(--em-text-soft)]'}`}>
        {clicked ? 'O clique foi recebido. A integracao de salvamento sera conectada nesta tela.' : 'Passe o mouse ou clique para ver o efeito do novo botao.'}
      </p>
    </div>
  );
}
