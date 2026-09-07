export type Formula = {
  id: string
  family: string
  title: string
  formula: string
  steps: string[]
  mother: boolean
  fromIds: string[]
  tip?: string
}

export type ContentFile = {
  familyOrder: string[]
  formulas: Formula[]
}

export type CardState = {
  ease: number
  interval: number
  reps: number
  due: number
  lapses: number
}

export type ProgressState = {
  cards: Record<string, CardState>
  known: string[]
  derived: string[]
  streak: number
  lastStudyDay: string
}
