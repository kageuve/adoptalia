const favoritoModel = require('../models/favoritoModel');

async function listarFavoritos(req, res) {
  try {
    const favoritos = await favoritoModel.obtenerPorUsuario(req.user.id);
    res.status(200).json({ success: true, data: favoritos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error listando favoritos' });
  }
}

async function agregarFavorito(req, res) {
  try {
    await favoritoModel.agregar(req.user.id, req.body.animal_id);
    res.status(201).json({ success: true, message: 'Favorito añadido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error añadiendo favorito' });
  }
}

async function eliminarFavorito(req, res) {
  try {
    await favoritoModel.eliminar(req.user.id, req.params.animal_id);
    res.status(200).json({ success: true, message: 'Favorito eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error eliminando favorito' });
  }
}

async function comprobarFavorito(req, res) {
  try {
    const esFavorito = await favoritoModel.comprobar(req.user.id, req.params.animal_id);
    res.status(200).json({ success: true, esFavorito });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error comprobando favorito' });
  }
}

module.exports = { listarFavoritos, agregarFavorito, eliminarFavorito, comprobarFavorito };