const fs = require('fs');
const csv = require('csv-parser');
const animalModel = require('../models/animalModel');
const protectoraModel = require('../models/protectoraModel');

async function importarCSV(req, res) {

  try {

    // 🔐 Obtener protectora asociada al usuario autenticado
    const protectora = await protectoraModel.obtenerPorUsuarioId(req.user.id);

    if (!protectora) {
      return res.status(403).json({ message: "No tienes protectora asociada" });
    }

    const protectoraId = protectora.id;
    const rutaArchivo = req.file.path;
    const valores = [];

    fs.createReadStream(rutaArchivo)
      .pipe(csv())
      .on('data', (row) => {

        const tipo = row.tipo?.toLowerCase();
        const genero = row.genero?.toLowerCase();
        const tamano = row.tamano?.toLowerCase();
        const estado = row.estado?.toLowerCase() || 'disponible';

        if (!row.nombre || !tipo || !genero || !tamano)
          return;

        valores.push([
          protectoraId,   
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

        if (valores.length > 0) {
          await animalModel.insertarMultiples(valores);
        }

        res.json({
          message: "Importación completada",
          insertados: valores.length
        });

      });

  } catch (error) {
  res.status(500).json({ message: "Error procesando CSV" });
}
}

module.exports = {
  importarCSV
};