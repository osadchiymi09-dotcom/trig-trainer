import type { ClozeItem, Flashcard, QuizItem, Topic } from '../types'

function rand() {
  return Math.random()
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length))
}

function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** Shuffle options and fix correct index */
export function remixQuiz(q: QuizItem): QuizItem {
  const pairs = q.options.map((opt, i) => ({ opt, ok: i === q.correct }))
  const mixed = shuffle(pairs)
  return {
    ...q,
    options: mixed.map((p) => p.opt),
    correct: mixed.findIndex((p) => p.ok),
  }
}

function quizFromCard(card: Flashcard, pool: Flashcard[], topicId: string, i: number): QuizItem | null {
  const answer = clean(card.back)
  if (answer.length < 2 || answer.length > 80) return null
  const distractors = shuffle(
    pool
      .filter((c) => c.id !== card.id)
      .map((c) => clean(c.back))
      .filter((b) => b && b.toLowerCase() !== answer.toLowerCase()),
  ).slice(0, 3)
  if (distractors.length < 3) return null
  const options = shuffle([answer, ...distractors])
  return {
    id: `${topicId}-gen-qz-${i}-${card.id}`,
    question: card.front.endsWith('?') ? card.front : `${card.front}?`,
    options,
    correct: options.findIndex((o) => o === answer),
    explain: answer,
  }
}

function clozeFromCard(card: Flashcard, topicId: string, i: number): ClozeItem | null {
  const answer = clean(card.back)
  if (!answer || answer.length > 60) return null
  // Prefer short answers for typing
  if (answer.split(' ').length > 8) return null
  const front = clean(card.front).replace(/\?$/, '')
  return {
    id: `${topicId}-gen-cz-${i}-${card.id}`,
    text: `${front} — [[${answer}]].`,
  }
}

function clozeFromBullet(bullet: string, topicId: string, i: number): ClozeItem | null {
  // Blank a key term after em dash or before — это
  const m =
    bullet.match(/^(.{8,70}?)\s+[—–-]\s+(.{4,50})\.?$/) ||
    bullet.match(/^(.{8,60}?)\s+—\s+это\s+(.{4,55})\.?$/i)
  if (!m) return null
  const left = clean(m[1])
  const right = clean(m[2]).replace(/\.$/, '')
  if (right.split(' ').length > 6) return null
  return {
    id: `${topicId}-gen-bullet-cz-${i}`,
    text: `${left} — [[${right}]].`,
  }
}

export type PracticeSession = {
  seed: number
  quiz: QuizItem[]
  cloze: ClozeItem[]
  cards: Flashcard[]
  recall: string[]
}

export function buildSession(topic: Topic): PracticeSession {
  const seed = Date.now() + Math.floor(rand() * 1e6)

  const generatedQuiz = topic.flashcards
    .map((c, i) => quizFromCard(c, topic.flashcards, topic.id, i))
    .filter((x): x is QuizItem => Boolean(x))

  const bankQuiz = shuffle([...topic.quiz.map(remixQuiz), ...generatedQuiz.map(remixQuiz)])
  const quiz = sample(bankQuiz, Math.min(12, Math.max(8, topic.quiz.length + 3)))

  const fromCards = topic.flashcards
    .map((c, i) => clozeFromCard(c, topic.id, i))
    .filter((x): x is ClozeItem => Boolean(x))
  const fromBullets = topic.conspect
    .flatMap((b) => b.bullets)
    .map((b, i) => clozeFromBullet(b, topic.id, i))
    .filter((x): x is ClozeItem => Boolean(x))

  const bankCloze = shuffle([...topic.cloze, ...fromCards, ...fromBullets])
  // dedupe by text
  const seen = new Set<string>()
  const uniqueCloze = bankCloze.filter((c) => {
    const k = c.text.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  const cloze = sample(uniqueCloze, Math.min(10, Math.max(6, topic.cloze.length + 2)))

  const cards = shuffle(topic.flashcards)
  const recall = shuffle(topic.recall)

  return { seed, quiz, cloze, cards, recall }
}
