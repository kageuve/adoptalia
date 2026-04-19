const protectoraModel = require('../models/protectoraModel');

async function registrarProtectora(req, res) {
  try {
    await protectoraModel.crearProtectora(req.body);
    res.status(201).json({ message: 'Protectora registrada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.code === 'ER_DUP_ENTRY' ? 'El email o CIF ya están registrados' : 'Error al registrar protectora' });
  }
}

// listar todas las protectoras
async function listarProtectoras(req, res) {
  try {
    const protectoras = await protectoraModel.obtenerTodas();
    res.status(200).json({ success: true, data: protectoras });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error listando protectoras" });
  }
}

async function obtenerMiProtectora(req, res) {
  try {
    const protectora = await protectoraModel.obtenerPorUsuarioId(req.user.id);
    if (!protectora) {
      return res.status(404).json({ success: false, message: 'Protectora no encontrada' });
    }
    res.status(200).json({ success: true, data: protectora });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error obteniendo protectora' });
  }
}

async function subirImagenProtectora(req, res) {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No se recibió imagen' });
    const db = require('../db');
    const imagen = `/uploads/perfiles/${req.file.filename}`;
    const connection = await db.getConnection();
    try {
      await connection.execute(
        'UPDATE protectora SET imagen = ? WHERE usuario_id = ?',
        [imagen, req.user.id]
      );
    } finally {
      connection.release();
    }
    res.json({ success: true, imagen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  registrarProtectora,
  listarProtectoras,
  obtenerMiProtectora,
  subirImagenProtectora
};