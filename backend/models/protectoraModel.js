const db = require('../db');
const bcrypt = require('bcryptjs');

async function crearProtectora(datos) {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    // 🔐 Hashear contraseña
    const hash = await bcrypt.hash(datos.password, 10);

    const [usuarioResult] = await connection.execute(
      `INSERT INTO usuario (email, password, rol)
       VALUES (?, ?, 'protectora')`,
      [datos.email, hash]
    );

    const usuarioId = usuarioResult.insertId;

    await connection.execute(
      `INSERT INTO protectora 
       (usuario_id, nombre, cif, ciudad, direccion, web, descripcion)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        datos.nombre,
        datos.cif,
        datos.ciudad,
        datos.direccion,
        datos.web,
        datos.descripcion
      ]
    );

    await connection.commit();

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// 🔹 NUEVA FUNCIÓN
async function obtenerPorUsuarioId(usuarioId) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM protectora WHERE usuario_id = ?',
      [usuarioId]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

module.exports = {
  crearProtectora,
  obtenerPorUsuarioId
};