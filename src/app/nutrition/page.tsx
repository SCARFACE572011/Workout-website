'use client';

import { useState, useEffect } from 'react';
import { Scale, Utensils, Droplets, CheckCircle } from 'lucide-react';
import { nutritionPrinciples, preworkoutMeals, postworkoutMeals, restaurantChoices } from '@/data/nutritionData';
import { proteinTargetGrams, caloricDeficitTarget } from '@/lib/calculations';
import { getProfile } from '@/lib/storage';

export default function NutritionPage() {
  const [weight, setWeight] = useState(221);
  const [activeTab, setActiveTab] = useState<'principles' | 'meals' | 'restaurants'>('principles');

  useEffect(() => {
    const p = getProfile();
    setWeight(p.weightLbs);
  }, []);

  const proteinTarget = proteinTargetGrams(weight);
  const calorieTarget = caloricDeficitTarget(weight);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div>
          <p className="text-xs text-[#22c55e] uppercase tracking-widest font-semibold mb-2">Fuel the Work</p>
          <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide mb-3">
            NUTRITION GUIDE
          </h1>
          <p className="text-[#a1a1aa] max-w-2xl text-lg">
            Simple, practical nutrition for losing fat and building muscle. No meal plans, no counting
            every macro — just the principles that actually matter.
          </p>
        </div>

        {/* ── Personal targets ── */}
        <div className="card-dark p-6 flex flex-col gap-5 rounded-2xl">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#22c55e]" />
            <h2 className="font-display text-2xl tracking-widest text-white">YOUR TARGETS</h2>
          </div>

          <div>
            <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">
              Your Body Weight — <span className="text-white font-mono-num">{weight} lbs</span>
            </label>
            <input
              type="range"
              min={120} max={350} value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-[#22c55e] h-1.5 rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TargetCard
              label="Daily Protein Target"
              value={`${proteinTarget}g`}
              sub="0.9g × bodyweight (lbs)"
              color="green"
              icon="🥩"
            />
            <TargetCard
              label="Calorie Target (Deficit)"
              value={`${calorieTarget} kcal`}
              sub="~500 cal below TDEE"
              color="blue"
              icon="⚡"
            />
            <TargetCard
              label="Daily Water Goal"
              value="3–4L"
              sub="More on training days"
              color="blue"
              icon="💧"
            />
          </div>

          <p className="text-xs text-[#52525b] italic">
            Calorie estimates are approximate. Individual TDEE varies by age, activity level, and metabolism.
            Adjust based on real-world progress — if you&apos;re not losing weight after 2 weeks, eat 100–200 fewer calories.
          </p>
        </div>

        {/* ── Tab nav ── */}
        <div className="flex gap-1 p-1 bg-[#0f0f0f] border border-white/[0.06] rounded-xl w-full sm:w-fit">
          {[
            { id: 'principles', label: 'Principles' },
            { id: 'meals', label: 'Meal Ideas' },
            { id: 'restaurants', label: 'Eating Out' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
                  : 'text-[#52525b] hover:text-[#a1a1aa]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Principles ── */}
        {activeTab === 'principles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nutritionPrinciples.map((p, i) => (
              <div key={i} className="card-dark p-5 flex flex-col gap-3">
                <div className="text-3xl">{p.icon}</div>
                <h3 className="font-semibold text-white text-lg">{p.title}</h3>
                <p className="text-sm text-[#71717a] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Meals ── */}
        {activeTab === 'meals' && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-4 h-4 text-[#f97316]" />
                <h2 className="font-display text-2xl tracking-widest text-white">PRE-WORKOUT MEALS</h2>
              </div>
              <p className="text-sm text-[#71717a] mb-4">Eat 60–90 minutes before training. Goal: carbs for energy + protein to protect muscle.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {preworkoutMeals.map((meal, i) => (
                  <MealCard key={i} meal={meal} />
                ))}
              </div>
            </div>

            <div className="h-px bg-white/[0.04]" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                <h2 className="font-display text-2xl tracking-widest text-white">POST-WORKOUT MEALS</h2>
              </div>
              <p className="text-sm text-[#71717a] mb-4">Eat within 60–90 minutes after training. Goal: protein to rebuild + carbs to refuel glycogen.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {postworkoutMeals.map((meal, i) => (
                  <MealCard key={i} meal={meal} accent="green" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Restaurants ── */}
        {activeTab === 'restaurants' && (
          <div className="flex flex-col gap-4">
            <p className="text-[#a1a1aa] text-sm">
              You will eat out. Here are the best choices at common spots. The key: always anchor the meal to a high-protein source.
            </p>
            {restaurantChoices.map((r, i) => (
              <div key={i} className="card-dark p-5 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="font-semibold text-white">{r.category}</h3>
                  <span className="text-xs text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2.5 py-0.5 rounded-full shrink-0">
                    ~{r.protein} protein
                  </span>
                </div>
                <p className="text-sm text-[#a1a1aa]">{r.choice}</p>
                <div className="flex items-start gap-1.5 mt-1">
                  <span className="text-[#f97316] text-xs shrink-0 mt-0.5">💡</span>
                  <p className="text-xs text-[#52525b]">{r.tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Hydration reminder ── */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.04]">
          <Droplets className="w-8 h-8 text-[#3b82f6] shrink-0" />
          <div>
            <p className="font-semibold text-white">Hydration Reminder</p>
            <p className="text-sm text-[#71717a] mt-0.5">
              Drink water before, during, and after your workout. Dehydration — even mild — reduces strength, endurance,
              and cognitive function. Aim for 3–4 liters per day. Add electrolytes (sodium, potassium, magnesium) on heavy training days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TargetCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  color: 'green' | 'blue' | 'orange';
  icon: string;
}) {
  const colors = {
    green: 'border-[#22c55e]/20 bg-[#22c55e]/5',
    blue: 'border-[#3b82f6]/20 bg-[#3b82f6]/5',
    orange: 'border-[#f97316]/20 bg-[#f97316]/5',
  };
  const textColors = {
    green: 'text-[#22c55e]',
    blue: 'text-[#3b82f6]',
    orange: 'text-[#f97316]',
  };
  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl border ${colors[color]}`}>
      <span className="text-2xl">{icon}</span>
      <span className="text-xs text-[#52525b] uppercase tracking-widest">{label}</span>
      <span className={`font-mono-num text-2xl font-medium ${textColors[color]}`}>{value}</span>
      <span className="text-xs text-[#52525b]">{sub}</span>
    </div>
  );
}

function MealCard({
  meal,
  accent = 'orange',
}: {
  meal: { name: string; protein: number; calories: number; description: string };
  accent?: 'orange' | 'green';
}) {
  const colors = {
    orange: 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20',
    green: 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20',
  };
  return (
    <div className="card-dark p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{meal.name}</h3>
        <div className="flex gap-1.5 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[accent]}`}>
            {meal.protein}g protein
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full border border-white/[0.06] text-[#52525b]">
            ~{meal.calories} cal
          </span>
        </div>
      </div>
      <p className="text-sm text-[#71717a]">{meal.description}</p>
    </div>
  );
}
