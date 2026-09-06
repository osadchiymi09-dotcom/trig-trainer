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
    const merged = { ...defaultProgress(), ...existing.progress }
    merged.deriveDone = existing.progress.deriveDone ?? {}
    merged.mastered = existing.progress.mastered ?? []
    merged.cards = existing.progress.cards ?? {}
    return { login, isNew: false, progress: merged }
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

export function computeMasteryPercent(progress: ProgressState, formulaCount: number): number {
  if (formulaCount <= 0) return 0
  const known = progress.mastered.length
  const derived = Object.keys(progress.deriveDone ?? {}).length
  return Math.round(Math.min(100, ((known + derived) / (formulaCount * 2)) * 100))
}
