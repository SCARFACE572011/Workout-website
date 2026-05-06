import { workoutDays } from '@/data/workoutData';
import WorkoutDetailClient from '@/components/WorkoutDetailClient';

export const metadata = {
  title: 'Day 3: Legs & Cardio | 3-Day Program',
};

export default function Day3Page() {
  const day = workoutDays[2];
  return <WorkoutDetailClient day={day} />;
}
