import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LessonPlayer } from './components/LessonPlayer'
import { MathText } from './components/MathText'
import { CHAPTERS, lessons } from './data/lessons'
import {
  isUnlocked,
  loadProgress,
  markDone,
  saveProgress,
  type Progress,
} from './lib/progress'
import './App.css'

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [lessonId, setLessonId] = useState<string | null>(null)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const doneSet = useMemo(() => new Set(progress.done), [progress.done])
  const pct = Math.round((progress.done.length / lessons.length) * 100)
  const current = lessons.find((l) => l.id === lessonId)

  if (lessonId && current) {
    return (
      <div className="shell">
        <LessonPlayer
          lesson={current}
          onBack={() => setLessonId(null)}
          onComplete={() => {
            setProgress((p) => markDone(current.id, p))
            const idx = lessons.findIndex((l) => l.id === current.id)
            const next = lessons[idx + 1]
            if (next) setLessonId(next.id)
            else setLessonId(null)
          }}
        />
      </div>
    )
  }

  if (!entered) {
    return (
      <div className="gate">
        <motion.div
          className="gate-inner"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="logo">Путь</p>
          <h1>Тригонометрия: формулы через вывод</h1>
          <p className="sub">
            Не справочник. По одному уроку: читаешь вывод → собираешь шаги сам →
            отвечаешь. Старт с доказательства cos(α−β).
          </p>
          <button type="button" className="btn" onClick={() => setEntered(true)}>
            Начать путь
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="shell">
      <header className="path-head">
        <div>
          <p className="logo sm">Путь</p>
          <p className="meta">
            {progress.done.length}/{lessons.length} · {pct}%
          </p>
        </div>
        <div className="bar" aria-hidden>
          <i style={{ width: `${pct}%` }} />
        </div>
      </header>

      {CHAPTERS.map((ch) => {
        const items = lessons.filter((l) => l.chapter === ch)
        return (
          <section key={ch} className="chapter-block">
            <h2>{ch}</h2>
            <ul className="path-list">
              {items.map((l, i) => {
                const unlocked = isUnlocked(l, progress.done)
                const done = doneSet.has(l.id)
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      className={`node ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                      disabled={!unlocked}
                      onClick={() => setLessonId(l.id)}
                    >
                      <span className="idx">{done ? '✓' : i + 1}</span>
                      <span className="node-body">
                        <strong>{l.title}</strong>
                        <span className="node-f">
                          <MathText text={l.formula} />
                        </span>
                      </span>
                      <span className="go">{unlocked ? (done ? 'ещё раз' : 'урок') : '🔒'}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
