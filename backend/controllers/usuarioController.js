const userModel = require('../models/userModel');
const animalModel = require('../models/animalModel');
const protectoraModel = require('../models/protectoraModel');
const path = require('path');

async function getPerfil(req, res) {
  try {
    const usuario = await userModel.obtenerPorId(req.user.id);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: usuario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function subirImagenPerfil(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se recibió imagen' });
    const imagen = `/uploads/perfiles/${req.file.filename}`;
    await userModel.actualizarImagen(req.user.id, imagen);
    res.json({ success: true, imagen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getImpacto(req, res) {
  try {
    const [animalMetrics, shelters, users] = await Promise.all([
      animalModel.obtenerMetricas(),
      protectoraModel.contarActivas(),
      userModel.contarAdoptantes()
    ]);

    res.json({
      success: true,
      data: {
        adoptions: Number(animalMetrics?.adoptions || 0),
        shelters: Number(shelters || 0),
        animals: Number(animalMetrics?.animals || 0),
        users: Number(users || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function actualizarPerfil(req, res) {
  try {
    await userModel.actualizarPerfil(req.user.id, req.body);
    res.json({ success: true, message: 'Perfil actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getPerfil, subirImagenPerfil, getImpacto, actualizarPerfil };