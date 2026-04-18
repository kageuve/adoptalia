const express = require('express');
const router = express.Router();
const protectoraController = require('../controllers/protectoraController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/registrar-protectora', protectoraController.registrarProtectora);
router.get('/publicas', protectoraController.listarProtectoras);
router.get('/mi-protectora', verificarToken, protectoraController.obtenerMiProtectora);

module.exports = router;