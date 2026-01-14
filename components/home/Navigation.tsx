'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, MessageCircle, Copy, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: '홈', href: '/' },
  { label: '활용 사례', href: '/templates' },
];

interface NavigationProps {
  variant?: 'default' | 'header';
}

export function Navigation({ variant = 'default' }: NavigationProps) {
  const pathname = usePathname();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('kyle@52g.team');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <nav className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-4 py-2 rounded-full text-sm font-kr transition-colors whitespace-nowrap text-gray-500 hover:text-gray-900 font-medium"
          >
            도와주세요!
          </button>
        </nav>
        <HelpModal
          open={showHelpModal}
          onOpenChange={setShowHelpModal}
          emailCopied={emailCopied}
          onCopyEmail={handleCopyEmail}
        />
      </>
    );
  }

  return (
    <>
      <header className="flex flex-wrap items-center justify-between pt-2 pb-8 lg:px-8">
        <nav className="flex items-center gap-1 bg-white rounded-full p-1 overflow-x-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-5 py-2 rounded-full text-sm font-kr transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-100 font-bold text-gray-900'
                    : 'text-gray-500 hover:text-gray-900 font-medium'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => setShowHelpModal(true)}
            className="px-5 py-2 rounded-full text-sm font-kr transition-colors whitespace-nowrap text-gray-500 hover:text-gray-900 font-medium"
          >
            도와주세요!
          </button>
        </nav>
      </header>
      <HelpModal
        open={showHelpModal}
        onOpenChange={setShowHelpModal}
        emailCopied={emailCopied}
        onCopyEmail={handleCopyEmail}
      />
    </>
  );
}

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailCopied: boolean;
  onCopyEmail: () => void;
}

function HelpModal({ open, onOpenChange, emailCopied, onCopyEmail }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">도움이 필요하신가요?</DialogTitle>
          <DialogDescription className="text-base pt-2">
            미소를 만들다가 궁금하거나 도움이 필요한 게 있으면 언제든지 편하게 문의 주세요!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Slack Contact */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-1">Slack으로 연락하기</p>
              <a
                href="https://52g-hq.slack.com/team/U09NY4GUJ4D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:underline break-all"
              >
                @kyle 프로필 보기
              </a>
            </div>
          </div>

          {/* Email Contact */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 mb-2">이메일로 연락하기</p>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-white px-3 py-1.5 rounded border border-gray-200 flex-1">
                  kyle@52g.team
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCopyEmail}
                  className="flex-shrink-0"
                >
                  {emailCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-600" />
                      복사됨
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      복사
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
