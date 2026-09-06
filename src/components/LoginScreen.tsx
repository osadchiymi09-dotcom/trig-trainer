import { useMemo, useState, type FormEvent } from 'react'
import { listLogins, loginOrRegister } from '../lib/auth'
import type { ProgressState } from '../types'

export function LoginScreen({
  onSuccess,
}: {
  onSuccess: (login: string, progress: ProgressState, isNew: boolean) => void
}) {
  const known = useMemo(() => listLogins(), [])
  const [login, setLogin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = loginOrRegister(login)
      setNotice(res.isNew ? 'Новый логин: прогресс 0%' : 'С возвращением — прогресс загружен')
      onSuccess(res.login, res.progress, res.isNew)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="brand">Тригонометрия · тренажёр</p>
        <h1>Вход</h1>
        <p className="hero-sub">
          Введи логин. Новый — прогресс 0%. Формулы и выводы: конспект, режим «Вывод»,
          карточки и тесты. Прогресс хранится в этом браузере.
        </p>

        <form onSubmit={submit} className="login-form">
          <label htmlFor="login">Логин</label>
          <input
            id="login"
            className="search"
            autoComplete="username"
            placeholder="например: misha"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          {notice && <p className="login-notice">{notice}</p>}
          <button type="submit" className="btn">
            Войти
          </button>
        </form>

        {known.length > 0 && (
          <div className="known-logins">
            <p>Уже есть на этом устройстве:</p>
            <div className="known-row">
              {known.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="chip"
                  onClick={() => {
                    try {
                      const res = loginOrRegister(name)
                      onSuccess(res.login, res.progress, res.isNew)
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Ошибка')
                    }
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
