import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import PublicarProductoModal from '../modules/recursos/components/PublicarProductoModal'
import SolicitarModal from '../modules/recursos/components/SolicitarModal'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import AdminPage from './pages/AdminPage'
import StudentDashboard from './pages/StudentDashboard'
import type { Producto, Sesion } from '../lib/api'

const SESION_KEY = 'unishare_sesion'

function leerSesion(): Sesion | null {
  try {
    const raw = localStorage.getItem(SESION_KEY)
    return raw ? (JSON.parse(raw) as Sesion) : null
  } catch {
    return null
  }
}

export default function App() {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion)
  const [publicarAbierto, setPublicarAbierto] = useState(false)
  const [productoASolicitar, setProductoASolicitar] = useState<Producto | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  function iniciarSesion(s: Sesion) {
    setSesion(s)
    localStorage.setItem(SESION_KEY, JSON.stringify(s))
    navigate(s.rol === 'ADMINISTRADOR' ? '/admin' : '/mis-recursos')
  }

  function cerrarSesion() {
    setSesion(null)
    localStorage.removeItem(SESION_KEY)
    navigate('/')
  }

  function abrirPublicar() {
    navigate('/')
    setPublicarAbierto(true)
  }

  function abrirSolicitar(producto: Producto) {
    if (!sesion) {
      navigate('/login')
      return
    }
    setProductoASolicitar(producto)
  }

  const mostrarHeader = location.pathname === '/'

  return (
    <>
      {mostrarHeader && (
        <Header
          sesion={sesion ? { nombreCompleto: sesion.nombreCompleto, rol: sesion.rol } : null}
          enDashboard={false}
          onLogin={() => navigate('/login')}
          onRegistrarse={() => navigate('/registro')}
          onPublicar={abrirPublicar}
          onDashboard={() => navigate('/admin')}
          onMisRecursos={() => navigate('/mis-recursos')}
          onLogout={cerrarSesion}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage refreshToken={refreshToken} onPublicar={abrirPublicar} onSolicitar={abrirSolicitar} />} />
        <Route
          path="/mis-recursos"
          element={
            sesion ? (
              <StudentDashboard
                sesion={sesion}
                onLogout={cerrarSesion}
                onSolicitar={abrirSolicitar}
                refreshToken={refreshToken}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<LoginPage onLogin={iniciarSesion} />} />
        <Route path="/registro" element={<RegistroPage />} />
        <Route
          path="/admin"
          element={
            sesion?.rol === 'ADMINISTRADOR'
              ? <AdminPage sesion={sesion} onLogout={cerrarSesion} />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {publicarAbierto && (
        <PublicarProductoModal
          onClose={() => setPublicarAbierto(false)}
          onPublicado={() => {
            setPublicarAbierto(false)
            setRefreshToken((r) => r + 1)
          }}
          onRegistrarse={(cedula) => {
            setPublicarAbierto(false)
            navigate(`/registro?cedula=${encodeURIComponent(cedula)}`)
          }}
        />
      )}

      {productoASolicitar && sesion && (
        <SolicitarModal
          producto={productoASolicitar}
          personaId={sesion.personaId}
          onClose={() => setProductoASolicitar(null)}
          onSolicitado={() => setRefreshToken((r) => r + 1)}
        />
      )}
    </>
  )
}
