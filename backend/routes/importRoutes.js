const express = require('express');
const multer = require('multer');
const importController = require('../controllers/importController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024, files: 1, fields: 10 } });

// Ruta protegida para subir CSV (solo protectoras)
router.post(
  '/subir-csv',
  verificarToken,
  soloProtectora,
  upload.single('archivo'),
  importController.importarCSV
);

module.exports = router;