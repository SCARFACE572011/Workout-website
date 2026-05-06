'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function WorkoutTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const secs = elapsed % 60;

  const fmt = (n: number) => String(n).padStart(2, '0');

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  const intensity =
    elapsed < 600 ? 'Warm-Up' : elapsed < 3600 ? 'Training' : 'Strong Session';
  const intensityColor =
    elapsed < 600 ? 'text-[#22c55e]' : elapsed < 3600 ? 'text-[#3b82f6]' : 'text-[#f97316]';

  return (
    <div className="card-dark p-5">
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-4 h-4 text-[#3b82f6]" />
        <h3 className="font-display text-lg tracking-widest text-white">WORKOUT TIMER</h3>
      </div>

      <div className="flex flex-col items-center gap-3">
        {/* Time display */}
        <div className="font-mono-num text-5xl font-medium text-white tabular-nums tracking-tight">
          {hours > 0 && `${fmt(hours)}:`}
          {fmt(minutes)}:{fmt(secs)}
        </div>

        <span className={`text-xs font-semibold tracking-widest uppercase ${intensityColor}`}>
          {intensity}
        </span>

        {/* Progress bar — 90 min target */}
        <div className="w-full h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3b82f6] rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((elapsed / 5400) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-[#52525b]">Target: 90 min</p>

        {/* Controls */}
        <div className="flex gap-2 w-full">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-white/[0.08] text-[#52525b] hover:text-[#a1a1aa] text-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              running
                ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30'
                : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
            }`}
          >
            {running ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                {elapsed === 0 ? 'Start Workout' : 'Resume'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
