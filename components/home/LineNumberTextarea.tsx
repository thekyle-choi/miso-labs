'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LineNumberTextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  rows?: number;
}

export function LineNumberTextarea({
  label = '내 앱 소개하기',
  placeholder = '어떤 앱인지 간단히 설명해주세요...',
  value: controlledValue,
  onChange,
  className,
  rows = 5,
}: LineNumberTextareaProps) {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm text-white font-medium block">{label}</label>
      <div
        className={cn(
          'relative rounded-xl transition-all duration-200',
          isFocused
            ? 'ring-1 ring-emerald-500/30 bg-[#1a1a1a]'
            : 'bg-[#161616] hover:bg-[#1a1a1a]'
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full bg-transparent p-4 text-sm leading-relaxed text-gray-200 placeholder-gray-500 focus:outline-none resize-none"
          placeholder={placeholder}
          rows={rows}
        />
      </div>
      <p className="text-xs text-gray-500">앱의 목적과 주요 기능을 설명해주세요</p>
    </div>
  );
}

export default LineNumberTextarea;
