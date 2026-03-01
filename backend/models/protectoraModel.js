const db = require('../db');

async function crearProtectora(datos) {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    const [usuarioResult] = await connection.execute(
      `INSERT INTO usuario (email, password, rol)
       VALUES (?, ?, 'protectora')`,
      [datos.email, datos.password]
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

module.exports = {
  crearProtectora
};