# Adoptalia

Aplicación de adopción: Angular + Nginx, API Node/Express y MySQL, desplegados con Docker Compose. phpMyAdmin permanece disponible para administración privada, **con formulario de login**.

## Requisitos

- Linux, Docker Engine con BuildKit y Compose **2.24.4 o posterior**.
- Bash, Python 3.10+, gzip y tar. El usuario necesita acceso a Docker.
- Para los scripts de datos se recomienda ejecutarlos como root en el servidor. La API y Nginx **no** se ejecutan como root dentro del contenedor.
- Espacio para base, imágenes, caché de construcción y copias; no llenar el disco con backups.

## Instalación nueva

```bash
git clone git@github.com:kageuve/adoptalia.git
cd adoptalia
cp .env.example .env
chmod 600 .env
# Editar .env: sustituir TODOS los CHANGE_ME.
# Generar cada secreto independientemente: openssl rand -hex 32
./scripts/deploy.sh --build backend frontend
```

La base se inicializa con **esquema vacío, sin cuentas ni datos de demostración**, usando el nombre y usuario definidos en `.env`. El despliegue aplica las migraciones pendientes y espera a que los servicios estén preparados. Si MySQL ya tiene datos, la inicialización no se vuelve a ejecutar.

- Web: puerto `WEB_PORT` (80 por defecto).
- phpMyAdmin: `PMA_BIND_ADDRESS:PMA_PORT`, localhost:8080 por defecto. Seleccionar una dirección privada para acceso LAN y protegerla mediante firewall/VPN. Iniciar sesión con las credenciales de la base; no se inyecta un usuario/contraseña de autologin.
- MySQL y API: **sin puertos publicados**, accesibles por redes Docker.
- HTTPS: terminarlo en el proxy frontal/Cloudflare. No publicar phpMyAdmin mediante ese proxy. Cloudflare no sustituye la protección del acceso directo al origen.

## No reconstruir todo por cada cambio

**Desarrollo:** recarga automática de Node y Angular. No utiliza los datos de producción.

```bash
./scripts/dev.sh build       # primera vez o cambio de Dockerfile
./scripts/dev.sh up
# Editar código: Node se reinicia y Angular recompila/recarga automáticamente.
# Web: http://127.0.0.1:4200; phpMyAdmin: http://127.0.0.1:8081
./scripts/dev.sh deps        # si cambian package.json / package-lock.json
./scripts/dev.sh logs
./scripts/dev.sh down
```

**Producción:** las imágenes son inmutables durante la ejecución. Solo se reconstruye el servicio modificado:

```bash
./scripts/deploy.sh --build backend    # cambios de API
./scripts/deploy.sh --build frontend   # cambios de interfaz o Nginx
./scripts/deploy.sh                    # aplicar configuración, sin compilar
```

El primer comando no compila Angular ni recrea el frontend si su configuración/imagen no cambió. Nginx vuelve a resolver el nombre del backend si cambia su IP. `npm ci` queda en una capa separada: cambios de código reutilizan la capa de dependencias. Los `.dockerignore` impiden copiar dependencias/cachés locales sobre las del contenedor.

No montar el código de desarrollo sobre producción para evitar compilaciones: sacrificaría reproducibilidad, rollback y seguridad. Angular necesita compilar los cambios para publicar su versión de producción.

## Copias y restauración

```bash
./scripts/backup.sh /ruta/privada/backups
./scripts/verify.sh
```

El backup **detiene brevemente web, API y phpMyAdmin**, manteniendo MySQL en marcha, y después los arranca. Captura datos y subidas sin escritores de la aplicación. La compresión de imágenes se hace después de reanudar el servicio. No ejecutar modificaciones por otros accesos a MySQL durante la captura.

Incluye SQL consistente, uploads, proyecto, `.env`, imágenes exactas, metadatos y SHA-256. El directorio solo se publica con su nombre definitivo al terminar; `.partial` significa copia incompleta. `--no-images` produce una copia más pequeña, pero no sirve para restauración offline con este script.

**Contiene secretos y datos personales. Cifrar, sacar del servidor y comprobar periódicamente una restauración.** No hay una política de borrado automático que pueda eliminar la última copia válida.

Ver [restauración y operación](docs/operations.md), [desarrollo](docs/development.md) y [seguridad](docs/security.md).

## Pruebas

```bash
# Con el despliegue activo:
docker compose exec backend npm test
./scripts/verify.sh

# SOLO contra un despliegue aislado: crea usuarios/animales de prueba.
python3 scripts/smoke-test.py --url http://127.0.0.1:18080 --allow-test-data
```

La integración comprueba registro/login, permisos entre usuarios/protectoras, peticiones, favoritos y rechazo/subida de imágenes. No sustituye la comprobación de la interfaz en un navegador.

## Estructura

```text
compose.yaml              Producción
compose.dev.yaml          Desarrollo independiente, nunca combinar con producción
.env.example              Variables ficticias; .env permanece privado
backend/                  API, Dockerfile y tests
frontend/                 Angular, Dockerfile, Nginx y proxy de desarrollo
db/init/init.sql          Esquema inicial, no destructivo para instalaciones existentes
db/migrations/            Migraciones versionadas con checksum
scripts/                  Deploy, backup, restore, migrate, verify y dev
docs/                     Operación, desarrollo y límites de seguridad
```
