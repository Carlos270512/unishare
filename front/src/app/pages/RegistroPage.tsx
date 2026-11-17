import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { registrarUsuario, verificarCedula } from '../../lib/api'

export default function RegistroPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [cedula, setCedula] = useState(params.get('cedula') ?? '')
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [verificada, setVerificada] = useState(false)
  const [avisoCedula, setAvisoCedula] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function seleccionarFoto(file: File | undefined) {
    if (!file) return
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  function quitarFoto() {
    setFoto(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function verificar() {
    const c = cedula.trim()
    if (c.length < 10) return
    setVerificando(true)
    setAvisoCedula(null)
    setVerificada(false)
    try {
      const datos = await verificarCedula(c)
      setNombres(datos.nombres)
      setApellidos(datos.apellidos)
      setVerificada(true)
    } catch (err) {
      setAvisoCedula(err instanceof Error ? err.message : 'No se pudo verificar la cédula')
    } finally {
      setVerificando(false)
    }
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      const form = new FormData()
      form.append('cedula', cedula)
      form.append('nombres', nombres)
      form.append('apellidos', apellidos)
      form.append('email', email)
      form.append('password', password)
      if (telefono) form.append('telefono', telefono)
      if (foto) form.append('foto', foto)

      await registrarUsuario(form)
      setExito(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo completar el registro.')
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
          <h1>Únete a UniShare</h1>
          <p>
            Crea tu cuenta y comparte libros, equipos e insumos académicos con la comunidad universitaria.
          </p>
          <ul className="auth-trust">
            <li>
              <span className="material-symbols-outlined">badge</span>
              Verificación de cédula automática
            </li>
            <li>
              <span className="material-symbols-outlined">eco</span>
              Acceso gratuito e inclusivo
            </li>
          </ul>
        </div>
      </aside>

      <section className="auth-form-wrap">
        <div className="auth-card auth-card-wide">
          <h2 className="auth-title">Crear tu cuenta</h2>
          <p className="auth-sub">Únete a la comunidad solidaria universitaria.</p>

          {exito ? (
            <div className="modal-exito">
              <span className="material-symbols-outlined">celebration</span>
              <h3>¡Bienvenido! 🎉</h3>
              <p>Ya puedes empezar a publicar. Te enviamos un correo de bienvenida.</p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={enviar}>
              <label className="field">
                <span>Cédula *</span>
                <div className="cedula-row">
                  <input
                    value={cedula}
                    onChange={(e) => {
                      setCedula(e.target.value)
                      setVerificada(false)
                      setAvisoCedula(null)
                    }}
                    onBlur={verificar}
                    placeholder="Ej: 1726878505"
                    required
                  />
                  <button type="button" className="btn btn-outline" onClick={verificar} disabled={verificando}>
                    {verificando ? 'Verificando…' : 'Verificar'}
                  </button>
                </div>
                {verificada && (
                  <span className="cedula-ok">
                    <span className="material-symbols-outlined">verified</span>
                    Cédula verificada
                  </span>
                )}
                {avisoCedula && <span className="form-error">{avisoCedula}</span>}
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Nombres *</span>
                  <input
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Ej: Milton"
                    required
                  />
                </label>
                <label className="field">
                  <span>Apellidos *</span>
                  <input
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej: Toapanta"
                    required
                  />
                </label>
              </div>

              <label className="field">
                <span>Correo universitario *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@universidad.edu.ec"
                  required
                />
              </label>

              <div className="field-row">
                <label className="field">
                  <span>Contraseña *</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </label>
                <label className="field">
                  <span>Teléfono</span>
                  <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Opcional" />
                </label>
              </div>

              <div className="upload">
                {preview ? (
                  <div className="upload-preview">
                    <img src={preview} alt="Foto de perfil" />
                    <button type="button" className="icon-btn" onClick={quitarFoto} aria-label="Quitar foto">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ) : (
                  <button type="button" className="upload-drop" onClick={() => fileRef.current?.click()}>
                    <span className="material-symbols-outlined">account_circle</span>
                    <span>Subir foto de perfil (opcional)</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => seleccionarFoto(e.target.files?.[0])}
                />
              </div>

              {error && <p className="form-error">{error}</p>}

              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={enviando}>
                {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>
          )}

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Ingresa</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
