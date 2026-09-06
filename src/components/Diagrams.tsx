const SHEETS: Record<string, { src: string; caption: string }> = {
  'sheet-1': {
    src: 'sheets/sheet-1.png',
    caption: 'Лист 1 — окружность, тождества, период и чётность',
  },
  'sheet-2': {
    src: 'sheets/sheet-2.png',
    caption: 'Лист 2 — приведение, сложение, двойной/тройной угол',
  },
  'sheet-3': {
    src: 'sheets/sheet-3.png',
    caption: 'Лист 3 — сумма↔произведение, подстановка, уравнения',
  },
}

export function TopicDiagrams({ ids }: { ids?: string[] }) {
  if (!ids?.length) return null
  const base = import.meta.env.BASE_URL
  return (
    <div className="diagrams">
      {ids.map((id) => {
        const sheet = SHEETS[id]
        if (!sheet) return null
        return (
          <figure key={id} className="diagram">
            <img src={`${base}${sheet.src}`} alt={sheet.caption} loading="lazy" />
            <figcaption>{sheet.caption}</figcaption>
          </figure>
        )
      })}
    </div>
  )
}
