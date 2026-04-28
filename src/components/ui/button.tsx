'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';

const variantClasses: Record<Variant, string> = {
  primary:
    'border-[1.5px] border-[var(--em-ink)] bg-[var(--em-yellow)] text-[var(--em-ink)] shadow-[var(--em-shadow-hard-sm)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#0E0F12] disabled:cursor-not-allowed disabled:opacity-60',
  secondary:
    'border-[1.5px] border-[var(--em-ink)] bg-white text-[var(--em-ink)] shadow-[var(--em-shadow-hard-sm)] hover:bg-[var(--em-cream)] disabled:cursor-not-allowed disabled:opacity-60',
  ghost: 'border-[1.5px] border-[var(--em-ink)] bg-white/70 text-[var(--em-ink)] hover:bg-white',
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
