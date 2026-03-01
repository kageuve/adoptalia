const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
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