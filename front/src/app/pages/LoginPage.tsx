import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../lib/api'
import type { Sesion } from '../../lib/api'

interface Props {
  onLogin: (sesion: Sesion) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPass, setMostrarPass] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const sesion = await login(email.trim(), password)
      onLogin(sesion)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
      setEnviando(false)
    }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-brand">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-brand-content">
          <span className="brand-badge auth-badge">SOLIDARIO</span>
          <h1>UniShare</h1>
          <p>
            Intercambio de saberes, libros e instrumental académico. La red circular que democratiza el
            acceso a recursos universitarios sin costo.
          </p>
          <ul className="auth-trust">
            <li>
              <span className="material-symbols-outlined">verified_user</span>
              Comunidad universitaria verificada
            </li>
            <li>
              <span className="material-symbols-outlined">eco</span>
              100% gratuito · Alineado al ODS 10
            </li>
          </ul>
        </div>
      </aside>

      <section className="auth-form-wrap">
        <div className="auth-card">
          <h2 className="auth-title">Bienvenido de nuevo</h2>
          <p className="auth-sub">Ingresa con tu correo universitario.</p>

          <form className="auth-form" onSubmit={enviar}>
            <label className="field">
              <span>Correo universitario</span>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@universidad.edu.ec"
                required
              />
            </label>

            <label className="field">
              <span>Contraseña</span>
              <div className="input-pass">
                <input
                  type={mostrarPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setMostrarPass((v) => !v)}
                  aria-label="Mostrar contraseña"
                >
                  <span className="material-symbols-outlined">{mostrarPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </label>

            <div className="auth-row">
              <label className="check">
                <input type="checkbox" />
                Recordarme
              </label>
              <button type="button" className="link-btn" onClick={() => navigate('/registro')}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && <p className="form-error shake">{error}</p>}

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={enviando}>
              {enviando ? (
                <>
                  <span className="spinner" />
                  Ingresando…
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>

          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
