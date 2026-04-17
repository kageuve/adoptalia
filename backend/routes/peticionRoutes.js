const express = require('express');
const router = express.Router();
const peticionController = require('../controllers/peticionController');
const { verificarToken } = require('../middlewares/authMiddleware');

//POSTS
router.post('/', verificarToken, peticionController.crearPeticion);

//GETS
router.get('/comprobar/:animal_id', verificarToken, peticionController.comprobarPeticion);
router.get('/mis-peticiones', verificarToken, peticionController.listarPeticionesUsuario);
router.get('/protectora', verificarToken, peticionController.listarPeticionesProtectora);

//PUTS
router.put('/:id', verificarToken, peticionController.actualizarPeticion);

module.exports = router;