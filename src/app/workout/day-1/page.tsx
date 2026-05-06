import { workoutDays } from '@/data/workoutData';
import WorkoutDetailClient from '@/components/WorkoutDetailClient';

export const metadata = {
  title: 'Day 1: Back & Biceps | 3-Day Program',
};

export default function Day1Page() {
  const day = workoutDays[0];
  return <WorkoutDetailClient day={day} />;
}
