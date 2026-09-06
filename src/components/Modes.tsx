import { useEffect, useMemo, useState } from 'react'
import type { ClozeItem, DeriveItem, Flashcard, QuizItem, Topic } from '../types'
import { TopicDiagrams } from './Diagrams'
import { MathText } from './MathText'
import { buildSession } from '../lib/session'

function SessionBar({
  label,
  onRefresh,
}: {
  label: string
  onRefresh: () => void
}) {
  return (
    <div className="session-bar">
      <span>{label}</span>
      <button type="button" className="linkish" onClick={onRefresh}>
        Новая сессия
      </button>
    </div>
  )
}

export function ConspectMode({ topic }: { topic: Topic }) {
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true })

  return (
    <div className="mode conspect">
      <MathText as="p" className="lede" text={topic.why} />
      <p className="meta">Источник: {topic.bookPages}</p>

      {topic.mnemonics.length > 0 && (
        <aside className="mnemonic">
          <strong>Мнемоника</strong>
          <ul>
            {topic.mnemonics.map((m) => (
              <li key={m}>
                <MathText text={m} />
              </li>
            ))}
          </ul>
        </aside>
      )}

      <TopicDiagrams ids={topic.diagrams} />

      {topic.conspect.map((block, i) => {
        const shown = open[i]
        return (
          <section key={block.heading} className="conspect-block">
            <button
              type="button"
              className="conspect-toggle"
              onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
            >
              <span>{block.heading}</span>
              <span aria-hidden>{shown ? '−' : '+'}</span>
            </button>
            {shown && (
              <ul className="bullets">
                {block.bullets.map((b) => (
                  <li key={b}>
                    <MathText text={b} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}

export function FlashcardMode({
  topic,
  getGrade,
}: {
  topic: Topic
  getGrade: (cardId: string, grade: 0 | 1 | 2 | 3) => void
}) {
  const [deck, setDeck] = useState<Flashcard[]>(() => buildSession(topic).cards)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const refresh = () => {
    setDeck(buildSession(topic).cards)
    setI(0)
    setFlipped(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.id])

  const card = deck[i]
  if (!card) return <p>Нет карточек.</p>

  const next = (grade: 0 | 1 | 2 | 3) => {
    getGrade(card.id, grade)
    setFlipped(false)
    setI((x) => (x + 1) % deck.length)
  }

  return (
    <div className="mode flash">
      <SessionBar label={`Карточка ${i + 1} / ${deck.length} · порядок случайный`} onRefresh={refresh} />
      <button
        type="button"
        className={`flip-card ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
      >
        <span className="flip-face front">
          <MathText text={card.front} />
        </span>
        <span className="flip-face back">
          <MathText text={card.back} />
        </span>
      </button>
      <p className="hint">Нажми карточку, чтобы перевернуть</p>
      {flipped && (
        <div className="grade-row">
          <button type="button" className="grade bad" onClick={() => next(0)}>
            Снова
          </button>
          <button type="button" className="grade mid" onClick={() => next(2)}>
            Трудно
          </button>
          <button type="button" className="grade good" onClick={() => next(3)}>
            Легко
          </button>
        </div>
      )}
    </div>
  )
}

export function QuizMode({
  topic,
  onFinish,
}: {
  topic: Topic
  onFinish: (score: number) => void
}) {
  const [items, setItems] = useState<QuizItem[]>(() => buildSession(topic).quiz)
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const refresh = () => {
    setItems(buildSession(topic).quiz)
    setI(0)
    setPicked(null)
    setScore(0)
    setDone(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.id])

  const q = items[i]

  if (!q) return <p>Нет вопросов.</p>

  if (done) {
    const pct = Math.round((score / items.length) * 100)
    return (
      <div className="mode quiz result">
        <h3>
          Результат: {score}/{items.length} ({pct}%)
        </h3>
        <button type="button" className="btn" onClick={refresh}>
          Новая сессия
        </button>
      </div>
    )
  }

  const submit = () => {
    if (picked === null) return
    const ok = picked === q.correct
    const nextScore = score + (ok ? 1 : 0)
    if (i + 1 >= items.length) {
      setScore(nextScore)
      setDone(true)
      onFinish(Math.round((nextScore / items.length) * 100))
    } else {
      setScore(nextScore)
      setI(i + 1)
      setPicked(null)
    }
  }

  return (
    <div className="mode quiz">
      <SessionBar
        label={`Вопрос ${i + 1} / ${items.length} · выборка и варианты перемешаны`}
        onRefresh={refresh}
      />
      <MathText as="h3" className="q" text={q.question} />
      <div className="options">
        {q.options.map((opt, idx) => {
          let cls = 'option'
          if (picked !== null) {
            if (idx === q.correct) cls += ' correct'
            else if (idx === picked) cls += ' wrong'
          }
          return (
            <button
              key={`${q.id}-${opt}-${idx}`}
              type="button"
              className={cls}
              disabled={picked !== null}
              onClick={() => setPicked(idx)}
            >
              <MathText text={opt} />
            </button>
          )
        })}
      </div>
      {picked !== null && <MathText as="p" className="explain" text={q.explain} />}
      <button type="button" className="btn" disabled={picked === null} onClick={submit}>
        {i + 1 >= items.length ? 'Завершить' : 'Дальше'}
      </button>
    </div>
  )
}

function parseCloze(text: string): { parts: string[]; answers: string[] } {
  const answers: string[] = []
  const parts = text.split(/\[\[(.+?)\]\]/g)
  const out: string[] = []
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      answers.push(parts[i])
      out.push('__BLANK__')
    } else {
      out.push(parts[i])
    }
  }
  return { parts: out, answers }
}

function answersMatch(input: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/\\/g, '')
      .replace(/\s+/g, '')
  const a = norm(input)
  const b = norm(expected)
  if (!a) return false
  if (a === b) return true
  return b.includes(a) && a.length >= Math.min(3, b.length)
}

export function ClozeMode({ topic }: { topic: Topic }) {
  const [items, setItems] = useState<ClozeItem[]>(() => buildSession(topic).cloze)
  const [i, setI] = useState(0)
  const [values, setValues] = useState<string[]>([])
  const [checked, setChecked] = useState(false)

  const refresh = () => {
    setItems(buildSession(topic).cloze)
    setI(0)
    setChecked(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.id])

  const item = items[i]
  const parsed = useMemo(() => (item ? parseCloze(item.text) : null), [item])

  useEffect(() => {
    if (!item) return
    const { answers } = parseCloze(item.text)
    setValues(answers.map(() => ''))
    setChecked(false)
  }, [item])

  if (!item || !parsed) return <p>Нет заданий.</p>

  let blankIdx = 0
  return (
    <div className="mode cloze">
      <SessionBar
        label={`Пропуск ${i + 1} / ${items.length} · каждый раз новая выборка`}
        onRefresh={refresh}
      />
      <p className="cloze-text">
        {parsed.parts.map((part, partIdx) => {
          if (part !== '__BLANK__') return <MathText key={`t-${partIdx}`} text={part} />
          const idx = blankIdx++
          const val = values[idx] ?? ''
          const ok = checked && answersMatch(val, parsed.answers[idx])
          const bad = checked && !ok
          return (
            <input
              key={`b-${idx}`}
              className={`blank ${ok ? 'ok' : ''} ${bad ? 'bad' : ''}`}
              value={val}
              disabled={checked}
              onChange={(e) => {
                const next = [...values]
                next[idx] = e.target.value
                setValues(next)
              }}
              placeholder="…"
            />
          )
        })}
      </p>
      {!checked ? (
        <button type="button" className="btn" onClick={() => setChecked(true)}>
          Проверить
        </button>
      ) : (
        <div className="cloze-actions">
          <p className="explain">
            Ответы:{' '}
            {parsed.answers.map((a, ai) => (
              <span key={ai}>
                {ai > 0 ? ', ' : ''}
                <MathText text={a.includes('\\') || a.includes('^') ? `$${a}$` : a} />
              </span>
            ))}
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (i + 1 >= items.length) refresh()
              else setI(i + 1)
            }}
          >
            {i + 1 >= items.length ? 'Новая сессия' : 'Дальше'}
          </button>
        </div>
      )}
    </div>
  )
}

export function RecallMode({ topic }: { topic: Topic }) {
  const [prompts, setPrompts] = useState(() => buildSession(topic).recall)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  const refresh = () => {
    setPrompts(buildSession(topic).recall)
    setRevealed({})
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.id])

  return (
    <div className="mode recall">
      <SessionBar label="Ответь вслух · порядок случайный" onRefresh={refresh} />
      <p className="lede">Закрой конспект, ответь, потом сверься с подсказкой.</p>
      <ol className="recall-list">
        {prompts.map((q, idx) => (
          <li key={`${q}-${idx}`}>
            <MathText as="p" text={q} />
            <button
              type="button"
              className="linkish"
              onClick={() => setRevealed((s) => ({ ...s, [idx]: !s[idx] }))}
            >
              {revealed[idx] ? 'Скрыть подсказку' : 'Подсмотреть в конспекте'}
            </button>
            {revealed[idx] && (
              <ul className="bullets dim">
                {topic.conspect
                  .flatMap((b) => b.bullets)
                  .slice(0, 6)
                  .map((b) => (
                    <li key={b}>
                      <MathText text={b} />
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function DeriveMode({ topic }: { topic: Topic }) {
  const items = topic.derive ?? []
  const [i, setI] = useState(0)
  const [step, setStep] = useState(0)
  const [showFormula, setShowFormula] = useState(false)

  useEffect(() => {
    setI(0)
    setStep(0)
    setShowFormula(false)
  }, [topic.id])

  if (!items.length) {
    return (
      <div className="mode derive">
        <p className="lede">В этой теме нет отдельных выводов — смотри блок «Вывод» в конспекте.</p>
      </div>
    )
  }

  const item: DeriveItem = items[i]
  const totalSteps = item.steps.length

  const nextItem = () => {
    setI((x) => (x + 1) % items.length)
    setStep(0)
    setShowFormula(false)
  }

  return (
    <div className="mode derive">
      <SessionBar
        label={`Вывод ${i + 1} / ${items.length} · шаги по одному`}
        onRefresh={() => {
          setI(0)
          setStep(0)
          setShowFormula(false)
        }}
      />
      <MathText as="h3" className="q" text={item.prompt} />
      <p className="hint">Сначала попробуй сам, потом открывай шаги.</p>

      <ol className="derive-steps">
        {item.steps.slice(0, step).map((s, idx) => (
          <li key={idx}>
            <MathText text={s} />
          </li>
        ))}
      </ol>

      <div className="derive-actions">
        {step < totalSteps ? (
          <button type="button" className="btn" onClick={() => setStep((s) => s + 1)}>
            Шаг {step + 1} / {totalSteps}
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setShowFormula(true)}>
            Показать итоговую формулу
          </button>
        )}
        {showFormula && (
          <div className="derive-formula">
            <MathText text={item.formula} />
          </div>
        )}
        {(step >= totalSteps || showFormula) && (
          <button type="button" className="btn secondary" onClick={nextItem}>
            Следующий вывод
          </button>
        )}
      </div>
    </div>
  )
}
