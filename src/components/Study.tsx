import { useEffect, useState } from 'react'
import { MathText } from './MathText'
import type { Formula } from '../types'
import { shuffle } from '../lib/session'

/** Card: show name → recall formula; or show formula → recall derivation idea */
export function FormulaDrill({
  items,
  onGrade,
}: {
  items: Formula[]
  onGrade: (id: string, grade: 0 | 1 | 2 | 3) => void
}) {
  const [deck, setDeck] = useState(() => shuffle(items))
  const [i, setI] = useState(0)
  const [side, setSide] = useState<'ask' | 'answer'>('ask')
  const [mode, setMode] = useState<'formula' | 'steps'>('formula')

  useEffect(() => {
    setDeck(shuffle(items))
    setI(0)
    setSide('ask')
  }, [items])

  const f = deck[i]
  if (!f) return <p>Нет формул для тренировки.</p>

  const next = (grade: 0 | 1 | 2 | 3) => {
    onGrade(f.id, grade)
    setSide('ask')
    setI((x) => (x + 1) % deck.length)
  }

  return (
    <div className="mode drill">
      <div className="drill-toolbar">
        <button
          type="button"
          className={mode === 'formula' ? 'chip active' : 'chip'}
          onClick={() => {
            setMode('formula')
            setSide('ask')
          }}
        >
          Запомнить формулу
        </button>
        <button
          type="button"
          className={mode === 'steps' ? 'chip active' : 'chip'}
          onClick={() => {
            setMode('steps')
            setSide('ask')
          }}
        >
          Вспомнить вывод
        </button>
        <button
          type="button"
          className="linkish"
          onClick={() => {
            setDeck(shuffle(items))
            setI(0)
            setSide('ask')
          }}
        >
          Перемешать
        </button>
      </div>

      <p className="meta">
        {i + 1} / {deck.length} · {f.section}
      </p>
      <h2 className="drill-title">{f.title}</h2>

      {mode === 'formula' ? (
        side === 'ask' ? (
          <p className="lede">Напиши / скажи формулу по памяти, потом открой.</p>
        ) : (
          <div className="formula-box">
            <MathText text={f.formula} />
          </div>
        )
      ) : side === 'ask' ? (
        <>
          <div className="formula-box dim">
            <MathText text={f.formula} />
          </div>
          <p className="lede">Вслух: из чего это выводится? Какие шаги?</p>
        </>
      ) : (
        <ol className="derive-steps">
          {f.steps.map((s, idx) => (
            <li key={idx}>
              <MathText text={s} />
            </li>
          ))}
        </ol>
      )}

      {side === 'ask' ? (
        <button type="button" className="btn" onClick={() => setSide('answer')}>
          Показать ответ
        </button>
      ) : (
        <div className="grade-row">
          <button type="button" className="grade bad" onClick={() => next(0)}>
            Не знал
          </button>
          <button type="button" className="grade mid" onClick={() => next(2)}>
            С трудом
          </button>
          <button type="button" className="grade good" onClick={() => next(3)}>
            Знал
          </button>
        </div>
      )}
    </div>
  )
}

/** Step-by-step: open derivation one line at a time, then mark done */
export function DeriveWalkthrough({
  formula,
  onDone,
}: {
  formula: Formula
  onDone: () => void
}) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    setStep(0)
  }, [formula.id])

  const done = step >= formula.steps.length

  return (
    <div className="mode derive">
      <h2 className="drill-title">{formula.title}</h2>
      <div className="formula-box">
        <MathText text={formula.formula} />
      </div>
      <p className="hint">Сначала попробуй вывести сам — потом открывай шаги.</p>
      <ol className="derive-steps">
        {formula.steps.slice(0, step).map((s, idx) => (
          <li key={idx}>
            <MathText text={s} />
          </li>
        ))}
      </ol>
      {!done ? (
        <button type="button" className="btn" onClick={() => setStep((s) => s + 1)}>
          Шаг {step + 1} / {formula.steps.length}
        </button>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={() => {
            onDone()
            setStep(0)
          }}
        >
          Вывод разобрал — дальше
        </button>
      )}
    </div>
  )
}

export function FormulaPage({
  formula,
  known,
  derivedCount,
  onToggleKnown,
  onStudyDerive,
  onBack,
}: {
  formula: Formula
  known: boolean
  derivedCount: number
  onToggleKnown: () => void
  onStudyDerive: () => void
  onBack: () => void
}) {
  const [openSteps, setOpenSteps] = useState(true)

  return (
    <div className="mode formula-page">
      <button type="button" className="back" onClick={onBack}>
        ← К списку
      </button>
      <p className="meta">{formula.section}</p>
      <h1>{formula.title}</h1>
      <div className="formula-box hero-formula">
        <MathText text={formula.formula} />
      </div>
      {formula.tip && <p className="tip-line">{formula.tip}</p>}

      <div className="formula-actions">
        <button type="button" className={known ? 'chip active' : 'chip'} onClick={onToggleKnown}>
          {known ? '✓ Знаю формулу' : 'Отметить: знаю формулу'}
        </button>
        <button type="button" className="btn" onClick={onStudyDerive}>
          Учить вывод по шагам
        </button>
      </div>
      {derivedCount > 0 && <p className="meta">Вывод разобран: {derivedCount}×</p>}

      <section className="conspect-block">
        <button
          type="button"
          className="conspect-toggle"
          onClick={() => setOpenSteps((v) => !v)}
        >
          <span>Вывод</span>
          <span aria-hidden>{openSteps ? '−' : '+'}</span>
        </button>
        {openSteps && (
          <ol className="derive-steps">
            {formula.steps.map((s, idx) => (
              <li key={idx}>
                <MathText text={s} />
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}
