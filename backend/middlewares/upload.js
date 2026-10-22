const multer = require('multer');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { uploadsDir } = require('../config');
const receive = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 10 } }).single('imagen');
function imageExtension(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return '.png';
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return '.jpg';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return '.webp';
  return null;
}
function imageUpload(subdir) {
  return (req, res, next) => receive(req, res, async err => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ message: 'No se recibió imagen' });
    const extension = imageExtension(req.file.buffer);
    if (!extension) return res.status(400).json({ message: 'Solo se aceptan imágenes JPEG, PNG o WebP' });
    try {
      const filename = randomUUID() + extension;
      await fs.writeFile(path.join(uploadsDir, subdir, filename), req.file.buffer, { flag: 'wx', mode: 0o644 });
      delete req.file.buffer;
      req.file.filename = filename;
      next();
    } catch (error) { next(error); }
  });
}
module.exports = { imageUpload, imageExtension };
