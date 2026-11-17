import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { getCategorias, getPersonaPorCedula, publicarProducto } from '../../../lib/api'
import type { Categoria } from '../../../lib/api'

interface Props {
  onClose: () => void
  onPublicado: () => void
  onRegistrarse: (cedula: string) => void
}

export default function PublicarProductoModal({ onClose, onPublicado, onRegistrarse }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [modalidad, setModalidad] = useState('DONACION')
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [cedula, setCedula] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sinCuenta, setSinCuenta] = useState(false)
  const [exito, setExito] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => setCategorias([]))
  }, [])

  function seleccionarImagen(file: File | undefined) {
    if (!file) return
    setImagen(file)
    setPreview(URL.createObjectURL(file))
  }

  function quitarImagen() {
    setImagen(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSinCuenta(false)

    if (!categoriaId) {
      setError('Selecciona una categoría.')
      return
    }

    setEnviando(true)
    try {
      const persona = await getPersonaPorCedula(cedula.trim())
      if (!persona) {
        setSinCuenta(true)
        setError('No encontramos una cuenta con esa cédula. Crea una para continuar.')
        setEnviando(false)
        return
      }

      const form = new FormData()
      form.append('titulo', titulo)
      form.append('descripcion', descripcion)
      form.append('modalidad', modalidad)
      form.append('categoriaId', String(categoriaId))
      form.append('personaId', String(persona.id))
      if (imagen) form.append('imagen', imagen)

      await publicarProducto(form)
      setExito(true)
      setTimeout(() => {
        onPublicado()
        onClose()
      }, 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar el recurso.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Aporte solidario</span>
            <h2>Publicar recurso</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {exito ? (
          <div className="modal-exito">
            <span className="material-symbols-outlined">task_alt</span>
            <h3>¡Publicado con éxito!</h3>
            <p>Tu recurso ya está en el catálogo solidario.</p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={enviar}>
            <label className="field">
              <span>Título *</span>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Cálculo de una variable - Stewart"
                required
              />
            </label>

            <label className="field">
              <span>Descripción *</span>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Estado del material, uso académico, etc."
                rows={3}
                required
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Modalidad *</span>
                <select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
                  <option value="DONACION">Donación</option>
                  <option value="PRESTAMO">Préstamo</option>
                </select>
              </label>
              <label className="field">
                <span>Categoría *</span>
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Selecciona…</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Tu cédula (para identificar tu cuenta) *</span>
              <input
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej: 1727168168"
                required
              />
            </label>

            <div className="upload">
              {preview ? (
                <div className="upload-preview">
                  <img src={preview} alt="Vista previa" />
                  <button type="button" className="icon-btn" onClick={quitarImagen} aria-label="Quitar imagen">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ) : (
                <button type="button" className="upload-drop" onClick={() => fileRef.current?.click()}>
                  <span className="material-symbols-outlined">add_photo_alternate</span>
                  <span>Subir imagen (opcional)</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => seleccionarImagen(e.target.files?.[0])}
              />
            </div>

            {error && <p className="form-error">{error}</p>}
            {sinCuenta && (
              <button type="button" className="btn btn-outline btn-block" onClick={() => onRegistrarse(cedula.trim())}>
                <span className="material-symbols-outlined">person_add</span>
                Crear cuenta con esta cédula
              </button>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={enviando}>
                {enviando ? 'Publicando…' : 'Publicar recurso'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
