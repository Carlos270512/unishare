# front

Base React + TypeScript + Vite, con arquitectura modular por funcionalidades.
La pantalla inicial muestra únicamente «Frontend levantado».

## Ejecutar

Instala Node.js 22.12 o superior (se recomienda una versión LTS compatible).

```bash
cd front
npm install
npm run dev
```

Abre la URL indicada en la terminal. Para compilar: `npm run build`.
Para revisar el código: `npm run lint`.

## Arquitectura

Las carpetas vacías incluyen `.gitkeep` para conservar la estructura.
Solo se implementan el arranque y la pantalla inicial. No hay autenticación,
peticiones API ni funcionalidades de negocio implementadas.
El módulo productos es una referencia para futuras funcionalidades.

- `public/`: Archivos públicos servidos directamente.
- `src/app/`: Inicio y proveedores de la aplicación.
- `src/assets/images/`: Imágenes.
- `src/assets/icons/`: Iconos.
- `src/components/ui/`: Componentes visuales compartidos.
- `src/components/layout/`: Cabecera, menú y contenedores.
- `src/config/`: Configuración y variables de entorno.
- `src/lib/`: Cliente HTTP compartido y configuración de librerías.
- `src/routes/`: Definición y protección de rutas.
- `src/hooks/`: Hooks compartidos.
- `src/utils/`: Funciones auxiliares compartidas.
- `src/styles/`: Estilos globales.
- `src/modules/auth/components/`: components del módulo auth.
- `src/modules/auth/pages/`: pages del módulo auth.
- `src/modules/auth/services/`: services del módulo auth.
- `src/modules/auth/hooks/`: hooks del módulo auth.
- `src/modules/auth/types/`: types del módulo auth.
- `src/modules/dashboard/components/`: components del módulo dashboard.
- `src/modules/dashboard/pages/`: pages del módulo dashboard.
- `src/modules/productos/components/`: components del módulo productos.
- `src/modules/productos/pages/`: pages del módulo productos.
- `src/modules/productos/services/`: services del módulo productos.
- `src/modules/productos/hooks/`: hooks del módulo productos.
- `src/modules/productos/types/`: types del módulo productos.
- `src/modules/auth/context/`: Estado compartido de autenticación.

## API

Copia `.env.example` como `.env` y ajusta `VITE_API_URL` cuando conectes el backend.
La variable queda preparada; todavía no se consume.
El futuro cliente HTTP va en `src/lib/`; cada módulo utiliza su carpeta
`services/` para los endpoints y `types/` para solicitudes y respuestas.
No guardes contraseñas de base de datos ni claves privadas en el frontend.
