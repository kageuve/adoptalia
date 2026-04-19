const db = require('../db');
const bcrypt = require('bcryptjs');

async function crearProtectora(datos) {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    // Hashear contraseña
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
        datos.direccion || null,
        datos.web || null,
        datos.descripcion || null
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

// Obtiene todas las protectoras de forma pública
async function obtenerTodas() {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT id, nombre, ciudad, descripcion, telefono, email, imagen
       FROM protectora
       WHERE verificado = 1
       ORDER BY nombre ASC`
    );
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = {
  crearProtectora,
  obtenerPorUsuarioId,
  obtenerTodas
};