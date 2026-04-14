'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
<<<<<<< HEAD
      'theme-field w-full rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70',
=======
      'w-full rounded-xl border bg-[var(--input-bg)] px-4 py-3 text-sm text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] placeholder:opacity-100 transition-colors focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 [border-color:var(--input-border)] dark:[color-scheme:dark]',
>>>>>>> e40f05bd7973d64a521a07873574c13fee880b8f
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
