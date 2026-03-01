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

module.exports = {
  registrarProtectora
};