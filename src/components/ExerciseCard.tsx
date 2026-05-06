'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, ArrowRightLeft } from 'lucide-react';
import type { Exercise, Difficulty } from '@/types';
import GifDemoCard from './GifDemoCard';
import { DifficultyBadge } from './DifficultySelector';

interface ExerciseCardProps {
  exercise: Exercise;
  difficulty: Difficulty;
  index?: number;
  showGif?: boolean;
}

const difficultyConfig = (ex: Exercise, d: Difficulty) => {
  const configs = {
    beginner: ex.difficulty,
    intermediate: ex.intermediate,
    advanced: ex.advanced,
  };
  return configs[d];
};

export default function ExerciseCard({
  exercise,
  difficulty,
  index,
  showGif = true,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = difficultyConfig(exercise, difficulty);
  const muscles = Array.isArray(exercise.muscleGroup)
    ? exercise.muscleGroup.join(', ')
    : exercise.muscleGroup;

  return (
    <div className="card-dark transition-all duration-200 overflow-hidden">
      {/* Main row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Index number */}
          {index !== undefined && (
            <span className="font-mono-num text-[#3b82f6] text-sm font-medium w-6 shrink-0 mt-0.5">
              {String(index).padStart(2, '0')}
            </span>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-semibold text-[#f5f5f5] text-base leading-tight">
                  {exercise.name}
                </h3>
                <p className="text-[#71717a] text-sm mt-0.5">{muscles}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {exercise.isBeginnerFriendly && (
                  <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-full">
                    Beginner OK
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20 capitalize">
                  {exercise.equipment}
                </span>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mt-3">
              <Stat label="Sets" value={String(config.sets)} />
              <Stat label="Reps" value={config.reps} />
              <Stat label="Rest" value={config.rest} />
              {config.weight && <Stat label="Weight" value={config.weight} />}
            </div>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors py-1"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Form tips & details
            </>
          )}
        </button>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-4 sm:px-5 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* GIF */}
            {showGif && (
              <GifDemoCard
                gifUrl={exercise.gifUrl}
                demoAltText={exercise.demoAltText}
                exerciseName={exercise.name}
              />
            )}

            <div className="flex flex-col gap-4">
              {/* Form tips */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" />
                  <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-widest">
                    Form Tips
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {exercise.formTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                      <span className="text-[#3b82f6] mt-1 shrink-0">›</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common mistakes */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f97316]" />
                  <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-widest">
                    Common Mistakes
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {exercise.commonMistakes.map((m, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                      <span className="text-[#f97316] mt-1 shrink-0">›</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Substitution */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#0f0f0f] border border-white/[0.04]">
                <ArrowRightLeft className="w-3.5 h-3.5 text-[#52525b] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#52525b] uppercase tracking-widest mb-0.5">
                    Substitution
                  </p>
                  <p className="text-sm text-[#a1a1aa]">{exercise.substitution}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-sm font-medium text-[#f5f5f5]">{value}</span>
    </div>
  );
}
