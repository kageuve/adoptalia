const { uploadsDir } = require('./config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db');
const app = express();
app.disable('x-powered-by');
app.set('query parser', 'simple');
app.set('trust proxy', process.env.TRUST_PROXY || 'loopback');
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'same-origin' } }));
const origins = (process.env.CORS_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
// Same-origin requests need no CORS headers. Only enable cross-origin for an explicit allowlist.
if (origins.length) app.use(cors({ origin: origins }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
for (const subdir of ['imagenes', 'perfiles']) fs.mkdirSync(path.join(uploadsDir, subdir), { recursive: true });
app.use('/uploads', express.static(uploadsDir, { dotfiles: 'deny', index: false, maxAge: '1h' }));

app.get('/api/health/live', (req, res) => res.json({ status: 'ok' }));
app.get('/api/health/ready', async (req, res) => {
  try {
    await db.query({ sql: 'SELECT id FROM usuario LIMIT 0', timeout: 3000 });
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});
app.get('/api/test', (req, res) => res.json({ mensaje: 'Backend funcionando' }));
app.use('/api', rateLimit({ windowMs: 60000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false, skip: req => req.path.startsWith('/health/'), message: { message: 'Demasiadas peticiones' } }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { message: 'Demasiados intentos. Inténtalo más tarde.' } });
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/protectoras/registrar-protectora', authLimiter);
for (const [prefix, route] of Object.entries({ animales: 'animal', import: 'import', protectoras: 'protectora', peticiones: 'peticion', favoritos: 'favorito', usuarios: 'usuario' })) {
  app.use(`/api/${prefix}`, require(`./routes/${route}Routes`));
}
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.code === 'LIMIT_FILE_SIZE' || err.type === 'entity.too.large') return res.status(413).json({ message: 'Archivo o petición demasiado grande' });
  if (err.name === 'MulterError' || err.status === 400 || err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Petición o archivo no válido' });
  console.error('Request error:', err.code || err.name);
  res.status(500).json({ message: 'Error interno del servidor' });
});
const server = app.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Backend listo'));
server.requestTimeout = 30000;
server.headersTimeout = 15000;
let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  const timeout = setTimeout(() => process.exit(1), 10000).unref();
  server.close(async () => { await db.end(); clearTimeout(timeout); process.exit(0); });
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
