import { useState } from 'react'
import type { FormEvent } from 'react'
import { solicitarProducto } from '../../../lib/api'
import type { Producto } from '../../../lib/api'

interface Props {
  producto: Producto
  personaId: number
  onClose: () => void
  onSolicitado: () => void
}

export default function SolicitarModal({ producto, personaId, onClose, onSolicitado }: Props) {
  const [mensaje, setMensaje] = useState('')
  const [cursoAsignatura, setCursoAsignatura] = useState('')
  const [tipoNecesidad, setTipoNecesidad] = useState('ESTUDIO')
  const [puntoEncuentro, setPuntoEncuentro] = useState('')
  const [fechaNecesidad, setFechaNecesidad] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await solicitarProducto(producto.id, {
        mensaje,
        cursoAsignatura,
        tipoNecesidad,
        puntoEncuentro,
        fechaNecesidad: fechaNecesidad || null,
        solicitantePersonaId: personaId,
      })
      setExito(true)
      setTimeout(() => {
        onSolicitado()
        onClose()
      }, 1300)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar la solicitud')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Solicitar recurso</span>
            <h2>{producto.titulo}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {exito ? (
          <div className="modal-exito">
            <span className="material-symbols-outlined">task_alt</span>
            <h3>¡Solicitud enviada!</h3>
            <p>El donante fue notificado por correo.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={enviar}>
            <label className="field">
              <span>¿Para qué la necesitas? *</span>
              <textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Ej: La necesito para resolver las guías de cálculo diferencial este semestre…"
                rows={3}
                required
              />
            </label>

            <label className="field">
              <span>Curso o asignatura</span>
              <input
                value={cursoAsignatura}
                onChange={(e) => setCursoAsignatura(e.target.value)}
                placeholder="Ej: Cálculo Diferencial"
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Tipo de necesidad *</span>
                <select value={tipoNecesidad} onChange={(e) => setTipoNecesidad(e.target.value)}>
                  <option value="ESTUDIO">Estudio</option>
                  <option value="EXAMEN">Examen</option>
                  <option value="PRACTICA">Práctica</option>
                  <option value="PROYECTO">Proyecto</option>
                  <option value="OTRO">Otro</option>
                </select>
              </label>
              <label className="field">
                <span>¿Cuándo la necesitas?</span>
                <input
                  type="date"
                  value={fechaNecesidad}
                  onChange={(e) => setFechaNecesidad(e.target.value)}
                />
              </label>
            </div>

            <label className="field">
              <span>Punto de encuentro sugerido</span>
              <input
                value={puntoEncuentro}
                onChange={(e) => setPuntoEncuentro(e.target.value)}
                placeholder="Ej: Biblioteca General - Hall Central"
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Enviar solicitud'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
