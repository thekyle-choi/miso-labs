'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  language?: string;
  maxHeight?: number;
  className?: string;
}

/**
 * 코드 미리보기 패턴
 * 코드 노드 등에서 코드 스니펫 표시
 */
export function CodePreview({
  code,
  language = 'python3',
  maxHeight = 128,
  className,
}: CodePreviewProps) {
  const displayLanguage = language === 'python3' ? 'Python' : language;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Badge variant="secondary" className="font-mono text-[10px]">
        {displayLanguage}
      </Badge>
      <ScrollArea
        className="rounded-md border bg-muted/50"
        style={{ maxHeight }}
      >
        <pre className="p-3 text-[11px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
          {code}
        </pre>
      </ScrollArea>
    </div>
  );
}
