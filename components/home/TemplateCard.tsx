'use client';

import { cn } from '@/lib/utils';

interface TemplateCardProps {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function TemplateCard({
  icon,
  title,
  description,
  tags,
  className,
  onClick,
}: TemplateCardProps) {
  return (
    <div
      className={cn(
        'group flex flex-col sm:flex-row gap-4 p-5 bg-white border border-gray-100 rounded-xl',
        'hover:border-indigo-200 hover:shadow-[0_4px_20px_-10px_rgba(99,102,241,0.2)]',
        'transition-all duration-300 cursor-pointer relative overflow-hidden',
        className
      )}
      onClick={onClick}
    >
      {/* Arrow Icon (appears on hover) */}
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="material-symbols-outlined text-indigo-500 text-lg">arrow_outward</span>
      </div>

      {/* Icon Box */}
      <div className="w-14 h-14 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-100 text-2xl group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full border border-gray-100 bg-gray-50 text-[11px] text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
