interface SesionInfo {
  nombreCompleto: string
  rol: string
}

interface HeaderProps {
  sesion: SesionInfo | null
  enDashboard: boolean
  onLogin: () => void
  onRegistrarse: () => void
  onPublicar: () => void
  onDashboard: () => void
  onMisRecursos: () => void
  onLogout: () => void
}

export default function Header({
  sesion,
  enDashboard,
  onLogin,
  onRegistrarse,
  onPublicar,
  onDashboard,
  onMisRecursos,
  onLogout,
}: HeaderProps) {
  const iniciales = sesion
    ? sesion.nombreCompleto
        .split(' ')
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-name">UniShare</span>
          <span className="brand-badge">SOLIDARIO</span>
        </div>
        <nav className="nav">
          <a href="#catalogo">Explorar</a>
          <a href="#como-funciona">Cómo funciona</a>
        </nav>
        <div className="header-actions">
          {sesion ? (
            <>
              <div className="user-pill">
                <span className="avatar">{iniciales}</span>
                <div className="user-meta">
                  <strong>{sesion.nombreCompleto}</strong>
                  <span>{sesion.rol}</span>
                </div>
              </div>
              {sesion.rol === 'ADMINISTRADOR' && (
                <button className="btn btn-outline" onClick={onDashboard}>
                  <span className="material-symbols-outlined">dashboard</span>
                  {enDashboard ? 'Ver catálogo' : 'Panel'}
                </button>
              )}
              {sesion.rol === 'ESTUDIANTE' && (
                <button className="btn btn-outline" onClick={onMisRecursos}>
                  <span className="material-symbols-outlined">dashboard</span>
                  Panel
                </button>
              )}
              <button className="btn btn-ghost" onClick={onLogout}>Salir</button>
              <button className="btn btn-primary" onClick={onPublicar}>
                <span className="material-symbols-outlined">add_circle</span>
                Publicar
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={onLogin}>Ingresar</button>
              <button className="btn btn-ghost" onClick={onRegistrarse}>Registrarse</button>
              <button className="btn btn-primary" onClick={onPublicar}>
                <span className="material-symbols-outlined">add_circle</span>
                Publicar recurso
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
