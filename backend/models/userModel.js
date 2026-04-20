const db = require('../db');

async function obtenerPorEmail(email) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM usuario WHERE email = ?',
      [email]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

async function crearUsuario(email, passwordHash, rol) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      'INSERT INTO usuario (email, password, rol) VALUES (?, ?, ?)',
      [email, passwordHash, rol]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

async function obtenerPorId(id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, email, rol, imagen FROM usuario WHERE id = ?',
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

async function actualizarImagen(id, imagen) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE usuario SET imagen = ? WHERE id = ?',
      [imagen, id]
    );
  } finally {
    connection.release();
  }
}

async function obtenerPasswordPorId(id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT password FROM usuario WHERE id = ?', [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

async function actualizarPassword(id, hash) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      'UPDATE usuario SET password = ? WHERE id = ?', [hash, id]
    );
  } finally {
    connection.release();
  }
}

async function contarAdoptantes() {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT COUNT(*) AS users
       FROM usuario
       WHERE rol = 'usuario'`
    );
    return rows[0].users;
  } finally {
    connection.release();
  }
}

module.exports = {
  obtenerPorEmail,
  crearUsuario,
  obtenerPorId,
  obtenerPasswordPorId,
  actualizarImagen,
  actualizarPassword,
  contarAdoptantes
};
