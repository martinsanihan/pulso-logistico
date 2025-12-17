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

Para poder ejecutar esta aplicación localmente se debe estar en un entorno UNIX, como Linux o Windows con WSL2. También se requiere tener instaladas las últimas versiones de [Docker engine](https://docs.docker.com/engine/install/) y [Docker Compose](https://docs.docker.com/desktop/setup/install/linux/), Version 18.17.0 o superior de [Node.js](https://nodejs.org/en),

## Ejecución/Compilación

La app consta de dos contenedores construidos en Docker, se orquesta su conexión a través del archivo docker-compose.yml.

Primero se deben configurar las variables del entorno en el archivo .env, si no existe, crealo.

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/pulso_db"
AUTH_SECRET="tu_clave_secreta" # Generar con: openssl rand -base64 32
AUTH_URL="http://localhost:3000"
```

Para levantar los
contenedores se debe ejecutar en la terminal los siguientes comandos (dentro del directorio del repositorio).

```bash
npm install # instalar dependencias
docker compose up -d # inicializa los contenedores de la app y la base de datos
npx prisma db push # sincroniza esquema de prisma con postgres
npx prisma generate # genera cliente de prisma
npx prisma db seed # crea un usuario administrador
```

Una vez realizado esto se puede ingresar a la app en el enlace <http://localhost:3000>

## Endpoints

- /
- /login
- /login/signup
- /perfil
- /perfil/edit
