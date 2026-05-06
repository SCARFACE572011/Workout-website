import type { Difficulty, CalorieEstimate } from '@/types';

const LBS_TO_KG = 0.453592;

// MET (Metabolic Equivalent of Task) values
// Calories = MET × weight(kg) × time(hours)
const MET = {
  strengthLight: 3.5,
  strengthModerate: 5.0,
  strengthHeavy: 6.0,
  treadmillIncline: 5.5,
  stationaryBike: 5.5,
  stairmaster: 9.0,
  rowing: 7.0,
  elliptical: 5.0,
  intervals: 8.5,
  core: 3.8,
  warmup: 3.0,
  cooldown: 2.5,
};

const DIFFICULTY_MET: Record<Difficulty, number> = {
  beginner: MET.strengthLight,
  intermediate: MET.strengthModerate,
  advanced: MET.strengthHeavy,
};

const CARDIO_MET: Record<Difficulty, number> = {
  beginner: MET.treadmillIncline,
  intermediate: MET.stationaryBike,
  advanced: MET.intervals,
};

export function calcCalories(
  weightLbs: number,
  durationMinutes: number,
  met: number
): number {
  const kg = weightLbs * LBS_TO_KG;
  const hours = durationMinutes / 60;
  return Math.round(met * kg * hours);
}

export function estimateWorkoutCalories(
  weightLbs: number,
  durationMinutes: number,
  difficulty: Difficulty
): CalorieEstimate {
  // Typical split: ~50% strength, ~25% cardio, ~10% core, ~15% rest/transition
  const strengthMins = durationMinutes * 0.5;
  const cardioMins = durationMinutes * 0.25;
  const coreMins = durationMinutes * 0.1;

  const strength = calcCalories(weightLbs, strengthMins, DIFFICULTY_MET[difficulty]);
  const cardio = calcCalories(weightLbs, cardioMins, CARDIO_MET[difficulty]);
  const core = calcCalories(weightLbs, coreMins, MET.core);

  return {
    strength,
    cardio,
    core,
    total: strength + cardio + core,
    weightLbs,
    durationMinutes,
    difficulty,
  };
}

export function estimateCardioCalories(
  weightLbs: number,
  durationMinutes: number,
  met: number
): number {
  return calcCalories(weightLbs, durationMinutes, met);
}

export function weeklyCalorieEstimate(
  weightLbs: number,
  difficulty: Difficulty
): number {
  // 3 sessions × ~75 min each
  return estimateWorkoutCalories(weightLbs, 75, difficulty).total * 3;
}

export function proteinTargetGrams(weightLbs: number): number {
  // 0.8–1g per lb of bodyweight for muscle building
  return Math.round(weightLbs * 0.9);
}

export function caloricDeficitTarget(weightLbs: number): number {
  // Rough TDEE estimate for a moderately active male, then 500 cal deficit
  const kg = weightLbs * LBS_TO_KG;
  const tdee = 10 * kg + 6.25 * 177.8 - 5 * 30 + 5; // Mifflin, male, 5'10", ~30yrs
  const activityMultiplier = 1.55; // moderately active (3x/week gym)
  return Math.round(tdee * activityMultiplier - 500);
}
