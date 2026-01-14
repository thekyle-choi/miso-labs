'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: '찾아보기', href: '/explore' },
  { label: '질문하기', href: '/ask' },
  { label: '실험실', href: '/lab' },
];

interface FloatingHeaderProps {
  className?: string;
}

export function FloatingHeader({ className }: FloatingHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        'fixed top-6 left-1/2 transform -translate-x-1/2',
        'w-[90%] max-w-7xl z-50',
        'transition-all duration-300',
        className
      )}
    >
      <div
        className={cn(
          'bg-white/95 backdrop-blur-md',
          'rounded-full shadow-float',
          'px-8 py-4',
          'flex justify-between items-center',
          'border border-gray-100'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-semibold text-2xl tracking-tight text-gray-900 group-hover:text-primary transition-colors">
            MISO<span className="italic text-gray-500">Labs</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium tracking-wide transition-colors',
                pathname === item.href
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            'md:hidden mt-2',
            'bg-white/95 backdrop-blur-md',
            'rounded-2xl shadow-float',
            'px-6 py-4',
            'border border-gray-100',
            'animate-fade-in'
          )}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-sm font-medium tracking-wide transition-colors py-2',
                  pathname === item.href
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
