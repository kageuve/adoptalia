function validPassword(value) {
  return typeof value === 'string' && value.length >= 10 && Buffer.byteLength(value, 'utf8') <= 72;
}
function validEmail(value) {
  return typeof value === 'string' && value.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
module.exports = { validPassword, validEmail };
