#!/usr/bin/env python3
"""Flat catalog: each item = formula + derivation steps."""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "content.json"


def F(id: str, section: str, title: str, formula: string, steps: list[str], tip: str = ""):
    return {
        "id": id,
        "section": section,
        "title": title,
        "formula": formula,
        "steps": steps,
        "tip": tip,
    }


# fix type hint for older python - use str
def F(id, section, title, formula, steps, tip=""):  # noqa: F811
    return {
        "id": id,
        "section": section,
        "title": title,
        "formula": formula,
        "steps": steps,
        "tip": tip,
    }


formulas = [
    # ── База ──
    F(
        "base-def-tg",
        "1. База",
        "Определение тангенса",
        r"$\operatorname{tg}\alpha=\dfrac{\sin\alpha}{\cos\alpha}$",
        [
            "На единичной окружности точка $M(\\cos\\alpha;\\sin\\alpha)$.",
            "Касательная $x=1$ пересекается с лучом угла в точке $(1;t)$.",
            "По подобию треугольников $\\dfrac{t}{1}=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$.",
            "Значит $t=\\operatorname{tg}\\alpha=\\sin\\alpha/\\cos\\alpha$.",
        ],
        tip="ctg — то же на касательной y=1",
    ),
    F(
        "base-ctg",
        "1. База",
        "Определение котангенса",
        r"$\operatorname{ctg}\alpha=\dfrac{\cos\alpha}{\sin\alpha},\quad \operatorname{tg}\alpha\cdot\operatorname{ctg}\alpha=1$",
        [
            "По определению $\\operatorname{ctg}\\alpha$ — отрезок на касательной $y=1$.",
            "Из подобия $\\operatorname{ctg}\\alpha=\\cos\\alpha/\\sin\\alpha$.",
            "Произведение: $(\\sin/\\cos)\\cdot(\\cos/\\sin)=1$.",
        ],
    ),
    F(
        "base-deg-rad",
        "1. База",
        "Градусы ↔ радианы",
        r"$\alpha_{\mathrm{рад}}=\alpha^\circ\cdot\dfrac{\pi}{180^\circ},\quad \alpha^\circ=\alpha_{\mathrm{рад}}\cdot\dfrac{180^\circ}{\pi}$",
        [
            "Полный оборот: $360^\\circ=2\\pi$ радиан.",
            "Значит $1^\\circ=\\pi/180$ радиан.",
            "Умножь градусы на $\\pi/180$ — получи радианы (и наоборот).",
        ],
    ),
    F(
        "base-main",
        "1. База",
        "Основное тождество",
        r"$\sin^2\alpha+\cos^2\alpha=1$",
        [
            "Точка $(\\cos\\alpha;\\sin\\alpha)$ лежит на окружности радиуса 1.",
            "Уравнение окружности: $x^2+y^2=1$.",
            "Подставь координаты → $\\sin^2\\alpha+\\cos^2\\alpha=1$.",
        ],
        tip="Это Пифагор на единичной окружности",
    ),
    F(
        "base-tg-id",
        "1. База",
        "Следствие для тангенса",
        r"$1+\operatorname{tg}^2\alpha=\dfrac{1}{\cos^2\alpha}$",
        [
            "Старт: $\\sin^2\\alpha+\\cos^2\\alpha=1$.",
            "Раздели обе части на $\\cos^2\\alpha$ (где $\\cos\\neq 0$).",
            "Получи $\\operatorname{tg}^2\\alpha+1=1/\\cos^2\\alpha$.",
        ],
    ),
    F(
        "base-ctg-id",
        "1. База",
        "Следствие для котангенса",
        r"$1+\operatorname{ctg}^2\alpha=\dfrac{1}{\sin^2\alpha}$",
        [
            "Старт: $\\sin^2\\alpha+\\cos^2\\alpha=1$.",
            "Раздели на $\\sin^2\\alpha$ (где $\\sin\\neq 0$).",
            "Получи $1+\\operatorname{ctg}^2\\alpha=1/\\sin^2\\alpha$.",
        ],
    ),
    F(
        "base-period-sin",
        "1. База",
        "Период sin и cos",
        r"$T_{\sin}=T_{\cos}=2\pi$",
        [
            "После полного оборота $2\\pi$ точка на окружности та же.",
            "Значит $\\sin(x+2\\pi)=\\sin x$, $\\cos(x+2\\pi)=\\cos x$.",
            "$2\\pi$ — наименьший общий период.",
        ],
    ),
    F(
        "base-period-tg",
        "1. База",
        "Период tg и ctg",
        r"$T_{\operatorname{tg}}=T_{\operatorname{ctg}}=\pi$",
        [
            "$\\operatorname{tg}(x+\\pi)=\\sin(x+\\pi)/\\cos(x+\\pi)$.",
            "$\\sin(x+\\pi)=-\\sin x$, $\\cos(x+\\pi)=-\\cos x$.",
            "Минус на минус сокращается → $\\operatorname{tg}(x+\\pi)=\\operatorname{tg} x$.",
        ],
    ),
    F(
        "base-parity",
        "1. База",
        "Чётность / нечётность",
        r"$\cos(-x)=\cos x;\quad \sin(-x)=-\sin x;\quad \operatorname{tg}(-x)=-\operatorname{tg} x$",
        [
            "Углы $x$ и $-x$ симметричны относительно оси $Ox$.",
            "$x$-координата одна → $\\cos$ чётный.",
            "$y$-координаты противоположны → $\\sin$ нечётный; tg = sin/cos тоже нечётный.",
        ],
    ),
    F(
        "base-signs",
        "1. База",
        "Знаки по четвертям",
        r"$\sin>0$ в I,II; $\cos>0$ в I,IV; $\operatorname{tg}>0$ в I,III",
        [
            "$\\sin$ — это $y$: плюс сверху (I–II).",
            "$\\cos$ — это $x$: плюс справа (I, IV).",
            "$\\operatorname{tg}=\\sin/\\cos$: плюс, когда знаки одинаковы (I и III).",
        ],
        tip="Мнемоника: All Students Take Calculus",
    ),
    # ── Приведение ──
    F(
        "red-pi2-sin",
        "2. Приведение",
        "sin(π/2 − α)",
        r"$\sin(\pi/2-\alpha)=\cos\alpha$",
        [
            "Формула: $\\sin(a-b)=\\sin a\\cos b-\\cos a\\sin b$.",
            "Подставь $a=\\pi/2$, $b=\\alpha$.",
            "$\\sin(\\pi/2)=1$, $\\cos(\\pi/2)=0$ → $1\\cdot\\cos\\alpha-0=\\cos\\alpha$.",
        ],
        tip="Правило: сдвиг на π/2 меняет sin↔cos",
    ),
    F(
        "red-pi2-cos",
        "2. Приведение",
        "cos(π/2 − α)",
        r"$\cos(\pi/2-\alpha)=\sin\alpha$",
        [
            "$\\cos(a-b)=\\cos a\\cos b+\\sin a\\sin b$.",
            "$a=\\pi/2$, $b=\\alpha$: $0\\cdot\\cos\\alpha+1\\cdot\\sin\\alpha=\\sin\\alpha$.",
        ],
    ),
    F(
        "red-pi-sin",
        "2. Приведение",
        "sin(π − α)",
        r"$\sin(\pi-\alpha)=\sin\alpha$",
        [
            "$\\sin(\\pi-\\alpha)=\\sin\\pi\\cos\\alpha-\\cos\\pi\\sin\\alpha$.",
            "$\\sin\\pi=0$, $\\cos\\pi=-1$.",
            "Получи $0-(-1)\\sin\\alpha=\\sin\\alpha$.",
        ],
        tip="Сдвиг на π имя функции не меняет",
    ),
    F(
        "red-pi-cos",
        "2. Приведение",
        "cos(π − α)",
        r"$\cos(\pi-\alpha)=-\cos\alpha$",
        [
            "$\\cos(\\pi-\\alpha)=\\cos\\pi\\cos\\alpha+\\sin\\pi\\sin\\alpha$.",
            "$=-1\\cdot\\cos\\alpha+0=-\\cos\\alpha$.",
        ],
    ),
    F(
        "red-pi-plus-sin",
        "2. Приведение",
        "sin(π + α)",
        r"$\sin(\pi+\alpha)=-\sin\alpha$",
        [
            "$\\sin(\\pi+\\alpha)=\\sin\\pi\\cos\\alpha+\\cos\\pi\\sin\\alpha=0+(-1)\\sin\\alpha=-\\sin\\alpha$.",
        ],
    ),
    F(
        "red-rules",
        "2. Приведение",
        "Два правила приведения",
        r"знак = знак исходной функции в четверти; $\pi/2,3\pi/2$ — смена имени",
        [
            "Возьми $\\alpha\\in(0;\\pi/2)$ и посмотри, в какой четверти стоит угол слева.",
            "Знак справа = знак исходной функции в этой четверти.",
            "Если сдвиг $\\pi/2$ или $3\\pi/2$ — sin↔cos, tg↔ctg; если $\\pi$ или $2\\pi$ — имя то же.",
        ],
    ),
    # ── Сложение ──
    F(
        "add-sin",
        "3. Сложение",
        "sin(α ± β)",
        r"$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$",
        [
            "Это базовая формула (её берут как исходную или выводят через векторы/площадь).",
            "Запомни структуру: «sin·cos ± cos·sin».",
            "Знак перед вторым слагаемым совпадает со знаком в скобках.",
        ],
        tip="Материнская формула для почти всего дальше",
    ),
    F(
        "add-cos",
        "3. Сложение",
        "cos(α ± β)",
        r"$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$",
        [
            "Структура: «cos·cos ∓ sin·sin».",
            "Знак перед sin·sin противоположен знаку в скобках.",
            "Проверка: $\\cos(\\alpha-\\beta)$ имеет плюс у sin·sin.",
        ],
    ),
    F(
        "add-tg",
        "3. Сложение",
        "tg(α ± β)",
        r"$\operatorname{tg}(\alpha\pm\beta)=\dfrac{\operatorname{tg}\alpha\pm\operatorname{tg}\beta}{1\mp\operatorname{tg}\alpha\operatorname{tg}\beta}$",
        [
            "Запиши $\\operatorname{tg}(\\alpha+\\beta)=\\sin(\\alpha+\\beta)/\\cos(\\alpha+\\beta)$.",
            "Раскрой числитель и знаменатель формулами сложения.",
            "Раздели числитель и знаменатель на $\\cos\\alpha\\cos\\beta$.",
            "Получи $(\\operatorname{tg}\\alpha+\\operatorname{tg}\\beta)/(1-\\operatorname{tg}\\alpha\\operatorname{tg}\\beta)$.",
        ],
    ),
    # ── Двойной / понижение / тройной ──
    F(
        "dbl-sin",
        "4. Двойной и тройной угол",
        "sin 2α",
        r"$\sin 2\alpha=2\sin\alpha\cos\alpha$",
        [
            "Запиши $\\sin(\\alpha+\\alpha)$.",
            "Раскрой: $\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha$.",
            "Сложи: $2\\sin\\alpha\\cos\\alpha$.",
        ],
    ),
    F(
        "dbl-cos",
        "4. Двойной и тройной угол",
        "cos 2α (три вида)",
        r"$\cos 2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha$",
        [
            "$\\cos 2\\alpha=\\cos(\\alpha+\\alpha)=\\cos^2\\alpha-\\sin^2\\alpha$.",
            "Замени $\\cos^2=1-\\sin^2$: $(1-\\sin^2)-\\sin^2=1-2\\sin^2$.",
            "Или $\\sin^2=1-\\cos^2$: $\\cos^2-(1-\\cos^2)=2\\cos^2-1$.",
        ],
    ),
    F(
        "dbl-tg",
        "4. Двойной и тройной угол",
        "tg 2α",
        r"$\operatorname{tg} 2\alpha=\dfrac{2\operatorname{tg}\alpha}{1-\operatorname{tg}^2\alpha}$",
        [
            "Подставь $\\beta=\\alpha$ в $\\operatorname{tg}(\\alpha+\\beta)$.",
            "Числитель: $\\operatorname{tg}+\\operatorname{tg}=2\\operatorname{tg}$.",
            "Знаменатель: $1-\\operatorname{tg}\\cdot\\operatorname{tg}=1-\\operatorname{tg}^2$.",
        ],
    ),
    F(
        "pow-sin",
        "4. Двойной и тройной угол",
        "Понижение степени sin²",
        r"$\sin^2\alpha=\dfrac{1-\cos 2\alpha}{2}$",
        [
            "Возьми $\\cos 2\\alpha=1-2\\sin^2\\alpha$.",
            "Перенеси: $2\\sin^2\\alpha=1-\\cos 2\\alpha$.",
            "Раздели на 2.",
        ],
    ),
    F(
        "pow-cos",
        "4. Двойной и тройной угол",
        "Понижение степени cos²",
        r"$\cos^2\alpha=\dfrac{1+\cos 2\alpha}{2}$",
        [
            "Возьми $\\cos 2\\alpha=2\\cos^2\\alpha-1$.",
            "Перенеси: $2\\cos^2\\alpha=1+\\cos 2\\alpha$.",
            "Раздели на 2.",
        ],
    ),
    F(
        "tri-sin",
        "4. Двойной и тройной угол",
        "sin 3α",
        r"$\sin 3\alpha=3\sin\alpha-4\sin^3\alpha$",
        [
            "Запиши $\\sin(2\\alpha+\\alpha)=\\sin 2\\alpha\\cos\\alpha+\\cos 2\\alpha\\sin\\alpha$.",
            "Подставь $2\\sin\\cos$ и $1-2\\sin^2$.",
            "Раскрой и замени $\\cos^2=1-\\sin^2$.",
            "Упрости до $3\\sin\\alpha-4\\sin^3\\alpha$.",
        ],
    ),
    F(
        "tri-cos",
        "4. Двойной и тройной угол",
        "cos 3α",
        r"$\cos 3\alpha=4\cos^3\alpha-3\cos\alpha$",
        [
            "$\\cos(2\\alpha+\\alpha)=\\cos 2\\alpha\\cos\\alpha-\\sin 2\\alpha\\sin\\alpha$.",
            "Подставь $2\\cos^2-1$ и $2\\sin\\cos$.",
            "Упрости через $\\sin^2=1-\\cos^2$ до $4\\cos^3-3\\cos$.",
        ],
    ),
    # ── Сумма ↔ произведение ──
    F(
        "sum-sin",
        "5. Сумма ↔ произведение",
        "sin α ± sin β",
        r"$\sin\alpha\pm\sin\beta=2\sin\dfrac{\alpha\pm\beta}{2}\cos\dfrac{\alpha\mp\beta}{2}$",
        [
            "Пусть $s=(\\alpha+\\beta)/2$, $d=(\\alpha-\\beta)/2$.",
            "Тогда $\\alpha=s+d$, $\\beta=s-d$.",
            "$\\sin(s+d)+\\sin(s-d)=2\\sin s\\cos d$.",
            "Верни $s$ и $d$ — получи формулу.",
        ],
    ),
    F(
        "sum-cos-plus",
        "5. Сумма ↔ произведение",
        "cos α + cos β",
        r"$\cos\alpha+\cos\beta=2\cos\dfrac{\alpha+\beta}{2}\cos\dfrac{\alpha-\beta}{2}$",
        [
            "Та же замена $s,d$.",
            "$\\cos(s+d)+\\cos(s-d)=2\\cos s\\cos d$.",
        ],
    ),
    F(
        "sum-cos-minus",
        "5. Сумма ↔ произведение",
        "cos α − cos β",
        r"$\cos\alpha-\cos\beta=-2\sin\dfrac{\alpha+\beta}{2}\sin\dfrac{\alpha-\beta}{2}$",
        [
            "$\\cos(s+d)-\\cos(s-d)=-2\\sin s\\sin d$.",
            "Не забудь минус впереди.",
        ],
    ),
    F(
        "prod-sin",
        "5. Сумма ↔ произведение",
        "sin α · sin β",
        r"$\sin\alpha\sin\beta=\dfrac{1}{2}\bigl(\cos(\alpha-\beta)-\cos(\alpha+\beta)\bigr)$",
        [
            "Запиши $\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$.",
            "Запиши $\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$.",
            "Вычти второе из первого: $2\\sin\\alpha\\sin\\beta$.",
            "Раздели на 2.",
        ],
    ),
    F(
        "prod-cos",
        "5. Сумма ↔ произведение",
        "cos α · cos β",
        r"$\cos\alpha\cos\beta=\dfrac{1}{2}\bigl(\cos(\alpha-\beta)+\cos(\alpha+\beta)\bigr)$",
        [
            "Сложи $\\cos(\\alpha-\\beta)$ и $\\cos(\\alpha+\\beta)$.",
            "Получи $2\\cos\\alpha\\cos\\beta$, раздели на 2.",
        ],
    ),
    F(
        "prod-sincos",
        "5. Сумма ↔ произведение",
        "sin α · cos β",
        r"$\sin\alpha\cos\beta=\dfrac{1}{2}\bigl(\sin(\alpha+\beta)+\sin(\alpha-\beta)\bigr)$",
        [
            "Сложи $\\sin(\\alpha+\\beta)$ и $\\sin(\\alpha-\\beta)$.",
            "Получи $2\\sin\\alpha\\cos\\beta$, раздели на 2.",
        ],
    ),
    # ── Универсальная подстановка ──
    F(
        "wei-sin",
        "6. Универсальная подстановка",
        "sin через t = tg(α/2)",
        r"$\sin\alpha=\dfrac{2t}{1+t^2},\quad t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "Запиши $\\sin\\alpha=2\\sin(\\alpha/2)\\cos(\\alpha/2)$.",
            "Раздели числитель и знаменатель на $\\cos^2(\\alpha/2)$.",
            "Числитель → $2t$, знаменатель → $1+t^2$.",
        ],
    ),
    F(
        "wei-cos",
        "6. Универсальная подстановка",
        "cos через t = tg(α/2)",
        r"$\cos\alpha=\dfrac{1-t^2}{1+t^2},\quad t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "$\\cos\\alpha=\\cos^2(\\alpha/2)-\\sin^2(\\alpha/2)$.",
            "Раздели на $\\cos^2(\\alpha/2)$: $1-t^2$ сверху, $1+t^2$ снизу.",
        ],
    ),
    F(
        "wei-tg",
        "6. Универсальная подстановка",
        "tg через t = tg(α/2)",
        r"$\operatorname{tg}\alpha=\dfrac{2t}{1-t^2},\quad t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "Это частный случай $\\operatorname{tg} 2\\beta$ при $\\beta=\\alpha/2$, $t=\\operatorname{tg}\\beta$.",
        ],
    ),
    # ── Вспомогательный аргумент ──
    F(
        "aux",
        "7. Вспомогательный аргумент",
        "a sin x + b cos x",
        r"$a\sin x+b\cos x=\sqrt{a^2+b^2}\,\sin(x+\varphi)$",
        [
            "Вынеси $R=\\sqrt{a^2+b^2}$.",
            "Получи $R\\big((a/R)\\sin x+(b/R)\\cos x\\big)$.",
            "Выбери $\\varphi$: $\\cos\\varphi=a/R$, $\\sin\\varphi=b/R$.",
            "Скобка = $\\sin(x+\\varphi)$.",
        ],
        tip="Сводит сумму к одному синусу",
    ),
    # ── Обратные и уравнения ──
    F(
        "inv-ranges",
        "8. Обратные и уравнения",
        "Области значений обратных",
        r"$\arcsin\in[-\pi/2;\pi/2],\ \arccos\in[0;\pi],\ \operatorname{arctg}\in(-\pi/2;\pi/2)$",
        [
            "Обратная функция берёт одно главное значение.",
            "arcsin/arctg — правая/верхняя ветка около 0.",
            "arccos — от 0 до π (неотрицательная «дуга»).",
        ],
    ),
    F(
        "eq-sin",
        "8. Обратные и уравнения",
        "sin x = a",
        r"$x=(-1)^k\arcsin a+\pi k,\ k\in\mathbb{Z}$",
        [
            "Пусть $\\alpha=\\arcsin a$. Тогда $\\sin\\alpha=a$ и $\\sin(\\pi-\\alpha)=a$.",
            "Все углы: $\\alpha+2\\pi n$ или $\\pi-\\alpha+2\\pi n$.",
            "Две серии сжимаются в $x=(-1)^k\\alpha+\\pi k$.",
        ],
    ),
    F(
        "eq-cos",
        "8. Обратные и уравнения",
        "cos x = a",
        r"$x=\pm\arccos a+2\pi k,\ k\in\mathbb{Z}$",
        [
            "На окружности два угла с данным косинусом: $\\pm\\arccos a$.",
            "Плюс период $2\\pi$.",
        ],
    ),
    F(
        "eq-tg",
        "8. Обратные и уравнения",
        "tg x = a",
        r"$x=\operatorname{arctg} a+\pi k,\ k\in\mathbb{Z}$",
        [
            "Одно главное значение $\\operatorname{arctg} a$.",
            "Период тангенса $\\pi$ → прибавляй $\\pi k$.",
        ],
    ),
]


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps({"formulas": formulas}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT} · {len(formulas)} formulas")


if __name__ == "__main__":
    main()
