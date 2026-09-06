import { useEffect, useMemo, useState } from 'react'
import {
  ClozeMode,
  ConspectMode,
  DeriveMode,
  FlashcardMode,
  QuizMode,
  RecallMode,
} from './components/Modes'
import { LoginScreen } from './components/LoginScreen'
import {
  clearSession,
  computeMasteryPercent,
  getSessionLogin,
  loginOrRegister,
  saveUserProgress,
} from './lib/auth'
import {
  isDue,
  reviewCard,
  touchStreak,
} from './lib/progress'
import { groupBySection, useContent } from './lib/useContent'
import type { ProgressState, Topic } from './types'
import './App.css'

type Mode = 'conspect' | 'derive' | 'flash' | 'quiz' | 'cloze' | 'recall'
type View = { name: 'home' } | { name: 'topic'; topicId: string; mode: Mode }

const MODES: { id: Mode; label: string; tip: string }[] = [
  { id: 'conspect', label: 'Конспект', tip: 'Формулы + теория' },
  { id: 'derive', label: 'Вывод', tip: 'Шаги доказательства' },
  { id: 'flash', label: 'Карточки', tip: 'Active recall + интервалы' },
  { id: 'quiz', label: 'Тест', tip: 'Выбор ответа' },
  { id: 'cloze', label: 'Пропуски', tip: 'Cloze deletion' },
  { id: 'recall', label: 'Вслух', tip: 'Свободный ответ' },
]

function dueCount(topic: Topic, progress: ProgressState): number {
  return topic.flashcards.filter((c) => isDue(progress.cards[c.id])).length
}

export default function App() {
  const { topics, loading, error } = useContent()
  const [user, setUser] = useState<string | null>(() => getSessionLogin())
  const [progress, setProgress] = useState<ProgressState | null>(() => {
    const login = getSessionLogin()
    if (!login) return null
    try {
      return loginOrRegister(login).progress
    } catch {
      return null
    }
  })
  const [view, setView] = useState<View>({ name: 'home' })
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!user || !progress) return
    saveUserProgress(user, progress)
  }, [user, progress])

  const sections = useMemo(() => groupBySection(topics), [topics])
  const topic = useMemo(
    () =>
      view.name === 'topic' ? topics.find((t) => t.id === view.topicId) : undefined,
    [view, topics],
  )

  const totalCards = topics.reduce((n, t) => n + t.flashcards.length, 0)
  const dueTotal = progress
    ? topics.reduce((n, t) => n + dueCount(t, progress), 0)
    : 0
  const mastered = progress?.mastered.length ?? 0
  const mastery = progress ? computeMasteryPercent(progress, topics.length) : 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    const out: Record<string, Topic[]> = {}
    for (const [sec, list] of Object.entries(sections)) {
      const hit = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.code.includes(q) ||
          t.why.toLowerCase().includes(q),
      )
      if (hit.length) out[sec] = hit
    }
    return out
  }, [sections, query])

  const patchProgress = (fn: (p: ProgressState) => ProgressState) => {
    setProgress((p) => (p ? touchStreak(fn(p)) : p))
  }

  const logout = () => {
    clearSession()
    setUser(null)
    setProgress(null)
    setView({ name: 'home' })
  }

  if (loading) return <div className="boot">Загрузка формул…</div>
  if (error) return <div className="boot error">{error}</div>

  if (!user || !progress) {
    return (
      <LoginScreen
        onSuccess={(login, p) => {
          setUser(login)
          setProgress(p)
        }}
      />
    )
  }

  if (view.name === 'topic' && topic) {
    return (
      <div className="app">
        <header className="topbar">
          <button type="button" className="back" onClick={() => setView({ name: 'home' })}>
            ← Темы
          </button>
          <div className="topbar-title">
            <span className="code">{topic.code}</span>
            <h1>{topic.title}</h1>
          </div>
          <div className="user-pill">
            <span>{user}</span>
            <button type="button" className="linkish" onClick={logout}>
              Выйти
            </button>
          </div>
        </header>

        <nav className="mode-nav" aria-label="Режимы">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={view.mode === m.id ? 'active' : ''}
              onClick={() => setView({ name: 'topic', topicId: topic.id, mode: m.id })}
              title={m.tip}
            >
              {m.label}
            </button>
          ))}
        </nav>

        <main className="stage">
          {view.mode === 'conspect' && <ConspectMode topic={topic} />}
          {view.mode === 'derive' && <DeriveMode topic={topic} />}
          {view.mode === 'flash' && (
            <FlashcardMode
              topic={topic}
              getGrade={(cardId, grade) =>
                patchProgress((p) => ({
                  ...p,
                  cards: {
                    ...p.cards,
                    [cardId]: reviewCard(p.cards[cardId], grade),
                  },
                }))
              }
            />
          )}
          {view.mode === 'quiz' && (
            <QuizMode
              topic={topic}
              onFinish={(score) =>
                patchProgress((p) => {
                  const prev = p.quizScores[topic.id]
                  const masteredSet = new Set(p.mastered)
                  if (score >= 80) masteredSet.add(topic.id)
                  return {
                    ...p,
                    quizScores: {
                      ...p.quizScores,
                      [topic.id]: {
                        best: Math.max(prev?.best ?? 0, score),
                        last: score,
                        attempts: (prev?.attempts ?? 0) + 1,
                      },
                    },
                    mastered: [...masteredSet],
                  }
                })
              }
            />
          )}
          {view.mode === 'cloze' && <ClozeMode topic={topic} />}
          {view.mode === 'recall' && <RecallMode topic={topic} />}
        </main>
      </div>
    )
  }

  return (
    <div className="app home">
      <header className="hero">
        <div className="hero-top">
          <p className="brand">Тригонометрия · формулы и выводы</p>
          <div className="user-pill">
            <span>{user}</span>
            <strong>{mastery}%</strong>
            <button type="button" className="linkish" onClick={logout}>
              Выйти
            </button>
          </div>
        </div>
        <h1>Тренажёр формул</h1>
        <p className="hero-sub">
          Не только заучить, но и вывести: конспект, пошаговые доказательства, карточки и
          тесты. Прогресс привязан к логину <strong>{user}</strong>.
        </p>
        <div className="stats">
          <div>
            <strong>{topics.length}</strong>
            <span>тем</span>
          </div>
          <div>
            <strong>{dueTotal}</strong>
            <span>карточек к повтору</span>
          </div>
          <div>
            <strong>{mastered}</strong>
            <span>тем ≥80%</span>
          </div>
          <div>
            <strong>{progress.streak}</strong>
            <span>дней подряд</span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Поиск темы…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="toolbar-note">{totalCards} карточек в базе</p>
      </div>

      <div className="sections">
        {Object.entries(filtered).map(([section, list]) => (
          <section key={section} className="section">
            <h2>{section}</h2>
            <ul className="topic-list">
              {list.map((t) => {
                const due = dueCount(t, progress)
                const score = progress.quizScores[t.id]
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      className="topic-row"
                      onClick={() =>
                        setView({ name: 'topic', topicId: t.id, mode: 'conspect' })
                      }
                    >
                      <span className="topic-code">{t.code}</span>
                      <span className="topic-title">{t.title}</span>
                      <span className="topic-meta">
                        {score ? `${score.best}%` : '0%'}
                        {due > 0 ? ` · ${due} due` : ''}
                        {(t.derive?.length ?? 0) > 0 ? ` · ${t.derive!.length} выв.` : ''}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
