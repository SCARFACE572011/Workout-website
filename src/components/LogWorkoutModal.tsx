'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import type { WorkoutDay, Difficulty } from '@/types';
import { saveSession, generateSessionId } from '@/lib/storage';
import { estimateWorkoutCalories } from '@/lib/calculations';

interface LogWorkoutModalProps {
  day: WorkoutDay;
  difficulty: Difficulty;
  defaultWeight: number;
  onClose: () => void;
  onSaved: () => void;
}

export default function LogWorkoutModal({
  day,
  difficulty,
  defaultWeight,
  onClose,
  onSaved,
}: LogWorkoutModalProps) {
  const [weight, setWeight] = useState(defaultWeight);
  const [duration, setDuration] = useState(75);
  const [cardioMinutes, setCardioMinutes] = useState(20);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const calories = estimateWorkoutCalories(weight, duration, difficulty);

  const handleSave = () => {
    saveSession({
      id: generateSessionId(),
      date: new Date().toISOString(),
      dayId: day.id,
      difficulty,
      durationMinutes: duration,
      caloriesBurned: calories.total,
      completedSets: [],
      cardioMinutes,
      coreCompleted: true,
      bodyWeightLbs: weight,
      notes,
    });
    setSaved(true);
    setTimeout(() => {
      onSaved();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md card-dark p-6 flex flex-col gap-5 animate-in slide-in-from-bottom-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-widest text-white">LOG WORKOUT</h2>
            <p className="text-sm text-[#71717a] mt-0.5">Day {day.id}: {day.name}</p>
          </div>
          <button onClick={onClose} className="text-[#52525b] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <CheckCircle className="w-12 h-12 text-[#22c55e]" />
            <p className="font-display text-xl tracking-widest text-[#22c55e]">WORKOUT LOGGED!</p>
          </div>
        ) : (
          <>
            <Field label="Body Weight (lbs)">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={100}
                  max={350}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="flex-1 accent-[#3b82f6]"
                />
                <span className="font-mono-num text-white w-14 text-right">{weight} lb</span>
              </div>
            </Field>

            <Field label="Duration (minutes)">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={20}
                  max={120}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="flex-1 accent-[#3b82f6]"
                />
                <span className="font-mono-num text-white w-14 text-right">{duration} min</span>
              </div>
            </Field>

            <Field label="Cardio (minutes)">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={cardioMinutes}
                  onChange={(e) => setCardioMinutes(Number(e.target.value))}
                  className="flex-1 accent-[#3b82f6]"
                />
                <span className="font-mono-num text-white w-14 text-right">{cardioMinutes} min</span>
              </div>
            </Field>

            <Field label="Notes (optional)">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go?"
                className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#f5f5f5] placeholder:text-[#52525b] outline-none focus:border-[#3b82f6]/50"
              />
            </Field>

            {/* Estimated calories */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20">
              <span className="text-sm text-[#a1a1aa]">Estimated calories burned</span>
              <span className="font-mono-num text-lg font-medium text-[#f97316]">
                ~{calories.total} kcal
              </span>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-colors"
            >
              Save Workout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">{label}</label>
      {children}
    </div>
  );
}
