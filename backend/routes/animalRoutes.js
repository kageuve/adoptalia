const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/imagenes/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Rutas públicas
router.get('/publicos', animalController.listarAnimalesPublicos);
router.get('/adoptados', animalController.listarAnimalesAdoptados);
router.get('/publico/:id', animalController.obtenerAnimalPublico);

// Rutas protegidas
router.get('/mi-protectora', verificarToken, animalController.listarAnimalesProtectora);
router.get('/', verificarToken, animalController.listarAnimales);
router.get('/:id', verificarToken, animalController.obtenerAnimal);

// Crear / modificar / eliminar (solo protectora)
router.post('/', verificarToken, soloProtectora, animalController.crearAnimal);
router.put('/:id', verificarToken, soloProtectora, animalController.actualizarAnimal);
router.delete('/:id', verificarToken, soloProtectora, animalController.eliminarAnimal);
router.post('/:id/imagen', verificarToken, soloProtectora, upload.single('imagen'), animalController.subirImagen);

module.exports = router;