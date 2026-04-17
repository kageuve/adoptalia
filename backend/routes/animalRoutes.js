const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/publicos', animalController.listarAnimalesPublicos);
router.get('/publico/:id', animalController.obtenerAnimalPublico);

// Rutas protegidas
router.get('/mi-protectora', verificarToken, animalController.listarAnimalesProtectora);
router.get('/', verificarToken, animalController.listarAnimales);
router.get('/:id', verificarToken, animalController.obtenerAnimal);

// Crear / modificar / eliminar (solo protectora)
router.post('/', verificarToken, soloProtectora, animalController.crearAnimal);
router.put('/:id', verificarToken, soloProtectora, animalController.actualizarAnimal);
router.delete('/:id', verificarToken, soloProtectora, animalController.eliminarAnimal);

module.exports = router;