const jwt = require('jsonwebtoken');

const { jwtSecret: SECRET } = require('../config');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  if (!/^Bearer [^ ]+$/.test(authHeader)) return res.status(401).json({ message: 'Token inválido' });
  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
    if (!Number.isSafeInteger(decoded.id) || decoded.id <= 0 || !['usuario', 'protectora', 'administrador'].includes(decoded.rol)) return res.status(401).json({ message: 'Token inválido' });
    req.user = decoded; // id y rol
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function soloProtectora(req, res, next) {
  if (req.user.rol !== 'protectora') {
    return res.status(403).json({ message: 'Acceso solo para protectoras' });
  }
  next();
}

module.exports = {
  verificarToken,
  soloProtectora
};