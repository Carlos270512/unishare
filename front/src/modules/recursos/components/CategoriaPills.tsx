import type { Categoria } from '../../../lib/api'

interface Props {
  categorias: Categoria[]
  activa: number | null
  onSeleccionar: (id: number | null) => void
}

export default function CategoriaPills({ categorias, activa, onSeleccionar }: Props) {
  return (
    <div className="pills">
      <button className={`pill ${activa === null ? 'pill-active' : ''}`} onClick={() => onSeleccionar(null)}>
        Todos
      </button>
      {categorias.map((c) => (
        <button
          key={c.id}
          className={`pill ${activa === c.id ? 'pill-active' : ''}`}
          onClick={() => onSeleccionar(c.id)}
        >
          {c.nombre}
        </button>
      ))}
    </div>
  )
}
