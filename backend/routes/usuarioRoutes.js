const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/perfiles/'),
  filename: (req, file, cb) => cb(null, `perfil_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/perfil', verificarToken, usuarioController.getPerfil);
router.post('/perfil/imagen', verificarToken, upload.single('imagen'), usuarioController.subirImagenPerfil);

module.exports = router;
