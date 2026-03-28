import Image from 'next/image';
import { cn } from '@/lib/utils';

type PlatformLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function PlatformLogo({
  className,
  imageClassName,
  priority = false,
  sizes = '(max-width: 640px) 154px, 210px',
}: PlatformLogoProps) {
  return (
    <div className={cn('relative aspect-[1117/224]', className)}>
      <Image
        src="/landing/logo-v3.png"
        alt="Logo Escreva Mais"
        fill
        priority={priority}
        sizes={sizes}
        className={cn('object-contain object-center', imageClassName)}
      />
    </div>
  );
}
