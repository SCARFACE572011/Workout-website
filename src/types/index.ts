// ─── Exercise & Workout Types ────────────────────────────────────────────────

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type MuscleGroup =
  | 'Back'
  | 'Biceps'
  | 'Chest'
  | 'Shoulders'
  | 'Triceps'
  | 'Legs'
  | 'Core'
  | 'Cardio'
  | 'Glutes'
  | 'Hamstrings'
  | 'Quads'
  | 'Calves';

export type Equipment =
  | 'Barbell'
  | 'Dumbbell'
  | 'Cable'
  | 'Machine'
  | 'Bodyweight'
  | 'Kettlebell'
  | 'Resistance Band'
  | 'Cardio Machine';

export type ExerciseCategory = 'strength' | 'cardio' | 'core' | 'warmup' | 'cooldown';

export interface DifficultyConfig {
  sets: number;
  reps: string;
  rest: string;
  weight?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup | MuscleGroup[];
  equipment: Equipment;
  category: ExerciseCategory;
  workoutDay: 1 | 2 | 3 | 'all';
  // GIF/demo — drop your own GIFs into public/assets/exercises/
  gifUrl: string;
  imageFallback?: string;
  demoAltText: string;
  formTips: string[];
  commonMistakes: string[];
  substitution: string;
  difficulty: DifficultyConfig;
  intermediate: DifficultyConfig;
  advanced: DifficultyConfig;
  // MET value for calorie estimates (varies by intensity)
  metValue: number;
  isBeginnerFriendly: boolean;
}

export interface CardioOption {
  id: string;
  name: string;
  equipment: string;
  beginner: { duration: string; intensity: string; caloriesPerMin: number };
  intermediate: { duration: string; intensity: string; caloriesPerMin: number };
  advanced: { duration: string; intensity: string; caloriesPerMin: number };
  metValue: number;
}

export interface CoreExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  workoutDay: 1 | 2 | 3 | 'all';
  gifUrl: string;
  demoAltText: string;
}

export interface WorkoutDay {
  id: 1 | 2 | 3;
  name: string;
  slug: string;
  primaryMuscles: string[];
  estimatedTime: string;
  totalExercises: number;
  color: string;
  icon: string;
  exercises: Exercise[];
  cardioOptions: CardioOption[];
  coreExercises: CoreExercise[];
  warmup: WarmupStep[];
  cooldown: CooldownStep[];
}

export interface WarmupStep {
  name: string;
  duration: string;
  description: string;
}

export interface CooldownStep {
  name: string;
  duration: string;
  description: string;
}

// ─── User Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  heightFt: number;
  heightIn: number;
  weightLbs: number;
  goalWeightLbs: number;
  difficulty: Difficulty;
  weeksCompleted: number;
}

// ─── Progress Tracking ───────────────────────────────────────────────────────

export interface CompletedSet {
  exerciseId: string;
  set: number;
  reps: number;
  weightLbs: number;
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  dayId: 1 | 2 | 3;
  difficulty: Difficulty;
  durationMinutes: number;
  caloriesBurned: number;
  completedSets: CompletedSet[];
  cardioMinutes: number;
  coreCompleted: boolean;
  bodyWeightLbs: number;
  notes: string;
}

export interface WeeklyProgress {
  weekStart: string;
  sessions: WorkoutSession[];
  totalCalories: number;
  totalCardioMinutes: number;
  completedDays: number[];
  streak: number;
}

// ─── Calorie Calculator ──────────────────────────────────────────────────────

export interface CalorieEstimate {
  strength: number;
  cardio: number;
  core: number;
  total: number;
  weightLbs: number;
  durationMinutes: number;
  difficulty: Difficulty;
}
