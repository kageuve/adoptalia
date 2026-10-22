const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { imageUpload } = require('../middlewares/upload');
const uploadImage = imageUpload('perfiles');

router.get('/impacto', usuarioController.getImpacto);
router.get('/perfil', verificarToken, usuarioController.getPerfil);
router.post('/perfil/imagen', verificarToken, uploadImage, usuarioController.subirImagenPerfil);
router.put('/perfil', verificarToken, usuarioController.actualizarPerfil);

module.exports = router;
