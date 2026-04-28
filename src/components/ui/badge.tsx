import { cn } from '@/lib/utils';

export function Badge({ label, variant = 'default' }: { label: string; variant?: 'success' | 'warning' | 'muted' | 'default' }) {
  const colors = {
    default: 'border border-[var(--em-ink)] bg-[var(--em-ink)] text-white',
    success: 'border border-[var(--em-ink)] bg-[var(--em-green-soft)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]',
    warning: 'border border-[var(--em-ink)] bg-[var(--em-yellow-soft)] text-[var(--em-ink)] shadow-[2px_2px_0_0_#0E0F12]',
    muted: 'border border-[var(--em-ink)] bg-[var(--em-bg-alt)] text-[var(--em-ink)]',
  };
  return <span className={cn('rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.01em]', colors[variant])}>{label}</span>;
}
