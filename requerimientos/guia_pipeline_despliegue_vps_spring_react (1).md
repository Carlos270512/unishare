# Guía para desplegar Spring Boot + React en un VPS con GitHub Actions

## 1. Objetivo

Esta guía explica cómo preparar un proyecto con backend Spring Boot y frontend
React para que:

1. La aplicación se ejecute mediante Docker Compose.
2. Un dominio apunte al VPS.
3. Nginx publique la aplicación mediante HTTPS.
4. GitHub Actions se conecte por SSH al VPS.
5. Cada `push` a la rama `develop` actualice automáticamente producción.

Está escrita para partir desde un VPS nuevo y para servir como referencia a un
equipo que todavía no tenga Dockerfiles, Compose ni pipeline.

> **Importante:** el proyecto SuilaftDD usado como referencia tiene Spring Boot,
> Angular, Node/Playwright, PostgreSQL y RabbitMQ. El proyecto objetivo puede ser
> más sencillo. No se deben copiar servicios que la otra aplicación no necesite.

---

## 2. Cómo funciona el despliegue de referencia

El flujo actual de SuilaftDD es:

```text
Push a develop
      |
      v
GitHub Actions
      |
      | SSH usando VPS_SSH_KEY
      v
VPS: /opt/suilaftdd
      |
      | git fetch + reset a origin/develop
      v
Docker Compose reconstruye y levanta los servicios
      |
      v
Se comprueba el estado y el health check del backend
```

Hay dos conexiones distintas que no se deben confundir:

| Conexión | Para qué sirve | Credencial recomendada |
|---|---|---|
| GitHub Actions -> VPS | Permite que el pipeline ejecute comandos en el servidor | Clave SSH cuya pública está en `authorized_keys` del VPS |
| VPS -> repositorio GitHub | Permite que `git fetch` descargue el código privado | Deploy Key de solo lectura agregada al repositorio |

La clave privada de la primera conexión se guarda en GitHub Actions. La clave
privada de la segunda permanece únicamente en el VPS.

---

## 3. Pipeline YAML utilizado actualmente en SuilaftDD

Archivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy SuilaftDD to VPS

