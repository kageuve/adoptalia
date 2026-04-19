const peticionModel = require('../models/peticionModel');
const protectoraModel = require('../models/protectoraModel');
const animalModel = require('../models/animalModel');

async function crearPeticion(req, res) {
  try {
    const usuario_id = req.user.id;
    const { animal_id, mensaje } = req.body;

    if (!animal_id) {
      return res.status(400).json({ success: false, message: 'Falta animal_id' });
    }

    const id = await peticionModel.crear({ usuario_id, animal_id, mensaje });

    res.status(201).json({ success: true, message: 'Peticion creada', id });

  } catch (error) {
    console.error('Error creando peticion:', error.message, error.code);
    res.status(500).json({ success: false, message: 'Error creando peticion' });
  }
}

async function comprobarPeticion(req, res) {
  try {
    const usuario_id = req.user.id;
    const { animal_id } = req.params;
    const peticion = await peticionModel.obtenerPorUsuarioYAnimal(usuario_id, animal_id);
    res.status(200).json({ success: true, existe: !!peticion, peticion: peticion || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error comprobando peticion' });
  }
}

async function listarPeticionesUsuario(req, res) {
  try {
    const usuario_id = req.user.id;
    const peticiones = await peticionModel.obtenerPorUsuario(usuario_id);
    res.status(200).json({ success: true, data: peticiones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error listando peticiones' });
  }
}

async function listarPeticionesProtectora(req, res) {
  try {
    const usuario_id = req.user.id;
    const protectora = await protectoraModel.obtenerPorUsuarioId(usuario_id);
    if (!protectora) {
      return res.status(404).json({ success: false, message: 'Protectora no encontrada' });
    }
    const peticiones = await peticionModel.obtenerPorProtectora(protectora.id);
    res.status(200).json({ success: true, data: peticiones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error listando peticiones' });
  }
}

async function actualizarPeticion(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['aprobada', 'rechazada'].includes(estado)) {
      return res.status(400).json({ success: false, message: 'Estado no valido' });
    }

    const peticion = await peticionModel.obtenerPorId(id);
    if (!peticion) {
      return res.status(404).json({ success: false, message: 'Peticion no encontrada' });
    }

    await peticionModel.actualizarEstado(id, estado);

    if (estado === 'aprobada') {
      await animalModel.actualizarEstado(peticion.animal_id, 'adoptado');
    }

    res.status(200).json({ success: true, message: 'Peticion actualizada' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error actualizando peticion' });
  }
}

async function cancelarPeticion(req, res) {
  try {
    const { id } = req.params;
    await peticionModel.eliminar(id);
    res.status(200).json({ success: true, message: 'Peticion cancelada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error cancelando peticion' });
  }
}

module.exports = { crearPeticion, comprobarPeticion, listarPeticionesUsuario, listarPeticionesProtectora, actualizarPeticion, cancelarPeticion };
