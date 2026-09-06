import type { CardState, ProgressState } from '../types'

const KEY = 'ege-bio-progress-v1'

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function defaultProgress(): ProgressState {
  return { cards: {}, quizScores: {}, mastered: [], streak: 0, lastStudyDay: '' }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(p: ProgressState): void {
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function touchStreak(p: ProgressState): ProgressState {
  const today = todayKey()
  if (p.lastStudyDay === today) return p
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yKey = yesterday.toISOString().slice(0, 10)
  const streak = p.lastStudyDay === yKey ? p.streak + 1 : 1
  return { ...p, streak, lastStudyDay: today }
}

/** SM-2 inspired scheduling */
export function reviewCard(state: CardState | undefined, grade: 0 | 1 | 2 | 3): CardState {
  const now = Date.now()
  let ease = state?.ease ?? 2.5
  let interval = state?.interval ?? 0
  let reps = state?.reps ?? 0
  let lapses = state?.lapses ?? 0

  if (grade < 2) {
    reps = 0
    lapses += 1
    interval = 0
    ease = Math.max(1.3, ease - 0.2)
    return { ease, interval, reps, lapses, due: now + 10 * 60 * 1000 }
  }

  if (reps === 0) interval = 1
  else if (reps === 1) interval = 3
  else interval = Math.round(interval * ease)

  ease = Math.max(1.3, ease + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02)))
  reps += 1
  return { ease, interval, reps, lapses, due: now + interval * 24 * 60 * 60 * 1000 }
}

export function isDue(state: CardState | undefined): boolean {
  if (!state) return true
  return state.due <= Date.now()
}
