const fs = require('fs');
const csv = require('csv-parser');
const animalModel = require('../models/animalModel');

async function importarCSV(req, res) {

  const rutaArchivo = req.file.path;
  const valores = [];

  fs.createReadStream(rutaArchivo)
    .pipe(csv())
    .on('data', (row) => {

      const tipo = row.tipo?.toLowerCase();
      const genero = row.genero?.toLowerCase();
      const tamano = row.tamano?.toLowerCase();
      const estado = row.estado?.toLowerCase() || 'disponible';

      if (!row.protectora_id || !row.nombre || !tipo || !genero || !tamano)
        return;

      valores.push([
        Number(row.protectora_id),
        row.local_id || null,
        row.nombre,
        tipo,
        row.especie || null,
        genero,
        tamano,
        row.fecha_nacimiento || null,
        row.descripcion || null,
        row.chip || null,
        estado
      ]);

    })
    .on('end', async () => {

      try {

        if (valores.length > 0) {
          await animalModel.insertarMultiples(valores);
        }

        res.send(`Importación completada 🚀 Animales insertados: ${valores.length}`);

      } catch (error) {
        console.error(error);
        res.status(500).send("Error procesando CSV");
      }

    });
}

module.exports = {
  importarCSV
};