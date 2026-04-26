# 🚀 Adoptalia - Guía de despliegue y desarrollo

## 📦 Requisitos previos

Antes de empezar, necesitas tener instalado:

-   Docker\
-   Docker Compose (v2 recomendado)

### Comprobar instalación

``` bash
docker -v
docker compose version
```

------------------------------------------------------------------------

## 📥 1. Clonar el repositorio

``` bash
git clone https://github.com/TU_USUARIO/adoptalia.git
cd adoptalia
```

------------------------------------------------------------------------

## ⚙️ 2. Configurar variables de entorno

El archivo `.env` **NO está incluido por seguridad**, debes crearlo
manualmente en la raíz del proyecto:

``` bash
nano .env
```

### Contenido mínimo:

``` env
# MySQL
MYSQL_ROOT_PASSWORD=tu_password_root
MYSQL_DATABASE=adoptalia_db
MYSQL_USER=adoptalia_user
MYSQL_PASSWORD=tu_password_user

# Backend
PORT=3000
JWT_SECRET=clave_super_secreta
# Para funcionar en local:
BASE_URL=http://localhost:3000
```

------------------------------------------------------------------------

## 🐳 3. Construir y levantar los contenedores

``` bash
docker compose up -d --build
```

👉 La primera vez puede tardar varios minutos: - descarga imágenes base\
- instala dependencias\
- compila Angular

------------------------------------------------------------------------

## 🔍 4. Verificar estado

``` bash
docker ps
```

Deberías ver al menos:

-   frontend (nginx)\
-   backend (node)\
-   mysql

------------------------------------------------------------------------

## 🌐 5. Acceso a la aplicación

-   **Frontend:**\
    http://localhost

-   **API backend:**\
    http://localhost/api/usuarios

------------------------------------------------------------------------

## 🧪 6. Base de datos

La base de datos se inicializa automáticamente con datos de prueba
desde:

    db/init/init.sql

------------------------------------------------------------------------

# 🛠️ Desarrollo (modificar la aplicación)

Cada vez que hagas cambios:

``` bash
docker compose build
docker compose up -d
```

------------------------------------------------------------------------

# 🧰 Comandos útiles

## Ver logs

``` bash
docker compose logs -f
```

------------------------------------------------------------------------

## Entrar a un contenedor

``` bash
docker exec -it angular-frontend sh
docker exec -it node-backend sh
```

------------------------------------------------------------------------

## Parar servicios

``` bash
docker compose down
```

------------------------------------------------------------------------

## Reinicio limpio

``` bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

------------------------------------------------------------------------

# 🔐 Seguridad

-   Nunca subir `.env` al repositorio\
-   Usar `.env.example` como plantilla\
-   Cambiar contraseñas en producción

------------------------------------------------------------------------

# 📁 Estructura del proyecto

    adoptalia/
    ├── backend/
    ├── frontend/
    ├── db/
    ├── docker-compose.yml
    └── .env

------------------------------------------------------------------------

# 🚀 Notas finales

-   El frontend se sirve con Nginx\
-   El backend corre en Node.js\
-   Angular se compila en build (no en runtime)\
-   Todo se conecta mediante red interna de Docker
