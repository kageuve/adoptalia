const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');

// Ver animales Ruta pública — sin verificarToken
router.get('/publicos', animalController.listarAnimalesPublicos);

// 🔹 Ver animales (usuario autenticado con token)
router.get('/', verificarToken, animalController.listarAnimales);
router.get('/:id', verificarToken, animalController.obtenerAnimal);

// ...

// 🔹 Crear / modificar / eliminar (solo protectora)
router.post('/', verificarToken, soloProtectora, animalController.crearAnimal);
router.put('/:id', verificarToken, soloProtectora, animalController.actualizarAnimal);
router.delete('/:id', verificarToken, soloProtectora, animalController.eliminarAnimal);

module.exports = router;