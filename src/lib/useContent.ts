import { useEffect, useState } from 'react'
import type { ContentFile, Formula } from '../types'

export function useContent() {
  const [data, setData] = useState<ContentFile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}content.json`)
        if (!res.ok) throw new Error(`Загрузка не удалась (${res.status})`)
        const json = (await res.json()) as ContentFile
        if (!cancelled) setData(json)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Ошибка')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}

export function byFamily(formulas: Formula[], order: string[]): { family: string; items: Formula[] }[] {
  const map = new Map<string, Formula[]>()
  for (const f of formulas) {
    ;(map.get(f.family) ?? map.set(f.family, []).get(f.family)!).push(f)
  }
  return order
    .filter((name) => map.has(name))
    .map((family) => ({ family, items: map.get(family)! }))
}
