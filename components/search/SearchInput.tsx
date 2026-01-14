'use client';

import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchLayout, searchColors, searchTransitions } from '@/components/design-system/tokens/search';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  variant?: 'main' | 'compact';
  className?: string;
  isFocused?: boolean;
  isDragging?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onClear,
      onFocus,
      onBlur,
      placeholder = 'Search workflows or drop YAML file...',
      variant = 'main',
      className,
      isFocused = false,
      isDragging = false,
    },
    ref
  ) => {
    const layout = searchLayout[variant];

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSubmit();
      } else if (e.key === 'Escape') {
        onClear();
      }
    };

    return (
      <div
        className={cn(
          'relative flex items-center w-full rounded-full border',
          searchColors.background.default,
          searchTransitions.all,
          // Border state
          isDragging
            ? searchColors.border.dragOver
            : isFocused
            ? searchColors.border.focus
            : searchColors.border.default,
          // Shadow state
          isDragging
            ? searchColors.shadow.focus
            : isFocused
            ? searchColors.shadow.focus
            : searchColors.shadow.default,
          // Hover shadow (only when not focused)
          !isFocused && !isDragging && 'hover:shadow-md',
          // Drag over background
          isDragging && searchColors.background.dragOver,
          className
        )}
        style={{
          maxWidth: layout.maxWidth,
          height: layout.height,
          borderRadius: layout.borderRadius,
        }}
      >
        {/* Search Icon */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center',
            searchColors.text.icon
          )}
          style={{ paddingLeft: layout.paddingX }}
        >
          <Search size={layout.iconSize} />
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            'flex-1 bg-transparent outline-none border-none',
            searchColors.text.input,
            'placeholder:text-muted-foreground'
          )}
          style={{
            fontSize: layout.fontSize,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              'flex-shrink-0 flex items-center justify-center',
              searchColors.text.icon,
              'hover:text-gray-600 transition-colors'
            )}
            style={{ paddingRight: layout.paddingX }}
          >
            <X size={layout.iconSize - 2} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
