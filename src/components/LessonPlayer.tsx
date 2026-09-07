import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MathText } from './MathText'
import type { Lesson } from '../data/lessons'
import { norm, shuffle } from '../lib/progress'

type Phase = 'see' | 'order' | 'blank' | 'check'

export function LessonPlayer({
  lesson,
  onComplete,
  onBack,
}: {
  lesson: Lesson
  onComplete: () => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<Phase>('see')
  const [orderPool, setOrderPool] = useState(() => shuffle(lesson.proof.map((p) => p.id)))
  const [built, setBuilt] = useState<string[]>([])
  const [blankVal, setBlankVal] = useState('')
  const [blankOk, setBlankOk] = useState<boolean | null>(null)
  const [checkI, setCheckI] = useState(0)
  const [checkVal, setCheckVal] = useState('')
  const [checkOk, setCheckOk] = useState<boolean | null>(null)
  const [checkScore, setCheckScore] = useState(0)

  const byId = useMemo(() => {
    const m = new Map(lesson.proof.map((p) => [p.id, p]))
    return m
  }, [lesson])

  const blankStep = lesson.proof.find((p) => p.blank)

  const resetOrder = () => {
    setOrderPool(shuffle(lesson.proof.map((p) => p.id)))
    setBuilt([])
  }

  const pick = (id: string) => {
    setOrderPool((p) => p.filter((x) => x !== id))
    setBuilt((b) => [...b, id])
  }

  const orderCorrect =
    built.length === lesson.proof.length &&
    built.every((id, i) => id === lesson.proof[i].id)

  const submitBlank = () => {
    if (!blankStep?.blank) {
      setPhase('check')
      return
    }
    const ok = norm(blankVal) === norm(blankStep.blank) || norm(blankStep.blank).includes(norm(blankVal))
    setBlankOk(ok)
    if (ok) setTimeout(() => setPhase('check'), 400)
  }

  const submitCheck = () => {
    const item = lesson.checks[checkI]
    const ok =
      norm(checkVal) === norm(item.a) ||
      (norm(checkVal).length >= 3 && norm(item.a).includes(norm(checkVal)))
    setCheckOk(ok)
    const nextScore = checkScore + (ok ? 1 : 0)
    if (ok) setCheckScore(nextScore)

    window.setTimeout(() => {
      const last = checkI + 1 >= lesson.checks.length
      if (!last) {
        setCheckI((i) => i + 1)
        setCheckVal('')
        setCheckOk(null)
        return
      }
      const finalScore = nextScore
      const need = Math.max(1, Math.ceil(lesson.checks.length * 0.7))
      if (finalScore >= need) onComplete()
      else {
        setCheckI(0)
        setCheckVal('')
        setCheckOk(null)
        setCheckScore(0)
        setPhase('see')
      }
    }, 550)
  }

  return (
    <div className="lesson">
      <button type="button" className="back" onClick={onBack}>
        ← К пути
      </button>

      <p className="chapter">{lesson.chapter}</p>
      <h1>{lesson.title}</h1>

      <nav className="phases" aria-label="Этапы">
        {(
          [
            ['see', '1. Формула'],
            ['order', '2. Порядок'],
            ['blank', '3. Ключ'],
            ['check', '4. Проверка'],
          ] as const
        ).map(([id, label]) => (
          <span key={id} className={phase === id ? 'phase on' : 'phase'}>
            {label}
          </span>
        ))}
      </nav>

      {phase === 'see' && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="formula-hero">
            <MathText text={lesson.formula} />
          </div>
          <p className="premise">{lesson.premise}</p>
          <ol className="proof-read">
            {lesson.proof.map((s) => (
              <li key={s.id}>
                <MathText text={s.text} />
              </li>
            ))}
          </ol>
          <button type="button" className="btn" onClick={() => { resetOrder(); setPhase('order') }}>
            Дальше: собрать вывод
          </button>
        </motion.section>
      )}

      {phase === 'order' && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="hint">Расставь шаги вывода в правильном порядке — жми по очереди.</p>
          <div className="built">
            {built.length === 0 && <p className="empty">Пока пусто</p>}
            {built.map((id, i) => (
              <div key={`${id}-${i}`} className="step-card locked">
                <span className="n">{i + 1}</span>
                <MathText text={byId.get(id)!.text} />
              </div>
            ))}
          </div>
          <div className="pool">
            {orderPool.map((id) => (
              <button key={id} type="button" className="step-card" onClick={() => pick(id)}>
                <MathText text={byId.get(id)!.text} />
              </button>
            ))}
          </div>
          <div className="row">
            <button type="button" className="btn ghost" onClick={resetOrder}>
              Сбросить
            </button>
            <button
              type="button"
              className="btn"
              disabled={!orderCorrect}
              onClick={() => {
                setBlankVal('')
                setBlankOk(null)
                setPhase(blankStep ? 'blank' : 'check')
              }}
            >
              {orderCorrect ? 'Верно — дальше' : 'Собери все шаги'}
            </button>
          </div>
        </motion.section>
      )}

      {phase === 'blank' && blankStep && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="hint">Допиши ключевой фрагмент вывода.</p>
          <div className="step-card locked">
            <MathText text={blankStep.text} />
          </div>
          <label className="field">
            <span>Ответ (можно без \$ и с пробелами)</span>
            <input
              value={blankVal}
              onChange={(e) => {
                setBlankVal(e.target.value)
                setBlankOk(null)
              }}
              placeholder="например: 2sinα cosα"
              autoFocus
            />
          </label>
          {blankOk === false && <p className="err">Не то. Подсказка в шаге выше — перечитай.</p>}
          {blankOk === true && <p className="ok">Есть.</p>}
          <button type="button" className="btn" onClick={submitBlank}>
            Проверить
          </button>
        </motion.section>
      )}

      {phase === 'check' && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="hint">
            Проверка {checkI + 1}/{lesson.checks.length}
          </p>
          <h2 className="q">
            <MathText text={lesson.checks[checkI].q} />
          </h2>
          <label className="field">
            <span>Ответ</span>
            <input
              value={checkVal}
              onChange={(e) => {
                setCheckVal(e.target.value)
                setCheckOk(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && submitCheck()}
              autoFocus
            />
          </label>
          {checkOk === false && (
            <p className="err">
              Нужно примерно: <MathText text={`$${lesson.checks[checkI].a}$`} />
            </p>
          )}
          {checkOk === true && <p className="ok">Ок</p>}
          <button type="button" className="btn" onClick={submitCheck}>
            Ответить
          </button>
        </motion.section>
      )}
    </div>
  )
}
