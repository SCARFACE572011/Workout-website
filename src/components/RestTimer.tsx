'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { sendPush } from '@/lib/notifications';

const PRESETS = [30, 45, 60, 90, 120, 180];

export default function RestTimer() {
  const [targetSeconds, setTargetSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setRemaining(targetSeconds);
  }, [stop, targetSeconds]);

  useEffect(() => {
    setRemaining(targetSeconds);
    stop();
  }, [targetSeconds, stop]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            stop();
            // Beep
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
              osc.start(ctx.currentTime);
              osc.stop(ctx.currentTime + 0.4);
            } catch {
              // AudioContext not available
            }
            sendPush('Rest Over — Next Set', 'Your rest period is complete. Start your next set.', '/workout');
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, stop]);

  const progress = ((targetSeconds - remaining) / targetSeconds) * 100;
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const adjustTarget = (delta: number) => {
    setTargetSeconds((t) => Math.max(10, Math.min(300, t + delta)));
  };

  return (
    <div className="card-dark p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Timer className="w-4 h-4 text-[#3b82f6]" />
        <h3 className="font-display text-lg tracking-widest text-white">REST TIMER</h3>
      </div>

      {/* Circular progress */}
      <div className="flex justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={remaining === 0 ? '#22c55e' : '#3b82f6'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono-num text-3xl font-medium text-white tabular-nums">
              {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
            {remaining === 0 && (
              <span className="text-[10px] text-[#22c55e] font-semibold tracking-widest">
                REST DONE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => setTargetSeconds(s)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              targetSeconds === s
                ? 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/30'
                : 'text-[#52525b] border-white/[0.06] hover:text-[#a1a1aa] hover:border-white/10'
            }`}
          >
            {s >= 60 ? `${s / 60}m` : `${s}s`}
          </button>
        ))}
      </div>

      {/* Custom adjust */}
      <div className="flex items-center gap-2 justify-center">
        <button
          onClick={() => adjustTarget(-5)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] text-[#52525b] hover:text-white transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-[#a1a1aa] text-sm w-24 text-center font-mono-num">
          {targetSeconds}s target
        </span>
        <button
          onClick={() => adjustTarget(5)}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[0.08] text-[#52525b] hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
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
              ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/30 hover:bg-[#f97316]/20'
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
              Start
            </>
          )}
        </button>
      </div>
    </div>
  );
}
