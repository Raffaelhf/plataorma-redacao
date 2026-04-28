'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-xl border-[1.5px] border-[var(--em-border-strong)] bg-[var(--em-bg)] px-4 py-3 text-sm font-medium text-[var(--em-ink)] placeholder:text-[var(--em-text-mute)] focus:border-[var(--em-ink)] focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-70',
      className,
    )}
    {...props}
  />
));

Input.displayName = 'Input';
