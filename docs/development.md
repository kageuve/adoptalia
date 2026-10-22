# Desarrollo sin reconstrucciones continuas

`compose.dev.yaml` es un despliegue independiente con nombre `adoptalia-dev`, datos en `data/development/` y puertos de web/administración ligados a localhost. `scripts/dev.sh` fija ese nombre para no operar accidentalmente sobre producción.

Se puede usar `ADOPTALIA_ENV_FILE=/ruta/dev.env` para credenciales de desarrollo distintas. Si no se indica, usa `.env`, pero nunca los directorios de datos de producción. Se recomienda desarrollar en otro checkout/equipo. No iniciar simultáneamente desarrollo y producción en máquinas con poca RAM sin comprobar recursos.

```bash
./scripts/dev.sh build    # build secuencial, una vez
./scripts/dev.sh up
```

- Backend: código montado desde el anfitrión y `node --watch`; reinicio al cambiar código importado.
- Frontend: `ng serve`, compilación incremental y recarga del navegador.
- Las dependencias se guardan en volúmenes separados; no se copian node_modules del anfitrión.
- Angular envía `/api` y `/uploads` al backend mediante `proxy.conf.json`, sin URLs absolutas de localhost en la aplicación.
- `DEV_PORT` y `DEV_PMA_PORT` permiten cambiar puertos; se mantienen en localhost.

## Cuándo hay que hacer algo más

| Cambio | Desarrollo | Producción |
|---|---|---|
| Código Node | Reinicio automático | `deploy.sh --build backend` |
| Componentes/estilos Angular | Recarga automática | `deploy.sh --build frontend` |
| Dependencias npm | `dev.sh deps` | Rebuild del servicio afectado |
| Dockerfile / base de imagen | `dev.sh build` y `dev.sh up` | Rebuild del servicio afectado |
| Variables de entorno | `dev.sh up` recrea al cambiar configuración | `deploy.sh` |
| Nginx | No interviene en ng serve | `deploy.sh --build frontend` |
| Esquema SQL | Migración explícita en la base de desarrollo | Backup y despliegue/migración |

Las herramientas de desarrollo no están endurecidas como las imágenes de producción. No publicar `ng serve`, sus WebSockets ni el inspector de Node en Internet. Para entrar desde otro equipo usar un túnel SSH a 4200.

## Dependencias

Actualizar lockfiles con la versión Node 22 declarada por los Dockerfiles, revisar el diff y ejecutar pruebas/build. Las imágenes base se fijan por digest; renovarlas deliberadamente, no dejarlas congeladas para siempre.

El proyecto conserva los tests frontend heredados de Karma, varios de ellos generados por la plantilla original. La CI valida su build de producción, no afirma que esa suite antigua tenga cobertura funcional. Ver la advertencia de dependencias de desarrollo en `security.md`.
