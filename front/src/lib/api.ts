const BASE = '/api'

export interface Categoria {
  id: number
  nombre: string
}

export interface Producto {
  id: number
  titulo: string
  descripcion: string
  modalidad: 'DONACION' | 'PRESTAMO'
  categoriaId: number
  categoriaNombre: string
  imagenUrl: string | null
  personaId: number
  personaEmail: string
  personaNombre: string
  estado: string
  creadoEn: string
}

export interface Persona {
  id: number
  cedula: string
  nombreCompleto: string
  email: string
  fotoUrl: string | null
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.mensaje ?? `Error ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function getCategorias(): Promise<Categoria[]> {
  return json(await fetch(`${BASE}/categorias`))
}

export async function getProductos(categoriaId?: number | null): Promise<Producto[]> {
  const url = categoriaId ? `${BASE}/productos?categoriaId=${categoriaId}` : `${BASE}/productos`
  return json(await fetch(url))
}

export async function getPersonaPorCedula(cedula: string): Promise<Persona | null> {
  const res = await fetch(`${BASE}/personas/cedula/${encodeURIComponent(cedula)}`)
  if (res.status === 404) return null
  return json<Persona>(res)
}

export async function publicarProducto(form: FormData): Promise<Producto> {
  return json(await fetch(`${BASE}/productos`, { method: 'POST', body: form }))
}

export interface Usuario {
  id: number
  personaId: number
  email: string
  rol: string
}

export async function registrarUsuario(form: FormData): Promise<Usuario> {
  return json(await fetch(`${BASE}/auth/registro`, { method: 'POST', body: form }))
}

export interface DatosCedula {
  cedula: string
  nombres: string
  apellidos: string
  nombreCompleto: string
}

export async function verificarCedula(cedula: string): Promise<DatosCedula> {
  return json(await fetch(`${BASE}/auth/verificar-cedula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cedula }),
  }))
}
