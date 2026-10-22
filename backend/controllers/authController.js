const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { validPassword, validEmail } = require('../validation');

const { jwtSecret: SECRET } = require('../config');

// Registro
async function register(req, res) {
  try {
    const { email, password, rol, nombre } = req.body;

    if (!validEmail(email) || !validPassword(password) || rol !== 'usuario') {
      return res.status(400).json({ message: 'Datos no válidos; las contraseñas nuevas requieren al menos 10 caracteres' });
    }

    const existe = await userModel.obtenerPorEmail(email);
    if (existe) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const userId = await userModel.crearUsuario(email, hash, rol, nombre);

    res.status(201).json({
      message: 'Usuario creado correctamente',
      id: userId
    });

  } catch (error) {
    res.status(500).json({ message: 'No se pudo completar la operación' });
  }
}

// Login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!validEmail(email) || typeof password !== 'string' || Buffer.byteLength(password) > 72) return res.status(400).json({ message: 'Credenciales no válidas' });
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
      email: usuario.email,
      imagen: usuario.imagen || null
    });

  } catch (error) {
    res.status(500).json({ message: 'No se pudo completar la operación' });
  }
}

async function cambiarPassword(req, res) {
  try {
    const { passwordActual, passwordNuevo } = req.body;
    if (typeof passwordActual !== 'string' || !validPassword(passwordNuevo)) {
      return res.status(400).json({ success: false, message: 'Datos no válidos; las contraseñas nuevas requieren al menos 10 caracteres' });
    }
    const usuario = await userModel.obtenerPasswordPorId(req.user.id);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const valido = await bcrypt.compare(passwordActual, usuario.password);
    if (!valido) return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });

    const hash = await bcrypt.hash(passwordNuevo, 10);
    await userModel.actualizarPassword(req.user.id, hash);

    res.json({ success: true, message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'No se pudo completar la operación' });
  }
}

module.exports = {
  register,
  login,
  cambiarPassword
};