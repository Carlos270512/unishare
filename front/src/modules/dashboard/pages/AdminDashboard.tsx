import { useEffect, useState } from 'react'
import ProductoCard from '../../recursos/components/ProductoCard'
import { getProductos, getUsuarios } from '../../../lib/api'
import type { Producto, UsuarioInfo } from '../../../lib/api'

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState<UsuarioInfo[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([getUsuarios(), getProductos()])
      .then(([u, p]) => {
        setUsuarios(u)
        setProductos(p)
      })
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p className="loading">Cargando panel…</p>

  return (
    <section className="section">
      <h2 className="section-title">Panel de administración</h2>
      <p className="section-sub">Usuarios registrados y publicaciones de la comunidad.</p>

      <h3 className="panel-title">Usuarios ({usuarios.length})</h3>
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
                  <span className={`rol-badge ${u.rol === 'ADMINISTRADOR' ? 'rol-admin' : ''}`}>{u.rol}</span>
                </td>
                <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="panel-title">Publicaciones ({productos.length})</h3>
      <div className="grid">
        {productos.map((p) => (
          <ProductoCard key={p.id} producto={p} />
        ))}
      </div>
    </section>
  )
}
