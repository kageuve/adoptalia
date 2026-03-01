require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas
const animalRoutes = require('./routes/animalRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/animales', animalRoutes);
app.use('/api/auth', authRoutes);

// Test
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando 🚀" });
});

app.listen(port, () => {
  console.log(`Backend corriendo en el puerto ${port}`);
});