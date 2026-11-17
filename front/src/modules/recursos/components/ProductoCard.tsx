import type { Producto } from '../../../lib/api'

interface Props {
  producto: Producto
  onSolicitar?: (producto: Producto) => void
}

export default function ProductoCard({ producto, onSolicitar }: Props) {
  const iniciales = producto.personaNombre
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const modalidad = producto.modalidad === 'DONACION' ? 'Donación' : 'Préstamo'

  return (
    <article className="card">
      <div className="card-media">
        {producto.imagenUrl ? (
          <img src={producto.imagenUrl} alt={producto.titulo} loading="lazy" />
        ) : (
          <div className="card-media-fallback">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
        )}
        <span className="estado-pill">Disponible</span>
        <span className="modalidad-pill">{modalidad}</span>
      </div>

      <div className="card-body">
        <span className="card-cat">{producto.categoriaNombre}</span>
        <h3 className="card-title">{producto.titulo}</h3>
        <p className="card-desc">{producto.descripcion}</p>

        <div className="card-donor">
          <span className="avatar">{iniciales}</span>
          <div>
            <strong>{producto.personaNombre}</strong>
            <span>{producto.personaEmail}</span>
          </div>
        </div>

        {onSolicitar && (
          <button className="btn btn-outline btn-block" onClick={() => onSolicitar(producto)}>
            Solicitar
          </button>
        )}
      </div>
    </article>
  )
}
