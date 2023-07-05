const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

function signToken(payload) {
  return jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
}

function checkToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  signToken,
  checkToken,
};
