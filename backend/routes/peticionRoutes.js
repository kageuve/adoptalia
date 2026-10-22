const express = require('express');
const router = express.Router();
const peticionController = require('../controllers/peticionController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');
const { peticionPropia, peticionDeProtectora } = require('../middlewares/ownership');

//POSTS
router.post('/', verificarToken, peticionController.crearPeticion);

//GETS
router.get('/comprobar/:animal_id', verificarToken, peticionController.comprobarPeticion);
router.get('/mis-peticiones', verificarToken, peticionController.listarPeticionesUsuario);
router.get('/protectora', verificarToken, peticionController.listarPeticionesProtectora);

//OTROS
router.put('/marcar-vistas', verificarToken, peticionController.marcarVistas);
router.put('/:id', verificarToken, soloProtectora, peticionDeProtectora, peticionController.actualizarPeticion);
router.delete('/:id', verificarToken, peticionPropia, peticionController.cancelarPeticion);

module.exports = router;