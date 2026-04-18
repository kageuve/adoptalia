const db = require('../db');

async function agregar(usuario_id, animal_id) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      `INSERT INTO favorito (usuario_id, animal_id) VALUES (?, ?)`,
      [usuario_id, animal_id]
    );
  } finally {
    connection.release();
  }
}

async function eliminar(usuario_id, animal_id) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      `DELETE FROM favorito WHERE usuario_id = ? AND animal_id = ?`,
      [usuario_id, animal_id]
    );
  } finally {
    connection.release();
  }
}

async function obtenerPorUsuario(usuario_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        a.id,
        a.nombre,
        CONCAT(UPPER(SUBSTRING(a.especie, 1, 1)), LOWER(SUBSTRING(a.especie, 2))) AS especie,
        a.raza,
        CONCAT(UPPER(SUBSTRING(a.tamano, 1, 1)), LOWER(SUBSTRING(a.tamano, 2))) AS tamano,
        p.ciudad AS provincia,
        a.imagen_url AS imagen
      FROM favorito f
      JOIN animal a ON f.animal_id = a.id
      JOIN protectora p ON a.protectora_id = p.id
      WHERE f.usuario_id = ?
      ORDER BY f.creado DESC
    `, [usuario_id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function comprobar(usuario_id, animal_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT id FROM favorito WHERE usuario_id = ? AND animal_id = ?`,
      [usuario_id, animal_id]
    );
    return rows.length > 0;
  } finally {
    connection.release();
  }
}

module.exports = { agregar, eliminar, obtenerPorUsuario, comprobar };