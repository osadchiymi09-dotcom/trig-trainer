export type Formula = {
  id: string
  group: string
  name: string
  /** итоговая формула */
  result: string
  /** только равенства / преобразования, без слов про окружность */
  chain: string[]
  /** если true — база, цепочку просто заучить как старт */
  base?: boolean
}

export const GROUPS = [
  'Сложение',
  'Двойной угол',
  'Понижение степени',
  'Тройной угол',
  'Сумма → произведение',
  'Произведение → сумма',
  'Универсальная подстановка',
] as const

export const formulas: Formula[] = [
  // ── Сложение (база + алгебра) ─────────────────────────────
  {
    id: 'cos-m',
    group: 'Сложение',
    name: 'cos(α − β)',
    result: '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$',
    base: true,
    chain: [
      '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$',
    ],
  },
  {
    id: 'cos-p',
    group: 'Сложение',
    name: 'cos(α + β)',
    result: '$\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$',
    chain: [
      '$\\cos(\\alpha+\\beta)$',
      '$=\\cos\\bigl(\\alpha-(-\\beta)\\bigr)$',
      '$=\\cos\\alpha\\cos(-\\beta)+\\sin\\alpha\\sin(-\\beta)$',
      '$=\\cos\\alpha\\cos\\beta+\\sin\\alpha(-\\sin\\beta)$',
      '$=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$',
    ],
  },
  {
    id: 'sin-m',
    group: 'Сложение',
    name: 'sin(α − β)',
    result: '$\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$',
    chain: [
      '$\\sin(\\alpha-\\beta)$',
      '$=\\cos\\bigl(\\tfrac{\\pi}{2}-(\\alpha-\\beta)\\bigr)$',
      '$=\\cos\\bigl((\\tfrac{\\pi}{2}-\\alpha)+\\beta\\bigr)$',
      '$=\\cos(\\tfrac{\\pi}{2}-\\alpha)\\cos\\beta-\\sin(\\tfrac{\\pi}{2}-\\alpha)\\sin\\beta$',
      '$=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$',
    ],
  },
  {
    id: 'sin-p',
    group: 'Сложение',
    name: 'sin(α + β)',
    result: '$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$',
    chain: [
      '$\\sin(\\alpha+\\beta)$',
      '$=\\sin\\bigl(\\alpha-(-\\beta)\\bigr)$',
      '$=\\sin\\alpha\\cos(-\\beta)-\\cos\\alpha\\sin(-\\beta)$',
      '$=\\sin\\alpha\\cos\\beta-\\cos\\alpha(-\\sin\\beta)$',
      '$=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$',
    ],
  },
  {
    id: 'tg-pm',
    group: 'Сложение',
    name: 'tg(α ± β)',
    result:
      '$\\operatorname{tg}(\\alpha\\pm\\beta)=\\dfrac{\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta}{1\\mp\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$',
    chain: [
      '$\\operatorname{tg}(\\alpha+\\beta)=\\dfrac{\\sin(\\alpha+\\beta)}{\\cos(\\alpha+\\beta)}$',
      '$=\\dfrac{\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta}{\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta}$',
      '$=\\dfrac{\\dfrac{\\sin\\alpha\\cos\\beta}{\\cos\\alpha\\cos\\beta}+\\dfrac{\\cos\\alpha\\sin\\beta}{\\cos\\alpha\\cos\\beta}}{\\dfrac{\\cos\\alpha\\cos\\beta}{\\cos\\alpha\\cos\\beta}-\\dfrac{\\sin\\alpha\\sin\\beta}{\\cos\\alpha\\cos\\beta}}$',
      '$=\\dfrac{\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta}{1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$',
      '$\\operatorname{tg}(\\alpha-\\beta)=\\dfrac{\\operatorname{tg}\\alpha-\\operatorname{tg}\\beta}{1+\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$',
    ],
  },
  {
    id: 'ctg-pm',
    group: 'Сложение',
    name: 'ctg(α ± β)',
    result:
      '$\\operatorname{ctg}(\\alpha\\pm\\beta)=\\dfrac{\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta\\mp 1}{\\operatorname{ctg}\\beta\\pm\\operatorname{ctg}\\alpha}$',
    chain: [
      '$\\operatorname{ctg}(\\alpha+\\beta)=\\dfrac{\\cos(\\alpha+\\beta)}{\\sin(\\alpha+\\beta)}$',
      '$=\\dfrac{\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta}{\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta}$',
      '$=\\dfrac{\\dfrac{\\cos\\alpha\\cos\\beta}{\\sin\\alpha\\sin\\beta}-1}{\\dfrac{\\cos\\beta}{\\sin\\beta}+\\dfrac{\\cos\\alpha}{\\sin\\alpha}}$',
      '$=\\dfrac{\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta-1}{\\operatorname{ctg}\\beta+\\operatorname{ctg}\\alpha}$',
    ],
  },

  // ── Двойной ───────────────────────────────────────────────
  {
    id: 'sin2',
    group: 'Двойной угол',
    name: 'sin 2α',
    result: '$\\sin 2\\alpha=2\\sin\\alpha\\cos\\alpha$',
    chain: [
      '$\\sin 2\\alpha=\\sin(\\alpha+\\alpha)$',
      '$=\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha$',
      '$=2\\sin\\alpha\\cos\\alpha$',
    ],
  },
  {
    id: 'cos2',
    group: 'Двойной угол',
    name: 'cos 2α',
    result:
      '$\\cos 2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha=2\\cos^2\\alpha-1=1-2\\sin^2\\alpha$',
    chain: [
      '$\\cos 2\\alpha=\\cos(\\alpha+\\alpha)$',
      '$=\\cos\\alpha\\cos\\alpha-\\sin\\alpha\\sin\\alpha$',
      '$=\\cos^2\\alpha-\\sin^2\\alpha$',
      '$=(1-\\sin^2\\alpha)-\\sin^2\\alpha=1-2\\sin^2\\alpha$',
      '$=\\cos^2\\alpha-(1-\\cos^2\\alpha)=2\\cos^2\\alpha-1$',
    ],
  },
  {
    id: 'tg2',
    group: 'Двойной угол',
    name: 'tg 2α',
    result: '$\\operatorname{tg} 2\\alpha=\\dfrac{2\\operatorname{tg}\\alpha}{1-\\operatorname{tg}^2\\alpha}$',
    chain: [
      '$\\operatorname{tg} 2\\alpha=\\operatorname{tg}(\\alpha+\\alpha)$',
      '$=\\dfrac{\\operatorname{tg}\\alpha+\\operatorname{tg}\\alpha}{1-\\operatorname{tg}\\alpha\\operatorname{tg}\\alpha}$',
      '$=\\dfrac{2\\operatorname{tg}\\alpha}{1-\\operatorname{tg}^2\\alpha}$',
    ],
  },
  {
    id: 'ctg2',
    group: 'Двойной угол',
    name: 'ctg 2α',
    result: '$\\operatorname{ctg} 2\\alpha=\\dfrac{\\operatorname{ctg}^2\\alpha-1}{2\\operatorname{ctg}\\alpha}$',
    chain: [
      '$\\operatorname{ctg} 2\\alpha=\\dfrac{1}{\\operatorname{tg} 2\\alpha}$',
      '$=\\dfrac{1-\\operatorname{tg}^2\\alpha}{2\\operatorname{tg}\\alpha}$',
      '$=\\dfrac{\\dfrac{1}{\\operatorname{tg}^2\\alpha}-1}{\\dfrac{2}{\\operatorname{tg}\\alpha}}$',
      '$=\\dfrac{\\operatorname{ctg}^2\\alpha-1}{2\\operatorname{ctg}\\alpha}$',
    ],
  },

  // ── Понижение ─────────────────────────────────────────────
  {
    id: 'cos2-pow',
    group: 'Понижение степени',
    name: 'cos² α',
    result: '$\\cos^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{2}$',
    chain: [
      '$\\cos 2\\alpha=2\\cos^2\\alpha-1$',
      '$2\\cos^2\\alpha=1+\\cos 2\\alpha$',
      '$\\cos^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{2}$',
    ],
  },
  {
    id: 'sin2-pow',
    group: 'Понижение степени',
    name: 'sin² α',
    result: '$\\sin^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{2}$',
    chain: [
      '$\\cos 2\\alpha=1-2\\sin^2\\alpha$',
      '$2\\sin^2\\alpha=1-\\cos 2\\alpha$',
      '$\\sin^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{2}$',
    ],
  },
  {
    id: 'tg2-pow',
    group: 'Понижение степени',
    name: 'tg² α',
    result: '$\\operatorname{tg}^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{1+\\cos 2\\alpha}$',
    chain: [
      '$\\operatorname{tg}^2\\alpha=\\dfrac{\\sin^2\\alpha}{\\cos^2\\alpha}$',
      '$=\\dfrac{(1-\\cos 2\\alpha)/2}{(1+\\cos 2\\alpha)/2}$',
      '$=\\dfrac{1-\\cos 2\\alpha}{1+\\cos 2\\alpha}$',
    ],
  },
  {
    id: 'ctg2-pow',
    group: 'Понижение степени',
    name: 'ctg² α',
    result: '$\\operatorname{ctg}^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{1-\\cos 2\\alpha}$',
    chain: [
      '$\\operatorname{ctg}^2\\alpha=\\dfrac{1}{\\operatorname{tg}^2\\alpha}$',
      '$=\\dfrac{1+\\cos 2\\alpha}{1-\\cos 2\\alpha}$',
    ],
  },

  // ── Тройной ───────────────────────────────────────────────
  {
    id: 'sin3',
    group: 'Тройной угол',
    name: 'sin 3α',
    result: '$\\sin 3\\alpha=3\\sin\\alpha-4\\sin^3\\alpha$',
    chain: [
      '$\\sin 3\\alpha=\\sin(2\\alpha+\\alpha)$',
      '$=\\sin 2\\alpha\\cos\\alpha+\\cos 2\\alpha\\sin\\alpha$',
      '$=2\\sin\\alpha\\cos\\alpha\\cdot\\cos\\alpha+(1-2\\sin^2\\alpha)\\sin\\alpha$',
      '$=2\\sin\\alpha\\cos^2\\alpha+\\sin\\alpha-2\\sin^3\\alpha$',
      '$=2\\sin\\alpha(1-\\sin^2\\alpha)+\\sin\\alpha-2\\sin^3\\alpha$',
      '$=2\\sin\\alpha-2\\sin^3\\alpha+\\sin\\alpha-2\\sin^3\\alpha$',
      '$=3\\sin\\alpha-4\\sin^3\\alpha$',
    ],
  },
  {
    id: 'cos3',
    group: 'Тройной угол',
    name: 'cos 3α',
    result: '$\\cos 3\\alpha=4\\cos^3\\alpha-3\\cos\\alpha$',
    chain: [
      '$\\cos 3\\alpha=\\cos(2\\alpha+\\alpha)$',
      '$=\\cos 2\\alpha\\cos\\alpha-\\sin 2\\alpha\\sin\\alpha$',
      '$=(2\\cos^2\\alpha-1)\\cos\\alpha-2\\sin\\alpha\\cos\\alpha\\cdot\\sin\\alpha$',
      '$=2\\cos^3\\alpha-\\cos\\alpha-2\\sin^2\\alpha\\cos\\alpha$',
      '$=2\\cos^3\\alpha-\\cos\\alpha-2(1-\\cos^2\\alpha)\\cos\\alpha$',
      '$=2\\cos^3\\alpha-\\cos\\alpha-2\\cos\\alpha+2\\cos^3\\alpha$',
      '$=4\\cos^3\\alpha-3\\cos\\alpha$',
    ],
  },
  {
    id: 'tg3',
    group: 'Тройной угол',
    name: 'tg 3α',
    result:
      '$\\operatorname{tg} 3\\alpha=\\dfrac{3\\operatorname{tg}\\alpha-\\operatorname{tg}^3\\alpha}{1-3\\operatorname{tg}^2\\alpha}$',
    chain: [
      '$\\operatorname{tg} 3\\alpha=\\operatorname{tg}(2\\alpha+\\alpha)$',
      '$=\\dfrac{\\operatorname{tg} 2\\alpha+\\operatorname{tg}\\alpha}{1-\\operatorname{tg} 2\\alpha\\operatorname{tg}\\alpha}$',
      '$=\\dfrac{\\dfrac{2t}{1-t^2}+t}{1-\\dfrac{2t}{1-t^2}\\cdot t}\\quad(t=\\operatorname{tg}\\alpha)$',
      '$=\\dfrac{\\dfrac{2t+t(1-t^2)}{1-t^2}}{\\dfrac{1-t^2-2t^2}{1-t^2}}$',
      '$=\\dfrac{3t-t^3}{1-3t^2}$',
    ],
  },
  {
    id: 'ctg3',
    group: 'Тройной угол',
    name: 'ctg 3α',
    result:
      '$\\operatorname{ctg} 3\\alpha=\\dfrac{\\operatorname{ctg}^3\\alpha-3\\operatorname{ctg}\\alpha}{3\\operatorname{ctg}^2\\alpha-1}$',
    chain: [
      '$\\operatorname{ctg} 3\\alpha=\\dfrac{1}{\\operatorname{tg} 3\\alpha}$',
      '$=\\dfrac{1-3t^2}{3t-t^3}\\quad(t=\\operatorname{tg}\\alpha)$',
      '$=\\dfrac{\\operatorname{ctg}^3\\alpha-3\\operatorname{ctg}\\alpha}{3\\operatorname{ctg}^2\\alpha-1}$',
    ],
  },

  // ── Сумма → произведение ──────────────────────────────────
  {
    id: 's-sin',
    group: 'Сумма → произведение',
    name: 'sin α ± sin β',
    result:
      '$\\sin\\alpha\\pm\\sin\\beta=2\\sin\\dfrac{\\alpha\\pm\\beta}{2}\\cos\\dfrac{\\alpha\\mp\\beta}{2}$',
    chain: [
      '$s=\\dfrac{\\alpha+\\beta}{2},\\ d=\\dfrac{\\alpha-\\beta}{2}\\Rightarrow\\alpha=s+d,\\ \\beta=s-d$',
      '$\\sin\\alpha+\\sin\\beta=\\sin(s+d)+\\sin(s-d)$',
      '$=\\sin s\\cos d+\\cos s\\sin d+\\sin s\\cos d-\\cos s\\sin d$',
      '$=2\\sin s\\cos d$',
      '$=2\\sin\\dfrac{\\alpha+\\beta}{2}\\cos\\dfrac{\\alpha-\\beta}{2}$',
    ],
  },
  {
    id: 's-cosp',
    group: 'Сумма → произведение',
    name: 'cos α + cos β',
    result:
      '$\\cos\\alpha+\\cos\\beta=2\\cos\\dfrac{\\alpha+\\beta}{2}\\cos\\dfrac{\\alpha-\\beta}{2}$',
    chain: [
      '$\\cos\\alpha+\\cos\\beta=\\cos(s+d)+\\cos(s-d)$',
      '$=\\cos s\\cos d-\\sin s\\sin d+\\cos s\\cos d+\\sin s\\sin d$',
      '$=2\\cos s\\cos d$',
      '$=2\\cos\\dfrac{\\alpha+\\beta}{2}\\cos\\dfrac{\\alpha-\\beta}{2}$',
    ],
  },
  {
    id: 's-cosm',
    group: 'Сумма → произведение',
    name: 'cos α − cos β',
    result:
      '$\\cos\\alpha-\\cos\\beta=-2\\sin\\dfrac{\\alpha+\\beta}{2}\\sin\\dfrac{\\alpha-\\beta}{2}$',
    chain: [
      '$\\cos\\alpha-\\cos\\beta=\\cos(s+d)-\\cos(s-d)$',
      '$=-2\\sin s\\sin d$',
      '$=-2\\sin\\dfrac{\\alpha+\\beta}{2}\\sin\\dfrac{\\alpha-\\beta}{2}$',
    ],
  },
  {
    id: 's-tg',
    group: 'Сумма → произведение',
    name: 'tg α ± tg β',
    result:
      '$\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta=\\dfrac{\\sin(\\alpha\\pm\\beta)}{\\cos\\alpha\\cos\\beta}$',
    chain: [
      '$\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta=\\dfrac{\\sin\\alpha}{\\cos\\alpha}+\\dfrac{\\sin\\beta}{\\cos\\beta}$',
      '$=\\dfrac{\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta}{\\cos\\alpha\\cos\\beta}$',
      '$=\\dfrac{\\sin(\\alpha+\\beta)}{\\cos\\alpha\\cos\\beta}$',
    ],
  },
  {
    id: 's-ctg',
    group: 'Сумма → произведение',
    name: 'ctg α ± ctg β',
    result:
      '$\\operatorname{ctg}\\alpha\\pm\\operatorname{ctg}\\beta=\\dfrac{\\sin(\\beta\\pm\\alpha)}{\\sin\\alpha\\sin\\beta}$',
    chain: [
      '$\\operatorname{ctg}\\alpha+\\operatorname{ctg}\\beta=\\dfrac{\\cos\\alpha}{\\sin\\alpha}+\\dfrac{\\cos\\beta}{\\sin\\beta}$',
      '$=\\dfrac{\\cos\\alpha\\sin\\beta+\\sin\\alpha\\cos\\beta}{\\sin\\alpha\\sin\\beta}$',
      '$=\\dfrac{\\sin(\\beta+\\alpha)}{\\sin\\alpha\\sin\\beta}$',
    ],
  },

  // ── Произведение → сумма ──────────────────────────────────
  {
    id: 'p-ss',
    group: 'Произведение → сумма',
    name: 'sin α · sin β',
    result:
      '$\\sin\\alpha\\sin\\beta=\\dfrac{\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)}{2}$',
    chain: [
      '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$',
      '$\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$',
      '$\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)=2\\sin\\alpha\\sin\\beta$',
      '$\\sin\\alpha\\sin\\beta=\\dfrac{\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)}{2}$',
    ],
  },
  {
    id: 'p-sc',
    group: 'Произведение → сумма',
    name: 'sin α · cos β',
    result:
      '$\\sin\\alpha\\cos\\beta=\\dfrac{\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)}{2}$',
    chain: [
      '$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$',
      '$\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$',
      '$\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)=2\\sin\\alpha\\cos\\beta$',
      '$\\sin\\alpha\\cos\\beta=\\dfrac{\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)}{2}$',
    ],
  },
  {
    id: 'p-cc',
    group: 'Произведение → сумма',
    name: 'cos α · cos β',
    result:
      '$\\cos\\alpha\\cos\\beta=\\dfrac{\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta)}{2}$',
    chain: [
      '$\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta)=2\\cos\\alpha\\cos\\beta$',
      '$\\cos\\alpha\\cos\\beta=\\dfrac{\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta)}{2}$',
    ],
  },

  // ── Weierstrass ───────────────────────────────────────────
  {
    id: 'w-sin',
    group: 'Универсальная подстановка',
    name: 'sin через t',
    result: '$\\sin\\alpha=\\dfrac{2t}{1+t^2},\\ t=\\operatorname{tg}\\tfrac{\\alpha}{2}$',
    chain: [
      '$\\sin\\alpha=2\\sin\\tfrac{\\alpha}{2}\\cos\\tfrac{\\alpha}{2}$',
      '$=\\dfrac{2\\sin\\tfrac{\\alpha}{2}\\cos\\tfrac{\\alpha}{2}}{\\cos^2\\tfrac{\\alpha}{2}}\\Big/\\dfrac{1}{\\cos^2\\tfrac{\\alpha}{2}}$',
      '$=\\dfrac{2t}{1+t^2}$',
    ],
  },
  {
    id: 'w-cos',
    group: 'Универсальная подстановка',
    name: 'cos через t',
    result: '$\\cos\\alpha=\\dfrac{1-t^2}{1+t^2},\\ t=\\operatorname{tg}\\tfrac{\\alpha}{2}$',
    chain: [
      '$\\cos\\alpha=\\cos^2\\tfrac{\\alpha}{2}-\\sin^2\\tfrac{\\alpha}{2}$',
      '$=\\dfrac{\\cos^2\\tfrac{\\alpha}{2}-\\sin^2\\tfrac{\\alpha}{2}}{\\cos^2\\tfrac{\\alpha}{2}}\\Big/\\dfrac{1}{\\cos^2\\tfrac{\\alpha}{2}}$',
      '$=\\dfrac{1-t^2}{1+t^2}$',
    ],
  },
  {
    id: 'w-tg',
    group: 'Универсальная подстановка',
    name: 'tg через t',
    result: '$\\operatorname{tg}\\alpha=\\dfrac{2t}{1-t^2},\\ t=\\operatorname{tg}\\tfrac{\\alpha}{2}$',
    chain: [
      '$\\operatorname{tg}\\alpha=\\operatorname{tg}\\bigl(2\\cdot\\tfrac{\\alpha}{2}\\bigr)$',
      '$=\\dfrac{2t}{1-t^2}$',
    ],
  },
  {
    id: 'w-ctg',
    group: 'Универсальная подстановка',
    name: 'ctg через t',
    result: '$\\operatorname{ctg}\\alpha=\\dfrac{1-t^2}{2t},\\ t=\\operatorname{tg}\\tfrac{\\alpha}{2}$',
    chain: [
      '$\\operatorname{ctg}\\alpha=\\dfrac{1}{\\operatorname{tg}\\alpha}=\\dfrac{1-t^2}{2t}$',
    ],
  },
]
