const express = require('express');
const router = express.Router();
const protectoraController = require('../controllers/protectoraController');

router.post('/registrar-protectora', protectoraController.registrarProtectora);
router.get('/publicas', protectoraController.listarProtectoras);

module.exports = router;