'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: '// Guide', href: '/' },
  { label: '// Labs', href: '/labs' },
];

export function SplitHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full sticky top-0 z-50 bg-white lg:bg-[linear-gradient(90deg,#ffffff_50%,#0a0a0a_50%)] border-b border-gray-100 lg:border-transparent transition-all duration-300">
      <div className="w-full max-w-[2000px] mx-auto flex items-center justify-between px-6 lg:px-10 py-5">
        {/* Logo */}
        <div className="flex items-center gap-2 w-[calc(50%-60px)] lg:w-auto">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-black uppercase font-mono">
            Miso_Labs<span className="animate-pulse">_</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-white/90 backdrop-blur-md border border-gray-200 p-1 rounded-full shadow-lg z-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-5 py-2 rounded-full text-[10px] uppercase tracking-wider font-mono transition-colors',
                pathname === item.href
                  ? 'bg-black text-white shadow-sm'
                  : 'text-gray-500 hover:text-black hover:bg-gray-100'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 text-black lg:text-white justify-end w-[calc(50%-60px)] lg:w-auto">
          <button className="text-xs font-mono font-medium opacity-70 hover:opacity-100 transition-opacity uppercase tracking-widest">
            [ Log_in ]
          </button>
          <div className="w-8 h-8 rounded bg-gray-100 lg:bg-[#1a1a1a] flex items-center justify-center border border-gray-200 lg:border-white/10 hover:border-gray-300 lg:hover:border-white/30 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm text-gray-600 lg:text-gray-400">layers</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default SplitHeader;
