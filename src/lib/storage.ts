import type { WorkoutSession, UserProfile, WeeklyProgress } from '@/types';

const KEYS = {
  profile: 'sfl_profile',
  sessions: 'sfl_sessions',
  streak: 'sfl_streak',
} as const;

// ─── User Profile ────────────────────────────────────────────────────────────

export function getProfile(): UserProfile {
  if (typeof window === 'undefined') return defaultProfile();
  try {
    const raw = localStorage.getItem(KEYS.profile);
    return raw ? JSON.parse(raw) : defaultProfile();
  } catch {
    return defaultProfile();
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.profile, JSON.stringify(profile));
}

function defaultProfile(): UserProfile {
  return {
    name: 'Athlete',
    gender: 'male',
    heightFt: 5,
    heightIn: 10,
    weightLbs: 221,
    goalWeightLbs: 185,
    difficulty: 'intermediate',
    weeksCompleted: 0,
  };
}

// ─── Workout Sessions ────────────────────────────────────────────────────────

export function getSessions(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.sessions);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: WorkoutSession): void {
  if (typeof window === 'undefined') return;
  const sessions = getSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
  } else {
    sessions.unshift(session);
  }
  // Keep only last 90 sessions
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions.slice(0, 90)));
}

export function deleteSession(id: string): void {
  if (typeof window === 'undefined') return;
  const sessions = getSessions().filter((s) => s.id !== id);
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

// ─── Weekly Progress ─────────────────────────────────────────────────────────

export function getThisWeekProgress(): WeeklyProgress {
  const sessions = getSessions();
  const now = new Date();
  const monday = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const weekSessions = sessions.filter(
    (s) => new Date(s.date) >= monday
  );

  const totalCalories = weekSessions.reduce((a, s) => a + s.caloriesBurned, 0);
  const totalCardioMinutes = weekSessions.reduce((a, s) => a + s.cardioMinutes, 0);
  const completedDays = [...new Set(weekSessions.map((s) => s.dayId))];

  return {
    weekStart: monday.toISOString(),
    sessions: weekSessions,
    totalCalories,
    totalCardioMinutes,
    completedDays,
    streak: calculateStreak(sessions),
  };
}

function calculateStreak(sessions: WorkoutSession[]): number {
  if (sessions.length === 0) return 0;
  const dates = [
    ...new Set(
      sessions.map((s) => new Date(s.date).toDateString())
    ),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(
      Date.now() - i * 86400000
    ).toDateString();
    if (dates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
