'use client';

import { useState, useEffect } from 'react';
import { Flame, Info, Scale, Clock, Activity } from 'lucide-react';
import DifficultySelector from '@/components/DifficultySelector';
import { estimateWorkoutCalories, estimateCardioCalories, weeklyCalorieEstimate } from '@/lib/calculations';
import { getProfile } from '@/lib/storage';
import type { Difficulty } from '@/types';

const cardioMetValues: Record<string, number> = {
  'Incline Treadmill Walk': 5.5,
  'Stationary Bike': 5.5,
  'Stairmaster': 9.0,
  'Rowing Machine': 7.0,
  'Elliptical': 5.0,
  'Treadmill Running': 8.5,
  'HIIT Intervals': 10.0,
};

export default function CalculatorPage() {
  const [weight, setWeight] = useState(221);
  const [duration, setDuration] = useState(75);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [cardioDuration, setCardioDuration] = useState(20);
  const [cardioType, setCardioType] = useState('Incline Treadmill Walk');

  useEffect(() => {
    const p = getProfile();
    setWeight(p.weightLbs);
    setDifficulty(p.difficulty);
  }, []);

  const workoutCalories = estimateWorkoutCalories(weight, duration, difficulty);
  const cardioOnly = estimateCardioCalories(weight, cardioDuration, cardioMetValues[cardioType]);
  const weekly = weeklyCalorieEstimate(weight, difficulty);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div>
          <p className="text-xs text-[#f97316] uppercase tracking-widest font-semibold mb-2">Estimates</p>
          <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide mb-3">
            CALORIE CALCULATOR
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl">
            Estimate calories burned during your sessions. All estimates use MET (Metabolic Equivalent of Task)
            values and scale with your body weight.
          </p>
        </div>

        {/* ── Main inputs ── */}
        <div className="card-dark p-6 flex flex-col gap-6 rounded-2xl">
          <h2 className="font-display text-2xl tracking-widest text-white">FULL WORKOUT ESTIMATE</h2>

          {/* Weight */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-[#52525b] uppercase tracking-widest mb-2">
              <Scale className="w-3 h-3" />
              Body Weight — <span className="text-white font-mono-num">{weight} lbs</span>
            </label>
            <input type="range" min={120} max={350} value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-[#f97316] h-1.5 rounded-full"
            />
            <div className="flex justify-between text-[10px] text-[#52525b] mt-1"><span>120 lb</span><span>350 lb</span></div>
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-[#52525b] uppercase tracking-widest mb-2">
              <Clock className="w-3 h-3" />
              Workout Duration — <span className="text-white font-mono-num">{duration} minutes</span>
            </label>
            <input type="range" min={30} max={120} value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-[#f97316] h-1.5 rounded-full"
            />
            <div className="flex justify-between text-[10px] text-[#52525b] mt-1"><span>30 min</span><span>120 min</span></div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
              <Activity className="w-3 h-3 inline mr-1" />
              Intensity
            </label>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Strength', value: workoutCalories.strength, color: '#3b82f6' },
              { label: 'Cardio', value: workoutCalories.cardio, color: '#f97316' },
              { label: 'Core', value: workoutCalories.core, color: '#22c55e' },
              { label: 'TOTAL', value: workoutCalories.total, color: '#f97316', large: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.06]"
                style={{ borderColor: item.large ? 'rgba(249,115,22,0.25)' : undefined, background: item.large ? 'rgba(249,115,22,0.05)' : undefined }}
              >
                <span className="text-[10px] text-[#52525b] uppercase tracking-widest">{item.label}</span>
                <span className="font-mono-num text-2xl font-medium" style={{ color: item.color }}>
                  {item.value}
                </span>
                <div className="h-1 bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min((item.value / 800) * 100, 100)}%`, backgroundColor: item.color, transition: 'width 0.5s' }} />
                </div>
                <span className="text-[10px] text-[#52525b]">kcal</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Cardio-only calculator ── */}
        <div className="card-dark p-6 flex flex-col gap-5 rounded-2xl">
          <h2 className="font-display text-2xl tracking-widest text-white">CARDIO-ONLY ESTIMATE</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Cardio Type</label>
              <select
                value={cardioType}
                onChange={(e) => setCardioType(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f5f5f5] outline-none"
              >
                {Object.keys(cardioMetValues).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
                Duration — <span className="text-white font-mono-num">{cardioDuration} min</span>
              </label>
              <input
                type="range" min={5} max={60} value={cardioDuration}
                onChange={(e) => setCardioDuration(Number(e.target.value))}
                className="w-full accent-[#3b82f6] h-1.5 rounded-full mt-3"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[#3b82f6]/8 border border-[#3b82f6]/20">
            <div>
              <p className="text-sm text-[#a1a1aa]">{cardioType} · {cardioDuration} min · {weight} lbs</p>
              <p className="text-xs text-[#52525b]">MET value: {cardioMetValues[cardioType]}</p>
            </div>
            <div className="text-right">
              <p className="font-mono-num text-3xl font-medium text-[#3b82f6]">{cardioOnly}</p>
              <p className="text-xs text-[#52525b]">kcal</p>
            </div>
          </div>
        </div>

        {/* ── Weekly summary ── */}
        <div className="card-dark p-6 rounded-2xl flex flex-col gap-4">
          <h2 className="font-display text-2xl tracking-widest text-white">WEEKLY BURN SUMMARY</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SumCard label="Per Session" value={`~${workoutCalories.total}`} sub="calories" color="orange" />
            <SumCard label="Weekly Total" value={`~${weekly}`} sub="3 sessions" color="red" />
            <SumCard label="Monthly" value={`~${weekly * 4}`} sub="12 sessions" color="blue" />
          </div>
          <p className="text-xs text-[#52525b]">
            These estimates assume consistent effort and full workout completion.
            Actual burn varies with heart rate, rest periods, and individual metabolism.
          </p>
        </div>

        {/* ── How it works ── */}
        <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.04] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#52525b]" />
            <h3 className="font-semibold text-white">How Calorie Estimates Are Calculated</h3>
          </div>
          <p className="text-sm text-[#71717a] leading-relaxed">
            These estimates use MET (Metabolic Equivalent of Task) values — a standardized measure of exercise intensity.
            The formula is: <code className="text-[#a1a1aa] bg-[#141414] px-1.5 py-0.5 rounded">Calories = MET × weight(kg) × time(hours)</code>.
            Strength training at moderate intensity has a MET of ~5.0. Cardio varies from ~5 (walking) to ~10 (HIIT).
          </p>
          <p className="text-xs text-[#52525b] italic">
            Calorie estimates are approximate and should be used for general tracking, not medical guidance.
          </p>
        </div>

        {/* ── MET table ── */}
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-white text-sm">MET Reference Values</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-[10px] text-[#52525b] uppercase tracking-widest py-2 pr-4">Activity</th>
                  <th className="text-right text-[10px] text-[#52525b] uppercase tracking-widest py-2">MET</th>
                  <th className="text-right text-[10px] text-[#52525b] uppercase tracking-widest py-2 pl-4">Cal/min ({weight}lb)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Light Strength', met: 3.5 },
                  { name: 'Moderate Strength', met: 5.0 },
                  { name: 'Heavy Compound', met: 6.0 },
                  { name: 'Treadmill Incline Walk', met: 5.5 },
                  { name: 'Stationary Bike', met: 5.5 },
                  { name: 'Stairmaster', met: 9.0 },
                  { name: 'Rowing', met: 7.0 },
                  { name: 'HIIT Intervals', met: 10.0 },
                ].map((row) => {
                  const calPerMin = (row.met * weight * 0.453592) / 60;
                  return (
                    <tr key={row.name} className="border-b border-white/[0.03]">
                      <td className="text-[#a1a1aa] py-2.5 pr-4">{row.name}</td>
                      <td className="text-right font-mono-num text-white py-2.5">{row.met}</td>
                      <td className="text-right font-mono-num text-[#f97316] py-2.5 pl-4">
                        {calPerMin.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SumCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: 'orange' | 'red' | 'blue' }) {
  const colors = {
    orange: 'text-[#f97316]',
    red: 'text-[#ef4444]',
    blue: 'text-[#3b82f6]',
  };
  return (
    <div className="card-dark p-4 flex flex-col gap-1">
      <span className="text-xs text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className={`font-mono-num text-3xl font-medium ${colors[color]}`}>{value}</span>
      <span className="text-xs text-[#52525b]">{sub}</span>
    </div>
  );
}
