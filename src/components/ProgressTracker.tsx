'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Flame, Clock, Scale, RotateCcw } from 'lucide-react';
import { getThisWeekProgress, clearAllData, getSessions } from '@/lib/storage';
import type { WeeklyProgress, WorkoutSession } from '@/types';

export default function ProgressTracker() {
  const [progress, setProgress] = useState<WeeklyProgress | null>(null);
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setProgress(getThisWeekProgress());
    setRecentSessions(getSessions().slice(0, 5));
  }, []);

  const handleClear = () => {
    if (confirmClear) {
      clearAllData();
      setProgress(getThisWeekProgress());
      setRecentSessions([]);
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  if (!progress) return null;

  const dayNames: Record<number, string> = { 1: 'Back & Biceps', 2: 'Chest/Shoulders/Tris', 3: 'Legs & Cardio' };

  return (
    <div className="flex flex-col gap-5">
      {/* Weekly streak */}
      <div className="card-dark p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
            <h3 className="font-display text-xl tracking-widest text-white">THIS WEEK</h3>
          </div>
          {progress.streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/20">
              <span className="text-[#f97316] text-xs font-bold">🔥 {progress.streak} day streak</span>
            </div>
          )}
        </div>

        {/* Week day indicators */}
        <div className="flex gap-2">
          {[1, 2, 3].map((dayId) => {
            const done = progress.completedDays.includes(dayId);
            return (
              <div
                key={dayId}
                className={`flex-1 p-3 rounded-xl border text-center transition-colors ${
                  done
                    ? 'bg-[#22c55e]/10 border-[#22c55e]/30'
                    : 'bg-[#0f0f0f] border-white/[0.05]'
                }`}
              >
                <p className={`text-[10px] uppercase tracking-widest mb-1 ${done ? 'text-[#22c55e]' : 'text-[#52525b]'}`}>
                  Day {dayId}
                </p>
                <p className="text-xs text-[#a1a1aa] leading-tight">{dayNames[dayId]}</p>
                {done && <CheckCircle className="w-4 h-4 text-[#22c55e] mx-auto mt-1" />}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <MiniStat
            icon={<Flame className="w-3.5 h-3.5 text-[#f97316]" />}
            label="Calories"
            value={progress.totalCalories > 0 ? `~${progress.totalCalories}` : '—'}
          />
          <MiniStat
            icon={<Clock className="w-3.5 h-3.5 text-[#3b82f6]" />}
            label="Cardio"
            value={progress.totalCardioMinutes > 0 ? `${progress.totalCardioMinutes} min` : '—'}
          />
          <MiniStat
            icon={<CheckCircle className="w-3.5 h-3.5 text-[#22c55e]" />}
            label="Sessions"
            value={`${progress.sessions.length} / 3`}
          />
        </div>
      </div>

      {/* Recent sessions */}
      {recentSessions.length > 0 && (
        <div className="card-dark p-5 flex flex-col gap-3">
          <h3 className="font-display text-lg tracking-widest text-white">RECENT SESSIONS</h3>
          <div className="flex flex-col gap-2">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f] border border-white/[0.04]"
              >
                <div>
                  <p className="text-sm font-medium text-[#f5f5f5]">{dayNames[s.dayId]}</p>
                  <p className="text-xs text-[#52525b]">
                    {new Date(s.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {s.notes && ` · ${s.notes}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="font-mono-num text-sm text-[#f97316]">~{s.caloriesBurned} cal</p>
                    <p className="text-xs text-[#52525b]">{s.durationMinutes} min</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
                    <Scale className="w-3 h-3" />
                    {s.bodyWeightLbs} lb
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={handleClear}
        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm transition-all ${
          confirmClear
            ? 'border-[#ef4444]/40 text-[#ef4444] bg-[#ef4444]/10'
            : 'border-white/[0.06] text-[#52525b] hover:text-[#a1a1aa]'
        }`}
      >
        <RotateCcw className="w-3.5 h-3.5" />
        {confirmClear ? 'Click again to confirm reset' : 'Reset all progress'}
      </button>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#0f0f0f] border border-white/[0.04]">
      {icon}
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-sm font-medium text-[#f5f5f5]">{value}</span>
    </div>
  );
}
