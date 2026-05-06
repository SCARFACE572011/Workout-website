'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Target, TrendingUp, Calendar, Flame } from 'lucide-react';
import WorkoutCard from '@/components/WorkoutCard';
import { workoutDays, motivationalQuotes } from '@/data/workoutData';
import { weeklyCalorieEstimate } from '@/lib/calculations';
import { getProfile } from '@/lib/storage';
import type { Difficulty } from '@/types';

export default function HomePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [weight, setWeight] = useState(221);
  const [quote, setQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const profile = getProfile();
    setDifficulty(profile.difficulty);
    setWeight(profile.weightLbs);
    const idx = Math.floor(Math.random() * motivationalQuotes.length);
    setQuote(motivationalQuotes[idx]);
  }, []);

  const weeklyCalories = weeklyCalorieEstimate(weight, difficulty);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 hero-grid pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3b82f6]/30 bg-[#3b82f6]/8 mb-6 fade-in-1">
            <Zap className="w-3.5 h-3.5 text-[#3b82f6]" />
            <span className="text-xs text-[#3b82f6] font-semibold tracking-widest uppercase">
              3-Day Program · Fat Loss + Muscle
            </span>
          </div>

          <h1 className="font-display text-6xl sm:text-8xl lg:text-[108px] text-white leading-none tracking-wide fade-in-2 mb-6">
            BUILD.
            <br />
            <span className="text-gradient-blue">BURN.</span>
            <br />
            REPEAT.
          </h1>

          <p className="text-[#a1a1aa] text-lg sm:text-xl max-w-2xl mx-auto fade-in-3 mb-8 leading-relaxed">
            Lose fat, build muscle, and stay consistent with a simple{' '}
            <span className="text-white font-medium">3-day gym plan</span>. Every workout fits in 60–90 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 fade-in-4 mb-12">
            <Link
              href="/workout"
              className="flex items-center gap-2 px-8 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#3b82f6]/25 hover:-translate-y-0.5"
            >
              View the Program
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/workout/day-1"
              className="flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 text-[#a1a1aa] hover:text-white font-semibold rounded-xl transition-all duration-200"
            >
              <Zap className="w-4 h-4" />
              Start Day 1
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 fade-in-5">
            {[
              { label: '3 Days/Week', icon: '📅' },
              { label: '60–90 Min Sessions', icon: '⏱️' },
              { label: `~${weeklyCalories} Cal/Week`, icon: '🔥' },
              { label: 'Beginner to Advanced', icon: '📈' },
            ].map((pill) => (
              <div key={pill.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141414] border border-white/[0.07] text-sm text-[#a1a1aa]">
                <span>{pill.icon}</span>
                {pill.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="py-12 px-4 border-y border-white/[0.04] bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl text-[#a1a1aa] italic leading-relaxed">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-[#52525b] text-sm mt-3">— {quote.author}</p>
        </div>
      </section>

      {/* ── Weekly Overview ── */}
      <section className="section px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold mb-2">The Split</p>
              <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">YOUR WEEKLY PROGRAM</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#52525b]">
              <Flame className="w-4 h-4 text-[#f97316]" />
              <span className="text-[#a1a1aa]">
                ~<span className="font-mono-num text-white font-medium">{weeklyCalories}</span> cal/week est.
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workoutDays.map((day) => (
              <WorkoutCard key={day.id} day={day} difficulty={difficulty} weightLbs={weight} large />
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Works ── */}
      <section className="section px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold mb-2">The Logic</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-wide">WHY THIS WORKS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Calendar className="w-5 h-5 text-[#3b82f6]" />, title: 'Sustainable Frequency', body: '3 days per week is enough to drive serious muscle growth and fat loss — without burning out.' },
              { icon: <Target className="w-5 h-5 text-[#f97316]" />, title: 'Full Body Coverage', body: 'Every major muscle group is trained each week with enough volume to stimulate real adaptation.' },
              { icon: <Flame className="w-5 h-5 text-[#ef4444]" />, title: 'Built-In Cardio', body: 'Every session includes a cardio finisher to maximize calorie burn without wrecking recovery.' },
              { icon: <TrendingUp className="w-5 h-5 text-[#22c55e]" />, title: 'Progressive Overload', body: 'The program scales from Beginner to Advanced — same structure, more intensity as you improve.' },
            ].map((item, i) => (
              <div key={i} className="card-dark p-5 flex flex-col gap-3 hover:border-white/[0.12] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#0f0f0f] border border-white/[0.06] flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personalize ── */}
      <section className="section px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="animated-border-wrap">
            <div className="p-8 sm:p-10 flex flex-col gap-6">
              <div className="text-center">
                <p className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold mb-2">Your Profile</p>
                <h2 className="font-display text-4xl text-white tracking-wide">PERSONALIZE YOUR CALORIES</h2>
                <p className="text-[#71717a] text-sm mt-2">Adjust your weight so estimates reflect your numbers.</p>
              </div>
              <div>
                <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
                  Body Weight: <span className="text-white font-mono-num">{weight} lbs</span>
                </label>
                <input
                  type="range" min={120} max={350} value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-[#3b82f6] h-1.5 rounded-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map((d) => (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`py-2.5 rounded-lg text-sm font-semibold border transition-all capitalize ${
                      difficulty === d
                        ? d === 'beginner' ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/30'
                        : d === 'intermediate' ? 'bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30'
                        : 'bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30'
                        : 'text-[#52525b] border-white/[0.06] hover:text-[#a1a1aa]'
                    }`}
                  >{d}</button>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.06]">
                <div>
                  <p className="text-sm text-[#a1a1aa]">Estimated weekly calorie burn</p>
                  <p className="text-xs text-[#52525b]">3 sessions × ~75 min each</p>
                </div>
                <p className="font-mono-num text-3xl font-medium text-[#f97316]">
                  ~{weeklyCalorieEstimate(weight, difficulty)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section px-4 sm:px-6 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-4">READY TO START?</h2>
          <p className="text-[#a1a1aa] text-lg mb-8">Day 1 is Back & Biceps. Pick up something heavy.</p>
          <Link
            href="/workout/day-1"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-lg rounded-xl transition-all hover:shadow-xl hover:shadow-[#3b82f6]/25 hover:-translate-y-1"
          >
            Start Day 1 — Back & Biceps
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
