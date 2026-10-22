const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.JWT_SECRET ||= 'unit-test-secret-not-for-production-12345678';
process.env.DB_USER ||= 'test';
process.env.DB_PASSWORD ||= 'test';
process.env.DB_NAME ||= 'test';
const { validEmail, validPassword } = require('../validation');
const { imageExtension } = require('../middlewares/upload');
test('password policy handles types and bcrypt byte limit', () => {
  assert.equal(validPassword('short'), false);
  assert.equal(validPassword({}), false);
  assert.equal(validPassword('a'.repeat(73)), false);
  assert.equal(validPassword('á'.repeat(37)), false);
  assert.equal(validPassword('long-enough-password'), true);
});
test('email input cannot be an SQL or query object', () => {
  assert.equal(validEmail({}), false);
  assert.equal(validEmail('not-an-email'), false);
  assert.equal(validEmail('test@example.invalid'), true);
});
test('image type uses signatures, not filenames or MIME headers', () => {
  assert.equal(imageExtension(Buffer.from('<svg onload="alert(1)">')), null);
  assert.equal(imageExtension(Buffer.from('not a jpeg')), null);
  assert.equal(imageExtension(Buffer.from([137,80,78,71,13,10,26,10])), '.png');
  assert.equal(imageExtension(Buffer.from([255,216,255])), '.jpg');
  assert.equal(imageExtension(Buffer.from('RIFF0000WEBP')), '.webp');
});
