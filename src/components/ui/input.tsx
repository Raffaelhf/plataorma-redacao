'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-xl border bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 [border-color:var(--input-border)]',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
