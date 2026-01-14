'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MisoLogoProps {
  variant?: 'large' | 'compact';
  className?: string;
  linkToHome?: boolean;
}

export function MisoLogo({
  variant = 'large',
  className,
  linkToHome = true
}: MisoLogoProps) {
  const content = (
    <span
      className={cn(
        'font-medium tracking-tight select-none',
        variant === 'large' ? 'text-5xl' : 'text-2xl',
        className
      )}
    >
      <span className="text-primary">MISO</span>
      <span className="text-gray-500"> Labs</span>
    </span>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
