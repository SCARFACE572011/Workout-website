'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, Scale, Activity, Clock, Flame } from 'lucide-react';
import ExerciseCard from './ExerciseCard';
import DifficultySelector from './DifficultySelector';
import GifDemoCard from './GifDemoCard';
import RestTimer from './RestTimer';
import WorkoutTimer from './WorkoutTimer';
import CaloriesCalculator from './CaloriesCalculator';
import LogWorkoutModal from './LogWorkoutModal';
import NotificationSetup from './NotificationSetup';
import { getProfile, saveProfile } from '@/lib/storage';
import { estimateWorkoutCalories } from '@/lib/calculations';
import { sendPush } from '@/lib/notifications';
import type { WorkoutDay, Difficulty } from '@/types';

interface Props {
  day: WorkoutDay;
}

export default function WorkoutDetailClient({ day }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [weight, setWeight] = useState(221);
  const [showLogModal, setShowLogModal] = useState(false);
  const [logSaved, setLogSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'warmup' | 'strength' | 'cardio' | 'core' | 'cooldown'>('warmup');

  useEffect(() => {
    const p = getProfile();
    setDifficulty(p.difficulty);
    setWeight(p.weightLbs);
  }, []);

  const handleDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    const p = getProfile();
    saveProfile({ ...p, difficulty: d });
  };

  const handleWeight = (w: number) => {
    setWeight(w);
    const p = getProfile();
    saveProfile({ ...p, weightLbs: w });
  };

  const durationMin = day.id === 1 ? 70 : day.id === 2 ? 80 : 85;
  const calories = estimateWorkoutCalories(weight, durationMin, difficulty);

  const colorAccent = day.color === 'blue' ? '#3b82f6' : day.color === 'orange' ? '#f97316' : '#22c55e';
  const colorBg = day.color === 'blue' ? 'bg-[#3b82f6]/10 border-[#3b82f6]/20' :
    day.color === 'orange' ? 'bg-[#f97316]/10 border-[#f97316]/20' : 'bg-[#22c55e]/10 border-[#22c55e]/20';
  const colorText = day.color === 'blue' ? 'text-[#3b82f6]' : day.color === 'orange' ? 'text-[#f97316]' : 'text-[#22c55e]';

  const sections = [
    { id: 'warmup', label: 'Warm-Up', count: day.warmup.length },
    { id: 'strength', label: 'Strength', count: day.exercises.length },
    { id: 'cardio', label: 'Cardio', count: day.cardioOptions.length },
    { id: 'core', label: 'Core', count: day.coreExercises.length },
    { id: 'cooldown', label: 'Cool-Down', count: day.cooldown.length },
  ] as const;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* ── Back ── */}
        <Link href="/workout" className="flex items-center gap-1.5 text-sm text-[#52525b] hover:text-[#a1a1aa] transition-colors w-fit">
          <ChevronLeft className="w-4 h-4" />
          Back to Program
        </Link>

        {/* ── Day header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-3xl ${colorBg}`}>
              {day.icon}
            </div>
            <div>
              <p className={`text-xs font-semibold tracking-widest uppercase ${colorText}`}>
                Day {day.id}
              </p>
              <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wide">
                {day.name.toUpperCase()}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {day.primaryMuscles.map((m) => (
                  <span key={m} className={`text-xs px-2.5 py-0.5 rounded-full border ${colorBg} ${colorText}`}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Complete button */}
          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e] font-semibold rounded-xl hover:bg-[#22c55e]/20 transition-all shrink-0"
          >
            <CheckCircle className="w-4 h-4" />
            {logSaved ? 'Workout Logged!' : 'Log This Workout'}
          </button>
        </div>

        {/* ── Settings ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-dark p-4 flex flex-col gap-3">
            <label className="flex items-center gap-1.5 text-xs text-[#52525b] uppercase tracking-widest">
              <Scale className="w-3 h-3" /> Body Weight — <span className="text-white font-mono-num">{weight} lbs</span>
            </label>
            <input
              type="range" min={120} max={350} value={weight}
              onChange={(e) => handleWeight(Number(e.target.value))}
              className="w-full accent-[#3b82f6] h-1.5 rounded-full"
            />
          </div>
          <div className="card-dark p-4 flex flex-col gap-3">
            <label className="text-xs text-[#52525b] uppercase tracking-widest">Difficulty</label>
            <DifficultySelector value={difficulty} onChange={handleDifficulty} size="sm" />
          </div>
        </div>

        {/* ── Calorie summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickStat icon={<Clock className="w-4 h-4" style={{ color: colorAccent }} />} label="Duration" value={day.estimatedTime} />
          <QuickStat icon={<Flame className="w-4 h-4 text-[#f97316]" />} label="Est. Calories" value={`~${calories.total}`} />
          <QuickStat icon={<Activity className="w-4 h-4 text-[#22c55e]" />} label="Exercises" value={String(day.exercises.length)} />
          <QuickStat icon={<CheckCircle className="w-4 h-4 text-[#52525b]" />} label="Sections" value="5" />
        </div>

        {/* ── Main content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: sticky timers */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              <NotificationSetup />
              <WorkoutTimer />
              <RestTimer />
              <CaloriesCalculator
                defaultWeight={weight}
                defaultDuration={durationMin}
                defaultDifficulty={difficulty}
                compact
              />
            </div>
          </div>

          {/* Right: workout content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Section tabs */}
            <div className="flex overflow-x-auto gap-1 p-1 bg-[#0f0f0f] border border-white/[0.06] rounded-xl">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeSection === s.id
                      ? 'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                      : 'text-[#52525b] hover:text-[#a1a1aa]'
                  }`}
                >
                  {s.label}
                  <span className="font-mono-num text-[10px] opacity-60">{s.count}</span>
                </button>
              ))}
            </div>

            {/* ── Warm-Up ── */}
            {activeSection === 'warmup' && (
              <Section title="WARM-UP" subtitle="5–10 minutes before lifting. Never skip this.">
                <div className="flex flex-col gap-3">
                  {day.warmup.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 card-dark rounded-xl">
                      <span className="font-mono-num text-[#3b82f6] text-sm font-medium w-5 shrink-0">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-semibold text-white">{step.name}</p>
                          <span className="text-xs text-[#3b82f6] bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-2.5 py-0.5 rounded-full shrink-0">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-sm text-[#71717a] mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Strength ── */}
            {activeSection === 'strength' && (
              <Section
                title="STRENGTH TRAINING"
                subtitle={`${day.exercises.length} exercises · ${difficulty} difficulty · Focus on controlled reps and clean form.`}
              >
                <div className="flex flex-col gap-3">
                  {day.exercises.map((ex, i) => (
                    <ExerciseCard key={ex.id} exercise={ex} difficulty={difficulty} index={i + 1} />
                  ))}
                </div>
              </Section>
            )}

            {/* ── Cardio ── */}
            {activeSection === 'cardio' && (
              <Section title="CARDIO FINISHER" subtitle="Pick one option based on equipment and how you feel.">
                <div className="flex flex-col gap-4">
                  {day.cardioOptions.map((cardio) => {
                    const cfg = cardio[difficulty];
                    return (
                      <div key={cardio.id} className={`card-dark p-5 border ${colorBg} rounded-xl`}>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h3 className="font-semibold text-white">{cardio.name}</h3>
                          <span className="text-xs text-[#52525b] bg-[#0f0f0f] border border-white/[0.05] px-2.5 py-0.5 rounded-full shrink-0">
                            {cardio.equipment}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-[#52525b] uppercase tracking-widest">Duration</span>
                            <span className="font-mono-num text-sm text-white">{cfg.duration}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-[#52525b] uppercase tracking-widest">Intensity</span>
                            <span className="text-sm text-[#a1a1aa]">{cfg.intensity}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9px] text-[#52525b] uppercase tracking-widest">~Cal/min</span>
                            <span className="font-mono-num text-sm text-[#f97316]">{cfg.caloriesPerMin}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Beginner/Intermediate/Advanced note */}
                  <div className="p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.04]">
                    <p className="text-xs text-[#52525b]">
                      <span className="text-[#22c55e]">Beginner</span> — Steady pace, low intensity. Build a base.{' '}
                      <span className="text-[#f97316]">Intermediate</span> — Push the pace, feel the effort.{' '}
                      <span className="text-[#ef4444]">Advanced</span> — High intensity, intervals, sweat.
                    </p>
                  </div>
                </div>
              </Section>
            )}

            {/* ── Core ── */}
            {activeSection === 'core' && (
              <Section title="CORE FINISHER" subtitle="3 exercises after strength. Keep rest short.">
                <div className="flex flex-col gap-3">
                  {day.coreExercises.map((ex, i) => (
                    <div key={ex.id} className="card-dark p-4 flex flex-col gap-3 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="font-mono-num text-[#3b82f6] text-sm font-medium w-5 shrink-0">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <p className="font-semibold text-white">{ex.name}</p>
                            <div className="flex gap-2 text-xs shrink-0">
                              <span className="text-[#a1a1aa] bg-[#0f0f0f] border border-white/[0.06] px-2 py-0.5 rounded">{ex.sets} sets</span>
                              <span className="text-[#a1a1aa] bg-[#0f0f0f] border border-white/[0.06] px-2 py-0.5 rounded">{ex.reps}</span>
                              <span className="text-[#52525b] bg-[#0f0f0f] border border-white/[0.06] px-2 py-0.5 rounded">{ex.rest} rest</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <GifDemoCard
                        gifUrl={ex.gifUrl}
                        demoAltText={ex.demoAltText}
                        exerciseName={ex.name}
                        compact
                      />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ── Cool-Down ── */}
            {activeSection === 'cooldown' && (
              <Section title="COOL-DOWN" subtitle="Take this seriously. Recovery is when your body actually improves.">
                <div className="flex flex-col gap-3">
                  {day.cooldown.map((step, i) => (
                    <div key={i} className="flex gap-4 p-4 card-dark rounded-xl">
                      <span className="font-mono-num text-[#22c55e] text-sm font-medium w-5 shrink-0">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <p className="font-semibold text-white">{step.name}</p>
                          <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-0.5 rounded-full shrink-0">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-sm text-[#71717a] mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* ── Log modal ── */}
      {showLogModal && (
        <LogWorkoutModal
          day={day}
          difficulty={difficulty}
          defaultWeight={weight}
          onClose={() => setShowLogModal(false)}
          onSaved={() => {
            setLogSaved(true);
            sendPush('Workout Complete 💪', `Day ${day.id}: ${day.name} logged!`, '/progress');
          }}
        />
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl text-white tracking-wide">{title}</h2>
        <p className="text-sm text-[#71717a] mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function QuickStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-dark p-4 flex flex-col gap-2">
      {icon}
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className="font-mono-num text-sm font-medium text-white">{value}</span>
    </div>
  );
}
