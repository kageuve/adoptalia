const db = require('../db');

async function obtenerPorProtectora(protectoraId) {

  const connection = await db.getConnection();

  try {
    const [animales] = await connection.execute(
      `SELECT id, nombre, tipo, estado
       FROM animal
       WHERE protectora_id = ?
       ORDER BY creado DESC`,
      [protectoraId]
    );

    return animales;

  } finally {
    connection.release();
  }
}

async function insertarMultiples(valores) {

  const connection = await db.getConnection();

  try {

    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO animal
       (protectora_id, local_id, nombre, tipo, especie, genero, tamano,
        fecha_nacimiento, descripcion, chip, estado)
       VALUES ?`,
      [valores]
    );

    await connection.commit();

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Obtener por ID
async function obtenerPorId(id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM animal WHERE id = ?`,
      [id]
    );
    return rows[0];
  } finally {
    connection.release();
  }
}

// Crear un animal nuevo.
async function crear(datos) {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      `INSERT INTO animal 
       (protectora_id, nombre, especie, raza, genero, tamano, fecha_nacimiento, descripcion, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        datos.protectora_id,
        datos.nombre,
        datos.especie.toLowerCase(),
        datos.raza || null,
        datos.genero.toLowerCase(),
        datos.tamano.toLowerCase(),
        datos.fecha_nacimiento || null,
        datos.descripcion || null,
        datos.estado || 'disponible'
      ]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
}

// Actualizar datos de un animal
async function actualizar(id, datos) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      `UPDATE animal 
       SET nombre = ?, especie = ?, genero = ?, tamano = ?, estado = ?, fecha_nacimiento = ?, descripcion = ?
       WHERE id = ?`,
      [
        datos.nombre,
        datos.especie.toLowerCase(),
        datos.genero.toLowerCase(),
        datos.tamano.toLowerCase(),
        datos.estado,
        datos.fecha_nacimiento || null,
        datos.descripcion || null,
        id
      ]
    );
  } finally {
    connection.release();
  }
}

// Eliminar un animal
const fs = require('fs');
const path = require('path');

async function eliminar(id) {
  const connection = await db.getConnection();
  try {
    // Obtener imagen antes de eliminar
    const [rows] = await connection.execute(
      `SELECT imagen_url FROM animal WHERE id = ?`, [id]
    );

    await connection.execute(
      `DELETE FROM animal WHERE id = ?`, [id]
    );

    // Borrar imagen si existe
    if (rows[0]?.imagen_url) {
      const filename = path.basename(rows[0].imagen_url);
      const filePath = path.join(__dirname, '../public/uploads/imagenes', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

  } finally {
    connection.release();
  }
}

// ANIMALES DISPONIBLES
async function obtenerDisponibles() {
  const connection = await db.getConnection();
  try {
   const [animales] = await connection.execute(`
    SELECT 
      a.id,
      a.nombre,
      CONCAT(UPPER(SUBSTRING(a.especie, 1, 1)), LOWER(SUBSTRING(a.especie, 2))) AS especie,
      a.raza,
      TIMESTAMPDIFF(YEAR, a.fecha_nacimiento, CURDATE()) AS edad,
      CONCAT(UPPER(SUBSTRING(a.tamano, 1, 1)), LOWER(SUBSTRING(a.tamano, 2))) AS tamano,
      p.ciudad AS provincia,
      a.imagen_url AS imagen
    FROM animal a
    JOIN protectora p ON a.protectora_id = p.id
    WHERE a.estado = 'disponible'
    ORDER BY a.creado DESC
    `);
    return animales;
  } finally {
    connection.release();
  }
}
//Obtiene un animal por id de manera publica con datos de protectora.
async function obtenerPublicoPorId(id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        a.id,
        a.nombre,
        CONCAT(UPPER(SUBSTRING(a.especie, 1, 1)), LOWER(SUBSTRING(a.especie, 2))) AS especie,
        a.raza,
        TIMESTAMPDIFF(YEAR, a.fecha_nacimiento, CURDATE()) AS edad,
        CONCAT(UPPER(SUBSTRING(a.tamano, 1, 1)), LOWER(SUBSTRING(a.tamano, 2))) AS tamano,
        a.genero,
        a.descripcion,
        a.estado,
        p.ciudad AS provincia,
        a.imagen_url AS imagen
      FROM animal a
      JOIN protectora p ON a.protectora_id = p.id
      WHERE a.id = ?
    `, [id]);
    return rows[0];
  } finally {
    connection.release();
  }
}

async function obtenerPorProtectoraId(protectora_id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        a.id,
        a.nombre,
        CONCAT(UPPER(SUBSTRING(a.especie, 1, 1)), LOWER(SUBSTRING(a.especie, 2))) AS especie,
        a.genero,
        CONCAT(UPPER(SUBSTRING(a.tamano, 1, 1)), LOWER(SUBSTRING(a.tamano, 2))) AS tamano,
        a.estado,
        a.fecha_nacimiento,
        a.descripcion,
        a.imagen_url
      FROM animal a
      WHERE a.protectora_id = ?
      ORDER BY a.creado DESC
    `, [protectora_id]);
    return rows;
  } finally {
    connection.release();
  }
}

async function actualizarImagen(id, imagen_url) {
  const connection = await db.getConnection();
  try {
    await connection.execute(
      `UPDATE animal SET imagen_url = ? WHERE id = ?`,
      [imagen_url, id]
    );
  } finally {
    connection.release();
  }
}

async function obtenerAdoptados() {
  const connection = await db.getConnection();
  try {
    const [animales] = await connection.execute(`
      SELECT
        a.id,
        a.nombre,
        CONCAT(UPPER(SUBSTRING(a.especie, 1, 1)), LOWER(SUBSTRING(a.especie, 2))) AS especie,
        a.raza,
        TIMESTAMPDIFF(YEAR, a.fecha_nacimiento, CURDATE()) AS edad,
        CONCAT(UPPER(SUBSTRING(a.tamano, 1, 1)), LOWER(SUBSTRING(a.tamano, 2))) AS tamano,
        p.ciudad AS provincia,
        p.nombre AS protectora,
        a.imagen_url AS imagen
      FROM animal a
      JOIN protectora p ON a.protectora_id = p.id
      WHERE a.estado = 'adoptado'
      ORDER BY a.actualizado DESC
    `);
    return animales;
  } finally {
    connection.release();
  }
}

module.exports = {
  obtenerDisponibles,
  obtenerAdoptados,
  obtenerPorProtectora,
  obtenerPorProtectoraId,
  obtenerPublicoPorId,
  insertarMultiples,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  actualizarImagen
};
