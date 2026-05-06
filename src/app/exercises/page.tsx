'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ExerciseCard from '@/components/ExerciseCard';
import DifficultySelector from '@/components/DifficultySelector';
import { allExercises } from '@/data/workoutData';
import type { Difficulty, MuscleGroup, Equipment } from '@/types';

const muscleGroups: MuscleGroup[] = ['Back', 'Biceps', 'Chest', 'Shoulders', 'Triceps', 'Legs', 'Core', 'Glutes', 'Hamstrings', 'Quads', 'Calves'];
const equipmentTypes: Equipment[] = ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Resistance Band', 'Cardio Machine'];

export default function ExercisesPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'All'>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | 'All'>('All');
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3 | 'All'>('All');
  const [beginnerOnly, setBeginnerOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return allExercises.filter((ex) => {
      const muscles = Array.isArray(ex.muscleGroup) ? ex.muscleGroup : [ex.muscleGroup];

      if (search && !ex.name.toLowerCase().includes(search.toLowerCase()) &&
        !muscles.some(m => m.toLowerCase().includes(search.toLowerCase()))) {
        return false;
      }
      if (selectedMuscle !== 'All' && !muscles.includes(selectedMuscle)) return false;
      if (selectedEquipment !== 'All' && ex.equipment !== selectedEquipment) return false;
      if (selectedDay !== 'All' && ex.workoutDay !== selectedDay) return false;
      if (beginnerOnly && !ex.isBeginnerFriendly) return false;
      return true;
    });
  }, [search, selectedMuscle, selectedEquipment, selectedDay, beginnerOnly]);

  const hasFilters = selectedMuscle !== 'All' || selectedEquipment !== 'All' || selectedDay !== 'All' || beginnerOnly;

  const clearFilters = () => {
    setSelectedMuscle('All');
    setSelectedEquipment('All');
    setSelectedDay('All');
    setBeginnerOnly(false);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div>
          <p className="text-xs text-[#3b82f6] uppercase tracking-widest font-semibold mb-2">Full Library</p>
          <h1 className="font-display text-5xl sm:text-7xl text-white tracking-wide mb-3">EXERCISE LIBRARY</h1>
          <p className="text-[#a1a1aa] max-w-2xl">
            All {allExercises.length} exercises in the program. Every card includes form tips, common mistakes, substitutions,
            and a demo placeholder ready for your GIF files.
          </p>
        </div>

        {/* ── Search + Filter bar ── */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#141414] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-[#f5f5f5] placeholder:text-[#52525b] outline-none focus:border-[#3b82f6]/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                showFilters || hasFilters
                  ? 'bg-[#3b82f6]/10 border-[#3b82f6]/30 text-[#3b82f6]'
                  : 'border-white/[0.08] text-[#52525b] hover:text-[#a1a1aa]'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="card-dark p-4 rounded-xl flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Muscle group */}
                <div>
                  <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Muscle Group</label>
                  <select
                    value={selectedMuscle}
                    onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup | 'All')}
                    className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#f5f5f5] outline-none"
                  >
                    <option value="All">All Muscles</option>
                    {muscleGroups.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Equipment</label>
                  <select
                    value={selectedEquipment}
                    onChange={(e) => setSelectedEquipment(e.target.value as Equipment | 'All')}
                    className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#f5f5f5] outline-none"
                  >
                    <option value="All">All Equipment</option>
                    {equipmentTypes.map((e) => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                {/* Day */}
                <div>
                  <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Workout Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value === 'All' ? 'All' : Number(e.target.value) as 1 | 2 | 3)}
                    className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-[#f5f5f5] outline-none"
                  >
                    <option value="All">All Days</option>
                    <option value="1">Day 1 — Back & Biceps</option>
                    <option value="2">Day 2 — Chest/Shoulders/Tris</option>
                    <option value="3">Day 3 — Legs & Cardio</option>
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs text-[#52525b] uppercase tracking-widest mb-2">Show Sets/Reps For</label>
                  <DifficultySelector value={difficulty} onChange={setDifficulty} size="sm" />
                </div>
              </div>

              {/* Beginner friendly + Clear */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={beginnerOnly}
                    onChange={(e) => setBeginnerOnly(e.target.checked)}
                    className="accent-[#3b82f6]"
                  />
                  <span className="text-sm text-[#a1a1aa]">Beginner-friendly only</span>
                </label>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-[#52525b] hover:text-[#a1a1aa] flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#52525b]">
            <span className="font-mono-num text-white">{filtered.length}</span> exercises
            {hasFilters && ' (filtered)'}
          </p>
          {search && filtered.length === 0 && (
            <p className="text-sm text-[#52525b]">No matches for &quot;{search}&quot;</p>
          )}
        </div>

        {/* ── Exercise cards ── */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} difficulty={difficulty} index={i + 1} showGif />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-4xl">🔍</p>
            <p className="text-[#52525b] text-lg">No exercises match your filters.</p>
            <button onClick={clearFilters} className="text-sm text-[#3b82f6] hover:underline">
              Clear all filters
            </button>
          </div>
        )}

        {/* ── Add GIF instructions ── */}
        <div className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.04]">
          <h3 className="font-semibold text-white mb-2">📁 Adding Your Own GIFs</h3>
          <p className="text-sm text-[#71717a] mb-3">
            Drop your exercise GIF files into the <code className="text-[#a1a1aa] bg-[#141414] px-1.5 py-0.5 rounded">public/assets/exercises/</code> folder.
            Then update the <code className="text-[#a1a1aa] bg-[#141414] px-1.5 py-0.5 rounded">gifUrl</code> field in{' '}
            <code className="text-[#a1a1aa] bg-[#141414] px-1.5 py-0.5 rounded">src/data/workoutData.ts</code>.
          </p>
          <div className="text-xs font-mono text-[#52525b] bg-[#141414] rounded-lg p-3 border border-white/[0.04]">
            <span className="text-[#22c55e]">// Example in workoutData.ts:</span><br />
            {'gifUrl: "/assets/exercises/lat-pulldown.gif",'}<br />
            {'demoAltText: "Lat Pulldown — pull bar to upper chest"'}
          </div>
        </div>
      </div>
    </div>
  );
}
