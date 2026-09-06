export type ConspectBlock = {
  heading: string
  bullets: string[]
}

export type Flashcard = {
  id: string
  front: string
  back: string
  hint?: string
}

export type QuizItem = {
  id: string
  question: string
  options: string[]
  correct: number
  explain: string
}

export type ClozeItem = {
  id: string
  text: string // use [[answer]] markers
  hint?: string
}

export type DeriveItem = {
  id: string
  prompt: string
  formula: string
  steps: string[]
}

export type Topic = {
  id: string
  code: string
  title: string
  section: string
  bookPages: string
  why: string
  conspect: ConspectBlock[]
  flashcards: Flashcard[]
  quiz: QuizItem[]
  cloze: ClozeItem[]
  recall: string[]
  mnemonics: string[]
  diagrams?: string[]
  derive?: DeriveItem[]
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
  quizScores: Record<string, { best: number; last: number; attempts: number }>
  mastered: string[]
  streak: number
  lastStudyDay: string
}
