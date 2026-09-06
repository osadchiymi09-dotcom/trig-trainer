import { useEffect, useState } from 'react'
import type { Topic } from '../types'

type ContentFile = { topics: Topic[] }

export function useContent() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}content.json`)
      .then((r) => {
        if (!r.ok) throw new Error('Не удалось загрузить content.json')
        return r.json() as Promise<ContentFile>
      })
      .then((data) => setTopics(data.topics))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { topics, error, loading }
}

export function groupBySection(topics: Topic[]): Record<string, Topic[]> {
  return topics.reduce<Record<string, Topic[]>>((acc, t) => {
    ;(acc[t.section] ??= []).push(t)
    return acc
  }, {})
}
