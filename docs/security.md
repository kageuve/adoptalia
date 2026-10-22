# Seguridad y límites

## Medidas implementadas

- API y MySQL sin puertos publicados; solo Nginx y phpMyAdmin publican puertos configurables.
- phpMyAdmin sin credenciales de autologin ni host arbitrario; localhost por defecto, o IP privada explícita. Protegerlo también con firewall/VPN; no basta con asumir que Cloudflare lo oculta.
- Node y Nginx sin root, sin capacidades adicionales, raíz de filesystem de solo lectura, almacenamiento temporal acotado y `no-new-privileges`.
- Secretos obligatorios, sin contraseñas de respaldo en código. JWT de al menos 32 caracteres y verificación restringida a HS256. `.env.example` solo contiene valores ficticios. No se incluyen `.env` ni backups en Git o en contextos Docker.
- Límites de tamaño de cuerpo, CSV e imágenes; nombres UUID; validación de firma JPEG/PNG/WebP y rechazo de SVG/HTML. No es un antivirus ni un decodificador completo de imágenes.
- Comprobación de propiedad antes de modificar/borrar animales o sus imágenes y de aprobar/rechazar/cancelar peticiones. El registro general solo crea usuarios, no administradores/protectoras arbitrarios.
- Contraseñas nuevas de 10 caracteres como mínimo y un máximo de 72 bytes por bcrypt. El login de cuentas existentes conserva compatibilidad con contraseñas anteriores.
- Aprobación de petición y marcado del animal como adoptado en una transacción.
- CORS desactivado salvo allowlist explícita, cabeceras de seguridad, respuestas de error sin detalles SQL, rate limiting de API/autenticación.
- Comprobación de disponibilidad conectada a MySQL, apagado ordenado y logs rotados.

## Proxy y HTTPS

Nginx reemplaza `X-Forwarded-For` con la IP de su conexión: no confía en cabeceras arbitrarias enviadas por clientes. El backend solo confía en los saltos definidos en `TRUST_PROXY`. **Si existe otro proxy/Cloudflare delante, el límite por IP puede agrupar usuarios** hasta configurar la IP real de forma segura en ese frontal. No solucionar esto aceptando indiscriminadamente cabeceras `X-Forwarded-For` o `CF-Connecting-IP`: solo confiar en rangos/proxies verificados.

Mantener TLS y restricciones del origen en el proxy exterior. La CSP es deliberadamente parcial (`frame-ancestors`, `object-src`, `base-uri`) para no romper Angular ni recursos existentes; no se afirma que mitigue todo XSS. HSTS debe decidirse donde termina HTTPS, no en el salto HTTP interno.

## Hallazgos pendientes y mantenimiento

En la revisión de dependencias tras actualizar los lockfiles:

- Backend: `npm audit` no encontró vulnerabilidades conocidas en ese momento.
- Frontend: el árbol de herramientas de **desarrollo/pruebas de Karma** conserva avisos altos derivados de `braces`/Chokidar. El audit no ofrece una corrección compatible; propone downgrades de Angular/Karma que no se han aplicado. No se usan en la imagen Nginx de producción. No ejecutar esas herramientas sobre código/patrones de terceros no confiables. Renovar o migrar la suite de tests cuando haya una solución compatible.
- Esto no es un análisis de vulnerabilidades del sistema operativo ni una auditoría exhaustiva de toda la lógica de negocio. Renovar bases por digest, revisar avisos de MySQL/phpMyAdmin/Node/Nginx y ejecutar un escáner de imágenes periódicamente.

No se reescribe el historial Git automáticamente. Si alguna credencial se publicó en commits antiguos, eliminarla del código actual **no la revoca**: rotarla y decidir por separado si procede limpiar el historial. No reutilizar las credenciales privadas de esta instalación en una réplica.

## Backups

Incluyen `.env`, datos personales e imágenes; permisos 700/600, pero no cifrado automático. Mantener copias cifradas externas y probar su recuperación. La rotación de `JWT_SECRET` invalida las sesiones abiertas; la rotación de MySQL exige cambiar los usuarios en la base, no solo editar `.env`.
