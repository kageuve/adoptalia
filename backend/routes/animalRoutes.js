const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { animalPropio } = require('../middlewares/ownership');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');
const { imageUpload } = require('../middlewares/upload');
const uploadImage = imageUpload('imagenes');

// Rutas públicas
router.get('/publicos', animalController.listarAnimalesPublicos);
router.get('/adoptados', animalController.listarAnimalesAdoptados);
router.get('/publico/:id', animalController.obtenerAnimalPublico);

// Rutas protegidas
router.get('/mi-protectora', verificarToken, animalController.listarAnimalesProtectora);
router.get('/', verificarToken, soloProtectora, animalController.listarAnimales);
router.get('/:id', verificarToken, soloProtectora, animalPropio, animalController.obtenerAnimal);

// Crear / modificar / eliminar (solo protectora)
router.post('/', verificarToken, soloProtectora, animalController.crearAnimal);
router.put('/:id', verificarToken, soloProtectora, animalPropio, animalController.actualizarAnimal);
router.delete('/:id', verificarToken, soloProtectora, animalPropio, animalController.eliminarAnimal);
router.post('/:id/imagen', verificarToken, soloProtectora, animalPropio, uploadImage, animalController.subirImagen);

module.exports = router;