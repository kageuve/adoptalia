const express = require('express');
const multer = require('multer');
const path = require('path');
const importController = require('../controllers/importController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.post('/subir-csv', upload.single('archivo'), importController.importarCSV);

module.exports = router;