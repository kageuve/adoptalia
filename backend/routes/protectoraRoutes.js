const express = require('express');
const router = express.Router();
const protectoraController = require('../controllers/protectoraController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');
const { imageUpload } = require('../middlewares/upload');
const uploadImage = imageUpload('perfiles');

router.post('/registrar-protectora', protectoraController.registrarProtectora);
router.get('/publicas', protectoraController.listarProtectoras);
router.get('/mi-protectora', verificarToken, protectoraController.obtenerMiProtectora);
router.post('/mi-protectora/imagen', verificarToken, soloProtectora, uploadImage, protectoraController.subirImagenProtectora);

module.exports = router;