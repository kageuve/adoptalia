# Operación y recuperación

## Datos y configuración

- `DB_DATA_DIR` → `/var/lib/mysql`. Por compatibilidad, el valor predeterminado es `./db/mysql`.
- `UPLOADS_DATA_DIR` → `/app/public/uploads`, con `imagenes/` y `perfiles/`. El proceso Node usa UID/GID 1000; los scripts preparan los directorios para ese usuario si se ejecutan como root.
- Los cambios de credenciales en `.env` **no cambian automáticamente los usuarios de un MySQL ya inicializado**. Rotarlos dentro de MySQL y coordinar después la configuración.
- No usar `down -v` ni borrar directorios para "arreglar" una base. Las herramientas de restauración se niegan a sobrescribir un destino con datos.
- No hay nombres de contenedor fijos: usar `docker compose exec backend …`, no `docker exec node-backend …`.
- `ADOPTALIA_ENV_FILE=/ruta/archivo.env` permite seleccionar configuración privada para los scripts. Compose por sí solo requiere `--env-file /ruta/archivo.env`.

## Actualizar desde Git

1. Revisar cambios y hacer un backup antes de una actualización, especialmente si hay migraciones.
2. Descargar la revisión deseada con Git; los scripts **no hacen pulls ni pushes automáticos**.
3. Revisar el diff; reconstruir únicamente backend, frontend o ambos según los archivos cambiados.
4. Ejecutar `scripts/verify.sh` y comprobar los flujos en el navegador.

Para versionar las imágenes, configurar `APP_VERSION` con una versión o identificador de commit antes del build. Conservar las imágenes anteriores para rollback. `local` es una comodidad inicial, no una estrategia de publicación. Si se usa un registro privado, ajustar `APP_IMAGE_PREFIX`.

No hay garantía de cero interrupción: recrear un único backend causa una pausa breve. El rollback de imagen no revierte migraciones de base de datos. Recuperar ambas cosas requiere el backup compatible.

## Restaurar en otro equipo

Usar un **destino nuevo y aislado**, con puertos libres y arquitectura compatible con las imágenes guardadas.

```bash
mkdir -m 700 adoptalia-recovery
cd adoptalia-recovery
# Verificar primero el backup transferido.
(cd /ruta/backup && sha256sum -c SHA256SUMS)
# Extraer el proyecto de esa misma copia, no código de otra versión.
tar -xzf /ruta/backup/project.tar.gz --strip-components=1
chmod 600 .env
# EDITAR .env: nombre de proyecto, puertos y rutas de datos DEL NUEVO EQUIPO.
# Conservar credenciales coherentes; no reutilizar rutas del servidor anterior.
./scripts/restore.sh /ruta/backup --confirm-empty-target
```

El script verifica integridad, carga imágenes exactas, valida sus identidades, prepara directorios vacíos, restaura SQL/subidas y comprueba el servicio. No borra una base existente. Si falla la importación o el arranque, detiene el destino; no destruye los datos para reintentar silenciosamente. Para un segundo intento usar nuevas rutas vacías y otro proyecto, o investigar y limpiar explícitamente **solo el destino de prueba**.

Se genera `.restore-images.json` (privado/ignorado por Git), que selecciona las imágenes recuperadas. **Todos los scripts de operación lo utilizan automáticamente.** Para comandos Compose manuales añadir `-f compose.yaml -f .restore-images.json`.

Cuando se quiera actualizar desde código después de una recuperación:

```bash
# Antes: backup. Confirmar que el código descargado es compatible con la base.
./scripts/deploy.sh --from-source --build backend frontend
```

Esto abandona la selección de imágenes recuperadas, construye el código actual y aplica migraciones. No debe hacerse como un paso obligatorio de restauración: una recuperación usa las imágenes guardadas sin compilar.

## Migraciones

`db/init/init.sql` solo se ejecuta al inicializar MySQL con un directorio vacío. El esquema se mantiene mediante `db/migrations/*.sql`, aplicadas en orden por `scripts/migrate.sh`/`deploy.sh` y registradas en `schema_migrations` con SHA-256.

- No editar ni renombrar migraciones aplicadas; crear otra.
- MySQL confirma DDL automáticamente: las migraciones deben poder reanudarse y no se promete rollback transaccional de cambios de esquema.
- Hacer backup antes de migrar. La primera migración añade índices con comprobación de existencia y no elimina filas.
- El bloqueo `.ops.lock` evita operaciones concurrentes desde el mismo checkout; no sustituye la coordinación entre varios servidores/checkouts.

## Diagnóstico

```bash
docker compose ps
docker compose logs --tail 100 backend db frontend
./scripts/verify.sh
```

MySQL puede tardar varios minutos en la primera inicialización, especialmente en almacenamiento lento. El timeout de despliegue es de 10 minutos. No interrumpirlo borrando el directorio de datos.

Los logs usan el driver `local`, con rotación de 3 archivos de 10 MB por servicio. Los backups no están cifrados por el script: elegir y gestionar una solución de cifrado y almacenamiento externa. Las sumas detectan corrupción, **no autentican** una copia manipulada; solo restaurar copias de confianza.
