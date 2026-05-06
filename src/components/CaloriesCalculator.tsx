'use client';

import { useState } from 'react';
import { Flame, Info } from 'lucide-react';
import type { Difficulty } from '@/types';
import { estimateWorkoutCalories } from '@/lib/calculations';
import DifficultySelector from './DifficultySelector';

interface CaloriesCalculatorProps {
  defaultWeight?: number;
  defaultDuration?: number;
  defaultDifficulty?: Difficulty;
  compact?: boolean;
}

export default function CaloriesCalculator({
  defaultWeight = 221,
  defaultDuration = 75,
  defaultDifficulty = 'intermediate',
  compact = false,
}: CaloriesCalculatorProps) {
  const [weight, setWeight] = useState(defaultWeight);
  const [duration, setDuration] = useState(defaultDuration);
  const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty);

  const estimate = estimateWorkoutCalories(weight, duration, difficulty);

  const barMax = 800;

  return (
    <div className="card-dark p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <Flame className="w-4 h-4 text-[#f97316]" />
        <h3 className="font-display text-xl tracking-widest text-white">
          CALORIES CALCULATOR
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        {/* Inputs */}
        <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
          <div>
            <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
              Body Weight (lbs)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={100}
                max={350}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="flex-1 accent-[#3b82f6] h-1.5 rounded-full cursor-pointer"
              />
              <span className="font-mono-num text-sm text-white w-12 text-right">
                {weight} lb
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
              Duration (minutes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={30}
                max={120}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-1 accent-[#3b82f6] h-1.5 rounded-full cursor-pointer"
              />
              <span className="font-mono-num text-sm text-white w-12 text-right">
                {duration} min
              </span>
            </div>
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
            Intensity
          </label>
          <DifficultySelector value={difficulty} onChange={setDifficulty} size="sm" />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <CalStat
            label="Strength"
            value={estimate.strength}
            color="#3b82f6"
            barMax={barMax}
          />
          <CalStat
            label="Cardio"
            value={estimate.cardio}
            color="#f97316"
            barMax={barMax}
          />
          <CalStat
            label="Core"
            value={estimate.core}
            color="#22c55e"
            barMax={barMax}
          />
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
            <span className="text-[10px] text-[#3b82f6] uppercase tracking-widest">Total</span>
            <span className="font-mono-num text-2xl font-medium text-white">
              {estimate.total}
            </span>
            <span className="text-[10px] text-[#52525b]">kcal / session</span>
          </div>
        </div>

        {/* Weekly estimate */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f0f0f] border border-white/[0.06]">
          <span className="text-sm text-[#a1a1aa]">Weekly burn (3 sessions)</span>
          <span className="font-mono-num text-lg font-medium text-[#f97316]">
            ~{estimate.total * 3} kcal
          </span>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.04]">
          <Info className="w-3.5 h-3.5 text-[#52525b] mt-0.5 shrink-0" />
          <p className="text-xs text-[#52525b]">
            Calorie estimates are approximate and should be used for general tracking, not
            medical guidance. Actual burn varies with effort, rest periods, fitness level, and
            heart rate.
          </p>
        </div>
      </div>
    </div>
  );
}

function CalStat({
  label,
  value,
  color,
  barMax,
}: {
  label: string;
  value: number;
  color: string;
  barMax: number;
}) {
  const pct = Math.min((value / barMax) * 100, 100);
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#0f0f0f] border border-white/[0.05]">
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-xl font-medium text-white">{value}</span>
      <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-[#52525b]">kcal</span>
    </div>
  );
}
