import { useEffect, useState } from 'react'
import type { Formula } from '../types'

export function useFormulas() {
  const [formulas, setFormulas] = useState<Formula[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const base = import.meta.env.BASE_URL
        const res = await fetch(`${base}content.json`)
        if (!res.ok) throw new Error(`Не удалось загрузить content.json (${res.status})`)
        const data = (await res.json()) as { formulas: Formula[] }
        if (!cancelled) setFormulas(data.formulas ?? [])
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Ошибка загрузки')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { formulas, loading, error }
}

export function groupBySection(formulas: Formula[]): Record<string, Formula[]> {
  const out: Record<string, Formula[]> = {}
  for (const f of formulas) {
    ;(out[f.section] ??= []).push(f)
  }
  return out
}
