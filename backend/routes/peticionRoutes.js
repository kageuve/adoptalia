const express = require('express');
const router = express.Router();
const peticionController = require('../controllers/peticionController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, peticionController.crearPeticion);
router.get('/comprobar/:animal_id', verificarToken, peticionController.comprobarPeticion);
router.get('/mis-peticiones', verificarToken, peticionController.listarPeticionesUsuario);

module.exports = router;