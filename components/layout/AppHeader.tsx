'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
  /**
   * 중앙에 표시할 제목 (선택사항)
   */
  title?: string;
  /**
   * 우측에 표시할 액션 버튼 (선택사항)
   */
  rightAction?: React.ReactNode;
}

const navItems = [
  { label: '홈', href: '/' },
  { label: '활용 사례', href: '/templates' },
];

/**
 * 앱 전체에서 사용하는 공통 헤더
 * - 좌측: miso labs 로고 + 구분선 + Navigation
 * - 중앙: 제목 (옵션)
 * - 우측: 액션 버튼 (옵션)
 */
export function AppHeader({ title, rightAction }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-heading font-bold text-xl text-gray-900 whitespace-nowrap">
          miso labs
        </Link>
        <div className="h-5 w-px bg-gray-200" />
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            // 홈(/)은 정확히 일치할 때만 활성화, 다른 메뉴는 하위 경로도 포함
            const isActive = item.href === '/'
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-kr transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-100 font-bold text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 font-medium'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Center: Title (optional) */}
      {title && (
        <h1 className="font-semibold text-base text-gray-900 absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
      )}

      {/* Right: Action button (optional) */}
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}
