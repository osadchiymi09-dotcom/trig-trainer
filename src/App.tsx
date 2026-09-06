import { useEffect, useMemo, useState } from 'react'
import { LoginScreen } from './components/LoginScreen'
import { DeriveWalkthrough, FormulaDrill, FormulaPage } from './components/Study'
import { MathText } from './components/MathText'
import {
  clearSession,
  computeMasteryPercent,
  getSessionLogin,
  loginOrRegister,
  saveUserProgress,
} from './lib/auth'
import { isDue, reviewCard, touchStreak } from './lib/progress'
import { groupBySection, useFormulas } from './lib/useContent'
import type { Formula, ProgressState } from './types'
import './App.css'

type View =
  | { name: 'list' }
  | { name: 'formula'; id: string }
  | { name: 'derive'; id: string }
  | { name: 'drill'; filter: 'all' | 'due' | 'section'; section?: string }

export default function App() {
  const { formulas, loading, error } = useFormulas()
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
  const [view, setView] = useState<View>({ name: 'list' })
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!user || !progress) return
    saveUserProgress(user, progress)
  }, [user, progress])

  const sections = useMemo(() => groupBySection(formulas), [formulas])
  const byId = useMemo(() => {
    const m = new Map<string, Formula>()
    for (const f of formulas) m.set(f.id, f)
    return m
  }, [formulas])

  const mastery = progress ? computeMasteryPercent(progress, formulas.length) : 0
  const knownN = progress?.mastered.length ?? 0
  const dueN = progress
    ? formulas.filter((f) => isDue(progress.cards[f.id])).length
    : 0

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    const out: Record<string, Formula[]> = {}
    for (const [sec, list] of Object.entries(sections)) {
      const hit = list.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.formula.toLowerCase().includes(q) ||
          f.section.toLowerCase().includes(q),
      )
      if (hit.length) out[sec] = hit
    }
    return out
  }, [sections, query])

  const patch = (fn: (p: ProgressState) => ProgressState) => {
    setProgress((p) => (p ? touchStreak(fn(p)) : p))
  }

  const logout = () => {
    clearSession()
    setUser(null)
    setProgress(null)
    setView({ name: 'list' })
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

  const current =
    view.name === 'formula' || view.name === 'derive' ? byId.get(view.id) : undefined

  if (view.name === 'formula' && current) {
    return (
      <div className="app">
        <FormulaPage
          formula={current}
          known={progress.mastered.includes(current.id)}
          derivedCount={progress.deriveDone[current.id] ?? 0}
          onBack={() => setView({ name: 'list' })}
          onToggleKnown={() =>
            patch((p) => {
              const set = new Set(p.mastered)
              if (set.has(current.id)) set.delete(current.id)
              else set.add(current.id)
              return { ...p, mastered: [...set] }
            })
          }
          onStudyDerive={() => setView({ name: 'derive', id: current.id })}
        />
      </div>
    )
  }

  if (view.name === 'derive' && current) {
    return (
      <div className="app">
        <header className="topbar">
          <button type="button" className="back" onClick={() => setView({ name: 'formula', id: current.id })}>
            ← К формуле
          </button>
          <div className="user-pill">
            <span>{user}</span>
          </div>
        </header>
        <DeriveWalkthrough
          formula={current}
          onDone={() => {
            patch((p) => ({
              ...p,
              deriveDone: {
                ...p.deriveDone,
                [current.id]: (p.deriveDone[current.id] ?? 0) + 1,
              },
            }))
            // go to next formula in same section if any
            const list = sections[current.section] ?? []
            const idx = list.findIndex((f) => f.id === current.id)
            const next = list[idx + 1]
            if (next) setView({ name: 'derive', id: next.id })
            else setView({ name: 'formula', id: current.id })
          }}
        />
      </div>
    )
  }

  if (view.name === 'drill') {
    let pool = formulas
    if (view.filter === 'due') pool = formulas.filter((f) => isDue(progress.cards[f.id]))
    if (view.filter === 'section' && view.section) {
      pool = formulas.filter((f) => f.section === view.section)
    }
    return (
      <div className="app">
        <header className="topbar">
          <button type="button" className="back" onClick={() => setView({ name: 'list' })}>
            ← Список
          </button>
          <div className="topbar-title">
            <h1>Тренировка</h1>
          </div>
          <div className="user-pill">
            <span>{user}</span>
          </div>
        </header>
        <main className="stage">
          <FormulaDrill
            items={pool}
            onGrade={(id, grade) =>
              patch((p) => {
                const cards = {
                  ...p.cards,
                  [id]: reviewCard(p.cards[id], grade),
                }
                const mastered = new Set(p.mastered)
                if (grade === 3) mastered.add(id)
                if (grade === 0) mastered.delete(id)
                return { ...p, cards, mastered: [...mastered] }
              })
            }
          />
        </main>
      </div>
    )
  }

  return (
    <div className="app home">
      <header className="hero">
        <div className="hero-top">
          <p className="brand">Тригонометрия</p>
          <div className="user-pill">
            <span>{user}</span>
            <strong>{mastery}%</strong>
            <button type="button" className="linkish" onClick={logout}>
              Выйти
            </button>
          </div>
        </div>
        <h1>Список формул и выводов</h1>
        <p className="hero-sub">
          Открой формулу → прочитай вывод → отметь «знаю» или пройди шаги. Потом гоняй
          карточками.
        </p>
        <div className="stats">
          <div>
            <strong>{formulas.length}</strong>
            <span>формул</span>
          </div>
          <div>
            <strong>{knownN}</strong>
            <span>знаю</span>
          </div>
          <div>
            <strong>{dueN}</strong>
            <span>к повтору</span>
          </div>
          <div>
            <strong>{progress.streak}</strong>
            <span>дней</span>
          </div>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn" onClick={() => setView({ name: 'drill', filter: 'due' })}>
            Повторить ({dueN})
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={() => setView({ name: 'drill', filter: 'all' })}
          >
            Тренировать все
          </button>
        </div>
      </header>

      <div className="toolbar">
        <input
          className="search"
          placeholder="Найти формулу…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="sections">
        {Object.entries(filteredSections).map(([section, list]) => (
          <section key={section} className="section">
            <div className="section-head">
              <h2>{section}</h2>
              <button
                type="button"
                className="linkish"
                onClick={() => setView({ name: 'drill', filter: 'section', section })}
              >
                Учить раздел
              </button>
            </div>
            <ul className="formula-list">
              {list.map((f) => {
                const known = progress.mastered.includes(f.id)
                const derived = (progress.deriveDone[f.id] ?? 0) > 0
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      className="formula-row"
                      onClick={() => setView({ name: 'formula', id: f.id })}
                    >
                      <span className="formula-row-title">
                        {f.title}
                        <span className="marks">
                          {known ? ' · знаю' : ''}
                          {derived ? ' · вывод' : ''}
                        </span>
                      </span>
                      <span className="formula-row-math">
                        <MathText text={f.formula} />
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
