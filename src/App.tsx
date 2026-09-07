import { useEffect, useMemo, useState } from 'react'
import { MathText } from './components/MathText'
import { formulas, GROUPS, type Formula } from './data/formulas'
import './App.css'

const KEY = 'trig-chains-v1'

type Progress = { known: string[] }

function load(): Progress {
  try {
    return { known: JSON.parse(localStorage.getItem(KEY) || '{"known":[]}').known ?? [] }
  } catch {
    return { known: [] }
  }
}

type Mode = 'list' | 'view' | 'drill'

export default function App() {
  const [progress, setProgress] = useState<Progress>(() => load())
  const [mode, setMode] = useState<Mode>('list')
  const [id, setId] = useState<string | null>(null)
  const [reveal, setReveal] = useState(0)
  const [drillI, setDrillI] = useState(0)
  const [showAns, setShowAns] = useState(false)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  const f = useMemo(() => formulas.find((x) => x.id === id) ?? null, [id])
  const known = new Set(progress.known)

  const open = (fid: string) => {
    setId(fid)
    setReveal(0)
    setMode('view')
  }

  const startDrill = (pool?: Formula[]) => {
    const list = pool ?? formulas
    setDrillI(0)
    setShowAns(false)
    setId(list[0]?.id ?? null)
    setMode('drill')
    // store pool order in session via reshuffle of ids in state - use all formulas order for simplicity
  }

  const drillPool = formulas
  const drillItem = drillPool[drillI]

  if (mode === 'view' && f) {
    return (
      <div className="wrap">
        <div className="top">
          <button type="button" className="link" onClick={() => setMode('list')}>
            ← Список
          </button>
          <button
            type="button"
            className="link"
            onClick={() => {
              setShowAns(false)
              setMode('drill')
              setDrillI(formulas.findIndex((x) => x.id === f.id))
            }}
          >
            Учить цепочку
          </button>
        </div>

        <p className="group">{f.group}</p>
        <h1>{f.name}</h1>
        {f.base && <p className="base-tag">База — запомнить как есть</p>}

        <div className="result">
          <MathText text={f.result} />
        </div>

        <h2>Вывод (цепочка)</h2>
        <ol className="chain">
          {f.chain.map((line, i) => (
            <li key={i} className={i < reveal || reveal >= f.chain.length ? 'on' : 'dim'}>
              {i < reveal || reveal >= f.chain.length ? (
                <MathText text={line} />
              ) : (
                <span className="hide">····</span>
              )}
            </li>
          ))}
        </ol>

        <div className="actions">
          {reveal < f.chain.length ? (
            <button type="button" className="btn" onClick={() => setReveal((r) => r + 1)}>
              Следующая строка ({reveal}/{f.chain.length})
            </button>
          ) : (
            <button
              type="button"
              className="btn"
              onClick={() =>
                setProgress((p) =>
                  p.known.includes(f.id) ? p : { known: [...p.known, f.id] },
                )
              }
            >
              {known.has(f.id) ? 'Уже в известных' : 'Запомнил'}
            </button>
          )}
          <button type="button" className="btn ghost" onClick={() => setReveal(f.chain.length)}>
            Показать всё
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'drill' && drillItem) {
    const lines = drillItem.chain
    return (
      <div className="wrap">
        <div className="top">
          <button type="button" className="link" onClick={() => setMode('list')}>
            ← Список
          </button>
          <span className="meta">
            {drillI + 1}/{drillPool.length}
          </span>
        </div>
        <p className="group">{drillItem.group}</p>
        <h1>{drillItem.name}</h1>
        <p className="ask">Восстанови цепочку вывода по памяти</p>

        {!showAns ? (
          <div className="result dim-box">
            <MathText text={drillItem.result} />
          </div>
        ) : (
          <ol className="chain">
            {lines.map((line, i) => (
              <li key={i} className="on">
                <MathText text={line} />
              </li>
            ))}
          </ol>
        )}

        <div className="actions">
          {!showAns ? (
            <button type="button" className="btn" onClick={() => setShowAns(true)}>
              Показать цепочку
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setShowAns(false)
                  setDrillI((i) => (i + 1) % drillPool.length)
                }}
              >
                Не помню
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setProgress((p) =>
                    p.known.includes(drillItem.id) ? p : { known: [...p.known, drillItem.id] },
                  )
                  setShowAns(false)
                  setDrillI((i) => (i + 1) % drillPool.length)
                }}
              >
                Помню
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="wrap">
      <header className="hero">
        <h1>Формулы</h1>
        <p className="sub">
          Список равенств. У каждой — цепочка преобразований. Учи строки подряд.
        </p>
        <p className="meta">
          {progress.known.length}/{formulas.length} запомнил
        </p>
        <button type="button" className="btn" onClick={() => startDrill()}>
          Тренировать все
        </button>
      </header>

      {GROUPS.map((g) => {
        const items = formulas.filter((x) => x.group === g)
        return (
          <section key={g} className="sec">
            <h2>{g}</h2>
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <button type="button" className="row" onClick={() => open(item.id)}>
                    <span className="name">
                      {item.name}
                      {item.base ? ' · база' : ''}
                      {known.has(item.id) ? ' · ✓' : ''}
                    </span>
                    <span className="eq">
                      <MathText text={item.result} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
