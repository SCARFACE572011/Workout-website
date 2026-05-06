import { workoutDays } from '@/data/workoutData';
import WorkoutDetailClient from '@/components/WorkoutDetailClient';

export const metadata = {
  title: 'Day 2: Chest, Shoulders & Triceps | 3-Day Program',
};

export default function Day2Page() {
  const day = workoutDays[1];
  return <WorkoutDetailClient day={day} />;
}
