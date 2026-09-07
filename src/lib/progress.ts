import type { Lesson } from '../data/lessons'
import { lessons } from '../data/lessons'

export type Progress = {
  /** lesson ids fully passed (proof + check) */
  done: string[]
  /** optional free practice scores */
  updatedAt: string
}

const KEY = 'trig-path-v1'

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { done: [], updatedAt: '' }
    const p = JSON.parse(raw) as Progress
    return { done: p.done ?? [], updatedAt: p.updatedAt ?? '' }
  } catch {
    return { done: [], updatedAt: '' }
  }
}

export function saveProgress(p: Progress) {
  localStorage.setItem(KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }))
}

export function markDone(id: string, prev: Progress): Progress {
  if (prev.done.includes(id)) return prev
  return { ...prev, done: [...prev.done, id] }
}

/** Soft unlock: first always open; else previous in list done OR any earlier in same chapter */
export function isUnlocked(lesson: Lesson, done: string[]): boolean {
  const idx = lessons.findIndex((l) => l.id === lesson.id)
  if (idx <= 0) return true
  // unlock if previous lesson done
  if (done.includes(lessons[idx - 1].id)) return true
  // or if user already completed this one
  if (done.includes(lesson.id)) return true
  return false
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function norm(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\\operatorname\{([^}]+)\}/g, '$1')
    .replace(/\\/g, '')
    .replace(/[{}]/g, '')
}
