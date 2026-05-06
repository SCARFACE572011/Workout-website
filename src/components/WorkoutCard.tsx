import Link from 'next/link';
import { Clock, Dumbbell, Flame, ChevronRight } from 'lucide-react';
import type { WorkoutDay, Difficulty } from '@/types';
import { estimateWorkoutCalories } from '@/lib/calculations';

interface WorkoutCardProps {
  day: WorkoutDay;
  difficulty: Difficulty;
  weightLbs: number;
  completed?: boolean;
  large?: boolean;
}

const colorMap = {
  blue: {
    accent: 'text-[#3b82f6]',
    bg: 'bg-[#3b82f6]/10',
    border: 'border-[#3b82f6]/20',
    glow: 'hover:border-[#3b82f6]/35 hover:shadow-[0_0_28px_rgba(59,130,246,0.1)]',
    bar: 'bg-[#3b82f6]',
    tag: 'bg-[#3b82f6]/10 text-[#60a5fa] border-[#3b82f6]/20',
    num: 'text-[#3b82f6]',
  },
  orange: {
    accent: 'text-[#f97316]',
    bg: 'bg-[#f97316]/10',
    border: 'border-[#f97316]/20',
    glow: 'hover:border-[#f97316]/35 hover:shadow-[0_0_28px_rgba(249,115,22,0.1)]',
    bar: 'bg-[#f97316]',
    tag: 'bg-[#f97316]/10 text-[#fb923c] border-[#f97316]/20',
    num: 'text-[#f97316]',
  },
  green: {
    accent: 'text-[#22c55e]',
    bg: 'bg-[#22c55e]/10',
    border: 'border-[#22c55e]/20',
    glow: 'hover:border-[#22c55e]/35 hover:shadow-[0_0_28px_rgba(34,197,94,0.1)]',
    bar: 'bg-[#22c55e]',
    tag: 'bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/20',
    num: 'text-[#22c55e]',
  },
};

export default function WorkoutCard({
  day,
  difficulty,
  weightLbs,
  completed = false,
  large = false,
}: WorkoutCardProps) {
  const c = colorMap[day.color as keyof typeof colorMap] || colorMap.blue;
  const durationMin = day.id === 1 ? 70 : day.id === 2 ? 80 : 85;
  const calories = estimateWorkoutCalories(weightLbs, durationMin, difficulty);

  return (
    <Link
      href={`/workout/${day.slug}`}
      className={`block card-dark transition-all duration-300 border ${c.border} ${c.glow} group ${
        large ? 'p-6 sm:p-8' : 'p-5'
      } ${completed ? 'opacity-70' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center text-xl`}>
            {day.icon}
          </div>
          <div>
            <p className={`font-display text-sm tracking-widest ${c.accent}`}>
              DAY {day.id}
            </p>
            <h3
              className={`font-display tracking-wide text-white ${
                large ? 'text-2xl sm:text-3xl' : 'text-xl'
              }`}
            >
              {day.name.toUpperCase()}
            </h3>
          </div>
        </div>
        {completed && (
          <span className="text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 text-xs px-2 py-1 rounded-full font-medium shrink-0">
            ✓ Done
          </span>
        )}
      </div>

      {/* Primary muscles */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {day.primaryMuscles.slice(0, 4).map((m) => (
          <span
            key={m}
            className={`text-xs px-2.5 py-0.5 rounded-full border ${c.tag}`}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatBox
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Duration"
          value={day.estimatedTime}
          colorClass={c.accent}
        />
        <StatBox
          icon={<Dumbbell className="w-3.5 h-3.5" />}
          label="Exercises"
          value={`${day.totalExercises}`}
          colorClass={c.accent}
        />
        <StatBox
          icon={<Flame className="w-3.5 h-3.5" />}
          label="Est. Cal"
          value={`~${calories.total}`}
          colorClass={c.accent}
        />
      </div>

      {/* CTA */}
      <div
        className={`flex items-center justify-between pt-3 border-t border-white/[0.05]`}
      >
        <span className="text-[#52525b] text-xs">View full workout</span>
        <ChevronRight
          className={`w-4 h-4 ${c.accent} transition-transform duration-200 group-hover:translate-x-1`}
        />
      </div>
    </Link>
  );
}

function StatBox({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  colorClass: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-2.5 rounded-lg bg-[#0f0f0f] border border-white/[0.04]">
      <div className={`flex items-center gap-1 ${colorClass}`}>{icon}</div>
      <span className="text-[9px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-sm font-medium text-[#f5f5f5] leading-tight">{value}</span>
    </div>
  );
}
