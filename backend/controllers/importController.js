const fs = require('fs');
const csv = require('csv-parser');
const animalModel = require('../models/animalModel');
const protectoraModel = require('../models/protectoraModel');

const { Readable } = require('stream');

async function importarCSV(req, res) {
  try {
    const protectora = await protectoraModel.obtenerPorUsuarioId(req.user.id);

    if (!protectora) {
      return res.status(403).json({ message: "No tienes protectora asociada" });
    }

    const protectoraId = protectora.id;
    const animales = [];

    const stream = Readable.from(req.file.buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => {
        const especie = row.especie?.toLowerCase();
        const genero = row.genero?.toLowerCase();
        const tamano = row.tamano?.toLowerCase();

        if (!row.nombre || !especie || !genero || !tamano) return;

        animales.push({
          protectora_id: protectoraId,
          nombre: row.nombre,
          especie,
          raza: row.raza || null,
          genero,
          tamano,
          fecha_nacimiento: row.fecha_nacimiento || null,
          descripcion: row.descripcion || null
        });
      })
      .on('end', async () => {
        try {
          for (const animal of animales) {
            await animalModel.crear(animal);
          }
          res.json({ message: "Importación completada", insertados: animales.length });
        } catch (error) {
          console.error('Error insertando animales:', error.message);
          res.status(500).json({ message: "Error insertando animales" });
        }
      })
      .on('error', (error) => {
        console.error('Error leyendo CSV:', error.message);
        res.status(500).json({ message: "Error leyendo CSV" });
      });

  } catch (error) {
    console.error('Error importando CSV:', error.message);
    res.status(500).json({ message: "Error procesando CSV" });
  }
}

module.exports = { importarCSV };