#!/usr/bin/env python3
"""Only formulas from the user's screenshots, with derivations from mother (addition) formulas."""
from __future__ import annotations

import json
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "content.json"

MOTHER = "Формулы сложения"


def F(
    id: str,
    family: str,
    title: str,
    formula: str,
    steps: list[str],
    *,
    mother: bool = False,
    from_ids: list[str] | None = None,
    tip: str = "",
):
    return {
        "id": id,
        "family": family,
        "title": title,
        "formula": formula,
        "steps": steps,
        "mother": mother,
        "fromIds": from_ids or [],
        "tip": tip,
    }


formulas = [
    # ── MOTHERS ──────────────────────────────────────────────
    F(
        "add-sin",
        MOTHER,
        "sin(α ± β)",
        r"$\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$",
        [
            "Это материнская формула: из неё получают двойной угол, суммы и произведения.",
            "Структура: $\\sin\\cdot\\cos$ и $\\cos\\cdot\\sin$; знак совпадает со знаком в скобках.",
            "Запомни обе сразу: плюс и минус отличаются только средним знаком.",
        ],
        mother=True,
        tip="Мать для sin 2α, sin α±sin β и т.д.",
    ),
    F(
        "add-cos",
        MOTHER,
        "cos(α ± β)",
        r"$\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$",
        [
            "Материнская формула для косинуса.",
            "Структура: $\\cos\\cdot\\cos$ и $\\sin\\cdot\\sin$; знак перед sin·sin противоположен скобкам.",
            "Проверка: $\\cos(\\alpha-\\beta)$ — плюс у произведения синусов.",
        ],
        mother=True,
        tip="Мать для cos 2α и понижения степени",
    ),
    F(
        "add-tg",
        MOTHER,
        "tg(α ± β)",
        r"$\operatorname{tg}(\alpha\pm\beta)=\dfrac{\operatorname{tg}\alpha\pm\operatorname{tg}\beta}{1\mp\operatorname{tg}\alpha\operatorname{tg}\beta}$",
        [
            "Берём $\\operatorname{tg}(\\alpha+\\beta)=\\sin(\\alpha+\\beta)/\\cos(\\alpha+\\beta)$.",
            "Подставляем материнские sin и cos сложения.",
            "Делим числитель и знаменатель на $\\cos\\alpha\\cos\\beta$ → получаем формулу через tg.",
        ],
        mother=True,
        from_ids=["add-sin", "add-cos"],
        tip="Сама из sin/cos сложения",
    ),
    F(
        "add-ctg",
        MOTHER,
        "ctg(α ± β)",
        r"$\operatorname{ctg}(\alpha\pm\beta)=\dfrac{\operatorname{ctg}\alpha\operatorname{ctg}\beta\mp 1}{\operatorname{ctg}\beta\pm\operatorname{ctg}\alpha}$",
        [
            "Аналогично tg: $\\operatorname{ctg}=\\cos/\\sin$, подставь материнские cos и sin.",
            "Или через $\\operatorname{ctg}=1/\\operatorname{tg}$ от формулы tg(α±β).",
        ],
        mother=True,
        from_ids=["add-sin", "add-cos"],
    ),
    # ── DOUBLE ───────────────────────────────────────────────
    F(
        "dbl-sin",
        "Двойной угол",
        "sin 2α",
        r"$\sin 2\alpha=2\sin\alpha\cos\alpha$",
        [
            "Бери материнскую: $\\sin(\\alpha+\\beta)$ при $\\beta=\\alpha$.",
            "$\\sin(\\alpha+\\alpha)=\\sin\\alpha\\cos\\alpha+\\cos\\alpha\\sin\\alpha$.",
            "Сложи: $2\\sin\\alpha\\cos\\alpha$.",
        ],
        from_ids=["add-sin"],
    ),
    F(
        "dbl-cos",
        "Двойной угол",
        "cos 2α",
        r"$\cos 2\alpha=\cos^2\alpha-\sin^2\alpha=2\cos^2\alpha-1=1-2\sin^2\alpha$",
        [
            "Мать: $\\cos(\\alpha+\\alpha)=\\cos\\alpha\\cos\\alpha-\\sin\\alpha\\sin\\alpha=\\cos^2-\\sin^2$.",
            "Через $\\cos^2+\\sin^2=1$: замени $\\sin^2$ → $2\\cos^2-1$.",
            "Или замени $\\cos^2$ → $1-2\\sin^2$. Три вида — одна формула.",
        ],
        from_ids=["add-cos"],
    ),
    F(
        "dbl-tg",
        "Двойной угол",
        "tg 2α",
        r"$\operatorname{tg} 2\alpha=\dfrac{2\operatorname{tg}\alpha}{1-\operatorname{tg}^2\alpha}$",
        [
            "Мать: $\\operatorname{tg}(\\alpha+\\beta)$ при $\\beta=\\alpha$.",
            "Числитель $2\\operatorname{tg}\\alpha$, знаменатель $1-\\operatorname{tg}^2\\alpha$.",
        ],
        from_ids=["add-tg"],
    ),
    F(
        "dbl-ctg",
        "Двойной угол",
        "ctg 2α",
        r"$\operatorname{ctg} 2\alpha=\dfrac{\operatorname{ctg}^2\alpha-1}{2\operatorname{ctg}\alpha}$",
        [
            "Из $\\operatorname{ctg}(\\alpha+\\alpha)$ или как $1/\\operatorname{tg} 2\\alpha$.",
            "Подставь и упрости.",
        ],
        from_ids=["add-ctg", "dbl-tg"],
    ),
    # ── POWER ────────────────────────────────────────────────
    F(
        "pow-cos",
        "Понижение степени",
        "cos² α",
        r"$\cos^2\alpha=\dfrac{1+\cos 2\alpha}{2}$",
        [
            "Из двойного угла: $\\cos 2\\alpha=2\\cos^2\\alpha-1$.",
            "Перенеси: $2\\cos^2\\alpha=1+\\cos 2\\alpha$.",
            "Раздели на 2.",
        ],
        from_ids=["dbl-cos"],
    ),
    F(
        "pow-sin",
        "Понижение степени",
        "sin² α",
        r"$\sin^2\alpha=\dfrac{1-\cos 2\alpha}{2}$",
        [
            "Из $\\cos 2\\alpha=1-2\\sin^2\\alpha$.",
            "$2\\sin^2\\alpha=1-\\cos 2\\alpha$ → раздели на 2.",
        ],
        from_ids=["dbl-cos"],
    ),
    F(
        "pow-tg",
        "Понижение степени",
        "tg² α",
        r"$\operatorname{tg}^2\alpha=\dfrac{1-\cos 2\alpha}{1+\cos 2\alpha}$",
        [
            "$\\operatorname{tg}^2=\\sin^2/\\cos^2$.",
            "Подставь оба понижения степени — дроби с $(1\\pm\\cos 2\\alpha)/2$ сократятся.",
        ],
        from_ids=["pow-sin", "pow-cos"],
    ),
    F(
        "pow-ctg",
        "Понижение степени",
        "ctg² α",
        r"$\operatorname{ctg}^2\alpha=\dfrac{1+\cos 2\alpha}{1-\cos 2\alpha}$",
        [
            "Это $1/\\operatorname{tg}^2\\alpha$, или $\\cos^2/\\sin^2$ через понижение.",
        ],
        from_ids=["pow-tg"],
    ),
    # ── TRIPLE ───────────────────────────────────────────────
    F(
        "tri-sin",
        "Тройной угол",
        "sin 3α",
        r"$\sin 3\alpha=3\sin\alpha-4\sin^3\alpha$",
        [
            "Пиши $\\sin(2\\alpha+\\alpha)$ — снова мать сложения.",
            "Подставь $\\sin 2\\alpha=2\\sin\\cos$ и $\\cos 2\\alpha=1-2\\sin^2$.",
            "Раскрой, замени $\\cos^2=1-\\sin^2$ → $3\\sin-4\\sin^3$.",
        ],
        from_ids=["add-sin", "dbl-sin", "dbl-cos"],
    ),
    F(
        "tri-cos",
        "Тройной угол",
        "cos 3α",
        r"$\cos 3\alpha=4\cos^3\alpha-3\cos\alpha$",
        [
            "$\\cos(2\\alpha+\\alpha)$ из материнской cos.",
            "Подставь двойной угол, упрости через $\\sin^2=1-\\cos^2$.",
        ],
        from_ids=["add-cos", "dbl-cos", "dbl-sin"],
    ),
    F(
        "tri-tg",
        "Тройной угол",
        "tg 3α",
        r"$\operatorname{tg} 3\alpha=\dfrac{3\operatorname{tg}\alpha-\operatorname{tg}^3\alpha}{1-3\operatorname{tg}^2\alpha}$",
        [
            "$\\operatorname{tg}(2\\alpha+\\alpha)$ из материнской tg.",
            "Подставь $\\operatorname{tg} 2\\alpha$ и упрости.",
        ],
        from_ids=["add-tg", "dbl-tg"],
    ),
    F(
        "tri-ctg",
        "Тройной угол",
        "ctg 3α",
        r"$\operatorname{ctg} 3\alpha=\dfrac{\operatorname{ctg}^3\alpha-3\operatorname{ctg}\alpha}{3\operatorname{ctg}^2\alpha-1}$",
        [
            "Из $\\operatorname{ctg}(2\\alpha+\\alpha)$ или как обратная к tg 3α.",
        ],
        from_ids=["add-ctg", "dbl-ctg"],
    ),
    # ── SUM → PRODUCT ────────────────────────────────────────
    F(
        "sum-sin",
        "Сумма → произведение",
        "sin α ± sin β",
        r"$\sin\alpha\pm\sin\beta=2\sin\dfrac{\alpha\pm\beta}{2}\cos\dfrac{\alpha\mp\beta}{2}$",
        [
            "Положим $s=(\\alpha+\\beta)/2$, $d=(\\alpha-\\beta)/2$ → $\\alpha=s+d$, $\\beta=s-d$.",
            "Тогда $\\sin(s+d)+\\sin(s-d)$ — два раза мать sin(±).",
            "Сложи: $2\\sin s\\cos d$. Верни s и d.",
        ],
        from_ids=["add-sin"],
    ),
    F(
        "sum-cos-p",
        "Сумма → произведение",
        "cos α + cos β",
        r"$\cos\alpha+\cos\beta=2\cos\dfrac{\alpha+\beta}{2}\cos\dfrac{\alpha-\beta}{2}$",
        [
            "Та же замена s, d.",
            "$\\cos(s+d)+\\cos(s-d)=2\\cos s\\cos d$ из матери cos.",
        ],
        from_ids=["add-cos"],
    ),
    F(
        "sum-cos-m",
        "Сумма → произведение",
        "cos α − cos β",
        r"$\cos\alpha-\cos\beta=-2\sin\dfrac{\alpha+\beta}{2}\sin\dfrac{\alpha-\beta}{2}$",
        [
            "$\\cos(s+d)-\\cos(s-d)=-2\\sin s\\sin d$.",
            "Минус впереди — не потеряй.",
        ],
        from_ids=["add-cos"],
    ),
    F(
        "sum-tg",
        "Сумма → произведение",
        "tg α ± tg β",
        r"$\operatorname{tg}\alpha\pm\operatorname{tg}\beta=\dfrac{\sin(\alpha\pm\beta)}{\cos\alpha\cos\beta}$",
        [
            "$\\operatorname{tg}\\alpha\\pm\\operatorname{tg}\\beta=\\sin\\alpha/\\cos\\alpha\\pm\\sin\\beta/\\cos\\beta$.",
            "Общий знаменатель $\\cos\\alpha\\cos\\beta$.",
            "Числитель = $\\sin(\\alpha\\pm\\beta)$ по матери sin.",
        ],
        from_ids=["add-sin"],
    ),
    F(
        "sum-ctg",
        "Сумма → произведение",
        "ctg α ± ctg β",
        r"$\operatorname{ctg}\alpha\pm\operatorname{ctg}\beta=\dfrac{\sin(\beta\pm\alpha)}{\sin\alpha\sin\beta}$",
        [
            "Аналогично через общий знаменатель $\\sin\\alpha\\sin\\beta$ и мать sin.",
        ],
        from_ids=["add-sin"],
    ),
    # ── PRODUCT → SUM ────────────────────────────────────────
    F(
        "prod-ss",
        "Произведение → сумма",
        "sin α · sin β",
        r"$\sin\alpha\sin\beta=\dfrac{\cos(\alpha-\beta)-\cos(\alpha+\beta)}{2}$",
        [
            "Выпиши мать: $\\cos(\\alpha-\\beta)$ и $\\cos(\\alpha+\\beta)$.",
            "Вычти второе из первого: $2\\sin\\alpha\\sin\\beta$.",
            "Раздели на 2.",
        ],
        from_ids=["add-cos"],
    ),
    F(
        "prod-sc",
        "Произведение → сумма",
        "sin α · cos β",
        r"$\sin\alpha\cos\beta=\dfrac{\sin(\alpha-\beta)+\sin(\alpha+\beta)}{2}$",
        [
            "Сложи материнские $\\sin(\\alpha+\\beta)$ и $\\sin(\\alpha-\\beta)$.",
            "Получи $2\\sin\\alpha\\cos\\beta$, раздели на 2.",
        ],
        from_ids=["add-sin"],
    ),
    F(
        "prod-cc",
        "Произведение → сумма",
        "cos α · cos β",
        r"$\cos\alpha\cos\beta=\dfrac{\cos(\alpha-\beta)+\cos(\alpha+\beta)}{2}$",
        [
            "Сложи $\\cos(\\alpha-\\beta)$ и $\\cos(\\alpha+\\beta)$ из матери cos.",
            "Раздели на 2.",
        ],
        from_ids=["add-cos"],
    ),
    # ── WEIERSTRASS ──────────────────────────────────────────
    F(
        "wei-sin",
        "Универсальная подстановка",
        "sin через t = tg(α/2)",
        r"$\sin\alpha=\dfrac{2t}{1+t^2},\ t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "Из двойного угла: $\\sin\\alpha=2\\sin(\\alpha/2)\\cos(\\alpha/2)$.",
            "Раздели числитель и знаменатель на $\\cos^2(\\alpha/2)$.",
            "Сверху $2t$, снизу $1+t^2$ (т.к. $1+\\operatorname{tg}^2=1/\\cos^2$).",
        ],
        from_ids=["dbl-sin"],
        tip="t = tg(α/2)",
    ),
    F(
        "wei-cos",
        "Универсальная подстановка",
        "cos через t = tg(α/2)",
        r"$\cos\alpha=\dfrac{1-t^2}{1+t^2},\ t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "$\\cos\\alpha=\\cos^2(\\alpha/2)-\\sin^2(\\alpha/2)$ (это cos 2β).",
            "Дели на $\\cos^2(\\alpha/2)$: $(1-t^2)/(1+t^2)$.",
        ],
        from_ids=["dbl-cos"],
    ),
    F(
        "wei-tg",
        "Универсальная подстановка",
        "tg через t = tg(α/2)",
        r"$\operatorname{tg}\alpha=\dfrac{2t}{1-t^2},\ t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "Это просто $\\operatorname{tg} 2\\beta$ при $\\beta=\\alpha/2$, $t=\\operatorname{tg}\\beta$.",
        ],
        from_ids=["dbl-tg"],
    ),
    F(
        "wei-ctg",
        "Универсальная подстановка",
        "ctg через t = tg(α/2)",
        r"$\operatorname{ctg}\alpha=\dfrac{1-t^2}{2t},\ t=\operatorname{tg}\dfrac{\alpha}{2}$",
        [
            "Обратная к tg: $(1-t^2)/(2t)$.",
        ],
        from_ids=["wei-tg"],
    ),
]

# family order for UI
ORDER = [
    MOTHER,
    "Двойной угол",
    "Понижение степени",
    "Тройной угол",
    "Сумма → произведение",
    "Произведение → сумма",
    "Универсальная подстановка",
]


def main():
    OUT.write_text(
        json.dumps({"familyOrder": ORDER, "formulas": formulas}, ensure_ascii=False, indent=2)
        + "\n",
        encoding="utf-8",
    )
    print(f"{len(formulas)} formulas → {OUT}")


if __name__ == "__main__":
    main()
