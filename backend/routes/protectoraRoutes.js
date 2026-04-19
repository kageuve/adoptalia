const express = require('express');
const router = express.Router();
const protectoraController = require('../controllers/protectoraController');
const { verificarToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/perfiles/'),
  filename: (req, file, cb) => cb(null, `protectora_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/registrar-protectora', protectoraController.registrarProtectora);
router.get('/publicas', protectoraController.listarProtectoras);
router.get('/mi-protectora', verificarToken, protectoraController.obtenerMiProtectora);
router.post('/mi-protectora/imagen', verificarToken, upload.single('imagen'), protectoraController.subirImagenProtectora);

module.exports = router;