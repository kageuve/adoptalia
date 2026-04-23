require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Importar rutas
const animalRoutes = require('./routes/animalRoutes');
const authRoutes = require('./routes/authRoutes');
const importRoutes = require('./routes/importRoutes');
const protectoraRoutes = require('./routes/protectoraRoutes');
const peticionRoutes = require('./routes/peticionRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Montar rutas
app.use('/api/animales', animalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/import', importRoutes);
app.use('/api/protectoras', protectoraRoutes);
app.use('/api/peticiones', peticionRoutes);
app.use('/api/favoritos', favoritoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Ruta test
app.get('/api/test', (req, res) => {
  res.json({ mensaje: "Backend funcionando" });
});

app.listen(port, () => {
  console.log(`Backend corriendo en el puerto ${port}`);
});