on:
  push:
    branches: [ "develop" ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy on VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          script: |
            set -e

            cd /opt/suilaftdd

            echo "===> Actualizando repo"
            git fetch --all
            git reset --hard origin/develop

            echo "===> Levantando Docker Compose full"
            docker compose --env-file .env -f infra/docker/docker-compose.full.yml up -d --build

            echo "===> Estado de servicios"
            docker compose --env-file .env -f infra/docker/docker-compose.full.yml ps

            echo "===> Health backend"
            curl -f http://localhost:8080/api/actuator/health

            echo "===> Deploy completado"
```

### Qué realiza cada bloque

- `on.push.branches`: ejecuta el pipeline únicamente cuando llega un cambio a
  `develop`.
- `actions/checkout`: descarga el repositorio en el runner de GitHub. En este
  pipeline se usa principalmente para identificar el commit y mantener el flujo
  convencional; la compilación real ocurre en el VPS.
- `appleboy/ssh-action`: abre una conexión SSH al servidor.
- `set -e`: interrumpe el script ante el primer comando fallido.
- `git fetch --all`: actualiza las referencias remotas.
- `git reset --hard origin/develop`: deja la copia del VPS exactamente igual a
  `develop`.
- `docker compose ... up -d --build`: reconstruye imágenes y actualiza los
  contenedores.
- `docker compose ... ps`: muestra el estado resultante.
- `curl -f`: hace fallar el pipeline si el backend no responde correctamente.

> `git reset --hard` elimina cualquier cambio manual dentro del checkout del
> servidor. Por eso `/opt/<aplicacion>` debe ser una copia exclusiva para
> despliegue. Las configuraciones persistentes deben vivir en `.env`, volúmenes o
> archivos externos ignorados por Git.

---

## 4. Requisitos mínimos

### 4.1. Requisitos del proyecto

- Repositorio alojado en GitHub.
- Rama de despliegue, por ejemplo `develop`.
- Backend Spring Boot compilable.
- Frontend React compilable.
- Un endpoint de salud del backend.
- Dockerfile para backend.
- Dockerfile para frontend.
- Configuración Nginx interna para servir React y redirigir `/api`.
- Archivo Docker Compose de producción.
- `.env.example` sin credenciales reales.
- `.env` excluido mediante `.gitignore`.
- Workflow en `.github/workflows/deploy.yml`.

### 4.2. Requisitos del VPS

Recomendación mínima para una aplicación pequeña:

- Ubuntu Server 22.04 o 24.04 LTS de 64 bits.
- 2 vCPU.
- 4 GB de RAM.
- 40 GB de almacenamiento.
- Dirección IPv4 pública fija.
- Acceso SSH.
- Puertos públicos:
  - `22/tcp` para SSH, o el puerto SSH personalizado.
  - `80/tcp` para validación HTTP y redirección.
  - `443/tcp` para HTTPS.

Si Docker publica PostgreSQL, Redis u otros servicios, no deben quedar abiertos
a Internet. Preferiblemente no se publica su puerto o se enlaza solo a
`127.0.0.1`.

### 4.3. Requisitos externos

- Repositorio GitHub.
- GitHub Actions habilitado.
- Dominio o subdominio administrable.
- Acceso al panel DNS.
- Correo para registrar el certificado TLS.

---

## 5. Estructura recomendada del repositorio

No es obligatorio usar exactamente estos nombres, pero el pipeline y Compose
deben coincidir con las rutas reales.

```text
proyecto/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml                 # o build.gradle
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── src/
├── infra/
│   └── docker/
│       └── docker-compose.prod.yml
├── .env.example
└── .gitignore
```

En SuilaftDD se usa un monorepo:

```text
apps/backend/Dockerfile
apps/frontend/Dockerfile
apps/worker/Dockerfile
infra/docker/docker-compose.full.yml
.github/workflows/deploy.yml
```

---

## 6. Prompts para adaptar el proyecto

Los siguientes prompts se deben ejecutar en orden desde la raíz del proyecto.
Están escritos para que una herramienta de desarrollo inspeccione antes de
modificar.

### Prompt 1: auditoría inicial

```text
Audita este repositorio para preparar un despliegue de producción mediante
Docker Compose y GitHub Actions hacia un VPS Ubuntu.

Antes de modificar:
1. Identifica la ubicación real del backend Spring Boot y del frontend React.
2. Determina si el backend usa Maven o Gradle, la versión de Java, el puerto,
   perfiles y variables requeridas.
3. Determina si React usa Vite, Create React App, Next.js u otra herramienta.
4. Identifica la URL base utilizada por el frontend para llamar al backend.
5. Detecta PostgreSQL, Redis, RabbitMQ u otras dependencias.
6. Identifica migraciones de base de datos y endpoint de health check.
7. Revisa Dockerfiles, Compose, Nginx, .env.example, .gitignore y workflows
   existentes.
8. No expongas ni copies secretos encontrados.

Entrega primero un inventario con rutas, comandos de build, puertos, servicios y
riesgos. No modifiques archivos todavía.
```

### Prompt 2: Dockerfile de Spring Boot

```text
Usando la auditoría previa, crea o corrige el Dockerfile de producción del
backend Spring Boot.

Requisitos:
- Detecta Maven o Gradle; no asumas uno incorrecto.
- Usa compilación multi-stage.
- Usa la misma versión de Java declarada por el proyecto.
- Aprovecha caché copiando primero pom.xml/archivos Gradle y luego el código.
- Ejecuta el build reproducible y genera un único artefacto ejecutable.
- La imagen final debe usar solo un JRE, no Maven/Gradle.
- Ejecuta como usuario sin privilegios cuando el proyecto lo permita.
- Expón únicamente el puerto interno del backend.
- Acepta JAVA_OPTS y perfil mediante variables de entorno.
- No copies .env, claves, target, build ni node_modules.
- Mantén cualquier entrypoint existente que sea necesario.

Después valida construyendo la imagen y reporta el comando y resultado.
No cambies código funcional no relacionado.
```

### Prompt 3: Dockerfile de React

```text
Crea o corrige el Dockerfile de producción del frontend React después de
detectar si utiliza Vite, CRA, Next.js u otra herramienta.

Para una SPA estática:
- Usa build multi-stage con la versión de Node compatible con el proyecto.
- Instala dependencias de forma reproducible con npm ci, pnpm --frozen-lockfile
  o yarn --frozen-lockfile según el lockfile real.
- Ejecuta el comando de build real.
- Copia únicamente el resultado compilado a nginx:alpine.
- No uses el servidor de desarrollo en producción.
- Incluye el nginx.conf del proyecto.

Si es Next.js con renderizado de servidor, no uses Nginx como si fuera una SPA:
crea una imagen Node de producción acorde al modo standalone real.

Valida la construcción y no inventes rutas de salida; obtén dist/build de la
configuración del proyecto.
```

### Prompt 4: Nginx interno del frontend

```text
Crea o corrige frontend/nginx.conf para producción.

Requisitos para una SPA React:
- Servir los archivos estáticos desde /usr/share/nginx/html.
- Resolver rutas del cliente con: try_files $uri $uri/ /index.html.
- No almacenar index.html en caché.
- Permitir caché larga solo para assets con hash si la build los genera.
- Redirigir /api/ al servicio Docker del backend usando su nombre de servicio,
  por ejemplo http://backend:8080.
- Enviar Host, X-Real-IP, X-Forwarded-For y X-Forwarded-Proto.
- Incluir Upgrade/Connection si existen WebSockets.
- Definir client_max_body_size según el tamaño de archivos de la aplicación.
- No colocar certificados TLS aquí si el HTTPS terminará en el Nginx del host.

Verifica la sintaxis con nginx -t dentro de la imagen.
```

### Prompt 5: Docker Compose de producción

```text
Crea infra/docker/docker-compose.prod.yml para este proyecto.

Requisitos:
- Usa el repositorio como build context y apunta a los Dockerfiles reales.
- Incluye solo servicios que el proyecto realmente utilice.
- Define nombres claros para backend, frontend y base de datos.
- Usa una red Docker privada.
- Usa volúmenes nombrados para datos persistentes.
- Carga secretos desde el .env raíz sin incluirlos en Git.
- Entre contenedores usa nombres de servicio, nunca localhost.
- Agrega restart: unless-stopped.
- Agrega healthchecks reales.
- Usa depends_on con condition: service_healthy cuando corresponda.
- Publica el frontend solo en 127.0.0.1:PUERTO_HOST:80 para que el Nginx del
  host sea la única entrada pública.
- Evita publicar PostgreSQL/Redis/RabbitMQ. Si es imprescindible para soporte,
  enlázalos a 127.0.0.1 y documenta el motivo.
- No uses credenciales predeterminadas inseguras.

Valida con:
docker compose --env-file .env -f infra/docker/docker-compose.prod.yml config

No levantes el stack hasta confirmar que la configuración es válida.
```

### Prompt 6: variables y seguridad

```text
Audita todas las variables de entorno utilizadas por backend, frontend y
Docker Compose.

Genera o actualiza .env.example con nombres y valores de ejemplo no sensibles.
Verifica que .env esté ignorado por Git.

Clasifica las variables en:
- Base de datos.
- Seguridad/JWT.
- URLs y CORS.
- Correo.
- APIs externas.
- Puertos publicados.
- Perfiles y observabilidad.

No muestres ni copies valores reales. Si detectas un secreto rastreado por Git,
repórtalo y recomienda rotarlo; no lo vuelvas a imprimir.
```

### Prompt 7: health check

```text
Verifica que el backend Spring Boot tenga un endpoint de salud apto para el
pipeline.

Si usa Actuator:
- Confirma la dependencia spring-boot-starter-actuator.
- Expón únicamente health e info salvo que exista una necesidad documentada.
- Verifica la ruta real considerando server.servlet.context-path.
- Configura el healthcheck de Docker y el curl del pipeline con esa ruta.

Si no usa Actuator, crea un endpoint mínimo que no devuelva secretos ni dependa
de autenticación.

Agrega una prueba que confirme HTTP 200 y documenta la URL interna y la URL
publicada.
```

### Prompt 8: pipeline final

```text
Crea .github/workflows/deploy.yml tomando como referencia el pipeline SuilaftDD.

Objetivo:
- Ejecutar validaciones y desplegar cuando exista push a develop.
- Permitir también ejecución manual con workflow_dispatch.
- Evitar dos despliegues simultáneos mediante concurrency.
- Conectarse al VPS con VPS_HOST, VPS_USER, VPS_SSH_KEY y VPS_PORT.
- Ir al directorio definido para despliegue.
- Descargar origin/develop.
- Validar Docker Compose.
- Reconstruir y levantar servicios.
- Esperar el health check con reintentos limitados.
- Mostrar docker compose ps al finalizar.
- Fallar si algún paso o health check falla.
- No imprimir secretos ni el contenido de .env.

Antes de escribirlo, adapta rutas, nombre del Compose, puerto y endpoint de
salud a este repositorio. No copies literalmente nombres de SuilaftDD.
```

### Prompt 9: auditoría final

```text
Realiza una auditoría final del despliegue Docker + GitHub Actions.

Comprueba:
- Los Dockerfiles compilan.
- Compose valida.
- Todos los servicios tienen configuración coherente.
- El frontend llega al backend por /api.
- No existen secretos rastreados por Git.
- .env está ignorado.
- Los datos persistentes están en volúmenes.
- Solo se publican los puertos necesarios.
- El backend tiene health check.
- El pipeline apunta a develop y a las rutas reales.
- El pipeline no modifica migraciones ya aplicadas.
- Los comandos de recuperación y diagnóstico están documentados.

Ejecuta las validaciones disponibles, informa cualquier prueba no realizada y
no hagas cambios funcionales ajenos al despliegue.
```

---

## 7. Preparación inicial del VPS

Los ejemplos asumen:

```text
Usuario de despliegue: deploy
Directorio: /opt/miapp
Dominio: app.ejemplo.com
Rama: develop
Frontend publicado localmente: 127.0.0.1:4200
Backend publicado localmente: 127.0.0.1:8080
```

Reemplazar todos esos valores por los reales.

### 7.1. Actualizar el servidor

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl ca-certificates dnsutils nginx ufw
```

### 7.2. Crear un usuario exclusivo de despliegue

```bash
sudo adduser deploy
```

Crear el directorio de la aplicación:

```bash
sudo mkdir -p /opt/miapp
sudo chown -R deploy:deploy /opt/miapp
```

No es obligatorio usar `root`. Un usuario exclusivo permite revocar el acceso
sin afectar otras tareas administrativas. Este usuario no necesita pertenecer al
grupo `sudo` para ejecutar el pipeline descrito.

### 7.3. Instalar Docker Engine y Compose

Usar el repositorio oficial de Docker:

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
sudo apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

Habilitar Docker:

```bash
sudo systemctl enable --now docker
sudo usermod -aG docker deploy
```

Cerrar la sesión SSH y volver a entrar para aplicar el grupo. Verificar:

```bash
docker version
docker compose version
docker run --rm hello-world
```

> El grupo `docker` concede capacidades equivalentes a administración del host.
> La clave SSH del usuario `deploy` debe protegerse como una credencial
> privilegiada. En entornos con requisitos más estrictos se debe evaluar Docker
> rootless o un runner con permisos todavía más limitados.

Referencia oficial:
[Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

---

## 8. Configurar las claves SSH

### 8.1. Clave A: GitHub Actions entra al VPS

Esta clave permite ejecutar el pipeline en el servidor.

Generarla desde un equipo administrativo seguro:

```bash
ssh-keygen -t ed25519 -C "github-actions-miapp" -f ./github-actions-miapp
```

Para automatización sin interacción, la acción necesita usar la clave sin pedir
una contraseña. Debe almacenarse con especial cuidado.

Archivos resultantes:

```text
github-actions-miapp      -> privada, va al secreto VPS_SSH_KEY
github-actions-miapp.pub  -> pública, va al VPS
```

Instalar la pública en el VPS:

```bash
ssh-copy-id -i ./github-actions-miapp.pub deploy@IP_DEL_VPS
```

O agregar manualmente su contenido en:

```text
/home/deploy/.ssh/authorized_keys
```

Permisos:

```bash
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
```

Probar desde el equipo administrativo:

```bash
ssh -i ./github-actions-miapp -p 22 deploy@IP_DEL_VPS
```

### 8.2. Clave B: el VPS descarga el repositorio

Entrar al VPS como `deploy` y generar una clave dedicada:

```bash
ssh-keygen \
  -t ed25519 \
  -C "deploy-miapp-vps" \
  -f ~/.ssh/miapp_github_deploy \
  -N ""
```

Mostrar únicamente la pública:

```bash
cat ~/.ssh/miapp_github_deploy.pub
```

En GitHub:

```text
Repositorio
-> Settings
-> Deploy keys
-> Add deploy key
-> Pegar la clave pública
-> No activar "Allow write access"
```

Configurar el VPS para usar esa clave:

```bash
cat >> ~/.ssh/config <<'EOF'
Host github-miapp
  HostName github.com
  User git
  IdentityFile ~/.ssh/miapp_github_deploy
  IdentitiesOnly yes
EOF

chmod 600 ~/.ssh/config
```

Probar:

```bash
ssh -T github-miapp
```

El mensaje esperado indica que la autenticación fue exitosa y que GitHub no
ofrece acceso de shell.

Clonar:

```bash
git clone git@github-miapp:ORGANIZACION/REPOSITORIO.git /opt/miapp
cd /opt/miapp
git switch develop
```

Si el repositorio ya fue clonado por HTTPS:

```bash
cd /opt/miapp
git remote set-url origin \
  git@github-miapp:ORGANIZACION/REPOSITORIO.git
git fetch origin
```

Referencia oficial:
[Managing deploy keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys).

### Alternativa: PAT classic

Un token puede usarse como contraseña para Git sobre HTTPS, pero para este caso
la Deploy Key de solo lectura es más específica y no depende de una cuenta
personal.

Si el equipo decide usar PAT:

- Otorgar el mínimo acceso necesario.
- No escribir el token dentro de la URL remota.
- No guardarlo en el repositorio, Compose, `.env.example` ni workflow.
- No dejarlo visible en el historial de comandos.
- Definir fecha de expiración y procedimiento de rotación.

Referencia oficial:
[Managing personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).

---

## 9. Configurar el archivo `.env` de producción

El archivo real se crea directamente en el VPS:

```bash
cd /opt/miapp
cp .env.example .env
chmod 600 .env
nano .env
```

Ejemplo reducido:

```dotenv
SPRING_PROFILES_ACTIVE=prod
BACKEND_PUBLISHED_PORT=8080
FRONTEND_PUBLISHED_PORT=4200

POSTGRES_DB=miapp
POSTGRES_USER=miapp
POSTGRES_PASSWORD=REEMPLAZAR

JWT_SECRET=REEMPLAZAR_CON_VALOR_ALEATORIO
CORS_ALLOWED_ORIGINS=https://app.ejemplo.com
FRONTEND_PUBLIC_URL=https://app.ejemplo.com
```

Generar secretos aleatorios:

```bash
openssl rand -base64 48
```

Comprobar que Git no rastrea `.env`:

```bash
git check-ignore -v .env
git status --short
```

Nunca ejecutar:

```bash
git add .env
```

Las variables del frontend estático que se incorporan durante el build no son
secretas: cualquier usuario puede verlas en el navegador. Las claves privadas
deben permanecer en el backend.

---

## 10. Primer levantamiento manual

Antes de activar el pipeline debe existir un despliegue manual exitoso:

```bash
cd /opt/miapp

docker compose \
  --env-file .env \
  -f infra/docker/docker-compose.prod.yml \
  config

docker compose \
  --env-file .env \
  -f infra/docker/docker-compose.prod.yml \
  up -d --build
```

Revisar:

```bash
docker compose \
  --env-file .env \
  -f infra/docker/docker-compose.prod.yml \
  ps

docker compose \
  --env-file .env \
  -f infra/docker/docker-compose.prod.yml \
  logs --tail 200 backend
```

Probar el frontend y backend desde el VPS:

```bash
curl -I http://127.0.0.1:4200/
curl -f http://127.0.0.1:8080/actuator/health
```

Adaptar la ruta de Actuator si existe un contexto, por ejemplo:

```text
/api/actuator/health
```

---

## 11. Configurar dominio y DNS

El dominio no se configura en SSH.

En el proveedor DNS se crea:

| Tipo | Nombre | Destino |
|---|---|---|
| `A` | `app` | IPv4 pública del VPS |
| `AAAA` | `app` | IPv6 pública del VPS, solo si está correctamente configurada |

Para `app.ejemplo.com`, normalmente:

```text
Tipo: A
Host/Name: app
Value/Content: 203.0.113.10
TTL: Auto o 300
```

No crear `AAAA` si el servidor o firewall no reciben tráfico IPv6. Un registro
IPv6 incorrecto puede causar fallos intermitentes aunque IPv4 funcione.

Verificar propagación:

```bash
dig +short A app.ejemplo.com
dig +short AAAA app.ejemplo.com
```

La respuesta `A` debe coincidir con la IPv4 del VPS antes de solicitar el
certificado.

---

## 12. Configurar Nginx público en el VPS

El Nginx del host recibe HTTPS y reenvía al frontend Docker escuchando solo en
`127.0.0.1:4200`.

Crear:

```bash
sudo nano /etc/nginx/sites-available/miapp
```

Contenido inicial HTTP:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.ejemplo.com;

    client_max_body_size 25m;

    location / {
        proxy_pass http://127.0.0.1:4200;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/miapp \
  /etc/nginx/sites-enabled/miapp

sudo nginx -t
sudo systemctl reload nginx
```

Probar:

```bash
curl -I http://app.ejemplo.com
```

El Nginx interno del contenedor puede encargarse de `/api/`. Otra alternativa es
que el Nginx del host separe `/` y `/api/`, pero no se deben mezclar ambos
modelos sin definir claramente cuál proxy es responsable.

---

## 13. Instalar HTTPS con Certbot

El orden correcto es:

1. El dominio ya apunta al VPS.
2. Los puertos 80 y 443 están accesibles.
3. Nginx responde en HTTP.
4. Se solicita el certificado.

Instalar Certbot mediante Snap:

```bash
sudo apt install -y snapd
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/local/bin/certbot
```

Solicitar e instalar:

```bash
sudo certbot \
  --nginx \
  -d app.ejemplo.com \
  --redirect \
  -m administracion@ejemplo.com \
  --agree-tos \
  --no-eff-email
```

Verificar:

```bash
curl -I https://app.ejemplo.com
sudo certbot certificates
sudo certbot renew --dry-run
```

Certbot instala renovación automática. No se debe copiar manualmente el
certificado dentro de la imagen del frontend.

Referencia oficial:
[Certbot con Nginx](https://certbot.eff.org/instructions?ws=nginx&os=snap).

---

## 14. Configurar firewall

Ejemplo con UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

Si SSH usa otro puerto:

```bash
sudo ufw allow 2222/tcp
```

Antes de cerrar la sesión actual, abrir otra terminal y confirmar que el nuevo
acceso SSH funciona.

Docker puede administrar reglas de red fuera de las reglas simples de UFW. Por
eso la defensa principal es no publicar puertos sensibles y enlazar el frontend
a `127.0.0.1`.

---

## 15. Crear secretos de GitHub Actions

Ruta:

```text
Repositorio
-> Settings
-> Secrets and variables
-> Actions
-> New repository secret
```

Crear:

| Secreto | Contenido |
|---|---|
| `VPS_HOST` | IP o hostname SSH, sin `https://` |
| `VPS_USER` | `deploy` |
| `VPS_PORT` | `22` o el puerto real |
| `VPS_SSH_KEY` | Contenido completo de la clave privada de la Clave A |

`VPS_SSH_KEY` debe incluir:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

No usar:

- Clave pública `.pub`.
- Contraseña del VPS.
- Deploy Key usada por el VPS para GitHub.
- Token GitHub.
- Contenido de `.env`.

Para mayor control se recomienda crear un Environment llamado `production`,
limitarlo a `develop` y guardar allí los secretos. GitHub permite además
revisores y reglas de protección según el plan de la cuenta.

Referencias:

- [GitHub Actions secrets](https://docs.github.com/en/actions/reference/security/secrets)
- [Deployments and environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments)

---

## 16. Pipeline recomendado para el nuevo proyecto

Adaptar:

- `APP_DIR`
- `COMPOSE_FILE`
- Puerto y ruta de salud
- Nombre de la rama

```yaml
name: Deploy production to VPS

on:
  push:
    branches:
      - develop
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: production-deploy
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    environment: production

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Deploy on VPS via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          command_timeout: 18m
          script: |
            set -Eeuo pipefail

            APP_DIR="/opt/miapp"
            COMPOSE_FILE="infra/docker/docker-compose.prod.yml"

            cd "$APP_DIR"

            echo "===> Descargando origin/develop"
            git fetch --prune origin develop
            git reset --hard origin/develop

            echo "===> Validando Docker Compose"
            docker compose \
              --env-file .env \
              -f "$COMPOSE_FILE" \
              config --quiet

            echo "===> Reconstruyendo servicios"
            docker compose \
              --env-file .env \
              -f "$COMPOSE_FILE" \
              up -d --build --remove-orphans

            echo "===> Esperando backend"
            HEALTH_URL="http://127.0.0.1:8080/actuator/health"
            healthy=false

            for attempt in $(seq 1 30); do
              if curl --fail --silent --show-error \
                --max-time 5 "$HEALTH_URL" >/dev/null; then
                healthy=true
                break
              fi

              echo "Backend aún no disponible ($attempt/30)"
              sleep 5
            done

            if [ "$healthy" != "true" ]; then
              echo "ERROR: el backend no superó el health check"
              docker compose \
                --env-file .env \
                -f "$COMPOSE_FILE" \
                ps
              docker compose \
                --env-file .env \
                -f "$COMPOSE_FILE" \
                logs --tail 150 backend
              exit 1
            fi

            echo "===> Estado final"
            docker compose \
              --env-file .env \
              -f "$COMPOSE_FILE" \
              ps

            echo "===> Deploy completado"
```

### Mejoras respecto al pipeline mínimo

- `workflow_dispatch`: permite ejecutar manualmente.
- `permissions: contents: read`: aplica privilegio mínimo al token del workflow.
- `concurrency`: evita despliegues simultáneos.
- `timeout-minutes`: evita runners indefinidos.
- `set -Eeuo pipefail`: detecta más errores de shell.
- `config --quiet`: valida Compose antes de modificar contenedores.
- `--remove-orphans`: retira servicios eliminados del Compose.
- Health check con espera: evita fallar únicamente porque Spring Boot tarda unos
  segundos en arrancar.
- Logs del backend cuando el health check no se recupera.

Para endurecimiento adicional, GitHub recomienda fijar las acciones de terceros
a un SHA completo validado, ya que una etiqueta puede cambiar:
[Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use).

---

## 17. Activar y probar el despliegue automático

1. Confirmar el primer despliegue manual.
2. Confirmar que el usuario `deploy` puede ejecutar Docker.
3. Confirmar que el VPS ejecuta `git fetch origin develop`.
4. Agregar el workflow.
5. Agregar los secretos.
6. Hacer un cambio controlado:

```bash
git switch develop
git add .
git commit -m "chore: configure VPS deployment pipeline"
git push origin develop
```

7. Revisar:

```text
GitHub -> Actions -> Deploy production to VPS
```

8. Verificar externamente:

```bash
curl -I https://app.ejemplo.com
curl -f https://app.ejemplo.com/api/actuator/health
```

---

## 18. Migraciones de base de datos

Si Spring Boot usa Flyway o Liquibase:

- Nunca modificar una migración que ya fue ejecutada en producción.
- Crear una nueva migración incremental.
- Hacer respaldo antes de cambios destructivos.
- No “corregir” checksums salvo que exista un procedimiento formal y se haya
  probado la equivalencia exacta.
- El contenedor del backend debe esperar a que la base de datos esté saludable.
- Si una migración falla, el pipeline debe fallar mediante el health check.

Ejemplo Flyway:

```text
V1__initial_schema.sql
V2__add_users.sql
V3__add_audit_fields.sql
```

Si `V2` ya fue aplicada, la corrección debe ser `V3`; no se edita `V2`.

---

## 19. Diagnóstico operativo

Variables reutilizables:

```bash
cd /opt/miapp
COMPOSE_FILE=infra/docker/docker-compose.prod.yml
```

Estado:

```bash
docker compose --env-file .env -f "$COMPOSE_FILE" ps
```

Logs:

```bash
docker compose --env-file .env -f "$COMPOSE_FILE" logs --tail 200
docker compose --env-file .env -f "$COMPOSE_FILE" logs -f backend
```

Validar configuración:

```bash
docker compose --env-file .env -f "$COMPOSE_FILE" config --quiet
```

Ver commit desplegado:

```bash
git rev-parse HEAD
git log -1 --oneline
```

Uso de recursos:

```bash
docker stats --no-stream
docker system df
df -h
free -h
```

Nginx:

```bash
sudo nginx -t
sudo systemctl status nginx
sudo journalctl -u nginx --since "30 minutes ago"
```

Certificado:

```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

---

## 20. Recuperación y rollback

El pipeline de referencia reconstruye desde Git. Un rollback básico consiste en
desplegar un commit conocido.

Consultar historial:

```bash
cd /opt/miapp
git log --oneline -10
```

Despliegue temporal de un commit anterior:

```bash
git fetch origin
git checkout COMMIT_SEGURO

docker compose \
  --env-file .env \
  -f infra/docker/docker-compose.prod.yml \
  up -d --build
```

Después se debe corregir o revertir el cambio en Git y volver a dejar el VPS en
`origin/develop`. No conviene mantener producción permanentemente en detached
HEAD.

Para aplicaciones críticas se recomienda:

- Imágenes versionadas en un registry.
- Backups automáticos.
- Migraciones compatibles hacia atrás.
- Ambiente de staging.
- Aprobación manual del Environment `production`.
- Estrategia blue/green o rolling deployment.

El pipeline actual no es un despliegue atómico: reconstruye en el mismo VPS.

---

## 21. Lista de comprobación final

### Proyecto

- [ ] Backend compila en Docker.
- [ ] Frontend compila en Docker.
- [ ] Compose valida sin errores.
- [ ] El frontend usa `/api` o una URL coherente.
- [ ] Existe health check.
- [ ] `.env` está ignorado.
- [ ] `.env.example` no contiene secretos.
- [ ] Los volúmenes persistentes están definidos.
- [ ] Las migraciones aplicadas no fueron editadas.

### VPS

- [ ] Docker Engine está activo.
- [ ] Docker Compose plugin funciona.
- [ ] Existe usuario `deploy`.
- [ ] `/opt/miapp` pertenece a `deploy`.
- [ ] El VPS puede leer el repositorio con Deploy Key.
- [ ] El primer despliegue manual funciona.
- [ ] Nginx responde por HTTP.
- [ ] Solo 22, 80 y 443 están expuestos, salvo necesidad documentada.

### Dominio y HTTPS

- [ ] El registro `A` apunta al VPS.
- [ ] `AAAA` es correcto o no existe.
- [ ] Nginx tiene el `server_name` correcto.
- [ ] Certbot instaló el certificado.
- [ ] `certbot renew --dry-run` funciona.

### GitHub

- [ ] Existe `VPS_HOST`.
- [ ] Existe `VPS_USER`.
- [ ] Existe `VPS_PORT`.
- [ ] `VPS_SSH_KEY` contiene la clave privada correcta.
- [ ] El workflow apunta a `develop`.
- [ ] Las rutas del workflow corresponden al proyecto.
- [ ] Se evitó guardar `.env` en Secrets si ya reside protegido en el VPS.
- [ ] El primer pipeline terminó correctamente.

---

## 22. Referencias oficiales

- [GitHub Actions: crear un workflow](https://docs.github.com/en/actions/tutorials/create-an-example-workflow)
- [GitHub Actions: eventos y filtros por rama](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub Actions: secrets](https://docs.github.com/en/actions/reference/security/secrets)
- [GitHub: Deploy Keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys)
- [GitHub: generar claves SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
- [Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker Compose plugin](https://docs.docker.com/compose/install/linux/)
- [Certbot con Nginx](https://certbot.eff.org/instructions?ws=nginx&os=snap)
- [GitHub Actions: uso seguro](https://docs.github.com/en/actions/reference/security/secure-use)

---

## 23. Decisiones que el equipo debe confirmar antes de comenzar

Completar esta ficha:

```text
Repositorio:
Rama que desplegará:
Dominio:
IPv4 del VPS:
Puerto SSH:
Usuario de despliegue:
Directorio en VPS:
Backend Maven o Gradle:
Versión Java:
Frontend Vite, CRA, Next u otro:
Base de datos:
Servicios adicionales:
Puerto local del frontend:
Puerto local del backend:
Ruta del health check:
Tamaño máximo de archivos:
¿Se requiere WebSocket?:
¿Se requiere almacenamiento persistente?:
¿Flyway/Liquibase?:
Correo responsable del certificado:
```

Con esa información se pueden ejecutar los prompts anteriores sin trasladar
suposiciones de SuilaftDD al nuevo proyecto.
