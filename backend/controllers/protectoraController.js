const protectoraModel = require('../models/protectoraModel');

async function registrarProtectora(req, res) {

  try {

    await protectoraModel.crearProtectora(req.body);

    res.send("Protectora registrada correctamente 🚀");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar protectora");
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

module.exports = {
  registrarProtectora,
  listarProtectoras,
  obtenerMiProtectora
};