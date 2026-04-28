import Image from 'next/image';
import { cn } from '@/lib/utils';

type PlatformLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  variant?: 'default' | 'light';
};

export function PlatformLogo({
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 640px) 154px, 210px',
  variant = 'default',
}: PlatformLogoProps) {
  return (
    <div className={cn('relative aspect-[1117/224]', className)}>
      <Image
        src={variant === 'light' ? '/landing/logo-v3-light.png' : '/landing/logo-v3.png'}
        alt="Logo Escreva Mais"
        fill
        priority={priority}
        sizes={sizes}
        className={cn('object-contain object-center', imageClassName)}
      />
    </div>
  );
}
