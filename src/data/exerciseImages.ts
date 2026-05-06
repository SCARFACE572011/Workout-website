// Static exercise image map — Wikimedia Commons public domain images.
// Keyed by exact exercise name from workoutData.ts.

const W = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

const BENCH = `${W}/a/aa/Bench_press_1.jpg/330px-Bench_press_1.jpg`;
const PULLDOWN = `${W}/f/f8/PulldownMachineExercise.JPG/330px-PulldownMachineExercise.JPG`;
const OVERHEAD = `${W}/6/62/Seated-military-shoulder-press-1.png/330px-Seated-military-shoulder-press-1.png`;
const DUMBBELL_FLY = `${W}/7/7e/DumbbellFlye.JPG/330px-DumbbellFlye.JPG`;
const TRICEPS = `${W}/5/51/DumbbellTricepsExtension.JPG/330px-DumbbellTricepsExtension.JPG`;
const DIPS = `${W}/5/59/Dipexercise.svg/330px-Dipexercise.svg.png`;
const SQUAT = `${W}/8/82/Squats.svg/330px-Squats.svg.png`;
const DEADLIFT = `${W}/6/63/Deadlift-phase_1.JPG/330px-Deadlift-phase_1.JPG`;
const LEG_PRESS = `${W}/8/83/Muscle_Strengthening_at_the_Gym_-_Seated_Leg_Press.webm/250px--Muscle_Strengthening_at_the_Gym_-_Seated_Leg_Press.webm.jpg`;
const LUNGE = `${W}/2/29/Airman_performing_lunge.jpg/330px-Airman_performing_lunge.jpg`;
const LEG_CURL = `${W}/c/c6/LyingLegCurlMachineExercise.JPG/330px-LyingLegCurlMachineExercise.JPG`;
const LEG_RAISE = `${W}/7/7a/Leg-raises-2.png/330px-Leg-raises-2.png`;
const PLANK = `${W}/7/79/A_U.S._Coast_Guard_recruit%2C_assigned_to_Company_Oscar_188%2C_performs_a_plank_during_incentive_training_at_Coast_Guard_Training_Center_Cape_May_in_Cape_May%2C_N.J.%2C_July_31%2C_2013_130731-G-WA946-943.jpg/330px-thumbnail.jpg`;
const CRUNCH = `${W}/c/cf/FloorCrunch.JPG/330px-FloorCrunch.JPG`;

export const EXERCISE_IMAGES: Record<string, string> = {
  // ── Back & Biceps ──
  'Lat Pulldown': PULLDOWN,
  'Seated Cable Row': PULLDOWN,
  'Chest Supported Row': PULLDOWN,
  'Single Arm Dumbbell Row': PULLDOWN,
  'Face Pulls': OVERHEAD,
  'Barbell Curl': TRICEPS,
  'Hammer Curl': TRICEPS,
  'Cable Curl': TRICEPS,

  // ── Chest / Shoulders / Triceps ──
  'Bench Press / Machine Chest Press': BENCH,
  'Incline Dumbbell Press': BENCH,
  'Cable Fly': DUMBBELL_FLY,
  'Shoulder Press': OVERHEAD,
  'Lateral Raises': DUMBBELL_FLY,
  'Rear Delt Fly': DUMBBELL_FLY,
  'Triceps Rope Pushdown': TRICEPS,
  'Overhead Triceps Extension': TRICEPS,
  'Dips / Assisted Dips': DIPS,

  // ── Legs & Cardio ──
  'Leg Press': LEG_PRESS,
  'Goblet Squat': SQUAT,
  'Romanian Deadlift': DEADLIFT,
  'Leg Curl (Lying or Seated)': LEG_CURL,
  'Leg Extension': LEG_PRESS,
  'Walking Lunges': LUNGE,
  'Calf Raises': LUNGE,

  // ── Core ──
  'Plank': PLANK,
  'Cable Crunch': CRUNCH,
  'Hanging Knee Raise': LEG_RAISE,
  'Russian Twist': CRUNCH,
  'Ab Wheel Rollout': PLANK,
  'Dead Bug': PLANK,
  'Lying Leg Raise': LEG_RAISE,
  'Side Plank': PLANK,
  'Bicycle Crunch': CRUNCH,
};
