export type ProofStep = {
  id: string
  text: string
  /** if set, learner must type this into [[...]] style blank inside text — use blank field */
  blank?: string
}

export type Lesson = {
  id: string
  chapter: string
  title: string
  formula: string
  premise: string
  proof: ProofStep[]
  /** wrong order decoys not used — we shuffle proof ids */
  checks: { q: string; a: string }[]
}

export const CHAPTERS = [
  '1. Сложение — с нуля',
  '2. Двойной угол',
  '3. Понижение степени',
  '4. Тройной угол',
  '5. Сумма → произведение',
  '6. Произведение → сумма',
  '7. Универсальная подстановка',
] as const

export const lessons: Lesson[] = [
  {
    id: 'cos-diff',
    chapter: CHAPTERS[0],
    title: 'cos(α − β) — корень',
    formula: '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$',
    premise:
      'Всё сложение растёт из этой формулы. Выводим через единичную окружность и скалярное произведение.',
    proof: [
      {
        id: 'a',
        text: 'Точки на единичной окружности: $A(\\cos\\alpha;\\sin\\alpha)$, $B(\\cos\\beta;\\sin\\beta)$.',
      },
      {
        id: 'b',
        text: 'Скалярное произведение $\\overrightarrow{OA}\\cdot\\overrightarrow{OB}=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$.',
      },
      {
        id: 'c',
        text: 'Угол между лучами $OA$ и $OB$ равен $\\alpha-\\beta$, значит то же произведение равно $\\cos(\\alpha-\\beta)$.',
      },
      {
        id: 'd',
        text: 'Приравниваем: $\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$.',
        blank: '\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta',
      },
    ],
    checks: [
      {
        q: 'Чему равно $\\cos(\\alpha-\\beta)$?',
        a: '\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta',
      },
      {
        q: 'Какой геометрический смысл левой части при выводе?',
        a: 'косинус угла между радиус-векторами',
      },
    ],
  },
  {
    id: 'cos-sum',
    chapter: CHAPTERS[0],
    title: 'cos(α + β)',
    formula: '$\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$',
    premise: 'Из cos(α − β) заменой β на −β и чётности cos / нечётности sin.',
    proof: [
      {
        id: 'a',
        text: 'Пишем $\\cos(\\alpha+\\beta)=\\cos(\\alpha-(-\\beta))$.',
      },
      {
        id: 'b',
        text: 'По уже доказанной формуле: $\\cos\\alpha\\cos(-\\beta)+\\sin\\alpha\\sin(-\\beta)$.',
      },
      {
        id: 'c',
        text: '$\\cos(-\\beta)=\\cos\\beta$, $\\sin(-\\beta)=-\\sin\\beta$.',
      },
      {
        id: 'd',
        text: 'Получаем $\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$.',
        blank: '\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta',
      },
    ],
    checks: [
      {
        q: 'Формула $\\cos(\\alpha+\\beta)$?',
        a: '\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta',
      },
    ],
  },
  {
    id: 'sin-diff',
    chapter: CHAPTERS[0],
    title: 'sin(α − β)',
    formula: '$\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$',
    premise: 'Через тождество $\\sin x=\\cos(\\pi/2-x)$ и уже известный cos.',
    proof: [
      {
        id: 'a',
        text: '$\\sin(\\alpha-\\beta)=\\cos\\bigl(\\pi/2-(\\alpha-\\beta)\\bigr)=\\cos\\bigl((\\pi/2-\\alpha)+\\beta\\bigr)$.',
      },
      {
        id: 'b',
        text: 'Раскрываем cos суммы: $\\cos(\\pi/2-\\alpha)\\cos\\beta-\\sin(\\pi/2-\\alpha)\\sin\\beta$.',
      },
      {
        id: 'c',
        text: '$\\cos(\\pi/2-\\alpha)=\\sin\\alpha$, $\\sin(\\pi/2-\\alpha)=\\cos\\alpha$.',
      },
      {
        id: 'd',
        text: 'Итого $\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$.',
        blank: '\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta',
      },
    ],
    checks: [
      {
        q: 'Формула $\\sin(\\alpha-\\beta)$?',
        a: '\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta',
      },
    ],
  },
  {
    id: 'sin-sum',
    chapter: CHAPTERS[0],
    title: 'sin(α + β)',
    formula: '$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$',
    premise: 'Из sin(α − β) заменой β → −β.',
    proof: [
      {
        id: 'a',
        text: '$\\sin(\\alpha+\\beta)=\\sin(\\alpha-(-\\beta))$.',
      },
      {
        id: 'b',
        text: 'Подставляем: $\\sin\\alpha\\cos(-\\beta)-\\cos\\alpha\\sin(-\\beta)$.',
      },
      {
        id: 'c',
        text: 'Учитывая чётность/нечётность → $\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$.',
        blank: '\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta',
      },
    ],
    checks: [
      {
        q: 'Формула $\\sin(\\alpha+\\beta)$?',
        a: '\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta',
      },
    ],
  },
  {
    id: 'tg-sum',
    chapter: CHAPTERS[0],
    title: 'tg(α ± β)',
    formula:
      '$\\operatorname{tg}(\\alpha\\pm\\beta)=\\dfrac{\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta}{1\\mp\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$',
    premise: 'Частное sin/cos сложения; делим на cos α cos β.',
    proof: [
      {
        id: 'a',
        text: '$\\operatorname{tg}(\\alpha+\\beta)=\\sin(\\alpha+\\beta)/\\cos(\\alpha+\\beta)$.',
      },
      {
        id: 'b',
        text: 'Подставляем формулы sin и cos суммы.',
      },
      {
        id: 'c',
        text: 'Делим числитель и знаменатель на $\\cos\\alpha\\cos\\beta$.',
      },
      {
        id: 'd',
        text: 'Получаем $\\dfrac{\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta}{1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$.',
        blank: '1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta',
      },
    ],
    checks: [
      {
        q: 'Знаменатель в $\\operatorname{tg}(\\alpha+\\beta)$?',
        a: '1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta',
      },
    ],
  },
  {
    id: 'ctg-sum',
    chapter: CHAPTERS[0],
    title: 'ctg(α ± β)',
    formula:
      '$\\operatorname{ctg}(\\alpha\\pm\\beta)=\\dfrac{\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta\\mp 1}{\\operatorname{ctg}\\beta\\pm\\operatorname{ctg}\\alpha}$',
    premise: 'Аналогично через cos/sin или как 1/tg.',
    proof: [
      {
        id: 'a',
        text: '$\\operatorname{ctg}(\\alpha+\\beta)=\\cos(\\alpha+\\beta)/\\sin(\\alpha+\\beta)$.',
      },
      {
        id: 'b',
        text: 'Подставляем сложение и делим на $\\sin\\alpha\\sin\\beta$.',
      },
      {
        id: 'c',
        text: 'Получаем $\\dfrac{\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta-1}{\\operatorname{ctg}\\beta+\\operatorname{ctg}\\alpha}$.',
        blank: '\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta-1',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{ctg}(\\alpha+\\beta)$ в виде ctg?',
        a: '\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta-1',
      },
    ],
  },
  {
    id: 'sin2',
    chapter: CHAPTERS[1],
    title: 'sin 2α',
    formula: '$\\sin 2\\alpha=2\\sin\\alpha\\cos\\alpha$',
    premise: 'Сложение при β = α.',
    proof: [
      { id: 'a', text: '$\\sin 2\\alpha=\\sin(\\alpha+\\alpha)$.' },
      {
        id: 'b',
        text: '$=\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha=2\\sin\\alpha\\cos\\alpha$.',
        blank: '2\\sin\\alpha\\cos\\alpha',
      },
    ],
    checks: [{ q: '$\\sin 2\\alpha=$ ?', a: '2\\sin\\alpha\\cos\\alpha' }],
  },
  {
    id: 'cos2',
    chapter: CHAPTERS[1],
    title: 'cos 2α',
    formula:
      '$\\cos 2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha=2\\cos^2\\alpha-1=1-2\\sin^2\\alpha$',
    premise: 'cos(α+α), затем основное тождество.',
    proof: [
      {
        id: 'a',
        text: '$\\cos 2\\alpha=\\cos\\alpha\\cos\\alpha-\\sin\\alpha\\sin\\alpha=\\cos^2\\alpha-\\sin^2\\alpha$.',
      },
      {
        id: 'b',
        text: 'Замена $\\sin^2=1-\\cos^2$ → $2\\cos^2\\alpha-1$.',
      },
      {
        id: 'c',
        text: 'Замена $\\cos^2=1-\\sin^2$ → $1-2\\sin^2\\alpha$.',
        blank: '1-2\\sin^2\\alpha',
      },
    ],
    checks: [
      { q: 'Один из видов: $\\cos 2\\alpha=$ ? (через sin)', a: '1-2\\sin^2\\alpha' },
    ],
  },
  {
    id: 'tg2',
    chapter: CHAPTERS[1],
    title: 'tg 2α',
    formula: '$\\operatorname{tg} 2\\alpha=\\dfrac{2\\operatorname{tg}\\alpha}{1-\\operatorname{tg}^2\\alpha}$',
    premise: 'tg(α+α).',
    proof: [
      {
        id: 'a',
        text: 'В формуле tg(α+β) полагаем β=α.',
      },
      {
        id: 'b',
        text: 'Получаем $\\dfrac{2\\operatorname{tg}\\alpha}{1-\\operatorname{tg}^2\\alpha}$.',
        blank: '2\\operatorname{tg}\\alpha',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{tg} 2\\alpha$?',
        a: '2\\operatorname{tg}\\alpha',
      },
    ],
  },
  {
    id: 'ctg2',
    chapter: CHAPTERS[1],
    title: 'ctg 2α',
    formula: '$\\operatorname{ctg} 2\\alpha=\\dfrac{\\operatorname{ctg}^2\\alpha-1}{2\\operatorname{ctg}\\alpha}$',
    premise: 'Из ctg(α+α) или 1/tg 2α.',
    proof: [
      { id: 'a', text: 'Либо ctg(α+α), либо $1/\\operatorname{tg} 2\\alpha$.' },
      {
        id: 'b',
        text: 'После упрощения: $\\dfrac{\\operatorname{ctg}^2\\alpha-1}{2\\operatorname{ctg}\\alpha}$.',
        blank: '\\operatorname{ctg}^2\\alpha-1',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{ctg} 2\\alpha$?',
        a: '\\operatorname{ctg}^2\\alpha-1',
      },
    ],
  },
  {
    id: 'pow-cos',
    chapter: CHAPTERS[2],
    title: 'cos² α',
    formula: '$\\cos^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{2}$',
    premise: 'Из $\\cos 2\\alpha=2\\cos^2\\alpha-1$.',
    proof: [
      { id: 'a', text: 'Берём $\\cos 2\\alpha=2\\cos^2\\alpha-1$.' },
      {
        id: 'b',
        text: '$2\\cos^2\\alpha=1+\\cos 2\\alpha$ → делим на 2.',
        blank: '(1+\\cos 2\\alpha)/2',
      },
    ],
    checks: [
      { q: '$\\cos^2\\alpha=$ ?', a: '(1+\\cos 2\\alpha)/2' },
    ],
  },
  {
    id: 'pow-sin',
    chapter: CHAPTERS[2],
    title: 'sin² α',
    formula: '$\\sin^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{2}$',
    premise: 'Из $\\cos 2\\alpha=1-2\\sin^2\\alpha$.',
    proof: [
      { id: 'a', text: 'Берём $\\cos 2\\alpha=1-2\\sin^2\\alpha$.' },
      {
        id: 'b',
        text: '$2\\sin^2\\alpha=1-\\cos 2\\alpha$ → $/2$.',
        blank: '(1-\\cos 2\\alpha)/2',
      },
    ],
    checks: [{ q: '$\\sin^2\\alpha=$ ?', a: '(1-\\cos 2\\alpha)/2' }],
  },
  {
    id: 'pow-tg',
    chapter: CHAPTERS[2],
    title: 'tg² α',
    formula: '$\\operatorname{tg}^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{1+\\cos 2\\alpha}$',
    premise: 'Отношение sin²/cos² после понижения.',
    proof: [
      {
        id: 'a',
        text: '$\\operatorname{tg}^2=\\sin^2/\\cos^2$ — подставь оба понижения.',
      },
      {
        id: 'b',
        text: 'Множители $1/2$ сокращаются → $\\dfrac{1-\\cos 2\\alpha}{1+\\cos 2\\alpha}$.',
        blank: '1-\\cos 2\\alpha',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{tg}^2\\alpha$ через cos 2α?',
        a: '1-\\cos 2\\alpha',
      },
    ],
  },
  {
    id: 'pow-ctg',
    chapter: CHAPTERS[2],
    title: 'ctg² α',
    formula: '$\\operatorname{ctg}^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{1-\\cos 2\\alpha}$',
    premise: 'Обратная к tg².',
    proof: [
      {
        id: 'a',
        text: '$\\operatorname{ctg}^2=1/\\operatorname{tg}^2$ или cos²/sin².',
      },
      {
        id: 'b',
        text: 'Получаем $\\dfrac{1+\\cos 2\\alpha}{1-\\cos 2\\alpha}$.',
        blank: '1+\\cos 2\\alpha',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{ctg}^2\\alpha$?',
        a: '1+\\cos 2\\alpha',
      },
    ],
  },
  {
    id: 'sin3',
    chapter: CHAPTERS[3],
    title: 'sin 3α',
    formula: '$\\sin 3\\alpha=3\\sin\\alpha-4\\sin^3\\alpha$',
    premise: 'sin(2α+α) + двойной угол.',
    proof: [
      {
        id: 'a',
        text: '$\\sin 3\\alpha=\\sin(2\\alpha+\\alpha)=\\sin 2\\alpha\\cos\\alpha+\\cos 2\\alpha\\sin\\alpha$.',
      },
      {
        id: 'b',
        text: 'Подставь $2\\sin\\cos$ и $1-2\\sin^2$, замени $\\cos^2=1-\\sin^2$.',
      },
      {
        id: 'c',
        text: 'Упрости до $3\\sin\\alpha-4\\sin^3\\alpha$.',
        blank: '3\\sin\\alpha-4\\sin^3\\alpha',
      },
    ],
    checks: [
      { q: '$\\sin 3\\alpha=$ ?', a: '3\\sin\\alpha-4\\sin^3\\alpha' },
    ],
  },
  {
    id: 'cos3',
    chapter: CHAPTERS[3],
    title: 'cos 3α',
    formula: '$\\cos 3\\alpha=4\\cos^3\\alpha-3\\cos\\alpha$',
    premise: 'cos(2α+α).',
    proof: [
      {
        id: 'a',
        text: '$\\cos(2\\alpha+\\alpha)=\\cos 2\\alpha\\cos\\alpha-\\sin 2\\alpha\\sin\\alpha$.',
      },
      {
        id: 'b',
        text: 'Подставь двойные углы и $\\sin^2=1-\\cos^2$.',
      },
      {
        id: 'c',
        text: 'Получи $4\\cos^3\\alpha-3\\cos\\alpha$.',
        blank: '4\\cos^3\\alpha-3\\cos\\alpha',
      },
    ],
    checks: [
      { q: '$\\cos 3\\alpha=$ ?', a: '4\\cos^3\\alpha-3\\cos\\alpha' },
    ],
  },
  {
    id: 'tg3',
    chapter: CHAPTERS[3],
    title: 'tg 3α',
    formula:
      '$\\operatorname{tg} 3\\alpha=\\dfrac{3\\operatorname{tg}\\alpha-\\operatorname{tg}^3\\alpha}{1-3\\operatorname{tg}^2\\alpha}$',
    premise: 'tg(2α+α).',
    proof: [
      { id: 'a', text: 'Пиши $\\operatorname{tg}(2\\alpha+\\alpha)$ через формулу суммы.' },
      {
        id: 'b',
        text: 'Подставь $\\operatorname{tg} 2\\alpha$ и упрости.',
      },
      {
        id: 'c',
        text: 'Числитель $3\\operatorname{tg}-\\operatorname{tg}^3$.',
        blank: '3\\operatorname{tg}\\alpha-\\operatorname{tg}^3\\alpha',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{tg} 3\\alpha$?',
        a: '3\\operatorname{tg}\\alpha-\\operatorname{tg}^3\\alpha',
      },
    ],
  },
  {
    id: 'ctg3',
    chapter: CHAPTERS[3],
    title: 'ctg 3α',
    formula:
      '$\\operatorname{ctg} 3\\alpha=\\dfrac{\\operatorname{ctg}^3\\alpha-3\\operatorname{ctg}\\alpha}{3\\operatorname{ctg}^2\\alpha-1}$',
    premise: 'ctg(2α+α) или 1/tg 3α.',
    proof: [
      { id: 'a', text: 'Через ctg суммы или обращением tg 3α.' },
      {
        id: 'b',
        text: 'Числитель $\\operatorname{ctg}^3-3\\operatorname{ctg}$.',
        blank: '\\operatorname{ctg}^3\\alpha-3\\operatorname{ctg}\\alpha',
      },
    ],
    checks: [
      {
        q: 'Числитель $\\operatorname{ctg} 3\\alpha$?',
        a: '\\operatorname{ctg}^3\\alpha-3\\operatorname{ctg}\\alpha',
      },
    ],
  },
  {
    id: 'sum-sin',
    chapter: CHAPTERS[4],
    title: 'sin α ± sin β',
    formula:
      '$\\sin\\alpha\\pm\\sin\\beta=2\\sin\\dfrac{\\alpha\\pm\\beta}{2}\\cos\\dfrac{\\alpha\\mp\\beta}{2}$',
    premise: 'Замена s=(α+β)/2, d=(α−β)/2 + сложение.',
    proof: [
      {
        id: 'a',
        text: 'Пусть $s=(\\alpha+\\beta)/2$, $d=(\\alpha-\\beta)/2$ ⇒ α=s+d, β=s−d.',
      },
      {
        id: 'b',
        text: '$\\sin(s+d)+\\sin(s-d)=2\\sin s\\cos d$ (сложение).',
      },
      {
        id: 'c',
        text: 'Возвращаем s,d → формула суммы синусов.',
        blank: '2\\sin s\\cos d',
      },
    ],
    checks: [
      {
        q: 'После замены sinα+sinβ сводится к?',
        a: '2\\sin s\\cos d',
      },
    ],
  },
  {
    id: 'sum-cos-p',
    chapter: CHAPTERS[4],
    title: 'cos α + cos β',
    formula:
      '$\\cos\\alpha+\\cos\\beta=2\\cos\\dfrac{\\alpha+\\beta}{2}\\cos\\dfrac{\\alpha-\\beta}{2}$',
    premise: 'Та же замена s, d.',
    proof: [
      { id: 'a', text: 'α=s+d, β=s−d.' },
      {
        id: 'b',
        text: '$\\cos(s+d)+\\cos(s-d)=2\\cos s\\cos d$.',
        blank: '2\\cos s\\cos d',
      },
    ],
    checks: [{ q: 'cosα+cosβ после замены?', a: '2\\cos s\\cos d' }],
  },
  {
    id: 'sum-cos-m',
    chapter: CHAPTERS[4],
    title: 'cos α − cos β',
    formula:
      '$\\cos\\alpha-\\cos\\beta=-2\\sin\\dfrac{\\alpha+\\beta}{2}\\sin\\dfrac{\\alpha-\\beta}{2}$',
    premise: 'Разность cos через s, d.',
    proof: [
      {
        id: 'a',
        text: '$\\cos(s+d)-\\cos(s-d)=-2\\sin s\\sin d$.',
      },
      {
        id: 'b',
        text: 'Не забудь минус: $-2\\sin\\frac{\\alpha+\\beta}{2}\\sin\\frac{\\alpha-\\beta}{2}$.',
        blank: '-2',
      },
    ],
    checks: [
      { q: 'Коэффициент перед sin·sin в cosα−cosβ?', a: '-2' },
    ],
  },
  {
    id: 'sum-tg',
    chapter: CHAPTERS[4],
    title: 'tg α ± tg β',
    formula:
      '$\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta=\\dfrac{\\sin(\\alpha\\pm\\beta)}{\\cos\\alpha\\cos\\beta}$',
    premise: 'Общий знаменатель + sin сложения.',
    proof: [
      {
        id: 'a',
        text: 'Приведи к общему знаменателю $\\cos\\alpha\\cos\\beta$.',
      },
      {
        id: 'b',
        text: 'Числитель = $\\sin(\\alpha\\pm\\beta)$ по формуле сложения.',
        blank: '\\sin(\\alpha\\pm\\beta)',
      },
    ],
    checks: [
      {
        q: 'Числитель tgα±tgβ?',
        a: '\\sin(\\alpha\\pm\\beta)',
      },
    ],
  },
  {
    id: 'sum-ctg',
    chapter: CHAPTERS[4],
    title: 'ctg α ± ctg β',
    formula:
      '$\\operatorname{ctg}\\alpha\\pm\\operatorname{ctg}\\beta=\\dfrac{\\sin(\\beta\\pm\\alpha)}{\\sin\\alpha\\sin\\beta}$',
    premise: 'Общий знаменатель sin α sin β.',
    proof: [
      {
        id: 'a',
        text: 'Общий знаменатель $\\sin\\alpha\\sin\\beta$.',
      },
      {
        id: 'b',
        text: 'Числитель сводится к $\\sin(\\beta\\pm\\alpha)$.',
        blank: '\\sin(\\beta\\pm\\alpha)',
      },
    ],
    checks: [
      {
        q: 'Числитель ctgα±ctgβ?',
        a: '\\sin(\\beta\\pm\\alpha)',
      },
    ],
  },
  {
    id: 'prod-ss',
    chapter: CHAPTERS[5],
    title: 'sin α · sin β',
    formula:
      '$\\sin\\alpha\\sin\\beta=\\dfrac{\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)}{2}$',
    premise: 'Вычитание двух формул cos.',
    proof: [
      {
        id: 'a',
        text: 'Выпиши $\\cos(\\alpha-\\beta)$ и $\\cos(\\alpha+\\beta)$.',
      },
      {
        id: 'b',
        text: 'Вычти: разность = $2\\sin\\alpha\\sin\\beta$.',
      },
      {
        id: 'c',
        text: 'Раздели на 2.',
        blank: '2',
      },
    ],
    checks: [
      {
        q: 'На что делим после вычитания cos?',
        a: '2',
      },
    ],
  },
  {
    id: 'prod-sc',
    chapter: CHAPTERS[5],
    title: 'sin α · cos β',
    formula:
      '$\\sin\\alpha\\cos\\beta=\\dfrac{\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)}{2}$',
    premise: 'Сумма двух sin.',
    proof: [
      {
        id: 'a',
        text: 'Сложи $\\sin(\\alpha+\\beta)$ и $\\sin(\\alpha-\\beta)$.',
      },
      {
        id: 'b',
        text: 'Получи $2\\sin\\alpha\\cos\\beta$, раздели на 2.',
        blank: '\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)',
      },
    ],
    checks: [
      {
        q: 'Удвоенный числитель sinα cosβ?',
        a: '\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)',
      },
    ],
  },
  {
    id: 'prod-cc',
    chapter: CHAPTERS[5],
    title: 'cos α · cos β',
    formula:
      '$\\cos\\alpha\\cos\\beta=\\dfrac{\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta)}{2}$',
    premise: 'Сумма двух cos.',
    proof: [
      {
        id: 'a',
        text: 'Сложи $\\cos(\\alpha-\\beta)$ и $\\cos(\\alpha+\\beta)$.',
      },
      {
        id: 'b',
        text: 'Раздели на 2.',
        blank: '\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta)',
      },
    ],
    checks: [
      {
        q: 'Удвоенный числитель cosα cosβ?',
        a: '\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta)',
      },
    ],
  },
  {
    id: 'wei-sin',
    chapter: CHAPTERS[6],
    title: 'sin через t=tg(α/2)',
    formula:
      '$\\sin\\alpha=\\dfrac{2t}{1+t^2},\\ t=\\operatorname{tg}\\dfrac{\\alpha}{2}$',
    premise: 'Из sin 2β при β=α/2.',
    proof: [
      {
        id: 'a',
        text: '$\\sin\\alpha=2\\sin(\\alpha/2)\\cos(\\alpha/2)$.',
      },
      {
        id: 'b',
        text: 'Делим числитель и знаменатель на $\\cos^2(\\alpha/2)$.',
      },
      {
        id: 'c',
        text: 'Сверху $2t$, снизу $1+t^2$.',
        blank: '2t/(1+t^2)',
      },
    ],
    checks: [{ q: 'sin α через t?', a: '2t/(1+t^2)' }],
  },
  {
    id: 'wei-cos',
    chapter: CHAPTERS[6],
    title: 'cos через t=tg(α/2)',
    formula:
      '$\\cos\\alpha=\\dfrac{1-t^2}{1+t^2},\\ t=\\operatorname{tg}\\dfrac{\\alpha}{2}$',
    premise: 'Из cos 2β.',
    proof: [
      {
        id: 'a',
        text: '$\\cos\\alpha=\\cos^2(\\alpha/2)-\\sin^2(\\alpha/2)$.',
      },
      {
        id: 'b',
        text: 'Дели на $\\cos^2(\\alpha/2)$ → $(1-t^2)/(1+t^2)$.',
        blank: '(1-t^2)/(1+t^2)',
      },
    ],
    checks: [{ q: 'cos α через t?', a: '(1-t^2)/(1+t^2)' }],
  },
  {
    id: 'wei-tg',
    chapter: CHAPTERS[6],
    title: 'tg через t=tg(α/2)',
    formula:
      '$\\operatorname{tg}\\alpha=\\dfrac{2t}{1-t^2},\\ t=\\operatorname{tg}\\dfrac{\\alpha}{2}$',
    premise: 'Это tg 2β.',
    proof: [
      {
        id: 'a',
        text: 'Положи β=α/2 в tg 2β.',
      },
      {
        id: 'b',
        text: 'Получи $2t/(1-t^2)$.',
        blank: '2t/(1-t^2)',
      },
    ],
    checks: [{ q: 'tg α через t?', a: '2t/(1-t^2)' }],
  },
  {
    id: 'wei-ctg',
    chapter: CHAPTERS[6],
    title: 'ctg через t=tg(α/2)',
    formula:
      '$\\operatorname{ctg}\\alpha=\\dfrac{1-t^2}{2t},\\ t=\\operatorname{tg}\\dfrac{\\alpha}{2}$',
    premise: '1/tg.',
    proof: [
      {
        id: 'a',
        text: '$\\operatorname{ctg}\\alpha=1/\\operatorname{tg}\\alpha=(1-t^2)/(2t)$.',
        blank: '(1-t^2)/(2t)',
      },
    ],
    checks: [{ q: 'ctg α через t?', a: '(1-t^2)/(2t)' }],
  },
]
