const db = require('../db');

async function crear(datos) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      `INSERT INTO peticion (usuario_id, animal_id, mensaje) VALUES (?, ?, ?)`,
      [datos.usuario_id, datos.animal_id, datos.mensaje || null]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function obtenerPorUsuarioYAnimal(usuario_id, animal_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT id, estado FROM peticion WHERE usuario_id = ? AND animal_id = ?`,
      [usuario_id, animal_id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

async function obtenerPorUsuario(usuario_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        p.id,
        a.nombre AS animal,
        pr.nombre AS protectora,
        p.estado,
        p.creado AS fecha,
        p.mensaje
      FROM peticion p
      JOIN animal a ON p.animal_id = a.id
      JOIN protectora pr ON a.protectora_id = pr.id
      WHERE p.usuario_id = ?
      ORDER BY p.creado DESC
    `, [usuario_id]);
    return rows;
  } finally {
    connection.release();
  }
}

module.exports = { crear, obtenerPorUsuarioYAnimal, obtenerPorUsuario };