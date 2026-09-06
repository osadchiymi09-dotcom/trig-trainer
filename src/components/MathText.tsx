import { useMemo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Seg = { type: 'text' | 'math'; value: string; display?: boolean }

function splitMath(input: string): Seg[] {
  const segs: Seg[] = []
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(input))) {
    if (m.index > last) segs.push({ type: 'text', value: input.slice(last, m.index) })
    if (m[1] != null) segs.push({ type: 'math', value: m[1], display: true })
    else segs.push({ type: 'math', value: m[2], display: false })
    last = m.index + m[0].length
  }
  if (last < input.length) segs.push({ type: 'text', value: input.slice(last) })
  return segs.length ? segs : [{ type: 'text', value: input }]
}

function renderMath(tex: string, display: boolean): string {
  try {
    return katex.renderToString(tex, {
      throwOnError: false,
      displayMode: display,
      strict: 'ignore',
    })
  } catch {
    return tex
  }
}

export function MathText({
  text,
  as: Tag = 'span',
  className,
}: {
  text: string
  as?: 'span' | 'p' | 'div' | 'li' | 'h3'
  className?: string
}) {
  const segs = useMemo(() => splitMath(text), [text])
  const cls = ['math-text', className].filter(Boolean).join(' ')
  return (
    <Tag className={cls}>
      {segs.map((s, i) =>
        s.type === 'text' ? (
          <span key={i}>{s.value}</span>
        ) : (
          <span
            key={i}
            className={s.display ? 'math-display' : 'math-inline'}
            dangerouslySetInnerHTML={{ __html: renderMath(s.value, Boolean(s.display)) }}
          />
        ),
      )}
    </Tag>
  )
}
