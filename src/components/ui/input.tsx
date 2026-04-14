'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn('theme-field w-full rounded-xl px-4 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70', className)}
    {...props}
  />
));

Input.displayName = 'Input';
