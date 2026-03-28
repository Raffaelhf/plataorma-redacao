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
        variant="secondary"
        onClick={() => setClicked(true)}
        className="group relative w-full overflow-hidden rounded-2xl border border-[#d9def8] bg-[linear-gradient(135deg,#ffffff_0%,#f2f4ff_45%,#ece8ff_100%)] px-5 py-3 text-[#3142aa] shadow-[0_18px_35px_rgba(75,89,180,0.14)] hover:-translate-y-0.5 hover:border-[#b9c6ff] hover:text-[#24358f] hover:shadow-[0_24px_40px_rgba(75,89,180,0.2)] active:translate-y-[1px] active:scale-[0.985] active:shadow-[0_10px_20px_rgba(75,89,180,0.14)] dark:border-slate-600 dark:bg-[linear-gradient(135deg,#18233f_0%,#1f2d52_45%,#273560_100%)] dark:text-slate-100 dark:shadow-[0_18px_35px_rgba(0,0,0,0.28)] dark:hover:border-slate-500 dark:hover:text-white dark:hover:shadow-[0_24px_40px_rgba(0,0,0,0.34)] sm:w-fit"
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,73,221,0.16),transparent_48%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-100 dark:bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.2),transparent_48%)]" />
        <span className="relative inline-flex items-center gap-2">
          <Save className={`h-4 w-4 transition-transform duration-200 ${clicked ? 'scale-110' : 'group-hover:-translate-y-0.5'}`} />
          {clicked ? 'Salvamento em breve' : 'Atualizar perfil'}
        </span>
      </Button>
      <p className={`text-xs transition-colors duration-200 ${clicked ? 'text-[#4250d4] dark:text-[#9eb2ff]' : 'text-[#8a6f9f] dark:text-slate-400'}`}>
        {clicked ? 'O clique foi recebido. A integracao de salvamento sera conectada nesta tela.' : 'Passe o mouse ou clique para ver o efeito do novo botao.'}
      </p>
    </div>
  );
}
