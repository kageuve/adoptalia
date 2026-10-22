const db = require('../db');
const animalModel = require('../models/animalModel');
const protectoraModel = require('../models/protectoraModel');
async function animalPropio(req, res, next) {
  try {
    const [animal, protectora] = await Promise.all([animalModel.obtenerPorId(req.params.id), protectoraModel.obtenerPorUsuarioId(req.user.id)]);
    if (!animal || !protectora || animal.protectora_id !== protectora.id) return res.status(403).json({ message: 'No puedes modificar este animal' });
    next();
  } catch (err) { next(err); }
}
async function peticionPropia(req, res, next) {
  try {
    const [rows] = await db.execute('SELECT usuario_id FROM peticion WHERE id = ?', [req.params.id]);
    if (!rows[0] || rows[0].usuario_id !== req.user.id) return res.status(403).json({ message: 'No puedes cancelar esta petición' });
    next();
  } catch (err) { next(err); }
}
async function peticionDeProtectora(req, res, next) {
  try {
    const [rows] = await db.execute(`SELECT p.id FROM peticion p JOIN animal a ON a.id = p.animal_id JOIN protectora pr ON pr.id = a.protectora_id WHERE p.id = ? AND pr.usuario_id = ?`, [req.params.id, req.user.id]);
    if (!rows.length) return res.status(403).json({ message: 'No puedes modificar esta petición' });
    next();
  } catch (err) { next(err); }
}
module.exports = { animalPropio, peticionPropia, peticionDeProtectora };
