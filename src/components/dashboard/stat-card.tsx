import { ReactNode } from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  accent?: 'indigo' | 'emerald' | 'amber' | 'sky';
}

const accents = {
  indigo: 'border-indigo-500/30 bg-indigo-500/10',
  emerald: 'border-emerald-500/30 bg-emerald-500/10',
  amber: 'border-amber-500/30 bg-amber-500/10',
  sky: 'border-sky-500/30 bg-sky-500/10',
};

export function StatCard({ title, value, icon, accent = 'indigo' }: Props) {
  return (
    <Card className={cn('flex items-center justify-between gap-4', accents[accent])}>
      <div className="min-w-0">
        <p className="text-sm text-slate-400">{title}</p>
        <p className="break-words text-xl font-semibold text-white sm:text-2xl">{value}</p>
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">{icon}</div>
    </Card>
  );
}
