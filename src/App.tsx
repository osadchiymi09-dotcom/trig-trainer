import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DeriveFlow, Drill, FormulaSheet } from './components/Study'
import { MathText } from './components/MathText'
import {
  isDue,
  loadProgress,
  masteryPercent,
  reviewCard,
  saveProgress,
  touchStreak,
} from './lib/progress'
import { byFamily, useContent } from './lib/useContent'
import type { Formula, ProgressState } from './types'
import './App.css'

type View =
  | { name: 'home' }
  | { name: 'formula'; id: string }
  | { name: 'derive'; id: string }
  | { name: 'drill'; scope: 'all' | 'mothers' | 'due' | 'family'; family?: string }

export default function App() {
  const { data, loading, error } = useContent()
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [view, setView] = useState<View>({ name: 'home' })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const formulas = data?.formulas ?? []
  const order = data?.familyOrder ?? []
  const map = useMemo(() => {
    const m = new Map<string, Formula>()
    for (const f of formulas) m.set(f.id, f)
    return m
  }, [formulas])

  const groups = useMemo(() => byFamily(formulas, order), [formulas, order])
  const mothers = useMemo(() => formulas.filter((f) => f.mother), [formulas])
  const mastery = masteryPercent(progress, formulas.length)
  const dueCount = formulas.filter((f) => isDue(progress.cards[f.id])).length

  const patch = (fn: (p: ProgressState) => ProgressState) => {
    setProgress((p) => touchStreak(fn(p)))
  }

  if (loading) return <div className="boot">Собираю формулы…</div>
  if (error || !data) return <div className="boot error">{error ?? 'Нет данных'}</div>

  const current =
    view.name === 'formula' || view.name === 'derive' ? map.get(view.id) : undefined

  if (view.name === 'formula' && current) {
    const parents = current.fromIds.map((id) => map.get(id)).filter(Boolean) as Formula[]
    return (
      <div className="page">
        <FormulaSheet
          formula={current}
          parents={parents}
          known={progress.known.includes(current.id)}
          derived={progress.derived.includes(current.id)}
          onClose={() => setView({ name: 'home' })}
          onDerive={() => setView({ name: 'derive', id: current.id })}
          onToggleKnown={() =>
            patch((p) => {
              const s = new Set(p.known)
              if (s.has(current.id)) s.delete(current.id)
              else s.add(current.id)
              return { ...p, known: [...s] }
            })
          }
        />
      </div>
    )
  }

  if (view.name === 'derive' && current) {
    return (
      <div className="page">
        <DeriveFlow
          formula={current}
          onBack={() => setView({ name: 'formula', id: current.id })}
          onDone={() => {
            patch((p) => ({
              ...p,
              derived: [...new Set([...p.derived, current.id])],
            }))
            setView({ name: 'formula', id: current.id })
          }}
        />
      </div>
    )
  }

  if (view.name === 'drill') {
    let pool = formulas
    if (view.scope === 'mothers') pool = mothers
    if (view.scope === 'due') pool = formulas.filter((f) => isDue(progress.cards[f.id]))
    if (view.scope === 'family' && view.family) {
      pool = formulas.filter((f) => f.family === view.family)
    }
    return (
      <div className="page">
        <Drill
          pool={pool}
          onExit={() => setView({ name: 'home' })}
          onGrade={(id, ok) =>
            patch((p) => {
              const cards = { ...p.cards, [id]: reviewCard(p.cards[id], ok ? 3 : 0) }
              const known = new Set(p.known)
              if (ok) known.add(id)
              else known.delete(id)
              return { ...p, cards, known: [...known] }
            })
          }
        />
      </div>
    )
  }

  return (
    <div className="site">
      {!started ? (
        <section className="landing">
          <div className="landing-bg" aria-hidden />
          <motion.div
            className="landing-inner"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="brand">Материнские</p>
            <h1>Выучи формулы через вывод, а не зубрение</h1>
            <p className="lede">
              Четыре формулы сложения — база: у них свой вывод, а из них собирается всё остальное.
            </p>
            <button
              type="button"
              className="btn primary lg"
              onClick={() => setStarted(true)}
            >
              Открыть формулы
            </button>
          </motion.div>
          <motion.div
            className="orbit"
            aria-hidden
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.9 }}
          />
        </section>
      ) : (
        <main className="main">
          <header className="top">
            <div>
              <p className="brand sm">Материнские</p>
              <p className="muted compact">
                {progress.known.length} знаю · {progress.derived.length} выводов · {mastery}%
              </p>
            </div>
            <div className="top-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setView({ name: 'drill', scope: 'due' })}
              >
                Повтор ({dueCount})
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => setView({ name: 'drill', scope: 'all' })}
              >
                Тренировка
              </button>
            </div>
          </header>

          <section className="mothers-block">
            <div className="block-head">
              <h2>Материнские формулы</h2>
              <button
                type="button"
                className="ghost"
                onClick={() => setView({ name: 'drill', scope: 'mothers' })}
              >
                Учить матерей →
              </button>
            </div>
            <p className="muted">
              Сначала разбери вывод сложения (от cos(α−β)), потом гоняй дочерние формулы.
            </p>
            <div className="mother-grid">
              {mothers.map((f, idx) => (
                <motion.button
                  key={f.id}
                  type="button"
                  className="mother-tile"
                  onClick={() => setView({ name: 'formula', id: f.id })}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.4 }}
                >
                  <span className="tile-title">{f.title}</span>
                  <span className="tile-math">
                    <MathText text={f.formula} />
                  </span>
                  {(progress.known.includes(f.id) || progress.derived.includes(f.id)) && (
                    <span className="tile-mark">
                      {progress.known.includes(f.id) ? 'знаю' : ''}
                      {progress.derived.includes(f.id) ? ' · вывод' : ''}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </section>

          {groups
            .filter((g) => g.family !== mothers[0]?.family)
            .map((g) => (
              <section key={g.family} className="family-block">
                <div className="block-head">
                  <h2>{g.family}</h2>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() =>
                      setView({ name: 'drill', scope: 'family', family: g.family })
                    }
                  >
                    Учить раздел →
                  </button>
                </div>
                <ul className="formula-lines">
                  <AnimatePresence>
                    {g.items.map((f) => (
                      <li key={f.id}>
                        <button
                          type="button"
                          className="line"
                          onClick={() => setView({ name: 'formula', id: f.id })}
                        >
                          <span className="line-left">
                            <strong>{f.title}</strong>
                            {f.fromIds.length > 0 && (
                              <span className="from-mini">
                                ← {f.fromIds.map((id) => map.get(id)?.title).filter(Boolean).join(', ')}
                              </span>
                            )}
                          </span>
                          <span className="line-math">
                            <MathText text={f.formula} />
                          </span>
                          <span className="line-flags">
                            {progress.known.includes(f.id) ? '✓' : ''}
                            {progress.derived.includes(f.id) ? '∴' : ''}
                          </span>
                        </button>
                      </li>
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))}
        </main>
      )}
    </div>
  )
}
