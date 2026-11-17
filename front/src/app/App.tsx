import { useEffect, useState } from 'react'
import Header from '../components/layout/Header'
import CategoriaPills from '../modules/recursos/components/CategoriaPills'
import ProductoCard from '../modules/recursos/components/ProductoCard'
import PublicarProductoModal from '../modules/recursos/components/PublicarProductoModal'
import RegistroModal from '../modules/auth/components/RegistroModal'
import { getCategorias, getProductos } from '../lib/api'
import type { Categoria, Producto } from '../lib/api'

export default function App() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [registroAbierto, setRegistroAbierto] = useState(false)
  const [cedulaPrefill, setCedulaPrefill] = useState('')
  const [volverAPublicar, setVolverAPublicar] = useState(false)

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => setError('No se pudieron cargar las categorías'))
  }, [])

  useEffect(() => {
    setCargando(true)
    getProductos(categoriaActiva)
      .then((p) => setProductos(p))
      .catch(() => setError('No se pudieron cargar los recursos'))
      .finally(() => setCargando(false))
  }, [categoriaActiva])

  async function recargar() {
    setCargando(true)
    try {
      setProductos(await getProductos(categoriaActiva))
    } catch {
      setError('No se pudieron cargar los recursos')
    } finally {
      setCargando(false)
    }
  }

  function abrirRegistro(cedula = '', desdePublicar = false) {
    setCedulaPrefill(cedula)
    setVolverAPublicar(desdePublicar)
    setModalAbierto(false)
    setRegistroAbierto(true)
  }

  function cerrarRegistro() {
    setRegistroAbierto(false)
    setCedulaPrefill('')
    setVolverAPublicar(false)
  }

  function alRegistrarse() {
    setRegistroAbierto(false)
    setCedulaPrefill('')
    if (volverAPublicar) {
      setModalAbierto(true)
    }
    setVolverAPublicar(false)
  }

  return (
    <>
      <Header onPublicar={() => setModalAbierto(true)} onRegistrarse={() => abrirRegistro('', false)} />

      <main>
        <section className="hero">
          <div className="hero-card">
            <div className="hero-blob hero-blob-1" />
            <div className="hero-blob hero-blob-2" />
            <div className="hero-content">
              <span className="hero-eyebrow">
                <span className="material-symbols-outlined">eco</span>
                Red solidaria universitaria
              </span>
              <h1 className="hero-title">Intercambio de saberes, libros e instrumental académico</h1>
              <p className="hero-sub">
                La red circular que democratiza el acceso a insumos de laboratorio, cálculo avanzado y
                bibliografía esencial. Transfiere recursos a estudiantes sin costo y con garantía comunitaria.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => setModalAbierto(true)}>
                  <span className="material-symbols-outlined">volunteer_activism</span>
                  Publicar recurso
                </button>
                <a className="btn btn-outline" href="#catalogo">Explorar catálogo</a>
              </div>
              <div className="stats">
                <div className="stat">
                  <span className="material-symbols-outlined">eco</span>
                  <div><strong>1,420 kg CO₂ evitado</strong><span>Economía circular</span></div>
                </div>
                <div className="stat">
                  <span className="material-symbols-outlined">sync_alt</span>
                  <div><strong>894 transferencias</strong><span>Comunidad activa</span></div>
                </div>
                <div className="stat">
                  <span className="material-symbols-outlined">verified_user</span>
                  <div><strong>100% gratuito</strong><span>Con credencial institucional</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="catalogo">
          <h2 className="section-title">Catálogo solidario</h2>
          <p className="section-sub">Explora y solicita lo que necesitas para tu formación.</p>
          <CategoriaPills categorias={categorias} activa={categoriaActiva} onSeleccionar={setCategoriaActiva} />

          {error && <p className="empty">{error}</p>}
          {cargando ? (
            <p className="loading">Cargando recursos…</p>
          ) : productos.length === 0 ? (
            <div className="empty">
              <span className="material-symbols-outlined">inbox</span>
              <p>Aún no hay recursos publicados. ¡Sé el primero en compartir!</p>
            </div>
          ) : (
            <div className="grid" style={{ marginTop: 18 }}>
              {productos.map((p) => <ProductoCard key={p.id} producto={p} />)}
            </div>
          )}
        </section>

        <section className="section">
          <h2 className="section-title">Cómo funciona</h2>
          <p className="section-sub">Un flujo simple, seguro y sin dinero de por medio.</p>
          <div className="steps">
            <div className="step">
              <span className="step-num">1</span>
              <h4>Publica</h4>
              <p>Comparte un libro, equipo o insumo que ya no uses, en modalidad de donación o préstamo.</p>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <h4>Solicita</h4>
              <p>Encuentra lo que necesitas y contacta al donante con tu justificación académica.</p>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <h4>Entrega en campus</h4>
              <p>Coordinan un punto seguro de entrega dentro de la universidad.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div><strong>UniShare</strong> · Red de economía circular e intercambio académico</div>
          <span>© 2026 UniShare · Alineado al ODS 10</span>
        </div>
      </footer>

      {modalAbierto && (
        <PublicarProductoModal
          categorias={categorias}
          onClose={() => setModalAbierto(false)}
          onPublicado={recargar}
          onRegistrarse={(cedula) => abrirRegistro(cedula, true)}
        />
      )}

      {registroAbierto && (
        <RegistroModal
          cedulaInicial={cedulaPrefill}
          onClose={cerrarRegistro}
          onRegistrado={alRegistrarse}
        />
      )}
    </>
  )
}
