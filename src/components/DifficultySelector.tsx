'use client';

import type { Difficulty } from '@/types';

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  size?: 'sm' | 'md' | 'lg';
}

const options: { value: Difficulty; label: string; color: string; bg: string; border: string }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    color: 'text-[#22c55e]',
    bg: 'bg-[#22c55e]/10',
    border: 'border-[#22c55e]/40',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    color: 'text-[#f97316]',
    bg: 'bg-[#f97316]/10',
    border: 'border-[#f97316]/40',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    color: 'text-[#ef4444]',
    bg: 'bg-[#ef4444]/10',
    border: 'border-[#ef4444]/40',
  },
];

export default function DifficultySelector({
  value,
  onChange,
  size = 'md',
}: DifficultySelectorProps) {
  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm';

  return (
    <div className="flex items-center gap-2 p-1 bg-[#0f0f0f] border border-white/[0.06] rounded-xl">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              ${padding} rounded-lg font-semibold transition-all duration-200 border
              ${isActive
                ? `${opt.color} ${opt.bg} ${opt.border} shadow-sm`
                : 'text-[#52525b] border-transparent hover:text-[#a1a1aa] hover:bg-white/[0.03]'
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function DifficultyBadge({ value }: { value: Difficulty }) {
  const map: Record<Difficulty, { label: string; className: string }> = {
    beginner: { label: 'Beginner', className: 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/30' },
    intermediate: { label: 'Intermediate', className: 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/30' },
    advanced: { label: 'Advanced', className: 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/30' },
  };
  const { label, className } = map[value];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}
