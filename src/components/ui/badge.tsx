import { cn } from '@/lib/utils';

export function Badge({ label, variant = 'default' }: { label: string; variant?: 'success' | 'warning' | 'muted' | 'default' }) {
  const colors = {
    default: 'bg-slate-800 text-slate-100 dark:bg-slate-700 dark:text-slate-50',
    success:
      'border border-emerald-500/55 bg-emerald-100 text-emerald-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:border-emerald-400/30 dark:bg-emerald-950/70 dark:text-emerald-200 dark:shadow-none',
    warning:
      'border border-amber-500/60 bg-amber-100 text-amber-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] dark:border-amber-400/30 dark:bg-amber-950/70 dark:text-amber-200 dark:shadow-none',
    muted: 'border border-slate-300 bg-slate-200 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
  };
  return <span className={cn('rounded-full px-3 py-1 text-xs font-semibold tracking-[0.01em]', colors[variant])}>{label}</span>;
}
