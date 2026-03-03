const express = require('express');
const multer = require('multer');
const path = require('path');
const importController = require('../controllers/importController');
const { verificarToken, soloProtectora } = require('../middlewares/authMiddleware');

const router = express.Router();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// Ruta protegida para subir CSV (solo protectoras)
router.post(
  '/subir-csv',
  verificarToken,
  soloProtectora,
  upload.single('archivo'),
  importController.importarCSV
);

module.exports = router;