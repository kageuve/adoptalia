const express = require('express');
const router = express.Router();
const favoritoController = require('../controllers/favoritoController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, favoritoController.listarFavoritos);
router.post('/', verificarToken, favoritoController.agregarFavorito);
router.delete('/:animal_id', verificarToken, favoritoController.eliminarFavorito);
router.get('/comprobar/:animal_id', verificarToken, favoritoController.comprobarFavorito);

module.exports = router;