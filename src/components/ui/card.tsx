import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-[var(--card-text)] shadow-xl shadow-black/10 transition-colors dark:shadow-black/20',
        className,
      )}
    >
      {children}
    </div>
  );
}
