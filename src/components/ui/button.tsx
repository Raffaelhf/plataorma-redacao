'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[linear-gradient(135deg,var(--cta-start)_0%,var(--cta-end)_100%)] text-white shadow-[0_18px_36px_rgba(255,104,70,0.26)] hover:translate-y-[-1px] hover:brightness-[1.03] disabled:opacity-60 disabled:cursor-not-allowed',
  secondary:
    'border border-white/70 bg-[rgba(255,255,255,0.88)] text-[#2e3ea7] shadow-[0_16px_32px_rgba(49,60,142,0.1)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700/70 dark:bg-slate-900/78 dark:text-slate-100 dark:hover:bg-slate-800/88',
  ghost: 'border border-white/60 bg-white/20 text-[#3340b3] hover:bg-white/70 dark:border-slate-700/70 dark:bg-slate-900/52 dark:text-slate-100 dark:hover:bg-slate-800/80',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = forwardRef<HTMLButtonElement, Props>(({ variant = 'primary', className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold leading-none transition-all duration-200 [&_svg]:shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b49dd]',
      variantClasses[variant],
      className,
    )}
    {...props}
  />
));

Button.displayName = 'Button';
