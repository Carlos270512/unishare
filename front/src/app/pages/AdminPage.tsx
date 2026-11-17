import { useEffect, useState } from 'react'
import ProductoCard from '../../modules/recursos/components/ProductoCard'
import { getProductos, getUsuarios } from '../../lib/api'
import type { Producto, Sesion, UsuarioInfo } from '../../lib/api'

interface Props {
  sesion: Sesion
  onLogout: () => void
}

export default function AdminPage({ sesion, onLogout }: Props) {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [toast, setToast] = useState(true)
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    Promise.all([getUsuarios(), getProductos()])
      .then(([u, p]) => {
        setUsuarios(u)
        setProductos(p)
      })
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    const id = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setToast(false), 4200)
    return () => clearTimeout(t)
  }, [])

  const donaciones = productos.filter((p) => p.modalidad === 'DONACION').length
  const prestamos = productos.length - donaciones

  return (
    <div className="dash">
      {toast && (
        <div className="toast toast-success">
          <span className="material-symbols-outlined">task_alt</span>
          <div>
            <strong>¡Bienvenido, {sesion.nombreCompleto}!</strong>
            <span>Has iniciado sesión como administrador.</span>
          </div>
        </div>
      )}

      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="brand-name light">UniShare</span>
          <span className="brand-badge">ADMIN</span>
        </div>
        <nav className="dash-nav">
          <a href="#resumen" className="active">
            <span className="material-symbols-outlined">space_dashboard</span> Resumen
          </a>
          <a href="#usuarios">
            <span className="material-symbols-outlined">group</span> Usuarios
          </a>
          <a href="#publicaciones">
            <span className="material-symbols-outlined">inventory_2</span> Publicaciones
          </a>
          <button onClick={onLogout}>
            <span className="material-symbols-outlined">logout</span> Salir
          </button>
        </nav>
      </aside>

      <section className="dash-main">
        <div className="dash-topbar">
          <div>
            <h2>Panel de administración</h2>
            <p>Gestión de la comunidad UniShare</p>
          </div>
          <div className="dash-clock">
            <span className="material-symbols-outlined">schedule</span>
            <div>
              <strong>{hora.toLocaleTimeString()}</strong>
              <span>
                {hora.toLocaleDateString('es-EC', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="kpi-grid" id="resumen">
          <div className="kpi-card">
            <span className="material-symbols-outlined kpi-icon">group</span>
            <strong>{usuarios.length}</strong>
            <span>Usuarios</span>
          </div>
          <div className="kpi-card">
            <span className="material-symbols-outlined kpi-icon">inventory_2</span>
            <strong>{productos.length}</strong>
            <span>Publicaciones</span>
          </div>
          <div className="kpi-card">
            <span className="material-symbols-outlined kpi-icon">volunteer_activism</span>
            <strong>{donaciones}</strong>
            <span>Donaciones</span>
          </div>
          <div className="kpi-card">
            <span className="material-symbols-outlined kpi-icon">sync_alt</span>
            <strong>{prestamos}</strong>
            <span>Préstamos</span>
          </div>
        </div>

        {cargando ? (
          <p className="loading">Cargando panel…</p>
        ) : (
          <>
            <h3 className="panel-title" id="usuarios">
              Usuarios ({usuarios.length})
            </h3>
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombreCompleto}</td>
                      <td>{u.cedula}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`rol-badge ${u.rol === 'ADMINISTRADOR' ? 'rol-admin' : ''}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="panel-title" id="publicaciones">
              Publicaciones ({productos.length})
            </h3>
            <div className="grid">
              {productos.map((p) => (
                <ProductoCard key={p.id} producto={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
