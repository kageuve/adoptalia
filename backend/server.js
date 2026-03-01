const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Importar rutas
const animalRoutes = require('./routes/animalRoutes');

// 🔹 Montar rutas
app.use('/api/animales', animalRoutes);

// Ruta test
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando 🚀" });
});

app.listen(port, () => {
  console.log(`Backend corriendo en el puerto ${port}`);
});