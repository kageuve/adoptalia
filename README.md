# 🐾 Adoptalia - Plataforma de Gestión

Adoptalia es una aplicación web completa (Full-Stack) diseñada como proyecto para el ciclo de Desarrollo de Aplicaciones Web (DAW). Su objetivo es gestionar usuarios y protectoras, para que se pongan en contacto y puedan gestionar adopciones mediante una arquitectura de microservicios.

## 🏗️ Arquitectura y Tecnologías

El proyecto está completamente dockerizado e incluye los siguientes servicios:

* **Frontend:** Angular 16 (Servido a través de Nginx actuando como Reverse Proxy).
* **Backend:** Node.js con Express (API RESTful).
* **Base de Datos:** MySQL 8.0.
* **Orquestación:** Docker Compose.

Todo el tráfico externo entra por el puerto `80` a Nginx, que se encarga de servir la web de Angular o redirigir las peticiones `/api/*` al backend de Node de forma transparente (evitando problemas de CORS).

---

## ⚙️ Requisitos Previos

Para levantar este proyecto en tu máquina local, necesitas tener instalado:
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* Git

---

## 🚀 Instalación y Despliegue Local

Sigue estos pasos para arrancar el proyecto desde cero:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/kageuve/adoptalia.git](https://github.com/kageuve/adoptalia.git)
cd adoptalia
```
### 2. Configurar las Variables de Entorno
El archivo que contiene las contraseñas (.env) no se sube al repositorio por seguridad. Debes crear uno en la raíz del proyecto:

Crea un archivo llamado .env y añade esta configuración básica:

---
Fragmento de código
# Configuración de MySQL
MYSQL_ROOT_PASSWORD=TuPasswordRoot123
MYSQL_DATABASE=adoptalia_db
MYSQL_USER=adoptalia_user
MYSQL_PASSWORD=TuPasswordUser123

# Configuración del Backend
PORT=3000
---

### 3. Levantar los contenedores
Ejecuta el siguiente comando para construir las imágenes y levantar toda la infraestructura en segundo plano:

```bash
docker compose up -d --build
(Nota: La primera vez tardará un par de minutos mientras descarga las imágenes base y compila el proyecto de Angular).
```
🧪 Comprobar el funcionamiento
Una vez que los contenedores estén corriendo (docker ps), abre tu navegador web:

Frontend (Angular): http://localhost

Backend API (Datos de prueba): http://localhost/api/usuarios

La base de datos se inicializa automáticamente con datos de prueba gracias al script ubicado en db/init/init.sql.
