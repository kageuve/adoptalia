const animalModel = require('../models/animalModel');

//  LISTAR
async function listarAnimales(req, res) {
  try {
    const protectoraId = req.query.protectora_id;

    if (!protectoraId) {
      return res.status(400).json({
        success: false,
        message: "Falta protectora_id"
      });
    }

    const animales = await animalModel.obtenerPorProtectora(protectoraId);

    res.status(200).json({
      success: true,
      data: animales
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error listando animales"
    });
  }
}

//  OBTENER UNO
async function obtenerAnimal(req, res) {
  try {
    const animal = await animalModel.obtenerPorId(req.params.id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: animal
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error obteniendo animal"
    });
  }
}

//  CREAR
async function crearAnimal(req, res) {
  try {
    const id = await animalModel.crear(req.body);

    res.status(201).json({
      success: true,
      message: "Animal creado",
      id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creando animal"
    });
  }
}

//  ACTUALIZAR
async function actualizarAnimal(req, res) {
  try {
    await animalModel.actualizar(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Animal actualizado"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error actualizando animal"
    });
  }
}

//  ELIMINAR
async function eliminarAnimal(req, res) {
  try {
    await animalModel.eliminar(req.params.id);

    res.status(200).json({
      success: true,
      message: "Animal eliminado"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error eliminando animal"
    });
  }
}

//ListarAnimales sin token
async function listarAnimalesPublicos(req, res) {
  try {
    const animales = await animalModel.obtenerDisponibles();
    res.status(200).json({ success: true, data: animales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error listando animales" });
  }
}
//Obtiene un animal sin token
async function obtenerAnimalPublico(req, res) {
  try {
    const animal = await animalModel.obtenerPublicoPorId(req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal no encontrado' });
    }
    res.status(200).json({ success: true, data: animal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error obteniendo animal' });
  }
}

module.exports = {
  listarAnimalesPublicos,
  obtenerAnimalPublico,
  listarAnimales,
  obtenerAnimal,
  crearAnimal,
  actualizarAnimal,
  eliminarAnimal
};