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
        'em-card-hard bg-[var(--em-surface)] p-4 text-[var(--em-ink)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
