# Pulso Logístico

Aplicación desarrollada con Next.js, framework de React.js.

Pulso Logístico es una iniciativa de la fundación Conecta Logística que busca comercializar distintos servicios/productos.

## Tecnologías Utilizadas

- Framework: Next.js
- Lenguaje: TypeScript
- DB: PostgreSQL
- ORM: Prisma
- Autenticación: Auth.js (NextAuth v5)
- Contenedores: Docker y Docker Compose

## Requisitos del Sistema

Para poder ejecutar esta aplicación localmente se debe estar en un entorno UNIX, como Linux o Windows con WSL2. También se requiere tener instaladas las últimas versiones de [Docker engine](https://docs.docker.com/engine/install/) y [Docker Compose](https://docs.docker.com/desktop/setup/install/linux/) y version 18.17.0 o superior de [Node.js](https://nodejs.org/en). Por último, se debe tener una cuenta de **Google Workspace** o **Gmail** para envío de notifiaciones.

## Configuración de Gmail (OAuth2.0)

Para que el sistema pueda enviar correos, debes configurar el acceso programático en [Google Cloud Console](https://console.cloud.google.com/).

1. **Habilitar API**:

- Crea un nuevo proyecto
- Ir al menú lateral **APIs & Services > Library** y buscar **Gmail API**, luego hacer clic en **enable**.

2. **Configurar pantalla de consentimiento (OAuth Consent Screen)**:

- Ir al menú lateral **APIs & Services > OAuth Consent Screen**.
![Mensaje para comenzar Set Up](public/readme1.png)
- Aparecerá este mensaje y cliquear en **Comenzar**
- Completar información de la App y **siguiente**.
- User Type: Seleccionar **External** o **Internal** en caso de usar Google Workspace coorporativo.
- Completar información de contacto y finalizar.
<!-- - En **Scopes**, añadir: `https://www.googleapis.com/auth/gmail.send` -->
- Ir a **Publico** en el panel lateral y en **Test Users** ingresar el correo electrónico que se usará para desarrollar la app.

3. **Crear Credenciales**:

- Ir a **APIs & Services > Credentials > Create Credentials > OAuth Client ID**
- **Application Type**: Web Application
- **Authorized JavaScript Origins**: `http://localhost:3000`
- **Authorized redirect URIs**: `https://developers.google.com/oauthplayground` (Necesario para obtener Token inicial)
-  **Obtener Credenciales**: Una vez creado, copiar **Client ID** y **Client Secret** y guardarlos para los pasos posteriores.

4. Obtener el  Refresh Token
- Ir a [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- Hacer clic en el ícono de configuración y marcar "**User your own OAuth credentials**" e ingresar Client ID y Secret
- En la sección **Select & Authorize APIs** insertar la URL https://www.googleapis.com/auth/gmail.send en el campo "**Insert your own scopes**"
- Loguearse con Google y otorgar permisos a la API
- En la sección "**Exchange authorization code for tokens**" hacer clic en el botón con el mismo nombre copiar y guardar valor de **Refresh Token** y **Access Token**

## Ejecución/Compilación

La app consta de dos contenedores construidos en Docker, se orquesta su conexión a través del archivo docker-compose.yml.

Primero se debe clonar el repositorio: `git clone <URL-repositorio>`

Luego  se deben configurar las variables del entorno en el archivo .env, si no existe, crealo.

```bash
# Configuración de Gmail API para envíos
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_REFRESH_TOKEN=tu_refresh_token
GOOGLE_ACCESS_TOKEN=tu_access_token
EMAIL_USER=tu-correo@gmail.com # Correo del proyecto en Google Cloud

# Seguridad de la aplicación
AUTH_SECRET=secreto_seguro # Se puede generar con: openssl rand -base64 32
AUTH_URL=http://localhost:3000

# Base de Datos (Docker)
DATABASE_URL="postgresql://ihan_clogis:contraseñaultrasegura@localhost:5432/pulso_logis_db"

```

Para levantar los contenedores se debe ejecutar en la terminal los siguientes comandos (dentro del directorio del repositorio).

  

```bash

npm install # instalar dependencias

docker compose up -d --build # inicializa los contenedores de la app y la base de datos -d es dettached y --build es para que se reconstruyan las imágenes a partir de Dockerfile y docker-compose.yml

npx prisma db push # sincroniza el archivo prisma/schema.prisma con postgres

npx prisma generate # genera cliente de prisma

npx prisma db seed # pobla la base de datos con información de prueba

```

Una vez realizado esto se puede ingresar a la app en el enlace <http://localhost:3000>

  

## Estructura del Proyecto
- `/app`: Rutas, componentes y acciones de Next.js
- `/prisma`:  Esquema de la base de datos con prisma y script para poblar base de datos
- `/public`: Archivos estáticos y ruta donde se suben los archivos
- `/lib`: utilidades compartidas entre cliente y prisma

## Comandos Útiles

-  Seguir logs de la aplicación: `sudo docker compose logs -f`
- Aplicar cambios del esquema y migrar datos en la base: `npx prisma migrate dev --name <nombre-cambio>` y `npx prisma generate` (Reiniciar servicios de Docker luego de esto).
- Abrir terminal de la base de datos: `sudo docker compose exec db psql -U ihan_clogis -d pulso_logis_db`
- En caso de querer instalar nuevas librerias con npm ejecutar:
  ```bash
  npm install <dependencia>
  sudo docker compose exec web npm install <dependencia>
  ```
- Para detener y reanudar servicios Docker:
    ```bash
    sudo docker compose stop
    sudo docker compose start
    ```
    
## Próximos Pasos

La aplicación aún se encuentra en desarrollo, algunas cosas que falta por hacer son:
- Crear página para poder solicitar una mejora de membresía, además de su respectiva función que maneje la lógica de la base de datos con prisma registrando una compra pendiente y que mandé un correo tanto al usuario como al adminsitrador.
- Modificar la vista previa de los productos con un nuevo campo en la tabla productos "vistaPrevia", además modificar las vistas de creación y edición de producto para que se pueda subir una imagen como archivo al directorio public.