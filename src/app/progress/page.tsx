'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Scale, Flame, Clock, Plus, Trash2, RotateCcw } from 'lucide-react';
import { getSessions, getThisWeekProgress, saveSession, deleteSession, generateSessionId, clearAllData } from '@/lib/storage';
import { estimateWorkoutCalories } from '@/lib/calculations';
import { workoutDays } from '@/data/workoutData';
import type { WorkoutSession, WeeklyProgress, Difficulty } from '@/types';

const DAY_NAMES: Record<number, string> = {
  1: 'Back & Biceps',
  2: 'Chest, Shoulders & Triceps',
  3: 'Legs & Cardio',
};

export default function ProgressPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [weekProgress, setWeekProgress] = useState<WeeklyProgress | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Log form state
  const [formDay, setFormDay] = useState<1 | 2 | 3>(1);
  const [formWeight, setFormWeight] = useState(221);
  const [formDuration, setFormDuration] = useState(75);
  const [formCardio, setFormCardio] = useState(20);
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('intermediate');
  const [formNotes, setFormNotes] = useState('');

  const refresh = () => {
    setSessions(getSessions());
    setWeekProgress(getThisWeekProgress());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleLog = () => {
    const calories = estimateWorkoutCalories(formWeight, formDuration, formDifficulty);
    saveSession({
      id: generateSessionId(),
      date: new Date().toISOString(),
      dayId: formDay,
      difficulty: formDifficulty,
      durationMinutes: formDuration,
      caloriesBurned: calories.total,
      completedSets: [],
      cardioMinutes: formCardio,
      coreCompleted: true,
      bodyWeightLbs: formWeight,
      notes: formNotes,
    });
    setShowForm(false);
    setFormNotes('');
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
    refresh();
  };

  const handleClear = () => {
    if (confirmClear) {
      clearAllData();
      setConfirmClear(false);
      refresh();
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 4000);
    }
  };

  const totalCalories = sessions.reduce((a, s) => a + s.caloriesBurned, 0);
  const totalCardio = sessions.reduce((a, s) => a + s.cardioMinutes, 0);
  const totalSessions = sessions.length;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold mb-2">Your Journey</p>
            <h1 className="font-display text-5xl sm:text-6xl text-white tracking-wide">PROGRESS TRACKER</h1>
            <p className="text-[#71717a] text-sm mt-2">All data is saved locally in your browser. Nothing is sent to a server.</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Log Workout
          </button>
        </div>

        {/* ── Log form ── */}
        {showForm && (
          <div className="card-dark p-6 rounded-2xl flex flex-col gap-5 border border-[#3b82f6]/20 bg-[#3b82f6]/5">
            <h2 className="font-display text-2xl tracking-widest text-white">LOG A WORKOUT</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Workout Day</label>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((d) => (
                    <button key={d} onClick={() => setFormDay(d)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        formDay === d ? 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30' : 'border-white/[0.06] text-[#52525b] hover:text-[#a1a1aa]'
                      }`}
                    >Day {d}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Intensity</label>
                <div className="flex gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
                    <button key={d} onClick={() => setFormDifficulty(d)}
                      className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors capitalize ${
                        formDifficulty === d
                          ? d === 'beginner' ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30'
                          : d === 'intermediate' ? 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30'
                          : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
                          : 'border-white/[0.06] text-[#52525b] hover:text-[#a1a1aa]'
                      }`}
                    >{d}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
                  Body Weight — <span className="text-white font-mono-num">{formWeight} lbs</span>
                </label>
                <input type="range" min={120} max={350} value={formWeight}
                  onChange={(e) => setFormWeight(Number(e.target.value))}
                  className="w-full accent-[#3b82f6] h-1.5 rounded-full mt-2"
                />
              </div>

              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
                  Duration — <span className="text-white font-mono-num">{formDuration} min</span>
                </label>
                <input type="range" min={20} max={120} value={formDuration}
                  onChange={(e) => setFormDuration(Number(e.target.value))}
                  className="w-full accent-[#3b82f6] h-1.5 rounded-full mt-2"
                />
              </div>

              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
                  Cardio — <span className="text-white font-mono-num">{formCardio} min</span>
                </label>
                <input type="range" min={0} max={60} value={formCardio}
                  onChange={(e) => setFormCardio(Number(e.target.value))}
                  className="w-full accent-[#3b82f6] h-1.5 rounded-full mt-2"
                />
              </div>

              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Notes</label>
                <input
                  type="text" value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Optional — how did it go?"
                  className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f5f5f5] placeholder:text-[#52525b] outline-none focus:border-[#3b82f6]/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f0f0f] border border-white/[0.05]">
              <span className="text-sm text-[#a1a1aa]">Estimated calories</span>
              <span className="font-mono-num text-lg text-[#f97316]">
                ~{estimateWorkoutCalories(formWeight, formDuration, formDifficulty).total} kcal
              </span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-3 border border-white/[0.08] text-[#52525b] hover:text-[#a1a1aa] rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleLog}
                className="flex-1 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl text-sm transition-colors">
                Save Workout
              </button>
            </div>
          </div>
        )}

        {/* ── This week ── */}
        {weekProgress && (
          <div className="card-dark p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
                <h2 className="font-display text-2xl tracking-widest text-white">THIS WEEK</h2>
              </div>
              {weekProgress.streak > 0 && (
                <span className="text-xs text-[#f97316] bg-[#f97316]/10 border border-[#f97316]/20 px-3 py-1 rounded-full">
                  🔥 {weekProgress.streak} day streak
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <WeekStat label="Sessions Done" value={`${weekProgress.sessions.length} / 3`} color="blue" />
              <WeekStat label="Calories Burned" value={weekProgress.totalCalories > 0 ? `~${weekProgress.totalCalories}` : '—'} color="orange" />
              <WeekStat label="Cardio Minutes" value={weekProgress.totalCardioMinutes > 0 ? `${weekProgress.totalCardioMinutes}` : '—'} color="green" />
              <WeekStat label="Streak" value={`${weekProgress.streak} days`} color="orange" />
            </div>

            <div className="flex gap-2">
              {workoutDays.map((d) => {
                const done = weekProgress.completedDays.includes(d.id);
                return (
                  <div key={d.id} className={`flex-1 p-3 rounded-xl border text-center ${
                    done ? 'bg-[#22c55e]/10 border-[#22c55e]/25' : 'bg-[#0f0f0f] border-white/[0.04]'
                  }`}>
                    <p className={`text-xs font-bold ${done ? 'text-[#22c55e]' : 'text-[#2a2a2a]'}`}>Day {d.id}</p>
                    <p className="text-[10px] text-[#52525b] mt-0.5 hidden sm:block">{d.name.split(' ')[0]}</p>
                    {done && <span className="text-[#22c55e] text-lg">✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── All-time stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AllTimeStat icon={<Flame className="w-5 h-5 text-[#f97316]" />} label="Total Calories Burned" value={`~${totalCalories.toLocaleString()}`} />
          <AllTimeStat icon={<Clock className="w-5 h-5 text-[#3b82f6]" />} label="Total Cardio Minutes" value={`${totalCardio} min`} />
          <AllTimeStat icon={<Scale className="w-5 h-5 text-[#22c55e]" />} label="Total Sessions" value={String(totalSessions)} />
        </div>

        {/* ── Session history ── */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display text-2xl tracking-widest text-white">SESSION HISTORY</h2>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center card-dark rounded-2xl">
              <span className="text-4xl">📋</span>
              <p className="text-[#52525b]">No sessions logged yet.</p>
              <button onClick={() => setShowForm(true)}
                className="text-sm text-[#3b82f6] hover:underline">
                Log your first workout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {sessions.map((session) => (
                <div key={session.id} className="card-dark p-4 flex items-start justify-between gap-3 rounded-xl group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-white text-sm">{DAY_NAMES[session.dayId]}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                        session.difficulty === 'beginner' ? 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20' :
                        session.difficulty === 'intermediate' ? 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20' :
                        'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20'
                      }`}>{session.difficulty}</span>
                    </div>
                    <p className="text-xs text-[#52525b] mt-0.5">
                      {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    {session.notes && <p className="text-xs text-[#71717a] mt-1 italic">{session.notes}</p>}
                    <div className="flex gap-3 mt-2 flex-wrap">
                      <span className="text-xs text-[#52525b]">⏱ {session.durationMinutes} min</span>
                      <span className="text-xs text-[#f97316]">🔥 ~{session.caloriesBurned} cal</span>
                      <span className="text-xs text-[#3b82f6]">🚴 {session.cardioMinutes} min cardio</span>
                      <span className="text-xs text-[#52525b]">⚖ {session.bodyWeightLbs} lbs</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#52525b] hover:text-[#ef4444] p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Reset ── */}
        {sessions.length > 0 && (
          <button
            onClick={handleClear}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm transition-all ${
              confirmClear
                ? 'border-[#ef4444]/40 text-[#ef4444] bg-[#ef4444]/10'
                : 'border-white/[0.06] text-[#52525b] hover:text-[#a1a1aa]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {confirmClear ? 'Click again to confirm — this clears ALL data' : 'Reset all progress data'}
          </button>
        )}
      </div>
    </div>
  );
}

function WeekStat({ label, value, color }: { label: string; value: string; color: 'blue' | 'orange' | 'green' }) {
  const colors = { blue: 'text-[#3b82f6]', orange: 'text-[#f97316]', green: 'text-[#22c55e]' };
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#0f0f0f] border border-white/[0.04]">
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest leading-tight">{label}</span>
      <span className={`font-mono-num text-xl font-medium ${colors[color]}`}>{value}</span>
    </div>
  );
}

function AllTimeStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-dark p-5 flex flex-col gap-3">
      {icon}
      <span className="text-xs text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-3xl font-medium text-white">{value}</span>
    </div>
  );
}
