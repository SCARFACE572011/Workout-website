'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Zap, Scale, Calendar, ChevronRight, Quote } from 'lucide-react';
import WorkoutCard from '@/components/WorkoutCard';
import CaloriesCalculator from '@/components/CaloriesCalculator';
import ProgressTracker from '@/components/ProgressTracker';
import { workoutDays, motivationalQuotes } from '@/data/workoutData';
import { getProfile, getThisWeekProgress } from '@/lib/storage';
import { weeklyCalorieEstimate } from '@/lib/calculations';
import type { Difficulty, WeeklyProgress } from '@/types';

export default function DashboardPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [weight, setWeight] = useState(221);
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress | null>(null);
  const [quote] = useState(() => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  useEffect(() => {
    const profile = getProfile();
    setDifficulty(profile.difficulty);
    setWeight(profile.weightLbs);
    setWeeklyProgress(getThisWeekProgress());
  }, []);

  const nextDay = weeklyProgress
    ? workoutDays.find((d) => !weeklyProgress.completedDays.includes(d.id)) ?? workoutDays[0]
    : workoutDays[0];

  const weeklyCalories = weeklyCalorieEstimate(weight, difficulty);
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const sessionsLeft = 3 - (weeklyProgress?.completedDays.length ?? 0);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[#52525b] text-sm mb-1">{todayName}</p>
            <h1 className="font-display text-4xl sm:text-5xl text-white tracking-wide">
              DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Scale className="w-4 h-4 text-[#3b82f6]" />
            <span className="text-[#a1a1aa]">
              <span className="font-mono-num text-white">{weight}</span> lbs ·{' '}
              <span className="capitalize">{difficulty}</span>
            </span>
          </div>
        </div>

        {/* ── Top stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Workouts This Week"
            value={`${weeklyProgress?.sessions.length ?? 0} / 3`}
            icon="🏋️"
            color="blue"
          />
          <StatCard
            label="Sessions Left"
            value={String(sessionsLeft)}
            icon="📅"
            color={sessionsLeft === 0 ? 'green' : 'orange'}
          />
          <StatCard
            label="Streak"
            value={`${weeklyProgress?.streak ?? 0} days`}
            icon="🔥"
            color="orange"
          />
          <StatCard
            label="Weekly Cal Goal"
            value={`~${weeklyCalories}`}
            icon="⚡"
            color="blue"
          />
        </div>

        {/* ── Next workout ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[#3b82f6]" />
            <h2 className="font-display text-2xl tracking-widest text-white">NEXT WORKOUT</h2>
          </div>
          <div className="max-w-sm">
            <WorkoutCard
              day={nextDay}
              difficulty={difficulty}
              weightLbs={weight}
              large
            />
          </div>
        </div>

        {/* ── Full week ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#3b82f6]" />
              <h2 className="font-display text-2xl tracking-widest text-white">THIS WEEK</h2>
            </div>
            <Link href="/workout" className="flex items-center gap-1 text-xs text-[#52525b] hover:text-[#3b82f6] transition-colors">
              Full program <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {workoutDays.map((day) => (
              <WorkoutCard
                key={day.id}
                day={day}
                difficulty={difficulty}
                weightLbs={weight}
                completed={weeklyProgress?.completedDays.includes(day.id)}
              />
            ))}
          </div>
        </div>

        {/* ── Progress + Calculator ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
              <h2 className="font-display text-2xl tracking-widest text-white">PROGRESS</h2>
            </div>
            <ProgressTracker />
          </div>
          <div>
            <CaloriesCalculator
              defaultWeight={weight}
              defaultDifficulty={difficulty}
            />
          </div>
        </div>

        {/* ── Quote ── */}
        <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.04]">
          <Quote className="w-6 h-6 text-[#3b82f6]/40 shrink-0 mt-1" />
          <div>
            <p className="text-lg text-[#a1a1aa] italic leading-relaxed">{quote.text}</p>
            <p className="text-[#52525b] text-sm mt-2">— {quote.author}</p>
          </div>
        </div>

        {/* ── Quick links ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/exercises', label: 'Exercise Library', icon: '📚' },
            { href: '/nutrition', label: 'Nutrition Guide', icon: '🥗' },
            { href: '/calculator', label: 'Cal Calculator', icon: '🔥' },
            { href: '/progress', label: 'Full Progress', icon: '📈' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 p-3 card-dark rounded-xl hover:border-white/[0.12] transition-colors group"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm text-[#a1a1aa] group-hover:text-white transition-colors">
                {link.label}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#52525b] ml-auto group-hover:text-[#3b82f6] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: 'blue' | 'orange' | 'green' | 'red';
}) {
  const colors = {
    blue: 'border-[#3b82f6]/20 bg-[#3b82f6]/5',
    orange: 'border-[#f97316]/20 bg-[#f97316]/5',
    green: 'border-[#22c55e]/20 bg-[#22c55e]/5',
    red: 'border-[#ef4444]/20 bg-[#ef4444]/5',
  };
  return (
    <div className={`card-dark p-4 border ${colors[color]} flex flex-col gap-2`}>
      <span className="text-xl">{icon}</span>
      <span className="text-[10px] text-[#52525b] uppercase tracking-widest leading-tight">{label}</span>
      <span className="font-mono-num text-xl font-medium text-white">{value}</span>
    </div>
  );
}
