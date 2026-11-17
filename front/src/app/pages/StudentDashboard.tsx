import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductoCard from '../../modules/recursos/components/ProductoCard'
import {
  getProductos,
  getSolicitudesEnviadas,
  getSolicitudesRecibidas,
  responderSolicitud,
} from '../../lib/api'
import type { Producto, Sesion, Solicitud } from '../../lib/api'

type Tab = 'catalogo' | 'publicaciones' | 'recibidas' | 'enviadas'

interface Props {
  sesion: Sesion
  onLogout: () => void
  onSolicitar: (producto: Producto) => void
  refreshToken: number
}

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  ENTREGADA: 'Entregada',
}

const ESTADO_PRODUCTO: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  SOLICITADO: 'Solicitado',
  ENTREGADO: 'Entregado',
}

function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function fecha(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function StudentDashboard({ sesion, onLogout, onSolicitar, refreshToken }: Props) {
  const [productos, setProductos] = useState<Producto[]>([])
  const [recibidas, setRecibidas] = useState<Solicitud[]>([])
  const [enviadas, setEnviadas] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)
  const [tab, setTab] = useState<Tab>('catalogo')
  const [toastBienvenida, setToastBienvenida] = useState(true)
  const [toastAccion, setToastAccion] = useState(false)
  const [hora, setHora] = useState(new Date())

  const misProductos = productos.filter((p) => p.personaId === sesion.personaId)

  async function cargar() {
    setCargando(true)
    const [p, r, e] = await Promise.all([
      getProductos(),
      getSolicitudesRecibidas(sesion.personaId),
      getSolicitudesEnviadas(sesion.personaId),
    ])
    setProductos(p)
    setRecibidas(r)
    setEnviadas(e)
    setCargando(false)
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sesion.personaId, refreshToken])

  useEffect(() => {
    const id = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setToastBienvenida(false), 4200)
    return () => clearTimeout(t)
  }, [])

  async function responder(id: number, estado: string) {
    await responderSolicitud(id, estado)
    setToastAccion(true)
    setTimeout(() => setToastAccion(false), 3200)
    cargar()
  }

  return (
    <div className="dash">
      {toastBienvenida && (
        <div className="toast toast-success">
          <span className="material-symbols-outlined">waving_hand</span>
          <div>
            <strong>¡Hola, {sesion.nombreCompleto}!</strong>
            <span>Bienvenido a tu panel de estudiante.</span>
          </div>
        </div>
      )}

      {toastAccion && (
        <div className="toast toast-success">
          <span className="material-symbols-outlined">task_alt</span>
          <div>
            <strong>Solicitud actualizada</strong>
            <span>Se notificó al estudiante por correo.</span>
          </div>
        </div>
      )}

      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="brand-name light">UniShare</span>
          <span className="brand-badge">ESTUDIANTE</span>
        </div>
        <nav className="dash-nav">
          <button className={tab === 'catalogo' ? 'active' : ''} onClick={() => setTab('catalogo')}>
            <span className="material-symbols-outlined">storefront</span> Catálogo
          </button>
          <button className={tab === 'publicaciones' ? 'active' : ''} onClick={() => setTab('publicaciones')}>
            <span className="material-symbols-outlined">inventory_2</span> Mis publicaciones
          </button>
          <button className={tab === 'recibidas' ? 'active' : ''} onClick={() => setTab('recibidas')}>
            <span className="material-symbols-outlined">inbox</span> Pedidos recibidos
          </button>
          <button className={tab === 'enviadas' ? 'active' : ''} onClick={() => setTab('enviadas')}>
            <span className="material-symbols-outlined">send</span> Mis pedidos
          </button>
          <Link to="/">
            <span className="material-symbols-outlined">home</span> Página principal
          </Link>
          <button onClick={onLogout}>
            <span className="material-symbols-outlined">logout</span> Salir
          </button>
        </nav>
      </aside>

      <section className="dash-main">
        <div className="dash-topbar">
          <div>
            <h2>Panel de estudiante</h2>
            <p>Gestiona tus publicaciones y pedidos.</p>
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

        <div className="kpi-grid">
          <div className="kpi-card" onClick={() => setTab('catalogo')}>
            <span className="material-symbols-outlined kpi-icon">storefront</span>
            <strong>{productos.length}</strong>
            <span>Catálogo</span>
          </div>
          <div className="kpi-card" onClick={() => setTab('publicaciones')}>
            <span className="material-symbols-outlined kpi-icon">inventory_2</span>
            <strong>{misProductos.length}</strong>
            <span>Mis publicaciones</span>
          </div>
          <div className="kpi-card" onClick={() => setTab('recibidas')}>
            <span className="material-symbols-outlined kpi-icon">inbox</span>
            <strong>{recibidas.length}</strong>
            <span>Pedidos recibidos</span>
          </div>
          <div className="kpi-card" onClick={() => setTab('enviadas')}>
            <span className="material-symbols-outlined kpi-icon">send</span>
            <strong>{enviadas.length}</strong>
            <span>Mis pedidos</span>
          </div>
        </div>

        {cargando ? (
          <p className="loading">Cargando tu panel…</p>
        ) : (
          <>
            {tab === 'catalogo' && (
              <section>
                <h3 className="panel-title">Catálogo de recursos ({productos.length})</h3>
                {productos.length === 0 ? (
                  <p className="empty">Aún no hay recursos publicados.</p>
                ) : (
                  <div className="grid">
                    {productos.map((p) => (
                      <ProductoCard
                        key={p.id}
                        producto={p}
                        onSolicitar={p.personaId === sesion.personaId ? undefined : onSolicitar}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {tab === 'publicaciones' && (
              <section>
                <h3 className="panel-title">Mis publicaciones ({misProductos.length})</h3>
                {misProductos.length === 0 ? (
                  <p className="empty">Aún no has publicado recursos.</p>
                ) : (
                  <div className="table-wrap">
                    <table className="admin-table pub-table">
                      <thead>
                        <tr>
                          <th>Recurso</th>
                          <th>Categoría</th>
                          <th>Modalidad</th>
                          <th>Estado</th>
                          <th>Publicado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {misProductos.map((p) => (
                          <tr key={p.id}>
                            <td>
                              <div className="pub-cell">
                                {p.imagenUrl ? (
                                  <img className="pub-thumb" src={p.imagenUrl} alt={p.titulo} />
                                ) : (
                                  <span className="pub-thumb pub-thumb-fallback material-symbols-outlined">inventory_2</span>
                                )}
                                <div>
                                  <strong>{p.titulo}</strong>
                                  <span>{p.descripcion}</span>
                                </div>
                              </div>
                            </td>
                            <td>{p.categoriaNombre}</td>
                            <td>
                              <span className={`modalidad-badge modalidad-${p.modalidad.toLowerCase()}`}>
                                {p.modalidad === 'DONACION' ? 'Donación' : 'Préstamo'}
                              </span>
                            </td>
                            <td>
                              <span className={`estado-badge estado-${p.estado.toLowerCase()}`}>
                                {ESTADO_PRODUCTO[p.estado] ?? p.estado}
                              </span>
                            </td>
                            <td>{fecha(p.creadoEn)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {tab === 'recibidas' && (
              <section>
                <h3 className="panel-title">Pedidos recibidos ({recibidas.length})</h3>
                {recibidas.length === 0 ? (
                  <p className="empty">Nadie ha solicitado tus recursos todavía.</p>
                ) : (
                  recibidas.map((s) => (
                    <div className="solicitud-card" key={s.id}>
                      <div className="solicitud-top">
                        <div className="solicitud-persona">
                          <span className="avatar">{iniciales(s.solicitanteNombre)}</span>
                          <div>
                            <strong>{s.solicitanteNombre}</strong>
                            <span className="solicitud-producto"> para “{s.productoTitulo}”</span>
                          </div>
                        </div>
                        <span className={`estado-badge estado-${s.estado.toLowerCase()}`}>
                          {ESTADO_LABEL[s.estado] ?? s.estado}
                        </span>
                      </div>
                      <p className="solicitud-meta">
                        {s.cursoAsignatura && <span>📚 {s.cursoAsignatura} · </span>}
                        {s.tipoNecesidad} · {s.puntoEncuentro || 'Sin punto definido'}
                      </p>
                      <p className="solicitud-msg">{s.mensaje}</p>
                      {s.estado === 'PENDIENTE' && (
                        <div className="solicitud-actions">
                          <button className="btn btn-primary" onClick={() => responder(s.id, 'APROBADA')}>
                            Aprobar
                          </button>
                          <button className="btn btn-outline" onClick={() => responder(s.id, 'RECHAZADA')}>
                            Rechazar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </section>
            )}

            {tab === 'enviadas' && (
              <section>
                <h3 className="panel-title">Mis pedidos ({enviadas.length})</h3>
                {enviadas.length === 0 ? (
                  <p className="empty">Aún no has solicitado recursos.</p>
                ) : (
                  enviadas.map((s) => (
                    <div className="solicitud-card" key={s.id}>
                      <div className="solicitud-top">
                        <div className="solicitud-persona">
                          <span className="avatar">{iniciales(s.donanteNombre)}</span>
                          <div>
                            <strong>{s.productoTitulo}</strong>
                            <span className="solicitud-producto"> de {s.donanteNombre}</span>
                          </div>
                        </div>
                        <span className={`estado-badge estado-${s.estado.toLowerCase()}`}>
                          {ESTADO_LABEL[s.estado] ?? s.estado}
                        </span>
                      </div>
                      <p className="solicitud-msg">{s.mensaje}</p>
                    </div>
                  ))
                )}
              </section>
            )}
          </>
        )}
      </section>
    </div>
  )
}
