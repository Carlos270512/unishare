interface HeaderProps {
  onPublicar: () => void
  onRegistrarse: () => void
}

export default function Header({ onPublicar, onRegistrarse }: HeaderProps) {
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
          <button className="btn btn-ghost" onClick={onRegistrarse}>Registrarse</button>
          <button className="btn btn-primary" onClick={onPublicar}>
            <span className="material-symbols-outlined">add_circle</span>
            Publicar recurso
          </button>
        </div>
      </div>
    </header>
  )
}
