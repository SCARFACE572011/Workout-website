'use client';

import { useState, useEffect } from 'react';
import { Clock, Dumbbell, Flame, Scale } from 'lucide-react';
import WorkoutCard from '@/components/WorkoutCard';
import DifficultySelector from '@/components/DifficultySelector';
import { workoutDays } from '@/data/workoutData';
import { weeklyCalorieEstimate, estimateWorkoutCalories } from '@/lib/calculations';
import { getProfile, saveProfile } from '@/lib/storage';
import type { Difficulty } from '@/types';

export default function WorkoutPlanPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [weight, setWeight] = useState(221);

  useEffect(() => {
    const p = getProfile();
    setDifficulty(p.difficulty);
    setWeight(p.weightLbs);
  }, []);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    const p = getProfile();
    saveProfile({ ...p, difficulty: d });
  };

  const handleWeightChange = (w: number) => {
    setWeight(w);
    const p = getProfile();
    saveProfile({ ...p, weightLbs: w });
  };

  const weeklyCalories = weeklyCalorieEstimate(weight, difficulty);

  const diffDesc: Record<Difficulty, string> = {
    beginner: 'Machines, controlled movements, lighter volume. Focused on building the movement patterns.',
    intermediate: 'Mix of machines, dumbbells, and cables. Moderate weights, full range of motion.',
    advanced: 'Heavier compound lifts, supersets, and higher-intensity cardio. Higher weekly volume.',
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        {/* ── Header ── */}
        <div>
          <p className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold mb-2">Full Program</p>
          <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide mb-4">
            3-DAY WORKOUT PLAN
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl text-lg leading-relaxed">
            Back & Biceps · Chest/Shoulders/Triceps · Legs & Cardio. Each session is 60–90 minutes
            and includes warm-up, strength, cardio, core, and cool-down.
          </p>
        </div>

        {/* ── Settings bar ── */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 card-dark rounded-2xl">
          {/* Weight */}
          <div className="flex-1">
            <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
              <Scale className="w-3 h-3 inline mr-1" />
              Body Weight — <span className="text-white font-mono-num">{weight} lbs</span>
            </label>
            <input
              type="range"
              min={120} max={350} value={weight}
              onChange={(e) => handleWeightChange(Number(e.target.value))}
              className="w-full accent-[#3b82f6] h-1.5 rounded-full"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-white/[0.06]" />

          {/* Difficulty */}
          <div>
            <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Difficulty</label>
            <DifficultySelector value={difficulty} onChange={handleDifficultyChange} size="sm" />
          </div>
        </div>

        {/* ── Difficulty description ── */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.05]">
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
            difficulty === 'beginner' ? 'bg-[#22c55e]' : difficulty === 'intermediate' ? 'bg-[#f97316]' : 'bg-[#ef4444]'
          }`} />
          <p className="text-sm text-[#a1a1aa]">
            <span className="text-white font-medium capitalize">{difficulty}: </span>
            {diffDesc[difficulty]}
          </p>
        </div>

        {/* ── Weekly summary stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryStat icon={<Clock className="w-4 h-4 text-[#3b82f6]" />} label="Weekly Time" value="3–4.5 hrs" />
          <SummaryStat icon={<Dumbbell className="w-4 h-4 text-[#f97316]" />} label="Total Exercises" value="24+" />
          <SummaryStat icon={<Flame className="w-4 h-4 text-[#ef4444]" />} label="Weekly Calories" value={`~${weeklyCalories}`} />
          <SummaryStat icon={<Scale className="w-4 h-4 text-[#22c55e]" />} label="Cardio Sessions" value="3" />
        </div>

        {/* ── Workout cards ── */}
        <div className="flex flex-col gap-6">
          {workoutDays.map((day) => {
            const durationMin = day.id === 1 ? 70 : day.id === 2 ? 80 : 85;
            const cal = estimateWorkoutCalories(weight, durationMin, difficulty);

            return (
              <div key={day.id} className="flex flex-col gap-4">
                {/* Day header */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    day.color === 'blue' ? 'bg-[#3b82f6]/10 border border-[#3b82f6]/20' :
                    day.color === 'orange' ? 'bg-[#f97316]/10 border border-[#f97316]/20' :
                    'bg-[#22c55e]/10 border border-[#22c55e]/20'
                  }`}>
                    {day.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold tracking-widest uppercase ${
                      day.color === 'blue' ? 'text-[#3b82f6]' :
                      day.color === 'orange' ? 'text-[#f97316]' : 'text-[#22c55e]'
                    }`}>Day {day.id}</p>
                    <h2 className="font-display text-3xl text-white tracking-wide">{day.name.toUpperCase()}</h2>
                  </div>
                </div>

                {/* Summary row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <MiniInfo label="Duration" value={day.estimatedTime} />
                  <MiniInfo label="Exercises" value={`${day.totalExercises} strength`} />
                  <MiniInfo label="Est. Calories" value={`~${cal.total} kcal`} />
                  <MiniInfo label="Muscles" value={day.primaryMuscles.slice(0, 3).join(', ')} />
                </div>

                {/* Workout card links */}
                <WorkoutCard day={day} difficulty={difficulty} weightLbs={weight} large />

                {/* Core/Cardio tags */}
                <div className="flex flex-wrap gap-2 mt-1 pl-1">
                  <span className="text-xs px-3 py-1 rounded-full bg-[#0f0f0f] border border-white/[0.05] text-[#52525b]">
                    + Core finisher ({day.coreExercises.length} exercises)
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#0f0f0f] border border-white/[0.05] text-[#52525b]">
                    + Cardio ({day.cardioOptions.length} options)
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full bg-[#0f0f0f] border border-white/[0.05] text-[#52525b]">
                    + Warm-up & Cool-down
                  </span>
                </div>

                {/* Divider between days */}
                {day.id < 3 && <div className="h-px bg-white/[0.04] mt-2" />}
              </div>
            );
          })}
        </div>

        {/* ── Schedule recommendation ── */}
        <div className="card-dark p-6 rounded-2xl">
          <h3 className="font-display text-2xl text-white tracking-wide mb-4">RECOMMENDED SCHEDULE</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {[
              { day: 'Mon', workout: 'Day 1', sub: 'Back + Bi', active: true, color: 'blue' },
              { day: 'Tue', workout: 'Rest', sub: 'Recovery', active: false },
              { day: 'Wed', workout: 'Day 2', sub: 'Chest + Sh', active: true, color: 'orange' },
              { day: 'Thu', workout: 'Rest', sub: 'Recovery', active: false },
              { day: 'Fri', workout: 'Day 3', sub: 'Legs', active: true, color: 'green' },
              { day: 'Sat', workout: 'Rest', sub: 'Optional walk', active: false },
              { day: 'Sun', workout: 'Rest', sub: 'Recover', active: false },
            ].map((item) => (
              <div
                key={item.day}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center ${
                  item.active
                    ? item.color === 'blue' ? 'bg-[#3b82f6]/10 border-[#3b82f6]/25'
                    : item.color === 'orange' ? 'bg-[#f97316]/10 border-[#f97316]/25'
                    : 'bg-[#22c55e]/10 border-[#22c55e]/25'
                    : 'bg-[#0f0f0f] border-white/[0.04]'
                }`}
              >
                <span className={`text-[10px] font-bold tracking-widest ${item.active ? 'text-white' : 'text-[#52525b]'}`}>
                  {item.day}
                </span>
                <span className={`text-xs font-semibold ${
                  item.active
                    ? item.color === 'blue' ? 'text-[#3b82f6]'
                    : item.color === 'orange' ? 'text-[#f97316]' : 'text-[#22c55e]'
                    : 'text-[#2a2a2a]'
                }`}>
                  {item.workout}
                </span>
                <span className="text-[9px] text-[#3b3b3b] hidden sm:block">{item.sub}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#52525b] mt-4">
            Any 3 non-consecutive days works. Mon/Wed/Fri is the classic setup. Rest days can include a 20–30 min walk.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-dark p-4 flex flex-col gap-2">
      {icon}
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-sm font-medium text-white">{value}</span>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-[#0f0f0f] border border-white/[0.04]">
      <span className="text-[9px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="text-xs text-[#a1a1aa]">{value}</span>
    </div>
  );
}
