import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MathText } from './MathText'
import type { Formula } from '../types'
import { shuffle } from '../lib/session'

export function FormulaSheet({
  formula,
  parents,
  onClose,
  onDerive,
  onToggleKnown,
  known,
  derived,
}: {
  formula: Formula
  parents: Formula[]
  onClose: () => void
  onDerive: () => void
  onToggleKnown: () => void
  known: boolean
  derived: boolean
}) {
  return (
    <motion.div
      className="sheet"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <button type="button" className="ghost" onClick={onClose}>
        ← Назад
      </button>
      <p className="eyebrow">
        {formula.mother ? 'Материнская' : formula.family}
        {derived ? ' · вывод разобран' : ''}
      </p>
      <h1>{formula.title}</h1>
      <div className="big-formula">
        <MathText text={formula.formula} />
      </div>
      {formula.tip && <p className="muted">{formula.tip}</p>}

      {parents.length > 0 && (
        <div className="from-row">
          <span>Выводится из</span>
          {parents.map((p) => (
            <span key={p.id} className="pill">
              {p.title}
            </span>
          ))}
        </div>
      )}

      <div className="sheet-actions">
        <button type="button" className="btn primary" onClick={onDerive}>
          Разобрать вывод
        </button>
        <button type="button" className={known ? 'btn known' : 'btn'} onClick={onToggleKnown}>
          {known ? 'Знаю ✓' : 'Отметить «знаю»'}
        </button>
      </div>

      <h2 className="subhead">Вывод целиком</h2>
      <ol className="steps">
        {formula.steps.map((s, i) => (
          <li key={i}>
            <MathText text={s} />
          </li>
        ))}
      </ol>
    </motion.div>
  )
}

export function DeriveFlow({
  formula,
  onDone,
  onBack,
}: {
  formula: Formula
  onDone: () => void
  onBack: () => void
}) {
  const [step, setStep] = useState(0)
  useEffect(() => setStep(0), [formula.id])
  const finished = step >= formula.steps.length

  return (
    <div className="sheet">
      <button type="button" className="ghost" onClick={onBack}>
        ← К формуле
      </button>
      <p className="eyebrow">Вывод по шагам</p>
      <h1>{formula.title}</h1>
      <div className="big-formula soft">
        <MathText text={formula.formula} />
      </div>
      <p className="muted">Сначала попробуй сам — потом открывай шаг.</p>

      <ol className="steps">
        <AnimatePresence initial={false}>
          {formula.steps.slice(0, step).map((s, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
            >
              <MathText text={s} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      {!finished ? (
        <button type="button" className="btn primary" onClick={() => setStep((s) => s + 1)}>
          Шаг {step + 1} из {formula.steps.length}
        </button>
      ) : (
        <button type="button" className="btn primary" onClick={onDone}>
          Вывод понял
        </button>
      )}
    </div>
  )
}

export function Drill({
  pool,
  onGrade,
  onExit,
}: {
  pool: Formula[]
  onGrade: (id: string, ok: boolean) => void
  onExit: () => void
}) {
  const [deck, setDeck] = useState(() => shuffle(pool))
  const [i, setI] = useState(0)
  const [mode, setMode] = useState<'formula' | 'proof'>('formula')
  const [show, setShow] = useState(false)

  useEffect(() => {
    setDeck(shuffle(pool))
    setI(0)
    setShow(false)
  }, [pool])

  const f = deck[i]
  if (!f) {
    return (
      <div className="sheet">
        <p>Нечего тренировать.</p>
        <button type="button" className="btn" onClick={onExit}>
          Назад
        </button>
      </div>
    )
  }

  const advance = (ok: boolean) => {
    onGrade(f.id, ok)
    setShow(false)
    setI((x) => (x + 1) % deck.length)
  }

  return (
    <div className="sheet">
      <div className="drill-top">
        <button type="button" className="ghost" onClick={onExit}>
          ← Выйти
        </button>
        <div className="mode-switch">
          <button
            type="button"
            className={mode === 'formula' ? 'pill on' : 'pill'}
            onClick={() => {
              setMode('formula')
              setShow(false)
            }}
          >
            Формула
          </button>
          <button
            type="button"
            className={mode === 'proof' ? 'pill on' : 'pill'}
            onClick={() => {
              setMode('proof')
              setShow(false)
            }}
          >
            Вывод
          </button>
        </div>
      </div>

      <p className="eyebrow">
        {i + 1}/{deck.length} · {f.family}
      </p>
      <h1>{f.title}</h1>

      {mode === 'formula' ? (
        show ? (
          <div className="big-formula">
            <MathText text={f.formula} />
          </div>
        ) : (
          <p className="prompt">Вспомни формулу целиком</p>
        )
      ) : (
        <>
          <div className="big-formula soft">
            <MathText text={f.formula} />
          </div>
          {show ? (
            <ol className="steps">
              {f.steps.map((s, idx) => (
                <li key={idx}>
                  <MathText text={s} />
                </li>
              ))}
            </ol>
          ) : (
            <p className="prompt">Как вывести? Из чего и какими шагами?</p>
          )}
        </>
      )}

      {!show ? (
        <button type="button" className="btn primary" onClick={() => setShow(true)}>
          Показать
        </button>
      ) : (
        <div className="grade-pair">
          <button type="button" className="btn bad" onClick={() => advance(false)}>
            Забыл
          </button>
          <button type="button" className="btn good" onClick={() => advance(true)}>
            Знал
          </button>
        </div>
      )}
    </div>
  )
}
