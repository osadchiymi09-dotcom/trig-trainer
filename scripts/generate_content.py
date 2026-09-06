#!/usr/bin/env python3
"""Generate trig-trainer content.json from formula sheet topics + derivations."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "content.json"


def topic(**kwargs):
    kwargs.setdefault("diagrams", [])
    kwargs.setdefault("mnemonics", [])
    kwargs.setdefault("bookPages", "—")
    kwargs.setdefault("derive", [])
    return kwargs


def fc(tid, i, front, back, hint=None):
    d = {"id": f"{tid}-fc-{i}", "front": front, "back": back}
    if hint:
        d["hint"] = hint
    return d


def qz(tid, i, question, options, correct, explain):
    return {
        "id": f"{tid}-qz-{i}",
        "question": question,
        "options": options,
        "correct": correct,
        "explain": explain,
    }


def cz(tid, i, text, hint=None):
    d = {"id": f"{tid}-cz-{i}", "text": text}
    if hint:
        d["hint"] = hint
    return d


def der(tid, i, prompt, formula, steps):
    return {
        "id": f"{tid}-dr-{i}",
        "prompt": prompt,
        "formula": formula,
        "steps": steps,
    }


topics = []

# ── 1. Unit circle ──────────────────────────────────────────────
tid = "1"
topics.append(
    topic(
        id=tid,
        code="1",
        title="Единичная окружность и определения",
        section="1. База",
        why="Без окружности не выучишь ни знаки, ни приведение, ни табличные значения.",
        bookPages="лист 1",
        diagrams=["sheet-1"],
        conspect=[
            {
                "heading": "Определения на окружности",
                "bullets": [
                    "Единичная окружность: центр $(0;0)$, радиус $1$.",
                    "Точка $M(\\cos\\alpha;\\sin\\alpha)$ — конец радиус-вектора угла $\\alpha$.",
                    "$\\operatorname{tg}\\alpha$ — отрезок на касательной $x=1$; $\\operatorname{ctg}\\alpha$ — на $y=1$.",
                    "$\\operatorname{tg}\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$, $\\operatorname{ctg}\\alpha=\\dfrac{\\cos\\alpha}{\\sin\\alpha}$, $\\operatorname{tg}\\alpha\\cdot\\operatorname{ctg}\\alpha=1$.",
                ],
            },
            {
                "heading": "Градусы ↔ радианы",
                "bullets": [
                    "$\\alpha_{\\text{рад}}=\\alpha^\\circ\\cdot\\dfrac{\\pi}{180^\\circ}$.",
                    "$\\alpha^\\circ=\\alpha_{\\text{рад}}\\cdot\\dfrac{180^\\circ}{\\pi}$.",
                    "Полный оборот: $360^\\circ=2\\pi$.",
                ],
            },
            {
                "heading": "Таблица (запомни через геометрию)",
                "bullets": [
                    "$0$: $\\sin=0$, $\\cos=1$; $\\pi/6$: $\\sin=1/2$, $\\cos=\\sqrt{3}/2$.",
                    "$\\pi/4$: $\\sin=\\cos=\\sqrt{2}/2$; $\\pi/3$: $\\sin=\\sqrt{3}/2$, $\\cos=1/2$.",
                    "$\\pi/2$: $\\sin=1$, $\\cos=0$. Дальше — знаки по четвертям.",
                ],
            },
            {
                "heading": "Вывод: почему $\\operatorname{tg}=\\sin/\\cos$",
                "bullets": [
                    "На касательной $x=1$ луч угла пересекает её в точке $(1; t)$.",
                    "Подобие треугольников: $\\dfrac{t}{1}=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$ ⇒ $t=\\operatorname{tg}\\alpha$.",
                    "Аналогично для $\\operatorname{ctg}$ на горизонтальной касательной $y=1$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Координаты точки на единичной окружности?", "$(x;y)=(\\cos\\alpha;\\sin\\alpha)$"),
            fc(tid, 2, "Формула $\\operatorname{tg}\\alpha$?", "$\\operatorname{tg}\\alpha=\\sin\\alpha/\\cos\\alpha$"),
            fc(tid, 3, "Формула $\\operatorname{ctg}\\alpha$?", "$\\operatorname{ctg}\\alpha=\\cos\\alpha/\\sin\\alpha$"),
            fc(tid, 4, "$\\sin(\\pi/6)$ и $\\cos(\\pi/6)$?", "$1/2$ и $\\sqrt{3}/2$"),
            fc(tid, 5, "$\\sin(\\pi/4)$ и $\\cos(\\pi/4)$?", "$\\sqrt{2}/2$ и $\\sqrt{2}/2$"),
            fc(tid, 6, "$\\sin(\\pi/3)$ и $\\cos(\\pi/3)$?", "$\\sqrt{3}/2$ и $1/2$"),
            fc(tid, 7, "Как градусы → радианы?", "$\\alpha\\cdot\\pi/180$"),
            fc(tid, 8, "Почему $\\operatorname{tg}\\alpha\\cdot\\operatorname{ctg}\\alpha=1$?", "Потому что $(\\sin/\\cos)\\cdot(\\cos/\\sin)=1$"),
        ],
        quiz=[
            qz(tid, 1, "Точка на единичной окружности:", ["$(\\sin\\alpha;\\cos\\alpha)$", "$(\\cos\\alpha;\\sin\\alpha)$", "$(\\operatorname{tg}\\alpha;\\operatorname{ctg}\\alpha)$", "$(1;\\alpha)$"], 1, "По определению $x=\\cos$, $y=\\sin$."),
            qz(tid, 2, "$\\sin(\\pi/3)=$ ?", ["$1/2$", "$\\sqrt{2}/2$", "$\\sqrt{3}/2$", "$1$"], 2, "Угол $60^\\circ$: синус $\\sqrt{3}/2$."),
            qz(tid, 3, "$90^\\circ$ в радианах:", ["$\\pi$", "$\\pi/2$", "$\\pi/3$", "$2\\pi$"], 1, "$90\\cdot\\pi/180=\\pi/2$."),
        ],
        cloze=[
            cz(tid, 1, "На единичной окружности $x=[[\\cos\\alpha]]$, $y=[[\\sin\\alpha]]$."),
            cz(tid, 2, "$\\operatorname{tg}\\alpha=[[\\sin\\alpha/\\cos\\alpha]]$."),
            cz(tid, 3, "$\\alpha_{\\text{рад}}=\\alpha^\\circ\\cdot[[\\pi/180]]$."),
        ],
        recall=[
            "Нарисуй единичную окружность и отметь $\\pi/6,\\pi/4,\\pi/3,\\pi/2$.",
            "Объясни геометрически, что такое $\\operatorname{tg}\\alpha$.",
            "Переведи $150^\\circ$ в радианы и наоборот $\\dfrac{5\\pi}{6}$ в градусы.",
        ],
        mnemonics=["«Косинус — вдоль оси x, синус — вверх»", "Таблица: $0,1/2,\\sqrt{2}/2,\\sqrt{3}/2,1$ для sin от $0$ до $90^\\circ$"],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\operatorname{tg}\\alpha=\\sin\\alpha/\\cos\\alpha$ с окружности",
                "$\\operatorname{tg}\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$",
                [
                    "Возьми точку $M(\\cos\\alpha;\\sin\\alpha)$ на окружности.",
                    "Проведи касательную $x=1$; луч угла пересекает её в $(1;t)$.",
                    "Треугольники подобны: $\\dfrac{t}{1}=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$.",
                    "Значит $t=\\operatorname{tg}\\alpha=\\sin\\alpha/\\cos\\alpha$.",
                ],
            )
        ],
    )
)

# ── 2. Main identity ────────────────────────────────────────────
tid = "2"
topics.append(
    topic(
        id=tid,
        code="2",
        title="Основное тождество и следствия",
        section="1. База",
        why="Это Пифагор на окружности — из него почти всё остальное.",
        bookPages="лист 1",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin^2\\alpha+\\cos^2\\alpha=1$.",
                    "$\\sin\\alpha=\\pm\\sqrt{1-\\cos^2\\alpha}$, $\\cos\\alpha=\\pm\\sqrt{1-\\sin^2\\alpha}$.",
                    "$1+\\operatorname{tg}^2\\alpha=\\dfrac{1}{\\cos^2\\alpha}$ ($\\alpha\\neq\\pi/2+\\pi n$).",
                    "$1+\\operatorname{ctg}^2\\alpha=\\dfrac{1}{\\sin^2\\alpha}$ ($\\alpha\\neq\\pi n$).",
                ],
            },
            {
                "heading": "Вывод основного тождества",
                "bullets": [
                    "Точка $(\\cos\\alpha;\\sin\\alpha)$ лежит на окружности $x^2+y^2=1$.",
                    "Подставь: $\\cos^2\\alpha+\\sin^2\\alpha=1$.",
                ],
            },
            {
                "heading": "Вывод для тангенса",
                "bullets": [
                    "Раздели $\\sin^2+\\cos^2=1$ на $\\cos^2\\alpha$: $\\operatorname{tg}^2\\alpha+1=1/\\cos^2\\alpha$.",
                    "Аналогично деление на $\\sin^2$: $1+\\operatorname{ctg}^2=1/\\sin^2$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Основное тождество?", "$\\sin^2\\alpha+\\cos^2\\alpha=1$"),
            fc(tid, 2, "$1+\\operatorname{tg}^2\\alpha=$ ?", "$1/\\cos^2\\alpha$"),
            fc(tid, 3, "$1+\\operatorname{ctg}^2\\alpha=$ ?", "$1/\\sin^2\\alpha$"),
            fc(tid, 4, "Как получить $1+\\operatorname{tg}^2$ из основного?", "Разделить на $\\cos^2\\alpha$"),
            fc(tid, 5, "Откуда $\\sin^2+\\cos^2=1$?", "Из $x^2+y^2=1$ на единичной окружности"),
        ],
        quiz=[
            qz(tid, 1, "Если $\\cos\\alpha=3/5$ (I четв.), $\\sin\\alpha=$ ?", ["$4/5$", "$-4/5$", "$3/5$", "$5/3$"], 0, "$\\sin=\\sqrt{1-(3/5)^2}=4/5$."),
            qz(tid, 2, "$1+\\operatorname{tg}^2\\alpha$ равно:", ["$\\sin^2\\alpha$", "$1/\\cos^2\\alpha$", "$1/\\sin^2\\alpha$", "$\\cos^2\\alpha$"], 1, "Делим основное тождество на $\\cos^2$."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin^2\\alpha+\\cos^2\\alpha=[[1]]$."),
            cz(tid, 2, "$1+\\operatorname{tg}^2\\alpha=[[1/\\cos^2\\alpha]]$."),
        ],
        recall=[
            "Выведи $1+\\operatorname{tg}^2\\alpha=1/\\cos^2\\alpha$ вслух по шагам.",
            "Почему в $\\sin=\\pm\\sqrt{1-\\cos^2}$ есть два знака?",
        ],
        derive=[
            der(
                tid,
                1,
                "Выведи основное тождество",
                "$\\sin^2\\alpha+\\cos^2\\alpha=1$",
                [
                    "По определению точка $M(\\cos\\alpha;\\sin\\alpha)$ на окружности радиуса 1.",
                    "Уравнение окружности: $x^2+y^2=1$.",
                    "Подстановка даёт $\\cos^2\\alpha+\\sin^2\\alpha=1$.",
                ],
            ),
            der(
                tid,
                2,
                "Выведи $1+\\operatorname{tg}^2\\alpha=1/\\cos^2\\alpha$",
                "$1+\\operatorname{tg}^2\\alpha=\\dfrac{1}{\\cos^2\\alpha}$",
                [
                    "Старт: $\\sin^2\\alpha+\\cos^2\\alpha=1$.",
                    "Раздели обе части на $\\cos^2\\alpha$ (где $\\cos\\neq 0$).",
                    "Получи $\\operatorname{tg}^2\\alpha+1=1/\\cos^2\\alpha$.",
                ],
            ),
        ],
    )
)

# ── 3. Periodicity & parity ─────────────────────────────────────
tid = "3"
topics.append(
    topic(
        id=tid,
        code="3",
        title="Периодичность и чётность",
        section="1. База",
        why="Нужно для приведения углов и решений уравнений.",
        bookPages="лист 1",
        conspect=[
            {
                "heading": "Периоды",
                "bullets": [
                    "$\\sin$ и $\\cos$: наименьший период $T=2\\pi$.",
                    "$\\operatorname{tg}$ и $\\operatorname{ctg}$: наименьший период $T=\\pi$.",
                    "Вообще: $\\sin(x+2\\pi k)=\\sin x$, $\\operatorname{tg}(x+\\pi k)=\\operatorname{tg} x$.",
                ],
            },
            {
                "heading": "Чётность",
                "bullets": [
                    "$\\sin(-x)=-\\sin x$ — нечётная.",
                    "$\\cos(-x)=\\cos x$ — чётная.",
                    "$\\operatorname{tg}(-x)=-\\operatorname{tg} x$, $\\operatorname{ctg}(-x)=-\\operatorname{ctg} x$ — нечётные.",
                ],
            },
            {
                "heading": "Вывод чётности косинуса",
                "bullets": [
                    "Углы $x$ и $-x$ симметричны относительно оси $Ox$.",
                    "Одинаковая $x$-координата ⇒ $\\cos(-x)=\\cos x$.",
                    "$y$-координаты противоположны ⇒ $\\sin(-x)=-\\sin x$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Период $\\sin$ и $\\cos$?", "$2\\pi$"),
            fc(tid, 2, "Период $\\operatorname{tg}$ и $\\operatorname{ctg}$?", "$\\pi$"),
            fc(tid, 3, "$\\cos(-x)=$ ?", "$\\cos x$ (чётная)"),
            fc(tid, 4, "$\\sin(-x)=$ ?", "$-\\sin x$ (нечётная)"),
            fc(tid, 5, "$\\operatorname{tg}(-x)=$ ?", "$-\\operatorname{tg} x$"),
        ],
        quiz=[
            qz(tid, 1, "Наименьший период тангенса:", ["$2\\pi$", "$\\pi$", "$\\pi/2$", "$4\\pi$"], 1, "tg имеет период $\\pi$."),
            qz(tid, 2, "Какая функция чётная?", ["$\\sin$", "$\\cos$", "$\\operatorname{tg}$", "$\\operatorname{ctg}$"], 1, "Только косинус из «большой четвёрки» чётный."),
        ],
        cloze=[
            cz(tid, 1, "Период синуса — $[[2\\pi]]$."),
            cz(tid, 2, "$\\cos(-x)=[[\\cos x]]$."),
        ],
        recall=["Объясни на окружности, почему cos чётный, а sin нечётный.", "Почему у tg период $\\pi$, а не $2\\pi$?"],
        derive=[
            der(
                tid,
                1,
                "Объясни период тангенса $\\pi$",
                "$\\operatorname{tg}(x+\\pi)=\\operatorname{tg} x$",
                [
                    "$\\operatorname{tg}(x+\\pi)=\\sin(x+\\pi)/\\cos(x+\\pi)$.",
                    "$\\sin(x+\\pi)=-\\sin x$, $\\cos(x+\\pi)=-\\cos x$.",
                    "Минус на минус: $(-\\sin)/(-\\cos)=\\sin/\\cos=\\operatorname{tg} x$.",
                ],
            )
        ],
    )
)

# ── 4. Signs ────────────────────────────────────────────────────
tid = "4"
topics.append(
    topic(
        id=tid,
        code="4",
        title="Знаки тригонометрических функций",
        section="1. База",
        why="Критично для формул приведения и выбора знака корня.",
        bookPages="лист 2",
        diagrams=["sheet-2"],
        conspect=[
            {
                "heading": "По четвертям",
                "bullets": [
                    "$\\sin$: $+$ в I, II; $-$ в III, IV.",
                    "$\\cos$: $+$ в I, IV; $-$ в II, III.",
                    "$\\operatorname{tg},\\operatorname{ctg}$: $+$ в I, III; $-$ в II, IV.",
                ],
            },
            {
                "heading": "Как запомнить",
                "bullets": [
                    "Sin — «высота» (y): плюс сверху (I–II).",
                    "Cos — «вправо» (x): плюс справа (I, IV).",
                    "Tg = sin/cos: плюс, когда знаки одинаковы (I и III).",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Где $\\sin>0$?", "I и II четверти"),
            fc(tid, 2, "Где $\\cos>0$?", "I и IV четверти"),
            fc(tid, 3, "Где $\\operatorname{tg}>0$?", "I и III четверти"),
            fc(tid, 4, "Знак $\\cos$ во II четверти?", "−"),
            fc(tid, 5, "Знак $\\sin$ в IV четверти?", "−"),
        ],
        quiz=[
            qz(tid, 1, "Во II четверти положительны:", ["$\\sin$", "$\\cos$", "$\\operatorname{tg}$", "все"], 0, "Только синус > 0 во II."),
            qz(tid, 2, "В III четверти $\\operatorname{tg}$:", ["$>0$", "$<0$", "$=0$", "не определён"], 0, "sin и cos оба отрицательны ⇒ tg > 0."),
        ],
        cloze=[
            cz(tid, 1, "Синус положителен в четвертях [[I]] и [[II]]."),
            cz(tid, 2, "Косинус положителен в четвертях [[I]] и [[IV]]."),
        ],
        recall=["Нарисуй три круга со знаками sin, cos, tg.", "В какой четверти все три sin, cos, tg отрицательны? (нет такой — проверь)"],
        mnemonics=["All Students Take Calculus: All / Sin / Tg / Cos по четвертям (английская мнемоника)"],
        derive=[],
    )
)

# ── 5. Reduction ────────────────────────────────────────────────
tid = "5"
topics.append(
    topic(
        id=tid,
        code="5",
        title="Формулы приведения",
        section="2. Преобразования",
        why="Сводишь любой угол к острому — must-have для ЕГЭ/школы.",
        bookPages="лист 2",
        conspect=[
            {
                "heading": "Два правила",
                "bullets": [
                    "Знак справа = знак исходной функции в той четверти, куда попадает угол при $\\alpha\\in(0;\\pi/2)$.",
                    "Если сдвиг на $\\pi/2$ или $3\\pi/2$ — функция «меняется» (sin↔cos, tg↔ctg). Если на $\\pi$ или $2\\pi$ — имя то же.",
                ],
            },
            {
                "heading": "Ключевые примеры",
                "bullets": [
                    "$\\sin(\\pi/2-\\alpha)=\\cos\\alpha$, $\\cos(\\pi/2-\\alpha)=\\sin\\alpha$.",
                    "$\\sin(\\pi-\\alpha)=\\sin\\alpha$, $\\cos(\\pi-\\alpha)=-\\cos\\alpha$.",
                    "$\\sin(\\pi+\\alpha)=-\\sin\\alpha$, $\\cos(\\pi+\\alpha)=-\\cos\\alpha$.",
                    "$\\sin(2\\pi-\\alpha)=-\\sin\\alpha$, $\\cos(2\\pi-\\alpha)=\\cos\\alpha$.",
                ],
            },
            {
                "heading": "Вывод через сложение",
                "bullets": [
                    "$\\sin(\\pi/2-\\alpha)=\\sin(\\pi/2)\\cos\\alpha-\\cos(\\pi/2)\\sin\\alpha=1\\cdot\\cos\\alpha-0=\\cos\\alpha$.",
                    "$\\sin(\\pi-\\alpha)=\\sin\\pi\\cos\\alpha-\\cos\\pi\\sin\\alpha=0-(-1)\\sin\\alpha=\\sin\\alpha$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin(\\pi/2-\\alpha)=$ ?", "$\\cos\\alpha$"),
            fc(tid, 2, "$\\cos(\\pi/2-\\alpha)=$ ?", "$\\sin\\alpha$"),
            fc(tid, 3, "$\\sin(\\pi-\\alpha)=$ ?", "$\\sin\\alpha$"),
            fc(tid, 4, "$\\cos(\\pi-\\alpha)=$ ?", "$-\\cos\\alpha$"),
            fc(tid, 5, "$\\sin(\\pi+\\alpha)=$ ?", "$-\\sin\\alpha$"),
            fc(tid, 6, "$\\operatorname{tg}(\\pi-\\alpha)=$ ?", "$-\\operatorname{tg}\\alpha$"),
            fc(tid, 7, "Когда sin↔cos при приведении?", "При $\\pi/2\\pm\\alpha$ и $3\\pi/2\\pm\\alpha$"),
            fc(tid, 8, "Правило знака?", "Знак исходной функции в четверти угла"),
        ],
        quiz=[
            qz(tid, 1, "$\\sin(\\pi/2-\\alpha)=$ ?", ["$\\sin\\alpha$", "$\\cos\\alpha$", "$-\\sin\\alpha$", "$-\\cos\\alpha$"], 1, "Смена имени + знак «+» в I."),
            qz(tid, 2, "$\\cos(\\pi+\\alpha)=$ ?", ["$\\cos\\alpha$", "$-\\cos\\alpha$", "$\\sin\\alpha$", "$-\\sin\\alpha$"], 1, "Имя то же, II/III → cos отрицателен для $\\alpha$ острого."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin(\\pi/2-\\alpha)=[[\\cos\\alpha]]$."),
            cz(tid, 2, "$\\sin(\\pi-\\alpha)=[[\\sin\\alpha]]$."),
            cz(tid, 3, "При сдвиге на $\\pi/2$ функции [[меняются]] (sin↔cos)."),
        ],
        recall=[
            "Сформулируй два правила приведения.",
            "Выведи $\\sin(\\pi-\\alpha)$ через формулу сложения.",
        ],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin(\\pi/2-\\alpha)=\\cos\\alpha$",
                "$\\sin(\\pi/2-\\alpha)=\\cos\\alpha$",
                [
                    "Формула: $\\sin(a-b)=\\sin a\\cos b-\\cos a\\sin b$.",
                    "Подставь $a=\\pi/2$, $b=\\alpha$.",
                    "$\\sin(\\pi/2)=1$, $\\cos(\\pi/2)=0$ ⇒ $1\\cdot\\cos\\alpha-0=\\cos\\alpha$.",
                ],
            ),
            der(
                tid,
                2,
                "Выведи $\\sin(\\pi-\\alpha)=\\sin\\alpha$",
                "$\\sin(\\pi-\\alpha)=\\sin\\alpha$",
                [
                    "$\\sin(\\pi-\\alpha)=\\sin\\pi\\cos\\alpha-\\cos\\pi\\sin\\alpha$.",
                    "$\\sin\\pi=0$, $\\cos\\pi=-1$.",
                    "Получи $0-(-1)\\sin\\alpha=\\sin\\alpha$.",
                ],
            ),
        ],
    )
)

# ── 6. Addition ─────────────────────────────────────────────────
tid = "6"
topics.append(
    topic(
        id=tid,
        code="6",
        title="Формулы сложения аргументов",
        section="2. Преобразования",
        why="Материнские формулы: из них двойной угол, сумма↔произведение и т.д.",
        bookPages="лист 2",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin(\\alpha\\pm\\beta)=\\sin\\alpha\\cos\\beta\\pm\\cos\\alpha\\sin\\beta$.",
                    "$\\cos(\\alpha\\pm\\beta)=\\cos\\alpha\\cos\\beta\\mp\\sin\\alpha\\sin\\beta$.",
                    "$\\operatorname{tg}(\\alpha\\pm\\beta)=\\dfrac{\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta}{1\\mp\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$.",
                    "$\\operatorname{ctg}(\\alpha\\pm\\beta)=\\dfrac{\\operatorname{ctg}\\alpha\\operatorname{ctg}\\beta\\mp 1}{\\operatorname{ctg}\\beta\\pm\\operatorname{ctg}\\alpha}$.",
                ],
            },
            {
                "heading": "Вывод tg из sin/cos",
                "bullets": [
                    "$\\operatorname{tg}(\\alpha+\\beta)=\\dfrac{\\sin(\\alpha+\\beta)}{\\cos(\\alpha+\\beta)}$.",
                    "Подставь формулы sin/cos, раздели числитель и знаменатель на $\\cos\\alpha\\cos\\beta$.",
                    "Получи $\\dfrac{\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta}{1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$.",
                ],
            },
            {
                "heading": "Идея геометрического вывода sin(α+β)",
                "bullets": [
                    "Можно через площадь/проекции или через формулу косинуса угла между векторами.",
                    "На ЕГЭ достаточно уметь применять и выводить следствия из сложения.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin(\\alpha+\\beta)=$ ?", "$\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$"),
            fc(tid, 2, "$\\cos(\\alpha+\\beta)=$ ?", "$\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$"),
            fc(tid, 3, "$\\sin(\\alpha-\\beta)=$ ?", "$\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$"),
            fc(tid, 4, "$\\cos(\\alpha-\\beta)=$ ?", "$\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$"),
            fc(tid, 5, "$\\operatorname{tg}(\\alpha+\\beta)=$ ?", "$(\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta)/(1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta)$"),
            fc(tid, 6, "Знаки в $\\cos(\\alpha\\pm\\beta)$?", "∓ перед произведением синусов"),
        ],
        quiz=[
            qz(tid, 1, "$\\cos(\\alpha+\\beta)=$ ?", ["$\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$", "$\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$", "$\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$", "$\\sin\\alpha\\sin\\beta-\\cos\\alpha\\cos\\beta$"], 1, "Минус у произведения синусов."),
            qz(tid, 2, "Знаменатель $\\operatorname{tg}(\\alpha+\\beta)$:", ["$1+\\operatorname{tg}\\alpha\\operatorname{tg}\\beta$", "$1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta$", "$\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta$", "$\\cos\\alpha\\cos\\beta$"], 1, "1 минус произведение тангенсов."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta [[+]] \\cos\\alpha\\sin\\beta$."),
            cz(tid, 2, "$\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta [[-]] \\sin\\alpha\\sin\\beta$."),
        ],
        recall=["Напиши все четыре формулы sin/cos сложения по памяти.", "Выведи tg(α+β) из sin/cos."],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\operatorname{tg}(\\alpha+\\beta)$ из sin/cos",
                "$\\operatorname{tg}(\\alpha+\\beta)=\\dfrac{\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta}{1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta}$",
                [
                    "Запиши $\\operatorname{tg}(\\alpha+\\beta)=\\sin(\\alpha+\\beta)/\\cos(\\alpha+\\beta)$.",
                    "Раскрой числитель и знаменатель формулами сложения.",
                    "Раздели числитель и знаменатель на $\\cos\\alpha\\cos\\beta$.",
                    "Получи $(\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta)/(1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta)$.",
                ],
            )
        ],
    )
)

# ── 7. Double angle ─────────────────────────────────────────────
tid = "7"
topics.append(
    topic(
        id=tid,
        code="7",
        title="Формулы двойного угла",
        section="2. Преобразования",
        why="Частый приём в уравнениях и упрощениях.",
        bookPages="лист 2",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin 2\\alpha=2\\sin\\alpha\\cos\\alpha$.",
                    "$\\cos 2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha=2\\cos^2\\alpha-1=1-2\\sin^2\\alpha$.",
                    "$\\operatorname{tg} 2\\alpha=\\dfrac{2\\operatorname{tg}\\alpha}{1-\\operatorname{tg}^2\\alpha}$.",
                    "$\\operatorname{ctg} 2\\alpha=\\dfrac{\\operatorname{ctg}^2\\alpha-1}{2\\operatorname{ctg}\\alpha}$.",
                ],
            },
            {
                "heading": "Выводы",
                "bullets": [
                    "$\\sin 2\\alpha=\\sin(\\alpha+\\alpha)=\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha=2\\sin\\alpha\\cos\\alpha$.",
                    "$\\cos 2\\alpha=\\cos\\alpha\\cos\\alpha-\\sin\\alpha\\sin\\alpha=\\cos^2-\\sin^2$.",
                    "Через $\\cos^2+\\sin^2=1$: $\\cos 2\\alpha=2\\cos^2-1=1-2\\sin^2$.",
                    "tg: подставь $\\beta=\\alpha$ в формулу $\\operatorname{tg}(\\alpha+\\beta)$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin 2\\alpha=$ ?", "$2\\sin\\alpha\\cos\\alpha$"),
            fc(tid, 2, "$\\cos 2\\alpha$ (три вида)?", "$\\cos^2-\\sin^2=2\\cos^2-1=1-2\\sin^2$"),
            fc(tid, 3, "$\\operatorname{tg} 2\\alpha=$ ?", "$2\\operatorname{tg}\\alpha/(1-\\operatorname{tg}^2\\alpha)$"),
            fc(tid, 4, "Как получить $\\sin 2\\alpha$?", "Сложение с $\\beta=\\alpha$"),
            fc(tid, 5, "$\\cos 2\\alpha$ через только sin?", "$1-2\\sin^2\\alpha$"),
        ],
        quiz=[
            qz(tid, 1, "$\\sin 2\\alpha=$ ?", ["$\\sin^2\\alpha$", "$2\\sin\\alpha\\cos\\alpha$", "$\\cos^2-\\sin^2$", "$2\\operatorname{tg}\\alpha$"], 1, "Двойной синус — произведение."),
            qz(tid, 2, "$\\cos 2\\alpha=1-2\\sin^2\\alpha$ верно?", ["Да", "Нет", "Только для острых", "Только в радианах"], 0, "Да, следствие основного тождества."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin 2\\alpha=[[2\\sin\\alpha\\cos\\alpha]]$."),
            cz(tid, 2, "$\\cos 2\\alpha=[[\\cos^2\\alpha-\\sin^2\\alpha]]$."),
        ],
        recall=["Выведи все три формы cos 2α.", "Получи tg 2α из tg(α+β)."],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin 2\\alpha$",
                "$\\sin 2\\alpha=2\\sin\\alpha\\cos\\alpha$",
                [
                    "Запиши $\\sin(\\alpha+\\alpha)$.",
                    "Раскрой: $\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha$.",
                    "Сложи: $2\\sin\\alpha\\cos\\alpha$.",
                ],
            ),
            der(
                tid,
                2,
                "Выведи $\\cos 2\\alpha=1-2\\sin^2\\alpha$",
                "$\\cos 2\\alpha=1-2\\sin^2\\alpha$",
                [
                    "Сначала $\\cos 2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha$.",
                    "Замени $\\cos^2=1-\\sin^2$: $(1-\\sin^2)-\\sin^2=1-2\\sin^2$.",
                ],
            ),
        ],
    )
)

# ── 8. Power reduction ──────────────────────────────────────────
tid = "8"
topics.append(
    topic(
        id=tid,
        code="8",
        title="Формулы понижения степени",
        section="2. Преобразования",
        why="Убирают квадраты — удобно в интегралах и уравнениях.",
        bookPages="лист 2",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\cos^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{2}$.",
                    "$\\sin^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{2}$.",
                    "$\\operatorname{tg}^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{1+\\cos 2\\alpha}$.",
                    "$\\operatorname{ctg}^2\\alpha=\\dfrac{1+\\cos 2\\alpha}{1-\\cos 2\\alpha}$.",
                ],
            },
            {
                "heading": "Вывод",
                "bullets": [
                    "Из $\\cos 2\\alpha=2\\cos^2\\alpha-1$ вырази $\\cos^2\\alpha$.",
                    "Из $\\cos 2\\alpha=1-2\\sin^2\\alpha$ вырази $\\sin^2\\alpha$.",
                    "tg² = sin²/cos² = отношение двух предыдущих.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin^2\\alpha=$ ?", "$(1-\\cos 2\\alpha)/2$"),
            fc(tid, 2, "$\\cos^2\\alpha=$ ?", "$(1+\\cos 2\\alpha)/2$"),
            fc(tid, 3, "$\\operatorname{tg}^2\\alpha=$ ?", "$(1-\\cos 2\\alpha)/(1+\\cos 2\\alpha)$"),
            fc(tid, 4, "Откуда берётся понижение степени?", "Из формул cos 2α"),
        ],
        quiz=[
            qz(tid, 1, "$\\sin^2\\alpha=$ ?", ["$(1+\\cos 2\\alpha)/2$", "$(1-\\cos 2\\alpha)/2$", "$2\\sin\\alpha\\cos\\alpha$", "$1-\\cos\\alpha$"], 1, "Минус у косинуса двойного угла."),
        ],
        cloze=[
            cz(tid, 1, "$\\cos^2\\alpha=(1[[+]]\\cos 2\\alpha)/2$."),
            cz(tid, 2, "$\\sin^2\\alpha=(1[[-]]\\cos 2\\alpha)/2$."),
        ],
        recall=["Выведи $\\sin^2$ и $\\cos^2$ из двойного угла."],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin^2\\alpha=(1-\\cos 2\\alpha)/2$",
                "$\\sin^2\\alpha=\\dfrac{1-\\cos 2\\alpha}{2}$",
                [
                    "Возьми $\\cos 2\\alpha=1-2\\sin^2\\alpha$.",
                    "Перенеси: $2\\sin^2\\alpha=1-\\cos 2\\alpha$.",
                    "Раздели на 2.",
                ],
            )
        ],
    )
)

# ── 9. Triple ───────────────────────────────────────────────────
tid = "9"
topics.append(
    topic(
        id=tid,
        code="9",
        title="Формулы тройного угла",
        section="2. Преобразования",
        why="Реже, но встречаются; вывод тренирует сложение.",
        bookPages="лист 2",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin 3\\alpha=3\\sin\\alpha-4\\sin^3\\alpha$.",
                    "$\\cos 3\\alpha=4\\cos^3\\alpha-3\\cos\\alpha$.",
                    "$\\operatorname{tg} 3\\alpha=\\dfrac{3\\operatorname{tg}\\alpha-\\operatorname{tg}^3\\alpha}{1-3\\operatorname{tg}^2\\alpha}$.",
                    "$\\operatorname{ctg} 3\\alpha=\\dfrac{\\operatorname{ctg}^3\\alpha-3\\operatorname{ctg}\\alpha}{3\\operatorname{ctg}^2\\alpha-1}$.",
                ],
            },
            {
                "heading": "Вывод sin 3α",
                "bullets": [
                    "$\\sin 3\\alpha=\\sin(2\\alpha+\\alpha)=\\sin 2\\alpha\\cos\\alpha+\\cos 2\\alpha\\sin\\alpha$.",
                    "Подставь $\\sin 2\\alpha=2\\sin\\cos$, $\\cos 2\\alpha=1-2\\sin^2$.",
                    "Упрости до $3\\sin\\alpha-4\\sin^3\\alpha$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin 3\\alpha=$ ?", "$3\\sin\\alpha-4\\sin^3\\alpha$"),
            fc(tid, 2, "$\\cos 3\\alpha=$ ?", "$4\\cos^3\\alpha-3\\cos\\alpha$"),
            fc(tid, 3, "Идея вывода тройного угла?", "$\\sin(2\\alpha+\\alpha)$ / $\\cos(2\\alpha+\\alpha)$"),
        ],
        quiz=[
            qz(tid, 1, "$\\sin 3\\alpha=$ ?", ["$3\\sin-4\\sin^3$", "$4\\cos^3-3\\cos$", "$2\\sin\\cos$", "$3\\operatorname{tg}-\\operatorname{tg}^3$"], 0, "Классическая форма через sin."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin 3\\alpha=3\\sin\\alpha-[[4\\sin^3\\alpha]]$."),
            cz(tid, 2, "$\\cos 3\\alpha=[[4\\cos^3\\alpha]]-3\\cos\\alpha$."),
        ],
        recall=["Выведи sin 3α из двойного + сложения."],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin 3\\alpha$",
                "$\\sin 3\\alpha=3\\sin\\alpha-4\\sin^3\\alpha$",
                [
                    "Запиши $\\sin(2\\alpha+\\alpha)=\\sin 2\\alpha\\cos\\alpha+\\cos 2\\alpha\\sin\\alpha$.",
                    "Подставь $2\\sin\\cos$ и $1-2\\sin^2$.",
                    "Раскрой: $2\\sin\\cos^2+\\sin-2\\sin^3$.",
                    "Замени $\\cos^2=1-\\sin^2$: $2\\sin(1-\\sin^2)+\\sin-2\\sin^3=3\\sin-4\\sin^3$.",
                ],
            )
        ],
    )
)

# ── 10. Sum to product ──────────────────────────────────────────
tid = "10"
topics.append(
    topic(
        id=tid,
        code="10",
        title="Сумма → произведение",
        section="3. Суммы и произведения",
        why="Упрощают уравнения вида sin A ± sin B = 0.",
        bookPages="лист 3",
        diagrams=["sheet-3"],
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin\\alpha\\pm\\sin\\beta=2\\sin\\dfrac{\\alpha\\pm\\beta}{2}\\cos\\dfrac{\\alpha\\mp\\beta}{2}$.",
                    "$\\cos\\alpha+\\cos\\beta=2\\cos\\dfrac{\\alpha+\\beta}{2}\\cos\\dfrac{\\alpha-\\beta}{2}$.",
                    "$\\cos\\alpha-\\cos\\beta=-2\\sin\\dfrac{\\alpha+\\beta}{2}\\sin\\dfrac{\\alpha-\\beta}{2}$.",
                    "$\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta=\\dfrac{\\sin(\\alpha\\pm\\beta)}{\\cos\\alpha\\cos\\beta}$.",
                    "$\\operatorname{ctg}\\alpha\\pm\\operatorname{ctg}\\beta=\\dfrac{\\sin(\\beta\\pm\\alpha)}{\\sin\\alpha\\sin\\beta}$.",
                ],
            },
            {
                "heading": "Вывод (схема)",
                "bullets": [
                    "Обозначь $s=(\\alpha+\\beta)/2$, $d=(\\alpha-\\beta)/2$, тогда $\\alpha=s+d$, $\\beta=s-d$.",
                    "$\\sin\\alpha+\\sin\\beta=\\sin(s+d)+\\sin(s-d)=2\\sin s\\cos d$.",
                    "Аналогично для остальных через формулы сложения.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin\\alpha+\\sin\\beta=$ ?", "$2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$"),
            fc(tid, 2, "$\\sin\\alpha-\\sin\\beta=$ ?", "$2\\sin\\frac{\\alpha-\\beta}{2}\\cos\\frac{\\alpha+\\beta}{2}$"),
            fc(tid, 3, "$\\cos\\alpha+\\cos\\beta=$ ?", "$2\\cos\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$"),
            fc(tid, 4, "$\\cos\\alpha-\\cos\\beta=$ ?", "$-2\\sin\\frac{\\alpha+\\beta}{2}\\sin\\frac{\\alpha-\\beta}{2}$"),
            fc(tid, 5, "Ключ вывода сумма→произведение?", "Замена $s=(\\alpha+\\beta)/2$, $d=(\\alpha-\\beta)/2$"),
        ],
        quiz=[
            qz(tid, 1, "$\\cos\\alpha-\\cos\\beta=$ ?", ["$2\\sin\\ldots$", "$-2\\sin\\frac{\\alpha+\\beta}{2}\\sin\\frac{\\alpha-\\beta}{2}$", "$2\\cos\\ldots$", "$\\sin(\\alpha-\\beta)$"], 1, "Минус и два синуса."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin\\alpha+\\sin\\beta=2\\sin\\frac{\\alpha+\\beta}{2}\\cos\\frac{\\alpha-\\beta}{2}$ — верно? Напиши ключевое слово [[верно]]."),
            cz(tid, 2, "В $\\cos\\alpha-\\cos\\beta$ стоит множитель [[-2]]."),
        ],
        recall=["Выведи sinα+sinβ через подстановку s,d.", "Чем отличается cosα−cosβ от cosα+cosβ?"],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin\\alpha+\\sin\\beta$",
                "$\\sin\\alpha+\\sin\\beta=2\\sin\\dfrac{\\alpha+\\beta}{2}\\cos\\dfrac{\\alpha-\\beta}{2}$",
                [
                    "Пусть $s=(\\alpha+\\beta)/2$, $d=(\\alpha-\\beta)/2$.",
                    "Тогда $\\alpha=s+d$, $\\beta=s-d$.",
                    "$\\sin(s+d)+\\sin(s-d)=(\\sin s\\cos d+\\cos s\\sin d)+(\\sin s\\cos d-\\cos s\\sin d)$.",
                    "Сокращение: $2\\sin s\\cos d$.",
                ],
            )
        ],
    )
)

# ── 11. Product to sum ──────────────────────────────────────────
tid = "11"
topics.append(
    topic(
        id=tid,
        code="11",
        title="Произведение → сумма",
        section="3. Суммы и произведения",
        why="Обратное преобразование; тоже из сложения.",
        bookPages="лист 3",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin\\alpha\\sin\\beta=\\dfrac{1}{2}(\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta))$.",
                    "$\\cos\\alpha\\cos\\beta=\\dfrac{1}{2}(\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta))$.",
                    "$\\sin\\alpha\\cos\\beta=\\dfrac{1}{2}(\\sin(\\alpha-\\beta)+\\sin(\\alpha+\\beta))$.",
                ],
            },
            {
                "heading": "Вывод",
                "bullets": [
                    "Сложи/вычти формулы $\\cos(a\\pm b)$: получи произведения cos и sin.",
                    "Например $\\cos(a-b)-\\cos(a+b)=2\\sin a\\sin b$ ⇒ раздели на 2.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin\\alpha\\sin\\beta=$ ?", "$\\frac12(\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta))$"),
            fc(tid, 2, "$\\cos\\alpha\\cos\\beta=$ ?", "$\\frac12(\\cos(\\alpha-\\beta)+\\cos(\\alpha+\\beta))$"),
            fc(tid, 3, "$\\sin\\alpha\\cos\\beta=$ ?", "$\\frac12(\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta))$"),
        ],
        quiz=[
            qz(tid, 1, "В $\\sin\\alpha\\sin\\beta$ стоит:", ["сумма косинусов", "разность косинусов", "сумма синусов", "разность синусов"], 1, "cos(α−β) − cos(α+β)."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin\\alpha\\sin\\beta=\\frac12(\\cos(\\alpha-\\beta)[[-]]\\cos(\\alpha+\\beta))$."),
        ],
        recall=["Выведи sinα sinβ из разности косинусов."],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin\\alpha\\sin\\beta$",
                "$\\sin\\alpha\\sin\\beta=\\dfrac{\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)}{2}$",
                [
                    "Запиши $\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$.",
                    "Запиши $\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$.",
                    "Вычти второе из первого: $2\\sin\\alpha\\sin\\beta$.",
                    "Раздели на 2.",
                ],
            )
        ],
    )
)

# ── 12. Weierstrass ─────────────────────────────────────────────
tid = "12"
topics.append(
    topic(
        id=tid,
        code="12",
        title="Универсальная подстановка",
        section="3. Суммы и произведения",
        why="Переводит тригонометрию в рациональные дроби от $t=\\operatorname{tg}(\\alpha/2)$.",
        bookPages="лист 3",
        conspect=[
            {
                "heading": "Формулы ($t=\\operatorname{tg}\\frac{\\alpha}{2}$)",
                "bullets": [
                    "$\\sin\\alpha=\\dfrac{2t}{1+t^2}$.",
                    "$\\cos\\alpha=\\dfrac{1-t^2}{1+t^2}$.",
                    "$\\operatorname{tg}\\alpha=\\dfrac{2t}{1-t^2}$.",
                    "$\\operatorname{ctg}\\alpha=\\dfrac{1-t^2}{2t}$.",
                ],
            },
            {
                "heading": "Вывод",
                "bullets": [
                    "$\\sin\\alpha=2\\sin(\\alpha/2)\\cos(\\alpha/2)$; раздели числитель и знаменатель на $\\cos^2(\\alpha/2)$.",
                    "Числитель → $2t$, знаменатель → $1+t^2$ (т.к. $1+\\operatorname{tg}^2=1/\\cos^2$).",
                    "Аналогично для cos: $\\cos^2-\\sin^2$ после деления на $\\cos^2$ даёт $(1-t^2)/(1+t^2)$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "$\\sin\\alpha$ через $t=\\operatorname{tg}(\\alpha/2)$?", "$2t/(1+t^2)$"),
            fc(tid, 2, "$\\cos\\alpha$ через $t$?", "$(1-t^2)/(1+t^2)$"),
            fc(tid, 3, "$\\operatorname{tg}\\alpha$ через $t$?", "$2t/(1-t^2)$"),
            fc(tid, 4, "Что такое универсальная подстановка?", "$t=\\operatorname{tg}(\\alpha/2)$"),
        ],
        quiz=[
            qz(tid, 1, "$\\sin\\alpha$ при $t=\\operatorname{tg}(\\alpha/2)$:", ["$(1-t^2)/(1+t^2)$", "$2t/(1+t^2)$", "$2t/(1-t^2)$", "$t$"], 1, "Классическая формула Вейерштрасса."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin\\alpha=[[2t]]/(1+t^2)$, где $t=\\operatorname{tg}(\\alpha/2)$."),
            cz(tid, 2, "$\\cos\\alpha=(1-t^2)/[[1+t^2]]$."),
        ],
        recall=["Выведи sin и cos через t=tg(α/2)."],
        derive=[
            der(
                tid,
                1,
                "Выведи $\\sin\\alpha=2t/(1+t^2)$",
                "$\\sin\\alpha=\\dfrac{2t}{1+t^2},\\ t=\\operatorname{tg}\\frac{\\alpha}{2}$",
                [
                    "Запиши $\\sin\\alpha=2\\sin(\\alpha/2)\\cos(\\alpha/2)$.",
                    "Раздели числитель и знаменатель на $\\cos^2(\\alpha/2)$.",
                    "Числитель: $2\\operatorname{tg}(\\alpha/2)=2t$.",
                    "Знаменатель: $1+\\operatorname{tg}^2(\\alpha/2)=1+t^2$.",
                ],
            )
        ],
    )
)

# ── 13. Auxiliary ───────────────────────────────────────────────
tid = "13"
topics.append(
    topic(
        id=tid,
        code="13",
        title="Вспомогательный аргумент",
        section="4. Уравнения и обратные",
        why="Сводит $a\\sin x+b\\cos x$ к одному синусу/косинусу.",
        bookPages="лист 3",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$a\\sin x\\pm b\\cos x=\\sqrt{a^2+b^2}\\,\\sin\\big(x\\pm\\arcsin\\frac{b}{\\sqrt{a^2+b^2}}\\big)$.",
                    "$a\\sin x\\pm b\\cos x=\\pm\\sqrt{a^2+b^2}\\,\\cos\\big(x\\mp\\arccos\\frac{b}{\\sqrt{a^2+b^2}}\\big)$.",
                ],
            },
            {
                "heading": "Вывод идеи",
                "bullets": [
                    "Вынеси $\\sqrt{a^2+b^2}$: $\\sqrt{a^2+b^2}\\big(\\frac{a}{R}\\sin x\\pm\\frac{b}{R}\\cos x\\big)$, $R=\\sqrt{a^2+b^2}$.",
                    "Найди угол $\\varphi$: $\\cos\\varphi=a/R$, $\\sin\\varphi=b/R$ (или наоборот).",
                    "Тогда скобка = $\\sin(x\\pm\\varphi)$ или $\\cos(x\\mp\\varphi)$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Амплитуда $a\\sin x+b\\cos x$?", "$\\sqrt{a^2+b^2}$"),
            fc(tid, 2, "Идея метода?", "Вынести $\\sqrt{a^2+b^2}$ и ввести угол $\\varphi$"),
            fc(tid, 3, "Зачем вспомогательный аргумент?", "Свести к одному sin или cos"),
        ],
        quiz=[
            qz(tid, 1, "Коэффициент перед sin/cos после свёртки:", ["$a+b$", "$\\sqrt{a^2+b^2}$", "$ab$", "$a/b$"], 1, "Норма вектора (a,b)."),
        ],
        cloze=[
            cz(tid, 1, "$a\\sin x+b\\cos x$ имеет амплитуду $[[\\sqrt{a^2+b^2}]]$."),
        ],
        recall=["Объясни метод вспомогательного аргумента на примере 3sin x + 4 cos x."],
        derive=[
            der(
                tid,
                1,
                "Сверни $a\\sin x+b\\cos x$",
                "$a\\sin x+b\\cos x=R\\sin(x+\\varphi)$, $R=\\sqrt{a^2+b^2}$",
                [
                    "Вынеси $R=\\sqrt{a^2+b^2}$.",
                    "Получи $R\\big((a/R)\\sin x+(b/R)\\cos x\\big)$.",
                    "Выбери $\\varphi$: $\\cos\\varphi=a/R$, $\\sin\\varphi=b/R$.",
                    "Скобка = $\\sin x\\cos\\varphi+\\cos x\\sin\\varphi=\\sin(x+\\varphi)$.",
                ],
            )
        ],
    )
)

# ── 14. Inverse ─────────────────────────────────────────────────
tid = "14"
topics.append(
    topic(
        id=tid,
        code="14",
        title="Обратные тригонометрические функции",
        section="4. Уравнения и обратные",
        why="Без областей значений нельзя писать общий вид уравнений.",
        bookPages="лист 3",
        conspect=[
            {
                "heading": "Определения и области значений",
                "bullets": [
                    "$\\arcsin a\\in[-\\pi/2;\\pi/2]$, $\\arcsin(-a)=-\\arcsin a$.",
                    "$\\arccos a\\in[0;\\pi]$, $\\arccos(-a)=\\pi-\\arccos a$.",
                    "$\\operatorname{arctg} a\\in(-\\pi/2;\\pi/2)$, нечётная.",
                    "$\\operatorname{arcctg} a\\in(0;\\pi)$, $\\operatorname{arcctg}(-a)=\\pi-\\operatorname{arcctg} a$.",
                ],
            },
            {
                "heading": "Смысл",
                "bullets": [
                    "Если $\\sin x=a$, то одно из решений $x=\\arcsin a$ (главное значение).",
                    "Остальные решения — через периодичность и симметрию.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Область значений arcsin?", "$[-\\pi/2;\\pi/2]$"),
            fc(tid, 2, "Область значений arccos?", "$[0;\\pi]$"),
            fc(tid, 3, "Область значений arctg?", "$(-\\pi/2;\\pi/2)$"),
            fc(tid, 4, "Область значений arcctg?", "$(0;\\pi)$"),
            fc(tid, 5, "$\\arcsin(-a)=$ ?", "$-\\arcsin a$"),
            fc(tid, 6, "$\\arccos(-a)=$ ?", "$\\pi-\\arccos a$"),
        ],
        quiz=[
            qz(tid, 1, "$\\arccos(-a)=$ ?", ["$-\\arccos a$", "$\\pi-\\arccos a$", "$\\arcsin a$", "$\\pi/2$"], 1, "Стандартное тождество."),
            qz(tid, 2, "arctg принимает значения:", ["$[0;\\pi]$", "$(-\\pi/2;\\pi/2)$", "$[-\\pi/2;\\pi/2]$", "$\\mathbb{R}$"], 1, "Открытый интервал."),
        ],
        cloze=[
            cz(tid, 1, "Область значений arcsin — от $-\\pi/2$ до $\\pi/2$. Ключ: [[arcsin]]."),
            cz(tid, 2, "$\\arccos(-a)=[[\\pi-\\arccos a]]$."),
        ],
        recall=["Перечисли области значений всех четырёх обратных функций.", "Почему arcsin нечётный, а arccos — нет?"],
        derive=[],
    )
)

# ── 15. Equations ───────────────────────────────────────────────
tid = "15"
topics.append(
    topic(
        id=tid,
        code="15",
        title="Общий вид тригонометрических уравнений",
        section="4. Уравнения и обратные",
        why="Финал: связать формулы с решением уравнений.",
        bookPages="лист 3",
        conspect=[
            {
                "heading": "Формулы",
                "bullets": [
                    "$\\sin x=a$ ⇒ $x=(-1)^k\\arcsin a+\\pi k$, $k\\in\\mathbb{Z}$.",
                    "$\\cos x=a$ ⇒ $x=\\pm\\arccos a+2\\pi k$.",
                    "$\\operatorname{tg} x=a$ ⇒ $x=\\operatorname{arctg} a+\\pi k$.",
                    "$\\operatorname{ctg} x=a$ ⇒ $x=\\operatorname{arcctg} a+\\pi k$.",
                ],
            },
            {
                "heading": "Откуда берётся серия для sin",
                "bullets": [
                    "На окружности два угла с данным синусом: $\\arcsin a$ и $\\pi-\\arcsin a$.",
                    "Плюс период $2\\pi$. Объединение даёт компактную запись с $(-1)^k$.",
                ],
            },
            {
                "heading": "Для cos",
                "bullets": [
                    "Два угла: $\\pm\\arccos a$, плюс период $2\\pi$.",
                ],
            },
        ],
        flashcards=[
            fc(tid, 1, "Общий вид $\\sin x=a$?", "$x=(-1)^k\\arcsin a+\\pi k$"),
            fc(tid, 2, "Общий вид $\\cos x=a$?", "$x=\\pm\\arccos a+2\\pi k$"),
            fc(tid, 3, "Общий вид $\\operatorname{tg} x=a$?", "$x=\\operatorname{arctg} a+\\pi k$"),
            fc(tid, 4, "Общий вид $\\operatorname{ctg} x=a$?", "$x=\\operatorname{arcctg} a+\\pi k$"),
            fc(tid, 5, "Почему у sin множитель $(-1)^k$?", "Чередует arcsin и π−arcsin"),
        ],
        quiz=[
            qz(tid, 1, "Решение $\\sin x=a$:", ["$\\pm\\arcsin a+2\\pi k$", "$(-1)^k\\arcsin a+\\pi k$", "$\\arcsin a+\\pi k$", "$\\arccos a+2\\pi k$"], 1, "Классическая серия."),
            qz(tid, 2, "Период серии для tg:", ["$2\\pi$", "$\\pi$", "$\\pi/2$", "$4\\pi$"], 1, "Как период тангенса."),
        ],
        cloze=[
            cz(tid, 1, "$\\sin x=a$ ⇒ $x=(-1)^k\\arcsin a+[[\\pi k]]$."),
            cz(tid, 2, "$\\cos x=a$ ⇒ $x=\\pm\\arccos a+[[2\\pi k]]$."),
        ],
        recall=[
            "Выведи общий вид sin x = a из двух углов на окружности.",
            "Чем отличается серия cos от sin?",
        ],
        derive=[
            der(
                tid,
                1,
                "Выведи общий вид $\\sin x=a$",
                "$x=(-1)^k\\arcsin a+\\pi k$",
                [
                    "Пусть $\\alpha=\\arcsin a$. Тогда $\\sin\\alpha=a$ и $\\sin(\\pi-\\alpha)=a$.",
                    "Все углы: $x=\\alpha+2\\pi n$ или $x=\\pi-\\alpha+2\\pi n$.",
                    "Эти две серии объединяются в $x=(-1)^k\\alpha+\\pi k$.",
                ],
            )
        ],
    )
)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    data = {"topics": topics}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    n_fc = sum(len(t["flashcards"]) for t in topics)
    n_dr = sum(len(t["derive"]) for t in topics)
    print(f"Wrote {OUT} · {len(topics)} topics · {n_fc} cards · {n_dr} derivations")


if __name__ == "__main__":
    main()
