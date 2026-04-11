const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const SECRET = process.env.JWT_SECRET;

// 🔹 Registro
async function register(req, res) {
  try {
    const { email, password, rol } = req.body;

    if (!email || !password || !rol) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    const existe = await userModel.obtenerPorEmail(email);
    if (existe) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const hash = await bcrypt.hash(password, 10);

    const userId = await userModel.crearUsuario(email, hash, rol);

    res.status(201).json({
      message: 'Usuario creado correctamente',
      id: userId
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 🔹 Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await userModel.obtenerPorEmail(email);

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login correcto',
      token,
      rol: usuario.rol,
      email: usuario.email
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login
};