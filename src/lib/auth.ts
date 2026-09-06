import type { ProgressState } from '../types'
import { defaultProgress } from './progress'

const USERS_KEY = 'trig-trainer-users-v1'
const SESSION_KEY = 'trig-trainer-session-v1'

export type UserRecord = {
  login: string
  createdAt: string
  updatedAt: string
  progress: ProgressState
}

export type UserDatabase = {
  users: Record<string, UserRecord>
}

function normalizeLogin(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, '_')
}

export function loadDatabase(): UserDatabase {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return { users: {} }
    const parsed = JSON.parse(raw) as UserDatabase
    return { users: parsed.users ?? {} }
  } catch {
    return { users: {} }
  }
}

function saveDatabase(db: UserDatabase): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(db))
}

export function listLogins(): string[] {
  return Object.keys(loadDatabase().users).sort()
}

export function getSessionLogin(): string | null {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

/** Login or register. First time → progress 0%. */
export function loginOrRegister(rawLogin: string): { login: string; isNew: boolean; progress: ProgressState } {
  const login = normalizeLogin(rawLogin)
  if (!login || login.length < 2) {
    throw new Error('Логин слишком короткий (минимум 2 символа)')
  }
  if (!/^[a-z0-9а-яё._-]+$/i.test(login)) {
    throw new Error('Только буквы, цифры, точка, _ и -')
  }

  const db = loadDatabase()
  const existing = db.users[login]
  if (existing) {
    localStorage.setItem(SESSION_KEY, login)
    return { login, isNew: false, progress: { ...defaultProgress(), ...existing.progress } }
  }

  const now = new Date().toISOString()
  const progress = defaultProgress()
  db.users[login] = { login, createdAt: now, updatedAt: now, progress }
  saveDatabase(db)
  localStorage.setItem(SESSION_KEY, login)
  return { login, isNew: true, progress }
}

export function saveUserProgress(login: string, progress: ProgressState): void {
  const key = normalizeLogin(login)
  const db = loadDatabase()
  const user = db.users[key]
  if (!user) return
  db.users[key] = {
    ...user,
    updatedAt: new Date().toISOString(),
    progress,
  }
  saveDatabase(db)
}

export function computeMasteryPercent(progress: ProgressState, topicCount: number): number {
  if (topicCount <= 0) return 0
  const quizVals = Object.values(progress.quizScores)
  if (!quizVals.length && !progress.mastered.length) {
    const reviewed = Object.keys(progress.cards).length
    // rough early signal from cards alone
    return Math.min(100, Math.round((reviewed / Math.max(topicCount * 8, 1)) * 100))
  }
  const mastered = progress.mastered.length
  const avgBest =
    quizVals.length > 0
      ? quizVals.reduce((s, q) => s + q.best, 0) / quizVals.length
      : 0
  // blend mastered topics and average best quiz scores
  const byMastered = (mastered / topicCount) * 100
  return Math.round(Math.min(100, byMastered * 0.55 + avgBest * 0.45))
}
