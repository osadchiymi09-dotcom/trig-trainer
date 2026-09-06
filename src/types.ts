export type Formula = {
  id: string
  section: string
  title: string
  formula: string
  steps: string[]
  tip?: string
}

export type CardState = {
  ease: number
  interval: number
  reps: number
  due: number
  lapses: number
}

/** Progress keyed by formula id */
export type ProgressState = {
  cards: Record<string, CardState>
  /** formula ids marked as known */
  mastered: string[]
  streak: number
  lastStudyDay: string
  /** optional: how many times derivation was completed */
  deriveDone: Record<string, number>
}
